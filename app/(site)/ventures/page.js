import { ventures } from "@/data/ventures";
import { buildMetadata } from "@/lib/seo";

const publishedVentures = ventures.filter((item) => item.published);

export const metadata = buildMetadata({
  title: "Ventures",
  description: "Venture initiatives and products by Rashmin Sharma.",
  path: "/ventures",
  noindex: publishedVentures.length === 0,
});

export default function VenturesPage() {
  return (
    <section>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
        Ventures
      </h1>
      {publishedVentures.length === 0 ? (
        <p className="text-muted">
          In progress. Venture information is currently being documented.
        </p>
      ) : (
        <div className="space-y-6">
          {publishedVentures.map((item) => (
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
