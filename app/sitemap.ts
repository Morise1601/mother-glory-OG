import { MetadataRoute } from "next";
import { getPrograms } from "@/lib/data/programs";
import { getAchievements } from "@/lib/data/achievements";
import { getSiteSettings } from "@/lib/data/settings";
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, programs, achievements] = await Promise.all([getSiteSettings(), getPrograms(), getAchievements()]);
  const baseUrl = settings.canonicalOrigin;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/programs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/achievements`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic published programs
  const programRoutes: MetadataRoute.Sitemap = programs.filter(
    (p) => p.status === "published"
  ).map((p) => ({
    url: `${baseUrl}/programs/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // Dynamic published achievements
  const achievementRoutes: MetadataRoute.Sitemap = achievements.filter(
    (a) => a.status === "published"
  ).map((a) => ({
    url: `${baseUrl}/achievements/${a.slug}`,
    lastModified: new Date(a.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...programRoutes, ...achievementRoutes];
}
