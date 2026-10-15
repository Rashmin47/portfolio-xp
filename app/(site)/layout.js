import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Panel from "@/components/world/Panel";

/**
 * Site layout wraps every route's content in the Panel component,
 * which renders as a left sidebar on desktop and bottom sheet on mobile.
 * Header and footer live inside the Panel so they scroll with content.
 */
export default function SiteLayout({ children }) {
  return (
    <Panel>
      {/* pointer-events:auto so links and buttons are clickable */}
      <div style={{ pointerEvents: "auto", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
        <main
          id="main-content"
          style={{ flex: 1, padding: "3rem 1.5rem", maxWidth: "100%", overflowX: "hidden" }}
        >
          {children}
        </main>
        <Footer />
      </div>
    </Panel>
  );
}
