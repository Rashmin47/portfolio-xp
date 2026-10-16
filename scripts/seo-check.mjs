#!/usr/bin/env node
/**
 * seo:check
 * ---------
 * Validates the HTML that `next build` actually emitted (not the source), for
 * every route under .next/server/app:
 *
 *   - exactly one <h1>
 *   - <title> present and 60 characters or fewer
 *   - meta description present and 160 characters or fewer
 *   - canonical link present and pointing at SITE_URL
 *   - no "localhost" anywhere in the markup
 *   - every application/ld+json block parses
 *   - at least three internal links
 *
 * Usage: SITE_URL=https://rashmin.com.np npm run build && SITE_URL=... npm run seo:check
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, ".next", "server", "app");
const SITE_URL = (process.env.SITE_URL || "").replace(/\/+$/, "");

// Routes that are not real pages in a production build: dev-only shells that
// call notFound(), and Next.js internals (_not-found, _global-error).
const SKIP = new Set(["dev/ui", "_not-found", "_global-error"]);

const LIMITS = {
  title: 60,
  description: 160,
  internalLinks: 3,
};

if (!SITE_URL) {
  console.error(
    "seo:check needs SITE_URL, the same origin the build used, " +
      "e.g. SITE_URL=https://rashmin.com.np npm run seo:check"
  );
  process.exit(1);
}

async function findHtmlFiles(dir) {
  const found = [];
  let entries;

  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    console.error(
      `seo:check could not read ${path.relative(ROOT, dir)}. Run npm run build first.`
    );
    process.exit(1);
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...(await findHtmlFiles(full)));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      found.push(full);
    }
  }

  return found;
}

function routeFor(file) {
  const relative = path
    .relative(APP_DIR, file)
    .replace(/\.html$/, "")
    .split(path.sep)
    .join("/");

  if (relative === "index") return "/";
  return `/${relative.replace(/\/index$/, "")}`;
}

const decodeEntities = (value = "") =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&#x2F;/g, "/");

function extract(html) {
  const titleRaw = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleRaw ? decodeEntities(titleRaw[1]).trim() : "";

  const descriptionRaw = html.match(
    /<meta[^>]+name="description"[^>]+content="([^"]*)"/i
  );
  const description = descriptionRaw ? decodeEntities(descriptionRaw[1]).trim() : "";

  const canonicalRaw = html.match(
    /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i
  );
  const canonical = canonicalRaw ? canonicalRaw[1] : "";

  const h1 = (html.match(/<h1\b/gi) || []).length;

  const ldBlocks = [
    ...html.matchAll(
      /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
    ),
  ].map((match) => match[1]);

  const internalLinks = new Set(
    [...html.matchAll(/<a\b[^>]*\shref="(\/[^"]*)"/gi)].map((match) => match[1])
  );

  return {
    title,
    description,
    canonical,
    h1,
    ldBlocks,
    links: internalLinks.size,
    hasLocalhost: /localhost/i.test(html),
  };
}

function check(html) {
  const data = extract(html);
  const problems = [];

  if (data.h1 !== 1) {
    problems.push(
      data.h1 === 0 ? "no h1" : `${data.h1} h1 elements (expected 1)`
    );
  }
  if (!data.title) {
    problems.push("no title");
  } else if (data.title.length > LIMITS.title) {
    problems.push(`title ${data.title.length} chars`);
  }
  if (!data.description) {
    problems.push("no description");
  } else if (data.description.length > LIMITS.description) {
    problems.push(`description ${data.description.length} chars`);
  }
  if (!data.canonical) {
    problems.push("no canonical");
  } else if (!data.canonical.startsWith(SITE_URL)) {
    problems.push("canonical off-site");
  }
  if (data.hasLocalhost) problems.push("contains localhost");

  data.ldBlocks.forEach((block, index) => {
    try {
      JSON.parse(block);
    } catch {
      problems.push(`json-ld #${index + 1} invalid`);
    }
  });

  if (data.links < LIMITS.internalLinks) {
    problems.push(`${data.links} internal links`);
  }

  return { data, problems };
}

function pad(value, width) {
  const text = String(value);
  return text.length >= width ? text : text + " ".repeat(width - text.length);
}

const files = await findHtmlFiles(APP_DIR);
const rows = [];
let failed = 0;

for (const file of files.sort()) {
  const route = routeFor(file);
  if (SKIP.has(route.replace(/^\//, ""))) continue;

  const html = await readFile(file, "utf8");
  const { data, problems } = check(html);
  if (problems.length > 0) failed += 1;

  rows.push({
    route,
    h1: data.h1,
    title: data.title.length,
    description: data.description.length,
    canonical: data.canonical.startsWith(SITE_URL) ? "ok" : "bad",
    jsonLd: data.ldBlocks.length,
    links: data.links,
    status: problems.length === 0 ? "PASS" : `FAIL (${problems.join(", ")})`,
  });
}

const headers = {
  route: "ROUTE",
  h1: "H1",
  title: `TITLE<=${LIMITS.title}`,
  description: `DESC<=${LIMITS.description}`,
  canonical: "CANONICAL",
  jsonLd: "JSONLD",
  links: "LINKS",
  status: "STATUS",
};

const widths = {};
for (const key of Object.keys(headers)) {
  widths[key] = Math.max(
    headers[key].length,
    ...rows.map((row) => String(row[key]).length),
    0
  );
}

const line = (cells) =>
  Object.keys(headers)
    .map((key) => pad(cells[key], widths[key]))
    .join("  ")
    .trimEnd();

console.log(line(headers));
console.log(
  Object.keys(headers)
    .map((key) => "-".repeat(widths[key]))
    .join("  ")
);
for (const row of rows) console.log(line(row));

console.log("");
console.log(`${rows.length} routes checked, ${failed} failed.`);

if (failed > 0) process.exit(1);
