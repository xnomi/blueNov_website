import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  BookOpen,
  Eye,
  BookMarked,
  TrendingUp,
  Plus,
  Globe,
  Sparkles,
  Zap,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: novelCount },
    { count: chapterCount },
    { data: popularNovels },
    { data: recentChapters },
  ] = await Promise.all([
    supabase.from("novels").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("chapters").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("novels").select("title, slug, view_count, author").eq("is_published", true).order("view_count", { ascending: false }).limit(6),
    supabase.from("chapters").select("title, slug, chapter_number, created_at, novels!inner(slug, title)").eq("is_published", true).order("created_at", { ascending: false }).limit(6),
  ]);

  return (
    <div>
      {/* Title & Actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="h2" style={{ margin: "0 0 0.25rem" }}>Admin Dashboard</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: 0 }}>
            Overview of novels, published chapters, search index status, and AI readiness.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link href="/admin/chapters/new" className="btn-secondary" style={{ fontSize: "0.85rem", gap: "0.35rem" }}>
            <Plus size={15} /> Add Chapter
          </Link>
          <Link href="/admin/novels/new" className="btn-primary" style={{ fontSize: "0.85rem", gap: "0.35rem" }}>
            <Plus size={15} /> New Novel
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        {/* Novels Metric */}
        <Link href="/admin/novels" style={{ textDecoration: "none" }}>
          <div className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem", transition: "transform 0.15s ease", cursor: "pointer" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(31, 95, 224, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen size={24} color="#1F5FE0" />
            </div>
            <div>
              <p style={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1, margin: "0 0 0.25rem", color: "var(--text-primary)" }}>
                {novelCount || 0}
              </p>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600, margin: 0 }}>
                Published Novels
              </p>
            </div>
          </div>
        </Link>

        {/* Chapters Metric */}
        <Link href="/admin/chapters" style={{ textDecoration: "none" }}>
          <div className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem", transition: "transform 0.15s ease", cursor: "pointer" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookMarked size={24} color="#10B981" />
            </div>
            <div>
              <p style={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1, margin: "0 0 0.25rem", color: "var(--text-primary)" }}>
                {chapterCount || 0}
              </p>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600, margin: 0 }}>
                Live Chapters
              </p>
            </div>
          </div>
        </Link>

        {/* SEO Sitemap Metric */}
        <Link href="/admin/seo" style={{ textDecoration: "none" }}>
          <div className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem", transition: "transform 0.15s ease", cursor: "pointer" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(245, 158, 11, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Globe size={24} color="#F59E0B" />
            </div>
            <div>
              <p style={{ fontSize: "1.25rem", fontWeight: 800, lineHeight: 1, margin: "0 0 0.25rem", color: "var(--text-primary)" }}>
                Active (200 OK)
              </p>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600, margin: 0 }}>
                Sitemap & Fast Indexing
              </p>
            </div>
          </div>
        </Link>

        {/* AGO AI Metric */}
        <Link href="/admin/ago" style={{ textDecoration: "none" }}>
          <div className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem", transition: "transform 0.15s ease", cursor: "pointer" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(139, 92, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={24} color="#8B5CF6" />
            </div>
            <div>
              <p style={{ fontSize: "1.25rem", fontWeight: 800, lineHeight: 1, margin: "0 0 0.25rem", color: "var(--text-primary)" }}>
                Ready (llms.txt)
              </p>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600, margin: 0 }}>
                AGO / AI Search Engines
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* SEO & AGO Fast Indexing Callout Banner */}
      <div
        className="card"
        style={{
          padding: "1.5rem 2rem",
          marginBottom: "2.5rem",
          background: "linear-gradient(135deg, rgba(31, 95, 224, 0.08) 0%, rgba(91, 184, 245, 0.08) 100%)",
          border: "1px solid rgba(31, 95, 224, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.25rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "0.2rem" }}>
              Fast Google Search Console & AI Answer Indexing
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              All novel and chapter URLs are mapped into <code>/sitemap.xml</code> and <code>/llms.txt</code> with high crawl priority.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link href="/admin/seo" className="btn-primary" style={{ fontSize: "0.85rem", gap: "0.4rem" }}>
            <span>SEO Center</span>
            <ArrowRight size={14} />
          </Link>
          <Link href="/admin/ago" className="btn-secondary" style={{ fontSize: "0.85rem", gap: "0.4rem" }}>
            <span>AGO Engine</span>
          </Link>
        </div>
      </div>

      {/* Main Content Two Columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.75rem" }}>
        {/* Popular Novels */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <h2 style={{ fontWeight: 700, fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
              <TrendingUp size={18} color="var(--accent)" /> Most Read Novels
            </h2>
            <Link href="/admin/novels" style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
              View All ({novelCount})
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {popularNovels?.map((n: any) => (
              <div
                key={n.slug}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div>
                  <Link
                    href={`/admin/novels/${n.slug}/edit`}
                    style={{
                      color: "var(--text-primary)",
                      textDecoration: "none",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                    }}
                  >
                    {n.title}
                  </Link>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    by {n.author || "Unknown"}
                  </div>
                </div>

                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: "var(--accent)",
                    background: "rgba(31, 95, 224, 0.08)",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "6px",
                  }}
                >
                  <Eye size={12} /> {n.view_count}
                </span>
              </div>
            ))}
            {(!popularNovels || popularNovels.length === 0) && (
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No novels published yet.</p>
            )}
          </div>
        </div>

        {/* Recent Chapters */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <h2 style={{ fontWeight: 700, fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
              <BookMarked size={18} color="#10B981" /> Latest Chapter Updates
            </h2>
            <Link href="/admin/chapters" style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
              View All ({chapterCount})
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {recentChapters?.map((ch: any) => (
              <div
                key={ch.slug}
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text-primary)" }}>
                    Ch. {ch.chapter_number}: {ch.title}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {ch.novels?.title}
                  </div>
                </div>

                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  {new Date(ch.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
            {(!recentChapters || recentChapters.length === 0) && (
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No chapters added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
