"use client";

/**
 * checkWorldCapability()
 *
 * Returns { ok: boolean, reason: string | null, reducedMotion: boolean }.
 *
 * Blocking conditions (ok = false):
 *  - No WebGL
 *  - navigator.connection.saveData
 *  - navigator.deviceMemory < 2 GB
 *  - navigator.hardwareConcurrency <= 1
 *
 * Non-blocking (scene still renders):
 *  - prefers-reduced-motion: camera moves become instant jumps in the rig
 *
 * Override:
 *  - ?force3d=1 skips all checks except missing WebGL
 */
export function checkWorldCapability() {
  if (typeof window === "undefined") {
    return { ok: false, reason: "Server environment", reducedMotion: false };
  }

  // WebGL check — cannot be overridden
  const hasWebGL = (() => {
    try {
      const canvas = document.createElement("canvas");
      return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      return false;
    }
  })();

  if (!hasWebGL) {
    return { ok: false, reason: "WebGL is not available on this device.", reducedMotion: false };
  }

  // Detect reduced motion (non-blocking)
  const reducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // force3d=1 override — skips remaining capability checks
  const force3d =
    new URLSearchParams(window.location.search).get("force3d") === "1";

  if (force3d) {
    return { ok: true, reason: null, reducedMotion };
  }

  // Data saver
  if (navigator.connection && navigator.connection.saveData) {
    return { ok: false, reason: "Data saver mode is active.", reducedMotion };
  }

  // Low memory (< 2 GB threshold — less strict than old 4 GB)
  if (navigator.deviceMemory !== undefined && navigator.deviceMemory < 2) {
    return { ok: false, reason: "Device memory is too low.", reducedMotion };
  }

  // Very low CPU (single core)
  if (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 1) {
    return { ok: false, reason: "Too few CPU cores available.", reducedMotion };
  }

  return { ok: true, reason: null, reducedMotion };
}
