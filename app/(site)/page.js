import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/site";
import { projects } from "@/data/projects";
import { roadmap } from "@/data/roadmap";
import { notes } from "@/data/notes";
import { buildMetadata, siteUrl } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = buildMetadata({
  title: siteConfig.name,
  description: siteConfig.hero.support,
  path: "/",
});

export default function HomePage() {
  const publishedProjects = projects.filter((p) => p.published).slice(0, 3);
  const publishedRoadmap = roadmap.filter((r) => r.published).slice(0, 3);
  const publishedNotes = notes.filter((n) => n.published).slice(0, 2);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    url: siteUrl,
    sameAs: [siteConfig.github, siteConfig.linkedin].filter(Boolean),
  };

  return (
    <div className="space-y-8">
      <JsonLd data={personSchema} />

      {/* Hero Section */}
      <section className="py-10 md:py-16 border-b border-ink/10 dark:border-paper/10">
        <div
          className={`grid gap-8 items-center ${
            siteConfig.hero.heroImage ? "md:grid-cols-2" : "grid-cols-1"
          }`}
        >
          <div>
            <h1 className="text-sm font-mono text-muted uppercase tracking-widest mb-3">
              {siteConfig.hero.h1}
            </h1>
            <p className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-ink dark:text-paper mb-6">
              {siteConfig.hero.tagline}
            </p>
            <p className="text-lg sm:text-xl text-muted max-w-2xl leading-relaxed mb-8">
              {siteConfig.hero.support}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {siteConfig.hero.ctas.map((cta, index) => (
                <Link
                  key={cta.href}
                  href={cta.href}
                  className={`px-6 py-3 rounded-card font-medium transition-all ${
                    index === 0
                      ? "bg-cobalt text-paper hover:bg-cobalt/90 dark:bg-cobalt dark:text-paper"
                      : "border border-ink/20 dark:border-paper/20 hover:border-ink dark:hover:border-paper"
                  }`}
                >
                  {cta.label}
                </Link>
              ))}
            </div>
          </div>
          {siteConfig.hero.heroImage && (
            <div className="relative aspect-4/3 rounded-card overflow-hidden border border-ink/10 dark:border-paper/10">
              <Image
                src={siteConfig.hero.heroImage}
                alt={siteConfig.name}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* Shipped Projects (visible if published projects exist) */}
      {publishedProjects.length > 0 && (
        <section className="py-10 border-b border-ink/10 dark:border-paper/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-display">Shipped</h2>
            <Link
              href="/projects"
              className="text-sm text-cobalt dark:text-sky hover:underline font-mono"
            >
              All projects &rarr;
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {publishedProjects.map((project) => (
              <article
                key={project.slug}
                className="p-6 rounded-card border border-ink/10 dark:border-paper/10 bg-paper dark:bg-night-surface"
              >
                <h3 className="text-xl font-semibold mb-2">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="hover:text-cobalt dark:hover:text-sky"
                  >
                    {project.title}
                  </Link>
                </h3>
                <p className="text-muted text-sm">{project.description}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Building Now (visible if items exist) */}
      {siteConfig.building && siteConfig.building.length > 0 && (
        <section className="py-10 border-b border-ink/10 dark:border-paper/10">
          <h2 className="text-2xl font-bold font-display mb-6">Building now</h2>
          <ul className="space-y-3">
            {siteConfig.building.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full bg-board mt-2 shrink-0"
                  aria-hidden="true"
                />
                <span className="text-base text-ink dark:text-paper">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Next Roadmap Items (visible if published items exist) */}
      {publishedRoadmap.length > 0 && (
        <section className="py-10 border-b border-ink/10 dark:border-paper/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-display">Next</h2>
            <Link
              href="/roadmap"
              className="text-sm text-cobalt dark:text-sky hover:underline font-mono"
            >
              Full roadmap &rarr;
            </Link>
          </div>
          <div className="grid gap-4">
            {publishedRoadmap.map((item) => (
              <article
                key={item.id}
                className="p-4 rounded-card border border-ink/10 dark:border-paper/10 bg-paper dark:bg-night-surface"
              >
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted">{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Notes (visible if published notes exist) */}
      {publishedNotes.length > 0 && (
        <section className="py-10 border-b border-ink/10 dark:border-paper/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-display">Notes</h2>
            <Link
              href="/notes"
              className="text-sm text-cobalt dark:text-sky hover:underline font-mono"
            >
              All notes &rarr;
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {publishedNotes.map((note) => (
              <article
                key={note.slug}
                className="p-6 rounded-card border border-ink/10 dark:border-paper/10 bg-paper dark:bg-night-surface"
              >
                <h3 className="text-xl font-semibold mb-2">
                  <Link
                    href={`/notes/${note.slug}`}
                    className="hover:text-cobalt dark:hover:text-sky"
                  >
                    {note.title}
                  </Link>
                </h3>
                <p className="text-muted text-sm">{note.summary}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Closing Contact Block */}
      <section className="py-10">
        <div className="p-8 rounded-card border border-ink/10 dark:border-paper/10 bg-paper dark:bg-night-surface">
          <h2 className="text-2xl font-bold font-display mb-3">Get in touch</h2>
          <p className="text-muted max-w-xl mb-6">
            Interested in working together, discussing software systems, or
            following along? Let&apos;s connect.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-card bg-ink text-paper dark:bg-paper dark:text-ink font-medium hover:opacity-90 transition-opacity"
            >
              Contact
            </Link>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cobalt dark:text-sky hover:underline font-medium text-sm"
            >
              GitHub
            </a>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cobalt dark:text-sky hover:underline font-medium text-sm"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
