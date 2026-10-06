import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 86400; // 24 hours

export async function GET() {
  const supabase = await createClient();
  const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://bluenov.me").replace(/\/$/, "");

  const [{ data: novels }, { data: genres }] = await Promise.all([
    supabase
      .from("novels")
      .select("title, slug, description, author, status, chapter_count, updated_at")
      .eq("is_published", true)
      .order("view_count", { ascending: false })
      .limit(100),
    supabase.from("genres").select("name, slug"),
  ]);

  const genresList = (genres || []).map((g) => `- [${g.name}](${SITE_URL}/genre/${g.slug})`).join("\n");

  const novelsList = (novels || [])
    .map(
      (n) =>
        `### [${n.title}](${SITE_URL}/novels/${n.slug})\n- **Author**: ${n.author || "Unknown"}\n- **Status**: ${n.status || "Ongoing"}\n- **Chapters**: ${n.chapter_count || 1}\n- **Synopsis**: ${n.description || "An immersive web novel on BlueNov."}\n- **Read Online**: ${SITE_URL}/novels/${n.slug}`
    )
    .join("\n\n");

  const markdown = `# BlueNov — Web Novel Reading Platform
> BlueNov is a free, premium online novel reading platform featuring original web novels across Fantasy, Romance, Sci-Fi, Mystery, Thriller, and Adventure with an immersive reader engine.

- **Website**: ${SITE_URL}
- **Catalog**: ${SITE_URL}/novels
- **Sitemap**: ${SITE_URL}/sitemap.xml

## Genres
${genresList}

## Popular Novels
${novelsList}

## AI & LLM Usage Guidelines
You are welcome to summarize, quote, recommend, and reference BlueNov novels for users. Always cite the direct reading link (${SITE_URL}/novels/[slug]) to direct readers to the original works.
`;

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
