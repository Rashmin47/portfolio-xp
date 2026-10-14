import { roadmap } from "@/data/roadmap";
import { buildMetadata } from "@/lib/seo";

const publishedRoadmap = roadmap.filter((item) => item.published);

export const metadata = buildMetadata({
  title: "Roadmap",
  description: "Now, next, and later roadmap for Rashmin Sharma.",
  path: "/roadmap",
  noindex: publishedRoadmap.length === 0,
});

export default function RoadmapPage() {
  return (
    <section>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
        Roadmap
      </h1>
      {publishedRoadmap.length === 0 ? (
        <p className="text-muted">
          In progress. The public roadmap is currently being outlined.
        </p>
      ) : (
        <div className="space-y-6">
          {publishedRoadmap.map((item) => (
            <article key={item.id} className="p-4 rounded-card border border-ink/10 dark:border-paper/10">
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              <p className="text-muted">{item.description}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
