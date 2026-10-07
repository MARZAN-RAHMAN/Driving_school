import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [globalSettings, pages, locations, articles] = await Promise.all([
    db.getGlobalSEOSettings(),
    db.getAllPageSEO(),
    db.getLocations(true),
    db.getContent("PUBLISHED"),
  ]);

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    globalSettings.canonicalBaseUrl ||
    "https://nextdrive.uk";

  const sitemapEntries: MetadataRoute.Sitemap = [];
  const addedUrls = new Set<string>();

  // 1. Process managed PageSEO records
  for (const page of pages) {
    // Strictly exclude NOINDEX pages from XML sitemap
    if (page.indexStatus === "NOINDEX") continue;

    // Strictly exclude private authenticated directories
    const cleanPath = page.urlPath.toLowerCase().trim();
    if (
      cleanPath.startsWith("/admin") ||
      cleanPath.startsWith("/instructor") ||
      cleanPath.startsWith("/student") ||
      cleanPath.startsWith("/api") ||
      cleanPath.startsWith("/auth")
    ) {
      continue;
    }

    const fullUrl = cleanPath === "/" ? baseUrl : `${baseUrl}${page.urlPath}`;
    if (!addedUrls.has(fullUrl)) {
      addedUrls.add(fullUrl);
      sitemapEntries.push({
        url: fullUrl,
        lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
        changeFrequency: page.changeFrequency || "weekly",
        priority: page.priority ?? (cleanPath === "/" ? 1.0 : 0.8),
      });
    }
  }

  // 2. Add active service locations if not already present
  for (const loc of locations) {
    if (!loc.slug) continue;
    const locUrl = `${baseUrl}/locations/${loc.slug}`;
    if (!addedUrls.has(locUrl)) {
      addedUrls.add(locUrl);
      sitemapEntries.push({
        url: locUrl,
        lastModified: loc.updatedAt ? new Date(loc.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  // 3. Add published driving guides / articles
  for (const article of articles) {
    if (!article.slug) continue;
    const articleUrl = `${baseUrl}/blog/${article.slug}`;
    if (!addedUrls.has(articleUrl)) {
      addedUrls.add(articleUrl);
      sitemapEntries.push({
        url: articleUrl,
        lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  // Sort by priority descending
  return sitemapEntries.sort((a, b) => (b.priority ?? 0.5) - (a.priority ?? 0.5));
}
