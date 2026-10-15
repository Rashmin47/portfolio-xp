"use client";

/**
 * HotspotBeacons
 * --------------
 * DOM overlay of hotspot buttons sitting on top of the 3D canvas. Each button
 * is projected to its 3D anchor by <BeaconProjector> inside the scene, so the
 * positions are written to the element styles (never rendered by React).
 *
 * - 44px touch target around a small signal dot with a pulsing ring
 * - label chip on hover, keyboard focus and touch press
 * - clicking opens the module dialog (the dialog's own button goes to the page)
 *
 * The layer itself is pointer-events:none so canvas drag still works in the
 * gaps; only the buttons opt back in (needed because body is pointer-events:none).
 * WorldCanvas does not render this layer at all when the capability check skips
 * the scene.
 */
export default function HotspotBeacons({ hotspots, beaconRefs, onHover, onSelect, opacity = 1 }) {
  return (
    <div
      className="fixed inset-0 z-10"
      style={{ pointerEvents: "none", opacity, transition: "opacity 600ms ease" }}
    >
      {hotspots.map((hotspot) => (
        <button
          key={hotspot.id}
          type="button"
          ref={(el) => {
            beaconRefs.current[hotspot.id] = el;
          }}
          aria-label={`${hotspot.label} — open details`}
          aria-haspopup="dialog"
          data-beacon={hotspot.id}
          className="group absolute top-0 left-0 flex h-11 w-11 items-center justify-center rounded-full opacity-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal/70"
          style={{
            pointerEvents: "auto",
            // Parked off-screen until the projector positions it
            transform: "translate3d(-9999px, -9999px, 0)",
            willChange: "transform",
          }}
          onClick={() => onSelect?.(hotspot.id)}
          onMouseEnter={() => onHover?.(hotspot.id)}
          onMouseLeave={() => onHover?.(null)}
          onFocus={() => onHover?.(hotspot.id)}
          onBlur={() => onHover?.(null)}
          onTouchStart={() => onHover?.(hotspot.id)}
        >
          {/* Pulsing ring */}
          <span
            aria-hidden="true"
            className="beacon-ring absolute h-7 w-7 rounded-full border border-signal/70"
          />

          {/* Core dot */}
          <span
            aria-hidden="true"
            className="relative h-2.5 w-2.5 rounded-full bg-signal shadow-[0_0_10px_#F2C81F] ring-2 ring-ink/40"
          />

          {/* Label chip */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-paper/15 bg-night-surface/95 px-2 py-1 font-mono text-[10px] font-semibold tracking-wide text-paper opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 group-active:opacity-100"
          >
            {hotspot.label}
          </span>
        </button>
      ))}
    </div>
  );
}
