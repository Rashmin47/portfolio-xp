"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

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
    <form onSubmit={onSubmit} className="space-y-6">
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
      <label htmlFor="botcheck" className="sr-only" aria-hidden="true">
        Do not check this box
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="contact-name"
            className="block font-mono text-xs uppercase tracking-wider text-muted font-medium"
          >
            Name *
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            className="w-full px-4 py-2.5 rounded-[14px] border border-ink/20 dark:border-paper/20 bg-paper dark:bg-night-surface text-ink dark:text-paper placeholder:text-muted/60 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-signal text-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="contact-email"
            className="block font-mono text-xs uppercase tracking-wider text-muted font-medium"
          >
            Email *
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 rounded-[14px] border border-ink/20 dark:border-paper/20 bg-paper dark:bg-night-surface text-ink dark:text-paper placeholder:text-muted/60 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-signal text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="contact-message"
          className="block font-mono text-xs uppercase tracking-wider text-muted font-medium"
        >
          Message *
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          placeholder="What would you like to discuss?"
          className="w-full px-4 py-2.5 rounded-[14px] border border-ink/20 dark:border-paper/20 bg-paper dark:bg-night-surface text-ink dark:text-paper placeholder:text-muted/60 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-signal text-sm leading-relaxed"
        />
      </div>

      <div>
        <Button
          type="submit"
          variant="primary"
          arrow
          disabled={isSubmitting}
          className={isSubmitting ? "opacity-60 cursor-not-allowed" : ""}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </div>

      <div aria-live="polite" role="status">
        {status.message && (
          <div
            className={`p-4 rounded-[14px] text-sm font-medium ${
              status.type === "success"
                ? "bg-board/15 text-board border border-board/30"
                : status.type === "error"
                ? "bg-signal/20 text-ink border border-signal font-mono text-xs"
                : "text-muted font-mono text-xs"
            }`}
          >
            {status.message}
          </div>
        )}
      </div>
    </form>
  );
}
