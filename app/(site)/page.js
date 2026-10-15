import { siteConfig } from "@/data/site";
import { projects } from "@/data/projects";
import { visibleItems } from "@/lib/content";
import { roadmap } from "@/data/roadmap";
import { notes } from "@/data/notes";
import { buildMetadata, siteUrl } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import {
  SectionHeader,
  Button,
  TextLink,
  IndexRow,
  DummyBadge,
} from "@/components/ui";
import Link from "next/link";
import MacTerminal from "@/components/macos/MacTerminal";

export const metadata = buildMetadata({
  title: { absolute: "Rashmin Sharma | Software Developer, Nepal" },
  description: siteConfig.hero.support,
  path: "/",
});

function formatRelativeDate(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDays = Math.floor(diffHour / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears}y ago`;
}

async function getLatestCommit() {
  try {
    const res = await fetch(
      "https://api.github.com/repos/Rashmin47/portfolio-xp/commits?per_page=1",
      {
        next: { revalidate: 3600 },
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "portfolio-xp",
        },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    const commit = data[0];
    const sha = commit.sha ? commit.sha.slice(0, 7) : "";
    const rawMessage = commit.commit?.message || "";
    const message = rawMessage.split("\n")[0].slice(0, 60);
    const dateStr =
      commit.commit?.author?.date || commit.commit?.committer?.date;
    const relativeDate = formatRelativeDate(dateStr);
    return {
      sha,
      message,
      relativeDate,
      url: commit.html_url || null,
    };
  } catch (_) {
    return null;
  }
}

export default async function HomePage() {
  const latestCommit = await getLatestCommit();

  const publishedProjects = visibleItems(projects).slice(0, 3);
  const buildingItems = siteConfig.building || [];
  const publishedRoadmap = visibleItems(roadmap || []);
  const nowRoadmap = publishedRoadmap.filter((r) => r.status === "now");
  const nextRoadmap = publishedRoadmap.filter((r) => r.status === "next");
  const laterRoadmap = publishedRoadmap.filter((r) => r.status === "later");
  const publishedNotes = visibleItems(notes || []).slice(0, 2);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    url: siteUrl,
    sameAs: [siteConfig.github, siteConfig.linkedin].filter(Boolean),
  };

  return (
    <div className="w-full flex flex-col">
      <JsonLd data={personSchema} />

      {/* ── Interactive macOS Terminal (hero) ──────────────────────────── */}
      <MacTerminal
        projects={publishedProjects}
        siteConfig={siteConfig}
        latestCommit={latestCommit}
      />

      {/* ── Indexed content sections below the terminal ─────────────────── */}
      <div className="px-4 sm:px-6 pb-8 sm:pb-10 space-y-12">

        {/* 01 Projects */}
        {publishedProjects.length > 0 && (
          <section>
            <SectionHeader number="01" label="PROJECTS" />
            <div className="border-t border-paper/10">
              {publishedProjects.map((project, idx) => (
                <IndexRow
                  key={project.slug}
                  index={String(idx + 1).padStart(2, "0")}
                  title={
                    <span className="inline-flex items-center gap-2 flex-wrap">
                      <span>{project.title}</span>
                      {project.dummy && <DummyBadge />}
                    </span>
                  }
                  meta={project.year || (project.tags && project.tags[0])}
                  href={`/projects/${project.slug}`}
                />
              ))}
            </div>
            <div className="mt-4">
              <TextLink href="/projects">View all projects →</TextLink>
            </div>
          </section>
        )}

        {/* 02 Building now */}
        {buildingItems.length > 0 && (
          <section>
            <SectionHeader number="02" label="BUILDING NOW" />
            <ul className="divide-y divide-paper/10 border-y border-paper/10">
              {buildingItems.map((item, idx) => (
                <li key={idx} className="py-3 flex items-start gap-3">
                  <span
                    className="inline-block w-2 h-2 rounded-full bg-board mt-2 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-paper font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 03 Next */}
        {publishedRoadmap.length > 0 && (
          <section>
            <SectionHeader number="03" label="NEXT" />
            <div className="grid grid-cols-1 @lg:grid-cols-3 gap-4">
              {[
                { label: "NOW", items: nowRoadmap, empty: "No active items" },
                { label: "NEXT", items: nextRoadmap, empty: "Queued next" },
                { label: "LATER", items: laterRoadmap, empty: "Future exploratory" },
              ].map(({ label, items, empty }) => (
                <div key={label} className="space-y-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-muted block border-b border-paper/10 pb-2">
                    {label}
                  </span>
                  {items.length > 0 ? (
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-[14px] border border-paper/10 bg-paper/[0.03]"
                        >
                          <h4 className="font-display font-medium text-sm text-paper mb-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-muted leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-mono text-xs text-muted">{empty}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <TextLink href="/roadmap">Full roadmap →</TextLink>
            </div>
          </section>
        )}

        {/* 04 Notes */}
        {publishedNotes.length > 0 && (
          <section>
            <SectionHeader number="04" label="NOTES" />
            <div className="border-t border-paper/10">
              {publishedNotes.map((note, idx) => (
                <IndexRow
                  key={note.slug}
                  index={String(idx + 1).padStart(2, "0")}
                  title={note.title}
                  meta={note.datePublished?.slice(0, 10)}
                  href={`/notes/${note.slug}`}
                />
              ))}
            </div>
            <div className="mt-4">
              <TextLink href="/notes">All notes →</TextLink>
            </div>
          </section>
        )}

        {/* 05 Closing */}
        <section className="pt-4 border-t border-paper/10">
          <SectionHeader number="05" label="CLOSING" />
          <div className="max-w-lg">
            <p className="text-xl sm:text-2xl font-display font-bold text-paper leading-tight mb-6">
              Let&apos;s build something that matters.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" href="/contact" arrow>
                Contact
              </Button>
              {siteConfig.github && (
                <Button variant="secondary" href={siteConfig.github} arrow>
                  GitHub
                </Button>
              )}
              {siteConfig.linkedin && (
                <Button variant="secondary" href={siteConfig.linkedin} arrow>
                  LinkedIn
                </Button>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
