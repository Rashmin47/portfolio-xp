import { notes } from "@/data/notes";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const note = notes.find((n) => n.slug === slug && n.published);

  if (!note) {
    return {
      title: "Note In Progress | Rashmin Sharma",
      description: "Note details are in progress.",
      robots: { index: false },
    };
  }

  return {
    title: `${note.title} | Rashmin Sharma`,
    description: note.summary || "Technical note",
  };
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

  return (
    <article>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
        {note.title}
      </h1>
      <div className="prose dark:prose-invert">
        <p>{note.content}</p>
      </div>
    </article>
  );
}
