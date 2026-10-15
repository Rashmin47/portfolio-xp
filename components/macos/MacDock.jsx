"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * MacDock
 * -------
 * Floating macOS application dock at bottom center of the viewport:
 *  - App icons with hover bounce / elevation
 *  - Active app indicator dot
 *  - Instant navigation between workshop apps
 */
export default function MacDock({ onOpenAI, onOpenTerminal }) {
  const pathname = usePathname();

  const DOCK_APPS = [
    { href: "/", label: "Terminal", icon: "⬛", active: pathname === "/" },
    { href: "/projects", label: "Projects", icon: "📁", active: pathname.startsWith("/projects") },
    { href: "/lab", label: "Lab", icon: "🔬", active: pathname.startsWith("/lab") },
    { href: "/experience", label: "Experience", icon: "💼", active: pathname.startsWith("/experience") },
    { href: "/roadmap", label: "Roadmap", icon: "🗺️", active: pathname.startsWith("/roadmap") },
    { href: "/notes", label: "Notes", icon: "📝", active: pathname.startsWith("/notes") },
    { href: "/about", label: "About", icon: "👤", active: pathname.startsWith("/about") },
    { href: "/contact", label: "Mail", icon: "✉️", active: pathname.startsWith("/contact") },
  ];

  return (
    <div
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-auto"
      role="toolbar"
      aria-label="macOS Application Dock"
    >
      <div
        className="flex items-end gap-1.5 sm:gap-2 px-3 py-2 rounded-2xl border border-paper/15 shadow-2xl backdrop-blur-xl"
        style={{
          background: "rgba(15, 23, 42, 0.85)",
          boxShadow: "0 20px 40px -10px rgba(0,0,0,0.7), inset 0 1px 0 0 rgba(255,255,255,0.1)",
        }}
      >
        {DOCK_APPS.map((app) => (
          <div key={app.href} className="relative group flex flex-col items-center">
            {/* Tooltip */}
            <span className="absolute -top-8 px-2 py-0.5 rounded bg-night-surface text-paper text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-paper/10 shadow-lg">
              {app.label}
            </span>

            {/* Icon Button — use button for Terminal on homepage to open window */}
            {app.href === "/" && onOpenTerminal ? (
              <button
                type="button"
                onClick={onOpenTerminal}
                title="Open Terminal"
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-lg sm:text-xl transition-all duration-200 hover:-translate-y-2 hover:scale-110 active:scale-95 ${
                  app.active
                    ? "bg-paper/20 shadow-inner"
                    : "bg-paper/5 hover:bg-paper/15"
                }`}
              >
                <span>{app.icon}</span>
              </button>
            ) : (
              <Link
                href={app.href}
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-lg sm:text-xl transition-all duration-200 hover:-translate-y-2 hover:scale-110 active:scale-95 ${
                  app.active
                    ? "bg-paper/20 shadow-inner"
                    : "bg-paper/5 hover:bg-paper/15"
                }`}
              >
                <span>{app.icon}</span>
              </Link>
            )}

            {/* Active app dot */}
            <span
              className={`w-1 h-1 rounded-full mt-1 transition-all ${
                app.active ? "bg-signal shadow-[0_0_6px_#F2C81F]" : "bg-transparent"
              }`}
            />
          </div>
        ))}

        {/* Separator */}
        <div className="w-px h-7 bg-paper/15 mx-1 self-center" />

        {/* AI Assistant (Messages) App */}
        <div className="relative group flex flex-col items-center">
          <span className="absolute -top-8 px-2 py-0.5 rounded bg-night-surface text-paper text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-paper/10 shadow-lg">
            Rashmin AI
          </span>

          <button
            type="button"
            onClick={onOpenAI}
            title="Open Rashmin AI Messenger"
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-lg sm:text-xl bg-cobalt/20 hover:bg-cobalt/40 border border-cobalt/40 transition-all duration-200 hover:-translate-y-2 hover:scale-110 active:scale-95"
          >
            <span>💬</span>
          </button>
          <span className="w-1 h-1 rounded-full mt-1 bg-board animate-pulse" />
        </div>
      </div>
    </div>
  );
}
