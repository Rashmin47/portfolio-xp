export default function DummyBadge({
  label = "DUMMY / LAYOUT TEST",
  className = "",
  ...props
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[999px] bg-signal text-ink border border-signal font-semibold select-none ${className}`}
      title="Placeholder entry for layout testing only. Not rendered in production."
      {...props}
    >
      <span
        aria-hidden="true"
        className="inline-block w-1.5 h-1.5 rounded-full bg-signal"
      />
      {label}
    </span>
  );
}
