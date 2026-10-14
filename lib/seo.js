export const siteUrl =
  process.env.SITE_URL ||
  (process.env.NEXT_PUBLIC_SITE_URL ? process.env.NEXT_PUBLIC_SITE_URL : "http://localhost:3000");

if (
  process.env.NODE_ENV === "production" &&
  !process.env.SITE_URL &&
  !process.env.NEXT_PUBLIC_SITE_URL
) {
  console.warn(
    "WARNING: SITE_URL environment variable is unset. Falling back to http://localhost:3000"
  );
}

export function buildMetadata({ title, description, path = "", noindex = false }) {
  const url = path
    ? `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`
    : siteUrl;

  const metadata = {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      siteName: "Rashmin Sharma",
      locale: "en_US",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };

  if (noindex) {
    metadata.robots = {
      index: false,
    };
  }

  return metadata;
}
