"use client";

import { useState, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import MacWindow from "@/components/macos/MacWindow";
import MacDock from "@/components/macos/MacDock";
import MacMessagesAI from "@/components/macos/MacMessagesAI";

/**
 * Panel
 * -----
 * Route-aware macOS Desktop Shell over the persistent 3D desk.
 *
 * Homepage (/): window starts CLOSED so the 3D world is the first impression.
 *   Clicking the Terminal dock icon opens it.
 * All other routes: window opens automatically (navigating implies intent).
 */
export default function Panel({ children }) {
  const pathname = usePathname();
  const [isAIOpen, setIsAIOpen] = useState(false);

  // On the homepage, window starts closed so the 3D scene is visible first.
  // On every other route it auto-opens because the user navigated there.
  const [windowOpen, setWindowOpen] = useState(pathname !== "/");

  // When the route changes away from home, ensure the window opens.
  useEffect(() => {
    if (pathname !== "/") {
      setWindowOpen(true);
    }
  }, [pathname]);

  // Compute macOS window metadata by route
  const { title, appType } = useMemo(() => {
    if (pathname === "/") {
      return { title: "rashmin — zsh", appType: "terminal" };
    }
    if (pathname.startsWith("/lab")) {
      return { title: "rashmin@studio ~/lab — zsh", appType: "terminal" };
    }
    if (pathname.startsWith("/about")) {
      return { title: "About Me — TextEdit", appType: "textedit" };
    }
    if (pathname.startsWith("/notes")) {
      return { title: "Notes & Thoughts — TextEdit", appType: "textedit" };
    }
    if (pathname.startsWith("/contact")) {
      return { title: "New Message — Mail", appType: "mail" };
    }
    if (pathname.startsWith("/projects")) {
      return { title: "Projects — Finder", appType: "finder" };
    }
    if (pathname.startsWith("/experience")) {
      return { title: "Experience & Ventures — Finder", appType: "finder" };
    }
    if (pathname.startsWith("/roadmap")) {
      return { title: "Roadmap — Finder", appType: "finder" };
    }
    return { title: "Rashmin Sharma — Portfolio", appType: "finder" };
  }, [pathname]);

  return (
    <>
      {/* ── macOS Application Window ────────────────────────────────────── */}
      {windowOpen && (
        <MacWindow
          title={title}
          appType={appType}
          path={pathname}
          onOpenAI={() => setIsAIOpen(true)}
          onClose={() => {
            // On homepage, close just hides the window (shows 3D world again)
            if (pathname === "/") {
              setWindowOpen(false);
            }
          }}
        >
          {children}
        </MacWindow>
      )}

      {/* ── Bottom macOS Dock ───────────────────────────────────────────── */}
      <MacDock
        onOpenAI={() => setIsAIOpen(true)}
        onOpenTerminal={pathname === "/" ? () => setWindowOpen(true) : null}
      />

      {/* ── AI Assistant Messenger Modal ─────────────────────────────────── */}
      <MacMessagesAI
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />
    </>
  );
}
