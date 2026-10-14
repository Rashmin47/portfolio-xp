import { siteConfig } from "@/data/site";
import { buildMetadata, siteUrl } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = buildMetadata({
  title: "About",
  description: `About ${siteConfig.name}, ${siteConfig.role.toLowerCase()} based in ${siteConfig.location}.`,
  path: "/about",
});

export default function AboutPage() {
  const sameAsLinks = [siteConfig.github, siteConfig.linkedin].filter(Boolean);

  const person = {
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    url: `${siteUrl}/about`,
    ...(sameAsLinks.length > 0 ? { sameAs: sameAsLinks } : {}),
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: person,
  };

  return (
    <section className="space-y-6">
      <JsonLd data={profilePageSchema} />
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
