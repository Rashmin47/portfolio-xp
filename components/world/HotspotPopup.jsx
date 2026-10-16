"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * HotspotPopup
 * ------------
 * Centered macOS modal dialog that appears when a 3D desk object/beacon is clicked.
 * Provides a clean overview of the module before opening the full macOS detailed window.
 */
export default function HotspotPopup({ hotspot, onClose }) {
  // Close on Escape key press
  useEffect(() => {
    if (!hotspot) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hotspot, onClose]);

  if (!hotspot) return null;

  // Map hotspot id to metadata
  const categories = {
    laptop: {
      cat: "PROJECTS",
      icon: "💻",
      color: "#62C0FF",
      tagline: "Deployed production systems",
    },
    pi: {
      cat: "LAB & HARDWARE",
      icon: "🔬",
      color: "#2EA84B",
      tagline: "Prototypes, scripts & hardware experiments",
    },
    whiteboard: {
      cat: "ROADMAP",
      icon: "🗺️",
      color: "#F2C81F",
      tagline: "Planned engineering & startup milestones",
    },
    notebook: {
      cat: "NOTES & LOGS",
      icon: "📝",
      color: "#F2C81F",
      tagline: "Technical thoughts, write-ups & logs",
    },
    plant: {
      cat: "ABOUT ME",
      icon: "👤",
      color: "#62C0FF",
      tagline: "Background, principles & technical bio",
    },
    phone: {
      cat: "GET IN TOUCH",
      icon: "✉️",
      color: "#2F5BEA",
      tagline: "Direct contact, email & collaboration",
    },
    book: {
      cat: "EXPERIENCE",
      icon: "💼",
      color: "#FF8C42",
      tagline: "Ventures, roles & organizations built",
    },
  };

  const meta = categories[hotspot.id] || {
    cat: "WORKSHOP MODULE",
    icon: "📦",
    color: "#62C0FF",
    tagline: "Interactive 3D Workshop object",
  };

  return (
    <>
      {/* ── Soft darkened backdrop ────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity pointer-events-auto animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── macOS Dialog Card (Centered) ─────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${hotspot.label} module`}
        className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(92vw,440px)] pointer-events-auto"
        style={{
          animation: "dialog-pop-in 220ms cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        <div
          className="rounded-2xl border border-white/15 overflow-hidden shadow-2xl"
          style={{
            background: "rgba(15, 23, 42, 0.96)",
            backdropFilter: "blur(24px)",
            boxShadow:
              "0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* macOS Title Bar */}
          <div className="h-10 px-4 border-b border-paper/10 flex items-center justify-between select-none bg-night-surface/90">
            {/* Traffic lights */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                title="Close dialog"
                className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center group focus:outline-none"
              >
                <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black/70 leading-none">
                  ×
                </span>
              </button>
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]/40 border border-[#DEA123]/30" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]/40 border border-[#1AAB29]/30" />
            </div>

            {/* Title / Module Badge */}
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wider text-muted uppercase">
              <span style={{ color: meta.color }}>●</span>
              <span>{meta.cat}</span>
            </div>

            {/* ESC helper */}
            <span className="font-mono text-[10px] text-muted/60">esc</span>
          </div>

          {/* Dialog Body */}
          <div className="p-6">
            <div className="flex items-start gap-4 mb-4">
              {/* App Icon badge */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-md border border-white/10"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                }}
              >
                {meta.icon}
              </div>

              {/* Title & Tagline */}
              <div className="flex-1 min-w-0">
                <h2 className="font-display font-bold text-2xl text-paper leading-tight tracking-tight">
                  {hotspot.label}
                </h2>
                <p className="text-xs font-mono text-muted mt-0.5">
                  {meta.tagline}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-paper/80 leading-relaxed mb-6 font-sans">
              {hotspot.description}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-paper/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl font-mono text-xs font-semibold text-paper/80 bg-paper/5 hover:bg-paper/15 border border-paper/10 transition-colors focus:outline-none focus:ring-2 focus:ring-paper/30"
              >
                Back to Desk
              </button>

              <Link
                href={hotspot.href}
                onClick={onClose}
                autoFocus
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl font-mono text-xs font-bold text-white bg-cobalt hover:bg-cobalt/90 shadow-lg shadow-cobalt/30 transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-signal"
              >
                <span>Open {hotspot.label}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Pop-in animation */}
        <style>{`
          @keyframes dialog-pop-in {
            0% {
              opacity: 0;
              transform: translate(-50%, -46%) scale(0.94);
            }
            100% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }
        `}</style>
      </div>
    </>
  );
}

