"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * MacWindow
 * ---------
 * Authentic macOS application window wrapper with:
 *  - Traffic light controls (🔴 Close, 🟡 Minimize, 🟢 Maximize / Expand)
 *  - Window title bar with app name / path
 *  - Rounded corners, hairline borders, and theme-aware translucent surface
 *    styling (light frosted panel / dark night-surface panel)
 *  - Responsive: desktop floating window, mobile bottom sheet
 */
export default function MacWindow({
  title = "Terminal — zsh",
  appType = "terminal", // "terminal" | "textedit" | "finder" | "mail" | "messages"
  path = "~",
  onOpenAI,
  onClose,
  children,
}) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    // Navigate home if not on home, or minimize if already on home
    if (path !== "~" && path !== "/") {
      router.push("/");
    } else {
      setCollapsed(true);
    }
  };

  const handleMinimize = () => {
    setCollapsed((c) => !c);
  };

  const handleMaximize = () => {
    setExpanded((e) => !e);
  };

  return (
    <div
      className={`fixed z-20 flex flex-col pointer-events-none transition-all duration-300
        /* Desktop: perfectly centered macOS window over 3D desk */
        md:top-11 md:bottom-22
        md:left-1/2 md:-translate-x-1/2 md:right-auto
        ${
          expanded
            ? "md:w-[calc(100vw-64px)] md:max-w-6xl"
            : "md:w-[calc(100vw-64px)] md:max-w-4xl"
        }
        /* Mobile: responsive bottom sheet */
        left-0 right-0 bottom-0 max-md:translate-x-0 max-md:border-t max-md:border-chrome-text/10 max-md:rounded-t-2xl
        ${collapsed ? "max-md:h-[64px] md:!bottom-auto md:!h-[52px]" : "max-md:h-[72vh] md:h-auto"}
      `}
    >
      {/* Outer macOS Window Card */}
      <div
        className="flex-1 flex flex-col w-full h-full rounded-[14px] overflow-hidden border border-chrome-text/15 bg-chrome text-chrome-text shadow-2xl backdrop-blur-xl pointer-events-auto"
        style={{
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* ── macOS Title Bar ────────────────────────────────────────────── */}
        <div
          className="h-11 px-4 sm:px-6 border-b border-chrome-text/10 flex items-center justify-between shrink-0 select-none bg-chrome-bar"
        >
          {/* Traffic Lights (🔴 🟡 🟢) */}
          <div className="flex items-center gap-2">
            {/* Close */}
            <button
              type="button"
              onClick={handleClose}
              title="Close window (go to home)"
              className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[9px] font-bold text-black/70 leading-none">
                ×
              </span>
            </button>
            {/* Minimize */}
            <button
              type="button"
              onClick={handleMinimize}
              title="Minimize window"
              className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-[#DEA123] flex items-center justify-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[9px] font-bold text-black/70 leading-none">
                –
              </span>
            </button>
            {/* Maximize */}
            <button
              type="button"
              onClick={handleMaximize}
              title={expanded ? "Restore size" : "Expand window"}
              className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-[#1AAB29] flex items-center justify-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black/70 leading-none">
                +
              </span>
            </button>
          </div>

          {/* Window Center Title & App Icon */}
          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-chrome-text/90 truncate px-2">
            {appType === "terminal" && <span className="text-sky text-xs font-bold">❯_</span>}
            {appType === "textedit" && <span className="text-signal text-sm">📝</span>}
            {appType === "finder" && <span className="text-sky text-sm">📁</span>}
            {appType === "mail" && <span className="text-sky text-sm">✉️</span>}
            {appType === "messages" && <span className="text-board text-sm">💬</span>}
            <span className="tracking-tight truncate">{title}</span>
          </div>

          {/* Right Toolbar Actions */}
          <div className="flex items-center gap-2.5">
            {onOpenAI && (
              <button
                type="button"
                onClick={onOpenAI}
                title="Ask AI Assistant"
                className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-chrome-text/10 hover:bg-chrome-text/20 text-chrome-text flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                <span className="w-2 h-2 rounded-full bg-board animate-pulse" />
                <span>AI</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleMinimize}
              className="md:hidden text-chrome-text/70 hover:text-chrome-text text-xs font-mono px-2 py-0.5 rounded bg-chrome-text/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              {collapsed ? "Expand" : "Peek"}
            </button>
          </div>
        </div>

        {/* ── Window Content Body ────────────────────────────────────────── */}
        {!collapsed && (
          <div className="@container flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col max-md:pb-16">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
