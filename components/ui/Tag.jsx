export default function Tag({
  className = "",
  children,
  ...props
}) {
  return (
    <span
      className={`inline-flex items-center font-mono text-[11px] sm:text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-ink/10 dark:border-paper/10 bg-ink/[0.03] dark:bg-paper/[0.04] text-muted dark:text-muted ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
