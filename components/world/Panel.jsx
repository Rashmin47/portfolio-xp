"use client";

import { useState, useMemo, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import MacWindow from "@/components/macos/MacWindow";
import MacDock from "@/components/macos/MacDock";
import MacMessagesAI from "@/components/macos/MacMessagesAI";

/**
 * Panel
 * -----
 * Route-aware desktop shell over the persistent 3D desk.
 *
 * Homepage (/): window starts CLOSED so the 3D world is the first impression.
 *   Clicking the Terminal dock icon opens it.
 * All other routes: window opens automatically (navigating implies intent).
 * Closing the window always returns to the default desk view: on a sub-route it
 * navigates home (which resets the camera to the default pose), on the homepage
 * it just hides the window.
 */
export default function Panel({ children }) {
  const pathname = usePathname();
  const router = useRouter();
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

  // Compute window metadata by route
  const { title, appType } = useMemo(() => {
    if (pathname === "/") {
      return { title: "rashmin — zsh", appType: "terminal" };
    }
    if (pathname.startsWith("/lab")) {
      return { title: "rashmin@studio ~/lab — zsh", appType: "terminal" };
    }
    if (pathname.startsWith("/about")) {
      return { title: "About Me — Notes", appType: "textedit" };
    }
    if (pathname.startsWith("/notes")) {
      return { title: "Notes & Thoughts", appType: "textedit" };
    }
    if (pathname.startsWith("/contact")) {
      return { title: "New Message — Mail", appType: "mail" };
    }
    if (pathname.startsWith("/projects")) {
      return { title: "Projects — Files", appType: "finder" };
    }
    if (pathname.startsWith("/experience")) {
      return { title: "Experience & Ventures — Files", appType: "finder" };
    }
    if (pathname.startsWith("/roadmap")) {
      return { title: "Roadmap — Files", appType: "finder" };
    }
    return { title: "Rashmin Sharma — Portfolio", appType: "finder" };
  }, [pathname]);

  // Closing the window returns to the default desk view
  const handleCloseWindow = () => {
    setWindowOpen(false);
    if (pathname !== "/") router.push("/");
  };

  return (
    <>
      {/* ── Application Window ──────────────────────────────────────────── */}
      {windowOpen && (
        <MacWindow
          title={title}
          appType={appType}
          path={pathname}
          onOpenAI={() => setIsAIOpen(true)}
          onClose={handleCloseWindow}
        >
          {children}
        </MacWindow>
      )}

      {/* ── Bottom Dock ─────────────────────────────────────────────────── */}
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
