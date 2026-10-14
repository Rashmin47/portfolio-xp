import Link from "next/link";
import { projects } from "@/data/projects";
import { buildMetadata } from "@/lib/seo";

const publishedProjects = projects.filter((item) => item.published);

export const metadata = buildMetadata({
  title: "Projects",
  description: "Shipped software projects and systems by Rashmin Sharma.",
  path: "/projects",
  noindex: publishedProjects.length === 0,
});

export default function ProjectsPage() {
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
        <ul className="space-y-4">
          {publishedProjects.map((project) => (
            <li key={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                className="text-cobalt hover:underline dark:text-sky font-medium"
              >
                {project.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
