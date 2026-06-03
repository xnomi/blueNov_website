import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { ChevronLeft, ChevronRight, BookOpen, ArrowLeft, List } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string; chapter: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, chapter: chapterSlug } = await params;
  const supabase = await createClient();

  const { data: novel } = await supabase.from("novels").select("title").eq("slug", slug).single();
  const { data: chapter } = await supabase
    .from("chapters")
    .select("title, chapter_number")
    .eq("slug", chapterSlug)
    .single();

  if (!novel || !chapter) return { title: "Chapter Not Found" };

  return {
    title: `${novel.title} — Chapter ${chapter.chapter_number}: ${chapter.title}`,
    description: `Read ${novel.title} Chapter ${chapter.chapter_number}: ${chapter.title} online for free at BlueNov.`,
    alternates: { canonical: `https://bluenov.me/novels/${slug}/${chapterSlug}` },
    robots: { index: true, follow: true },
  };
}

export default async function ChapterPage({ params }: PageProps) {
  const { slug, chapter: chapterSlug } = await params;
  const supabase = await createClient();

  const { data: novel } = await supabase
    .from("novels")
    .select("id, title, slug")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!novel) notFound();

  const { data: chapter } = await supabase
    .from("chapters")
    .select("*")
    .eq("novel_id", novel.id)
    .eq("slug", chapterSlug)
    .eq("is_published", true)
    .single();

  if (!chapter) notFound();

  // Prev / Next
  const { data: prevChapter } = await supabase
    .from("chapters")
    .select("slug, title, chapter_number")
    .eq("novel_id", novel.id)
    .eq("is_published", true)
    .lt("chapter_number", chapter.chapter_number)
    .order("chapter_number", { ascending: false })
    .limit(1)
    .single();

  const { data: nextChapter } = await supabase
    .from("chapters")
    .select("slug, title, chapter_number")
    .eq("novel_id", novel.id)
    .eq("is_published", true)
    .gt("chapter_number", chapter.chapter_number)
    .order("chapter_number")
    .limit(1)
    .single();

  // Increment views
  await supabase.rpc("increment_chapter_views", { chapter_id: chapter.id }).maybeSingle();

  const NavBar = () => (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: "0.5rem", flexWrap: "wrap",
    }}>
      {prevChapter ? (
        <Link href={`/novels/${slug}/${prevChapter.slug}`} className="btn-ghost" style={{ fontSize: "0.875rem" }}>
          <ChevronLeft size={16} /> Previous
        </Link>
      ) : <div />}

      <Link href={`/novels/${slug}`} className="btn-ghost" style={{ fontSize: "0.875rem" }}>
        <List size={16} /> Chapter List
      </Link>

      {nextChapter ? (
        <Link href={`/novels/${slug}/${nextChapter.slug}`} className="btn-primary" style={{ fontSize: "0.875rem" }}>
          Next <ChevronRight size={16} />
        </Link>
      ) : <div />}
    </div>
  );

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://bluenov.me" },
          { name: "Novels", url: "https://bluenov.me/novels" },
          { name: novel.title, url: `https://bluenov.me/novels/${slug}` },
          { name: `Chapter ${chapter.chapter_number}`, url: `https://bluenov.me/novels/${slug}/${chapterSlug}` },
        ]}
      />

      {/* Reading Header */}
      <div style={{
        position: "sticky", top: "64px", zIndex: 50,
        background: "var(--header-bg)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-color)",
        padding: "0.625rem 1.25rem",
      }}>
        <div className="container-narrow" style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "space-between" }}>
          <Link href={`/novels/${slug}`} style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--text-muted)", textDecoration: "none", fontSize: "0.8rem", flexShrink: 0 }}>
            <ArrowLeft size={14} /> {novel.title}
          </Link>
          <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--text-secondary)", textAlign: "center" }}>
            Chapter {chapter.chapter_number}
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", flexShrink: 0 }}>
            {formatDate(chapter.created_at)}
          </span>
        </div>
      </div>

      {/* Reading area */}
      <div className="container-narrow" style={{ padding: "2.5rem 1.25rem" }}>
        {/* Chapter Title */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p style={{ fontSize: "0.875rem", color: "var(--accent)", fontWeight: 600, marginBottom: "0.5rem" }}>
            Chapter {chapter.chapter_number}
          </p>
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.2,
          }}>
            {chapter.title}
          </h1>
        </div>

        {/* Top Nav */}
        <div style={{ marginBottom: "2.5rem" }}>
          <NavBar />
        </div>

        <div className="divider" />

        {/* Content */}
        <div
          className="reading-content"
          style={{ padding: "2rem 0" }}
          dangerouslySetInnerHTML={{ __html: chapter.content }}
        />

        <div className="divider" />

        {/* Bottom Nav */}
        <div style={{ marginTop: "2rem" }}>
          <NavBar />
        </div>

        {/* Back link */}
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link href={`/novels/${slug}`} style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            color: "var(--accent)", fontWeight: 500, textDecoration: "none", fontSize: "0.875rem",
          }}>
            <BookOpen size={15} /> View all chapters of {novel.title}
          </Link>
        </div>
      </div>
    </>
  );
}
