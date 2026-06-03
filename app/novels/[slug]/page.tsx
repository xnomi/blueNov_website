import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatDate, formatViews, statusLabel } from "@/lib/utils";
import { BookSchema, BreadcrumbSchema } from "@/components/seo/StructuredData";
import { Eye, BookOpen, Clock, ChevronRight, User, Tag, ArrowLeft } from "lucide-react";
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
    .eq("is_published", true)
    .single();

  if (!novel) return { title: "Novel Not Found" };

  return {
    title: `${novel.title} — Read Online Free`,
    description: novel.meta_description || novel.description || `Read ${novel.title} online for free at BlueNov.`,
    alternates: { canonical: `https://bluenov.me/novels/${slug}` },
    openGraph: {
      title: novel.meta_title || novel.title,
      description: novel.meta_description || novel.description,
      images: novel.cover_url ? [{ url: novel.cover_url }] : [],
      type: "book",
    },
  };
}

export default async function NovelDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: novel } = await supabase
    .from("novels")
    .select("*, genre:genres(*)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!novel) notFound();

  const { data: chapters } = await supabase
    .from("chapters")
    .select("id, title, slug, chapter_number, view_count, created_at, updated_at")
    .eq("novel_id", novel.id)
    .eq("is_published", true)
    .order("chapter_number");

  // Increment view count
  await supabase.rpc("increment_novel_views", { novel_id: novel.id }).maybeSingle();

  const firstChapter = chapters?.[0];

  return (
    <>
      <BookSchema novel={novel} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://bluenov.me" },
          { name: "Novels", url: "https://bluenov.me/novels" },
          { name: novel.title, url: `https://bluenov.me/novels/${slug}` },
        ]}
      />

      <div className="container-main" style={{ padding: "2rem 1.25rem" }}>
        {/* Back */}
        <Link href="/novels" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
          <ArrowLeft size={15} /> Back to Novels
        </Link>

        {/* Novel Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: "2.5rem",
          marginBottom: "2.5rem",
          alignItems: "start",
        }} className="novel-hero-grid">
          {/* Cover */}
          <div style={{
            borderRadius: "12px", overflow: "hidden",
            boxShadow: "var(--shadow-lg)",
            aspectRatio: "2/3", position: "relative",
          }}>
            {novel.cover_url ? (
              <Image src={novel.cover_url} alt={`${novel.title} cover`} fill style={{ objectFit: "cover" }} priority />
            ) : (
              <div className="cover-placeholder" style={{ width: "100%", height: "300px" }}>
                {novel.title.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="h2" style={{ marginBottom: "0.5rem" }}>{novel.title}</h1>

            {novel.author && (
              <p style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--accent)", fontWeight: 500, marginBottom: "0.875rem" }}>
                <User size={15} /> {novel.author}
              </p>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <span className={`badge status-${novel.status}`}>{statusLabel(novel.status)}</span>
              {novel.genre && (
                <Link href={`/genre/${novel.genre.slug}`}>
                  <span className="badge" style={{ cursor: "pointer" }}>
                    <Tag size={11} style={{ marginRight: "0.25rem" }} />
                    {novel.genre.name}
                  </span>
                </Link>
              )}
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem" }}>
              {[
                { icon: <Eye size={16} />, value: formatViews(novel.view_count), label: "Views" },
                { icon: <BookOpen size={16} />, value: chapters?.length || 0, label: "Chapters" },
                { icon: <Clock size={16} />, value: formatDate(novel.updated_at), label: "Updated" },
              ].map(({ icon, value, label }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--accent)", justifyContent: "center", marginBottom: "0.2rem" }}>
                    {icon}
                    <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>{value}</span>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{label}</span>
                </div>
              ))}
            </div>

            {novel.description && (
              <p className="body" style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.75, maxWidth: "600px" }}>
                {novel.description}
              </p>
            )}

            {firstChapter && (
              <Link
                href={`/novels/${novel.slug}/${firstChapter.slug}`}
                className="btn-primary"
                style={{ fontSize: "1rem", padding: "0.75rem 2rem" }}
              >
                <BookOpen size={18} />
                Start Reading
              </Link>
            )}
          </div>
        </div>

        <div className="divider" />

        {/* Chapter List */}
        <section>
          <h2 className="h3" style={{ marginBottom: "1.25rem" }}>
            Chapters ({chapters?.length || 0})
          </h2>

          {chapters && chapters.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {chapters.map((ch) => (
                <Link
                  key={ch.id}
                  href={`/novels/${novel.slug}/${ch.slug}`}
                  className="chapter-row"
                >
                  <div style={{
                    display: "flex", alignItems: "center", gap: "0.875rem", flex: 1, minWidth: 0,
                  }}>
                    <span style={{
                      flexShrink: 0,
                      width: "36px", height: "36px",
                      background: "var(--accent-light)",
                      borderRadius: "8px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)",
                    }}>
                      {ch.chapter_number}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 500, color: "var(--text-primary)", marginBottom: "0.15rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {ch.title}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {formatDate(ch.created_at)}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", flexShrink: 0 }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <Eye size={12} /> {formatViews(ch.view_count)}
                    </span>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "3rem", background: "var(--bg-card)", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              <BookOpen size={40} color="var(--text-muted)" style={{ marginBottom: "0.75rem" }} />
              <p style={{ color: "var(--text-secondary)" }}>No chapters published yet. Check back soon!</p>
            </div>
          )}
        </section>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .novel-hero-grid { grid-template-columns: 1fr !important; }
        }
        .chapter-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          transition: all 0.15s ease;
          cursor: pointer;
          gap: 1rem;
          text-decoration: none;
        }
        .chapter-row:hover {
          border-color: var(--accent);
          background: var(--bg-card-hover);
        }
      `}</style>
    </>
  );
}
