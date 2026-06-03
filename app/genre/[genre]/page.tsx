import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { NovelCard } from "@/components/novels/NovelCard";
import { Novel } from "@/types";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ genre: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { genre } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("genres").select("name, description").eq("slug", genre).single();
  const name = data?.name || genre.charAt(0).toUpperCase() + genre.slice(1);

  return {
    title: `${name} Novels — Read Free Online`,
    description: data?.description || `Read the best ${name} novels online for free at BlueNov. New chapters updated daily.`,
    alternates: { canonical: `https://bluenov.me/genre/${genre}` },
  };
}

export default async function GenrePage({ params, searchParams }: PageProps) {
  const { genre } = await params;
  const sp = await searchParams;
  const page = parseInt(sp.page || "1");
  const pageSize = 24;
  const from = (page - 1) * pageSize;

  const supabase = await createClient();

  const { data: genreData } = await supabase.from("genres").select("*").eq("slug", genre).single();
  if (!genreData) notFound();

  const { data: novels, count } = await supabase
    .from("novels")
    .select("*, genre:genres(*)", { count: "exact" })
    .eq("genre_id", genreData.id)
    .eq("is_published", true)
    .order("view_count", { ascending: false })
    .range(from, from + pageSize - 1);

  const totalPages = Math.ceil((count || 0) / pageSize);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://bluenov.me" },
          { name: "Novels", url: "https://bluenov.me/novels" },
          { name: genreData.name, url: `https://bluenov.me/genre/${genre}` },
        ]}
      />

      <div style={{
        background: "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)",
        borderBottom: "1px solid var(--border-color)",
        padding: "2.5rem 0",
      }}>
        <div className="container-main">
          <h1 className="h2" style={{ marginBottom: "0.5rem" }}>{genreData.name} Novels</h1>
          {genreData.description && (
            <p style={{ color: "var(--text-secondary)", maxWidth: "600px" }}>{genreData.description}</p>
          )}
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
            {count || 0} novels available
          </p>
        </div>
      </div>

      <div className="container-main" style={{ padding: "2rem 1.25rem" }}>
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
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <a
                    key={p}
                    href={`/genre/${genre}?page=${p}`}
                    style={{
                      width: "40px", height: "40px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: "8px", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none",
                      background: page === p ? "var(--accent)" : "var(--bg-card)",
                      color: page === p ? "#fff" : "var(--text-secondary)",
                      border: "1px solid var(--border-color)",
                    }}
                  >{p}</a>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "5rem 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📚</div>
            <h2 className="h3" style={{ marginBottom: "0.5rem" }}>No {genreData.name} Novels Yet</h2>
            <p style={{ color: "var(--text-secondary)" }}>Check back soon for new additions!</p>
          </div>
        )}
      </div>
    </>
  );
}
