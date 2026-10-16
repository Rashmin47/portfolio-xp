"use client";

import { Component, useRef, useEffect, useMemo, useCallback, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePathname, useRouter } from "next/navigation";
import { defaultPose, routePoses } from "@/data/hotspots";
import { roadmap } from "@/data/roadmap";
import { siteConfig } from "@/data/site";
import { visibleItems } from "@/lib/content";
import { nepalPhase } from "@/lib/nepal-time";

// ─── Design token palette & material tones ────────────────────────────────────
const C = {
  ink:         "#0E1726",
  paper:       "#F4F6FB",
  cobalt:      "#2F5BEA",
  sky:         "#62C0FF",
  signal:      "#F2C81F",
  board:       "#2EA84B",
  screen:      "#0A2540",
  screenGlow:  "#194780",
  night:       "#0B1220",
  nightSurf:   "#131D33",
  muted:       "#5B6578",

  // Room tones — a dim studio, lifted just enough that the back wall, floor
  // and window read as a room instead of falling away to pure black. Still
  // well below the desk in value, so the workspace stays the focal plane.
  wall:        "#212C40",
  wallTrim:    "#1A2334",
  woodFloor:   "#31251A",
  floorPlank:  "#3C2D20",
  rug:         "#1D2A45",

  // Darker, desaturated desk wood (palette-adjacent: ink / cobalt / signal)
  deskTop:     "#5B4839",
  deskEdge:    "#3E3128",
  deskLeg:     "#151C28",
  deskMat:     "#182233",
  matStitch:   "#F2C81F",

  macAluminum: "#D6DBE4",
  macDark:     "#2D3545",
  macKeyboard: "#1A2231",

  piPcb:       "#207D3E",
  piChip:      "#181E26",
  piSilver:    "#CBD5E1",
  piGold:      "#D4AF37",

  coasterCork: "#A2744B",

  lampBody:    "#2F5BEA",
  lampBrass:   "#F2C81F",
  lampLight:   "#FFF2D1",
  lampCone:    "#FFE2B0",
  rimCobalt:   "#3B6BFF",
  poolWarm:    "#FFD9A0",

  wbFrame:     "#334155",
  boardFace:   "#0E1A2E",

  book1:       "#2F5BEA",
  book2:       "#2EA84B",
  book3:       "#F5922F",
  bookPages:   "#F8FAFC",

  plantPot:    "#B45309",
  plantSoil:   "#271A12",
  plantLeaf1:  "#2EA84B",
  plantLeaf2:  "#23823A",

  phoneBody:   "#1E293B",
  phoneScreen: "#0F172A",
  phoneGlow:   "#38BDF8",
};

// ─── Material caching helper ──────────────────────────────────────────────────
function useMat(color, opts = {}) {
  return useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: opts.roughness ?? 0.7,
        metalness: opts.metalness ?? 0.0,
        emissive: opts.emissive ? new THREE.Color(opts.emissive) : undefined,
        emissiveIntensity: opts.emissiveIntensity ?? 0,
        side: opts.side ?? THREE.FrontSide,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [color, opts.roughness, opts.metalness, opts.emissive, opts.emissiveIntensity, opts.side]
  );
}

// ─── Procedural textures & Kathmandu light phase (no external assets) ─────────
// Radial falloff texture, shared by the desk light pool and the screen glow planes.
let _radialTex = null;
function radialTexture() {
  if (_radialTex) return _radialTex;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.45, "rgba(255,255,255,0.38)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  _radialTex = new THREE.CanvasTexture(canvas);
  _radialTex.colorSpace = THREE.SRGBColorSpace;
  return _radialTex;
}

// Kathmandu day / evening / night phase comes from lib/nepal-time.js
const PHASE_TINTS = {
  day: {
    sky: ["#5FA8E8", "#9CCBF2", "#DCEAF7"],
    horizon: "#FFFFFF",
    far: "#8FA8C4",
    mid: "#6D86A6",
    near: "#4E6683",
  },
  evening: {
    sky: ["#21365F", "#5B5C86", "#E08A4B"],
    horizon: "#FFC48A",
    far: "#4A5478",
    mid: "#333C5E",
    near: "#1F2740",
  },
  night: {
    sky: ["#050A17", "#0C1730", "#20304F"],
    horizon: "#7FA8D8",
    far: "#16213A",
    mid: "#0F1830",
    near: "#080E1F",
  },
};

function hexToRgba(hex, alpha) {
  const int = parseInt(hex.slice(1), 16);
  return `rgba(${(int >> 16) & 255},${(int >> 8) & 255},${int & 255},${alpha})`;
}

