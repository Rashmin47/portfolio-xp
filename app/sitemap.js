import { siteUrl } from "@/lib/seo";
import { projects } from "@/data/projects";
import { lab } from "@/data/lab";
import { roadmap } from "@/data/roadmap";
import { notes } from "@/data/notes";
import { ventures } from "@/data/ventures";

/**
 * Sitemap only includes non-dummy, published items.
 * Dummy items are excluded regardless of NODE_ENV.
 */
function realItems(list) {
  return list.filter((item) => item.published && !item.dummy);
}

export default function sitemap() {
  const routes = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  if (realItems(projects).length > 0) {
    routes.push({
      url: `${siteUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  if (realItems(lab).length > 0) {
    routes.push({
      url: `${siteUrl}/lab`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  if (realItems(roadmap).length > 0) {
    routes.push({
      url: `${siteUrl}/roadmap`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  if (realItems(notes).length > 0) {
    routes.push({
      url: `${siteUrl}/notes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  if (realItems(ventures).length > 0) {
    routes.push({
      url: `${siteUrl}/ventures`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const project of realItems(projects)) {
    routes.push({
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const note of realItems(notes)) {
    routes.push({
      url: `${siteUrl}/notes/${note.slug}`,
      lastModified: note.updatedAt ? new Date(note.updatedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return routes;
}
