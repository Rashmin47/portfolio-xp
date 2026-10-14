"use client";

import { Component, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Link from "next/link";

/** Classic-links fallback rendered when WebGL context creation or rendering fails */
function SceneFallback() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded-card
                 border border-ink/10 dark:border-paper/10 bg-paper dark:bg-night-surface p-6"
      style={{ height: "70vh", minHeight: "360px" }}
      role="alert"
    >
      <p className="text-sm text-muted text-center">
        The 3D scene could not be loaded. Use the links below to navigate.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/projects" className="text-cobalt dark:text-sky hover:underline text-sm font-mono">
          Shipped →
        </Link>
        <Link href="/lab" className="text-cobalt dark:text-sky hover:underline text-sm font-mono">
          The Lab →
        </Link>
        <Link href="/roadmap" className="text-cobalt dark:text-sky hover:underline text-sm font-mono">
          Roadmap →
        </Link>
      </div>
    </div>
  );
}

/** Error boundary wrapping the Canvas */
class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <SceneFallback />;
    }
    return this.props.children;
  }
}

function PlaceholderBox() {
  return (
    <mesh>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#2F5BEA" />
    </mesh>
  );
}

export default function Scene() {
  return (
    <SceneErrorBoundary>
      <div
        className="rounded-card overflow-hidden border border-ink/10 dark:border-paper/10"
        style={{ height: "70vh", minHeight: "360px" }}
      >
        <Canvas
          frameloop="demand"
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 4], fov: 50 }}
        >
          <ambientLight intensity={1.2} />
          <Suspense fallback={null}>
            <PlaceholderBox />
          </Suspense>
        </Canvas>
      </div>
    </SceneErrorBoundary>
  );
}
