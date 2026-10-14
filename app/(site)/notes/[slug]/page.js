import { notes } from "@/data/notes";
import { siteConfig } from "@/data/site";
import { buildMetadata, siteUrl } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

export async function generateStaticParams() {
  return notes.filter((n) => n.published).map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const note = notes.find((n) => n.slug === slug && n.published);

  if (!note) {
    return buildMetadata({
      title: "Note Not Found",
      description: "Note details are in progress.",
      path: `/notes/${slug}`,
      noindex: true,
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
  const note = notes.find((n) => n.slug === slug && n.published);

  if (!note) {
    return (
      <section>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
          Note In Progress
        </h1>
        <p className="text-muted">
          In progress. This note has not been published yet.
        </p>
      </section>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: note.title,
    ...(note.summary ? { description: note.summary } : {}),
    ...(note.datePublished ? { datePublished: note.datePublished } : {}),
    ...(note.dateModified ? { dateModified: note.dateModified } : {}),
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: `${siteUrl}/about`,
    },
  };

  return (
    <article>
      <JsonLd data={articleSchema} />
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
        {note.title}
      </h1>
      <div className="prose dark:prose-invert">
        <p>{note.content}</p>
      </div>
    </article>
  );
}
