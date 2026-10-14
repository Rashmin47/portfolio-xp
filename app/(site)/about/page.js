import { siteConfig } from "@/data/site";

export const metadata = {
  title: "About | Rashmin Sharma",
  description: `About ${siteConfig.name}, ${siteConfig.role.toLowerCase()} based in ${siteConfig.location}.`,
};

export default function AboutPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
        About
      </h1>
      <p className="text-lg leading-relaxed">
        I am {siteConfig.name}, a {siteConfig.role.toLowerCase()} based in {siteConfig.location}.
      </p>
      <div className="pt-4 space-y-3">
        <h2 className="text-xl font-semibold">Links & Profiles</h2>
        <ul className="space-y-2">
          <li>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cobalt hover:underline dark:text-sky font-medium"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cobalt hover:underline dark:text-sky font-medium"
            >
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