// Dusk gradient pane for the studio window, tinted by the current phase.
function duskTexture(phase) {
  const tint = PHASE_TINTS[phase] || PHASE_TINTS.evening;
  const w = 256;
  const h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");

  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, tint.sky[0]);
  sky.addColorStop(0.58, tint.sky[1]);
  sky.addColorStop(1, tint.sky[2]);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const glow = ctx.createRadialGradient(w * 0.5, h * 0.88, 0, w * 0.5, h * 0.88, h * 0.5);
  glow.addColorStop(0, hexToRgba(tint.horizon, 0.3));
  glow.addColorStop(1, hexToRgba(tint.horizon, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ─── Now / Next / Later wall board, projected from data/roadmap.js ───────────
const BOARD_COLUMNS = [
  { key: "now",   label: "NOW",   accent: C.signal },
  { key: "next",  label: "NEXT",  accent: C.cobalt },
  { key: "later", label: "LATER", accent: C.sky },
];

function makeBoardTexture(columns) {
  const W = 1024;
  const H = 560;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = C.boardFace;
  ctx.fillRect(0, 0, W, H);

  const colW = W / columns.length;
  const padX = 42;
  const textW = colW - padX * 2;

  const fit = (text, maxWidth) => {
    if (ctx.measureText(text).width <= maxWidth) return text;
    let out = text;
    while (out.length > 1 && ctx.measureText(`${out}…`).width > maxWidth) out = out.slice(0, -1);
    return `${out.replace(/\s+$/, "")}…`;
  };

  ctx.textBaseline = "top";

  columns.forEach((col, i) => {
    const x = i * colW + padX;

    ctx.font = "700 44px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.fillStyle = col.accent;
    ctx.fillText(col.label, x, 42);

    ctx.globalAlpha = 0.85;
    ctx.fillRect(x, 104, textW, 5);
    ctx.globalAlpha = 1;

    ctx.font = '600 30px "Instrument Sans", system-ui, -apple-system, sans-serif';
    col.titles.forEach((title, row) => {
      const y = 152 + row * 104;
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = col.accent;
      ctx.fillRect(x, y + 11, 10, 10);
      ctx.globalAlpha = 1;
      ctx.fillStyle = C.paper;
      ctx.fillText(fit(title, textW - 30), x + 28, y);
    });
  });

  ctx.strokeStyle = "rgba(244,246,251,0.10)";
  ctx.lineWidth = 2;
  for (let i = 1; i < columns.length; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * colW, 34);
    ctx.lineTo(i * colW, H - 34);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// ─── Neon wall sign texture (static, no animation) ───────────────────────────
function makeSignTexture(word) {
  const W = 1024;
  const H = 226;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = C.night;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(242,200,31,0.22)";
  ctx.lineWidth = 3;
  ctx.strokeRect(14, 14, W - 28, H - 28);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 112px ui-monospace, SFMono-Regular, Menlo, monospace";

  // Wide soft halo, then a warm crisp core
  ctx.shadowColor = C.signal;
  ctx.shadowBlur = 48;
  ctx.fillStyle = C.signal;
  ctx.fillText(word, W / 2, H / 2);
  ctx.shadowBlur = 12;
  ctx.fillStyle = "#FFF6D8";
  ctx.fillText(word, W / 2, H / 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// ─── Laptop screen texture: real content from data/site.js ───────────────────
function makeScreenTexture() {
  const W = 512;
  const H = 300;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = C.screen;
  ctx.fillRect(0, 0, W, H);
  ctx.font = "500 26px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.textBaseline = "top";

  const lines = [
    { text: "$ whoami", tone: C.sky },
    { text: siteConfig.name, tone: C.paper },
    { text: "$ role", tone: C.sky },
    { text: siteConfig.role, tone: C.paper },
    { text: "$ location", tone: C.sky },
    { text: siteConfig.location, tone: C.paper },
  ];

  lines.forEach((line, i) => {
    ctx.fillStyle = line.tone;
    ctx.globalAlpha = line.tone === C.paper ? 0.92 : 1;
    ctx.fillText(line.text, 22, 30 + i * 40, W - 44);
  });

  ctx.globalAlpha = 1;
  ctx.fillStyle = C.signal;
  ctx.fillRect(22, 30 + lines.length * 40 - 6, 14, 26);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// ─── Faint additive glow plane (screen halos, wall panel, light pool) ────────
function GlowPanel({ size, position, rotation, color, opacity = 0.12 }) {
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: radialTexture(),
        color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
        side: THREE.DoubleSide,
      }),
    [color, opacity]
  );

  return (
    <mesh position={position} rotation={rotation} material={mat} renderOrder={2}>
      <planeGeometry args={size} />
    </mesh>
  );
}

// ─── Warm, rich atmospheric lighting (Jesse Zhou inspired) ────────────────────
function SceneLighting() {
  return (
    <>
      {/* Soft warm hemisphere ambient — trimmed slightly so walls and floor fall back */}
      <hemisphereLight
        color="#FFF6E8"
        groundColor="#2A1E18"
        intensity={1.65}
      />

      {/* Main sunbeam / studio directional key light */}
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.9}
        color="#FFEAD1"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Cool sky fill from left window */}
      <directionalLight
        position={[-5, 4, 1]}
        intensity={0.85}
        color="#93C5FD"
      />

      {/* Cozy warm desk lamp light pooling directly on the workspace.
          Kept modest: the lamp sits close to the notebook, so a hot value
          blows the paper out to pure white (and then blooms). */}
      <pointLight
        position={[-1.2, 1.4, 0.2]}
        color="#FFE4A0"
        intensity={0.95}
        distance={3.5}
        decay={2}
      />

      {/* Warm soft-coned SpotLight from the lamp shade — keeps the desk bright
          while the surrounding room ambient comes down. No shadow maps. */}
      <spotLight
        position={[-1.28, 1.55, -0.14]}
        target-position={[-0.5, 0.77, 0.06]}
        color={C.lampCone}
        intensity={1.05}
        angle={0.62}
        penumbra={1}
        distance={4.5}
        decay={1.6}
      />

      {/* Cool cobalt rim light from the window side (right) for edge separation */}
      <directionalLight
        position={[3.4, 2.4, -2.2]}
        intensity={0.6}
        color={C.rimCobalt}
      />

      {/* Soft screen glow for the laptop */}
      <pointLight
        position={[-0.05, 1.05, 0.25]}
        color="#62C0FF"
        intensity={0.65}
        distance={1.6}
        decay={2}
      />

      {/* Soft green hardware glow on the Raspberry Pi breadboard — low, so the
          board reads as a lit device rather than a lamp */}
      <pointLight
        position={[1.25, 0.95, 0.1]}
        color="#2EA84B"
        intensity={0.5}
        distance={0.95}
        decay={2}
      />

      {/* Rim light from behind desk for crisp silhouettes */}
      <spotLight
        position={[0, 4, -3.5]}
        target-position={[0, 0.8, 0]}
        color="#62C0FF"
        intensity={1.1}
        angle={Math.PI / 3}
        penumbra={0.6}
      />

      {/* Dark exponential fog — low density, so only the far floor edge and the
          back corners fall away; the desk sits well inside the near range. */}
      <fogExp2 attach="fog" color={C.night} density={0.03} />
    </>
  );
}

// ─── Low-poly Himalayan ridge silhouettes for the studio window ──────────────
function ridgeGeometry(baseY, points) {
  const shape = new THREE.Shape();
  shape.moveTo(-0.9, baseY);
  points.forEach(([x, y]) => shape.lineTo(x, y));
  shape.lineTo(0.9, baseY);
  shape.closePath();
  return new THREE.ShapeGeometry(shape);
}

const RIDGE_FAR = ridgeGeometry(-0.72, [
  [-0.9, -0.24], [-0.58, -0.10], [-0.30, -0.22], [-0.02, -0.04],
  [0.28, -0.18], [0.60, -0.08], [0.9, -0.26],
]);
const RIDGE_MID = ridgeGeometry(-0.72, [
  [-0.9, -0.36], [-0.62, -0.18], [-0.34, -0.30], [-0.06, -0.12],
  [0.24, -0.26], [0.56, -0.16], [0.9, -0.34],
]);
const RIDGE_NEAR = ridgeGeometry(-0.72, [
  [-0.9, -0.44], [-0.60, -0.30], [-0.30, -0.40], [-0.02, -0.28],
  [0.30, -0.38], [0.62, -0.30], [0.9, -0.46],
]);

// ─── Studio Room (Walls, Floorboards, Rug, Window) ───────────────────────────
function Room() {
  const wallMat    = useMat(C.wall,     { roughness: 0.9 });
  const trimMat    = useMat(C.wallTrim, { roughness: 0.8 });
  const floorMat   = useMat(C.woodFloor, { roughness: 0.6 });
  const rugMat     = useMat(C.rug,      { roughness: 0.95 });

  // Faint projected floor circle, replacing the old blue rug ring (<15% opacity)
  const floorRingMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: C.cobalt,
        transparent: true,
        opacity: 0.08,
        depthWrite: false,
        fog: false,
      }),
    []
  );

  // Window materials, tinted by the current Kathmandu day / evening / night phase
  const phase       = useMemo(() => nepalPhase(), []);
  const tint        = PHASE_TINTS[phase] || PHASE_TINTS.evening;
  const winFrameMat = useMat(C.wbFrame, { roughness: 0.5 });
  const skyTex      = useMemo(() => duskTexture(phase), [phase]);
  const skyMat      = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: skyTex,
        emissive: new THREE.Color("#FFFFFF"),
        emissiveMap: skyTex,
        emissiveIntensity: 0.9,
        roughness: 1,
      }),
    [skyTex]
  );
  const rangeMats   = useMemo(
    () => ({
      far:  new THREE.MeshBasicMaterial({ color: tint.far }),
      mid:  new THREE.MeshBasicMaterial({ color: tint.mid }),
      near: new THREE.MeshBasicMaterial({ color: tint.near }),
    }),
    [tint]
  );

  useEffect(() => () => skyTex.dispose(), [skyTex]);

  return (
    <group name="obj_room">
      {/* Soft warm wall wash behind the desk: separates the workspace from the
          back wall and gives the room depth without lighting the whole frame */}
      <GlowPanel
        position={[0.1, 1.55, -2.57]}
        size={[7.2, 3.8]}
        color={C.poolWarm}
        opacity={0.07}
      />

      {/* Back main wall */}
      <mesh position={[0, 2.5, -2.6]} material={wallMat}>
        <planeGeometry args={[14, 7]} />
      </mesh>

      {/* Architectural baseboard trim */}
      <mesh position={[0, 0.1, -2.58]} material={trimMat}>
        <boxGeometry args={[14, 0.2, 0.04]} />
      </mesh>

      {/* Left studio wall */}
      <mesh position={[-5.2, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} material={wallMat}>
        <planeGeometry args={[10, 7]} />
      </mesh>

      {/* Studio wooden floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} material={floorMat}>
        <planeGeometry args={[14, 12]} />
      </mesh>

      {/* Large circular woven studio rug under desk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0.2]} material={rugMat}>
        <circleGeometry args={[2.4, 48]} />
      </mesh>
      {/* Faint projected circle on the rug (replaces the old blue rug ring) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0.2]} material={floorRingMat}>
        <ringGeometry args={[2.35, 2.4, 48]} />
      </mesh>

      {/* ── Studio Window: lit dusk sky over layered Himalayan silhouettes ── */}
      <group position={[2.0, 2.2, -2.55]}>
        {/* Self-lit dusk gradient pane, tinted by the Kathmandu phase */}
        <mesh position={[0, 0, 0.008]} material={skyMat}>
          <planeGeometry args={[1.8, 1.4]} />
        </mesh>
        {/* 3 layered low-poly Himalayan ranges (far → near) */}
        <mesh position={[0, 0, 0.014]} geometry={RIDGE_FAR}  material={rangeMats.far} />
        <mesh position={[0, 0, 0.019]} geometry={RIDGE_MID}  material={rangeMats.mid} />
        <mesh position={[0, 0, 0.024]} geometry={RIDGE_NEAR} material={rangeMats.near} />
        {/* Window frame — four bars, so the sky is actually visible through it */}
        <mesh position={[0, 0.71, 0.03]} material={winFrameMat}>
          <boxGeometry args={[1.9, 0.08, 0.05]} />
        </mesh>
        <mesh position={[0, -0.71, 0.03]} material={winFrameMat}>
          <boxGeometry args={[1.9, 0.08, 0.05]} />
        </mesh>
        <mesh position={[-0.91, 0, 0.03]} material={winFrameMat}>
          <boxGeometry args={[0.08, 1.5, 0.05]} />
        </mesh>
        <mesh position={[0.91, 0, 0.03]} material={winFrameMat}>
          <boxGeometry args={[0.08, 1.5, 0.05]} />
        </mesh>
        {/* Window cross dividers */}
        <mesh position={[0, 0, 0.04]} material={winFrameMat}>
          <boxGeometry args={[0.04, 1.4, 0.04]} />
        </mesh>
        <mesh position={[0, 0, 0.04]} material={winFrameMat}>
          <boxGeometry args={[1.8, 0.04, 0.04]} />
        </mesh>
        {/* Window sill */}
        <mesh position={[0, -0.73, 0.08]} material={winFrameMat}>
          <boxGeometry args={[2.05, 0.06, 0.14]} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Desk with Warm Wood Surface & Leather Desk Mat ───────────────────────────
function Desk() {
  const topMat     = useMat(C.deskTop,  { roughness: 0.45, metalness: 0.05 });
  const edgeMat    = useMat(C.deskEdge, { roughness: 0.6 });
  const legMat     = useMat(C.deskLeg,  { roughness: 0.4, metalness: 0.3 });
  const matMat     = useMat(C.deskMat,  { roughness: 0.85 });
  const stitchMat  = useMat(C.matStitch,{ roughness: 0.5, emissive: C.signal, emissiveIntensity: 0.15 });

  return (
    <group name="obj_desk">
      {/* Main wooden desk surface */}
      <mesh position={[0, 0.73, 0]} material={topMat}>
        <boxGeometry args={[3.5, 0.07, 1.25]} />
      </mesh>
      {/* Front edge bevel band */}
      <mesh position={[0, 0.73, 0.63]} material={edgeMat}>
        <boxGeometry args={[3.5, 0.07, 0.015]} />
      </mesh>

      {/* Desk legs (sturdy modern trestle/post legs) */}
      {[[-1.6, -0.5], [1.6, -0.5], [-1.6, 0.5], [1.6, 0.5]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.36, z]} material={legMat}>
          <boxGeometry args={[0.07, 0.72, 0.07]} />
        </mesh>
      ))}
      {/* Support cross braces */}
      <mesh position={[0, 0.2, -0.5]} material={legMat}>
        <boxGeometry args={[3.2, 0.04, 0.04]} />
      </mesh>
      <mesh position={[-1.6, 0.2, 0]} material={legMat}>
        <boxGeometry args={[0.04, 0.04, 1.0]} />
      </mesh>
      <mesh position={[1.6, 0.2, 0]} material={legMat}>
        <boxGeometry args={[0.04, 0.04, 1.0]} />
      </mesh>

      {/* Premium leather/felt desk mat */}
      <mesh position={[-0.05, 0.768, 0.1]} material={matMat}>
        <boxGeometry args={[1.5, 0.005, 0.65]} />
      </mesh>
      {/* Desk mat yellow accent stitch border */}
      <mesh position={[-0.05, 0.771, 0.415]} material={stitchMat}>
        <boxGeometry args={[1.48, 0.002, 0.008]} />
      </mesh>
      <mesh position={[-0.05, 0.771, -0.215]} material={stitchMat}>
        <boxGeometry args={[1.48, 0.002, 0.008]} />
      </mesh>

      {/* Warm radial light-pool decal from the lamp (additive, no shadow maps) */}
      <GlowPanel
        position={[-0.85, 0.7725, 0.03]}
        rotation={[-Math.PI / 2, 0, 0]}
        size={[2.4, 1.1]}
        color={C.poolWarm}
        opacity={0.09}
      />
    </group>
  );
}

