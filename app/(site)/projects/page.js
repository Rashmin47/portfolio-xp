import Link from "next/link";
import { projects } from "@/data/projects";
import { buildMetadata } from "@/lib/seo";
import { visibleItems } from "@/lib/content";

export async function generateMetadata() {
  const publishedProjects = visibleItems(projects);
  return buildMetadata({
    title: "Projects",
    description: "Shipped software projects and systems by Rashmin Sharma.",
    path: "/projects",
    noindex: publishedProjects.length === 0,
  });
}

export default function ProjectsPage() {
  const publishedProjects = visibleItems(projects);

  return (
    <section>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
        Projects
      </h1>
      {publishedProjects.length === 0 ? (
        <p className="text-muted">
          In progress. Project writeups and case studies are currently being prepared.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {publishedProjects.map((project) => (
            <article
              key={project.slug}
              className="p-6 rounded-card border border-ink/10 dark:border-paper/10 bg-paper dark:bg-night-surface flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h2 className="text-xl font-semibold">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="hover:text-cobalt dark:hover:text-sky"
                    >
                      {project.title}
                    </Link>
                  </h2>
                  {project.dummy && (
                    <span className="px-2 py-0.5 text-xs font-mono font-bold bg-signal text-ink rounded">
                      DUMMY
                    </span>
                  )}
                </div>
                <p className="text-muted text-sm mb-4">{project.description}</p>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-xs font-mono rounded-full bg-ink/5 dark:bg-paper/10 text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="pt-2 flex items-center justify-between text-sm">
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-cobalt dark:text-sky hover:underline font-mono text-xs"
                >
                  View details &rarr;
                </Link>
                {project.year && (
                  <span className="text-xs font-mono text-muted">{project.year}</span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
