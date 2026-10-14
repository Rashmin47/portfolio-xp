"use client";

import { Component, useRef, useEffect, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Link from "next/link";
import { defaultPose } from "@/data/hotspots";

// ─── Colour palette (matches design tokens) ───────────────────────────────────
const C = {
  ink:         "#0E1726",
  paper:       "#F4F6FB",
  cobalt:      "#2F5BEA",
  sky:         "#62C0FF",
  signal:      "#F2C81F",
  board:       "#2EA84B",
  screen:      "#04376B",
  night:       "#0B1220",
  nightSurf:   "#131D33",
  muted:       "#5B6578",
  wall:        "#D6DCF0",
  floor:       "#C8CFDF",
  desk:        "#9CA3B4",
  deskEdge:    "#7A8099",
  mugBody:     "#F4F6FB",
  mugDrink:    "#6B4226",
  coaster:     "#C6A97C",
  cableCol:    "#E8EAEE",
  propeller:   "#F2C81F",
  wbFrame:     "#0E1726",
  wbFace:      "#F8F9FC",
  chipCol:     "#222831",
  portCol:     "#D1D5DB",
  window:      "#62C0FF",
  ledYellow:   "#F2C81F",
  ledRed:      "#E53E3E",
};

// ─── Lighting presets per time-of-day ─────────────────────────────────────────
const LIGHTING = {
  day: {
    bg:        "#C8DCF5",
    ambient:   { color: "#ffffff", intensity: 1.0 },
    sun:       { color: "#FFF8E7", intensity: 1.8, pos: [5, 8, 4] },
    fill:      { color: "#A8C8FF", intensity: 0.4, pos: [-4, 3, 3] },
  },
  evening: {
    bg:        "#F5A560",
    ambient:   { color: "#FFD0A0", intensity: 0.7 },
    sun:       { color: "#FF8C42", intensity: 1.2, pos: [6, 3, 4] },
    fill:      { color: "#9B59B6", intensity: 0.3, pos: [-4, 2, 3] },
  },
  night: {
    bg:        "#0B1220",
    ambient:   { color: "#1A2A4A", intensity: 0.4 },
    sun:       { color: "#4466AA", intensity: 0.3, pos: [3, 6, 3] },
    fill:      { color: "#F2C81F", intensity: 0.6, pos: [0, 1.2, 1] },
  },
};

function getTimeOfDay() {
  if (typeof window !== "undefined") {
    const p = new URLSearchParams(window.location.search).get("time");
    if (p === "day" || p === "evening" || p === "night") return p;
  }
  // Kathmandu = UTC+5:45
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const ktm = new Date(utc + 5 * 3600000 + 45 * 60000);
  const h = ktm.getHours();
  if (h >= 6 && h < 17) return "day";
  if (h >= 17 && h < 19) return "evening";
  return "night";
}

// ─── Shared material cache to avoid per-frame allocations ─────────────────────
function useMat(color, opts = {}) {
  return useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        roughness:  opts.roughness  ?? 0.8,
        metalness:  opts.metalness  ?? 0.0,
        emissive:   opts.emissive   ? new THREE.Color(opts.emissive) : undefined,
        emissiveIntensity: opts.emissiveIntensity ?? 0,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [color, opts.roughness, opts.metalness, opts.emissive, opts.emissiveIntensity]
  );
}

// ─── Room ─────────────────────────────────────────────────────────────────────
function Room({ tod }) {
  const wallMat  = useMat(LIGHTING[tod].bg, { roughness: 1 });
  const floorMat = useMat(C.floor, { roughness: 0.9 });
  return (
    <group name="obj_room">
      {/* back wall */}
      <mesh position={[0, 2, -2.5]} material={wallMat}>
        <planeGeometry args={[10, 6]} />
      </mesh>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} material={floorMat}>
        <planeGeometry args={[10, 8]} />
      </mesh>
    </group>
  );
}

