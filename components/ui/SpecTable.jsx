export default function SpecTable({
  items,
  children,
  className = "",
  ...props
}) {
  return (
    <div
      className={`w-full divide-y divide-ink/10 dark:divide-paper/10 border-y border-ink/10 dark:border-paper/10 ${className}`}
      {...props}
    >
      {items
        ? items.map((item, idx) => (
            <div
              key={idx}
              className="py-2.5 flex justify-between items-baseline gap-4"
            >
              <span className="font-mono text-xs uppercase tracking-wider text-muted shrink-0">
                {item.key ?? item.label}
              </span>
              <span className="font-mono text-xs sm:text-sm text-ink dark:text-paper text-right">
                {item.value}
              </span>
            </div>
          ))
        : children}
    </div>
  );
}

export function SpecRow({ label, value, children, className = "" }) {
  return (
    <div
      className={`py-2.5 flex justify-between items-baseline gap-4 ${className}`}
    >
      <span className="font-mono text-xs uppercase tracking-wider text-muted shrink-0">
        {label}
      </span>
      <span className="font-mono text-xs sm:text-sm text-ink dark:text-paper text-right">
        {value ?? children}
      </span>
    </div>
  );
}

SpecTable.Row = SpecRow;
