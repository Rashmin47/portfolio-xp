"use client";

import { Component, useRef, useEffect, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { defaultPose } from "@/data/hotspots";

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

  // Warm studio & workshop colors
  wall:        "#1C2433",
  wallTrim:    "#161E2C",
  woodFloor:   "#2E211A",
  floorPlank:  "#382920",
  rug:         "#162032",
  rugBorder:   "#24334C",

  deskTop:     "#8A5734",
  deskEdge:    "#6B3F21",
  deskLeg:     "#151C28",
  deskMat:     "#182233",
  matStitch:   "#F2C81F",

  macAluminum: "#D6DBE4",
  macDark:     "#2D3545",
  macKeyboard: "#1A2231",

  piPcb:       "#207D3E",
  piChip:      "#181E26",
  piSilver:    "#E2E8F0",
  piGold:      "#D4AF37",

  mugCeramic:  "#F8FAFC",
  mugCoffee:   "#3E2312",
  coasterCork: "#A2744B",

  lampBody:    "#2F5BEA",
  lampBrass:   "#F2C81F",
  lampLight:   "#FFF2D1",

  wbFrame:     "#334155",
  wbFace:      "#F1F5F9",
  noteYellow:  "#FEF08A",
  noteBlue:    "#BAE6FD",
  noteGreen:   "#BBF7D0",
  noteOrange:  "#FED7AA",

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
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [color, opts.roughness, opts.metalness, opts.emissive, opts.emissiveIntensity]
  );
}

// ─── Warm, rich atmospheric lighting (Jesse Zhou inspired) ────────────────────
function SceneLighting() {
  return (
    <>
      {/* Soft warm hemisphere ambient light so surfaces are never pitch black */}
      <hemisphereLight
        color="#FFF6E8"
        groundColor="#2A1E18"
        intensity={1.9}
      />

      {/* Main sunbeam / studio directional key light */}
      <directionalLight
        position={[4, 6, 4]}
        intensity={2.2}
        color="#FFEAD1"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Cool sky fill from left window */}
      <directionalLight
        position={[-5, 4, 1]}
        intensity={1.1}
        color="#93C5FD"
      />

      {/* Cozy warm desk lamp light pooling directly on the workspace */}
      <pointLight
        position={[-1.2, 1.4, 0.2]}
        color="#FFE4A0"
        intensity={2.8}
        distance={3.5}
        decay={2}
      />

      {/* Soft screen glow for the laptop */}
      <pointLight
        position={[-0.05, 1.05, 0.25]}
        color="#62C0FF"
        intensity={1.0}
        distance={1.6}
        decay={2}
      />

      {/* Soft green hardware glow on the Raspberry Pi breadboard */}
      <pointLight
        position={[1.25, 0.95, 0.1]}
        color="#2EA84B"
        intensity={1.2}
        distance={1.2}
        decay={2}
      />

      {/* Rim light from behind desk for crisp silhouettes */}
      <spotLight
        position={[0, 4, -3.5]}
        target-position={[0, 0.8, 0]}
        color="#62C0FF"
        intensity={1.4}
        angle={Math.PI / 3}
        penumbra={0.6}
      />
    </>
  );
}

