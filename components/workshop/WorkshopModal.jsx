"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { about } from "@/data/about";
import { projects } from "@/data/projects";
import { lab } from "@/data/lab";
import { roadmap } from "@/data/roadmap";
import { notes } from "@/data/notes";
import { ventures } from "@/data/ventures";
import { siteConfig } from "@/data/site";
import ContactForm from "@/components/pages/ContactForm";

/**
 * In-scene rich modal for the 3D Workshop.
 * Keeps the user fully immersed in the 3D experience while displaying
 * comprehensive, beautifully styled content for all modules.
 *
 * @param {{
 *   hotspotId: string,
 *   hotspots: import("@/data/hotspots").Hotspot[],
 *   onClose: () => void,
 *   onNavigate: (id: string) => void
 * }} props
 */
export default function WorkshopModal({ hotspotId, hotspots, onClose, onNavigate }) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeTab, setActiveTab] = useState(hotspotId);

  useEffect(() => {
    setActiveTab(hotspotId);
  }, [hotspotId]);

  // Copy email helper
  const handleCopyEmail = () => {
    const email = "rashmin.sharma.dev@gmail.com"; // or placeholder
    navigator.clipboard?.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const currentHotspot = useMemo(
    () => hotspots.find((h) => h.id === activeTab) || hotspots[0],
    [activeTab, hotspots]
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={currentHotspot.label}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "rgba(7, 12, 22, 0.65)",
        backdropFilter: "blur(12px)",
        animation: "modalFadeIn 0.2s ease-out",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalZoomIn {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to   { opacity: 1; transform: scale(1.0) translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(14, 23, 38, 0.4);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(98, 192, 255, 0.25);
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(242, 200, 31, 0.6);
        }
      `}</style>

      {/* Main Modal Card */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "800px",
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          background: "rgba(13, 21, 35, 0.94)",
          border: "1.5px solid rgba(98, 192, 255, 0.25)",
          borderRadius: "20px",
          boxShadow: "0 0 50px rgba(0, 0, 0, 0.7), 0 0 24px rgba(47, 91, 234, 0.15)",
          overflow: "hidden",
          animation: "modalZoomIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* ── Top Bar: Module Switcher & Close Button ─────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            background: "rgba(10, 16, 28, 0.8)",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {/* Quick tab switcher for all modules */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
            {hotspots.map((h) => {
              const isActive = h.id === activeTab;
              return (
                <button
                  key={h.id}
                  onClick={() => {
                    setActiveTab(h.id);
                    onNavigate(h.id);
                  }}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "999px",
                    fontSize: "11px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    cursor: "pointer",
                    border: isActive
                      ? "1px solid #F2C81F"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                    background: isActive ? "rgba(242, 200, 31, 0.15)" : "transparent",
                    color: isActive ? "#F2C81F" : "#94A3B8",
                    transition: "all 0.15s ease",
                  }}
                >
                  {h.label}
                </button>
              );
            })}
          </div>

          {/* Close button with ESC indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontSize: "10px",
                fontFamily: "monospace",
                color: "#64748B",
                letterSpacing: "0.08em",
              }}
            >
              ESC TO CLOSE
            </span>
            <button
              onClick={onClose}
              aria-label="Close modal"
              style={{
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#F4F6FB",
                fontSize: "16px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#EF4444";
                e.currentTarget.style.borderColor = "#EF4444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── Scrollable Body Content ────────────────────────────────────── */}
        <div
          className="custom-scrollbar"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "28px 32px",
            color: "#F4F6FB",
          }}
        >
          {/* Header Banner */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#F2C81F",
                  boxShadow: "0 0 8px #F2C81F",
                }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  color: "#F2C81F",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                THE WORKSHOP · {currentHotspot.id.toUpperCase()}
              </span>
            </div>
            <h2
              style={{
                fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                fontSize: "28px",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "#F4F6FB",
                lineHeight: 1.2,
              }}
            >
              {currentHotspot.label}
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "14px", marginTop: "4px" }}>
              {currentHotspot.description}
            </p>
          </div>

          {/* Module-Specific Content Sections */}
          {activeTab === "plant" && <AboutSection />}
          {activeTab === "laptop" && <ProjectsSection />}
          {activeTab === "pi" && <LabSection />}
          {activeTab === "whiteboard" && <RoadmapSection />}
          {activeTab === "notebook" && <NotesSection />}
          {activeTab === "book" && <VenturesSection />}
          {activeTab === "phone" && <ContactSection onCopyEmail={handleCopyEmail} copiedEmail={copiedEmail} />}
        </div>

        {/* ── Bottom Bar: Return to desk + classic fallback ───────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 28px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            background: "rgba(10, 16, 28, 0.8)",
            fontSize: "12px",
            color: "#64748B",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span>Permanent URL:</span>
            <Link
              href={currentHotspot.href}
              style={{
                color: "#62C0FF",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              {currentHotspot.href} ↗
            </Link>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: "7px 18px",
              background: "#2F5BEA",
              color: "#F4F6FB",
              borderRadius: "10px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#1E45C8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#2F5BEA"; }}
          >
            ← Return to Workshop
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Module 1: About Rashmin ──────────────────────────────────────────────────
function AboutSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Bio text */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {about.bio.map((para, i) => (
          <p key={i} style={{ color: "#E2E8F0", fontSize: "15px", lineHeight: 1.7 }}>
            {para}
          </p>
        ))}
      </div>

      {/* Engineering Principles (How I Think) */}
      <div>
        <h3
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
            color: "#62C0FF",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          HOW I THINK & OPERATE
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
          {about.howIThink?.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <h4 style={{ fontWeight: 700, fontSize: "14px", color: "#F4F6FB", marginBottom: "6px" }}>
                {item.title}
              </h4>
              <p style={{ fontSize: "13px", color: "#94A3B8", lineHeight: 1.5 }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Now Learning & Community */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
        <div
          style={{
            background: "rgba(47, 91, 234, 0.08)",
            border: "1px solid rgba(47, 91, 234, 0.2)",
            borderRadius: "12px",
            padding: "16px",
          }}
        >
          <h4
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              color: "#F2C81F",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            CURRENT TECHNICAL EXPLORATIONS
          </h4>
          <ul style={{ margin: 0, paddingLeft: "18px", color: "#E2E8F0", fontSize: "13px", lineHeight: 1.6 }}>
            {about.nowLearning?.map((tech, i) => (
              <li key={i}>{tech}</li>
            ))}
          </ul>
        </div>

        <div
          style={{
            background: "rgba(46, 168, 75, 0.08)",
            border: "1px solid rgba(46, 168, 75, 0.2)",
            borderRadius: "12px",
            padding: "16px",
          }}
        >
          <h4
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              color: "#2EA84B",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            LOCATION & FOCUS
          </h4>
          <p style={{ color: "#E2E8F0", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>
            {about.lookingFor}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Module 2: Shipped Projects ───────────────────────────────────────────────
function ProjectsSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {projects.map((proj) => (
        <div
          key={proj.slug}
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
            <div>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  color: "#62C0FF",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {proj.status || "SHIPPED"} · {proj.year || "2026"}
              </span>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#F4F6FB", marginTop: 2 }}>
                {proj.name || proj.title}
              </h3>
            </div>

            {/* Tags */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {proj.tags?.map((t, i) => (
                <span
                  key={i}
                  style={{
                    background: "rgba(98, 192, 255, 0.1)",
                    border: "1px solid rgba(98, 192, 255, 0.2)",
                    color: "#62C0FF",
                    fontSize: "10px",
                    fontFamily: "monospace",
                    padding: "2px 8px",
                    borderRadius: "999px",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <p style={{ color: "#CBD5E1", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
            {proj.summary || proj.description}
          </p>

          {/* Decisions or Outcomes */}
          {proj.decisions && proj.decisions.length > 0 && (
            <div
              style={{
                background: "rgba(0, 0, 0, 0.25)",
                borderLeft: "3px solid #F2C81F",
                padding: "10px 14px",
                borderRadius: "4px",
                fontSize: "12px",
                color: "#94A3B8",
              }}
            >
              <strong style={{ color: "#F2C81F" }}>Decision:</strong> {proj.decisions[0].title} — Chose{" "}
              <span style={{ color: "#F4F6FB" }}>{proj.decisions[0].chose}</span> over {proj.decisions[0].rejected}.
            </div>
          )}

          {/* Links */}
          <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
            <Link
              href={`/projects/${proj.slug}`}
              style={{
                fontSize: "12px",
                fontFamily: "monospace",
                color: "#F2C81F",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              View Full Architecture & Post-Mortem →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Module 3: The Lab (Hardware Experiments) ─────────────────────────────────
function LabSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {lab.map((exp) => (
        <div
          key={exp.id}
          style={{
            background: "rgba(46, 168, 75, 0.05)",
            border: "1px solid rgba(46, 168, 75, 0.2)",
            borderRadius: "14px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    backgroundColor: "#2EA84B",
                    boxShadow: "0 0 6px #2EA84B",
                  }}
                />
                <span style={{ fontSize: "10px", fontFamily: "monospace", color: "#2EA84B", letterSpacing: "0.1em" }}>
                  {exp.status || "BENCH TESTED"}
                </span>
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#F4F6FB", marginTop: 4 }}>
                {exp.title}
              </h3>
            </div>

            <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#64748B" }}>
              {exp.year || "2026"}
            </span>
          </div>

          <p style={{ color: "#CBD5E1", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
            {exp.description}
          </p>

          {exp.details && (
            <p style={{ color: "#94A3B8", fontSize: "13px", lineHeight: 1.5, margin: 0 }}>
              {exp.details}
            </p>
          )}

          {/* Hardware stack */}
          {exp.hardware && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
              {exp.hardware.map((hw, i) => (
                <span
                  key={i}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#E2E8F0",
                    fontSize: "11px",
                    fontFamily: "monospace",
                    padding: "3px 10px",
                    borderRadius: "6px",
                  }}
                >
                  ⚡ {hw}
                </span>
              ))}
            </div>
          )}

          {exp.repo && (
            <a
              href={exp.repo}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "12px",
                fontFamily: "monospace",
                color: "#62C0FF",
                textDecoration: "underline",
                textUnderlineOffset: 3,
                marginTop: "4px",
              }}
            >
              GitHub Repository ↗
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Module 4: Roadmap ────────────────────────────────────────────────────────
function RoadmapSection() {
  const columns = [
    { key: "now", label: "NOW · IN PROGRESS", color: "#F2C81F", bg: "rgba(242, 200, 31, 0.08)", border: "rgba(242, 200, 31, 0.25)" },
    { key: "next", label: "NEXT · QUEUED", color: "#62C0FF", bg: "rgba(98, 192, 255, 0.08)", border: "rgba(98, 192, 255, 0.25)" },
    { key: "later", label: "LATER · EXPLORING", color: "#A78BFA", bg: "rgba(167, 139, 250, 0.08)", border: "rgba(167, 139, 250, 0.25)" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
      {columns.map((col) => {
        const items = roadmap.filter((r) => r.status === col.key);
        return (
          <div
            key={col.key}
            style={{
              background: col.bg,
              border: `1px solid ${col.border}`,
              borderRadius: "14px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: col.color }} />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: col.color,
                  letterSpacing: "0.08em",
                }}
              >
                {col.label}
              </span>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "rgba(13, 21, 35, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "10px",
                  padding: "14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h4 style={{ fontWeight: 700, fontSize: "14px", color: "#F4F6FB", margin: 0 }}>
                    {item.title}
                  </h4>
                  {item.quarter && (
                    <span style={{ fontSize: "10px", fontFamily: "monospace", color: "#64748B" }}>
                      {item.quarter}
                    </span>
                  )}
                </div>

                <p style={{ color: "#94A3B8", fontSize: "12px", lineHeight: 1.5, margin: 0 }}>
                  {item.description}
                </p>

                {item.why && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#CBD5E1",
                      background: "rgba(255, 255, 255, 0.03)",
                      padding: "6px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    <span style={{ color: col.color, fontWeight: 600 }}>Why:</span> {item.why}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ─── Module 5: Notes & Logs ───────────────────────────────────────────────────
function NotesSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {notes.map((note) => (
        <div
          key={note.slug}
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 6 }}>
            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#F4F6FB", margin: 0 }}>
              {note.title}
            </h3>
            <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#64748B" }}>
              {note.datePublished} · {note.readingTime}
            </span>
          </div>

          <p style={{ color: "#CBD5E1", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>
            {note.summary}
          </p>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
            <div style={{ display: "flex", gap: "6px" }}>
              {note.tags?.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    fontSize: "10px",
                    fontFamily: "monospace",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    color: "#94A3B8",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>

            <Link
              href={`/notes/${note.slug}`}
              style={{
                fontSize: "12px",
                fontFamily: "monospace",
                color: "#F2C81F",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Read Full Note →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Module 6: Ventures ───────────────────────────────────────────────────────
function VenturesSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {ventures.map((v) => (
        <div
          key={v.id}
          style={{
            background: "rgba(242, 200, 31, 0.04)",
            border: "1px solid rgba(242, 200, 31, 0.2)",
            borderRadius: "14px",
            padding: "22px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
            <div>
              <span style={{ fontSize: "10px", fontFamily: "monospace", color: "#F2C81F", letterSpacing: "0.1em" }}>
                STAGE: {v.stage.toUpperCase()}
              </span>
              <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#F4F6FB", marginTop: 2 }}>
                {v.name}
              </h3>
            </div>

            <span
              style={{
                background: "rgba(242, 200, 31, 0.15)",
                border: "1px solid #F2C81F",
                color: "#F2C81F",
                fontSize: "10px",
                fontFamily: "monospace",
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: "999px",
              }}
            >
              {v.status}
            </span>
          </div>

          <p style={{ color: "#E2E8F0", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
            {v.problem}
          </p>

          <div style={{ fontSize: "12px", color: "#94A3B8" }}>
            <strong style={{ color: "#62C0FF" }}>Role:</strong> {v.role}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Module 7: Contact ────────────────────────────────────────────────────────
function ContactSection({ onCopyEmail, copiedEmail }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
      {/* Direct Channels */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <p style={{ color: "#CBD5E1", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
          I am always open to discussing high-craft engineering products, architecture discussions, or new opportunities.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Email button */}
          <button
            onClick={onCopyEmail}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "10px",
              color: "#F4F6FB",
              fontFamily: "monospace",
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <span>✉ rashmin.sharma.dev@gmail.com</span>
            <span style={{ fontSize: "11px", color: copiedEmail ? "#2EA84B" : "#F2C81F" }}>
              {copiedEmail ? "COPIED ✓" : "COPY"}
            </span>
          </button>

          {/* LinkedIn */}
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              background: "rgba(47, 91, 234, 0.08)",
              border: "1px solid rgba(47, 91, 234, 0.25)",
              borderRadius: "10px",
              color: "#62C0FF",
              fontFamily: "monospace",
              fontSize: "13px",
              textDecoration: "none",
            }}
          >
            <span>🔗 LinkedIn Profile</span>
            <span>↗</span>
          </a>

          {/* GitHub */}
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "10px",
              color: "#F4F6FB",
              fontFamily: "monospace",
              fontSize: "13px",
              textDecoration: "none",
            }}
          >
            <span>⚡ GitHub Repositories</span>
            <span>↗</span>
          </a>
        </div>
      </div>

      {/* Inline Contact Form */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "14px",
          padding: "20px",
        }}
      >
        <h4
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11px",
            color: "#F2C81F",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          SEND DIRECT MESSAGE
        </h4>
        <ContactForm />
      </div>
    </div>
  );
}
