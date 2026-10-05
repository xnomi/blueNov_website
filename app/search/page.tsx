import { createClient } from "@/lib/supabase/server";
import { NovelCard } from "@/components/novels/NovelCard";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Novel, Article } from "@/types";
import { Search, BookOpen, FileText, Compass, Sparkles } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: "${q}" | BlueNov` : "Search Novels | BlueNov",
    description: q
      ? `Search results for "${q}" — explore free web novels and articles on BlueNov.`
      : "Search thousands of free web novels and chapters on BlueNov.",
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const trimmed = q?.trim() || "";

  if (!trimmed) {
    return (
      <div className="container-main" style={{ padding: "5rem 1.25rem 6rem", textAlign: "center" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            background: "var(--accent-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}
        >
          <Search size={32} color="var(--accent)" />
        </div>
        <h1 className="h2" style={{ marginBottom: "0.5rem" }}>Search BlueNov</h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: "460px", margin: "0 auto 2rem" }}>
          Find your next favorite web novel by title, author name, or genre.
        </p>

        {/* Popular searches suggestions */}
        <div style={{ display: "inline-flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
          {["Fantasy", "Romance", "Arthur Pendragon", "Elena Vance", "Sci-Fi", "Mystery"].map((term) => (
            <Link
              key={term}
              href={`/search?q=${encodeURIComponent(term)}`}
              className="badge"
              style={{ padding: "0.45rem 1rem", fontSize: "0.85rem", textDecoration: "none" }}
            >
              {term}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const searchTerm = `%${trimmed}%`;

  const [{ data: novels }, { data: articles }] = await Promise.all([
    supabase
      .from("novels")
      .select("*, genre:genres(*)")
      .eq("is_published", true)
      .or(`title.ilike.${searchTerm},description.ilike.${searchTerm},author.ilike.${searchTerm}`)
      .limit(16),
    supabase
      .from("articles")
      .select("*")
      .eq("is_published", true)
      .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm},author.ilike.${searchTerm}`)
      .limit(6),
  ]);

  const novelResults = (novels as Novel[]) || [];
  const articleResults = (articles as Article[]) || [];
  const totalResults = novelResults.length + articleResults.length;

  return (
    <div className="container-main" style={{ padding: "3rem 1.25rem 6rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 className="h2" style={{ marginBottom: "0.35rem" }}>
          Search Results for{" "}
          <span style={{ color: "var(--accent)" }}>"{trimmed}"</span>
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          {totalResults} {totalResults === 1 ? "result" : "results"} found across BlueNov
        </p>
      </div>

      {/* Novels Results */}
      {novelResults.length > 0 && (
        <section style={{ marginBottom: "3.5rem" }}>
          <div className="section-title">
            <div className="section-title-left">
              <div className="section-title-bar" />
              <h2 className="h3" style={{ margin: 0 }}>Novels ({novelResults.length})</h2>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {novelResults.map((novel) => (
              <NovelCard key={novel.id} novel={novel} />
            ))}
          </div>
        </section>
      )}

      {/* Articles Results */}
      {articleResults.length > 0 && (
        <section style={{ marginBottom: "3rem" }}>
          <div className="section-title">
            <div className="section-title-left">
              <div className="section-title-bar" />
              <h2 className="h3" style={{ margin: 0 }}>Related Articles ({articleResults.length})</h2>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {articleResults.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {totalResults === 0 && (
        <div className="card" style={{ textAlign: "center", padding: "5rem 1.5rem" }}>
          <Search size={48} color="var(--text-muted)" style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
          <h2 className="h3" style={{ marginBottom: "0.5rem" }}>No Results Found</h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: "420px", margin: "0 auto 1.5rem" }}>
            We couldn't find any novels or articles matching "{trimmed}". Try checking for spelling mistakes or explore our catalog.
          </p>
          <Link href="/novels" className="btn-primary">
            Explore All Novels
          </Link>
        </div>
      )}
    </div>
  );
}
