import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatDate, formatViews } from "@/lib/utils";
import { ArticleSchema, BreadcrumbSchema } from "@/components/seo/StructuredData";
import { Eye, Clock, ArrowLeft, Tag, User } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!article) return { title: "Article Not Found" };

  const title = article.meta_title || article.title;
  const description = article.meta_description || article.excerpt || `Read ${article.title} at BlueNov.`;
  const canonical = `https://bluenov.me/articles/${slug}`;
  const ogImage = article.cover_url || "https://bluenov.me/og-default.png";

  return {
    title,
    description,
    authors: article.author ? [{ name: article.author }] : [{ name: "BlueNov" }],
    alternates: { canonical },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      siteName: "BlueNov",
      locale: "en_US",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      publishedTime: article.created_at,
      modifiedTime: article.updated_at,
      authors: article.author ? [article.author] : ["BlueNov"],
      section: article.category || "General",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      label1: "Written by",
      data1: article.author || "BlueNov",
      label2: "Reading time",
      data2: `${Math.max(1, Math.round((article.content?.replace(/<[^>]+>/g, "").split(/\s+/).length || 300) / 200))} min read`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!article) notFound();

  // Related articles
  const { data: related } = await supabase
    .from("articles")
    .select("id, title, slug, cover_url, created_at")
    .eq("is_published", true)
    .eq("category", article.category)
    .neq("id", article.id)
    .limit(3);

  // Increment views
  await supabase.rpc("increment_article_views", { article_id: article.id }).maybeSingle();

  return (
    <>
      <ArticleSchema article={article} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://bluenov.me" },
          { name: "Articles", url: "https://bluenov.me/articles" },
          { name: article.title, url: `https://bluenov.me/articles/${slug}` },
        ]}
      />

      <div className="container-narrow" style={{ padding: "2rem 1.25rem" }}>
        {/* Back */}
        <Link href="/articles" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
          <ArrowLeft size={15} /> Back to Articles
        </Link>

        {/* Article Header */}
        <header style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <span className="badge">
              <Tag size={11} style={{ marginRight: "0.25rem" }} />
              {article.category}
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: "1rem",
            color: "var(--text-primary)",
          }}>
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="body-lg" style={{ color: "var(--text-secondary)", marginBottom: "1.25rem", fontStyle: "italic" }}>
              {article.excerpt}
            </p>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
            {article.author && (
              <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontWeight: 500, color: "var(--accent)", fontSize: "0.9rem" }}>
                <User size={15} /> {article.author}
              </span>
            )}
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
              <Clock size={14} /> {formatDate(article.created_at)}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
              <Eye size={14} /> {formatViews(article.view_count)} views
            </span>
          </div>
        </header>

        {/* Cover Image */}
        {article.cover_url && (
          <div style={{
            borderRadius: "16px", overflow: "hidden",
            marginBottom: "2.5rem",
            boxShadow: "var(--shadow-lg)",
            position: "relative", height: "400px",
          }}>
            <Image src={article.cover_url} alt={article.title} fill style={{ objectFit: "cover" }} priority />
          </div>
        )}

        <div className="divider" />

        {/* Article content */}
        <div
          className="reading-content"
          style={{ paddingTop: "1.5rem" }}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <div className="divider" style={{ marginTop: "2.5rem" }} />

        {/* Related */}
        {related && related.length > 0 && (
          <section style={{ marginTop: "2rem" }}>
            <h2 className="h3" style={{ marginBottom: "1.25rem" }}>Related Articles</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {related.map((r) => (
                <Link key={r.id} href={`/articles/${r.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    padding: "0.75rem",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "10px",
                    transition: "all 0.15s ease",
                  }}>
                    {r.cover_url && (
                      <div style={{ width: "60px", height: "60px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, position: "relative" }}>
                        <Image src={r.cover_url} alt={r.title} fill style={{ objectFit: "cover" }} sizes="60px" />
                      </div>
                    )}
                    <div>
                      <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.2rem" }}>{r.title}</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{formatDate(r.created_at)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
