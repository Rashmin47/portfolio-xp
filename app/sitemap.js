import { siteUrl } from "@/lib/seo";
import { projects } from "@/data/projects";
import { lab } from "@/data/lab";
import { roadmap } from "@/data/roadmap";
import { notes } from "@/data/notes";
import { ventures } from "@/data/ventures";

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

  if (projects.some((p) => p.published)) {
    routes.push({
      url: `${siteUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  if (lab.some((l) => l.published)) {
    routes.push({
      url: `${siteUrl}/lab`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  if (roadmap.some((r) => r.published)) {
    routes.push({
      url: `${siteUrl}/roadmap`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  if (notes.some((n) => n.published)) {
    routes.push({
      url: `${siteUrl}/notes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  if (ventures.some((v) => v.published)) {
    routes.push({
      url: `${siteUrl}/ventures`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const project of projects.filter((p) => p.published)) {
    routes.push({
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const note of notes.filter((n) => n.published)) {
    routes.push({
      url: `${siteUrl}/notes/${note.slug}`,
      lastModified: note.updatedAt ? new Date(note.updatedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return routes;
}
