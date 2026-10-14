import { projects } from "@/data/projects";
import { buildMetadata } from "@/lib/seo";
import { visibleItems } from "@/lib/content";

export async function generateStaticParams() {
  return visibleItems(projects).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const visible = visibleItems(projects);
  const project = visible.find((p) => p.slug === slug);

  if (!project) {
    return buildMetadata({
      title: "Project Not Found",
      description: "Project details are in progress.",
      path: `/projects/${slug}`,
      noindex: true,
    });
  }

  if (project.dummy) {
    return buildMetadata({
      title: `${project.title} (Dummy)`,
      description: project.description || "Dummy project for layout testing.",
      path: `/projects/${slug}`,
      noindex: true,
      canonical: false,
    });
  }

  return buildMetadata({
    title: project.title,
    description: project.description || "Project details",
    path: `/projects/${slug}`,
    noindex: false,
  });
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const visible = visibleItems(projects);
  const project = visible.find((p) => p.slug === slug);

  if (!project) {
    return (
      <section>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
          Project In Progress
        </h1>
        <p className="text-muted">
          In progress. This project writeup has not been published yet.
        </p>
      </section>
    );
  }

  return (
    <article>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {project.title}
        </h1>
        {project.dummy && (
          <span className="px-2 py-0.5 text-xs font-mono font-bold bg-signal text-ink rounded">
            DUMMY
          </span>
        )}
      </div>

      {project.year && (
        <p className="text-sm font-mono text-muted mb-4">{project.year}</p>
      )}

      <p className="text-lg leading-relaxed mb-6">{project.description}</p>

      {project.tags && project.tags.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs font-mono rounded-full bg-ink/5 dark:bg-paper/10 text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {project.decisionLog && project.decisionLog.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Decision log</h2>
          <div className="space-y-4">
            {project.decisionLog.map((entry, i) => (
              <div
                key={i}
                className="p-4 rounded-card border border-ink/10 dark:border-paper/10"
              >
                <h3 className="font-medium mb-1">{entry.decision}</h3>
                <p className="text-sm text-muted">{entry.rationale}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.href && (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-cobalt dark:text-sky hover:underline font-mono text-sm"
        >
          View project &rarr;
        </a>
      )}
    </article>
  );
}
