"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DockIcon from "@/components/ui/DockIcon";

/**
 * MacDock
 * -------
 * Floating application dock at bottom center of the viewport:
 *  - Custom inline SVG icons (1.5px stroke, currentColor)
 *  - Label chip on hover and keyboard focus
 *  - Active-route accent in signal
 *  - Magnification on hover is desktop-only and off under reduced motion
 */
export default function MacDock({ onOpenAI, onOpenTerminal }) {
  const pathname = usePathname();

  const DOCK_APPS = [
    { href: "/", name: "terminal", label: "Terminal", active: pathname === "/" },
    { href: "/projects", name: "folder", label: "Projects", active: pathname.startsWith("/projects") },
    { href: "/lab", name: "flask", label: "Lab", active: pathname.startsWith("/lab") },
    { href: "/experience", name: "briefcase", label: "Experience", active: pathname.startsWith("/experience") },
    { href: "/roadmap", name: "board", label: "Roadmap", active: pathname.startsWith("/roadmap") },
    { href: "/notes", name: "notes", label: "Notes", active: pathname.startsWith("/notes") },
    { href: "/about", name: "person", label: "About", active: pathname.startsWith("/about") },
    { href: "/contact", name: "mail", label: "Mail", active: pathname.startsWith("/contact") },
  ];

  const buttonBase =
    "dock-magnify w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center";

  return (
    <div
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-auto max-w-[calc(100vw-0.75rem)]"
      role="toolbar"
      aria-label="Application dock"
    >
      <div
        className="flex flex-wrap items-end justify-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 rounded-2xl border border-chrome-text/15 bg-chrome-dock shadow-2xl backdrop-blur-xl"
        style={{
          boxShadow:
            "0 20px 40px -10px rgba(0,0,0,0.7), inset 0 1px 0 0 rgba(255,255,255,0.1)",
        }}
      >
        {DOCK_APPS.map((app) => {
          const tone = app.active
            ? "text-accent-signal"
            : "text-chrome-text/70 hover:text-chrome-text";

          return (
            <div key={app.href} className="relative group flex flex-col items-center">
              {/* Label chip */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-8 px-2 py-0.5 rounded bg-chrome text-chrome-text text-[10px] font-mono whitespace-nowrap border border-chrome-text/10 shadow-lg opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
              >
                {app.label}
              </span>

              {/* Terminal on the homepage opens the window instead of navigating */}
              {app.href === "/" && onOpenTerminal ? (
                <button
                  type="button"
                  onClick={onOpenTerminal}
                  title="Open Terminal"
                  aria-label={app.label}
                  className={`${buttonBase} ${tone} ${app.active ? "bg-chrome-text/20" : "bg-chrome-text/5 hover:bg-chrome-text/15"}`}
                >
                  <DockIcon name={app.name} />
                </button>
              ) : (
                <Link
                  href={app.href}
                  aria-label={app.label}
                  className={`${buttonBase} ${tone} ${app.active ? "bg-chrome-text/20" : "bg-chrome-text/5 hover:bg-chrome-text/15"}`}
                >
                  <DockIcon name={app.name} />
                </Link>
              )}

              {/* Active route dot */}
              <span
                className={`w-1 h-1 rounded-full mt-1 transition-all ${
                  app.active ? "bg-accent-signal" : "bg-transparent"
                }`}
              />
            </div>
          );
        })}

        {/* Separator */}
        <div className="hidden w-px h-7 bg-chrome-text/15 mx-1 self-center min-[380px]:block" />

        {/* Assistant */}
        <div className="relative group flex flex-col items-center">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-8 px-2 py-0.5 rounded bg-chrome text-chrome-text text-[10px] font-mono whitespace-nowrap border border-chrome-text/10 shadow-lg opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
          >
            Assistant
          </span>

          <button
            type="button"
            onClick={onOpenAI}
            title="Open Rashmin AI assistant"
            aria-label="Assistant"
            className={`${buttonBase} text-accent-sky bg-cobalt/20 hover:bg-cobalt/40 border border-cobalt/40`}
          >
            <DockIcon name="assistant" />
          </button>
          <span className="w-1 h-1 rounded-full mt-1 bg-accent-board" />
        </div>
      </div>
    </div>
  );
}
