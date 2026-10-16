import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site";
import { buildMetadata, pageBreadcrumb } from "@/lib/seo";
import { visibleItems } from "@/lib/content";
import SectionHeader from "@/components/ui/SectionHeader";
import ProjectRow from "@/components/projects/ProjectRow";
import MacFinder from "@/components/macos/MacFinder";
import JsonLd from "@/components/seo/JsonLd";

export async function generateMetadata() {
  const publishedProjects = visibleItems(projects);
  return buildMetadata({
    title: "Projects and Case Studies by Rashmin Sharma",
    description: `Engineering records by ${siteConfig.name}: the problem, constraints, decisions with trade-offs, what broke and the outcome.`,
    path: "/projects",
    noindex: publishedProjects.length === 0,
  });
}

export default function ProjectsPage() {
  const publishedProjects = visibleItems(projects);

  return (
    <MacFinder sectionTitle="Projects" currentFolder="projects" itemCount={publishedProjects.length}>
      <JsonLd data={pageBreadcrumb("Projects", "/projects")} />
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
    </MacFinder>
  );
}
