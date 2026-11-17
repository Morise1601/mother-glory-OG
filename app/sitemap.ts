import { MetadataRoute } from "next";
import { getPrograms } from "@/lib/data/programs";
import { getAchievements } from "@/lib/data/achievements";
import { getSiteSettings } from "@/lib/data/settings";
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  try {
    const [settings, programs, achievements] = await Promise.all([
      getSiteSettings().catch(() => null),
      getPrograms().catch(() => []),
      getAchievements().catch(() => []),
    ]);

    const baseUrl = (settings?.canonicalOrigin || "https://www.motherglory.com").replace(/\/$/, "");

    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/`,
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
    const programRoutes: MetadataRoute.Sitemap = (programs || [])
      .filter((p) => p && p.status === "published" && p.slug)
      .map((p) => {
        const lastMod = p.updatedAt && !isNaN(new Date(p.updatedAt).getTime())
          ? new Date(p.updatedAt)
          : now;
        return {
          url: `${baseUrl}/programs/${encodeURIComponent(p.slug)}`,
          lastModified: lastMod,
          changeFrequency: "weekly" as const,
          priority: 0.85,
        };
      });

    // Dynamic published achievements
    const achievementRoutes: MetadataRoute.Sitemap = (achievements || [])
      .filter((a) => a && a.status === "published" && a.slug)
      .map((a) => {
        const lastMod = a.updatedAt && !isNaN(new Date(a.updatedAt).getTime())
          ? new Date(a.updatedAt)
          : now;
        return {
          url: `${baseUrl}/achievements/${encodeURIComponent(a.slug)}`,
          lastModified: lastMod,
          changeFrequency: "monthly" as const,
          priority: 0.8,
        };
      });

    return [...staticRoutes, ...programRoutes, ...achievementRoutes];
  } catch {
    const fallbackBase = "https://www.motherglory.com";
    return [
      { url: `${fallbackBase}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
      { url: `${fallbackBase}/about`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
      { url: `${fallbackBase}/programs`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
      { url: `${fallbackBase}/achievements`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
      { url: `${fallbackBase}/contact`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
      { url: `${fallbackBase}/privacy-policy`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
      { url: `${fallbackBase}/terms-and-conditions`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    ];
  }
}