// ─── Window ───────────────────────────────────────────────────────────────────
function WindowPane({ tod }) {
  const skyCol = tod === "night" ? "#0B1F40" : tod === "evening" ? "#F5A560" : C.window;
  const mat = useMat(skyCol, { roughness: 1, metalness: 0 });
  const frameMat = useMat(C.wbFrame, { roughness: 0.7 });
  return (
    <group name="obj_window" position={[-2.4, 2.0, -2.45]}>
      {/* pane */}
      <mesh material={mat}>
        <planeGeometry args={[1.2, 1.0]} />
      </mesh>
      {/* frame top/bottom */}
      {[-0.52, 0.52].map((y, i) => (
        <mesh key={i} position={[0, y, 0.01]} material={frameMat}>
          <boxGeometry args={[1.24, 0.04, 0.04]} />
        </mesh>
      ))}
      {/* frame left/right */}
      {[-0.62, 0.62].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.01]} material={frameMat}>
          <boxGeometry args={[0.04, 1.0, 0.04]} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Desk ─────────────────────────────────────────────────────────────────────
function Desk() {
  const topMat  = useMat(C.desk,     { roughness: 0.6 });
  const legMat  = useMat(C.deskEdge, { roughness: 0.7 });
  return (
    <group name="obj_desk">
      {/* desk top */}
      <mesh position={[0, 0.72, 0]} material={topMat}>
        <boxGeometry args={[2.8, 0.05, 1.0]} />
      </mesh>
      {/* four legs */}
      {[[-1.3, -0.4], [1.3, -0.4], [-1.3, 0.4], [1.3, 0.4]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.35, z]} material={legMat}>
          <boxGeometry args={[0.05, 0.7, 0.05]} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Laptop ───────────────────────────────────────────────────────────────────
function Laptop({ hovered }) {
  const baseMat   = useMat("#B8BFD0", { roughness: 0.5, metalness: 0.2 });
  const screenMat = useMat(C.screen,  { roughness: 0.3, metalness: 0.1 });
  const scale     = hovered ? 1.03 : 1.0;
  return (
    <group name="obj_laptop" position={[0, 0.75, -0.1]} scale={[scale, scale, scale]}>
      {/* base */}
      <mesh position={[0, 0.02, 0.05]} material={baseMat}>
        <boxGeometry args={[0.52, 0.025, 0.35]} />
      </mesh>
      {/* lid (angled back ~100°) */}
      <group position={[0, 0.025, -0.125]} rotation={[-1.22, 0, 0]}>
        <mesh material={baseMat}>
          <boxGeometry args={[0.52, 0.32, 0.018]} />
        </mesh>
        {/* screen */}
        <mesh position={[0, 0, 0.011]} material={screenMat}>
          <boxGeometry args={[0.46, 0.27, 0.001]} />
        </mesh>
      </group>
      {/* keyboard area */}
      <mesh position={[0, 0.034, 0.04]} material={useMat("#9AA0B0", { roughness: 0.9 })}>
        <boxGeometry args={[0.44, 0.002, 0.22]} />
      </mesh>
    </group>
  );
}

// ─── Raspberry Pi ─────────────────────────────────────────────────────────────
function RaspberryPi({ hovered }) {
  const boardMat = useMat(C.board,   { roughness: 0.7 });
  const portMat  = useMat(C.portCol, { roughness: 0.6 });
  const chipMat  = useMat(C.chipCol, { roughness: 0.4, metalness: 0.3 });
  const ledMat1  = useMat(C.board,   { emissive: C.board,   emissiveIntensity: 1.2 });
  const ledMat2  = useMat(C.signal,  { emissive: C.signal,  emissiveIntensity: 1.0 });
  const scale    = hovered ? 1.03 : 1.0;
  // Real Pi: 85mm x 56mm → scale to ~0.18 x 0.12 units
  return (
    <group name="obj_pi" position={[0.85, 0.745, -0.05]} scale={[scale, scale, scale]}>
      {/* board */}
      <mesh material={boardMat}>
        <boxGeometry args={[0.18, 0.008, 0.12]} />
      </mesh>
      {/* USB ports x2 */}
      {[0.04, 0.08].map((z, i) => (
        <mesh key={i} position={[0.06, 0.012, z - 0.04]} material={portMat}>
          <boxGeometry args={[0.028, 0.016, 0.022]} />
        </mesh>
      ))}
      {/* HDMI port */}
      <mesh position={[0.04, 0.012, -0.055]} material={portMat}>
        <boxGeometry args={[0.022, 0.012, 0.012]} />
      </mesh>
      {/* Ethernet */}
      <mesh position={[0.065, 0.014, 0.05]} material={portMat}>
        <boxGeometry args={[0.026, 0.018, 0.022]} />
      </mesh>
      {/* SoC chip */}
      <mesh position={[-0.02, 0.012, 0.01]} material={chipMat}>
        <boxGeometry args={[0.04, 0.01, 0.04]} />
      </mesh>
      {/* Green LED */}
      <mesh position={[-0.06, 0.012, -0.04]} material={ledMat1}>
        <sphereGeometry args={[0.005, 6, 6]} />
      </mesh>
      {/* Yellow LED */}
      <mesh position={[-0.06, 0.012, -0.03]} material={ledMat2}>
        <sphereGeometry args={[0.005, 6, 6]} />
      </mesh>
    </group>
  );
}

// ─── Cable (TubeGeometry on CatmullRomCurve3) ─────────────────────────────────
function Cable() {
  const mat = useMat(C.cableCol, { roughness: 0.8 });
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.26,  0.76, -0.05),
      new THREE.Vector3(0.45,  0.82, -0.10),
      new THREE.Vector3(0.65,  0.80,  0.00),
      new THREE.Vector3(0.76,  0.76, -0.05),
    ]);
    return new THREE.TubeGeometry(curve, 12, 0.004, 6, false);
  }, []);

  useEffect(() => () => geo.dispose(), [geo]);

  return (
    <group name="obj_cable">
      <mesh geometry={geo} material={mat} />
    </group>
  );
}

