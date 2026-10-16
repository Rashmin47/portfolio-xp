"use client";

import { useState } from "react";

/**
 * HeroWidgetShell
 * ---------------
 * Client shell for the homepage hero widget: it owns the fixed position in the
 * upper-left over the empty wall, the mobile strip toggle, and the "Open
 * Terminal" control (which asks the app shell to open the terminal window by
 * event, so the widget stays decoupled from Panel).
 *
 * All copy, the H1 and the links are passed in as children and remain
 * server-rendered: the widget's text is in the HTML before any JS runs.
 */
export default function HeroWidgetShell({ heading, actions, children }) {
  const [expanded, setExpanded] = useState(false);

  const openTerminal = () => {
    window.dispatchEvent(new CustomEvent("workshop:open-terminal"));
  };

  return (
    <div className="fixed z-10 top-8 left-3 right-3 sm:left-6 sm:top-10 w-auto max-w-[380px] max-h-[40vh] flex flex-col pointer-events-none">
      <section className="flex flex-col min-h-0 rounded-[14px] border border-chrome-text/15 bg-chrome/95 pointer-events-auto max-md:rounded-[14px]">
        {/* Heading row: the H1 stays visible even when the body is collapsed */}
        <div className="flex items-start gap-2 p-3.5">
          <div className="min-w-0 flex-1">{heading}</div>
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
            aria-controls="hero-widget-body"
            title={expanded ? "Collapse details" : "Expand details"}
            className="md:hidden shrink-0 -mt-0.5 -mr-0.5 p-1.5 rounded-[10px] text-chrome-text hover:bg-chrome-text/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus-ring transition-colors"
          >
            <span aria-hidden="true" className="block text-[10px] leading-none">
              {expanded ? "▲" : "▼"}
            </span>
            <span className="sr-only">
              {expanded ? "Collapse details" : "Expand details"}
            </span>
          </button>
        </div>

        {/* Body: always open from 768px up, a short collapsed strip below it */}
        <div
          id="hero-widget-body"
          className={`${
            expanded ? "block" : "hidden"
          } md:block min-h-0 overflow-y-auto px-3.5 pb-3.5 space-y-3`}
        >
          {children}

          <div className="flex flex-wrap items-center gap-2">
            {actions}
            <button
              type="button"
              onClick={openTerminal}
              className="font-mono text-[11px] uppercase tracking-wider px-3 py-2 rounded-[14px] border border-chrome-text/20 text-chrome-text hover:bg-chrome-text/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus-ring transition-colors"
            >
              Open Terminal
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
