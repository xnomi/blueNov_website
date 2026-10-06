import { MetadataRoute } from "next";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://bluenov.me").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/admin", "/auth/", "/api/"],
      },
      // AI Search & Answer Engines (AGO / AEO) - explicitly welcome indexing
      {
        userAgent: [
          "Googlebot",
          "Google-Extended",
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "Applebot",
          "Bingbot",
        ],
        allow: "/",
        disallow: ["/admin/", "/auth/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
