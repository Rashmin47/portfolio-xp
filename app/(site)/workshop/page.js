import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { hotspots } from "@/data/hotspots";
import WorkshopClient from "@/components/workshop/WorkshopClient";

export const metadata = buildMetadata({
  title: "The Workshop",
  description:
    "An interactive 3D workshop — explore projects, experiments and roadmap.",
  path: "/workshop",
  noindex: true,
});

export default function WorkshopPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight">
        The Workshop
      </h1>

      {/* Server-rendered nav — always present for accessibility & no-JS */}
      <nav aria-label="Workshop sections">
        <ul className="flex flex-col sm:flex-row gap-4">
          {hotspots.map((spot) => (
            <li key={spot.id}>
              <Link
                href={spot.href}
                className="block p-4 rounded-card border border-ink/10 dark:border-paper/10
                           bg-paper dark:bg-night-surface hover:border-cobalt
                           dark:hover:border-sky transition-colors"
              >
                <span className="font-semibold">{spot.label}</span>
                <span className="block text-sm text-muted mt-1">
                  {spot.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <p className="text-sm text-muted">
        Prefer the standard view?{" "}
        <Link href="/" className="text-cobalt dark:text-sky hover:underline">
          Classic view
        </Link>
      </p>

      <WorkshopClient hotspots={hotspots} />
    </div>
  );
}
