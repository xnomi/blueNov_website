import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NovelCard } from "@/components/novels/NovelCard";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { WebSiteSchema } from "@/components/seo/StructuredData";
import { Novel, Article } from "@/types";
import { BookOpen, FileText, TrendingUp, ChevronRight, Sparkles, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BlueNov — Read Free Novels & Articles Online",
  description:
    "Discover and read thousands of free novels and articles online. Fantasy, Romance, Thriller, Sci-Fi and more genres available at BlueNov — completely free.",
  alternates: { canonical: "https://bluenov.me" },
};

async function getHomeData() {
  const supabase = await createClient();

  const [{ data: featuredNovels }, { data: latestNovels }, { data: latestArticles }, { data: genres }] =
    await Promise.all([
      supabase
        .from("novels")
        .select("*, genre:genres(*)")
        .eq("is_published", true)
        .order("view_count", { ascending: false })
        .limit(6),
      supabase
        .from("novels")
        .select("*, genre:genres(*)")
        .eq("is_published", true)
        .order("updated_at", { ascending: false })
        .limit(8),
      supabase
        .from("articles")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(4),
      supabase
        .from("genres")
        .select("*")
        .order("name")
        .limit(12),
    ]);

  return { featuredNovels, latestNovels, latestArticles, genres };
}

const GENRE_COLORS = [
  { bg: "linear-gradient(135deg,#1e40af,#3b82f6)", emoji: "🗡️" },
  { bg: "linear-gradient(135deg,#be185d,#f43f5e)", emoji: "💕" },
  { bg: "linear-gradient(135deg,#7c3aed,#a78bfa)", emoji: "🔮" },
  { bg: "linear-gradient(135deg,#065f46,#10b981)", emoji: "🚀" },
  { bg: "linear-gradient(135deg,#92400e,#f59e0b)", emoji: "🔍" },
  { bg: "linear-gradient(135deg,#1e3a5f,#475569)", emoji: "👻" },
];

export default async function HomePage() {
  const { featuredNovels, latestNovels, latestArticles, genres } = await getHomeData();

  return (
    <>
      <WebSiteSchema />

      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 60%)",
        borderBottom: "1px solid var(--border-color)",
        padding: "4rem 0 3.5rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative orbs */}
        <div style={{
          position: "absolute", top: "-80px", right: "-60px",
          width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", left: "-40px",
          width: "300px", height: "300px",
          background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />

        <div className="container-main" style={{ position: "relative" }}>
          <div style={{ maxWidth: "680px" }}>
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
                Free Stories
              </span>{" "}
              Awaits
            </h1>
            <p className="body-lg" style={{ color: "var(--text-secondary)", marginBottom: "2rem", maxWidth: "540px" }}>
              Discover thousands of novels and articles across every genre. Dive into epic adventures, heartwarming romances, and thrilling mysteries — all completely free.
            </p>
            <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
              <Link href="/novels" className="btn-primary">
                <BookOpen size={17} />
                Browse Novels
              </Link>
              <Link href="/articles" className="btn-ghost">
                <FileText size={17} />
                Read Articles
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container-main" style={{ padding: "3rem 1.25rem" }}>

        {/* Genre Quick Links */}
        {genres && genres.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <div className="section-title">
              <div className="section-title-bar" />
              <h2 className="h3">Browse by Genre</h2>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: "0.75rem",
            }}>
              {genres.map((genre, i) => (
                <Link
                  key={genre.id}
                  href={`/genre/${genre.slug}`}
                  className="genre-card"
                  style={{
                    background: GENRE_COLORS[i % GENRE_COLORS.length].bg,
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>{GENRE_COLORS[i % GENRE_COLORS.length].emoji}</span>
                  <span style={{ color: "#fff", fontWeight: 600, fontSize: "0.875rem" }}>{genre.name}</span>
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
        )}


        {/* Featured / Popular Novels */}
        {featuredNovels && featuredNovels.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <div className="section-title" style={{ justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div className="section-title-bar" />
                <h2 className="h3" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <TrendingUp size={20} color="var(--accent)" />
                  Popular Novels
                </h2>
              </div>
              <Link href="/novels" style={{ color: "var(--accent)", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                View All <ChevronRight size={15} />
              </Link>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "1.25rem",
            }}>
              {featuredNovels.map((novel) => (
                <NovelCard key={novel.id} novel={novel as Novel} />
              ))}
            </div>
          </section>
        )}

        {/* Latest Updates */}
        {latestNovels && latestNovels.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <div className="section-title" style={{ justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div className="section-title-bar" />
                <h2 className="h3" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Clock size={20} color="var(--accent)" />
                  Latest Updates
                </h2>
              </div>
              <Link href="/novels?sort=latest" style={{ color: "var(--accent)", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                View All <ChevronRight size={15} />
              </Link>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "1.25rem",
            }}>
              {latestNovels.map((novel) => (
                <NovelCard key={novel.id} novel={novel as Novel} />
              ))}
            </div>
          </section>
        )}

        {/* Latest Articles */}
        {latestArticles && latestArticles.length > 0 && (
          <section style={{ marginBottom: "2rem" }}>
            <div className="section-title" style={{ justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div className="section-title-bar" />
                <h2 className="h3" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FileText size={20} color="var(--accent)" />
                  Latest Articles
                </h2>
              </div>
              <Link href="/articles" style={{ color: "var(--accent)", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                View All <ChevronRight size={15} />
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {latestArticles.map((article) => (
                <ArticleCard key={article.id} article={article as Article} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {(!featuredNovels || featuredNovels.length === 0) && (!latestArticles || latestArticles.length === 0) && (
          <div style={{ textAlign: "center", padding: "6rem 0" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📚</div>
            <h2 className="h2" style={{ marginBottom: "0.75rem" }}>Stories Coming Soon</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
              The admin is adding amazing content. Check back soon!
            </p>
            <Link href="/admin" className="btn-primary">Go to Admin Panel</Link>
          </div>
        )}
      </div>
    </>
  );
}
