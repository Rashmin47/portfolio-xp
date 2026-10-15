import { projects } from "@/data/projects";
import { buildMetadata } from "@/lib/seo";
import { visibleItems } from "@/lib/content";
import SectionHeader from "@/components/ui/SectionHeader";
import ProjectRow from "@/components/projects/ProjectRow";

export async function generateMetadata() {
  const publishedProjects = visibleItems(projects);
  return buildMetadata({
    title: "Projects",
    description: "Projects and case studies by Rashmin Sharma.",
    path: "/projects",
    noindex: publishedProjects.length === 0,
  });
}

export default function ProjectsPage() {
  const publishedProjects = visibleItems(projects);

  return (
    <div className="w-full">
      <SectionHeader number="01" label="INDEX" />

      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-ink dark:text-paper mb-3">
          Projects
        </h1>
        <p className="text-muted text-base sm:text-lg max-w-2xl leading-relaxed">
          Selected projects and case studies.
          Hover a project on desktop to preview its interface.
        </p>
      </div>

      {publishedProjects.length === 0 ? (
        <div className="py-12 border-t border-ink/10 dark:border-paper/10">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">
            In progress · Case studies and project writeups are currently being prepared.
          </p>
        </div>
      ) : (
        <div className="border-t border-ink/10 dark:border-paper/10">
          {publishedProjects.map((project, index) => (
            <ProjectRow key={project.slug} project={project} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
