import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { WebSiteSchema } from "@/components/seo/StructuredData";
import { Article } from "@/types";
import { FileText, TrendingUp, ChevronRight, Sparkles, Clock, Pen, BookOpen, Newspaper } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BlueNov — Free Articles & Insights Online",
  description:
    "Discover and read free in-depth articles, book reviews, writing tips, and literary news at BlueNov — completely free, no account required.",
  alternates: { canonical: "https://bluenov.me" },
};

const CATEGORIES = [
  { label: "Reviews", icon: BookOpen, color: "linear-gradient(135deg,#1e40af,#3b82f6)", emoji: "⭐" },
  { label: "News", icon: Newspaper, color: "linear-gradient(135deg,#be185d,#f43f5e)", emoji: "📰" },
  { label: "Writing Tips", icon: Pen, color: "linear-gradient(135deg,#7c3aed,#a78bfa)", emoji: "✍️" },
  { label: "Recommendations", icon: TrendingUp, color: "linear-gradient(135deg,#065f46,#10b981)", emoji: "📚" },
  { label: "General", icon: FileText, color: "linear-gradient(135deg,#92400e,#f59e0b)", emoji: "💡" },
];

async function getHomeData() {
  const supabase = await createClient();

  const [{ data: featuredArticles }, { data: latestArticles }, { data: reviewArticles }] =
    await Promise.all([
      supabase
        .from("articles")
        .select("*")
        .eq("is_published", true)
        .order("view_count", { ascending: false })
        .limit(1),
      supabase
        .from("articles")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("articles")
        .select("*")
        .eq("is_published", true)
        .eq("category", "Reviews")
        .order("created_at", { ascending: false })
        .limit(4),
    ]);

  return { featuredArticle: featuredArticles?.[0] || null, latestArticles, reviewArticles };
}

export default async function HomePage() {
  const { featuredArticle, latestArticles, reviewArticles } = await getHomeData();

  return (
    <>
      <WebSiteSchema />

      {/* ── Hero ────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 60%)",
        borderBottom: "1px solid var(--border-color)",
        padding: "4.5rem 0 4rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative orbs */}
        <div style={{
          position: "absolute", top: "-80px", right: "-60px",
          width: "420px", height: "420px",
          background: "radial-gradient(circle, rgba(59,130,246,0.13) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", left: "-40px",
          width: "300px", height: "300px",
          background: "radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />

        <div className="container-main" style={{ position: "relative" }}>
          <div style={{ maxWidth: "700px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--accent-light)", borderRadius: "999px", padding: "0.3rem 1rem", marginBottom: "1.25rem" }}>
              <Sparkles size={14} color="var(--accent)" />
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--accent)" }}>100% Free — No Account Required</span>
            </div>
            <h1 className="h1" style={{ marginBottom: "1.125rem" }}>
              Your World of{" "}
              <span style={{
                background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Free Articles
              </span>{" "}
              & Insights
            </h1>
            <p className="body-lg" style={{ color: "var(--text-secondary)", marginBottom: "2rem", maxWidth: "560px" }}>
              In-depth reviews, writing tips, literary news, and recommendations — curated for readers and writers everywhere. All completely free.
            </p>
            <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
              <Link href="/articles" className="btn-primary">
                <FileText size={17} />
                Browse Articles
              </Link>
              <Link href="/articles?category=Reviews" className="btn-ghost">
                <BookOpen size={17} />
                Read Reviews
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container-main" style={{ padding: "3rem 1.25rem" }}>

        {/* ── Category Quick Links ───────────────────────── */}
        <section style={{ marginBottom: "3rem" }}>
          <div className="section-title">
            <div className="section-title-bar" />
            <h2 className="h3">Browse by Category</h2>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "0.75rem",
          }}>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={`/articles?category=${cat.label}`}
                className="genre-card"
                style={{ background: cat.color }}
              >
                <span style={{ fontSize: "1.5rem" }}>{cat.emoji}</span>
                <span style={{ color: "#fff", fontWeight: 600, fontSize: "0.875rem" }}>{cat.label}</span>
              </Link>
            ))}
          </div>
          <style>{`
            .genre-card {
              border-radius: 12px;
              padding: 1.25rem 1rem;
              text-decoration: none;
              text-align: center;
              transition: transform 0.2s ease, box-shadow 0.2s ease;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 0.375rem;
            }
            .genre-card:hover {
              transform: translateY(-3px);
              box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            }
          `}</style>
        </section>

        {/* ── Featured Article ──────────────────────────── */}
        {featuredArticle && (
          <section style={{ marginBottom: "3rem" }}>
            <div className="section-title" style={{ justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div className="section-title-bar" />
                <h2 className="h3" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <TrendingUp size={20} color="var(--accent)" />
                  Featured Article
                </h2>
              </div>
              <Link href="/articles" style={{ color: "var(--accent)", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                View All <ChevronRight size={15} />
              </Link>
            </div>
            <ArticleCard article={featuredArticle as Article} featured />
          </section>
        )}

        {/* ── Latest Articles ───────────────────────────── */}
        {latestArticles && latestArticles.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <div className="section-title" style={{ justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div className="section-title-bar" />
                <h2 className="h3" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Clock size={20} color="var(--accent)" />
                  Latest Articles
                </h2>
              </div>
              <Link href="/articles?sort=latest" style={{ color: "var(--accent)", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                View All <ChevronRight size={15} />
              </Link>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.25rem",
            }}>
              {latestArticles.map((article) => (
                <ArticleCard key={article.id} article={article as Article} />
              ))}
            </div>
          </section>
        )}

        {/* ── Reviews Section ───────────────────────────── */}
        {reviewArticles && reviewArticles.length > 0 && (
          <section style={{ marginBottom: "2rem" }}>
            <div className="section-title" style={{ justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div className="section-title-bar" />
                <h2 className="h3" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <BookOpen size={20} color="var(--accent)" />
                  Latest Reviews
                </h2>
              </div>
              <Link href="/articles?category=Reviews" style={{ color: "var(--accent)", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                View All <ChevronRight size={15} />
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {reviewArticles.map((article) => (
                <ArticleCard key={article.id} article={article as Article} />
              ))}
            </div>
          </section>
        )}

        {/* ── Empty state ───────────────────────────────── */}
        {(!latestArticles || latestArticles.length === 0) && (
          <div style={{ textAlign: "center", padding: "6rem 0" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📰</div>
            <h2 className="h2" style={{ marginBottom: "0.75rem" }}>Articles Coming Soon</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
              The team is crafting amazing content. Check back soon!
            </p>
            <Link href="/admin" className="btn-primary">Go to Admin Panel</Link>
          </div>
        )}
      </div>
    </>
  );
}
