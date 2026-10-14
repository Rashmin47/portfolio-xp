"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { checkWorkshopCapability } from "@/lib/workshop-capability";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center rounded-card border border-ink/10
                 dark:border-paper/10 bg-paper dark:bg-night-surface"
      style={{ height: "70vh", minHeight: "360px" }}
      aria-live="polite"
    >
      <p className="text-sm font-mono text-muted">Warming up the workshop…</p>
    </div>
  ),
});

/**
 * @param {{ hotspots: import("@/data/hotspots").hotspots }} props
 */
export default function WorkshopClient({ hotspots }) {
  const [capability, setCapability] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // Detect ?perf=1
  const showPerf = useMemo(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("perf") === "1";
  }, []);

  useEffect(() => {
    setCapability(checkWorkshopCapability());
  }, []);

  // Keyboard: Escape returns to desk
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setSelectedId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSelect = useCallback((id) => setSelectedId(id), []);

  // Still running capability check (first render / hydration)
  if (capability === null) {
    return null;
  }

  if (!capability.ok) {
    return (
      <div
        className="p-6 rounded-card border border-ink/10 dark:border-paper/10
                   bg-paper dark:bg-night-surface space-y-4"
        role="status"
        aria-live="polite"
      >
        <p className="text-base">
          {capability.reason} The 3D Workshop is unavailable here.
        </p>
        <nav aria-label="Classic navigation">
          <ul className="flex flex-wrap gap-3">
            {hotspots.map((spot) => (
              <li key={spot.id}>
                <Link
                  href={spot.href}
                  className="text-cobalt dark:text-sky hover:underline text-sm font-mono
                             focus:outline-none focus:ring-3 focus:ring-signal rounded"
                >
                  {spot.label} →
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Nav links that also select a hotspot (keyboard accessible) */}
      <nav aria-label="Select a workshop object" className="flex flex-wrap gap-2">
        {hotspots.map((spot) => (
          <button
            key={spot.id}
            onClick={() =>
              setSelectedId((prev) => (prev === spot.id ? null : spot.id))
            }
            aria-pressed={selectedId === spot.id}
            className={`px-3 py-1.5 rounded-card text-sm font-mono border transition-colors
                        focus:outline-none focus:ring-3 focus:ring-signal
                        ${
                          selectedId === spot.id
                            ? "bg-signal text-ink border-signal"
                            : "border-ink/15 dark:border-paper/15 hover:border-cobalt dark:hover:border-sky"
                        }`}
          >
            {spot.label}
          </button>
        ))}
        {selectedId && (
          <button
            onClick={() => setSelectedId(null)}
            className="px-3 py-1.5 rounded-card text-sm font-mono border border-ink/15
                       dark:border-paper/15 hover:border-cobalt dark:hover:border-sky
                       focus:outline-none focus:ring-3 focus:ring-signal transition-colors"
          >
            Back to desk
          </button>
        )}
      </nav>

      <Scene
        hotspots={hotspots}
        selectedId={selectedId}
        onSelect={handleSelect}
        showPerf={showPerf}
      />
    </div>
  );
}
