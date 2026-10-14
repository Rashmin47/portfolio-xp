import { siteConfig } from "@/data/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-ink/10 dark:border-paper/10 py-8 text-sm text-muted">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>
          &copy; {currentYear} {siteConfig.name}. {siteConfig.location}.
        </p>
        <div className="flex items-center gap-4">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink dark:hover:text-paper transition-colors"
          >
            GitHub
          </a>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink dark:hover:text-paper transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
