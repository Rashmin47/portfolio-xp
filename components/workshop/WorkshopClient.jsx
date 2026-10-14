"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { checkWorkshopCapability } from "@/lib/workshop-capability";
import WorkshopModal from "./WorkshopModal";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-night">
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 48,
            height: 48,
            border: "3px solid #2F5BEA",
            borderTopColor: "#F2C81F",
            borderRadius: "50%",
            margin: "0 auto 16px",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p
          style={{
            fontFamily: "monospace",
            fontSize: 12,
            color: "#5B6578",
            letterSpacing: "0.1em",
          }}
        >
          LOADING WORKSHOP…
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  ),
});

/**
 * Full-screen 3D workshop client.
 * Used on the homepage as the primary landing experience.
 *
 * @param {{ hotspots: import("@/data/hotspots").hotspots, classicHref?: string }} props
 */
export default function WorkshopClient({ hotspots, classicHref = "/home" }) {
  const [capability, setCapability] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const labelRefs = useRef({});

  useEffect(() => {
    setCapability(checkWorkshopCapability());
  }, []);

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
    setDetailsOpen(false); // First show the small preview dialog
  }, []);

  const handleClose = useCallback(() => {
    if (detailsOpen) {
      setDetailsOpen(false);
    } else {
      setSelectedId(null);
    }
  }, [detailsOpen]);

  // Escape closes details modal first, then preview card
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  const activeHotspot = useMemo(
    () => (selectedId ? hotspots.find((h) => h.id === selectedId) : null),
    [selectedId, hotspots]
  );

  // ── Fallback for no-WebGL / reduced-motion / low-end devices ──────────────
  if (capability === null) return null;

  if (!capability.ok) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B1220",
          padding: 32,
          gap: 32,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <p style={{ fontFamily: "monospace", fontSize: 11, color: "#5B6578", letterSpacing: "0.12em", marginBottom: 8 }}>
            RASHMIN SHARMA
          </p>
          <h1
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "clamp(2rem,5vw,3.5rem)",
              fontWeight: 800,
              color: "#F4F6FB",
              lineHeight: 1.1,
              marginBottom: 12,
            }}
          >
            Built on a desk.
            <br />
            Aimed at a company.
          </h1>
          <p style={{ color: "#5B6578", fontSize: 15, marginBottom: 32 }}>
            {capability.reason} The 3D Workshop is unavailable here.
          </p>
        </div>
        <nav aria-label="Navigation" style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          {hotspots.map((spot) => (
            <Link
              key={spot.id}
              href={spot.href}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                border: "1.5px solid rgba(47,91,234,0.4)",
                color: "#62C0FF",
                fontFamily: "monospace",
                fontSize: 13,
                textDecoration: "none",
                background: "rgba(47,91,234,0.08)",
              }}
            >
              {spot.label} →
            </Link>
          ))}
        </nav>
      </div>
    );
  }

  // ── 3D experience ─────────────────────────────────────────────────────────
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* The 3D Canvas */}
      <Scene
        hotspots={hotspots}
        selectedId={selectedId}
        onSelect={handleSelect}
        labelRefs={labelRefs}
      />

      {/* ── 3D Projected Hotspot Labels (Native DOM, zero createRoot/unmount warnings) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 25,
        }}
      >
        {hotspots.map((hs) => {
          const isSelected = selectedId === hs.id;
          return (
            <button
              key={hs.id}
              ref={(el) => {
                if (el) labelRefs.current[hs.id] = el;
                else delete labelRefs.current[hs.id];
              }}
              onClick={() => handleSelect(hs.id)}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "auto",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: isSelected
                  ? "rgba(14, 23, 38, 0.98)"
                  : "rgba(19, 29, 51, 0.92)",
                border: isSelected
                  ? "1.5px solid #F2C81F"
                  : "1.5px solid rgba(98, 192, 255, 0.4)",
                color: isSelected ? "#F2C81F" : "#F4F6FB",
                padding: "6px 14px",
                borderRadius: "999px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                cursor: "pointer",
                whiteSpace: "nowrap",
                backdropFilter: "blur(12px)",
                boxShadow: isSelected
                  ? "0 0 20px rgba(242, 200, 31, 0.5), 0 4px 12px rgba(0,0,0,0.6)"
                  : "0 4px 14px rgba(0,0,0,0.5)",
                transform: "translate3d(-9999px, -9999px, 0)",
                transition: "background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s",
                outline: "none",
                userSelect: "none",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = "#F2C81F";
                  e.currentTarget.style.color = "#F2C81F";
                  e.currentTarget.style.boxShadow = "0 0 16px rgba(242, 200, 31, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = "rgba(98, 192, 255, 0.4)";
                  e.currentTarget.style.color = "#F4F6FB";
                  e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.5)";
                }
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  backgroundColor: isSelected ? "#F2C81F" : "#62C0FF",
                  boxShadow: `0 0 6px ${isSelected ? "#F2C81F" : "#62C0FF"}`,
                }}
              />
              {hs.label}
            </button>
          );
        })}
      </div>

      {/* ── Top-left: identity badge ─────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 28,
          zIndex: 30,
          background: "rgba(14, 23, 38, 0.85)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          padding: "8px 16px",
          borderRadius: "12px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
          userSelect: "none",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 11,
            fontWeight: 700,
            color: "#F4F6FB",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            display: "block",
          }}
        >
          Rashmin Sharma
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: "#62C0FF",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Software Developer · Nepal
        </span>
      </div>

      {/* ── Bottom-left: hint ─────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 28,
          zIndex: 30,
          background: "rgba(14, 23, 38, 0.85)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "6px 14px",
          borderRadius: "999px",
          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.35)",
          userSelect: "none",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            color: "#94A3B8",
            letterSpacing: "0.08em",
          }}
        >
          DRAG TO ORBIT · CLICK HOTSPOTS TO EXPLORE
        </span>
      </div>

      {/* ── Bottom-right: classic view link ──────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          right: 28,
          zIndex: 30,
        }}
      >
        <Link
          href={classicHref}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "monospace",
            fontSize: 11,
            fontWeight: 600,
            color: "#F4F6FB",
            letterSpacing: "0.08em",
            textDecoration: "none",
            background: "rgba(14, 23, 38, 0.88)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(242, 200, 31, 0.5)",
            padding: "8px 16px",
            borderRadius: "999px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#F2C81F";
            e.currentTarget.style.boxShadow = "0 0 16px rgba(242, 200, 31, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(242, 200, 31, 0.5)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.4)";
          }}
        >
          <span>CLASSIC VIEW</span>
          <span style={{ color: "#F2C81F" }}>↗</span>
        </Link>
      </div>

      {/* ── Step 1: Small preview dialog on hotspot focus ─────────────── */}
      {selectedId && activeHotspot && !detailsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeHotspot.label}
          style={{
            position: "absolute",
            top: "50%",
            right: 32,
            transform: "translateY(-50%)",
            zIndex: 40,
            width: 300,
            background: "rgba(13, 21, 35, 0.94)",
            border: "1.5px solid rgba(98, 192, 255, 0.25)",
            borderRadius: "16px",
            padding: "24px 22px",
            backdropFilter: "blur(16px)",
            boxShadow: "0 0 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(47, 91, 234, 0.15)",
            animation: "panelIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <style>{`
            @keyframes panelIn {
              from { opacity: 0; transform: translateY(-50%) translateX(16px); }
              to   { opacity: 1; transform: translateY(-50%) translateX(0); }
            }
          `}</style>

          {/* Top category label */}
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              fontWeight: 700,
              color: "#F2C81F",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            {activeHotspot.objectId || activeHotspot.id}
          </p>

          <h2
            style={{
              fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
              fontSize: 24,
              fontWeight: 800,
              color: "#F4F6FB",
              marginBottom: 8,
              lineHeight: 1.2,
            }}
          >
            {activeHotspot.label}
          </h2>

          <p
            style={{
              fontSize: 13,
              color: "#94A3B8",
              lineHeight: 1.6,
              marginBottom: 20,
            }}
          >
            {activeHotspot.description}
          </p>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={() => setDetailsOpen(true)}
              style={{
                flex: 1,
                padding: "10px 18px",
                background: "#2F5BEA",
                color: "#F4F6FB",
                borderRadius: 10,
                border: "none",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "0.04em",
                boxShadow: "0 4px 12px rgba(47, 91, 234, 0.3)",
                transition: "background 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1E45C8";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#2F5BEA";
                e.currentTarget.style.transform = "scale(1.0)";
              }}
            >
              Open →
            </button>
            <button
              onClick={() => setSelectedId(null)}
              style={{
                padding: "10px 16px",
                background: "rgba(255, 255, 255, 0.05)",
                color: "#94A3B8",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: 10,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                cursor: "pointer",
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#F4F6FB";
                e.currentTarget.style.borderColor = "rgba(98, 192, 255, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#94A3B8";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
              }}
            >
              Back
            </button>
          </div>

          {/* Close '×' button */}
          <button
            onClick={() => setSelectedId(null)}
            aria-label="Close preview"
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              background: "transparent",
              border: "none",
              color: "#64748B",
              fontSize: 16,
              cursor: "pointer",
              lineHeight: 1,
              padding: 4,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#F4F6FB"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#64748B"; }}
          >
            ×
          </button>
        </div>
      )}

      {/* ── Step 2: Full details modal when 'Open →' is clicked ───────── */}
      {selectedId && detailsOpen && (
        <WorkshopModal
          hotspotId={selectedId}
          hotspots={hotspots}
          onClose={() => setDetailsOpen(false)}
          onNavigate={(id) => setSelectedId(id)}
        />
      )}
    </div>
  );
}
