"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { nepalClock } from "@/lib/nepal-time";

/**
 * Header (system menu bar)
 * ------------------------------
 * Top-of-screen system menu bar:
 *  - Studio monogram + app name
 *  - Active application context (Terminal, Files, Notes, Mail)
 *  - System menu items
 *  - Status items: Location, Kathmandu time, Theme toggle
 */
export default function Header() {
  const pathname = usePathname();
  const [timeStr, setTimeStr] = useState("");

  // Get active app name from route
  const activeApp = (() => {
    if (pathname === "/") return "Terminal";
    if (pathname.startsWith("/lab")) return "Terminal — Lab";
    if (pathname.startsWith("/about")) return "Notes — About Me";
    if (pathname.startsWith("/notes")) return "Notes — Thoughts";
    if (pathname.startsWith("/contact")) return "Mail";
    if (pathname.startsWith("/projects")) return "Files — Projects";
    if (pathname.startsWith("/experience")) return "Files — Experience";
    if (pathname.startsWith("/roadmap")) return "Files — Roadmap";
    return "Files";
  })();

  useEffect(() => {
    const updateTime = () => setTimeStr(nepalClock());
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Skip-to-content accessible link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-signal focus:text-ink font-mono text-xs font-semibold rounded-[14px]"
      >
        Skip to content
      </a>

      {/* ── System Menu Bar ──────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 h-7 z-40 px-3 bg-chrome-bar backdrop-blur-md border-b border-chrome-text/10 flex items-center justify-between text-[11px] font-mono text-chrome-text select-none pointer-events-auto"
        style={{
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* Left: Studio monogram + App Name + Menus */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 font-bold hover:text-accent-sky transition-colors text-chrome-text rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            title="Rashmin Sharma Workspace"
          >
            {/* Studio monogram (own mark, no platform glyph) */}
            <span className="text-accent-signal" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                focusable="false"
              >
                <rect x="1.75" y="1.75" width="20.5" height="20.5" rx="6" strokeOpacity="0.45" />
                <path d="M9.6 17.6V6.9h3.1a3.2 3.2 0 0 1 0 6.4H9.6" />
                <path d="M13.2 13.3l3 4.3" />
              </svg>
            </span>
            <span className="tracking-tight hidden sm:inline">Rashmin Studio</span>
          </Link>

          {/* Active Application Context */}
          <span className="font-bold text-accent-signal px-1.5 py-0.5 rounded bg-signal/10 border border-signal/30">
            {activeApp}
          </span>

          {/* System Menus */}
          <nav
            aria-label="System Navigation"
            className="hidden md:flex items-center gap-1 text-chrome-text/60"
          >
            {[
              { href: "/", label: "Home" },
              { href: "/projects", label: "Projects" },
              { href: "/experience", label: "Experience" },
              { href: "/about", label: "About" },
              { href: "/notes", label: "Notes" },
              { href: "/contact", label: "Contact" },
            ].map(({ href, label }) => {
              const active =
                href === "/" ? pathname === "/" : pathname?.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-md px-2 py-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
                    active
                      ? "bg-chrome-text/10 font-semibold text-chrome-text"
                      : "hover:bg-chrome-text/5 hover:text-chrome-text"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Status Indicators & Theme */}
        <div className="flex items-center gap-2 sm:gap-3 text-chrome-text/60">
          <span className="hidden sm:inline text-[10px]">Kathmandu, NP</span>
          {timeStr && <span className="text-chrome-text/90 text-[10px]">{timeStr} NPT</span>}
          <div className="scale-75 origin-right">
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  );
}
