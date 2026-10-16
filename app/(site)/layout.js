import Header from "@/components/site/Header";
import Panel from "@/components/world/Panel";

/**
 * Site layout provides:
 *  - Top macOS System Menu Bar (fixed at top:  Studio, Active App, Status Clock)
 *  - Route-aware macOS Application Window (Panel) over the persistent 3D desk
 *  - Bottom macOS Dock launcher
 */
export default function SiteLayout({ children, hero }) {
  return (
    <>
      {/* Top macOS System Menu Bar */}
      <Header />

      {/* Main macOS Application Window over 3D Workshop Desk */}
      <Panel>
        {/* Single scroll owner: the app shells (Finder/editor) or the window body */}
        <main id="main-content" className="flex-1 min-h-0 flex flex-col">
          {children}
        </main>
      </Panel>

      {/* Homepage hero widget, outside the window (null on other routes) */}
      {hero}
    </>
  );
}
