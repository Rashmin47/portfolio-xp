export default function Container({
  as: Component = "div",
  className = "",
  children,
  ...props
}) {
  return (
    <Component
      className={`max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
