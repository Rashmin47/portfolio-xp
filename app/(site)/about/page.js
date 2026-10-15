import Image from "next/image";
import { siteConfig } from "@/data/site";
import { about } from "@/data/about";
import { buildMetadata, siteUrl } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import SectionHeader from "@/components/ui/SectionHeader";
import SpecTable, { SpecRow } from "@/components/ui/SpecTable";
import Prose from "@/components/ui/Prose";
import MacTextEdit from "@/components/macos/MacTextEdit";

export const metadata = buildMetadata({
  title: "About",
  description: `About ${siteConfig.name}, ${siteConfig.role.toLowerCase()} based in ${siteConfig.location}.`,
  path: "/about",
});

export default function AboutPage() {
  const sameAsLinks = [siteConfig.github, siteConfig.linkedin].filter(Boolean);

  const person = {
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    url: `${siteUrl}/about`,
    ...(sameAsLinks.length > 0 ? { sameAs: sameAsLinks } : {}),
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: person,
  };

  return (
    <MacTextEdit documentTitle="About Me.rtf">
      <JsonLd data={profilePageSchema} />

      <SectionHeader number="01" label="ABOUT" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
        {/* Left Column: Sticky on Desktop */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          {about.photo?.src && (
            <div className="rounded-[14px] overflow-hidden border border-ink/10 dark:border-paper/10 aspect-square max-w-[240px]">
              <Image
                src={about.photo.src}
                alt={about.photo.alt || siteConfig.name}
                width={about.photo.width || 400}
                height={about.photo.height || 400}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          )}

          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-ink dark:text-paper">
              {siteConfig.name}
            </h1>
            <p className="font-mono text-xs uppercase tracking-wider text-muted mt-1">
              {siteConfig.role}
            </p>
            <p className="text-sm text-muted mt-0.5">{siteConfig.location}</p>
          </div>

          <div className="pt-2 flex flex-col space-y-1.5 font-mono text-xs uppercase tracking-wider">
            {siteConfig.github && (
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-ink dark:hover:text-paper hover:underline decoration-signal underline-offset-4 inline-flex items-center gap-1 group"
              >
                <span>GitHub</span>
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                >
                  ↗
                </span>
              </a>
            )}
            {siteConfig.linkedin && (
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-ink dark:hover:text-paper hover:underline decoration-signal underline-offset-4 inline-flex items-center gap-1 group"
              >
                <span>LinkedIn</span>
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                >
                  ↗
                </span>
              </a>
            )}
          </div>
        </aside>

        {/* Right Column: Content */}
        <main className="lg:col-span-8 space-y-12">
          {/* Bio Paragraphs */}
          {about.bio && about.bio.length > 0 && (
            <div className="space-y-4">
              {about.bio.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-lg sm:text-xl text-ink/90 dark:text-paper/90 leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* SpecTable of Facts */}
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-muted mb-2">
              FACTSHEET
            </div>
            <SpecTable>
              <SpecRow label="NAME" value={siteConfig.name} />
              <SpecRow label="ROLE" value={siteConfig.role} />
              <SpecRow label="LOCATION" value={siteConfig.location} />
              {about.education && (
                <SpecRow label="EDUCATION" value={about.education} />
              )}
            </SpecTable>
          </div>

          {/* How I Think */}
          {about.howIThink && about.howIThink.length > 0 && (
            <section id="how-i-think" className="scroll-mt-24 space-y-6">
              <SectionHeader number="02" label="HOW I THINK" />
              <div className="space-y-6">
                {about.howIThink.map((item, index) => (
                  <div
                    key={index}
                    className="border-t border-ink/10 dark:border-paper/10 pt-4"
                  >
                    <h2 className="font-display font-semibold text-lg sm:text-xl text-ink dark:text-paper mb-1">
                      {item.title}
                    </h2>
                    <p className="text-sm sm:text-base text-muted leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Now Learning */}
          {about.nowLearning && about.nowLearning.length > 0 && (
            <section className="space-y-4">
              <SectionHeader number="03" label="NOW LEARNING" />
              <ul className="divide-y divide-ink/10 dark:divide-paper/10 border-y border-ink/10 dark:border-paper/10">
                {about.nowLearning.map((item, index) => (
                  <li
                    key={index}
                    className="py-3 flex items-start gap-3 text-sm sm:text-base text-ink dark:text-paper"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-signal mt-2 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* What I'm Looking For */}
          {about.lookingFor && (
            <section className="space-y-4">
              <SectionHeader number="04" label="WHAT I'M LOOKING FOR" />
              <Prose>
                <p>{about.lookingFor}</p>
              </Prose>
            </section>
          )}

          {/* Community Line (small single line last) */}
          {about.community && (
            <footer className="pt-6 border-t border-ink/10 dark:border-paper/10">
              <p className="font-mono text-xs text-muted leading-relaxed">
                COMMUNITY: {about.community}
              </p>
            </footer>
          )}
        </main>
      </div>
    </MacTextEdit>
  );
}
