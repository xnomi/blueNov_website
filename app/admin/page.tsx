import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { BookOpen, FileText, Eye, BookMarked, TrendingUp, Plus } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: novelCount },
    { count: chapterCount },
    { count: articleCount },
    { data: popularNovels },
    { data: recentChapters },
    { data: recentArticles },
  ] = await Promise.all([
    supabase.from("novels").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("chapters").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("articles").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("novels").select("title, slug, view_count").eq("is_published", true).order("view_count", { ascending: false }).limit(5),
    supabase.from("chapters").select("title, slug, chapter_number, created_at, novels!inner(slug, title)").eq("is_published", true).order("created_at", { ascending: false }).limit(5),
    supabase.from("articles").select("title, slug, created_at, view_count").eq("is_published", true).order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: "Published Novels", value: novelCount || 0, icon: BookOpen, color: "#3b82f6", href: "/admin/novels" },
    { label: "Total Chapters", value: chapterCount || 0, icon: BookMarked, color: "#10b981", href: "/admin/chapters" },
    { label: "Articles", value: articleCount || 0, icon: FileText, color: "#f59e0b", href: "/admin/articles" },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <h1 className="h2">Dashboard</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Welcome back to BlueNov Admin</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem", marginBottom: "2.5rem" }}>
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} style={{ textDecoration: "none" }}>
            <div style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              padding: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              transition: "all 0.2s ease",
              cursor: "pointer",
            }}>
              <div style={{
                width: "48px", height: "48px",
                background: `${color}20`,
                borderRadius: "12px",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Icon size={24} color={color} />
              </div>
              <div>
                <p style={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1, marginBottom: "0.25rem" }}>{value}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>{label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Popular Novels */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <h2 style={{ fontWeight: 700, fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <TrendingUp size={17} color="var(--accent)" /> Top Novels
            </h2>
            <Link href="/admin/novels/new" className="btn-primary" style={{ padding: "0.3rem 0.75rem", fontSize: "0.8rem" }}>
              <Plus size={14} /> Add
            </Link>
          </div>
          {popularNovels?.map((n: any) => (
            <div key={n.slug} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid var(--border-color)" }}>
              <Link href={`/admin/novels/${n.slug}/edit`} style={{ color: "var(--text-primary)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500 }}>
                {n.title}
              </Link>
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                <Eye size={12} /> {n.view_count}
              </span>
            </div>
          ))}
          {(!popularNovels || popularNovels.length === 0) && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No novels yet.</p>
          )}
        </div>

        {/* Recent Chapters */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <h2 style={{ fontWeight: 700, fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <BookMarked size={17} color="#10b981" /> Recent Chapters
            </h2>
            <Link href="/admin/chapters/new" className="btn-primary" style={{ padding: "0.3rem 0.75rem", fontSize: "0.8rem" }}>
              <Plus size={14} /> Add
            </Link>
          </div>
          {recentChapters?.map((ch: any) => (
            <div key={ch.slug} style={{ padding: "0.5rem 0", borderBottom: "1px solid var(--border-color)" }}>
              <p style={{ fontWeight: 500, fontSize: "0.875rem", color: "var(--text-primary)" }}>Ch. {ch.chapter_number}: {ch.title}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{ch.novels?.title}</p>
            </div>
          ))}
          {(!recentChapters || recentChapters.length === 0) && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No chapters yet.</p>
          )}
        </div>
      </div>

      {/* Recent Articles */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "1.5rem", marginTop: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FileText size={17} color="#f59e0b" /> Recent Articles
          </h2>
          <Link href="/admin/articles/new" className="btn-primary" style={{ padding: "0.3rem 0.75rem", fontSize: "0.8rem" }}>
            <Plus size={14} /> Add
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.75rem" }}>
          {recentArticles?.map((a: any) => (
            <Link key={a.slug} href={`/admin/articles/${a.slug}/edit`} style={{ textDecoration: "none", padding: "0.875rem", background: "var(--bg-secondary)", borderRadius: "8px", display: "block", border: "1px solid var(--border-color)" }}>
              <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)", marginBottom: "0.25rem" }}>{a.title}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{new Date(a.created_at).toLocaleDateString()}</p>
            </Link>
          ))}
        </div>
        {(!recentArticles || recentArticles.length === 0) && (
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No articles yet.</p>
        )}
      </div>

      <style>{`@media (max-width: 768px) { .admin-stats-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
