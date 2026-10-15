"use client";

/**
 * WorldCanvas
 * -----------
 * A fixed, full-viewport 3D scene that sits behind every page (z-index: 0).
 * The Scene is loaded lazily after hydration via requestIdleCallback so it
 * never enters the initial page bundle.
 *
 * Reduced motion: scene still renders but camera transitions become instant
 * jumps (no damp). Parallax and idle animations stop.
 * Fallback (no WebGL / saveData / low memory): nothing renders — the page
 * body background (#0B1220) shows instead.
 */

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { hotspots, routePoses, defaultPose } from "@/data/hotspots";
import { checkWorldCapability } from "@/lib/world-capability";

const Scene = dynamic(() => import("@/components/workshop/Scene"), {
  ssr: false,
  loading: () => null, // no spinner — HTML text is already visible
});

export default function WorldCanvas() {
  const pathname = usePathname();
  const router   = useRouter();

  const [cap, setCap]         = useState(null); // null = not yet checked
  const [sceneReady, setSceneReady] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const labelRefs = useRef({});

  // ── 1. Run capability check after hydration (idle) ──────────────────────────
  useEffect(() => {
    const run = () => {
      const result = checkWorldCapability();
      setCap(result);
    };

    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(run, { timeout: 2000 });
      return () => cancelIdleCallback(id);
    } else {
      // Fallback for Safari
      const id = setTimeout(run, 200);
      return () => clearTimeout(id);
    }
  }, []);

  // ── 2. Fade in once the scene signals it has rendered ───────────────────────
  const handleSceneReady = useCallback(() => {
    if (sceneReady) return;
    setSceneReady(true);

    // First-visit: fade in over 600 ms (once per session)
    const key = "world-intro-done";
    const alreadySeen = sessionStorage.getItem(key);
    if (!alreadySeen) {
      sessionStorage.setItem(key, "1");
      // Small delay so first frame is painted before we start the fade
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setOpacity(1));
      });
    } else {
      setOpacity(1);
    }
  }, [sceneReady]);

  // ── 3. Hotspot click → router.push ──────────────────────────────────────────
  const handleSelect = useCallback((id) => {
    const hs = hotspots.find((h) => h.id === id);
    if (hs) router.push(hs.href);
  }, [router]);

  // ── 4. Resolve camera pose for current route ─────────────────────────────────
  const targetPose = routePoses[pathname] || defaultPose;

  // ── 5. Not yet checked or capability ok=false → don't render canvas ──────────
  if (cap === null || !cap.ok) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "auto",  // scene receives pointer events (drag/orbit)
        opacity,
        transition: sceneReady ? "opacity 600ms ease" : "none",
        background: "#0B1220",
      }}
    >
      <Scene
        hotspots={hotspots}
        targetPose={targetPose}
        onSelect={handleSelect}
        labelRefs={labelRefs}
        onReady={handleSceneReady}
        reducedMotion={cap?.reducedMotion}
      />
    </div>
  );
}
