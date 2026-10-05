import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatDate, formatViews, statusLabel, formatCoverUrl } from "@/lib/utils";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { ChapterList } from "@/components/novels/ChapterList";
import { NovelHeroActions } from "@/components/novels/NovelHeroActions";
import { ExpandableSynopsis } from "@/components/novels/ExpandableSynopsis";
import { NovelReviews } from "@/components/novels/NovelReviews";
import { NovelCard } from "@/components/novels/NovelCard";
import { Novel } from "@/types";
import {
  Eye,
  BookOpen,
  Clock,
  Star,
  User,
  Tag,
  Share2,
  Sparkles,
} from "lucide-react";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: novel } = await supabase
    .from("novels")
    .select("*, genre:genres(*)")
    .eq("slug", slug)
    .single();

  if (!novel) return { title: "Novel Not Found" };

  const title = novel.meta_title || `${novel.title} — Read Free Web Novel Online`;
  const description =
    novel.meta_description ||
    novel.description ||
    `Read ${novel.title} online for free at ${SITE_NAME}.`;
  const canonical = `${SITE_URL}/novels/${slug}`;
  const ogImage = novel.cover_url || `${SITE_URL}/og-default.png`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "book" as any,
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      authors: novel.author ? [novel.author] : [SITE_NAME],
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

export default async function NovelDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Fetch Novel
  const { data: novel } = await supabase
    .from("novels")
    .select("*, genre:genres(*)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!novel) notFound();

  // 2. Fetch Chapters
  const { data: chapters } = await supabase
    .from("chapters")
    .select("id, slug, title, chapter_number, created_at")
    .eq("novel_id", novel.id)
    .eq("is_published", true)
    .order("chapter_number", { ascending: true });

  const chapterList = chapters || [];
  const firstChapterSlug = chapterList[0]?.slug;

  // 3. Related Novels in same genre
  const { data: relatedNovels } = await supabase
    .from("novels")
    .select("*, genre:genres(*)")
    .eq("is_published", true)
    .eq("genre_id", novel.genre_id)
    .neq("id", novel.id)
    .limit(4);

  // 4. Increment view count asynchronously
  await supabase.rpc("increment_novel_views", { novel_id: novel.id }).maybeSingle();

  // Deterministic mock rating from slug
  const ratingScore = (4.4 + (novel.title.charCodeAt(0) % 6) * 0.1).toFixed(1);

  // JSON-LD Book Structured Data
  const bookSchema = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: novel.title,
    url: `${SITE_URL}/novels/${novel.slug}`,
    image: novel.cover_url || `${SITE_URL}/og-default.png`,
    author: {
      "@type": "Person",
      name: novel.author || "Unknown",
    },
    genre: novel.genre?.name,
    description: novel.description,
    inLanguage: "en",
    numberOfPages: chapterList.length,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: ratingScore,
      bestRating: "5",
      ratingCount: "38",
    },
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Novels", url: `${SITE_URL}/novels` },
          { name: novel.title, url: `${SITE_URL}/novels/${novel.slug}` },
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }}
      />

      {/* ── Novel Hero Section ────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-primary) 100%)",
          borderBottom: "1px solid var(--border-color)",
          padding: "3rem 0 3.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="container-main">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "240px 1fr",
              gap: "2.5rem",
              alignItems: "start",
            }}
            className="novel-hero-grid"
          >
            {/* Left: 2:3 Aspect Cover */}
            <div
              className="aspect-cover"
              style={{
                width: "100%",
                maxWidth: "260px",
                margin: "0 auto",
                boxShadow: "var(--shadow-cover)",
                borderRadius: "16px",
              }}
            >
              {formatCoverUrl(novel.cover_url) ? (
                <Image
                  src={formatCoverUrl(novel.cover_url)!}
                  alt={`${novel.title} cover`}
                  fill
                  priority
                  unoptimized
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 240px, 280px"
                />
              ) : (
                <div
                  className="cover-placeholder"
                  style={{ width: "100%", height: "100%", fontSize: "3rem" }}
                >
                  {novel.title.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            {/* Right: Metadata & Synopsis */}
            <div>
              {/* Badges */}
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                <span className={`badge status-${novel.status}`}>
                  {statusLabel(novel.status)}
                </span>

                {novel.genre && (
                  <Link
                    href={`/genre/${novel.genre.slug}`}
                    className="badge"
                    style={{ textDecoration: "none" }}
                  >
                    {novel.genre.name}
                  </Link>
                )}
              </div>

              {/* Title */}
              <h1
                className="h1"
                style={{
                  fontSize: "clamp(1.85rem, 3.5vw, 2.75rem)",
                  color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                {novel.title}
              </h1>

              {/* Author */}
              {novel.author && (
                <p style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                  Written by{" "}
                  <Link
                    href={`/authors/${encodeURIComponent(novel.author)}`}
                    style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}
                  >
                    {novel.author}
                  </Link>
                </p>
              )}

              {/* Stats Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.5rem",
                  flexWrap: "wrap",
                  padding: "0.75rem 0",
                  borderTop: "1px solid var(--border-color)",
                  borderBottom: "1px solid var(--border-color)",
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  margin: "1rem 0 1.5rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <Star size={16} fill="#FBBF24" color="#FBBF24" />
                  <strong style={{ color: "var(--text-primary)" }}>{ratingScore}</strong>
                  <span style={{ color: "var(--text-muted)" }}>/ 5.0</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <BookOpen size={16} color="var(--accent)" />
                  <strong style={{ color: "var(--text-primary)" }}>{chapterList.length}</strong>
                  <span>Chapters</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <Eye size={16} color="var(--text-muted)" />
                  <span>{formatViews(novel.view_count || 1200)} Reads</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <Clock size={16} color="var(--text-muted)" />
                  <span>Updated {formatDate(novel.updated_at)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <NovelHeroActions novel={novel} firstChapterSlug={firstChapterSlug} />

              {/* Expandable Synopsis */}
              <ExpandableSynopsis text={novel.description} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Content Container: Chapters & Reviews ───────────── */}
      <div className="container-main" style={{ padding: "3rem 1.25rem 5rem" }}>
        {/* Chapters Section */}
        <section>
          <div className="section-title">
            <div className="section-title-left">
              <div className="section-title-bar" />
              <div>
                <h2 className="h2" style={{ margin: 0 }}>Chapter Directory</h2>
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  {chapterList.length} free chapters available
                </span>
              </div>
            </div>
          </div>

          <ChapterList novelSlug={novel.slug} chapters={chapterList} />
        </section>

        {/* Reader Reviews & Comments */}
        <NovelReviews novelSlug={novel.slug} />

        {/* ── Related Novels ─────────────────────────────────── */}
        {relatedNovels && relatedNovels.length > 0 && (
          <section style={{ marginTop: "4rem" }}>
            <div className="section-title">
              <div className="section-title-left">
                <div className="section-title-bar" />
                <h2 className="h3" style={{ margin: 0 }}>You Might Also Enjoy</h2>
              </div>
              <Link href={`/genre/${novel.genre?.slug || ""}`} className="btn-ghost" style={{ fontSize: "0.85rem" }}>
                More {novel.genre?.name} →
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {relatedNovels.map((rel) => (
                <NovelCard key={rel.id} novel={rel as Novel} />
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .novel-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </>
  );
}
