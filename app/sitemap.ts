import { createClient } from "@/lib/supabase/server";
import { MetadataRoute } from "next";

export const revalidate = 3600; // Revalidate every hour for fresh indexation

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://bluenov.me").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Concurrently fetch novels, chapters, and genres
  const [{ data: novels }, { data: chapters }, { data: genres }] =
    await Promise.all([
      supabase
        .from("novels")
        .select("slug, updated_at, created_at")
        .eq("is_published", true)
        .order("updated_at", { ascending: false })
        .limit(1000),
      supabase
        .from("chapters")
        .select("slug, updated_at, created_at, novel:novels(slug)")
        .eq("is_published", true)
        .order("updated_at", { ascending: false })
        .limit(3000),
      supabase
        .from("genres")
        .select("slug, created_at")
        .limit(100),
    ]);

  // 1. High-Priority Core Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/novels`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/library`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // 2. All Published Novels
  const novelPages: MetadataRoute.Sitemap = (novels || []).map((n) => ({
    url: `${SITE_URL}/novels/${n.slug}`,
    lastModified: new Date(n.updated_at || n.created_at || Date.now()),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  // 3. All Published Chapters (Most critical for long-tail SEO)
  const chapterPages: MetadataRoute.Sitemap = (chapters || [])
    .filter((c: any) => c.novel?.slug && c.slug)
    .map((c: any) => ({
      url: `${SITE_URL}/novels/${c.novel.slug}/${c.slug}`,
      lastModified: new Date(c.updated_at || c.created_at || Date.now()),
      changeFrequency: "weekly",
      priority: 0.85,
    }));

  // 4. Genre Directories
  const genrePages: MetadataRoute.Sitemap = (genres || []).map((g) => ({
    url: `${SITE_URL}/genre/${g.slug}`,
    lastModified: new Date(g.created_at || Date.now()),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticPages, ...novelPages, ...chapterPages, ...genrePages];
}
