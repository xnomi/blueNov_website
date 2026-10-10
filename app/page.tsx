import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NovelCard } from "@/components/novels/NovelCard";
import { GenreChips } from "@/components/novels/GenreChips";
import { WebSiteSchema } from "@/components/seo/StructuredData";
import { DynamicHeroSection } from "@/components/layout/DynamicHeroSection";
import { getHeroSettings } from "@/lib/heroSettings";
import { Novel, Genre } from "@/types";
import {
  Sparkles,
  Flame,
  ChevronRight,
  Award,
  Clock,
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
  const heroSettings = await getHeroSettings();
  const featuredIds = heroSettings.featured_novel_ids || [];

  const [
    featuredNovelsResult,
    { data: trendingNovels },
    { data: newReleases },
    { data: editorsPicks },
    { data: recentlyUpdated },
    { data: genres },
  ] = await Promise.all([
    // 1. Featured Novels: Admin curated if set, else highest views
    featuredIds.length > 0
      ? supabase
          .from("novels")
          .select("*, genre:genres(*)")
          .in("id", featuredIds)
          .eq("is_published", true)
      : supabase
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

    // Editor's Picks (status completed or high engagement)
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

  let finalFeatured: Novel[] = (featuredNovelsResult.data as Novel[]) || [];
  if (featuredIds.length > 0 && finalFeatured.length > 0) {
    const orderMap = new Map<string, number>(featuredIds.map((id: string, index: number) => [id, index]));
    finalFeatured.sort((a, b) => {
      const posA = orderMap.get(a.id) ?? 999;
      const posB = orderMap.get(b.id) ?? 999;
      return posA - posB;
    });
  }

  // If featured novels result was empty (e.g. invalid IDs), fallback to top viewed
  if (finalFeatured.length === 0) {
    const { data: fallbackFeatured } = await supabase
      .from("novels")
      .select("*, genre:genres(*)")
      .eq("is_published", true)
      .order("view_count", { ascending: false })
      .limit(4);
    finalFeatured = (fallbackFeatured as Novel[]) || [];
  }

  return {
    heroSettings,
    featuredNovels: finalFeatured,
    trendingNovels: (trendingNovels as Novel[]) || [],
    newReleases: (newReleases as Novel[]) || [],
    editorsPicks: (editorsPicks as Novel[]) || finalFeatured,
    recentlyUpdated: (recentlyUpdated as Novel[]) || [],
    genres: (genres as Genre[]) || [],
  };
}

export default async function HomePage() {
  const {
    heroSettings,
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

      {/* ── Dynamic Hero Section (Customizable via Admin) ── */}
      <DynamicHeroSection settings={heroSettings} featuredNovel={featuredNovels[0]} />

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
        <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
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
