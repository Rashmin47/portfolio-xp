import { siteConfig } from "@/data/site";
import { about } from "@/data/about";
import {
  buildMetadata,
  siteUrl,
  personId,
  personNode,
  pageBreadcrumb,
} from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import SectionHeader from "@/components/ui/SectionHeader";
import SpecTable, { SpecRow } from "@/components/ui/SpecTable";
import Prose from "@/components/ui/Prose";
import MacTextEdit from "@/components/macos/MacTextEdit";

export const metadata = buildMetadata({
  title: "About Rashmin Sharma | Software Developer, Kathmandu",
  description:
    "A software developer in Kathmandu, Nepal building reliable web applications and backend systems, plus hardware and applied AI experiments.",
  path: "/about",
});

export default function AboutPage() {
  const currentWork = (siteConfig.building || []).join(" · ");

  // ProfilePage points at the shared Person @id instead of restating the person.
  const profilePageSchema = [
    {
      "@type": "ProfilePage",
      url: `${siteUrl}/about`,
      name: `${siteConfig.name} — ${siteConfig.role}`,
      mainEntity: { "@id": personId },
    },
    personNode(),
    pageBreadcrumb("About", "/about"),
  ];

  return (
    <MacTextEdit documentTitle="About Me.rtf">
      <JsonLd data={profilePageSchema} />

      <SectionHeader number="01" label="ABOUT" />

      <div className="grid grid-cols-1 @2xl:grid-cols-3 gap-10 @2xl:gap-8 items-start">
        {/* Left Column: Sticky on Desktop */}
        <aside className="@2xl:col-span-1 @2xl:sticky @2xl:top-6 space-y-6 min-w-0">
          {about.photo?.src && (
            <div className="rounded-[14px] overflow-hidden border border-ink/10 dark:border-paper/10 max-w-[240px]">
              {/* Plain <img>: portrait is a static asset, no optimizer needed */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={about.photo.src}
                alt={about.photo.alt}
                width={about.photo.width}
                height={about.photo.height}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover"
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
        <main className="@2xl:col-span-2 space-y-12 min-w-0">
          {/* Answer-first intro: who he is, in the first two sentences */}
          {about.intro && about.intro.length > 0 && (
            <p className="text-xl sm:text-2xl font-display font-medium tracking-tight text-ink dark:text-paper leading-snug">
              {about.intro.join(" ")}
            </p>
          )}

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
              FACTS
            </div>
            <SpecTable>
              <SpecRow label="FULL NAME" value={siteConfig.name} />
              <SpecRow label="ROLE" value={siteConfig.role} />
              <SpecRow label="LOCATION" value={siteConfig.location} />
              {about.education && (
                <SpecRow label="EDUCATION" value={about.education} />
              )}
              {currentWork && (
                <SpecRow label="CURRENT WORK" value={currentWork} />
              )}
              {siteConfig.github && (
                <SpecRow
                  label="GITHUB"
                  value={
                    <a
                      href={siteConfig.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-cobalt dark:text-sky"
                    >
                      {siteConfig.github.replace(/^https?:\/\//, "")}
                    </a>
                  }
                />
              )}
              {siteConfig.linkedin && (
                <SpecRow
                  label="LINKEDIN"
                  value={
                    <a
                      href={siteConfig.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-cobalt dark:text-sky"
                    >
                      {siteConfig.linkedin
                        .replace(/^https?:\/\/(www\.)?/, "")
                        .replace(/\/$/, "")}
                    </a>
                  }
                />
              )}
              <SpecRow
                label="WEBSITE"
                value={
                  <a
                    href={siteUrl}
                    className="hover:underline text-cobalt dark:text-sky"
                  >
                    {siteUrl.replace(/^https?:\/\//, "")}
                  </a>
                }
              />
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
