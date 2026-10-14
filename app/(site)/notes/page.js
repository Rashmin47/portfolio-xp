import Link from "next/link";
import { notes } from "@/data/notes";

const publishedNotes = notes.filter((item) => item.published);

export const metadata = {
  title: "Notes | Rashmin Sharma",
  description: "Technical notes, learnings, and writeups by Rashmin Sharma.",
  ...(publishedNotes.length === 0 ? { robots: { index: false } } : {}),
};

export default function NotesPage() {
  return (
    <section>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
        Notes
      </h1>
      {publishedNotes.length === 0 ? (
        <p className="text-muted">
          In progress. Technical notes and writings are in progress.
        </p>
      ) : (
        <ul className="space-y-4">
          {publishedNotes.map((note) => (
            <li key={note.slug}>
              <Link
                href={`/notes/${note.slug}`}
                className="text-cobalt hover:underline dark:text-sky font-medium"
              >
                {note.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
