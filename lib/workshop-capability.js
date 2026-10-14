"use client";

/**
 * checkWorkshopCapability()
 *
 * Returns { ok: boolean, reason: string | null }.
 * Must be called client-side only (uses browser APIs).
 *
 * Rules:
 *  - No WebGL  → not ok (cannot be overridden)
 *  - prefers-reduced-motion: reduce → not ok
 *  - navigator.connection.saveData → not ok
 *  - navigator.deviceMemory < 4 GB → not ok
 *  - navigator.hardwareConcurrency <= 2 → not ok
 *
 * A ?force3d=1 query param overrides all checks except missing WebGL.
 */
export function checkWorkshopCapability() {
  // WebGL check – cannot be overridden
  if (typeof window === "undefined") {
    return { ok: false, reason: "Server environment" };
  }

  const hasWebGL = (() => {
    try {
      const canvas = document.createElement("canvas");
      return !!(
        canvas.getContext("webgl2") || canvas.getContext("webgl")
      );
    } catch {
      return false;
    }
  })();

  if (!hasWebGL) {
    return { ok: false, reason: "WebGL is not available on this device." };
  }

  // force3d=1 override – skips all remaining checks
  const force3d =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("force3d") === "1";

  if (force3d) {
    return { ok: true, reason: null };
  }

  // Reduced motion
  if (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return {
      ok: false,
      reason: "Reduced motion is enabled in your system settings.",
    };
  }

  // Data saver
  if (navigator.connection && navigator.connection.saveData) {
    return { ok: false, reason: "Data saver mode is active." };
  }

  // Low memory (< 4 GB)
  if (
    navigator.deviceMemory !== undefined &&
    navigator.deviceMemory < 4
  ) {
    return {
      ok: false,
      reason: "Device memory is too low for the 3D Workshop.",
    };
  }

  // Low CPU
  if (
    navigator.hardwareConcurrency !== undefined &&
    navigator.hardwareConcurrency <= 2
  ) {
    return {
      ok: false,
      reason: "Too few CPU cores available for the 3D Workshop.",
    };
  }

  return { ok: true, reason: null };
}