// ─── Studio Task Chair (tucked at desk) ───────────────────────────────────────
function Chair() {
  const cushionMat = useMat("#1E293B", { roughness: 0.85 });
  const shellMat   = useMat("#141C2B", { roughness: 0.6, metalness: 0.1 });
  const frameMat   = useMat("#0F172A", { roughness: 0.35, metalness: 0.6 });
  const chromeMat  = useMat("#9BA6B8", { roughness: 0.28, metalness: 0.85 });
  const casterMat  = useMat("#0B1220", { roughness: 0.55, metalness: 0.15 });

  // 5-star base: spoke angle, plus the castor that caps each spoke
  const STAR = [0, 1, 2, 3, 4].map((i) => {
    const rad = (i * 2 * Math.PI) / 5;
    return { rad, x: Math.cos(rad), z: Math.sin(rad) };
  });

  return (
    <group position={[-0.05, 0, 0.85]} rotation={[0, -0.15, 0]}>
      {/* ── Seat: slim shell plate with a cambered cushion on top ───────── */}
      <mesh position={[0, 0.402, 0]} material={shellMat}>
        <boxGeometry args={[0.5, 0.022, 0.47]} />
      </mesh>
      <mesh position={[0, 0.442, 0]} material={cushionMat}>
        <boxGeometry args={[0.47, 0.058, 0.44]} />
      </mesh>
      {/* Waterfall front lip so the seat edge reads soft, not sliced */}
      <mesh position={[0, 0.424, -0.222]} rotation={[0.5, 0, 0]} material={cushionMat}>
        <boxGeometry args={[0.47, 0.05, 0.03]} />
      </mesh>

      {/* ── Back: frame plate + cushion + lumbar pad ────────────────────── */}
      <group position={[0, 0, 0]} rotation={[-0.13, 0, 0]}>
        <mesh position={[0, 0.735, 0.255]} material={shellMat}>
          <boxGeometry args={[0.45, 0.4, 0.022]} />
        </mesh>
        <mesh position={[0, 0.74, 0.228]} material={cushionMat}>
          <boxGeometry args={[0.42, 0.36, 0.045]} />
        </mesh>
        {/* Lumbar pad */}
        <mesh position={[0, 0.59, 0.206]} material={cushionMat}>
          <boxGeometry args={[0.38, 0.075, 0.05]} />
        </mesh>
      </group>
      {/* Back upright spar, seat → back frame */}
      <mesh position={[0, 0.53, 0.212]} rotation={[0.1, 0, 0]} material={frameMat}>
        <boxGeometry args={[0.055, 0.24, 0.028]} />
      </mesh>

      {/* ── Tilt mechanism under the seat ───────────────────────────────── */}
      <mesh position={[0, 0.372, 0.01]} material={frameMat}>
        <boxGeometry args={[0.17, 0.04, 0.14]} />
      </mesh>

      {/* ── Gas lift: tapered shroud over a chrome column ───────────────── */}
      <mesh position={[0, 0.18, 0]} material={shellMat}>
        <cylinderGeometry args={[0.032, 0.042, 0.19, 16]} />
      </mesh>
      <mesh position={[0, 0.305, 0]} material={chromeMat}>
        <cylinderGeometry args={[0.021, 0.021, 0.14, 12]} />
      </mesh>

      {/* ── 5-star base: hub, tapered spokes, castors ───────────────────── */}
      <mesh position={[0, 0.075, 0]} material={shellMat}>
        <cylinderGeometry args={[0.05, 0.062, 0.04, 16]} />
      </mesh>
      {STAR.map(({ rad, x, z }, i) => (
        <group key={i}>
          {/* Tapered spoke reaching out to the castor */}
          <mesh position={[x * 0.135, 0.062, z * 0.135]} rotation={[0, -rad, 0]} material={shellMat}>
            <boxGeometry args={[0.21, 0.024, 0.05]} />
          </mesh>
          {/* Castor housing + wheel sitting on the floor */}
          <mesh position={[x * 0.245, 0.055, z * 0.245]} material={frameMat}>
            <boxGeometry args={[0.03, 0.05, 0.03]} />
          </mesh>
          <mesh
            position={[x * 0.245, 0.034, z * 0.245]}
            rotation={[0, -rad - Math.PI / 2, 0]}
            material={casterMat}
          >
            <cylinderGeometry args={[0.034, 0.034, 0.026, 14]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Laptop (Shipped Projects Module) ─────────────────────────────────────────
function Laptop({ hovered, onClick }) {
  const groupRef = useRef();
  const aluMat   = useMat(C.macAluminum, { roughness: 0.3, metalness: 0.7 });
  const darkMat  = useMat(C.macDark,     { roughness: 0.5, metalness: 0.2 });

  // Screen texture is built once and disposed with the component
  const screenTex = useMemo(() => makeScreenTexture(), []);
  useEffect(() => () => screenTex.dispose(), [screenTex]);

  const screenMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: screenTex,
        emissive: new THREE.Color("#FFFFFF"),
        emissiveMap: screenTex,
        emissiveIntensity: hovered ? 0.85 : 0.5,
        roughness: 0.2,
      }),
    [screenTex, hovered]
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = hovered ? 1.06 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
  });

  return (
    <group
      ref={groupRef}
      name="obj_laptop"
      position={[-0.1, 0.77, 0.08]}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = "auto"; }}
    >
      {/* Aluminum base chassis */}
      <mesh position={[0, 0.01, 0]} material={aluMat}>
        <boxGeometry args={[0.54, 0.016, 0.36]} />
      </mesh>

      {/* Recessed keyboard area */}
      <mesh position={[0, 0.0185, -0.04]} material={darkMat}>
        <boxGeometry args={[0.48, 0.003, 0.2]} />
      </mesh>

      {/* Trackpad */}
      <mesh position={[0, 0.019, 0.1]} material={aluMat}>
        <boxGeometry args={[0.16, 0.002, 0.1]} />
      </mesh>

      {/* Display lid (opened to a natural ~97 deg) */}
      <group position={[0, 0.018, -0.175]} rotation={[-1.44, 0, 0]}>
        {/* Back display shell */}
        <mesh position={[0, 0.17, 0]} material={aluMat}>
          <boxGeometry args={[0.54, 0.34, 0.012]} />
        </mesh>
        {/* Bezel */}
        <mesh position={[0, 0.17, 0.007]} material={darkMat}>
          <boxGeometry args={[0.52, 0.32, 0.002]} />
        </mesh>
        {/* Glowing screen — real content from data/site.js */}
        <mesh position={[0, 0.17, 0.009]} material={screenMat}>
          <boxGeometry args={[0.48, 0.28, 0.002]} />
        </mesh>

        {/* Faint additive halo around the display */}
        <GlowPanel
          position={[0, 0.17, 0.016]}
          size={[0.8, 0.52]}
          color={C.sky}
          opacity={0.07}
        />
      </group>
    </group>
  );
}

