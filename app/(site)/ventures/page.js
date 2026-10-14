import { ventures } from "@/data/ventures";

const publishedVentures = ventures.filter((item) => item.published);

export const metadata = {
  title: "Ventures | Rashmin Sharma",
  description: "Venture initiatives and products by Rashmin Sharma.",
  ...(publishedVentures.length === 0 ? { robots: { index: false } } : {}),
};

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
