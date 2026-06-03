import { createClient } from "@/lib/supabase/server";
import { NovelCard } from "@/components/novels/NovelCard";
import { Novel } from "@/types";
import { buildMetadata } from "@/lib/seo";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { BookOpen, Filter } from "lucide-react";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Read Free Novels Online",
  description:
    "Browse thousands of free novels across all genres. Start reading instantly — no account needed. Updated daily with new chapters.",
  path: "/novels",
});

interface PageProps {
  searchParams: Promise<{ genre?: string; status?: string; sort?: string; page?: string }>;
}

export default async function NovelsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const pageSize = 24;
  const from = (page - 1) * pageSize;

  const supabase = await createClient();

  let query = supabase
    .from("novels")
    .select("*, genre:genres(*)", { count: "exact" })
    .eq("is_published", true);

  if (params.genre) query = query.eq("genre_id", params.genre);
  if (params.status) query = query.eq("status", params.status);

  if (params.sort === "popular") query = query.order("view_count", { ascending: false });
  else if (params.sort === "az") query = query.order("title");
  else query = query.order("updated_at", { ascending: false });

  const { data: novels, count } = await query.range(from, from + pageSize - 1);

  const { data: genres } = await supabase.from("genres").select("*").order("name");

  const totalPages = Math.ceil((count || 0) / pageSize);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://bluenov.me" },
          { name: "Novels", url: "https://bluenov.me/novels" },
        ]}
      />

      {/* Page Header */}
      <div style={{
        background: "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)",
        borderBottom: "1px solid var(--border-color)",
        padding: "2.5rem 0",
      }}>
        <div className="container-main">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <BookOpen size={28} color="var(--accent)" />
            <h1 className="h2">All Novels</h1>
          </div>
          <p style={{ color: "var(--text-secondary)" }}>
            {count || 0} novels available — read free, no account needed
          </p>
        </div>
      </div>

      <div className="container-main" style={{ padding: "2rem 1.25rem" }}>
        {/* Filters */}
        <div style={{
          display: "flex", gap: "0.625rem", flexWrap: "wrap",
          padding: "1rem",
          background: "var(--bg-card)",
          borderRadius: "12px",
          border: "1px solid var(--border-color)",
          marginBottom: "2rem",
          alignItems: "center",
        }}>
          <Filter size={16} color="var(--text-muted)" />
          <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)" }}>Sort:</span>
          {[
            { label: "Latest", value: "" },
            { label: "Popular", value: "popular" },
            { label: "A-Z", value: "az" },
          ].map(({ label, value }) => (
            <Link
              key={value}
              href={`/novels?sort=${value}`}
              style={{
                padding: "0.3rem 0.75rem",
                borderRadius: "999px",
                fontSize: "0.8rem",
                fontWeight: 500,
                textDecoration: "none",
                background: (params.sort || "") === value ? "var(--accent)" : "var(--bg-secondary)",
                color: (params.sort || "") === value ? "#fff" : "var(--text-secondary)",
                border: "1px solid var(--border-color)",
                transition: "all 0.15s ease",
              }}
            >
              {label}
            </Link>
          ))}

          <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)", marginLeft: "0.5rem" }}>Status:</span>
          {[
            { label: "All", value: "" },
            { label: "Ongoing", value: "ongoing" },
            { label: "Completed", value: "completed" },
          ].map(({ label, value }) => (
            <Link
              key={value}
              href={value ? `/novels?status=${value}` : "/novels"}
              style={{
                padding: "0.3rem 0.75rem",
                borderRadius: "999px",
                fontSize: "0.8rem",
                fontWeight: 500,
                textDecoration: "none",
                background: (params.status || "") === value ? "var(--accent)" : "var(--bg-secondary)",
                color: (params.status || "") === value ? "#fff" : "var(--text-secondary)",
                border: "1px solid var(--border-color)",
                transition: "all 0.15s ease",
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Genre tabs */}
        {genres && genres.length > 0 && (
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <Link
              href="/novels"
              style={{
                padding: "0.3rem 0.875rem",
                borderRadius: "999px",
                fontSize: "0.8rem",
                fontWeight: 600,
                textDecoration: "none",
                background: !params.genre ? "var(--accent)" : "var(--bg-card)",
                color: !params.genre ? "#fff" : "var(--text-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              All Genres
            </Link>
            {genres.map((g) => (
              <Link
                key={g.id}
                href={`/novels?genre=${g.id}`}
                style={{
                  padding: "0.3rem 0.875rem",
                  borderRadius: "999px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  background: params.genre === g.id ? "var(--accent)" : "var(--bg-card)",
                  color: params.genre === g.id ? "#fff" : "var(--text-secondary)",
                  border: "1px solid var(--border-color)",
                }}
              >
                {g.name}
              </Link>
            ))}
          </div>
        )}

        {/* Grid */}
        {novels && novels.length > 0 ? (
          <>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "1.25rem",
              marginBottom: "2rem",
            }}>
              {novels.map((novel) => (
                <NovelCard key={novel.id} novel={novel as Novel} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/novels?page=${p}${params.sort ? `&sort=${params.sort}` : ""}${params.status ? `&status=${params.status}` : ""}`}
                    style={{
                      width: "40px", height: "40px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      textDecoration: "none",
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
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "5rem 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📚</div>
            <h2 className="h3" style={{ marginBottom: "0.5rem" }}>No Novels Found</h2>
            <p style={{ color: "var(--text-secondary)" }}>Try a different filter or check back soon.</p>
          </div>
        )}
      </div>
    </>
  );
}
