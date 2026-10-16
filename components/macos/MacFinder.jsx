"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * MacFinder
 * ---------
 * macOS Finder window layout for Projects, Experience, and Roadmap:
 *  - Finder navigation sidebar with shortcuts
 *  - Top breadcrumb path (Rashmin > Developer > [Section])
 *  - Main content canvas
 */
export default function MacFinder({
  sectionTitle = "Projects",
  currentFolder = "projects",
  itemCount,
  children,
}) {
  const pathname = usePathname();

  const SIDEBAR_ITEMS = [
    { href: "/", label: "Home (zsh)", icon: "❯" },
    { href: "/projects", label: "Projects", icon: "📁" },
    { href: "/experience", label: "Experience", icon: "💼" },
    { href: "/lab", label: "The Lab", icon: "🔬" },
    { href: "/roadmap", label: "Roadmap", icon: "🗺️" },
    { href: "/notes", label: "Notes", icon: "📝" },
    { href: "/about", label: "About Me", icon: "👤" },
    { href: "/contact", label: "Contact", icon: "✉️" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-chrome-canvas text-chrome-text overflow-hidden min-h-0">
      {/* ── Finder Toolbar & Path Breadcrumbs ─────────────────────────── */}
      <div className="h-9 px-4 bg-chrome-text/[0.03] border-b border-chrome-text/10 flex items-center justify-between font-mono text-xs text-chrome-text/65 select-none shrink-0">
        <div className="flex items-center gap-2 text-[11px] truncate">
          <span>Rashmin</span>
          <span className="text-chrome-text/20">/</span>
          <span>Developer</span>
          <span className="text-chrome-text/20">/</span>
          <span className="text-accent-signal font-semibold">{sectionTitle}</span>
        </div>

        {itemCount !== undefined && (
          <span className="text-[10px] text-chrome-text/65 hidden sm:inline">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      {/* ── Split View: Sidebar + Content ─────────────────────────────── */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Sidebar (Desktop) — hidden when the window itself is narrow */}
        <aside className="w-44 border-r border-chrome-text/10 p-3 hidden @3xl:flex flex-col gap-1 shrink-0 bg-chrome-text/[0.015] font-mono text-xs">
          <span className="text-[10px] uppercase font-bold text-chrome-text/65 px-2 py-1 tracking-wider">
            Favorites
          </span>
          {SIDEBAR_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-colors ${
                  active
                    ? "bg-cobalt text-white font-medium"
                    : "text-chrome-text/70 hover:text-chrome-text hover:bg-chrome-text/5"
                }`}
              >
                <span className="text-xs">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </aside>

        {/* Main Files View */}
        <div className="@container flex-1 overflow-y-auto p-4 sm:p-6 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
