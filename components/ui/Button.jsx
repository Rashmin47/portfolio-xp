import Link from "next/link";

export default function Button({
  variant = "primary",
  href,
  arrow = false,
  className = "",
  children,
  ...props
}) {
  const baseStyles =
    "group inline-flex items-center justify-center gap-2 font-mono text-xs sm:text-sm uppercase tracking-wider font-medium px-4 py-2.5 rounded-[14px] transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus-ring select-none cursor-pointer";

  const variantStyles =
    variant === "primary"
      ? "bg-signal text-ink hover:brightness-95 active:brightness-90 border border-signal"
      : "border border-ink/15 dark:border-paper/15 text-ink dark:text-paper hover:bg-ink/[0.04] dark:hover:bg-paper/[0.04]";

  const combinedClass = `${baseStyles} ${variantStyles} ${className}`.trim();

  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transform-none"
        >
          →
        </span>
      )}
    </>
  );

  if (href) {
    const isInternal = href.startsWith("/") || href.startsWith("#");
    if (isInternal) {
      return (
        <Link href={href} className={combinedClass} {...props}>
          {content}
        </Link>
      );
    }
    return (
      <a
        href={href}
        className={combinedClass}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={combinedClass} {...props}>
      {content}
    </button>
  );
}
