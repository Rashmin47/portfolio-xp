import { lab } from "@/data/lab";
import { buildMetadata } from "@/lib/seo";
import { visibleItems } from "@/lib/content";
import SectionHeader from "@/components/ui/SectionHeader";
import Tag from "@/components/ui/Tag";
import SpecTable, { SpecRow } from "@/components/ui/SpecTable";
import DummyBadge from "@/components/ui/DummyBadge";

export async function generateMetadata() {
  const publishedLab = visibleItems(lab);
  return buildMetadata({
    title: "The Lab",
    description: "Hardware, edge computing, and applied AI experiments by Rashmin Sharma.",
    path: "/lab",
    noindex: publishedLab.length === 0,
  });
}

export default function LabPage() {
  const publishedLab = visibleItems(lab);

  return (
    <div className="w-full">
      <SectionHeader number="01" label="THE LAB" />

      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-ink dark:text-paper mb-3">
          Hardware &amp; Experiments
        </h1>
        <p className="text-muted text-base sm:text-lg max-w-2xl leading-relaxed">
          Workbench explorations, edge sensors, robotics, and prototype systems.
          Click any experiment to open its lab bench record.
        </p>
      </div>

      {publishedLab.length === 0 ? (
        <div className="py-12 border-t border-ink/10 dark:border-paper/10">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">
            In progress · Lab notes and hardware logs are currently being prepared.
          </p>
        </div>
      ) : (
        <div className="border-t border-ink/10 dark:border-paper/10 divide-y divide-ink/10 dark:divide-paper/10">
          {publishedLab.map((item, index) => {
            const number = String(index + 1).padStart(2, "0");
            return (
              <details
                key={item.id}
                className="group py-6 transition-colors"
              >
                <summary className="list-none cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-signal rounded-xs select-none">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 sm:gap-6 min-w-0">
                      <span className="font-mono text-xl sm:text-2xl text-muted font-normal shrink-0 mt-0.5">
                        {number}
                      </span>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h2 className="font-display font-medium text-xl sm:text-2xl text-ink dark:text-paper group-hover:underline decoration-signal underline-offset-4">
                            {item.title}
                          </h2>
                          {item.dummy && <DummyBadge />}
                        </div>
                        {item.description && (
                          <p className="text-muted text-sm sm:text-base leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 pl-4">
                      {item.year && (
                        <span className="font-mono text-xs text-muted hidden sm:inline-block">
                          {item.year}
                        </span>
                      )}
                      <span
                        aria-hidden="true"
                        className="font-mono text-base text-ink dark:text-paper inline-block transition-transform duration-150 group-open:rotate-90"
                      >
                        ▶
                      </span>
                    </div>
                  </div>
                </summary>

                {/* Inline Details Panel */}
                <div className="mt-6 pt-6 pl-10 sm:pl-12 border-t border-ink/10 dark:border-paper/10 space-y-6">
                  {item.details && (
                    <div>
                      <span className="font-mono text-xs uppercase tracking-wider text-muted block mb-2 font-semibold">
                        WHAT IT DOES / BENCH NOTES
                      </span>
                      <p className="text-sm sm:text-base text-ink/90 dark:text-paper/90 leading-relaxed max-w-2xl">
                        {item.details}
                      </p>
                    </div>
                  )}

                  {item.hardware && item.hardware.length > 0 && (
                    <div>
                      <span className="font-mono text-xs uppercase tracking-wider text-muted block mb-2 font-semibold">
                        HARDWARE LIST
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {item.hardware.map((hw) => (
                          <Tag key={hw}>{hw}</Tag>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="max-w-xl">
                    <SpecTable>
                      {item.status && (
                        <SpecRow label="STATUS" value={item.status} />
                      )}
                      {item.repo && (
                        <SpecRow
                          label="REPOSITORY"
                          value={
                            <a
                              href={item.repo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cobalt dark:text-sky hover:underline inline-flex items-center gap-1 font-mono text-xs"
                            >
                              <span>View code</span>
                              <span aria-hidden="true">↗</span>
                            </a>
                          }
                        />
                      )}
                      {item.media && (
                        <SpecRow label="MEDIA / CAPTURE" value={item.media} />
                      )}
                    </SpecTable>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}
