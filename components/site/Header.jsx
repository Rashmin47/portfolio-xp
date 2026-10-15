"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";

/**
 * Header (macOS System Menu Bar)
 * ------------------------------
 * Top-of-screen macOS system menu bar:
 *  - Apple  / Studio brand
 *  - Active application context (Terminal, Finder, TextEdit, Mail)
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
    if (pathname.startsWith("/about")) return "TextEdit — About";
    if (pathname.startsWith("/notes")) return "TextEdit — Notes";
    if (pathname.startsWith("/contact")) return "Mail";
    if (pathname.startsWith("/projects")) return "Finder — Projects";
    if (pathname.startsWith("/experience")) return "Finder — Experience";
    if (pathname.startsWith("/roadmap")) return "Finder — Roadmap";
    return "Finder";
  })();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
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

      {/* ── macOS System Menu Bar ────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 h-7 z-40 px-3 bg-night-surface/90 backdrop-blur-md border-b border-paper/10 flex items-center justify-between text-[11px] font-mono text-paper select-none pointer-events-auto"
        style={{
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* Left: Apple / Logo + App Name + Menus */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 font-bold hover:text-sky transition-colors text-paper"
            title="Rashmin Sharma Workspace"
          >
            <span className="text-xs"></span>
            <span className="tracking-tight hidden sm:inline">Rashmin Studio</span>
          </Link>

          {/* Active Application Context */}
          <span className="font-bold text-signal px-1.5 py-0.5 rounded bg-signal/10 border border-signal/20">
            {activeApp}
          </span>

          {/* System Menus */}
          <nav aria-label="System Navigation" className="hidden md:flex items-center gap-3 text-muted">
            <Link href="/" className={`hover:text-paper transition-colors${pathname === "/" ? " text-paper font-semibold" : ""}`}>
              Home
            </Link>
            <Link href="/projects" className={`hover:text-paper transition-colors${pathname?.startsWith("/projects") ? " text-paper font-semibold" : ""}`}>
              Projects
            </Link>
            <Link href="/experience" className={`hover:text-paper transition-colors${pathname?.startsWith("/experience") ? " text-paper font-semibold" : ""}`}>
              Experience
            </Link>
            <Link href="/about" className={`hover:text-paper transition-colors${pathname?.startsWith("/about") ? " text-paper font-semibold" : ""}`}>
              About
            </Link>
            <Link href="/notes" className={`hover:text-paper transition-colors${pathname?.startsWith("/notes") ? " text-paper font-semibold" : ""}`}>
              Notes
            </Link>
            <Link href="/contact" className={`hover:text-paper transition-colors${pathname?.startsWith("/contact") ? " text-paper font-semibold" : ""}`}>
              Contact
            </Link>
          </nav>
        </div>

        {/* Right: Status Indicators & Theme */}
        <div className="flex items-center gap-3 text-muted">
          <span className="hidden sm:inline text-[10px]">Kathmandu, NP</span>
          {timeStr && <span className="text-paper/90 text-[10px]">{timeStr}</span>}
          <div className="scale-75 origin-right">
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  );
}
