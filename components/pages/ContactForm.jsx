"use client";

import { useState } from "react";
import { siteConfig } from "@/data/site";

export default function ContactForm() {
  const [status, setStatus] = useState({
    type: "idle", // "idle" | "loading" | "success" | "error"
    message: "",
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      // Graceful fallback to mailto
      const form = event.currentTarget;
      const formData = new FormData(form);
      const subject = formData.get("subject") || "Hello from Portfolio";
      const message = formData.get("message") || "";
      const email = formData.get("email") || "";
      window.location.href = `mailto:rashminsharma47@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(`From: ${email}\n\n${message}`)}`;
      setStatus({
        type: "success",
        message: "Opening your email client to send message...",
      });
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    // Bot honeypot check
    if (formData.get("botcheck")) {
      return;
    }

    setStatus({ type: "loading", message: "Sending your message..." });
    formData.append("access_key", accessKey);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setStatus({
          type: "success",
          message: "Message delivered successfully. I will get back to you soon.",
        });
        form.reset();
      } else {
        setStatus({
          type: "error",
          message: data.message || "Failed to send message. Please try again.",
        });
      }
    } catch {
      setStatus({
        type: "error",
        message:
          "Network error while sending message. Please reach out directly via LinkedIn or GitHub.",
      });
    }
  };

  const isSubmitting = status.type === "loading";

  return (
    <form onSubmit={onSubmit} className="space-y-4 font-mono text-xs">
      {/* Bot honeypot field */}
      <input
        type="checkbox"
        name="botcheck"
        id="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        style={{ display: "none" }}
      />

      {/* ── macOS Mail Header Fields ────────────────────────────────────── */}
      <div className="space-y-2 border-b border-paper/10 pb-4">
        {/* To field */}
        <div className="flex items-center gap-3">
          <span className="w-16 text-muted uppercase font-bold text-[11px]">To:</span>
          <span className="px-2.5 py-1 rounded bg-sky/15 text-sky border border-sky/20 font-medium">
            {siteConfig.name} &lt;rashminsharma47@gmail.com&gt;
          </span>
        </div>

        {/* From field */}
        <div className="flex items-center gap-3">
          <label htmlFor="contact-email" className="w-16 text-muted uppercase font-bold text-[11px]">
            From:
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="your.email@domain.com"
            className="flex-1 bg-paper/5 border border-paper/10 rounded px-3 py-1.5 text-paper placeholder:text-muted/50 focus:outline-none focus:border-signal"
          />
        </div>

        {/* Name field */}
        <div className="flex items-center gap-3">
          <label htmlFor="contact-name" className="w-16 text-muted uppercase font-bold text-[11px]">
            Name:
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            className="flex-1 bg-paper/5 border border-paper/10 rounded px-3 py-1.5 text-paper placeholder:text-muted/50 focus:outline-none focus:border-signal"
          />
        </div>

        {/* Subject field */}
        <div className="flex items-center gap-3">
          <label htmlFor="contact-subject" className="w-16 text-muted uppercase font-bold text-[11px]">
            Subject:
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            required
            placeholder="Project inquiry / Collaboration / Say hello"
            className="flex-1 bg-paper/5 border border-paper/10 rounded px-3 py-1.5 text-paper placeholder:text-muted/50 focus:outline-none focus:border-signal"
          />
        </div>
      </div>

      {/* ── Message Compose Area ────────────────────────────────────────── */}
      <div className="pt-2">
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          placeholder="Write your message here..."
          className="w-full bg-paper/5 border border-paper/10 rounded-lg p-3 text-sm text-paper placeholder:text-muted/50 focus:outline-none focus:border-signal resize-none leading-relaxed"
        />
      </div>

      {/* ── Status Feedback ─────────────────────────────────────────────── */}
      {status.message && (
        <div
          role="status"
          className={`p-3 rounded-lg text-xs leading-relaxed ${
            status.type === "success"
              ? "bg-board/20 text-board border border-board/30"
              : status.type === "error"
              ? "bg-red-500/20 text-red-200 border border-red-500/30"
              : "bg-paper/10 text-paper"
          }`}
        >
          {status.message}
        </div>
      )}

      {/* ── Action Bar ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-[11px] text-muted">
          Sent directly to Rashmin&apos;s inbox.
        </span>

        <button
          type="submit"
          disabled={isSubmitting}
          className="font-mono text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg bg-signal text-ink hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2 shadow-md"
        >
          <span>{isSubmitting ? "Sending..." : "Send email"}</span>
          <span>↗</span>
        </button>
      </div>
    </form>
  );
}
