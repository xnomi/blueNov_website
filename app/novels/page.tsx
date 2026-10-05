import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NovelCard } from "@/components/novels/NovelCard";
import { GenreChips } from "@/components/novels/GenreChips";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { Novel, Genre } from "@/types";
import { BookOpen, Filter, ArrowUpDown, Sparkles, Compass } from "lucide-react";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Free Web Novels — All Genres",
  description:
    "Explore our complete catalog of free web novels. Filter by genre, completion status, or popularity. Read online without registration.",
  alternates: { canonical: `${SITE_URL}/novels` },
};

interface PageProps {
  searchParams: Promise<{
    genre?: string;
    status?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function NovelsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const pageSize = 20;
  const from = (page - 1) * pageSize;

  const supabase = await createClient();

  // Build query
  let query = supabase
    .from("novels")
    .select("*, genre:genres(*)", { count: "exact" })
    .eq("is_published", true);

  if (params.genre) {
    query = query.eq("genre_id", params.genre);
  }

  if (params.status) {
    query = query.eq("status", params.status);
  }

  // Sorting
  if (params.sort === "popular") {
    query = query.order("view_count", { ascending: false });
  } else if (params.sort === "newest") {
    query = query.order("created_at", { ascending: false });
  } else if (params.sort === "az") {
    query = query.order("title", { ascending: true });
  } else {
    // Default: recently updated
    query = query.order("updated_at", { ascending: false });
  }

  const { data: novels, count } = await query.range(from, from + pageSize - 1);

  // Fetch all genres for filter pills
  const { data: genres } = await supabase.from("genres").select("*").order("name");

  const totalPages = Math.ceil((count || 0) / pageSize);

  // Helpers to preserve query string when changing filters
  const getFilterUrl = (overrides: Record<string, string | undefined>) => {
    const current: Record<string, string> = {};
    if (params.genre) current.genre = params.genre;
    if (params.status) current.status = params.status;
    if (params.sort) current.sort = params.sort;

    const merged = { ...current, ...overrides };
    const sp = new URLSearchParams();
    Object.entries(merged).forEach(([k, v]) => {
      if (v) sp.set(k, v);
    });
    return `/novels${sp.toString() ? `?${sp.toString()}` : ""}`;
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Browse Novels", url: `${SITE_URL}/novels` },
        ]}
      />

      {/* Page Header */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-primary) 100%)",
          borderBottom: "1px solid var(--border-color)",
          padding: "2.5rem 0 2rem",
        }}
      >
        <div className="container-main">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "var(--accent-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Compass size={22} color="var(--accent)" />
            </div>
            <h1 className="h2" style={{ margin: 0 }}>Browse Web Novels</h1>
          </div>
          <p style={{ color: "var(--text-secondary)", margin: 0 }}>
            {count || 0} free novels available across Fantasy, Romance, Sci-Fi, Thriller, and more.
          </p>
        </div>
      </div>

      <div className="container-main" style={{ padding: "2rem 1.25rem 5rem" }}>
        {/* Genre Tabs */}
        {genres && genres.length > 0 && (
          <div style={{ marginBottom: "1.5rem" }}>
            <GenreChips genres={genres as Genre[]} selectedSlug={params.genre} baseUrl="/novels" />
          </div>
        )}

        {/* Filter & Sort Bar */}
        <div
          className="card"
          style={{
            padding: "0.85rem 1.25rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
            background: "var(--bg-card)",
          }}
        >
          {/* Status Filters */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)" }}>
              Status:
            </span>
            {[
              { label: "All", value: undefined },
              { label: "Ongoing", value: "ongoing" },
              { label: "Completed", value: "completed" },
            ].map(({ label, value }) => {
              const isActive = params.status === value;
              return (
                <Link
                  key={label}
                  href={getFilterUrl({ status: value, page: undefined })}
                  style={{
                    padding: "0.3rem 0.75rem",
                    borderRadius: "999px",
                    fontSize: "0.8rem",
                    fontWeight: isActive ? 700 : 500,
                    textDecoration: "none",
                    background: isActive ? "var(--accent)" : "var(--bg-secondary)",
                    color: isActive ? "#FFFFFF" : "var(--text-secondary)",
                    border: "1px solid var(--border-color)",
                    transition: "all 0.15s ease",
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Sort Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <ArrowUpDown size={15} color="var(--text-muted)" />
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)" }}>
              Sort:
            </span>
            {[
              { label: "Updated", value: undefined },
              { label: "Popular", value: "popular" },
              { label: "Newest", value: "newest" },
              { label: "A-Z", value: "az" },
            ].map(({ label, value }) => {
              const isActive = params.sort === value;
              return (
                <Link
                  key={label}
                  href={getFilterUrl({ sort: value, page: undefined })}
                  style={{
                    padding: "0.3rem 0.75rem",
                    borderRadius: "999px",
                    fontSize: "0.8rem",
                    fontWeight: isActive ? 700 : 500,
                    textDecoration: "none",
                    background: isActive ? "var(--accent)" : "var(--bg-secondary)",
                    color: isActive ? "#FFFFFF" : "var(--text-secondary)",
                    border: "1px solid var(--border-color)",
                    transition: "all 0.15s ease",
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Novel Grid */}
        {novels && novels.length > 0 ? (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
                gap: "1.5rem",
                marginBottom: "3rem",
              }}
            >
              {novels.map((novel) => (
                <NovelCard key={novel.id} novel={novel as Novel} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.4rem",
                  flexWrap: "wrap",
                }}
              >
                {page > 1 && (
                  <Link
                    href={getFilterUrl({ page: `${page - 1}` })}
                    className="btn-secondary"
                    style={{ fontSize: "0.85rem", padding: "0.45rem 0.85rem" }}
                  >
                    ← Prev
                  </Link>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const isCurrent = page === p;
                  return (
                    <Link
                      key={p}
                      href={getFilterUrl({ page: `${p}` })}
                      style={{
                        width: "38px",
                        height: "38px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "10px",
                        fontWeight: isCurrent ? 700 : 500,
                        fontSize: "0.85rem",
                        textDecoration: "none",
                        background: isCurrent ? "var(--accent)" : "var(--bg-card)",
                        color: isCurrent ? "#FFFFFF" : "var(--text-secondary)",
                        border: "1px solid var(--border-color)",
                        boxShadow: isCurrent ? "0 2px 8px rgba(31, 95, 224, 0.3)" : "none",
                      }}
                    >
                      {p}
                    </Link>
                  );
                })}

                {page < totalPages && (
                  <Link
                    href={getFilterUrl({ page: `${page + 1}` })}
                    className="btn-secondary"
                    style={{ fontSize: "0.85rem", padding: "0.45rem 0.85rem" }}
                  >
                    Next →
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "5rem 1rem" }}>
            <BookOpen size={48} color="var(--text-muted)" style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
            <h2 className="h3" style={{ marginBottom: "0.5rem" }}>No Novels Found</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              No novels match the selected filters. Try clearing your filters or exploring all genres.
            </p>
            <Link href="/novels" className="btn-primary">
              Clear All Filters
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