// ─── Studio Room (Walls, Floorboards, Rug, Window) ───────────────────────────
function Room() {
  const wallMat    = useMat(C.wall,     { roughness: 0.9 });
  const trimMat    = useMat(C.wallTrim, { roughness: 0.8 });
  const floorMat   = useMat(C.woodFloor, { roughness: 0.6 });
  const rugMat     = useMat(C.rug,      { roughness: 0.95 });
  const rugBorderMat = useMat(C.cobalt, { roughness: 0.8 });

  // Window materials
  const winFrameMat = useMat(C.wbFrame, { roughness: 0.5 });
  const skyMat      = useMat("#38BDF8", { emissive: "#0284C7", emissiveIntensity: 0.6 });
  const hillMat     = useMat("#0F172A", { roughness: 1.0 });

  return (
    <group name="obj_room">
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
      {/* Rug border ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0.2]} material={rugBorderMat}>
        <ringGeometry args={[2.35, 2.4, 48]} />
      </mesh>

      {/* ── Studio Window looking out onto Kathmandu hill silhouette ──────── */}
      <group position={[2.0, 2.2, -2.55]}>
        {/* Sky pane */}
        <mesh position={[0, 0, 0.01]} material={skyMat}>
          <planeGeometry args={[1.8, 1.4]} />
        </mesh>
        {/* Distant Kathmandu hills */}
        <mesh position={[-0.3, -0.3, 0.02]} material={hillMat} rotation={[0, 0, 0.1]}>
          <coneGeometry args={[0.9, 0.8, 5]} />
        </mesh>
        <mesh position={[0.4, -0.35, 0.02]} material={hillMat} rotation={[0, 0, -0.08]}>
          <coneGeometry args={[0.8, 0.7, 5]} />
        </mesh>
        {/* Window outer frame */}
        <mesh position={[0, 0, 0.03]} material={winFrameMat}>
          <boxGeometry args={[1.9, 1.5, 0.04]} />
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
    </group>
  );
}

