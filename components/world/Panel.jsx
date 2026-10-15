"use client";

import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import MacWindow from "@/components/macos/MacWindow";
import MacDock from "@/components/macos/MacDock";
import MacMessagesAI from "@/components/macos/MacMessagesAI";

/**
 * Panel
 * -----
 * Route-aware macOS Desktop Shell over the persistent 3D desk:
 *  - Dynamically configures window layout based on the current page:
 *      /           -> Terminal (zsh)
 *      /lab        -> Terminal (hardware/experiments)
 *      /about      -> TextEdit (About Me.rtf)
 *      /notes      -> TextEdit (Notes.md)
 *      /contact    -> Mail (Compose)
 *      /projects   -> Finder (Projects)
 *      /experience -> Finder (Experience)
 *      /roadmap    -> Finder (Roadmap)
 *  - Floating macOS Dock at bottom
 *  - Integrated AI Assistant ("Rashmin AI — Messages")
 */
export default function Panel({ children }) {
  const pathname = usePathname();
  const [isAIOpen, setIsAIOpen] = useState(false);

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
      <MacWindow
        title={title}
        appType={appType}
        path={pathname}
        onOpenAI={() => setIsAIOpen(true)}
      >
        {children}
      </MacWindow>

      {/* ── Bottom macOS Dock ───────────────────────────────────────────── */}
      <MacDock onOpenAI={() => setIsAIOpen(true)} />

      {/* ── AI Assistant Messenger Modal ─────────────────────────────────── */}
      <MacMessagesAI
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />
    </>
  );
}
