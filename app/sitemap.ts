import { createClient } from "@/lib/supabase/server";
import { MetadataRoute } from "next";

const SITE_URL = "https://bluenov.me";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [{ data: novels }, { data: chapters }, { data: articles }, { data: genres }] =
    await Promise.all([
      supabase.from("novels").select("slug, updated_at").eq("is_published", true),
      supabase.from("chapters").select("slug, novel_id, updated_at, novels!inner(slug)").eq("is_published", true),
      supabase.from("articles").select("slug, updated_at").eq("is_published", true),
      supabase.from("genres").select("slug, updated_at"),
    ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/novels`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/articles`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];

  const genrePages: MetadataRoute.Sitemap = (genres || []).map((g) => ({
    url: `${SITE_URL}/genre/${g.slug}`,
    lastModified: new Date(g.updated_at || Date.now()),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const novelPages: MetadataRoute.Sitemap = (novels || []).map((n) => ({
    url: `${SITE_URL}/novels/${n.slug}`,
    lastModified: new Date(n.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const chapterPages: MetadataRoute.Sitemap = (chapters || []).map((ch: any) => ({
    url: `${SITE_URL}/novels/${ch.novels.slug}/${ch.slug}`,
    lastModified: new Date(ch.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const articlePages: MetadataRoute.Sitemap = (articles || []).map((a) => ({
    url: `${SITE_URL}/articles/${a.slug}`,
    lastModified: new Date(a.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...genrePages, ...novelPages, ...chapterPages, ...articlePages];
}
