"use client";

import { useState } from "react";

export default function ContactForm() {
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult("Sending...");
    const formData = new FormData(event.target);
    formData.append("access_key", process.env.WEB3ACCESSKEY);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setResult("Form Submitted Successfully!");
        event.target.reset();
      } else {
        console.log("Error", data);
        setResult(data.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Submission failed", error);
      setResult("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Enter your name"
            className="w-full px-4 py-2 rounded-lg border border-ink/20 dark:border-paper/20 bg-paper dark:bg-night-surface text-ink dark:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-lg border border-ink/20 dark:border-paper/20 bg-paper dark:bg-night-surface text-ink dark:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Enter your message"
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
      {result && <p className="text-sm font-medium mt-2">{result}</p>}
    </form>
  );
}
