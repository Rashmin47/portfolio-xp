import Link from "next/link";
import { notes } from "@/data/notes";
import { buildMetadata } from "@/lib/seo";
import { visibleItems } from "@/lib/content";
import SectionHeader from "@/components/ui/SectionHeader";
import Tag from "@/components/ui/Tag";
import DummyBadge from "@/components/ui/DummyBadge";
import MacTextEdit from "@/components/macos/MacTextEdit";

export async function generateMetadata() {
  const publishedNotes = visibleItems(notes);
  return buildMetadata({
    title: "Notes",
    description: "Technical writings, engineering logs, and research notes by Rashmin Sharma.",
    path: "/notes",
    noindex: publishedNotes.length === 0,
  });
}

export default function NotesPage() {
  const publishedNotes = visibleItems(notes);

  return (
    <MacTextEdit documentTitle="Notes.md">
      <SectionHeader number="01" label="NOTES" />

      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-ink dark:text-paper mb-3">
          Engineering Notes
        </h1>
        <p className="text-muted text-base sm:text-lg max-w-2xl leading-relaxed">
          Technical essays, post-mortems, and learnings from software and hardware builds.
        </p>
      </div>

      {publishedNotes.length === 0 ? (
        <div className="py-12 border-t border-ink/10 dark:border-paper/10">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">
            In progress · Technical notes and essays are currently being drafted.
          </p>
        </div>
      ) : (
        <div className="border-t border-ink/10 dark:border-paper/10 divide-y divide-ink/10 dark:divide-paper/10">
          {publishedNotes.map((note) => (
            <article key={note.slug} className="py-6 group">
              <Link
                href={`/notes/${note.slug}`}
                className="block space-y-2 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-signal rounded-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="font-display font-medium text-xl sm:text-2xl text-ink dark:text-paper group-hover:underline decoration-signal underline-offset-4">
                      {note.title}
                    </h2>
                    {note.dummy && <DummyBadge />}
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs text-muted shrink-0">
                    {note.datePublished && (
                      <time dateTime={note.datePublished}>
                        {note.datePublished}
                      </time>
                    )}
                    {note.readingTime && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{note.readingTime}</span>
                      </>
                    )}
                  </div>
                </div>

                {note.summary && (
                  <p className="text-muted text-sm sm:text-base leading-relaxed max-w-2xl">
                    {note.summary}
                  </p>
                )}

                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {note.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                )}
              </Link>
            </article>
          ))}
        </div>
      )}
    </MacTextEdit>
  );
}
