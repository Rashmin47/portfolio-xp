"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState({
    type: "idle", // "idle" | "loading" | "success" | "error"
    message: "",
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setStatus({
        type: "error",
        message:
          "The contact form is currently unconfigured. Please connect via LinkedIn or GitHub instead.",
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
          message: "Thank you! Your message has been sent successfully.",
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
          "Network error while sending message. Please try again or reach out directly.",
      });
    }
  };

  const isSubmitting = status.type === "loading";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Honeypot field for bot protection */}
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
      <label htmlFor="botcheck" className="sr-only" aria-hidden="true">
        Do not check this box
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="contact-name"
            className="block text-sm font-medium mb-1"
          >
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            className="w-full px-4 py-2 rounded-lg border border-ink/20 dark:border-paper/20 bg-paper dark:bg-night-surface text-ink dark:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="block text-sm font-medium mb-1"
          >
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full px-4 py-2 rounded-lg border border-ink/20 dark:border-paper/20 bg-paper dark:bg-night-surface text-ink dark:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block text-sm font-medium mb-1"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          placeholder="What would you like to discuss?"
          className="w-full px-4 py-2 rounded-lg border border-ink/20 dark:border-paper/20 bg-paper dark:bg-night-surface text-ink dark:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-lg bg-ink text-paper dark:bg-paper dark:text-ink font-medium hover:opacity-90 disabled:opacity-50 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal cursor-pointer"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </div>

      <div aria-live="polite" role="status">
        {status.message && (
          <div
            className={`p-3 rounded-lg text-sm font-medium ${
              status.type === "success"
                ? "bg-board/15 text-board border border-board/30"
                : status.type === "error"
                ? "bg-signal text-ink border border-ink/20"
                : "text-muted"
            }`}
          >
            {status.message}
          </div>
        )}
      </div>
    </form>
  );
}
