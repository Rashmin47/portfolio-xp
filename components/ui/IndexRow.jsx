import Link from "next/link";

export default function IndexRow({
  index,
  title,
  meta,
  href,
  className = "",
  children,
  ...props
}) {
  const content = (
    <div
      className={`group flex items-baseline justify-between gap-4 py-4 border-b border-ink/10 dark:border-paper/10 transition-colors ${className}`}
      {...props}
    >
      <div className="flex items-baseline gap-4 sm:gap-6 min-w-0">
        {index && (
          <span className="font-mono text-lg sm:text-2xl text-muted font-normal shrink-0">
            {index}
          </span>
        )}
        <div className="min-w-0">
          <span className="font-display font-medium text-lg sm:text-xl text-ink dark:text-paper group-hover:underline decoration-signal underline-offset-4 decoration-2 truncate block">
            {title}
          </span>
          {children}
        </div>
      </div>

      <div className="flex items-baseline gap-3 shrink-0">
        {meta && (
          <span className="font-mono text-xs uppercase tracking-wider text-muted hidden sm:inline-block">
            {meta}
          </span>
        )}
        <span
          aria-hidden="true"
          className="font-mono text-base text-ink dark:text-paper inline-block transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transform-none"
        >
          →
        </span>
      </div>
    </div>
  );

  if (href) {
    const isInternal = href.startsWith("/") || href.startsWith("#");
    if (isInternal) {
      return (
        <Link
          href={href}
          className="block focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus-ring rounded-xs"
        >
          {content}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus-ring rounded-xs"
      >
        {content}
      </a>
    );
  }

  return content;
}