// ─── Desk Lamp (Warm Anglepoise with Light Cone) ──────────────────────────────
function DeskLamp() {
  const bodyMat  = useMat(C.lampBody,  { roughness: 0.3, metalness: 0.4 });
  const brassMat = useMat(C.lampBrass, { roughness: 0.2, metalness: 0.8 });
  const shadeMat = useMat(C.lampBody,  { roughness: 0.4, side: THREE.DoubleSide });
  const bulbMat  = useMat("#FFFBEB",   { emissive: "#FDE047", emissiveIntensity: 2.0 });

  return (
    <group position={[-1.25, 0.77, -0.15]} rotation={[0, 0.3, 0]}>
      {/* Heavy round base */}
      <mesh position={[0, 0.015, 0]} material={bodyMat}>
        <cylinderGeometry args={[0.09, 0.09, 0.03, 24]} />
      </mesh>
      {/* Switch knob */}
      <mesh position={[0.04, 0.035, 0]} material={brassMat}>
        <cylinderGeometry args={[0.01, 0.01, 0.02, 8]} />
      </mesh>

      {/* Lower arm */}
      <group position={[0, 0.03, 0]} rotation={[0, 0, -0.3]}>
        <mesh position={[0, 0.2, 0]} material={bodyMat}>
          <cylinderGeometry args={[0.012, 0.012, 0.4, 8]} />
        </mesh>
        {/* Joint elbow */}
        <mesh position={[0, 0.4, 0]} material={brassMat}>
          <sphereGeometry args={[0.024, 12, 12]} />
        </mesh>

        {/* Upper arm */}
        <group position={[0, 0.4, 0]} rotation={[0, 0, 0.65]}>
          <mesh position={[0, 0.18, 0]} material={bodyMat}>
            <cylinderGeometry args={[0.012, 0.012, 0.36, 8]} />
          </mesh>
          {/* Lamp shade joint */}
          <mesh position={[0, 0.36, 0]} material={brassMat}>
            <sphereGeometry args={[0.022, 12, 12]} />
          </mesh>

          {/* Cone shade — double-sided so the open underside never shows
              through it, with a rim and a bulb that clears the inner wall */}
          <group position={[0, 0.38, 0]} rotation={[0, 0, 0.28]}>
            <mesh position={[0, 0.05, 0]} material={shadeMat}>
              <coneGeometry args={[0.08, 0.14, 16, 1, true]} />
            </mesh>
            {/* Shade rim at the opening */}
            <mesh position={[0, -0.018, 0]} rotation={[Math.PI / 2, 0, 0]} material={brassMat}>
              <torusGeometry args={[0.079, 0.004, 8, 24]} />
            </mesh>
            {/* Glowing bulb, sized to sit inside the cone */}
            <mesh position={[0, -0.004, 0]} material={bulbMat}>
              <sphereGeometry args={[0.025, 12, 12]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

// ─── Raspberry Pi + Breadboard (The Lab) ──────────────────────────────────────
function RaspberryPi({ hovered, onClick }) {
  const groupRef = useRef();
  const pcbMat    = useMat(C.piPcb,    { roughness: 0.4 });
  const chipMat   = useMat(C.piChip,   { roughness: 0.2, metalness: 0.6 });
  const silverMat = useMat(C.piSilver, { roughness: 0.3, metalness: 0.9 });
  const goldMat   = useMat(C.piGold,   { roughness: 0.2, metalness: 0.8 });
  // Muted board plastic: at pure white it caught the sky fill and glowed
  const bbMat     = useMat("#C9D2DF",  { roughness: 0.8 });

  const ledRedMat    = useMat("#EF4444", { emissive: "#DC2626", emissiveIntensity: 0.6 });
  const ledGreenMat  = useMat("#22C55E", { emissive: "#16A34A", emissiveIntensity: 0.8 });
  const ledYellowMat = useMat("#EAB308", { emissive: "#CA8A04", emissiveIntensity: hovered ? 1.4 : 0.75 });

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = hovered ? 1.08 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
  });

  return (
    <group
      ref={groupRef}
      name="obj_pi"
      position={[1.25, 0.77, -0.05]}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = "auto"; }}
    >
      {/* Green PCB board */}
      <mesh position={[0, 0.007, 0]} material={pcbMat}>
        <boxGeometry args={[0.22, 0.014, 0.15]} />
      </mesh>

      {/* Broadcom SoC CPU chip */}
      <mesh position={[-0.02, 0.016, 0.01]} material={chipMat}>
        <boxGeometry args={[0.045, 0.008, 0.045]} />
      </mesh>

      {/* Dual stacked USB ports */}
      <mesh position={[0.09, 0.022, 0.035]} material={silverMat}>
        <boxGeometry args={[0.045, 0.024, 0.035]} />
      </mesh>
      {/* Ethernet port */}
      <mesh position={[0.09, 0.022, -0.035]} material={silverMat}>
        <boxGeometry args={[0.045, 0.024, 0.04]} />
      </mesh>

      {/* GPIO 40-pin header pins */}
      <mesh position={[-0.02, 0.018, -0.06]} material={goldMat}>
        <boxGeometry args={[0.15, 0.012, 0.018]} />
      </mesh>

      {/* ── Breadboard companion ────────────────────────────────────────── */}
      <group position={[-0.02, 0, 0.16]}>
        {/* White plastic breadboard */}
        <mesh position={[0, 0.008, 0]} material={bbMat}>
          <boxGeometry args={[0.18, 0.016, 0.09]} />
        </mesh>
        {/* Breadboard bus stripes */}
        <mesh position={[0, 0.017, -0.035]} material={ledRedMat}>
          <boxGeometry args={[0.16, 0.001, 0.004]} />
        </mesh>
        <mesh position={[0, 0.017, 0.035]} material={ledGreenMat}>
          <boxGeometry args={[0.16, 0.001, 0.004]} />
        </mesh>

        {/* Glowing breadboard LEDs */}
        <mesh position={[-0.04, 0.024, 0]} material={ledYellowMat}>
          <sphereGeometry args={[0.009, 8, 8]} />
        </mesh>
        <mesh position={[0.0, 0.024, 0]} material={ledGreenMat}>
          <sphereGeometry args={[0.009, 8, 8]} />
        </mesh>
        <mesh position={[0.04, 0.024, 0]} material={ledRedMat}>
          <sphereGeometry args={[0.009, 8, 8]} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Roadmap Board (dark emissive wall panel: Now / Next / Later) ─────────────
function RoadmapBoard({ hovered, onClick }) {
  const groupRef   = useRef();
  const frameMat   = useMat(C.wbFrame,    { roughness: 0.4, metalness: 0.5 });
  const markerMat  = useMat(C.cobalt,     { roughness: 0.3 });

  // Board content comes straight from data/roadmap.js via the visibility gate
  const boardTex = useMemo(() => {
    const items = visibleItems(roadmap);
    return makeBoardTexture(
      BOARD_COLUMNS.map((col) => ({
        label: col.label,
        accent: col.accent,
        titles: items
          .filter((item) => item.status === col.key)
          .slice(0, 3)
          .map((item) => item.title),
      }))
    );
  }, []);

  useEffect(() => () => boardTex.dispose(), [boardTex]);

  const faceMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: boardTex,
        emissive: new THREE.Color("#FFFFFF"),
        emissiveMap: boardTex,
        emissiveIntensity: 0.55,
        roughness: 0.5,
      }),
    [boardTex]
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = hovered ? 1.04 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
  });

  return (
    <group
      ref={groupRef}
      name="obj_whiteboard"
      position={[-0.3, 2.05, -2.46]}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = "auto"; }}
    >
      {/* Aluminum frame */}
      <mesh material={frameMat}>
        <boxGeometry args={[1.5, 0.85, 0.04]} />
      </mesh>
      {/* Dark emissive Now / Next / Later panel */}
      <mesh position={[0, 0, 0.021]} material={faceMat}>
        <boxGeometry args={[1.42, 0.77, 0.004]} />
      </mesh>

      {/* Faint additive glow around the wall screen */}
      <GlowPanel
        position={[0, 0, 0.055]}
        size={[2.0, 1.2]}
        color={C.cobalt}
        opacity={0.08}
      />

      {/* Pen tray + markers at bottom */}
      <mesh position={[0, -0.44, 0.05]} material={frameMat}>
        <boxGeometry args={[0.6, 0.02, 0.06]} />
      </mesh>
      <mesh position={[-0.1, -0.42, 0.05]} rotation={[0, 0, Math.PI / 2]} material={markerMat}>
        <cylinderGeometry args={[0.008, 0.008, 0.14, 8]} />
      </mesh>
    </group>
  );
}