// ─── LED tray ─────────────────────────────────────────────────────────────────
function LedTray() {
  const trayMat = useMat("#888FA0", { roughness: 0.8 });
  return (
    <group name="obj_led_tray" position={[1.1, 0.748, -0.05]}>
      {/* tray base */}
      <mesh material={trayMat}>
        <boxGeometry args={[0.12, 0.008, 0.04]} />
      </mesh>
      {/* 5 yellow + 5 red small sphere LEDs */}
      {Array.from({ length: 10 }).map((_, i) => {
        const isYellow = i < 5;
        const col      = isYellow ? C.ledYellow : C.ledRed;
        const mat      = new THREE.MeshStandardMaterial({
          color: col,
          emissive: new THREE.Color(col),
          emissiveIntensity: 0.6,
          roughness: 0.4,
        });
        const x = -0.045 + (i % 5) * 0.022;
        const z = isYellow ? -0.008 : 0.008;
        return (
          <mesh key={i} position={[x, 0.01, z]} material={mat}>
            <sphereGeometry args={[0.006, 6, 6]} />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── Mug on coaster ───────────────────────────────────────────────────────────
function Mug() {
  const mugMat     = useMat(C.mugBody, { roughness: 0.6 });
  const drinkMat   = useMat(C.mugDrink, { roughness: 0.9 });
  const coasterMat = useMat(C.coaster,  { roughness: 0.9 });
  return (
    <group name="obj_mug" position={[-1.0, 0.75, -0.1]}>
      {/* coaster */}
      <mesh position={[0, 0, 0]} material={coasterMat} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.005, 16]} />
      </mesh>
      {/* mug body */}
      <mesh position={[0, 0.058, 0]} material={mugMat}>
        <cylinderGeometry args={[0.035, 0.03, 0.1, 16, 1, true]} />
      </mesh>
      {/* mug bottom */}
      <mesh position={[0, 0.009, 0]} material={mugMat}>
        <cylinderGeometry args={[0.03, 0.03, 0.004, 16]} />
      </mesh>
      {/* drink surface */}
      <mesh position={[0, 0.108, 0]} material={drinkMat}>
        <cylinderGeometry args={[0.033, 0.033, 0.002, 16]} />
      </mesh>
      {/* handle — two cylinders */}
      <mesh position={[0.042, 0.055, 0]} rotation={[0, 0, Math.PI / 2]} material={mugMat}>
        <torusGeometry args={[0.022, 0.004, 6, 12, Math.PI]} />
      </mesh>
    </group>
  );
}

// ─── Whiteboard ───────────────────────────────────────────────────────────────
function Whiteboard({ hovered }) {
  const frameMat = useMat(C.wbFrame, { roughness: 0.7 });
  const faceMat  = useMat(C.wbFace,  { roughness: 0.95 });
  const scale    = hovered ? 1.03 : 1.0;
  return (
    <group name="obj_whiteboard" position={[-0.4, 1.6, -2.44]} scale={[scale, scale, scale]}>
      {/* face */}
      <mesh material={faceMat}>
        <planeGeometry args={[0.9, 0.56]} />
      </mesh>
      {/* frame edges */}
      {[
        { pos: [0,  0.30, 0.01], size: [0.92, 0.025, 0.015] },
        { pos: [0, -0.30, 0.01], size: [0.92, 0.025, 0.015] },
        { pos: [-0.47, 0, 0.01], size: [0.025, 0.56, 0.015] },
        { pos: [0.47,  0, 0.01], size: [0.025, 0.56, 0.015] },
      ].map(({ pos, size }, i) => (
        <mesh key={i} position={pos} material={frameMat}>
          <boxGeometry args={size} />
        </mesh>
      ))}
      {/* marker tray */}
      <mesh position={[0, -0.32, 0.02]} material={frameMat}>
        <boxGeometry args={[0.4, 0.012, 0.025]} />
      </mesh>
    </group>
  );
}

// ─── Propellers (two, on back wall) ──────────────────────────────────────────
function Propeller({ position }) {
  const ref   = useRef();
  const mat   = useMat(C.propeller, { roughness: 0.6 });
  const hubMat = useMat(C.ink,      { roughness: 0.5 });

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.4;
  });

  // Three-blade geometry
  const bladeMat = mat;
  return (
    <group name="obj_propeller" position={position}>
      {/* hub */}
      <mesh material={hubMat}>
        <cylinderGeometry args={[0.018, 0.018, 0.02, 10]} />
      </mesh>
      {/* 3 blades, each a flat box rotated 120° */}
      <group ref={ref}>
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            material={bladeMat}
            position={[
              Math.cos((i * 2 * Math.PI) / 3) * 0.07,
              0,
              Math.sin((i * 2 * Math.PI) / 3) * 0.07,
            ]}
            rotation={[0, (i * 2 * Math.PI) / 3, 0]}
          >
            <boxGeometry args={[0.09, 0.01, 0.025]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ─── Lighting ─────────────────────────────────────────────────────────────────
function SceneLighting({ tod }) {
  const preset = LIGHTING[tod];
  return (
    <>
      <ambientLight color={preset.ambient.color} intensity={preset.ambient.intensity} />
      <directionalLight
        color={preset.sun.color}
        intensity={preset.sun.intensity}
        position={preset.sun.pos}
      />
      <directionalLight
        color={preset.fill.color}
        intensity={preset.fill.intensity}
        position={preset.fill.pos}
      />
    </>
  );
}

// ─── Camera rig with parallax ─────────────────────────────────────────────────
const DEG8 = (8 * Math.PI) / 180;
const DEG4 = (4 * Math.PI) / 180;
const _scratch = new THREE.Vector3();
const _q       = new THREE.Quaternion();
const _euler   = new THREE.Euler();

function CameraRig({ targetPose }) {
  const { camera, invalidate } = useThree();
  const mouse      = useRef({ x: 0, y: 0 });
  const isMoving   = useRef(false);
  const stopTimer  = useRef(null);

  // Listen to pointer move for parallax
  useEffect(() => {
    function onPointerMove(e) {
      mouse.current.x = (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      isMoving.current = true;
      invalidate();
      clearTimeout(stopTimer.current);
      stopTimer.current = setTimeout(() => {
        isMoving.current = false;
      }, 800);
    }
    window.addEventListener("pointermove", onPointerMove);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      clearTimeout(stopTimer.current);
    };
  }, [invalidate]);

  // Set camera instantly on first mount and on pose change
  useEffect(() => {
    const p = targetPose.position;
    const t = targetPose.target;
    camera.position.set(p.x, p.y, p.z);
    camera.lookAt(t.x, t.y, t.z);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_, delta) => {
    const p = targetPose.position;
    const t = targetPose.target;

    // Damp camera position toward target pose
    _scratch.set(p.x, p.y, p.z);
    const prevX = camera.position.x;
    const prevY = camera.position.y;
    const prevZ = camera.position.z;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, _scratch.x, 6, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, _scratch.y, 6, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, _scratch.z, 6, delta);

    const moved =
      Math.abs(camera.position.x - prevX) > 0.0001 ||
      Math.abs(camera.position.y - prevY) > 0.0001 ||
      Math.abs(camera.position.z - prevZ) > 0.0001;

    // Apply parallax offset
    const parallaxX = mouse.current.x * DEG8;
    const parallaxY = mouse.current.y * DEG4;

    // Look at target + parallax
    _scratch.set(t.x + parallaxX * 0.5, t.y - parallaxY * 0.3, t.z);
    camera.lookAt(_scratch);

    if (moved || isMoving.current) invalidate();
  });

  return null;
}

// ─── Hotspot click handler inside Canvas ──────────────────────────────────────
function HotspotMesh({ position, onSelect, id }) {
  const ref = useRef();
  const mat = useMat(C.signal, { roughness: 0.4, emissive: C.signal, emissiveIntensity: 0.3 });

  return (
    <mesh
      ref={ref}
      position={position}
      material={mat}
      onClick={(e) => { e.stopPropagation(); onSelect(id); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = ""; }}
    >
      <sphereGeometry args={[0.04, 10, 10]} />
    </mesh>
  );
}

// ─── Perf overlay (DOM, no Three dep) ────────────────────────────────────────
function PerfOverlay({ glRef }) {
  const overlayRef = useRef(null);
  const frames     = useRef([]);

  useEffect(() => {
    let raf;
    let lastTime = performance.now();
    let lastUpdate = 0;

    function tick() {
      const now = performance.now();
      const dt  = now - lastTime;
      lastTime  = now;
      frames.current.push(1000 / dt);
      if (frames.current.length > 60) frames.current.shift();

      if (now - lastUpdate > 500 && overlayRef.current) {
        lastUpdate = now;
        const fps  = Math.round(
          frames.current.reduce((a, b) => a + b, 0) / frames.current.length
        );
        const info = glRef.current?.info?.render;
        overlayRef.current.textContent =
          `FPS: ${fps}` +
          (info
            ? ` | calls: ${info.calls} | tris: ${info.triangles} | geo: ${glRef.current.info.memory.geometries} | tex: ${glRef.current.info.memory.textures}`
            : "");
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [glRef]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        bottom: 12,
        right: 12,
        background: "rgba(11,18,32,0.85)",
        color: "#F2C81F",
        fontFamily: "monospace",
        fontSize: 11,
        padding: "4px 8px",
        borderRadius: 6,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      FPS: --
    </div>
  );
}

// ─── GL ref capture ───────────────────────────────────────────────────────────
function GlCapture({ glRef }) {
  const { gl } = useThree();
  useEffect(() => { glRef.current = gl; }, [gl, glRef]);
  return null;
}

// ─── Inner scene (used inside Canvas) ────────────────────────────────────────
function SceneContent({ tod, targetPose, hotspots, onSelect, hoveredId }) {
  return (
    <>
      <CameraRig targetPose={targetPose} />
      <SceneLighting tod={tod} />
      <Room tod={tod} />
      <WindowPane tod={tod} />
      <Desk />
      <Laptop hovered={hoveredId === "laptop"} />
      <RaspberryPi hovered={hoveredId === "pi"} />
      <Cable />
      <LedTray />
      <Mug />
      <Whiteboard hovered={hoveredId === "whiteboard"} />
      <Propeller position={[1.6, 2.1, -2.42]} />
      <Propeller position={[2.1, 2.1, -2.42]} />
      {/* Hotspot indicators */}
      {hotspots.map((hs) => {
        const p =
          hs.id === "laptop"     ? [0,    1.22, -0.05] :
          hs.id === "pi"         ? [0.85, 1.00, -0.05] :
          /* whiteboard */         [-0.4, 1.82, -2.38];
        return (
          <HotspotMesh
            key={hs.id}
            id={hs.id}
            position={p}
            onSelect={onSelect}
          />
        );
      })}
    </>
  );
}

// ─── Detail panel (DOM, outside Canvas) ───────────────────────────────────────
function HotspotPanel({ hotspot, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    panelRef.current?.focus();
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!hotspot) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={hotspot.label}
      aria-live="polite"
      ref={panelRef}
      tabIndex={-1}
      style={{ outline: "none" }}
      className="absolute top-4 right-4 z-20 w-72 p-5 rounded-card
                 bg-paper dark:bg-night-surface border border-ink/10 dark:border-paper/10
                 shadow-lg space-y-3 focus:ring-3 focus:ring-signal"
    >
      <h2 className="text-xl font-bold font-display">{hotspot.label}</h2>
      <p className="text-sm text-muted">{hotspot.description}</p>
      <div className="flex gap-3 items-center flex-wrap pt-1">
        <Link
          href={hotspot.href}
          className="px-4 py-2 rounded-card bg-cobalt text-paper text-sm font-medium
                     hover:bg-cobalt/90 transition-colors focus:outline-none
                     focus:ring-3 focus:ring-signal"
        >
          Open page →
        </Link>
        <button
          onClick={onClose}
          className="text-sm text-muted hover:text-ink dark:hover:text-paper
                     focus:outline-none focus:ring-3 focus:ring-signal rounded"
        >
          Back to desk
        </button>
      </div>
    </div>
  );
}

// ─── Error boundary ───────────────────────────────────────────────────────────
function SceneFallback() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded-card
                 border border-ink/10 dark:border-paper/10 bg-paper dark:bg-night-surface p-6"
      style={{ height: "70vh", minHeight: "360px" }}
      role="alert"
    >
      <p className="text-sm text-muted text-center">
        The 3D scene could not be loaded. Use the links below to navigate.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        {[
          { label: "Shipped",   href: "/projects" },
          { label: "The Lab",   href: "/lab" },
          { label: "Roadmap",   href: "/roadmap" },
        ].map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="text-cobalt dark:text-sky hover:underline text-sm font-mono"
          >
            {label} →
          </Link>
        ))}
      </div>
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

// ─── Dispose helper ───────────────────────────────────────────────────────────
function useDispose(scene) {
  useEffect(() => {
    return () => {
      if (!scene) return;
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
    };
  }, [scene]);
}

function DisposeCleaner() {
  const { scene } = useThree();
  useDispose(scene);
  return null;
}

// ─── Root export ──────────────────────────────────────────────────────────────
/**
 * @param {{ hotspots: import("@/data/hotspots").hotspots, selectedId: string|null, onSelect: (id:string|null)=>void, showPerf: boolean }} props
 */
export default function Scene({ hotspots, selectedId, onSelect, showPerf }) {
  const tod = useMemo(() => getTimeOfDay(), []);
  const bg  = LIGHTING[tod].bg;

  const activePose = useMemo(() => {
    if (!selectedId) return defaultPose;
    const hs = hotspots.find((h) => h.id === selectedId);
    return hs ? hs.pose : defaultPose;
  }, [selectedId, hotspots]);

  const activeHotspot = selectedId ? hotspots.find((h) => h.id === selectedId) : null;

  const glRef = useRef(null);

  const handleClose = useCallback(() => onSelect(null), [onSelect]);

  return (
    <SceneErrorBoundary>
      <div
        className="relative rounded-card overflow-hidden border border-ink/10 dark:border-paper/10"
        style={{ height: "70vh", minHeight: "360px" }}
      >
        <Canvas
          frameloop="demand"
          dpr={[1, 1.5]}
          camera={{ position: [defaultPose.position.x, defaultPose.position.y, defaultPose.position.z], fov: 45 }}
          gl={{ antialias: true }}
          style={{ background: bg }}
        >
          <GlCapture glRef={glRef} />
          <DisposeCleaner />
          <SceneContent
            tod={tod}
            targetPose={activePose}
            hotspots={hotspots}
            onSelect={onSelect}
            hoveredId={selectedId}
          />
        </Canvas>

        <HotspotPanel hotspot={activeHotspot} onClose={handleClose} />

        {showPerf && <PerfOverlay glRef={glRef} />}
      </div>
    </SceneErrorBoundary>
  );
}
