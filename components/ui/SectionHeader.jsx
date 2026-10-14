export default function SectionHeader({
  number,
  label,
  title,
  className = "",
  children,
}) {
  return (
    <div className={`border-t border-ink/10 dark:border-paper/10 pt-4 mb-6 sm:mb-8 ${className}`}>
      <div className="flex items-baseline gap-3">
        {number && (
          <span className="font-mono text-xs sm:text-sm text-muted font-medium">
            {number}
          </span>
        )}
        {label && (
          <span className="font-mono text-xs uppercase tracking-wider text-muted font-medium">
            {label}
          </span>
        )}
      </div>
      {title && (
        <h2 className="mt-2 text-2xl sm:text-3xl font-display font-semibold tracking-tight text-ink dark:text-paper">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