// ─── Notebook & Brass Pen (Notes Module) ─────────────────────────────────────
function Notebook({ hovered, onClick }) {
  const groupRef = useRef();
  const coverMat = useMat(C.cobalt,    { roughness: 0.6 });
  const paperMat = useMat("#E1D6BE",   { roughness: 0.92 });
  const pageMat  = useMat("#D4C8AC",   { roughness: 0.92 });
  const penMat   = useMat(C.lampBrass, { roughness: 0.2, metalness: 0.85 });
  const lineMat  = useMat("#8C97A8",   { roughness: 0.85 });

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = hovered ? 1.08 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
  });

  return (
    <group
      ref={groupRef}
      name="obj_notebook"
      position={[-1.0, 0.77, 0.28]}
      rotation={[0, 0.15, 0]}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = "auto"; }}
    >
      {/* Open notebook base cover */}
      <mesh position={[0, 0.008, 0]} material={coverMat}>
        <boxGeometry args={[0.34, 0.016, 0.24]} />
      </mesh>
      {/* Page block edge, so the book reads as paper not a slab */}
      <mesh position={[0, 0.019, 0]} material={pageMat}>
        <boxGeometry args={[0.322, 0.014, 0.226]} />
      </mesh>
      {/* Top sheet — matte cream, deliberately not paper-white */}
      <mesh position={[0, 0.027, 0]} material={paperMat}>
        <boxGeometry args={[0.32, 0.004, 0.224]} />
      </mesh>
      {/* Center spine gutter crease */}
      <mesh position={[0, 0.0305, 0]} material={useMat("#CFC4AC")}>
        <boxGeometry args={[0.008, 0.002, 0.224]} />
      </mesh>

      {/* Mock sketch/code lines on left page */}
      {[-0.06, -0.03, 0.0, 0.03, 0.06].map((z, i) => (
        <mesh key={i} position={[-0.08, 0.0305, z]} material={lineMat}>
          <boxGeometry args={[0.1, 0.001, 0.004]} />
        </mesh>
      ))}

      {/* Brass executive pen lying flat and parallel to the notebook, shifted
          left so it lines up with the pages instead of hanging off the edge */}
      <group position={[0.07, 0.0055, 0.165]} rotation={[0, 0, Math.PI / 2]}>
        <mesh material={penMat}>
          <cylinderGeometry args={[0.0055, 0.0055, 0.19, 12]} />
        </mesh>
        <mesh position={[0, 0.108, 0]} material={penMat}>
          <coneGeometry args={[0.0055, 0.03, 12]} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Desk Nameplate & Book Stack (Ventures Module) ───────────────────────────
function VenturesBooks({ hovered, onClick }) {
  const groupRef = useRef();
  const woodMat  = useMat(C.deskEdge,  { roughness: 0.5 });
  const brassMat = useMat(C.signal,    { roughness: 0.2, metalness: 0.85 });
  const book1Mat = useMat(C.book1,     { roughness: 0.6 });
  const book2Mat = useMat(C.book2,     { roughness: 0.6 });
  const pagesMat = useMat(C.bookPages, { roughness: 0.8 });

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = hovered ? 1.08 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
  });

  return (
    <group
      ref={groupRef}
      name="obj_ventures"
      position={[0.68, 0.77, 0.28]}
      rotation={[0, -0.15, 0]}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = "auto"; }}
    >
      {/* Bottom hardcover book */}
      <mesh position={[0, 0.016, 0]} material={book1Mat}>
        <boxGeometry args={[0.26, 0.032, 0.19]} />
      </mesh>
      <mesh position={[0.01, 0.016, 0]} material={pagesMat}>
        <boxGeometry args={[0.24, 0.026, 0.17]} />
      </mesh>

      {/* Top angled book */}
      <group position={[0.01, 0.042, 0.01]} rotation={[0, 0.12, 0]}>
        <mesh material={book2Mat}>
          <boxGeometry args={[0.24, 0.026, 0.17]} />
        </mesh>
        <mesh position={[0.01, 0, 0]} material={pagesMat}>
          <boxGeometry args={[0.22, 0.02, 0.15]} />
        </mesh>
      </group>

      {/* Brass & Walnut Triangular Desk Nameplate ("RASHMIN · VENTURES") */}
      <group position={[-0.02, 0.068, 0.08]} rotation={[0, -0.05, 0]}>
        {/* Walnut triangular block */}
        <mesh material={woodMat}>
          <boxGeometry args={[0.24, 0.028, 0.035]} />
        </mesh>
        {/* Brass engraved plaque */}
        <mesh position={[0, 0.003, 0.019]} rotation={[-0.2, 0, 0]} material={brassMat}>
          <boxGeometry args={[0.22, 0.02, 0.002]} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Smartphone on Desk Stand (Contact Module) ────────────────────────────────
