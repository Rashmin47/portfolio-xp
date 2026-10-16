"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * HotspotPopup
 * ------------
 * Spot card that opens when a 3D desk object / beacon is clicked.
 *
 * The camera has already flown to the object (WorldCanvas passes the hotspot
 * pose to the rig), so this card is anchored next to the object itself instead
 * of covering the middle of the viewport: the beacon's projected screen rect is
 * read every frame while the camera settles, and the card is placed on whichever
 * side of the object has room (right when the object sits on the left half,
 * left when it sits on the right half), clamped to the viewport.
 *
 * Narrow viewports (and beacons that are off-screen) fall back to a bottom sheet
 * above the dock — no side popover, no theme-breaking full-screen modal.
 *
 * "Open <Module> →" navigates to the module's route exactly as before.
 */
export default function HotspotPopup({ hotspot, onClose, beaconRefs }) {
  const cardRef = useRef(null);
  const [mode, setMode] = useState(() =>
    typeof window !== "undefined" && window.innerWidth >= 768 ? "side" : "sheet"
  );

  // Close on Escape
  useEffect(() => {
    if (!hotspot) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hotspot, onClose]);

  // Click / tap anywhere outside the card closes it (no blocking backdrop).
  // Clicks on a hotspot beacon are ignored: that select swaps the card instead.
  useEffect(() => {
    if (!hotspot) return;
    const handlePointerDown = (e) => {
      if (cardRef.current?.contains(e.target)) return;
      if (e.target?.closest?.("[data-beacon]")) return;
      onClose();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [hotspot, onClose]);

  // Anchor the card to the object while the camera settles, then stop.
  useEffect(() => {
    if (!hotspot) return;

    let raf = 0;
    const stopAt = performance.now() + 1400;

    const place = () => {
      const card = cardRef.current;
      if (!card) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const rect = beaconRefs?.current?.[hotspot.id]?.getBoundingClientRect();
      const offscreen =
        !rect ||
        rect.width === 0 ||
        rect.right < 0 ||
        rect.left > vw ||
        beaconRefs?.current?.[hotspot.id]?.style.opacity === "0";

      // No room beside the object → bottom sheet
      if (vw < 768 || offscreen) {
        setMode((m) => (m === "sheet" ? m : "sheet"));
        card.style.transform = "";
        card.style.visibility = "visible";
        card.style.opacity = "1";
        return;
      }

      setMode((m) => (m === "side" ? m : "side"));

      const gap = 22;
      const w = card.offsetWidth || 368;
      const h = card.offsetHeight || 260;
      const cx = rect.left + rect.width / 2;
      const side = cx < vw / 2 ? "right" : "left";

      let left = side === "right" ? rect.right + gap : rect.left - gap - w;
      left = Math.min(Math.max(left, 16), Math.max(16, vw - w - 16));

      const anchorY = rect.top + rect.height / 2;
      const top = Math.min(Math.max(anchorY - 44, 56), Math.max(56, vh - h - 104));

      card.dataset.side = side;
      card.style.setProperty("--arrow", `${Math.min(Math.max(anchorY - top, 20), h - 20)}px`);
      card.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      card.style.visibility = "visible";
      card.style.opacity = "1";
    };

    const tick = () => {
      place();
      if (performance.now() < stopAt) raf = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("resize", place);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", place);
    };
  }, [hotspot, beaconRefs]);

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
    <div
      ref={cardRef}
      role="dialog"
      aria-label={`${hotspot.label} module`}
      data-side="right"
      data-arrow={mode === "side" ? "on" : undefined}
      className={`spot-card fixed z-50 pointer-events-auto w-[min(92vw,368px)] ${
        mode === "side"
          ? "left-0 top-0 invisible opacity-0"
          : "inset-x-0 bottom-24 top-auto mx-auto sm:bottom-28"
      }`}
      style={{ animation: "dialog-pop-in 220ms cubic-bezier(0.16, 1, 0.3, 1) both" }}
    >
      <div
        className="rounded-2xl border border-chrome-text/15 bg-chrome shadow-2xl max-h-[min(70vh,520px)] overflow-y-auto"
        style={{
          backdropFilter: "blur(24px)",
          boxShadow:
            "0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Title bar */}
        <div className="h-9 px-3 border-b border-chrome-text/10 flex items-center justify-between select-none bg-chrome-bar">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              title="Close dialog"
              className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black/70 leading-none">
                ×
              </span>
            </button>
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]/40 border border-[#DEA123]/30" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F]/40 border border-[#1AAB29]/30" />
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-wider text-chrome-text/70 uppercase">
            <span style={{ color: meta.color }}>●</span>
            <span>{meta.cat}</span>
          </div>

          <span className="font-mono text-[10px] text-chrome-text/65">esc</span>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border border-chrome-text/10 bg-chrome-text/5"
            >
              {meta.icon}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-display font-bold text-lg text-chrome-text leading-tight tracking-tight">
                {hotspot.label}
              </h2>
              <p className="text-[11px] font-mono text-chrome-text/65 mt-0.5">{meta.tagline}</p>
            </div>
          </div>

          <p className="text-sm text-chrome-text/80 leading-relaxed font-sans">{hotspot.description}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-chrome-text/10 sm:px-5">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-xl font-mono text-xs font-semibold text-chrome-text/80 bg-chrome-text/5 hover:bg-chrome-text/15 border border-chrome-text/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            Back to Desk
          </button>

          <Link
            href={hotspot.href}
            onClick={onClose}
            autoFocus
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold text-white bg-cobalt hover:bg-cobalt/90 shadow-lg shadow-cobalt/30 transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <span>Open {hotspot.label}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes dialog-pop-in {
          0% { opacity: 0; scale: 0.96; }
          100% { opacity: 1; scale: 1; }
        }
      `}</style>
    </div>
  );
}
