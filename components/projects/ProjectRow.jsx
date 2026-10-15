import Link from "next/link";
import Tag from "@/components/ui/Tag";
import DummyBadge from "@/components/ui/DummyBadge";

export default function ProjectRow({ project, index }) {
  const number = String(index + 1).padStart(2, "0");
  const name = project.name || project.title;
  const summary = project.summary || project.description;
  const previewImage = project.images?.[0];

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative block py-6 border-b border-ink/10 dark:border-paper/10 transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus-ring rounded-xs"
    >
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 md:gap-8">
        {/* Left: Number, Name, Summary, Tags */}
        <div className="flex items-start gap-4 sm:gap-6 min-w-0">
          <span className="font-mono text-xl sm:text-2xl text-muted font-normal shrink-0 mt-0.5">
            {number}
          </span>

          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-display font-medium text-xl sm:text-2xl text-ink dark:text-paper group-hover:underline decoration-signal underline-offset-4 decoration-2 transition-all">
                {name}
              </h2>
              {project.dummy && <DummyBadge />}
            </div>

            {summary && (
              <p className="text-muted text-sm sm:text-base leading-relaxed max-w-2xl">
                {summary}
              </p>
            )}

            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Year, Arrow, and CSS-Only Screenshot Preview */}
        <div className="flex items-baseline justify-between md:justify-end gap-4 shrink-0 pl-10 md:pl-0">
          {project.year && (
            <span className="font-mono text-xs sm:text-sm text-muted uppercase tracking-wider">
              {project.year}
            </span>
          )}
          <span
            aria-hidden="true"
            className="font-mono text-lg text-ink dark:text-paper inline-block transition-transform duration-150 group-hover:translate-x-1.5 motion-reduce:transform-none"
          >
            →
          </span>
        </div>
      </div>

      {/* CSS-Only Screenshot Preview on Hover */}
      {previewImage && (
        <div
          aria-hidden="true"
          className="pointer-events-none opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 absolute right-16 top-1/2 -translate-y-1/2 z-30 hidden lg:block w-56 aspect-video rounded-[10px] overflow-hidden border border-ink/20 dark:border-paper/20 shadow-2xl bg-night-surface"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewImage.src}
            alt={previewImage.alt || ""}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </Link>
  );
}
