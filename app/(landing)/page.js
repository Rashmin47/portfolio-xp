import { hotspots } from "@/data/hotspots";
import { buildMetadata, siteUrl } from "@/lib/seo";
import { siteConfig } from "@/data/site";
import JsonLd from "@/components/seo/JsonLd";
import WorkshopClient from "@/components/workshop/WorkshopClient";

export const metadata = buildMetadata({
  title: siteConfig.name,
  description: siteConfig.hero.support,
  path: "/",
});

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  jobTitle: siteConfig.role,
  url: siteUrl,
  sameAs: [siteConfig.github, siteConfig.linkedin].filter(Boolean),
};

/**
 * Full-screen 3D landing page.
 * The 3D desk scene IS the homepage — hotspots navigate to all sections.
 * A "Classic view" link at bottom-right leads to /home (the text-based homepage).
 */
export default function LandingPage() {
  return (
    <>
      <JsonLd data={personSchema} />
      {/* Hidden H1 for SEO — visually hidden but screen-reader and crawler accessible */}
      <h1
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {siteConfig.hero.h1}
      </h1>

      {/* Server-rendered nav for no-JS / crawlers */}
      <nav
        aria-label="Site navigation"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        <ul>
          {hotspots.map((spot) => (
            <li key={spot.id}>
              <a href={spot.href}>{spot.label}</a>
            </li>
          ))}
          <li><a href="/home">Classic view</a></li>
        </ul>
      </nav>

      {/* Full-screen 3D Workshop */}
      <WorkshopClient hotspots={hotspots} classicHref="/home" />
    </>
  );
}
