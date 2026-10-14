export default function Prose({
  as: Component = "article",
  className = "",
  children,
  ...props
}) {
  return (
    <Component
      className={`max-w-[70ch] leading-relaxed text-ink/90 dark:text-paper/90 text-base sm:text-lg
        [&_h1]:font-display [&_h1]:text-2xl sm:[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-ink dark:[&_h1]:text-paper [&_h1]:mt-8 [&_h1]:mb-4
        [&_h2]:font-display [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink dark:[&_h2]:text-paper [&_h2]:mt-6 [&_h2]:mb-3
        [&_h3]:font-display [&_h3]:text-lg sm:[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-ink dark:[&_h3]:text-paper [&_h3]:mt-5 [&_h3]:mb-2
        [&_p]:mb-4 [&_p]:leading-relaxed
        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:space-y-1.5
        [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_ol]:space-y-1.5
        [&_li]:leading-relaxed
        [&_blockquote]:border-l-2 [&_blockquote]:border-ink/20 dark:[&_blockquote]:border-paper/20 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted [&_blockquote]:my-6
        [&_code]:font-mono [&_code]:text-xs [&_code]:bg-ink/[0.06] dark:[&_code]:bg-paper/[0.08] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded
        [&_pre]:font-mono [&_pre]:text-xs [&_pre]:p-4 [&_pre]:bg-ink/[0.04] dark:[&_pre]:bg-paper/[0.05] [&_pre]:rounded-[14px] [&_pre]:overflow-x-auto [&_pre]:my-6 [&_pre_code]:bg-transparent [&_pre_code]:p-0
        [&_a]:text-cobalt dark:[&_a]:text-sky [&_a]:underline [&_a]:underline-offset-4
        ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