// ─── Studio Chair (tucked at desk) ────────────────────────────────────────────
function Chair() {
  const cushionMat = useMat("#1E293B", { roughness: 0.8 });
  const frameMat   = useMat("#0F172A", { roughness: 0.4, metalness: 0.5 });

  return (
    <group position={[-0.05, 0, 0.85]} rotation={[0, -0.15, 0]}>
      {/* Seat cushion */}
      <mesh position={[0, 0.48, 0]} material={cushionMat}>
        <boxGeometry args={[0.5, 0.08, 0.48]} />
      </mesh>
      {/* Ergonomic curved backrest */}
      <mesh position={[0, 0.82, 0.23]} rotation={[-0.1, 0, 0]} material={cushionMat}>
        <boxGeometry args={[0.46, 0.45, 0.05]} />
      </mesh>
      {/* Back connector stem */}
      <mesh position={[0, 0.62, 0.22]} material={frameMat}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
      </mesh>
      {/* Central gas-lift cylinder */}
      <mesh position={[0, 0.26, 0]} material={frameMat}>
        <cylinderGeometry args={[0.035, 0.035, 0.38, 12]} />
      </mesh>
      {/* 5-star base feet */}
      {[0, 1, 2, 3, 4].map((i) => {
        const rad = (i * 2 * Math.PI) / 5;
        return (
          <mesh
            key={i}
            position={[Math.cos(rad) * 0.16, 0.06, Math.sin(rad) * 0.16]}
            rotation={[0, rad, 0]}
            material={frameMat}
          >
            <boxGeometry args={[0.3, 0.03, 0.04]} />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── Laptop (Shipped Projects Module) ─────────────────────────────────────────
function Laptop({ hovered }) {
  const groupRef = useRef();
  const aluMat   = useMat(C.macAluminum, { roughness: 0.3, metalness: 0.7 });
  const darkMat  = useMat(C.macDark,     { roughness: 0.5, metalness: 0.2 });
  const screenMat= useMat(C.screen,      {
    roughness: 0.2,
    emissive: C.screenGlow,
    emissiveIntensity: hovered ? 1.0 : 0.6,
  });
  const codeLineMat1 = useMat(C.sky,    { emissive: C.sky, emissiveIntensity: 0.8 });
  const codeLineMat2 = useMat(C.signal, { emissive: C.signal, emissiveIntensity: 0.8 });
  const codeLineMat3 = useMat(C.board,  { emissive: C.board, emissiveIntensity: 0.8 });

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = hovered ? 1.06 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
  });

  return (
    <group ref={groupRef} name="obj_laptop" position={[-0.1, 0.77, 0.08]}>
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

      {/* Display lid (opened at ~115 deg) */}
      <group position={[0, 0.018, -0.175]} rotation={[-1.15, 0, 0]}>
        {/* Back display shell */}
        <mesh position={[0, 0.17, 0]} material={aluMat}>
          <boxGeometry args={[0.54, 0.34, 0.012]} />
        </mesh>
        {/* Bezel */}
        <mesh position={[0, 0.17, 0.007]} material={darkMat}>
          <boxGeometry args={[0.52, 0.32, 0.002]} />
        </mesh>
        {/* Glowing code screen */}
        <mesh position={[0, 0.17, 0.009]} material={screenMat}>
          <boxGeometry args={[0.48, 0.28, 0.002]} />
        </mesh>

        {/* Stylized code lines on screen */}
        <mesh position={[-0.05, 0.25, 0.011]} material={codeLineMat1}>
          <boxGeometry args={[0.32, 0.012, 0.001]} />
        </mesh>
        <mesh position={[-0.08, 0.22, 0.011]} material={codeLineMat2}>
          <boxGeometry args={[0.24, 0.012, 0.001]} />
        </mesh>
        <mesh position={[-0.02, 0.19, 0.011]} material={codeLineMat3}>
          <boxGeometry args={[0.36, 0.012, 0.001]} />
        </mesh>
        <mesh position={[-0.1, 0.16, 0.011]} material={codeLineMat1}>
          <boxGeometry args={[0.2, 0.012, 0.001]} />
        </mesh>
        <mesh position={[-0.04, 0.13, 0.011]} material={codeLineMat2}>
          <boxGeometry args={[0.28, 0.012, 0.001]} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Desk Lamp (Warm Anglepoise with Light Cone) ──────────────────────────────
function DeskLamp() {
  const bodyMat  = useMat(C.lampBody,  { roughness: 0.3, metalness: 0.4 });
  const brassMat = useMat(C.lampBrass, { roughness: 0.2, metalness: 0.8 });
  const shadeMat = useMat(C.lampBody,  { roughness: 0.4 });
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

          {/* Cone shade */}
          <group position={[0, 0.38, 0]} rotation={[0, 0, 0.7]}>
            <mesh position={[0, 0.05, 0]} material={shadeMat}>
              <coneGeometry args={[0.08, 0.14, 16, 1, true]} />
            </mesh>
            {/* Glowing bulb */}
            <mesh position={[0, 0.02, 0]} material={bulbMat}>
              <sphereGeometry args={[0.03, 12, 12]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

// ─── Raspberry Pi + Breadboard (The Lab) ──────────────────────────────────────
function RaspberryPi({ hovered }) {
  const groupRef = useRef();
  const pcbMat    = useMat(C.piPcb,    { roughness: 0.4 });
  const chipMat   = useMat(C.piChip,   { roughness: 0.2, metalness: 0.6 });
  const silverMat = useMat(C.piSilver, { roughness: 0.3, metalness: 0.9 });
  const goldMat   = useMat(C.piGold,   { roughness: 0.2, metalness: 0.8 });
  const bbMat     = useMat("#F8FAFC",  { roughness: 0.7 });

  const ledRedMat    = useMat("#EF4444", { emissive: "#DC2626", emissiveIntensity: 1.2 });
  const ledGreenMat  = useMat("#22C55E", { emissive: "#16A34A", emissiveIntensity: 1.5 });
  const ledYellowMat = useMat("#EAB308", { emissive: "#CA8A04", emissiveIntensity: hovered ? 2.5 : 1.2 });

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = hovered ? 1.08 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
  });

  return (
    <group ref={groupRef} name="obj_pi" position={[1.25, 0.77, -0.05]}>
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

// ─── Roadmap Whiteboard (Wall-mounted above desk) ─────────────────────────────
function RoadmapBoard({ hovered }) {
  const groupRef   = useRef();
  const frameMat   = useMat(C.wbFrame,    { roughness: 0.4, metalness: 0.5 });
  const faceMat    = useMat(C.wbFace,     { roughness: 0.2 });
  const yellowMat  = useMat(C.noteYellow, { roughness: 0.7 });
  const blueMat    = useMat(C.noteBlue,   { roughness: 0.7 });
  const greenMat   = useMat(C.noteGreen,  { roughness: 0.7 });
  const markerMat  = useMat(C.cobalt,     { roughness: 0.3 });

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = hovered ? 1.04 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
  });

  return (
    <group ref={groupRef} name="obj_whiteboard" position={[-0.3, 2.05, -2.46]}>
      {/* Aluminum frame */}
      <mesh material={frameMat}>
        <boxGeometry args={[1.5, 0.85, 0.04]} />
      </mesh>
      {/* Whiteboard magnetic dry-erase surface */}
      <mesh position={[0, 0, 0.021]} material={faceMat}>
        <boxGeometry args={[1.42, 0.77, 0.004]} />
      </mesh>

      {/* Header bar / title banner */}
      <mesh position={[0, 0.32, 0.024]} material={useMat("#CBD5E1", { roughness: 0.5 })}>
        <boxGeometry args={[1.34, 0.04, 0.002]} />
      </mesh>

      {/* Column 1: "NOW" sticky notes */}
      <mesh position={[-0.42, 0.12, 0.026]} material={yellowMat}>
        <boxGeometry args={[0.18, 0.14, 0.002]} />
      </mesh>
      <mesh position={[-0.42, -0.06, 0.026]} material={yellowMat}>
        <boxGeometry args={[0.18, 0.14, 0.002]} />
      </mesh>

      {/* Column 2: "NEXT" sticky notes */}
      <mesh position={[0, 0.12, 0.026]} material={blueMat}>
        <boxGeometry args={[0.18, 0.14, 0.002]} />
      </mesh>
      <mesh position={[0, -0.06, 0.026]} material={blueMat}>
        <boxGeometry args={[0.18, 0.14, 0.002]} />
      </mesh>
      <mesh position={[0, -0.22, 0.026]} material={blueMat}>
        <boxGeometry args={[0.18, 0.1, 0.002]} />
      </mesh>

      {/* Column 3: "LATER" sticky notes */}
      <mesh position={[0.42, 0.12, 0.026]} material={greenMat}>
        <boxGeometry args={[0.18, 0.14, 0.002]} />
      </mesh>
      <mesh position={[0.42, -0.06, 0.026]} material={greenMat}>
        <boxGeometry args={[0.18, 0.14, 0.002]} />
      </mesh>

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
function Notebook({ hovered }) {
  const groupRef = useRef();
  const coverMat = useMat(C.cobalt,    { roughness: 0.6 });
  const paperMat = useMat("#FFFDF7",   { roughness: 0.8 });
  const penMat   = useMat(C.lampBrass, { roughness: 0.2, metalness: 0.85 });
  const lineMat  = useMat("#94A3B8",   { roughness: 0.8 });

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = hovered ? 1.08 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
  });

  return (
    <group ref={groupRef} name="obj_notebook" position={[-1.0, 0.77, 0.28]} rotation={[0, 0.15, 0]}>
      {/* Open notebook base cover */}
      <mesh position={[0, 0.008, 0]} material={coverMat}>
        <boxGeometry args={[0.34, 0.016, 0.24]} />
      </mesh>
      {/* Cream paper pages */}
      <mesh position={[0, 0.018, 0]} material={paperMat}>
        <boxGeometry args={[0.32, 0.01, 0.22]} />
      </mesh>
      {/* Center spine gutter crease */}
      <mesh position={[0, 0.024, 0]} material={useMat("#E2E8F0")}>
        <boxGeometry args={[0.008, 0.002, 0.22]} />
      </mesh>

      {/* Mock sketch/code lines on left page */}
      {[-0.06, -0.03, 0.0, 0.03, 0.06].map((z, i) => (
        <mesh key={i} position={[-0.08, 0.024, z]} material={lineMat}>
          <boxGeometry args={[0.1, 0.001, 0.004]} />
        </mesh>
      ))}

      {/* Brass executive pen resting beside notebook */}
      <group position={[0.2, 0.016, 0]} rotation={[0, 0, 0.1]}>
        <mesh material={penMat}>
          <cylinderGeometry args={[0.006, 0.006, 0.2, 10]} />
        </mesh>
        <mesh position={[0, 0.08, 0]} material={penMat}>
          <coneGeometry args={[0.006, 0.03, 10]} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Desk Nameplate & Book Stack (Ventures Module) ───────────────────────────
function VenturesBooks({ hovered }) {
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
    <group ref={groupRef} name="obj_ventures" position={[0.68, 0.77, 0.28]} rotation={[0, -0.15, 0]}>
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
function PhoneStand({ hovered }) {
  const groupRef = useRef();
  const standMat  = useMat(C.macAluminum, { roughness: 0.3, metalness: 0.8 });
  const phoneMat  = useMat(C.phoneBody,   { roughness: 0.3, metalness: 0.5 });
  const screenMat = useMat(C.phoneScreen, {
    roughness: 0.15,
    emissive: C.phoneGlow,
    emissiveIntensity: hovered ? 1.5 : 0.8,
  });
  const bubbleMat = useMat(C.signal, { emissive: C.signal, emissiveIntensity: 1.0 });

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = hovered ? 1.08 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
  });

  return (
    <group ref={groupRef} name="obj_phone" position={[1.82, 0.77, 0.2]} rotation={[0, -0.3, 0]}>
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
function PottedPlant({ hovered }) {
  const groupRef = useRef();
  const potMat   = useMat(C.plantPot,   { roughness: 0.65 });
  const soilMat  = useMat(C.plantSoil,  { roughness: 0.95 });
  const leafMat1 = useMat(C.plantLeaf1, { roughness: 0.4 });
  const leafMat2 = useMat(C.plantLeaf2, { roughness: 0.4 });

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = hovered ? 1.08 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
  });

  return (
    <group ref={groupRef} name="obj_plant" position={[-1.78, 0.77, -0.08]}>
      {/* Terracotta ceramic pot */}
      <mesh position={[0, 0.07, 0]} material={potMat}>
        <cylinderGeometry args={[0.09, 0.07, 0.14, 16]} />
      </mesh>
      {/* Pot rim collar */}
      <mesh position={[0, 0.14, 0]} material={potMat}>
        <cylinderGeometry args={[0.096, 0.096, 0.02, 16]} />
      </mesh>
      {/* Dark rich potting soil */}
      <mesh position={[0, 0.138, 0]} material={soilMat}>
        <cylinderGeometry args={[0.085, 0.085, 0.01, 16]} />
      </mesh>

      {/* Main plant stem */}
      <mesh position={[0, 0.22, 0]} material={leafMat2}>
        <cylinderGeometry args={[0.008, 0.01, 0.18, 8]} />
      </mesh>

      {/* 5 Broad organic Monstera leaves around the stem */}
      {[0, 1, 2, 3, 4].map((i) => {
        const rad = (i * 2 * Math.PI) / 5;
        const cx = Math.cos(rad) * 0.06;
        const cz = Math.sin(rad) * 0.06;
        const elevation = 0.22 + (i % 2) * 0.05;
        return (
          <group
            key={i}
            position={[cx, elevation, cz]}
            rotation={[0.3, rad, -0.4 + (i % 2) * 0.2]}
            scale={[1.6, 0.8, 1]}
          >
            <mesh material={i % 2 === 0 ? leafMat1 : leafMat2}>
              <circleGeometry args={[0.06, 12]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ─── Ceramic Coffee Mug on Cork Coaster ───────────────────────────────────────
function CoffeeMug() {
  const ceramicMat = useMat(C.mugCeramic, { roughness: 0.2 });
  const coffeeMat  = useMat(C.mugCoffee,  { roughness: 0.3 });
  const coasterMat = useMat(C.coasterCork,{ roughness: 0.9 });

  return (
    <group position={[-0.65, 0.77, 0.32]}>
      {/* Cork coaster */}
      <mesh position={[0, 0.004, 0]} material={coasterMat}>
        <cylinderGeometry args={[0.065, 0.065, 0.008, 20]} />
      </mesh>
      {/* White ceramic mug body */}
      <mesh position={[0, 0.058, 0]} material={ceramicMat}>
        <cylinderGeometry args={[0.045, 0.04, 0.1, 18]} />
      </mesh>
      {/* Steaming dark coffee surface */}
      <mesh position={[0, 0.098, 0]} material={coffeeMat}>
        <cylinderGeometry args={[0.042, 0.042, 0.004, 18]} />
      </mesh>
      {/* Mug handle */}
      <mesh position={[0.048, 0.058, 0]} rotation={[0, 0, Math.PI / 2]} material={ceramicMat}>
        <torusGeometry args={[0.024, 0.006, 8, 16, Math.PI]} />
      </mesh>
    </group>
  );
}

// ─── Wall Floating Shelf with Books & Model Quadcopter Drone ───────────────────
function WallShelf() {
  const shelfMat = useMat(C.deskEdge, { roughness: 0.6 });
  const droneMat = useMat(C.signal,   { roughness: 0.3, metalness: 0.4 });
  const propMat  = useMat(C.ink,      { roughness: 0.5 });
  const propRef  = useRef();

  useFrame((_, delta) => {
    if (propRef.current) propRef.current.rotation.y += delta * 4;
  });

  return (
    <group position={[1.8, 2.8, -2.48]}>
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
        {/* 4 drone arm rods */}
        <mesh rotation={[0, Math.PI / 4, 0]} material={shelfMat}>
          <boxGeometry args={[0.24, 0.015, 0.015]} />
        </mesh>
        <mesh rotation={[0, -Math.PI / 4, 0]} material={shelfMat}>
          <boxGeometry args={[0.24, 0.015, 0.015]} />
        </mesh>
        {/* Spinning propeller pair */}
        <group ref={propRef} position={[0.08, 0.025, 0.08]}>
          <mesh material={propMat}>
            <boxGeometry args={[0.09, 0.003, 0.015]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ─── Floating 3D Beacon Indicator (Jesse Zhou inspired Pin) ───────────────────
function HotspotBeacon({ position, hovered, onClick }) {
  const ringRef = useRef();

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const t = clock.elapsedTime * 2.5;
    const scale = 1 + Math.sin(t) * 0.2;
    ringRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group position={position} onClick={onClick}>
      {/* Inner glowing signal core */}
      <mesh>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshStandardMaterial
          color={C.signal}
          emissive={C.signal}
          emissiveIntensity={hovered ? 2.8 : 1.6}
          roughness={0.2}
        />
      </mesh>
      {/* Outer pulsing beacon ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.045, 0.06, 24]} />
        <meshBasicMaterial
          color={C.signal}
          transparent
          opacity={hovered ? 0.9 : 0.55}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ─── 3D Coordinate Projector for screen-space labels (Zero createRoot / Zero unmount warning) ─
function HotspotProjector({ hotspots, labelRefs }) {
  const { camera, size } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!labelRefs?.current) return;
    hotspots.forEach((hs) => {
      const el = labelRefs.current[hs.id];
      if (!el) return;
      const pos = HOTSPOT_LABEL_POSITIONS[hs.id];
      if (!pos) return;
      v.set(pos[0], pos[1], pos[2]);
      v.project(camera);
      // Behind camera check
      if (v.z > 1) {
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
        return;
      }
      el.style.opacity = "1";
      el.style.pointerEvents = "auto";
      const x = ((v.x + 1) * size.width) / 2;
      const y = ((-v.y + 1) * size.height) / 2;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    });
  });

  return null;
}

// ─── Camera Rig: Smooth mouse parallax + responsive camera transitions ────────
const _scratch = new THREE.Vector3();
const DEG5 = (5 * Math.PI) / 180;
const DEG3 = (3 * Math.PI) / 180;

function CameraRig({ targetPose }) {
  const { camera, invalidate } = useThree();
  const mouse      = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart  = useRef({ x: 0, y: 0 });
  const dragRot    = useRef({ x: 0, y: 0 });
  const prevDragRot= useRef({ x: 0, y: 0 });

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
      invalidate();
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
  }, [invalidate]);

  // Reset drag rotation when target pose changes
  useEffect(() => {
    dragRot.current = { x: 0, y: 0 };
    prevDragRot.current = { x: 0, y: 0 };
  }, [targetPose]);

  useFrame((_, delta) => {
    const p = targetPose.position;
    const t = targetPose.target;

    const px = p.x + dragRot.current.y * 0.9;
    const py = p.y - dragRot.current.x * 0.5;
    const pz = p.z;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, px, 5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, py, 5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, pz, 5, delta);

    const parallaxX = mouse.current.x * DEG5;
    const parallaxY = mouse.current.y * DEG3;
    _scratch.set(t.x + parallaxX * 0.3, t.y - parallaxY * 0.2, t.z);
    camera.lookAt(_scratch);

    invalidate();
  });

  return null;
}

// ─── Coordinated, Spacious Hotspot Positions (Zero overlapping!) ──────────────
const HOTSPOT_BEACON_POSITIONS = {
  plant:      [-1.78, 1.02, -0.08],
  notebook:   [-1.0,  0.86,  0.28],
  laptop:     [-0.1,  1.12,  0.08],
  whiteboard: [-0.3,  2.15, -2.42],
  book:       [ 0.68, 0.92,  0.28],
  pi:         [ 1.25, 0.86, -0.05],
  phone:      [ 1.82, 0.96,  0.2 ],
};

const HOTSPOT_LABEL_POSITIONS = {
  plant:      [-1.78, 1.25, -0.08],
  notebook:   [-1.0,  1.08,  0.28],
  laptop:     [-0.1,  1.36,  0.08],
  whiteboard: [-0.3,  2.42, -2.42],
  book:       [ 0.68, 1.15,  0.28],
  pi:         [ 1.25, 1.08, -0.05],
  phone:      [ 1.82, 1.20,  0.2 ],
};

// ─── Inner Scene Assembler ────────────────────────────────────────────────────
function SceneContent({ targetPose, hotspots, onSelect, hoveredId, labelRefs }) {
  return (
    <>
      <CameraRig targetPose={targetPose} />
      <SceneLighting />
      <Room />
      <Desk />
      <Chair />
      <Laptop       hovered={hoveredId === "laptop"} />
      <DeskLamp />
      <RaspberryPi  hovered={hoveredId === "pi"} />
      <RoadmapBoard hovered={hoveredId === "whiteboard"} />
      <Notebook     hovered={hoveredId === "notebook"} />
      <VenturesBooks hovered={hoveredId === "book"} />
      <PhoneStand   hovered={hoveredId === "phone"} />
      <PottedPlant  hovered={hoveredId === "plant"} />
      <CoffeeMug />
      <WallShelf />

      {/* Screen coordinate projector for DOM labels */}
      <HotspotProjector hotspots={hotspots} labelRefs={labelRefs} />

      {/* 3D Pulsing Beacons on the desk objects */}
      {hotspots.map((hs) => {
        const beaconPos = HOTSPOT_BEACON_POSITIONS[hs.id];
        if (!beaconPos) return null;
        const isHovered = hoveredId === hs.id;
        return (
          <HotspotBeacon
            key={hs.id}
            position={beaconPos}
            hovered={isHovered}
            onClick={() => onSelect(hs.id)}
          />
        );
      })}
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
export default function Scene({ hotspots, selectedId, onSelect, onHover, labelRefs }) {
  const activePose = useMemo(() => {
    if (!selectedId) return defaultPose;
    const hs = hotspots.find((h) => h.id === selectedId);
    return hs ? hs.pose : defaultPose;
  }, [selectedId, hotspots]);

  return (
    <SceneErrorBoundary>
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        camera={{
          position: [defaultPose.position.x, defaultPose.position.y, defaultPose.position.z],
          fov: 46,
        }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
        style={{
          background: "radial-gradient(ellipse at 50% 30%, #172338 0%, #0B1220 100%)",
          width: "100%",
          height: "100%",
        }}
      >
        <DisposeCleaner />
        <SceneContent
          targetPose={activePose}
          hotspots={hotspots}
          onSelect={onSelect}
          hoveredId={selectedId}
          labelRefs={labelRefs}
        />
      </Canvas>
    </SceneErrorBoundary>
  );
}
