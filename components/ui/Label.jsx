export default function Label({
  as: Component = "span",
  className = "",
  children,
  ...props
}) {
  return (
    <Component
      className={`font-mono text-xs uppercase tracking-wider text-muted ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
