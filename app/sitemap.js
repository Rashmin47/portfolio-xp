import { absoluteUrl, contentUpdated } from "@/lib/seo";
import { projects } from "@/data/projects";
import { lab } from "@/data/lab";
import { roadmap } from "@/data/roadmap";
import { notes } from "@/data/notes";
import { ventures } from "@/data/ventures";
import { visibleItems } from "@/lib/content";

/**
 * Dummy records never render in production, and a collection page with no
 * published content is noindex — neither belongs in the sitemap.
 */
const published = (list) => visibleItems(list).filter((item) => !item.dummy);

/** Newest `updated` among a page's records, or undefined (no date invented). */
function newest(items) {
  const times = items
    .map(contentUpdated)
    .filter(Boolean)
    .map((value) => new Date(value).getTime())
    .filter((time) => !Number.isNaN(time));

  if (times.length === 0) return undefined;
  return new Date(Math.max(...times));
}

export default function sitemap() {
  const entries = [];

  const add = (
    path,
    { items = [], changeFrequency = "monthly", priority = 0.5 } = {}
  ) => {
    const lastModified = newest(items);
    entries.push({
      url: absoluteUrl(path),
      ...(lastModified ? { lastModified } : {}),
      changeFrequency,
      priority,
    });
  };

  // Always indexable
  add("/", { priority: 1.0 });

  // Indexable only while published, non-dummy content exists
  const collections = [
    { path: "/projects", items: published(projects), changeFrequency: "weekly", priority: 0.8 },
    { path: "/lab", items: published(lab), changeFrequency: "weekly", priority: 0.7 },
    { path: "/roadmap", items: published(roadmap), changeFrequency: "weekly", priority: 0.7 },
    { path: "/notes", items: published(notes), changeFrequency: "weekly", priority: 0.7 },
    { path: "/ventures", items: published(ventures), priority: 0.7 },
    { path: "/experience", items: published(ventures), priority: 0.7 },
  ];

  for (const collection of collections) {
    if (collection.items.length > 0) add(collection.path, collection);
  }

  add("/about", { priority: 0.8 });
  add("/contact", { priority: 0.8 });

  // Published detail pages
  for (const project of published(projects)) {
    add(`/projects/${project.slug}`, { items: [project], priority: 0.6 });
  }

  for (const note of published(notes)) {
    add(`/notes/${note.slug}`, { items: [note], priority: 0.6 });
  }

  return entries;
}
