import Link from "next/link";
import { notFound } from "next/navigation";
import { notes } from "@/data/notes";
import {
  buildMetadata,
  personId,
  breadcrumbNode,
  contentUpdated,
} from "@/lib/seo";
import { visibleItems } from "@/lib/content";
import JsonLd from "@/components/seo/JsonLd";
import Prose from "@/components/ui/Prose";
import Tag from "@/components/ui/Tag";
import DummyBadge from "@/components/ui/DummyBadge";
import BlockRenderer from "@/components/pages/BlockRenderer";

export async function generateStaticParams() {
  return visibleItems(notes).map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const visible = visibleItems(notes);
  const note = visible.find((n) => n.slug === slug);

  if (!note) {
    return buildMetadata({
      title: "Note Not Found",
      description: "Note details are in progress.",
      path: `/notes/${slug}`,
      noindex: true,
    });
  }

  if (note.dummy) {
    return buildMetadata({
      title: `${note.title} (Dummy)`,
      description: note.summary || "Technical note",
      path: `/notes/${slug}`,
      noindex: true,
      canonical: false,
    });
  }

  return buildMetadata({
    title: note.title,
    description: note.summary || "Technical note",
    path: `/notes/${slug}`,
    noindex: false,
  });
}

export default async function NoteDetailPage({ params }) {
  const { slug } = await params;
  const visible = visibleItems(notes);
  const note = visible.find((n) => n.slug === slug);

  if (!note) {
    notFound();
  }

  const updated = contentUpdated(note);

  const schema = [
    {
      "@type": "Article",
      headline: note.title,
      ...(note.summary ? { description: note.summary } : {}),
      author: { "@id": personId },
      ...(note.datePublished ? { datePublished: note.datePublished } : {}),
      ...(updated ? { dateModified: updated } : {}),
    },
    breadcrumbNode([
      { name: "Home", path: "/" },
      { name: "Notes", path: "/notes" },
      { name: note.title, path: `/notes/${slug}` },
    ]),
  ];

  return (
    <article className="w-full max-w-3xl mx-auto p-4 sm:p-6">
      <JsonLd data={schema} />

      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/notes"
          className="font-mono text-xs uppercase tracking-wider text-muted hover:text-ink dark:hover:text-paper inline-flex items-center gap-1.5 transition-colors"
        >
          <span aria-hidden="true">←</span>
          <span>Back to notes</span>
        </Link>
      </div>

      {/* Header */}
      <header className="mb-10 pb-8 border-b border-ink/10 dark:border-paper/10 space-y-4">
        <div className="flex items-center gap-3 font-mono text-xs text-muted">
          {note.datePublished && (
            <time dateTime={note.datePublished}>{note.datePublished}</time>
          )}
          {note.readingTime && (
            <>
              <span aria-hidden="true">·</span>
              <span>{note.readingTime}</span>
            </>
          )}
        </div>

        {updated && (
          <p className="font-mono text-xs uppercase tracking-wider text-muted">
            Last updated{" "}
            <time dateTime={updated}>{updated.slice(0, 10)}</time>
          </p>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-ink dark:text-paper leading-tight">
            {note.title}
          </h1>
          {note.dummy && <DummyBadge />}
        </div>

        {note.summary && (
          <p className="text-lg sm:text-xl text-muted leading-relaxed">
            {note.summary}
          </p>
        )}

        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {note.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </header>

      {/* Content rendered via BlockRenderer inside Prose */}
      <Prose>
        {Array.isArray(note.content) ? (
          <BlockRenderer blocks={note.content} />
        ) : typeof note.content === "string" ? (
          <p>{note.content}</p>
        ) : null}
      </Prose>

      <footer className="mt-16 pt-8 border-t border-ink/10 dark:border-paper/10">
        <Link
          href="/notes"
          className="font-mono text-xs uppercase tracking-wider text-muted hover:text-ink dark:hover:text-paper inline-flex items-center gap-1.5 transition-colors"
        >
          <span aria-hidden="true">←</span>
          <span>All notes</span>
        </Link>
      </footer>
    </article>
  );
}
