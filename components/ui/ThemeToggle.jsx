"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle({ className = "" }) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const dark = document.documentElement.classList.contains("dark");
    setIsDark(dark);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("theme", "dark");
      } catch (_) {}
    } else {
      document.documentElement.classList.remove("dark");
      try {
        localStorage.setItem("theme", "light");
      } catch (_) {}
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        mounted
          ? isDark
            ? "Switch to light theme"
            : "Switch to dark theme"
          : "Toggle theme"
      }
      className={`font-mono text-xs uppercase tracking-wider px-2.5 py-1.5 rounded-[14px] border border-ink/15 dark:border-paper/15 text-muted hover:text-ink dark:hover:text-paper hover:bg-ink/[0.04] dark:hover:bg-paper/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-signal select-none cursor-pointer flex items-center gap-1.5 ${className}`}
    >
      <span
        aria-hidden="true"
        className={`w-2 h-2 rounded-full transition-colors ${
          mounted && isDark ? "bg-sky" : "bg-signal"
        }`}
      />
      <span>{mounted ? (isDark ? "DARK" : "LIGHT") : "THEME"}</span>
    </button>
  );
}
