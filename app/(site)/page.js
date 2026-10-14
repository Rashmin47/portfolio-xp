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
import CurrentlyTable from "@/components/home/CurrentlyTable";

export const metadata = buildMetadata({
  title: siteConfig.name,
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

  // 01 Shipped (up to 3 via visibleItems)
  const publishedProjects = visibleItems(projects).slice(0, 3);

  // 02 Building now
  const buildingItems = siteConfig.building || [];

  // 03 Next (roadmap items categorized as now / next / later)
  const publishedRoadmap = (roadmap || []).filter((r) => r.published);
  const nowRoadmap = publishedRoadmap.filter((r) => r.status === "now");
  const nextRoadmap = publishedRoadmap.filter((r) => r.status === "next");
  const laterRoadmap = publishedRoadmap.filter((r) => r.status === "later");

  // 04 Notes (latest 2)
  const publishedNotes = (notes || []).filter((n) => n.published).slice(0, 2);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    url: siteUrl,
    sameAs: [siteConfig.github, siteConfig.linkedin].filter(Boolean),
  };

  return (
    <div className="w-full">
      <JsonLd data={personSchema} />

      {/* Hero: 12 columns, left-aligned */}
      <section className="py-12 sm:py-20 lg:py-28 border-b border-ink/10 dark:border-paper/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Main Hero Column (approx 8-9 cols) */}
          <div className="lg:col-span-8">
            <h1 className="font-mono text-xs uppercase tracking-wider text-muted mb-4 block">
              {siteConfig.hero.h1}
            </h1>
            <p className="display text-ink dark:text-paper mb-6">
              {siteConfig.hero.tagline}
            </p>
            <p className="text-base sm:text-lg text-muted max-w-2xl leading-relaxed mb-8">
              {siteConfig.hero.support}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {siteConfig.hero.ctas?.map((cta, index) => (
                <Button
                  key={cta.href}
                  variant={index === 0 ? "primary" : "secondary"}
                  href={cta.href}
                  arrow
                >
                  {cta.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Beside/Below: "Currently" SpecTable (approx 4 cols) */}
          <div className="lg:col-span-4 lg:pt-8">
            <CurrentlyTable
              latestCommit={latestCommit}
              buildingNow={buildingItems[0]}
              location={siteConfig.location}
            />
          </div>
        </div>
      </section>

      {/* 01 Shipped */}
      {publishedProjects.length > 0 && (
        <section className="mt-16 sm:mt-24">
          <SectionHeader number="01" label="SHIPPED" />
          <div className="border-t border-ink/10 dark:border-paper/10">
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
          <div className="mt-6">
            <TextLink href="/projects">
              View all shipped projects →
            </TextLink>
          </div>
        </section>
      )}

      {/* 02 Building now */}
      {buildingItems.length > 0 && (
        <section className="mt-16 sm:mt-24">
          <SectionHeader number="02" label="BUILDING NOW" />
          <ul className="divide-y divide-ink/10 dark:divide-paper/10 border-y border-ink/10 dark:border-paper/10">
            {buildingItems.map((item, idx) => (
              <li key={idx} className="py-3.5 flex items-start gap-3">
                <span
                  className="inline-block w-2 h-2 rounded-full bg-board mt-2 shrink-0"
                  aria-hidden="true"
                />
                <span className="text-sm sm:text-base text-ink dark:text-paper font-medium">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 03 Next (roadmap as compact Now / Next / Later columns) */}
      {publishedRoadmap.length > 0 && (
        <section className="mt-16 sm:mt-24">
          <SectionHeader number="03" label="NEXT" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column: Now */}
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-wider text-muted block border-b border-ink/10 dark:border-paper/10 pb-2">
                NOW
              </span>
              {nowRoadmap.length > 0 ? (
                <div className="space-y-3">
                  {nowRoadmap.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-[14px] border border-ink/10 dark:border-paper/10 bg-ink/[0.02] dark:bg-paper/[0.02]"
                    >
                      <h4 className="font-display font-medium text-sm text-ink dark:text-paper mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-mono text-xs text-muted">No active items</p>
              )}
            </div>

            {/* Column: Next */}
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-wider text-muted block border-b border-ink/10 dark:border-paper/10 pb-2">
                NEXT
              </span>
              {nextRoadmap.length > 0 ? (
                <div className="space-y-3">
                  {nextRoadmap.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-[14px] border border-ink/10 dark:border-paper/10 bg-ink/[0.02] dark:bg-paper/[0.02]"
                    >
                      <h4 className="font-display font-medium text-sm text-ink dark:text-paper mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-mono text-xs text-muted">Queued next</p>
              )}
            </div>

            {/* Column: Later */}
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-wider text-muted block border-b border-ink/10 dark:border-paper/10 pb-2">
                LATER
              </span>
              {laterRoadmap.length > 0 ? (
                <div className="space-y-3">
                  {laterRoadmap.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-[14px] border border-ink/10 dark:border-paper/10 bg-ink/[0.02] dark:bg-paper/[0.02]"
                    >
                      <h4 className="font-display font-medium text-sm text-ink dark:text-paper mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-mono text-xs text-muted">Future exploratory</p>
              )}
            </div>
          </div>
          <div className="mt-6">
            <TextLink href="/roadmap">
              Full roadmap →
            </TextLink>
          </div>
        </section>
      )}

      {/* 04 Notes */}
      {publishedNotes.length > 0 && (
        <section className="mt-16 sm:mt-24">
          <SectionHeader number="04" label="NOTES" />
          <div className="border-t border-ink/10 dark:border-paper/10">
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
          <div className="mt-6">
            <TextLink href="/notes">
              All notes →
            </TextLink>
          </div>
        </section>
      )}

      {/* 05 Closing block */}
      <section className="mt-16 sm:mt-24 pt-8">
        <SectionHeader number="05" label="CLOSING" />
        <div className="max-w-2xl">
          <p className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold tracking-tight text-ink dark:text-paper leading-tight mb-8">
            Let&apos;s build something that matters.
          </p>
          <div className="flex flex-wrap items-center gap-4">
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
  );
}
