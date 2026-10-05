import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ReaderShell } from "@/components/reader/ReaderShell";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string; chapter: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, chapter: chapterSlug } = await params;
  const supabase = await createClient();

  const { data: novel } = await supabase
    .from("novels")
    .select("title, author, cover_url")
    .eq("slug", slug)
    .single();

  const { data: chapter } = await supabase
    .from("chapters")
    .select("title, chapter_number")
    .eq("slug", chapterSlug)
    .single();

  if (!novel || !chapter) {
    return { title: "Chapter Not Found" };
  }

  const title = `${novel.title} — Chapter ${chapter.chapter_number}: ${chapter.title}`;
  const description = `Read ${novel.title} Chapter ${chapter.chapter_number}: ${chapter.title} online for free. Immersive, distraction-free reading experience at ${SITE_NAME}.`;
  const canonical = `${SITE_URL}/novels/${slug}/${chapterSlug}`;
  const ogImage = novel.cover_url || `${SITE_URL}/og-default.png`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default async function ChapterPage({ params }: PageProps) {
  const { slug, chapter: chapterSlug } = await params;
  const supabase = await createClient();

  // 1. Fetch Novel
  const { data: novel } = await supabase
    .from("novels")
    .select("id, title, slug, cover_url, author")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!novel) notFound();

  // 2. Fetch Current Chapter
  const { data: chapter } = await supabase
    .from("chapters")
    .select("*")
    .eq("novel_id", novel.id)
    .eq("slug", chapterSlug)
    .eq("is_published", true)
    .single();

  if (!chapter) notFound();

  // 3. Fetch All Published Chapters for TOC & Navigation
  const { data: chapters } = await supabase
    .from("chapters")
    .select("id, slug, title, chapter_number")
    .eq("novel_id", novel.id)
    .eq("is_published", true)
    .order("chapter_number", { ascending: true });

  const chapterList = chapters || [];

  // Find prev & next chapters
  const currentIndex = chapterList.findIndex((c) => c.slug === chapterSlug);
  const prevChapter = currentIndex > 0 ? chapterList[currentIndex - 1] : null;
  const nextChapter = currentIndex >= 0 && currentIndex < chapterList.length - 1
    ? chapterList[currentIndex + 1]
    : null;

  // 4. Increment view count asynchronously
  await supabase.rpc("increment_chapter_views", { chapter_id: chapter.id }).maybeSingle();

  // JSON-LD Chapter structured data
  const chapterSchema = {
    "@context": "https://schema.org",
    "@type": "Chapter",
    name: chapter.title,
    position: chapter.chapter_number,
    isPartOf: {
      "@type": "Book",
      name: novel.title,
      url: `${SITE_URL}/novels/${novel.slug}`,
    },
    url: `${SITE_URL}/novels/${novel.slug}/${chapter.slug}`,
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Novels", url: `${SITE_URL}/novels` },
          { name: novel.title, url: `${SITE_URL}/novels/${novel.slug}` },
          {
            name: `Chapter ${chapter.chapter_number}`,
            url: `${SITE_URL}/novels/${novel.slug}/${chapter.slug}`,
          },
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(chapterSchema) }}
      />

      <ReaderShell
        novel={novel}
        chapter={chapter}
        chapters={chapterList}
        prevChapter={prevChapter}
        nextChapter={nextChapter}
      />
    </>
  );
}
