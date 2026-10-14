import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-ink/10 dark:border-paper/10 bg-paper/80 dark:bg-night/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold tracking-wider text-xl hover:text-cobalt dark:hover:text-sky transition-colors"
        >
          RASHMIN
        </Link>
        <nav aria-label="Main Navigation">
          <ul className="flex items-center gap-6 text-sm font-medium">
            <li>
              <Link
                href="/projects"
                className="hover:text-cobalt dark:hover:text-sky transition-colors"
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                href="/ventures"
                className="hover:text-cobalt dark:hover:text-sky transition-colors"
              >
                Ventures
              </Link>
            </li>
            <li>
              <Link
                href="/notes"
                className="hover:text-cobalt dark:hover:text-sky transition-colors"
              >
                Notes
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-cobalt dark:hover:text-sky transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-cobalt dark:hover:text-sky transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
