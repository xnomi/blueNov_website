import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NovelCard } from "@/components/novels/NovelCard";
import { ContinueReadingCard } from "@/components/novels/ContinueReadingCard";
import { GenreChips } from "@/components/novels/GenreChips";
import { WebSiteSchema } from "@/components/seo/StructuredData";
import { Novel, Genre } from "@/types";
import {
  Compass,
  TrendingUp,
  Sparkles,
  BookOpen,
  Clock,
  Flame,
  Award,
  ChevronRight,
  Bookmark,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BlueNov — Read Free Web Novels Online",
  description:
    "Discover thousands of free web novels across Fantasy, Romance, Sci-Fi, and Mystery. Start reading immediately with an immersive bookish reader — no account required.",
  alternates: { canonical: "https://bluenov.me" },
};

async function getHomeData() {
  const supabase = await createClient();

  const [
    { data: featuredNovels },
    { data: trendingNovels },
    { data: newReleases },
    { data: editorsPicks },
    { data: recentlyUpdated },
    { data: genres },
  ] = await Promise.all([
    // Featured (highest views)
    supabase
      .from("novels")
      .select("*, genre:genres(*)")
      .eq("is_published", true)
      .order("view_count", { ascending: false })
      .limit(4),

    // Trending
    supabase
      .from("novels")
      .select("*, genre:genres(*)")
      .eq("is_published", true)
      .order("view_count", { ascending: false })
      .range(4, 11),

    // New Releases
    supabase
      .from("novels")
      .select("*, genre:genres(*)")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(8),

    // Editor's Picks (e.g. status completed or high engagement)
    supabase
      .from("novels")
      .select("*, genre:genres(*)")
      .eq("is_published", true)
      .eq("status", "completed")
      .limit(4),

    // Recently Updated
    supabase
      .from("novels")
      .select("*, genre:genres(*)")
      .eq("is_published", true)
      .order("updated_at", { ascending: false })
      .limit(6),

    // Genres
    supabase.from("genres").select("*").order("name"),
  ]);

  return {
    featuredNovels: (featuredNovels as Novel[]) || [],
    trendingNovels: (trendingNovels as Novel[]) || [],
    newReleases: (newReleases as Novel[]) || [],
    editorsPicks: (editorsPicks as Novel[]) || (featuredNovels as Novel[]) || [],
    recentlyUpdated: (recentlyUpdated as Novel[]) || [],
    genres: (genres as Genre[]) || [],
  };
}

