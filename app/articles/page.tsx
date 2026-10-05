import { createClient } from "@/lib/supabase/server";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Article } from "@/types";
import { buildMetadata } from "@/lib/seo";
import { BreadcrumbSchema, CollectionPageSchema } from "@/components/seo/StructuredData";
import { FileText } from "lucide-react";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Articles — Reviews, News & Writing Tips",
  description:
    "Browse free articles on BlueNov — in-depth book reviews, writing tips, literary news, and recommendations. Updated regularly.",
  path: "/articles",
});

interface PageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

const CATEGORIES = ["All", "Reviews", "News", "Recommendations", "Writing Tips", "General"];

export default async function ArticlesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const pageSize = 12;
  const from = (page - 1) * pageSize;

  const supabase = await createClient();

  let query = supabase
    .from("articles")
    .select("*", { count: "exact" })
    .eq("is_published", true);

  if (params.category && params.category !== "All") {
    query = query.eq("category", params.category);
  }

  const { data: articles, count } = await query
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);

  const totalPages = Math.ceil((count || 0) / pageSize);
  const featured = articles?.[0];
  const rest = articles?.slice(1) || [];

  return (
    <>
      <CollectionPageSchema
        name="Articles — Reviews, News & Writing Tips"
        description="Browse free articles on BlueNov — book reviews, writing tips, literary news, and recommendations."
        url="https://bluenov.me/articles"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://bluenov.me" },
          { name: "Articles", url: "https://bluenov.me/articles" },
        ]}
      />

      <div style={{
        background: "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)",
        borderBottom: "1px solid var(--border-color)",
        padding: "2.5rem 0",
      }}>
        <div className="container-main">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <FileText size={28} color="var(--accent)" />
            <h1 className="h2">Articles</h1>
          </div>
          <p style={{ color: "var(--text-secondary)" }}>{count || 0} articles — reviews, news, and more</p>
        </div>
      </div>

      <div className="container-main" style={{ padding: "2rem 1.25rem" }}>
        {/* Banner to Novel Reading Platform */}
        <div
          className="card"
          style={{
            padding: "1.25rem 1.5rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.25rem",
            background: "linear-gradient(135deg, var(--accent-light) 0%, var(--bg-card) 100%)",
            border: "1px solid var(--accent)",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "0 0 0.25rem", color: "var(--text-primary)" }}>
              Explore Our Free Web Novel Catalog
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
              Read over 80+ full-length web novels with our customizable distraction-free reader.
            </p>
          </div>
          <Link href="/novels" className="btn-primary" style={{ fontSize: "0.85rem", padding: "0.55rem 1.25rem" }}>
            Browse Novels →
          </Link>
        </div>
        {/* Category tabs */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={cat === "All" ? "/articles" : `/articles?category=${cat}`}
              style={{
                padding: "0.3rem 0.875rem",
                borderRadius: "999px",
                fontSize: "0.8rem",
                fontWeight: 600,
                textDecoration: "none",
                background: (params.category || "All") === cat ? "var(--accent)" : "var(--bg-card)",
                color: (params.category || "All") === cat ? "#fff" : "var(--text-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Featured article */}
        {featured && page === 1 && (
          <div style={{ marginBottom: "2rem" }}>
            <ArticleCard article={featured as Article} featured />
          </div>
        )}

        {/* Grid */}
        {rest.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.25rem",
            marginBottom: "2rem",
          }}>
            {rest.map((article) => (
              <ArticleCard key={article.id} article={article as Article} />
            ))}
          </div>
        )}

        {(!articles || articles.length === 0) && (
          <div style={{ textAlign: "center", padding: "5rem 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📰</div>
            <h2 className="h3" style={{ marginBottom: "0.5rem" }}>No Articles Yet</h2>
            <p style={{ color: "var(--text-secondary)" }}>Check back soon for new articles.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/articles?page=${p}${params.category ? `&category=${params.category}` : ""}`}
                style={{
                  width: "40px", height: "40px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: "8px", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none",
                  background: page === p ? "var(--accent)" : "var(--bg-card)",
                  color: page === p ? "#fff" : "var(--text-secondary)",
                  border: "1px solid var(--border-color)",
                }}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