function PhoneStand({ hovered, onClick }) {
  const groupRef = useRef();
  const standMat  = useMat(C.macAluminum, { roughness: 0.3, metalness: 0.8 });
  const phoneMat  = useMat(C.phoneBody,   { roughness: 0.3, metalness: 0.5 });
  const screenMat = useMat(C.phoneScreen, {
    roughness: 0.15,
    emissive: C.phoneGlow,
    emissiveIntensity: hovered ? 1.1 : 0.5,
  });
  const bubbleMat = useMat(C.signal, { emissive: C.signal, emissiveIntensity: hovered ? 0.9 : 0.5 });

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = hovered ? 1.08 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
  });

  return (
    <group
      ref={groupRef}
      name="obj_phone"
      position={[1.5, 0.77, 0.25]}
      rotation={[0, -0.3, 0]}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = "auto"; }}
    >
      {/* Aluminum angled phone stand base */}
      <mesh position={[0, 0.008, 0]} material={standMat}>
        <boxGeometry args={[0.1, 0.016, 0.11]} />
      </mesh>
      {/* Stand upright plate */}
      <mesh position={[0, 0.07, -0.03]} rotation={[-0.35, 0, 0]} material={standMat}>
        <boxGeometry args={[0.08, 0.13, 0.01]} />
      </mesh>

      {/* Smartphone resting on stand */}
      <group position={[0, 0.08, -0.02]} rotation={[-0.35, 0, 0]}>
        {/* Phone body chassis */}
        <mesh material={phoneMat}>
          <boxGeometry args={[0.085, 0.165, 0.012]} />
        </mesh>
        {/* Glowing glass screen */}
        <mesh position={[0, 0, 0.007]} material={screenMat}>
          <boxGeometry args={[0.076, 0.155, 0.001]} />
        </mesh>
        {/* Stylized message notification bubble */}
        <mesh position={[0, 0.035, 0.008]} material={bubbleMat}>
          <boxGeometry args={[0.05, 0.022, 0.001]} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Potted Monstera / Succulent Plant (About Module) ─────────────────────────
function PottedPlant({ hovered, onClick }) {
  const groupRef = useRef();
  const potMat   = useMat(C.plantPot,   { roughness: 0.65 });
  const rimMat   = useMat("#9A4708",    { roughness: 0.6 });
  const soilMat  = useMat(C.plantSoil,  { roughness: 0.95 });
  const stemMat  = useMat(C.plantLeaf2, { roughness: 0.5 });
  // Double-sided so leaves never vanish at grazing angles from the low camera
  const leafMat1 = useMat(C.plantLeaf1, { roughness: 0.45, side: THREE.DoubleSide });
  const leafMat2 = useMat(C.plantLeaf2, { roughness: 0.45, side: THREE.DoubleSide });

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = hovered ? 1.08 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
  });

  return (
    <group
      ref={groupRef}
      name="obj_plant"
      position={[-1.5, 0.77, 0.25]}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = "auto"; }}
    >
      {/* Terracotta saucer so the pot sits on the desk, not in it */}
      <mesh position={[0, 0.005, 0]} material={rimMat}>
        <cylinderGeometry args={[0.105, 0.11, 0.01, 20]} />
      </mesh>
      {/* Terracotta ceramic pot */}
      <mesh position={[0, 0.072, 0]} material={potMat}>
        <cylinderGeometry args={[0.09, 0.068, 0.13, 20]} />
      </mesh>
      {/* Pot rim collar */}
      <mesh position={[0, 0.14, 0]} material={rimMat}>
        <cylinderGeometry args={[0.096, 0.096, 0.022, 20]} />
      </mesh>
      {/* Dark rich potting soil */}
      <mesh position={[0, 0.139, 0]} material={soilMat}>
        <cylinderGeometry args={[0.084, 0.084, 0.012, 18]} />
      </mesh>

      {/* Main plant stem */}
      <mesh position={[0, 0.23, 0]} material={stemMat}>
        <cylinderGeometry args={[0.008, 0.011, 0.19, 8]} />
      </mesh>

      {/* Leaves fanning out radially from the stem. The outward yaw and the
          tip droop are separate frames, so each blade tips away from the
          crown instead of every blade leaning the same way (the previous
          single-group version applied one world-space tilt to all of them). */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const rad = (i * 2 * Math.PI) / 6 + 0.22;
        const r = 0.03;
        const elevation = 0.205 + (i % 3) * 0.028;
        const droop = -0.1 + (i % 3) * 0.16;
        return (
          <group
            key={i}
            position={[Math.cos(rad) * r, elevation, Math.sin(rad) * r]}
            rotation={[0, -rad, 0]}
          >
            <group rotation={[0, 0, -droop]}>
              <group position={[0.05, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <mesh
                  scale={[1.5, 0.82, 1]}
                  material={i % 2 === 0 ? leafMat1 : leafMat2}
                >
                  <circleGeometry args={[0.05, 14]} />
                </mesh>
              </group>
            </group>
          </group>
        );
      })}
    </group>
  );
}

// ─── Ceramic Coffee Mug on Cork Coaster ───────────────────────────────────────
function CoffeeMug() {
  // Warm bone china rather than studio white: the lamp no longer blows it out
  const ceramicMat = useMat("#E8E2D6", { roughness: 0.42 });
  const glazeMat   = useMat("#F1ECE2", { roughness: 0.28 });
  const coffeeMat  = useMat("#2A1608", { roughness: 0.18, metalness: 0.05 });
  const coasterMat = useMat(C.coasterCork,{ roughness: 0.9 });

  const bodyTop = 0.108;

  return (
    <group position={[-0.65, 0.77, 0.32]}>
      {/* Cork coaster */}
      <mesh position={[0, 0.004, 0]} material={coasterMat}>
        <cylinderGeometry args={[0.07, 0.07, 0.008, 24]} />
      </mesh>
      {/* Mug body: gently tapered walls */}
      <mesh position={[0, 0.058, 0]} material={ceramicMat}>
        <cylinderGeometry args={[0.043, 0.038, 0.1, 24]} />
      </mesh>
      {/* Thrown rim, slightly proud of the wall (torus lies flat in XZ) */}
      <mesh position={[0, bodyTop, 0]} rotation={[Math.PI / 2, 0, 0]} material={glazeMat}>
        <torusGeometry args={[0.043, 0.0032, 8, 24]} />
      </mesh>
      {/* Dark coffee resting just inside the rim */}
      <mesh position={[0, bodyTop - 0.006, 0]} material={coffeeMat}>
        <cylinderGeometry args={[0.0405, 0.0405, 0.004, 24]} />
      </mesh>
      {/* Handle: a full loop, so it reads as a mug handle rather than a half
          arc. The inner part of the ring sits inside the wall, the outer half
          forms the grip; scaled tall for an oval handle. */}
      <mesh position={[0.044, 0.062, 0]} scale={[1, 1.15, 1]} material={ceramicMat}>
        <torusGeometry args={[0.027, 0.0056, 8, 20]} />
      </mesh>
    </group>
  );
}