export default async function HomePage() {
  const {
    featuredNovels,
    trendingNovels,
    newReleases,
    editorsPicks,
    recentlyUpdated,
    genres,
  } = await getHomeData();

  return (
    <>
      <WebSiteSchema />

      {/* ── Hero Section ───────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-primary) 100%)",
          borderBottom: "1px solid var(--border-color)",
          padding: "3.5rem 0 3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative ambient gradients */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-50px",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(31, 95, 224, 0.12) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-40px",
            width: "360px",
            height: "360px",
            background: "radial-gradient(circle, rgba(91, 184, 245, 0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div className="container-main" style={{ position: "relative" }}>
          <div style={{ maxWidth: "760px", marginBottom: "2.5rem" }}>
            {/* Pill Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "var(--accent-light)",
                borderRadius: "999px",
                padding: "0.35rem 1rem",
                marginBottom: "1.25rem",
              }}
            >
              <Sparkles size={14} color="var(--accent)" />
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--accent)" }}>
                Premium Web Novel Reader • 100% Free
              </span>
            </div>

            {/* Headline */}
            <h1 className="h1" style={{ marginBottom: "1.1rem" }}>
              Immerse Yourself in Stories{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #1F5FE0 0%, #5BB8F5 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Without Limits
              </span>
            </h1>

            <p
              className="body-lg"
              style={{
                color: "var(--text-secondary)",
                marginBottom: "2rem",
                maxWidth: "620px",
              }}
            >
              Explore rich fantasy epics, heartwarming romances, sci-fi sagas, and detective thrillers. Read with customizable typography, dark & sepia themes, and zero ads in your reading flow.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}>
              <Link href="/novels" className="btn-primary" style={{ padding: "0.75rem 1.75rem" }}>
                <Compass size={18} />
                Browse All Novels
              </Link>
              <Link href="/library" className="btn-secondary" style={{ padding: "0.75rem 1.5rem" }}>
                <Bookmark size={18} />
                My Library
              </Link>
            </div>
          </div>

          {/* Continue Reading Card in Hero */}
          <div style={{ maxWidth: "800px" }}>
            <ContinueReadingCard />
          </div>
        </div>
      </section>

      {/* ── Main Content Container ─────────────────────────── */}
      <div className="container-main" style={{ padding: "3rem 1.25rem 5rem" }}>
        {/* Genre Chips quick navigation */}
        <section style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
              Explore by Genre
            </span>
            <Link
              href="/novels"
              style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--accent)", textDecoration: "none" }}
            >
              View All Filters →
            </Link>
          </div>
          <GenreChips genres={genres} />
        </section>

        {/* ── Featured Novels Showcase ──────────────────────── */}
        {featuredNovels.length > 0 && (
          <section style={{ marginBottom: "3.5rem" }}>
            <div className="section-title">
              <div className="section-title-left">
                <div className="section-title-bar" />
                <div>
                  <h2 className="h2" style={{ margin: 0 }}>Featured Novels</h2>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Top-rated and editor-selected masterworks
                  </span>
                </div>
              </div>
              <Link href="/novels?sort=popular" className="btn-ghost" style={{ fontSize: "0.85rem" }}>
                View All <ChevronRight size={15} />
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {featuredNovels.map((novel, idx) => (
                <NovelCard key={novel.id} novel={novel} size="featured" priority={idx < 2} />
              ))}
            </div>
          </section>
        )}

        {/* ── Trending Novels ───────────────────────────────── */}
        {trendingNovels.length > 0 && (
          <section style={{ marginBottom: "3.5rem" }}>
            <div className="section-title">
              <div className="section-title-left">
                <div className="section-title-bar" />
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Flame size={20} color="#F97316" />
                  <h2 className="h2" style={{ margin: 0 }}>Trending This Week</h2>
                </div>
              </div>
              <Link href="/novels?sort=popular" className="btn-ghost" style={{ fontSize: "0.85rem" }}>
                See All <ChevronRight size={15} />
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {trendingNovels.map((novel) => (
                <NovelCard key={novel.id} novel={novel} />
              ))}
            </div>
          </section>
        )}

        {/* ── New Releases Grid ─────────────────────────────── */}
        {newReleases.length > 0 && (
          <section style={{ marginBottom: "3.5rem" }}>
            <div className="section-title">
              <div className="section-title-left">
                <div className="section-title-bar" />
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Sparkles size={20} color="var(--accent)" />
                  <h2 className="h2" style={{ margin: 0 }}>New Releases</h2>
                </div>
              </div>
              <Link href="/novels" className="btn-ghost" style={{ fontSize: "0.85rem" }}>
                All New Releases <ChevronRight size={15} />
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {newReleases.map((novel) => (
                <NovelCard key={novel.id} novel={novel} />
              ))}
            </div>
          </section>
        )}

        {/* ── Two Column: Editor's Picks & Recently Updated ──── */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "2.5rem",
          }}
          className="home-split-grid"
        >
          {/* Editor's Picks */}
          <div>
            <div className="section-title">
              <div className="section-title-left">
                <div className="section-title-bar" />
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Award size={20} color="#F59E0B" />
                  <h2 className="h3" style={{ margin: 0 }}>Editor's Picks</h2>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {editorsPicks.slice(0, 4).map((novel) => (
                <NovelCard key={novel.id} novel={novel} size="compact" />
              ))}
            </div>
          </div>

          {/* Recently Updated Chapter Feed */}
          <div>
            <div className="section-title">
              <div className="section-title-left">
                <div className="section-title-bar" />
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Clock size={20} color="var(--accent)" />
                  <h2 className="h3" style={{ margin: 0 }}>Recently Updated</h2>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {recentlyUpdated.map((novel) => (
                <Link
                  key={novel.id}
                  href={`/novels/${novel.slug}`}
                  className="card"
                  style={{
                    padding: "0.85rem 1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <div style={{ minWidth: 0, paddingRight: "0.75rem" }}>
                    <h3
                      style={{
                        fontSize: "0.92rem",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        margin: "0 0 0.2rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {novel.title}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {novel.genre && (
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            color: "var(--accent)",
                          }}
                        >
                          {novel.genre.name}
                        </span>
                      )}
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                        by {novel.author || "Unknown"}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        padding: "0.2rem 0.55rem",
                        borderRadius: "8px",
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-color)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Read Ch. 1+
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .home-split-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
