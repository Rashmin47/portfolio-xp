"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";

const NAV_ITEMS = [
  { href: "/projects", label: "PROJECTS" },
  { href: "/experience", label: "EXPERIENCE" },
  { href: "/notes", label: "NOTES" },
  { href: "/about", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
];

export default function Header() {
  const pathname = usePathname();
  const detailsRef = useRef(null);

  // Close mobile menu on route change
  useEffect(() => {
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  }, [pathname]);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Skip-to-content accessible link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-signal focus:text-ink font-mono text-xs font-semibold rounded-[14px]"
      >
        Skip to content
      </a>

      <header className="border-b border-ink/10 dark:border-paper/10 bg-paper/90 dark:bg-night/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/home"
              className="font-display font-bold tracking-tight text-xl text-ink dark:text-paper hover:text-cobalt dark:hover:text-sky transition-colors"
            >
              RASHMIN
            </Link>
            <Link
              href="/"
              className="font-mono text-[10px] uppercase tracking-wider text-muted border border-muted/30 rounded px-1.5 py-0.5 hover:text-cobalt dark:hover:text-sky hover:border-cobalt/50 transition-colors"
              title="Enter the 3D Workshop"
            >
              3D ↗
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <nav aria-label="Main Navigation">
              <ul className="flex items-center gap-6">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`font-mono text-xs uppercase tracking-wider transition-colors pb-0.5 ${
                          active
                            ? "text-ink dark:text-paper font-semibold border-b-2 border-signal"
                            : "text-muted hover:text-ink dark:hover:text-paper"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <ThemeToggle />
          </div>

          {/* Mobile Menu & Theme Toggle */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <details
              ref={detailsRef}
              className="relative"
              onKeyDown={(e) => {
                if (e.key === "Escape" && detailsRef.current) {
                  detailsRef.current.open = false;
                }
              }}
            >
              <summary className="list-none cursor-pointer font-mono text-xs uppercase tracking-wider px-3 py-1.5 border border-ink/15 dark:border-paper/15 rounded-[14px] select-none text-ink dark:text-paper hover:bg-ink/[0.04] dark:hover:bg-paper/[0.04] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-signal">
                MENU
              </summary>
              <nav
                aria-label="Mobile Navigation"
                className="absolute right-0 mt-2 w-48 py-2 bg-paper dark:bg-night-surface border border-ink/15 dark:border-paper/15 rounded-[14px] z-50 flex flex-col"
              >
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                        active
                          ? "text-ink dark:text-paper font-semibold bg-signal/15 border-l-2 border-signal"
                          : "text-muted hover:text-ink dark:hover:text-paper hover:bg-ink/[0.03] dark:hover:bg-paper/[0.04]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </details>
          </div>
        </div>
      </header>
    </>
  );
}
