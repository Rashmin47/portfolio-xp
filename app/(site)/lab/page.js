import { lab } from "@/data/lab";

const publishedLab = lab.filter((item) => item.published);

export const metadata = {
  title: "The Lab | Rashmin Sharma",
  description: "Hardware, AI, and code experiments by Rashmin Sharma.",
  ...(publishedLab.length === 0 ? { robots: { index: false } } : {}),
};

export default function LabPage() {
  return (
    <section>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
        The Lab
      </h1>
      {publishedLab.length === 0 ? (
        <p className="text-muted">
          In progress. Hardware and software experiments are currently being documented.
        </p>
      ) : (
        <div className="grid gap-6">
          {publishedLab.map((item) => (
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
