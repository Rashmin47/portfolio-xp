/**
 * Layout for the full-screen 3D landing page.
 * No header/footer — the 3D scene fills the entire viewport.
 */
export default function LandingLayout({ children }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#0B1220",
      }}
    >
      {children}
    </div>
  );
}