// ─── Wall Floating Shelf with Books & Model Quadcopter Drone ───────────────────
function WallShelf({ spin, reducedMotion }) {
  const shelfMat = useMat(C.deskEdge, { roughness: 0.6 });
  const droneMat = useMat(C.signal,   { roughness: 0.3, metalness: 0.4 });
  const propMat  = useMat(C.ink,      { roughness: 0.5 });
  const { invalidate } = useThree();
  const propA = useRef();
  const propB = useRef();

  // Two drone propellers spin only while the lab module is hovered/focused or
  // /lab is the active route. Frames are requested while they spin, then stop.
  useFrame((_, delta) => {
    if (!spin || reducedMotion) return;
    if (propA.current) propA.current.rotation.y += delta * 3.2;
    if (propB.current) propB.current.rotation.y -= delta * 3.2;
    invalidate();
  });

  return (
    <group position={[-0.2, 2.8, -2.48]}>
      {/* Wooden floating wall shelf */}
      <mesh material={shelfMat}>
        <boxGeometry args={[1.6, 0.04, 0.28]} />
      </mesh>

      {/* Row of books on the shelf */}
      {[-0.6, -0.54, -0.48, -0.41, -0.34].map((x, idx) => {
        const colors = [C.cobalt, C.signal, C.board, "#EF4444", "#8B5CF6"];
        const heights = [0.22, 0.26, 0.2, 0.24, 0.23];
        return (
          <mesh
            key={idx}
            position={[x, heights[idx] / 2 + 0.02, 0]}
            material={new THREE.MeshStandardMaterial({ color: colors[idx], roughness: 0.6 })}
          >
            <boxGeometry args={[0.045, heights[idx], 0.2]} />
          </mesh>
        );
      })}

      {/* Miniature Model Quadcopter Drone on shelf display */}
      <group position={[0.3, 0.06, 0]}>
        {/* Central hub */}
        <mesh material={droneMat}>
          <boxGeometry args={[0.1, 0.03, 0.1]} />
        </mesh>
        {/* Drone arm rods */}
        <mesh rotation={[0, Math.PI / 4, 0]} material={shelfMat}>
          <boxGeometry args={[0.24, 0.015, 0.015]} />
        </mesh>
        <mesh rotation={[0, -Math.PI / 4, 0]} material={shelfMat}>
          <boxGeometry args={[0.24, 0.015, 0.015]} />
        </mesh>

        {/* Two drone propellers — still unless the lab module is active */}
        <group ref={propA} position={[0.09, 0.028, 0.09]}>
          <mesh material={propMat}>
            <cylinderGeometry args={[0.008, 0.008, 0.012, 8]} />
          </mesh>
          <mesh material={propMat}>
            <boxGeometry args={[0.11, 0.003, 0.014]} />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]} material={propMat}>
            <boxGeometry args={[0.11, 0.003, 0.014]} />
          </mesh>
        </group>
        <group ref={propB} position={[-0.09, 0.028, -0.09]}>
          <mesh material={propMat}>
            <cylinderGeometry args={[0.008, 0.008, 0.012, 8]} />
          </mesh>
          <mesh material={propMat}>
            <boxGeometry args={[0.11, 0.003, 0.014]} />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]} material={propMat}>
            <boxGeometry args={[0.11, 0.003, 0.014]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ─── Neon "RASHMIN" wall sign (static emissive texture + soft glow) ──────────
function WallSign() {
  const signTex = useMemo(() => makeSignTexture("RASHMIN"), []);
  useEffect(() => () => signTex.dispose(), [signTex]);

  const signMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: signTex,
        emissive: new THREE.Color("#FFFFFF"),
        emissiveMap: signTex,
        emissiveIntensity: 0.85,
        roughness: 0.6,
      }),
    [signTex]
  );

  return (
    <group position={[4.15, 2.55, -2.56]}>
      <mesh material={signMat}>
        <planeGeometry args={[1.9, 0.42]} />
      </mesh>
      <GlowPanel position={[0, 0, 0.03]} size={[2.3, 0.86]} color={C.signal} opacity={0.1} />
    </group>
  );
}

// ─── Projects hotspot 3D anchors into screen space for the DOM beacon layer ──
function BeaconProjector({ hotspots, beaconRefs }) {
  const { camera, size } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);

  const project = useCallback(() => {
    const refs = beaconRefs?.current;
    if (!refs) return;

    // Keep projection matrices current so beacons track the camera exactly
    camera.updateMatrixWorld();
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();

    hotspots.forEach((hs) => {
      const el = refs[hs.id];
      const anchor = HOTSPOT_ANCHORS[hs.id];
      if (!el || !anchor) return;

      v.set(anchor[0], anchor[1], anchor[2]);
      v.project(camera);

      // Behind the camera → take it out of the layout and the tab order
      if (v.z > 1) {
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
        el.style.visibility = "hidden";
        return;
      }

      el.style.visibility = "visible";
      el.style.opacity = "1";
      el.style.pointerEvents = "auto";

      const x = ((v.x + 1) * size.width) / 2;
      const y = ((-v.y + 1) * size.height) / 2;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    });
  }, [beaconRefs, camera, hotspots, size.width, size.height, v]);

  // Only runs on frames the renderer actually produces (i.e. camera movement),
  // and never asks for a frame itself.
  useFrame(project);

  // Initial placement and resize: reposition without requesting a frame
  useEffect(() => {
    project();
  }, [project]);

  return null;
}

// ─── Camera Rig: Smooth mouse parallax + responsive camera transitions ────────
const _scratch = new THREE.Vector3();
const DEG5 = (5 * Math.PI) / 180;
const DEG3 = (3 * Math.PI) / 180;

function CameraRig({ targetPose: explicitPose, reducedMotion = false }) {
  const pathname = usePathname();
  const { camera, invalidate } = useThree();
  const mouse      = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart  = useRef({ x: 0, y: 0 });
  const dragRot    = useRef({ x: 0, y: 0 });
  const prevDragRot= useRef({ x: 0, y: 0 });
  const introDone  = useRef(false);
  const lastMouse  = useRef({ x: 0, y: 0 });

  // Target pose keyed by route
  const targetPose = explicitPose || routePoses[pathname] || defaultPose;

  // On first visit, start slightly back for smooth opening camera move (once per session)
  useEffect(() => {
    if (introDone.current || typeof window === "undefined") return;
    introDone.current = true;
    const seen = sessionStorage.getItem("world-camera-intro");
    if (!seen && !reducedMotion) {
      sessionStorage.setItem("world-camera-intro", "1");
      camera.position.set(
        targetPose.position.x - 0.4,
        targetPose.position.y + 0.35,
        targetPose.position.z + 0.7
      );
      camera.lookAt(targetPose.target.x, targetPose.target.y, targetPose.target.z);
    }
  }, [camera, targetPose, reducedMotion]);

  useEffect(() => {
    const onPointerMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (isDragging.current) {
        const dx = (e.clientX - dragStart.current.x) / window.innerWidth;
        const dy = (e.clientY - dragStart.current.y) / window.innerHeight;
        dragRot.current.x = Math.max(-0.25, Math.min(0.35, prevDragRot.current.x + dy * 1.0));
        dragRot.current.y = prevDragRot.current.y + dx * 2.2;
      }
      // Parallax needs a frame to follow the pointer (not under reduced motion)
      if (isDragging.current || !reducedMotion) invalidate();
    };
    const onPointerDown = (e) => {
      isDragging.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
      prevDragRot.current = { ...dragRot.current };
    };
    const onPointerUp = () => { isDragging.current = false; };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup",   onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup",   onPointerUp);
    };
  }, [invalidate, reducedMotion]);

  // Reset drag rotation when target pose changes
  useEffect(() => {
    dragRot.current = { x: 0, y: 0 };
    prevDragRot.current = { x: 0, y: 0 };
    invalidate();
  }, [targetPose, invalidate]);

  useFrame((_, delta) => {
    const p = targetPose.position;
    const t = targetPose.target;

    const px = p.x + dragRot.current.y * 0.9;
    const py = p.y - dragRot.current.x * 0.5;
    const pz = p.z;

    const mouseMoved =
      mouse.current.x !== lastMouse.current.x || mouse.current.y !== lastMouse.current.y;

    let settled = false;

    if (reducedMotion) {
      // Instant jump, no damp, no parallax
      settled = camera.position.x === px && camera.position.y === py && camera.position.z === pz;
      if (!settled) camera.position.set(px, py, pz);
      _scratch.set(t.x, t.y, t.z);
      camera.lookAt(_scratch);
    } else {
      const nx = THREE.MathUtils.damp(camera.position.x, px, 5, delta);
      const ny = THREE.MathUtils.damp(camera.position.y, py, 5, delta);
      const nz = THREE.MathUtils.damp(camera.position.z, pz, 5, delta);
      settled =
        Math.abs(nx - px) < 1e-4 &&
        Math.abs(ny - py) < 1e-4 &&
        Math.abs(nz - pz) < 1e-4;
      camera.position.set(nx, ny, nz);

      const parallaxX = mouse.current.x * DEG5;
      const parallaxY = mouse.current.y * DEG3;
      _scratch.set(t.x + parallaxX * 0.3, t.y - parallaxY * 0.2, t.z);
      camera.lookAt(_scratch);
    }

    lastMouse.current.x = mouse.current.x;
    lastMouse.current.y = mouse.current.y;

    // Demand frames only while the camera is still moving — never continuously
    if (!settled || mouseMoved) invalidate();
  });

  return null;
}

