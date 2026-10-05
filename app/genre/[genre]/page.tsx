import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { NovelCard } from "@/components/novels/NovelCard";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { Novel, Genre } from "@/types";
import { Compass, BookOpen, ArrowUpDown } from "lucide-react";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ genre: string }>;
  searchParams: Promise<{ sort?: string; status?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { genre: genreSlug } = await params;
  const supabase = await createClient();

  const { data: genre } = await supabase
    .from("genres")
    .select("name, description")
    .eq("slug", genreSlug)
    .single();

  if (!genre) return { title: "Genre Not Found" };

  return {
    title: `Best Free ${genre.name} Web Novels — Read Online | ${SITE_NAME}`,
    description:
      genre.description ||
      `Explore top-rated free ${genre.name} web novels online at ${SITE_NAME}. No registration required.`,
    alternates: { canonical: `${SITE_URL}/genre/${genreSlug}` },
  };
}

export default async function GenreDetailPage({ params, searchParams }: PageProps) {
  const { genre: genreSlug } = await params;
  const { sort, status } = await searchParams;
  const supabase = await createClient();

  // 1. Fetch Genre
  const { data: genre } = await supabase
    .from("genres")
    .select("*")
    .eq("slug", genreSlug)
    .single();

  if (!genre) notFound();

  // 2. Fetch Novels in this genre
  let query = supabase
    .from("novels")
    .select("*, genre:genres(*)")
    .eq("genre_id", genre.id)
    .eq("is_published", true);

  if (status) {
    query = query.eq("status", status);
  }

  if (sort === "popular") {
    query = query.order("view_count", { ascending: false });
  } else if (sort === "newest") {
    query = query.order("created_at", { ascending: false });
  } else if (sort === "az") {
    query = query.order("title", { ascending: true });
  } else {
    query = query.order("updated_at", { ascending: false });
  }

  const { data: novels } = await query;
  const novelList = (novels as Novel[]) || [];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Novels", url: `${SITE_URL}/novels` },
          { name: genre.name, url: `${SITE_URL}/genre/${genre.slug}` },
        ]}
      />

      {/* Genre Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-primary) 100%)",
          borderBottom: "1px solid var(--border-color)",
          padding: "3rem 0 2.5rem",
        }}
      >
        <div className="container-main">
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--accent)", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>
            <Compass size={16} /> Genre Directory
          </div>
          <h1 className="h1" style={{ marginBottom: "0.75rem" }}>
            {genre.name} Novels
          </h1>
          {genre.description && (
            <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: 0, fontSize: "1.05rem" }}>
              {genre.description}
            </p>
          )}
        </div>
      </div>

      <div className="container-main" style={{ padding: "2rem 1.25rem 5rem" }}>
        {/* Filter bar */}
        <div
          className="card"
          style={{
            padding: "0.75rem 1.25rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Showing {novelList.length} {genre.name} {novelList.length === 1 ? "novel" : "novels"}
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)" }}>
              Sort:
            </span>
            {[
              { label: "Updated", val: "" },
              { label: "Popular", val: "popular" },
              { label: "Newest", val: "newest" },
            ].map(({ label, val }) => {
              const isActive = (sort || "") === val;
              return (
                <Link
                  key={label}
                  href={`/genre/${genre.slug}${val ? `?sort=${val}` : ""}`}
                  style={{
                    padding: "0.25rem 0.65rem",
                    borderRadius: "999px",
                    fontSize: "0.78rem",
                    fontWeight: isActive ? 700 : 500,
                    textDecoration: "none",
                    background: isActive ? "var(--accent)" : "var(--bg-secondary)",
                    color: isActive ? "#FFFFFF" : "var(--text-secondary)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Novels Grid */}
        {novelList.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {novelList.map((novel) => (
              <NovelCard key={novel.id} novel={novel} />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: "center", padding: "4rem 1.5rem" }}>
            <BookOpen size={48} color="var(--text-muted)" style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
            <h2 className="h3">No Novels in this Genre Yet</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Check back soon as our library updates daily.
            </p>
            <Link href="/novels" className="btn-primary">
              Browse All Novels
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
