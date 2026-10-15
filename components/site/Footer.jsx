import Link from "next/link";
import { siteConfig } from "@/data/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-ink/10 dark:border-paper/10 pt-12 pb-16 text-left">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Column 1: Identity / Specs (5 cols) */}
          <div className="md:col-span-5 space-y-1">
            <span className="font-mono text-xs uppercase tracking-wider text-muted block mb-2">
              IDENTITY
            </span>
            <p className="font-display font-bold text-ink dark:text-paper text-lg tracking-tight">
              {siteConfig.name}
            </p>
            <p className="text-sm text-muted">
              {siteConfig.role}
            </p>
            <p className="text-sm text-muted">
              {siteConfig.location}
            </p>
            <p className="font-mono text-xs text-muted pt-4">
              &copy; {currentYear} {siteConfig.name}. All rights reserved.
            </p>
          </div>

          {/* Column 2: Page Links (4 cols) */}
          <div className="md:col-span-4 space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-muted block mb-2">
              INDEX
            </span>
            <ul className="space-y-1.5 font-mono text-xs uppercase tracking-wider">
              <li>
                <Link
                  href="/projects"
                  className="text-muted hover:text-ink dark:hover:text-paper hover:underline decoration-signal underline-offset-4 transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/lab"
                  className="text-muted hover:text-ink dark:hover:text-paper hover:underline decoration-signal underline-offset-4 transition-colors"
                >
                  The Lab
                </Link>
              </li>
              <li>
                <Link
                  href="/roadmap"
                  className="text-muted hover:text-ink dark:hover:text-paper hover:underline decoration-signal underline-offset-4 transition-colors"
                >
                  Roadmap
                </Link>
              </li>
              <li>
                <Link
                  href="/experience"
                  className="text-muted hover:text-ink dark:hover:text-paper hover:underline decoration-signal underline-offset-4 transition-colors"
                >
                  Experience
                </Link>
              </li>
              <li>
                <Link
                  href="/notes"
                  className="text-muted hover:text-ink dark:hover:text-paper hover:underline decoration-signal underline-offset-4 transition-colors"
                >
                  Notes
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted hover:text-ink dark:hover:text-paper hover:underline decoration-signal underline-offset-4 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted hover:text-ink dark:hover:text-paper hover:underline decoration-signal underline-offset-4 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/workshop"
                  className="text-muted hover:text-ink dark:hover:text-paper hover:underline decoration-signal underline-offset-4 transition-colors"
                >
                  The Workshop
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: External Networks (3 cols) */}
          <div className="md:col-span-3 space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-muted block mb-2">
              NETWORKS
            </span>
            <ul className="space-y-1.5 font-mono text-xs uppercase tracking-wider">
              <li>
                <a
                  href={siteConfig.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-ink dark:hover:text-paper hover:underline decoration-signal underline-offset-4 transition-colors inline-flex items-center gap-1 group"
                >
                  <span>GitHub</span>
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                  >
                    ↗
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-ink dark:hover:text-paper hover:underline decoration-signal underline-offset-4 transition-colors inline-flex items-center gap-1 group"
                >
                  <span>LinkedIn</span>
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                  >
                    ↗
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
