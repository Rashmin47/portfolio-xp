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

  const labelClass =
    "w-20 shrink-0 font-mono text-[11px] uppercase tracking-wider font-bold text-chrome-text/70";
  const fieldClass =
    "min-w-0 flex-1 bg-chrome-text/5 border border-chrome-text/10 rounded-md px-3 py-2 text-chrome-text placeholder:text-chrome-text/35 focus:outline-none focus:border-focus-ring focus:ring-1 focus:ring-focus-ring transition-colors";

  return (
    <form onSubmit={onSubmit} className="font-mono text-xs">
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

      {/* ── Compose header: one labelled row per field ─────────────────── */}
      <div className="divide-y divide-chrome-text/10 border-y border-chrome-text/10">
        <div className="flex items-center gap-3 py-3">
          <span className={labelClass}>To</span>
          <span className="min-w-0 flex-1 truncate rounded-md border border-sky/25 bg-sky/10 px-3 py-2 font-medium text-accent-sky">
            {siteConfig.name} &lt;rashminsharma47@gmail.com&gt;
          </span>
        </div>

        <div className="flex items-center gap-3 py-3">
          <label htmlFor="contact-email" className={labelClass}>
            From
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="your.email@domain.com"
            className={fieldClass}
          />
        </div>

        <div className="flex items-center gap-3 py-3">
          <label htmlFor="contact-name" className={labelClass}>
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            className={fieldClass}
          />
        </div>

        <div className="flex items-center gap-3 py-3">
          <label htmlFor="contact-subject" className={labelClass}>
            Subject
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            required
            placeholder="Project inquiry / Collaboration / Say hello"
            className={fieldClass}
          />
        </div>
      </div>

      {/* ── Message Compose Area ────────────────────────────────────────── */}
      <div className="pt-4">
        <label htmlFor="contact-message" className="sr-only">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={8}
          placeholder="Write your message here..."
          className="min-h-[220px] w-full resize-y rounded-lg border border-chrome-text/10 bg-chrome-text/5 p-4 text-sm leading-relaxed text-chrome-text placeholder:text-chrome-text/35 focus:outline-none focus:border-focus-ring focus:ring-1 focus:ring-focus-ring"
        />
      </div>

      {/* ── Status Feedback ─────────────────────────────────────────────── */}
      {status.message && (
        <div
          role="status"
          className={`mt-4 rounded-lg border p-3 text-xs leading-relaxed text-chrome-text ${
            status.type === "success"
              ? "border-board/40 bg-board/15"
              : status.type === "error"
              ? "border-red-500/40 bg-red-500/15"
              : "border-chrome-text/15 bg-chrome-text/10"
          }`}
        >
          {status.message}
        </div>
      )}

      {/* ── Action Bar ──────────────────────────────────────────────────── */}
      <div className="mt-4 flex flex-col gap-3 border-t border-chrome-text/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-[11px] text-chrome-text/65">
          Sent directly to Rashmin&apos;s inbox.
        </span>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-signal px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-ink transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 sm:w-auto"
        >
          <span>{isSubmitting ? "Sending..." : "Send email"}</span>
          <span>↗</span>
        </button>
      </div>
    </form>
  );
}
