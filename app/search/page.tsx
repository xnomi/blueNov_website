import { createClient } from "@/lib/supabase/server";
import { NovelCard } from "@/components/novels/NovelCard";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Novel, Article } from "@/types";
import { Search } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: "${q}"` : "Search",
    description: q ? `Search results for "${q}" — novels and articles at BlueNov.` : "Search novels and articles on BlueNov.",
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;

  if (!q?.trim()) {
    return (
      <div className="container-main" style={{ padding: "5rem 1.25rem", textAlign: "center" }}>
        <Search size={48} color="var(--text-muted)" style={{ marginBottom: "1rem" }} />
        <h1 className="h2" style={{ marginBottom: "0.5rem" }}>Search BlueNov</h1>
        <p style={{ color: "var(--text-secondary)" }}>Enter a search term in the header to find novels and articles.</p>
      </div>
    );
  }

  const supabase = await createClient();
  const searchTerm = `%${q}%`;

  const [{ data: novels }, { data: articles }] = await Promise.all([
    supabase
      .from("novels")
      .select("*, genre:genres(*)")
      .eq("is_published", true)
      .or(`title.ilike.${searchTerm},description.ilike.${searchTerm},author.ilike.${searchTerm}`)
      .limit(12),
    supabase
      .from("articles")
      .select("*")
      .eq("is_published", true)
      .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm},author.ilike.${searchTerm}`)
      .limit(6),
  ]);

  const totalResults = (novels?.length || 0) + (articles?.length || 0);

  return (
    <div className="container-main" style={{ padding: "2rem 1.25rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="h2" style={{ marginBottom: "0.375rem" }}>
          Search Results for{" "}
          <span style={{ color: "var(--accent)" }}>"{q}"</span>
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>{totalResults} results found</p>
      </div>

      {novels && novels.length > 0 && (
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 className="h3" style={{ marginBottom: "1.25rem" }}>Novels ({novels.length})</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "1.25rem",
          }}>
            {novels.map((novel) => <NovelCard key={novel.id} novel={novel as Novel} />)}
          </div>
        </section>
      )}

      {articles && articles.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <h2 className="h3" style={{ marginBottom: "1.25rem" }}>Articles ({articles.length})</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {articles.map((article) => <ArticleCard key={article.id} article={article as Article} />)}
          </div>
        </section>
      )}

      {totalResults === 0 && (
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <Search size={48} color="var(--text-muted)" style={{ marginBottom: "1rem" }} />
          <h2 className="h3" style={{ marginBottom: "0.5rem" }}>No Results Found</h2>
          <p style={{ color: "var(--text-secondary)" }}>Try different keywords or browse our novels and articles.</p>
        </div>
      )}
    </div>
  );
}
