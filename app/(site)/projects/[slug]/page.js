import { projects } from "@/data/projects";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return projects.filter((p) => p.published).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug && p.published);

  if (!project) {
    return buildMetadata({
      title: "Project Not Found",
      description: "Project details are in progress.",
      path: `/projects/${slug}`,
      noindex: true,
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
  const project = projects.find((p) => p.slug === slug && p.published);

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
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
        {project.title}
      </h1>
      <p className="text-lg leading-relaxed">{project.description}</p>
    </article>
  );
}
