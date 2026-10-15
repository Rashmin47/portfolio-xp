export const siteUrl = (() => {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
})();

if (process.env.VERCEL && siteUrl === "http://localhost:3000") {
  throw new Error(
    "Build error: running on Vercel but siteUrl resolved to localhost. " +
      "Set SITE_URL or ensure VERCEL_PROJECT_PRODUCTION_URL is defined."
  );
}

export function buildMetadata({
  title,
  description,
  path = "",
  noindex = false,
  canonical = true,
}) {
  const url = path
    ? `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`
    : siteUrl;

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
