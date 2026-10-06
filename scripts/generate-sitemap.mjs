import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// Load environment variables from .env.local if present
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  });
}

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://bluenov.me").replace(/\/$/, "");
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zcbvnntslbbopfyfhfsy.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjYnZubnRzbGJib3BmeWZoZnN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0OTMwMTYsImV4cCI6MjA5NjA2OTAxNn0.TX9xT0xWUpGZLxxEN4vbDbKXWoalEIdVb7-LmVOPml8";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function generate() {
  console.log("Generating sitemap.xml for", SITE_URL);

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

  console.log(`Fetched ${novels?.length || 0} novels, ${chapters?.length || 0} chapters, ${genres?.length || 0} genres`);

  const now = new Date().toISOString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  const addUrl = (loc, lastmod, changefreq, priority) => {
    xml += `  <url>\n`;
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>${changefreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += `  </url>\n`;
  };

  // Core pages
  addUrl(`${SITE_URL}`, now, "hourly", "1.0");
  addUrl(`${SITE_URL}/novels`, now, "hourly", "0.95");
  addUrl(`${SITE_URL}/library`, now, "daily", "0.75");
  addUrl(`${SITE_URL}/search`, now, "daily", "0.70");
  addUrl(`${SITE_URL}/about`, now, "monthly", "0.50");
  addUrl(`${SITE_URL}/contact`, now, "monthly", "0.40");
  addUrl(`${SITE_URL}/privacy-policy`, now, "yearly", "0.30");
  addUrl(`${SITE_URL}/terms`, now, "yearly", "0.30");

  // Novels
  (novels || []).forEach((n) => {
    const mod = n.updated_at || n.created_at || now;
    addUrl(`${SITE_URL}/novels/${n.slug}`, new Date(mod).toISOString(), "daily", "0.90");
  });

  // Chapters
  (chapters || [])
    .filter((c) => c.novel?.slug && c.slug)
    .forEach((c) => {
      const mod = c.updated_at || c.created_at || now;
      addUrl(
        `${SITE_URL}/novels/${c.novel.slug}/${c.slug}`,
        new Date(mod).toISOString(),
        "weekly",
        "0.85"
      );
    });

  // Genres
  (genres || []).forEach((g) => {
    const mod = g.created_at || now;
    addUrl(`${SITE_URL}/genre/${g.slug}`, new Date(mod).toISOString(), "daily", "0.80");
  });

  xml += `</urlset>\n`;

  const publicPath = path.resolve(process.cwd(), "public", "sitemap.xml");
  fs.writeFileSync(publicPath, xml, "utf8");
  console.log("Successfully wrote", publicPath, `(${xml.length} bytes)`);
}

generate().catch(console.error);
