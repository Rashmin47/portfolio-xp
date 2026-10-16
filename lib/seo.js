import { siteConfig } from "@/data/site";
import { about } from "@/data/about";

/** File-convention Open Graph image: app/opengraph-image.js */
const OG_IMAGE = "/opengraph-image";
const OG_IMAGE_ALT = `${siteConfig.name} — ${siteConfig.role}, ${siteConfig.location}`;

/**
 * Canonical origin, always without a trailing slash.
 *
 * SITE_URL is the single source of truth. A production build without it fails
 * on purpose, on any host (Vercel included): a missing origin silently poisons
 * canonical tags, Open Graph URLs and the sitemap, and an error at build time
 * is far cheaper than an index full of wrong URLs. Development keeps localhost.
 */
export const siteUrl = (() => {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, "");

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SITE_URL is not set. Production builds need the canonical origin, " +
        "e.g. SITE_URL=https://rashmin.com.np npm run build"
    );
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`.replace(
      /\/+$/,
      ""
    );
  }

  return "http://localhost:3000";
})();

/**
 * Stable Person @id. Every page refers to this one entity instead of restating
 * the person, so search engines resolve a single author/profile.
 */
export const personId = `${siteUrl}/#person`;

/** Absolute URL for a site path. "" and "/" both resolve to the origin. */
export function absoluteUrl(path = "") {
  if (!path || path === "/") return siteUrl;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Last-updated value for a content record, or null when the data has none.
 * `updated` is the canonical field; the older `updatedAt` (projects) and
 * `dateModified` (notes) aliases are still honoured so no date is invented.
 */
export function contentUpdated(item = {}) {
  const value = item.updated || item.updatedAt || item.dateModified;
  return value ? String(value) : null;
}

/** "Kathmandu, Nepal" -> PostalAddress. Splits only, never invents parts. */
function postalAddress(location) {
  const [locality, country] = String(location)
    .split(",")
    .map((part) => part.trim());

  return {
    "@type": "PostalAddress",
    ...(locality ? { addressLocality: locality } : {}),
    ...(country ? { addressCountry: country } : {}),
  };
}

/**
 * The Person node. Only fields that exist in data are emitted: a missing
 * education, photo, skill list or profile simply omits its property.
 */
export function personNode() {
  const sameAs = [
    siteConfig.github,
    siteConfig.linkedin,
    ...(siteConfig.profiles || []),
  ].filter(Boolean);

  return {
    "@type": "Person",
    "@id": personId,
    name: siteConfig.name,
    url: siteUrl,
    jobTitle: siteConfig.role,
    ...(siteConfig.location ? { address: postalAddress(siteConfig.location) } : {}),
    ...(about.education
      ? {
          alumniOf: {
            "@type": "EducationalOrganization",
            name: about.education,
          },
        }
      : {}),
    ...(siteConfig.skills && siteConfig.skills.length > 0
      ? { knowsAbout: siteConfig.skills }
      : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(about.photo && about.photo.src
      ? { image: absoluteUrl(about.photo.src) }
      : {}),
  };
}

/** BreadcrumbList node. `trail` is [{ name, path }] from the home page down. */
export function breadcrumbNode(trail = []) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: absoluteUrl(entry.path),
    })),
  };
}

/** Home + a single inner page: [{ Home, "/" }, { name, path }]. */
export function pageBreadcrumb(name, path) {
  return breadcrumbNode([
    { name: "Home", path: "/" },
    { name, path },
  ]);
}

export function buildMetadata({
  title,
  description,
  path = "",
  noindex = false,
  canonical = true,
  type = "website",
}) {
  const url = absoluteUrl(path);

  const metadata = {
    title,
    description,
    ...(canonical
      ? {
          alternates: {
            canonical: url,
          },
        }
      : {}),
    openGraph: {
      type,
      url,
      siteName: siteConfig.name,
      locale: "en_US",
      title,
      description,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: OG_IMAGE_ALT }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };

  if (noindex) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  return metadata;
}
