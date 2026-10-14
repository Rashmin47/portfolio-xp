"use client";

import { useEffect, useState } from "react";
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
      <p className="text-sm font-mono text-muted">
        Warming up the workshop…
      </p>
    </div>
  ),
});

/**
 * @param {{ hotspots: import("@/data/hotspots").hotspots }} props
 */
export default function WorkshopClient({ hotspots }) {
  const [capability, setCapability] = useState(null);

  useEffect(() => {
    setCapability(checkWorkshopCapability());
  }, []);

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
                  className="text-cobalt dark:text-sky hover:underline text-sm font-mono"
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

  return <Scene />;
}
