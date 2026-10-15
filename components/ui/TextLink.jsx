import Link from "next/link";

export default function TextLink({
  href,
  className = "",
  children,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center gap-1 text-ink dark:text-paper underline underline-offset-4 decoration-ink/25 dark:decoration-paper/25 hover:decoration-signal decoration-1 hover:decoration-2 transition-all focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus-ring rounded-xs";

  const combinedClass = `${baseStyles} ${className}`.trim();

  if (!href) {
    return <span className={combinedClass}>{children}</span>;
  }

  const isInternal = href.startsWith("/") || href.startsWith("#");

  if (isInternal) {
    return (
      <Link href={href} className={combinedClass} {...props}>
        {children}
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
      {children}
    </a>
  );
}
