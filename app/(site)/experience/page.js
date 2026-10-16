import { ventures } from "@/data/ventures";
import { buildMetadata, pageBreadcrumb } from "@/lib/seo";
import { visibleItems } from "@/lib/content";
import SectionHeader from "@/components/ui/SectionHeader";
import SpecTable, { SpecRow } from "@/components/ui/SpecTable";
import DummyBadge from "@/components/ui/DummyBadge";
import MacFinder from "@/components/macos/MacFinder";
import JsonLd from "@/components/seo/JsonLd";

export async function generateMetadata() {
  const publishedVentures = visibleItems(ventures);
  return buildMetadata({
    title: "Experience",
    description: "Ventures, product explorations, and companies in progress by Rashmin Sharma.",
    path: "/experience",
    noindex: publishedVentures.length === 0,
  });
}

export default function VenturesPage() {
  const publishedVentures = visibleItems(ventures);

  return (
    <MacFinder sectionTitle="Experience" currentFolder="experience" itemCount={publishedVentures.length}>
      <JsonLd data={pageBreadcrumb("Experience", "/experience")} />
      <SectionHeader number="01" label="EXPERIENCE" />

      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-ink dark:text-paper mb-3">
          Experience &amp; Initiatives
        </h1>
        <p className="text-muted text-base sm:text-lg max-w-2xl leading-relaxed">
          Companies, independent products, and business experiments in progress.
        </p>
      </div>

      {publishedVentures.length === 0 ? (
        <div className="py-12 border-t border-ink/10 dark:border-paper/10">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">
            In progress · Venture information and case studies are currently being documented.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {publishedVentures.map((venture) => {
            const name = venture.name || venture.title;
            return (
              <article
                key={venture.id}
                className="border-t border-ink/10 dark:border-paper/10 pt-6"
              >
                <div className="flex items-center gap-3 flex-wrap mb-3">
                  <h2 className="text-2xl font-display font-bold text-ink dark:text-paper">
                    {name}
                  </h2>
                  {venture.dummy && <DummyBadge />}
                </div>

                {venture.problem && (
                  <p className="text-base sm:text-lg text-ink/90 dark:text-paper/90 leading-relaxed mb-6 max-w-3xl">
                    {venture.problem}
                  </p>
                )}

                <div className="max-w-xl">
                  <SpecTable>
                    {venture.role && (
                      <SpecRow label="MY ROLE" value={venture.role} />
                    )}
                    {venture.stage && (
                      <SpecRow label="STAGE" value={venture.stage} />
                    )}
                    {venture.status && (
                      <SpecRow label="STATUS" value={venture.status} />
                    )}
                    {venture.url && (
                      <SpecRow
                        label="LINK"
                        value={
                          <a
                            href={venture.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cobalt dark:text-sky hover:underline inline-flex items-center gap-1"
                          >
                            <span>Visit website</span>
                            <span aria-hidden="true">↗</span>
                          </a>
                        }
                      />
                    )}
                  </SpecTable>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </MacFinder>
  );
}
