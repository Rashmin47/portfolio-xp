"use client";

/**
 * Panel
 * -----
 * Desktop: left-aligned sidebar panel, max 640px, scrollable.
 *   - solid night-surface (#131D33) at 92% opacity
 *   - 1px hairline border (ink/15)
 *   - no blur
 *   - pointer-events: auto (so the 3D scene is clickable through gaps)
 *
 * Mobile: bottom sheet occupying ~62% of viewport height.
 *   - Has a visible handle bar to collapse to a 72px peek bar.
 *   - Peek state shows the header/peek content so the user knows there's content.
 *
 * Single-render: children are rendered exactly once to preserve state,
 * unique IDs (like #main-content), and avoid DOM duplication.
 */

import { useState } from "react";

export default function Panel({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`fixed z-10 flex flex-col pointer-events-none transition-all duration-300
        /* Desktop: fixed left-aligned sidebar */
        md:top-0 md:left-0 md:bottom-0 md:w-[min(640px,48vw)] md:h-full md:border-r md:border-paper/10
        /* Mobile: fixed bottom sheet */
        left-0 right-0 bottom-0 max-md:border-t max-md:border-paper/10 max-md:rounded-t-2xl
        ${collapsed ? "max-md:h-[72px]" : "max-md:h-[62vh]"}
      `}
      style={{
        background: "rgba(19, 29, 51, 0.92)",
      }}
    >
      {/* Mobile handle bar to collapse/expand bottom sheet */}
      <div className="md:hidden flex items-center justify-center py-2 px-4 border-b border-paper/10 pointer-events-auto shrink-0">
        <button
          type="button"
          aria-label={collapsed ? "Expand panel" : "Collapse panel"}
          onClick={() => setCollapsed((c) => !c)}
          className="w-full py-1 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-signal"
        >
          <span className="w-10 h-1 bg-paper/30 rounded-full" />
        </button>
      </div>

      {/* Scrollable content container */}
      <div
        className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden pointer-events-auto ${
          collapsed ? "max-md:overflow-hidden" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}
