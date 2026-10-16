import { roadmap } from "@/data/roadmap";
import { buildMetadata, pageBreadcrumb } from "@/lib/seo";
import { visibleItems } from "@/lib/content";
import SectionHeader from "@/components/ui/SectionHeader";
import DummyBadge from "@/components/ui/DummyBadge";
import MacFinder from "@/components/macos/MacFinder";
import JsonLd from "@/components/seo/JsonLd";

export async function generateMetadata() {
  const publishedRoadmap = visibleItems(roadmap);
  return buildMetadata({
    title: "Roadmap",
    description: "Public engineering roadmap: now, next, and later initiatives by Rashmin Sharma.",
    path: "/roadmap",
    noindex: publishedRoadmap.length === 0,
  });
}

export default function RoadmapPage() {
  const publishedRoadmap = visibleItems(roadmap);
  const nowItems = publishedRoadmap.filter((item) => item.status === "now");
  const nextItems = publishedRoadmap.filter((item) => item.status === "next");
  const laterItems = publishedRoadmap.filter((item) => item.status === "later");

  const renderColumn = (title, count, items, borderAccent = "") => (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between border-b border-ink/10 dark:border-paper/10 pb-2.5">
        <span className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-paper">
          {title}
        </span>
        <span className="font-mono text-xs text-muted">
          [{count}]
        </span>
      </div>

      {items.length === 0 ? (
        <p className="font-mono text-xs text-muted py-4">No active milestones</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={item.id}
              className={`p-4 rounded-[14px] border border-ink/10 dark:border-paper/10 bg-ink/[0.02] dark:bg-paper/[0.02] space-y-2 ${borderAccent}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5">
                <h2 className="min-w-0 font-display font-medium text-base text-ink dark:text-paper leading-snug">
                  {item.title}
                </h2>
                {item.dummy && <DummyBadge className="shrink-0" />}
              </div>

              {item.description && (
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  {item.description}
                </p>
              )}

              {item.why && (
                <details className="group pt-2 border-t border-ink/5 dark:border-paper/5">
                  <summary className="font-mono text-xs uppercase tracking-wider text-muted hover:text-ink dark:hover:text-paper cursor-pointer list-none flex items-center gap-1.5 select-none transition-colors">
                    <span>WHY</span>
                    <span
                      aria-hidden="true"
                      className="inline-block transition-transform duration-150 group-open:rotate-90 text-[10px]"
                    >
                      ▶
                    </span>
                  </summary>
                  <p className="text-xs text-ink/80 dark:text-paper/80 leading-relaxed mt-2 pl-2.5 border-l-2 border-signal">
                    {item.why}
                  </p>
                </details>
              )}

              {item.quarter && (
                <span className="font-mono text-[10px] text-muted block pt-1">
                  Target: {item.quarter}
                </span>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <MacFinder sectionTitle="Roadmap" currentFolder="roadmap" itemCount={publishedRoadmap.length}>
      <JsonLd data={pageBreadcrumb("Roadmap", "/roadmap")} />
      <SectionHeader number="01" label="ROADMAP" />

      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-ink dark:text-paper mb-3">
          Now / Next / Later
        </h1>
        <p className="text-muted text-base sm:text-lg max-w-2xl leading-relaxed">
          Open roadmap of engineering milestones, hardware builds, and research priorities.
          Expand each item to inspect the architectural reasoning.
        </p>
      </div>

      {publishedRoadmap.length === 0 ? (
        <div className="py-12 border-t border-ink/10 dark:border-paper/10">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">
            In progress · The public roadmap is currently being outlined.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 @xl:grid-cols-3 gap-8 pt-4">
          {renderColumn("NOW", nowItems.length, nowItems, "border-l-4 border-l-signal")}
          {renderColumn("NEXT", nextItems.length, nextItems)}
          {renderColumn("LATER", laterItems.length, laterItems)}
        </div>
      )}
    </MacFinder>
  );
}