// ─── Coordinated, Spacious Hotspot Anchors (projected onto the DOM beacons) ───
const HOTSPOT_ANCHORS = {
  plant:      [-1.5,  1.02,  0.25],
  notebook:   [-1.0,  0.86,  0.28],
  laptop:     [-0.1,  1.12,  0.08],
  whiteboard: [-0.3,  2.15, -2.42],
  book:       [ 0.68, 0.92,  0.28],
  pi:         [ 1.25, 0.86, -0.05],
  phone:      [ 1.5,  0.96,  0.25],
};

// ─── Hover Kick: a short burst of frames so hover transitions can settle ──────
function HoverKick({ hoveredId }) {
  const { invalidate } = useThree();
  const until = useRef(0);

  useEffect(() => {
    // ~400ms is enough for the damped hover scales to converge
    until.current = performance.now() + 400;
    invalidate();
  }, [hoveredId, invalidate]);

  useFrame(() => {
    if (performance.now() < until.current) invalidate();
  });

  return null;
}

// ─── Ready Notifier: calls onReady once first frame renders ───────────────────
function ReadyNotifier({ onReady }) {
  const called = useRef(false);
  useFrame(() => {
    if (!called.current) {
      called.current = true;
      onReady?.();
    }
  });
  return null;
}

// ─── Desktop-only bloom (emissives only); skipped entirely on mobile ─────────
function ScenePostFX({ enabled }) {
  const { gl, scene, camera, size, invalidate } = useThree();
  const [composer, setComposer] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setComposer(null);
      return undefined;
    }

    let cancelled = false;
    let active = null;

    Promise.all([
      import("three/examples/jsm/postprocessing/EffectComposer.js"),
      import("three/examples/jsm/postprocessing/RenderPass.js"),
      import("three/examples/jsm/postprocessing/UnrealBloomPass.js"),
      import("three/examples/jsm/postprocessing/OutputPass.js"),
    ]).then(([composerMod, renderMod, bloomMod, outputMod]) => {
      if (cancelled) return;
      const next = new composerMod.EffectComposer(gl);
      next.addPass(new renderMod.RenderPass(scene, camera));
      // High threshold + low strength → only the bright emissive surfaces bloom
      next.addPass(new bloomMod.UnrealBloomPass(new THREE.Vector2(1, 1), 0.2, 0.45, 0.92));
      next.addPass(new outputMod.OutputPass());
      active = next;
      setComposer(next);
      invalidate();
    });

    return () => {
      cancelled = true;
      if (active) {
        active.passes.forEach((pass) => pass.dispose?.());
        active.dispose();
      }
    };
  }, [enabled, gl, scene, camera, invalidate]);

  // Keep the composer in step with canvas size and pixel ratio
  useEffect(() => {
    if (!composer) return;
    composer.setPixelRatio(gl.getPixelRatio());
    composer.setSize(size.width, size.height);
    invalidate();
  }, [composer, gl, size.width, size.height, invalidate]);

  // A positive priority takes render control from the default R3F loop
  useFrame(() => {
    if (composer) composer.render();
  }, 1);

  return null;
}

// ─── Desktop viewport check for post-processing (≥1024px) ────────────────────
function useDesktopScene() {
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return desktop;
}

// ─── Inner Scene Assembler ────────────────────────────────────────────────────
function SceneContent({ targetPose, hotspots, onSelect, hoveredId, beaconRefs, reducedMotion, desktopScene }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSelectObject = useCallback((id) => {
    if (onSelect) {
      onSelect(id);
    } else {
      const hs = hotspots.find((h) => h.id === id);
      if (hs) router.push(hs.href);
    }
  }, [onSelect, hotspots, router]);

  return (
    <>
      <CameraRig targetPose={targetPose} reducedMotion={reducedMotion} />
      <SceneLighting />
      <Room />
      <Desk />
      <Chair />
      <Laptop       hovered={hoveredId === "laptop"} onClick={() => handleSelectObject("laptop")} />
      <DeskLamp />
      <RaspberryPi  hovered={hoveredId === "pi"} onClick={() => handleSelectObject("pi")} />
      <RoadmapBoard hovered={hoveredId === "whiteboard"} onClick={() => handleSelectObject("whiteboard")} />
      <Notebook     hovered={hoveredId === "notebook"} onClick={() => handleSelectObject("notebook")} />
      <VenturesBooks hovered={hoveredId === "book"} onClick={() => handleSelectObject("book")} />
      <PhoneStand   hovered={hoveredId === "phone"} onClick={() => handleSelectObject("phone")} />
      <PottedPlant  hovered={hoveredId === "plant"} onClick={() => handleSelectObject("plant")} />
      <CoffeeMug />
      <WallShelf spin={hoveredId === "pi" || pathname === "/lab"} reducedMotion={reducedMotion} />
      <WallSign />

      {/* Screen-space projector for the DOM beacon layer */}
      <BeaconProjector hotspots={hotspots} beaconRefs={beaconRefs} />

      {/* Short frame bursts for hover transitions (no continuous loop) */}
      <HoverKick hoveredId={hoveredId} />

      {/* Desktop-only bloom over the emissive surfaces */}
      <ScenePostFX enabled={desktopScene} />
    </>
  );
}

// ─── Error Boundary ───────────────────────────────────────────────────────────
function SceneFallback() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded-card
                 border border-ink/10 dark:border-paper/10 bg-paper dark:bg-night-surface p-6"
      style={{ height: "100%", minHeight: "360px" }}
      role="alert"
    >
      <p className="text-sm text-muted text-center">
        The 3D scene could not be loaded.
      </p>
    </div>
  );
}

class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return <SceneFallback />;
    return this.props.children;
  }
}

// ─── Dispose Cleaner ──────────────────────────────────────────────────────────
function DisposeCleaner() {
  const { scene } = useThree();
  useEffect(() => {
    return () => {
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
    };
  }, [scene]);
  return null;
}

// ─── Root Export ──────────────────────────────────────────────────────────────
export default function Scene({
  hotspots,
  targetPose,
  onSelect,
  beaconRefs,
  hoveredId = null,
  onReady,
  reducedMotion = false,
}) {
  const desktopScene = useDesktopScene();

  return (
    <SceneErrorBoundary>
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        camera={{
          position: [defaultPose.position.x, defaultPose.position.y, defaultPose.position.z],
          fov: 46,
        }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
        style={{
          background:
            "radial-gradient(ellipse 118% 88% at 52% 30%, #26354F 0%, #17233A 44%, #0C1424 100%)",
          width: "100%",
          height: "100%",
        }}
      >
        <ReadyNotifier onReady={onReady} />
        <DisposeCleaner />
        <SceneContent
          targetPose={targetPose}
          hotspots={hotspots}
          onSelect={onSelect}
          hoveredId={hoveredId}
          beaconRefs={beaconRefs}
          reducedMotion={reducedMotion}
          desktopScene={desktopScene}
        />
      </Canvas>
    </SceneErrorBoundary>
  );
}
