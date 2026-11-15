import { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/data/settings";
export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { canonicalOrigin: origin } = await getSiteSettings();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin", "/admin/", "/auth/"],
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
