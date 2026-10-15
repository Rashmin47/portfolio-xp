"use client";

import { useState } from "react";
import { siteConfig } from "@/data/site";

/**
 * MacMail
 * -------
 * macOS Mail Compose window matching the Mail reference:
 *  - Header fields: To, From, Subject
 *  - Message compose textarea
 *  - Send button with mailto prefill and copied state
 */
export default function MacMail({
  recipientEmail = "rashminsharma47@gmail.com",
  children,
}) {
  const [fromEmail, setFromEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(
      subject || "Hello from Portfolio"
    )}&body=${encodeURIComponent(
      `From: ${fromEmail}\n\n${message}`
    )}`;
    window.location.href = mailtoUrl;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="flex-1 flex flex-col bg-night-surface/95 text-paper p-6 overflow-y-auto">
      <form onSubmit={handleSend} className="space-y-4 max-w-xl mx-auto w-full">
        {/* ── Mail Header Fields ────────────────────────────────────────── */}
        <div className="space-y-2 border-b border-paper/10 pb-4">
          {/* To field */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="w-16 text-muted uppercase font-semibold">To:</span>
            <div className="flex-1 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-sky/15 text-sky font-medium border border-sky/20">
                {siteConfig.name} &lt;{recipientEmail}&gt;
              </span>
            </div>
          </div>

          {/* From field */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <label htmlFor="mail-from" className="w-16 text-muted uppercase font-semibold">
              From:
            </label>
            <input
              id="mail-from"
              type="email"
              required
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              placeholder="your.email@domain.com"
              className="flex-1 bg-paper/5 border border-paper/10 rounded px-3 py-1.5 text-paper placeholder:text-muted/50 focus:outline-none focus:border-signal transition-colors"
            />
          </div>

          {/* Subject field */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <label htmlFor="mail-subject" className="w-16 text-muted uppercase font-semibold">
              Subject:
            </label>
            <input
              id="mail-subject"
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Project inquiry / Opportunity / Say hello"
              className="flex-1 bg-paper/5 border border-paper/10 rounded px-3 py-1.5 text-paper placeholder:text-muted/50 focus:outline-none focus:border-signal transition-colors"
            />
          </div>
        </div>

        {/* ── Message Compose Area ──────────────────────────────────────── */}
        <div className="pt-2">
          <textarea
            required
            rows={7}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            className="w-full bg-paper/5 border border-paper/10 rounded-lg p-4 font-mono text-sm text-paper placeholder:text-muted/50 focus:outline-none focus:border-signal resize-none transition-colors"
          />
        </div>

        {/* ── Bottom Action Toolbar ─────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs font-mono text-muted">
            <span>Also on:</span>
            {siteConfig.linkedin && (
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-sky hover:underline"
              >
                LinkedIn
              </a>
            )}
            <span>·</span>
            {siteConfig.github && (
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noreferrer"
                className="text-sky hover:underline"
              >
                GitHub
              </a>
            )}
          </div>

          <button
            type="submit"
            className="font-mono text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg bg-signal text-ink hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center gap-2"
          >
            <span>{sent ? "Opening Mail client..." : "Send email"}</span>
            <span>↗</span>
          </button>
        </div>

        {/* Secondary children / server details */}
        {children && <div className="mt-8 pt-6 border-t border-paper/10">{children}</div>}
      </form>
    </div>
  );
}
