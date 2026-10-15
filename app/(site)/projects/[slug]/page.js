import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { buildMetadata } from "@/lib/seo";
import { visibleItems } from "@/lib/content";
import SpecTable, { SpecRow } from "@/components/ui/SpecTable";
import SectionHeader from "@/components/ui/SectionHeader";
import Prose from "@/components/ui/Prose";
import DummyBadge from "@/components/ui/DummyBadge";

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

  const name = project.name || project.title;
  const summary = project.summary || project.description || "Project details";

  if (project.dummy) {
    return buildMetadata({
      title: `${name} (Dummy)`,
      description: summary,
      path: `/projects/${slug}`,
      noindex: true,
      canonical: false,
    });
  }

  return buildMetadata({
    title: name,
    description: summary,
    path: `/projects/${slug}`,
    noindex: false,
  });
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const visible = visibleItems(projects);
  const currentIndex = visible.findIndex((p) => p.slug === slug);
  const project = visible[currentIndex];

  if (!project) {
    notFound();
  }

  const name = project.name || project.title;
  const summary = project.summary || project.description;
  const prevProject = currentIndex > 0 ? visible[currentIndex - 1] : null;
  const nextProject =
    currentIndex < visible.length - 1 ? visible[currentIndex + 1] : null;

  const validScreenshots = (project.images || []).filter((img) => !!img.alt);

  const sections = [
    { id: "problem", label: "01. PROBLEM", exists: !!project.problem },
    { id: "role", label: "02. MY ROLE", exists: !!project.role },
    {
      id: "constraints",
      label: "03. CONSTRAINTS",
      exists: !!(project.constraints && project.constraints.length > 0),
    },
    {
      id: "decisions",
      label: "04. DECISIONS",
      exists: !!(project.decisions && project.decisions.length > 0),
    },
    {
      id: "architecture",
      label: "05. ARCHITECTURE",
      exists: !!(
        project.architecture &&
        (project.architecture.text || project.architecture.image)
      ),
    },
    {
      id: "breakages",
      label: "06. WHAT BROKE",
      exists: !!(project.breakages && project.breakages.length > 0),
    },
    { id: "outcome", label: "07. OUTCOME", exists: !!project.outcome },
    {
      id: "screenshots",
      label: "08. SCREENSHOTS",
      exists: validScreenshots.length > 0,
    },
  ].filter((s) => s.exists);

  const hasSpecData =
    project.role ||
    (project.tags && project.tags.length > 0) ||
    project.year ||
    project.status ||
    (project.links && project.links.length > 0);

  return (
    <article className="w-full p-4 sm:p-6">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/projects"
          className="font-mono text-xs uppercase tracking-wider text-muted hover:text-ink dark:hover:text-paper inline-flex items-center gap-1.5 transition-colors"
        >
          <span aria-hidden="true">←</span>
          <span>Back to projects</span>
        </Link>
      </div>

      {/* Header: Title and Summary */}
      <header className="mb-8">
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-ink dark:text-paper">
            {name}
          </h1>
          {project.dummy && <DummyBadge />}
        </div>
        {summary && (
          <p className="text-lg sm:text-xl text-muted max-w-3xl leading-relaxed">
            {summary}
          </p>
        )}
      </header>

      {/* SpecTable: Role, Stack, Year, Status, Links */}
      {hasSpecData && (
        <div className="mb-12 max-w-2xl">
          <SpecTable>
            {project.role && <SpecRow label="ROLE" value={project.role} />}
            {project.tags && project.tags.length > 0 && (
              <SpecRow label="STACK" value={project.tags.join(" · ")} />
            )}
            {project.year && <SpecRow label="YEAR" value={project.year} />}
            {project.status && <SpecRow label="STATUS" value={project.status} />}
            {project.links && project.links.length > 0 && (
              <SpecRow
                label="LINKS"
                value={
                  <span className="flex flex-wrap gap-3 justify-end">
                    {project.links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-cobalt dark:text-sky inline-flex items-center gap-1"
                      >
                        <span>{link.label}</span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </span>
                }
              />
            )}
          </SpecTable>
        </div>
      )}

      {/* Layout with Sticky Section Nav (only when the window gives it room) */}
      <div className="grid grid-cols-1 @xl:grid-cols-[13rem_minmax(0,1fr)] gap-12 @xl:gap-8 items-start pt-8 border-t border-ink/10 dark:border-paper/10">
        {/* Sticky Section Nav (plain anchor links) */}
        {sections.length > 0 && (
          <aside className="hidden @xl:block @xl:sticky @xl:top-6 self-start min-w-0">
            <nav
              aria-label="Table of contents"
              className="font-mono text-xs uppercase tracking-wider space-y-2"
            >
              <span className="text-muted block mb-3 font-semibold">
                RECORD SECTIONS
              </span>
              <ul className="space-y-1.5 border-l border-ink/10 dark:border-paper/10 pl-3">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-muted hover:text-ink dark:hover:text-paper hover:underline decoration-signal underline-offset-4 block py-0.5 transition-colors"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}

        {/* Engineering Record Sections */}
        <div className={sections.length > 0 ? "min-w-0" : "w-full"}>
          {/* 1. Problem */}
          {project.problem && (
            <section id="problem" className="scroll-mt-24 mb-12 sm:mb-16">
              <SectionHeader number="01" label="PROBLEM" />
              <Prose>
                <p>{project.problem}</p>
              </Prose>
            </section>
          )}

          {/* 2. My role */}
          {project.role && (
            <section id="role" className="scroll-mt-24 mb-12 sm:mb-16">
              <SectionHeader number="02" label="MY ROLE" />
              <Prose>
                <p>{project.role}</p>
              </Prose>
            </section>
          )}

          {/* 3. Constraints */}
          {project.constraints && project.constraints.length > 0 && (
            <section id="constraints" className="scroll-mt-24 mb-12 sm:mb-16">
              <SectionHeader number="03" label="CONSTRAINTS" />
              <ul className="divide-y divide-ink/10 dark:divide-paper/10 border-y border-ink/10 dark:border-paper/10">
                {project.constraints.map((c, i) => (
                  <li
                    key={i}
                    className="py-3.5 flex items-start gap-3 text-sm sm:text-base leading-relaxed text-ink dark:text-paper"
                  >
                    <span className="font-mono text-xs text-muted mt-0.5 shrink-0">
                      [{String(i + 1).padStart(2, "0")}]
                    </span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 4. Decisions (each shown as Chose / Rejected / Why) */}
          {project.decisions && project.decisions.length > 0 && (
            <section id="decisions" className="scroll-mt-24 mb-12 sm:mb-16">
              <SectionHeader number="04" label="DECISIONS" />
              <div className="space-y-6">
                {project.decisions.map((d, i) => (
                  <div
                    key={i}
                    className="p-5 sm:p-6 rounded-[14px] border border-ink/10 dark:border-paper/10 bg-ink/[0.02] dark:bg-paper/[0.02] space-y-4"
                  >
                    <h3 className="font-display font-semibold text-lg sm:text-xl text-ink dark:text-paper">
                      {d.title}
                    </h3>
                    <div className="grid grid-cols-1 @3xl:grid-cols-3 gap-4">
                      {/* Chose */}
                      <div className="p-3.5 rounded-[10px] bg-board/10 border border-board/20">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-board font-bold block mb-1.5">
                          CHOSE
                        </span>
                        <p className="text-sm text-ink dark:text-paper font-sans leading-relaxed">
                          {d.chose}
                        </p>
                      </div>

                      {/* Rejected */}
                      <div className="p-3.5 rounded-[10px] bg-ink/[0.04] dark:bg-paper/[0.05] border border-ink/10 dark:border-paper/10">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-muted font-bold block mb-1.5">
                          REJECTED
                        </span>
                        <p className="text-sm text-muted font-sans leading-relaxed">
                          {d.rejected}
                        </p>
                      </div>

                      {/* Why */}
                      <div className="p-3.5 rounded-[10px] bg-signal/15 border border-signal/30">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-ink font-bold block mb-1.5">
                          WHY
                        </span>
                        <p className="text-sm text-ink font-sans leading-relaxed">
                          {d.why}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 5. Architecture */}
          {project.architecture &&
            (project.architecture.text || project.architecture.image) && (
              <section id="architecture" className="scroll-mt-24 mb-12 sm:mb-16">
                <SectionHeader number="05" label="ARCHITECTURE" />
                {project.architecture.text && (
                  <Prose className="mb-6">
                    <p>{project.architecture.text}</p>
                  </Prose>
                )}
                {project.architecture.image && (
                  <div className="rounded-[14px] overflow-hidden border border-ink/10 dark:border-paper/10 my-4">
                    <Image
                      src={project.architecture.image}
                      alt={`${name} architecture diagram`}
                      width={1200}
                      height={675}
                      sizes="(max-width: 1024px) 100vw, 800px"
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
              </section>
            )}

          {/* 6. What broke */}
          {project.breakages && project.breakages.length > 0 && (
            <section id="breakages" className="scroll-mt-24 mb-12 sm:mb-16">
              <SectionHeader number="06" label="WHAT BROKE" />
              <div className="border-y border-ink/10 dark:border-paper/10 divide-y divide-ink/10 dark:divide-paper/10">
                {project.breakages.map((item, i) => (
                  <div key={i} className="py-3.5 flex items-start gap-3">
                    <span className="font-mono text-xs text-muted mt-0.5 shrink-0">
                      [{String(i + 1).padStart(2, "0")}]
                    </span>
                    <p className="text-sm sm:text-base leading-relaxed text-ink/90 dark:text-paper/90">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 7. Outcome */}
          {project.outcome && (
            <section id="outcome" className="scroll-mt-24 mb-12 sm:mb-16">
              <SectionHeader number="07" label="OUTCOME" />
              <div className="p-5 sm:p-6 rounded-[14px] border border-ink/15 dark:border-paper/15 bg-signal/10">
                <p className="text-base sm:text-lg leading-relaxed text-ink dark:text-paper font-medium">
                  {project.outcome}
                </p>
              </div>
            </section>
          )}

          {/* 8. Screenshots (skip any image without alt) */}
          {validScreenshots.length > 0 && (
            <section id="screenshots" className="scroll-mt-24 mb-12 sm:mb-16">
              <SectionHeader number="08" label="SCREENSHOTS" />
              <div className="space-y-8">
                {validScreenshots.map((img, i) => (
                  <figure key={i} className="space-y-2">
                    <div className="rounded-[14px] overflow-hidden border border-ink/10 dark:border-paper/10 bg-night-surface">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={img.width || 1200}
                        height={img.height || 675}
                        sizes="(max-width: 1024px) 100vw, 800px"
                        loading="lazy"
                        unoptimized={
                          img.src.startsWith("data:") ||
                          img.src.endsWith(".svg")
                        }
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    {img.caption && (
                      <figcaption className="font-mono text-xs text-muted text-center pt-1">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Previous & Next Project Navigation */}
      <footer className="mt-16 pt-8 border-t border-ink/10 dark:border-paper/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevProject ? (
          <Link
            href={`/projects/${prevProject.slug}`}
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted hover:text-ink dark:hover:text-paper transition-colors"
          >
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-150 group-hover:-translate-x-1 motion-reduce:transform-none"
            >
              ←
            </span>
            <span>
              Previous: {prevProject.name || prevProject.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {nextProject ? (
          <Link
            href={`/projects/${nextProject.slug}`}
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted hover:text-ink dark:hover:text-paper transition-colors"
          >
            <span>
              Next: {nextProject.name || nextProject.title}
            </span>
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transform-none"
            >
              →
            </span>
          </Link>
        ) : (
          <div />
        )}
      </footer>
    </article>
  );
}
