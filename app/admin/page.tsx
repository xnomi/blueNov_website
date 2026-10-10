import { createClient } from "@/lib/supabase/server";
import { getCurrentUserRole, getStaffMembers, getRecentActivityFeed } from "@/lib/auth/rbac";
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";
import { EditorDashboardView } from "@/components/admin/EditorDashboardView";
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
  ShieldCheck,
  Users,
  Feather,
  Clock,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = await getCurrentUserRole(user?.id, user?.email);

  // If logged in as Editor, provide the specialized Editor Studio Dashboard
  if (role === "editor") {
    const userName =
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      (user?.email ? user.email.split("@")[0] : "Editor");

    const [
      { count: allNovelsCount },
      { data: myNovels },
      { data: recentChapters },
    ] = await Promise.all([
      supabase.from("novels").select("*", { count: "exact", head: true }).eq("is_published", true),
      supabase
        .from("novels")
        .select("id, title, slug, author, view_count, status")
        .eq("is_published", true)
        .order("created_at", { ascending: false }),
      supabase
        .from("chapters")
        .select("id, title, slug, chapter_number, created_at, novels(title, slug)")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    // Filter novels authored by this editor or fall back to recent
    const authored = (myNovels || []).filter((n) => {
      if (!n.author) return false;
      const norm = n.author.toLowerCase();
      return norm === userName.toLowerCase() || norm.includes(userName.toLowerCase());
    });

    return (
      <EditorDashboardView
        userName={userName}
        userEmail={user?.email || ""}
        myNovels={authored.length > 0 ? authored : (myNovels || []).slice(0, 8)}
        recentChapters={(recentChapters as any) || []}
        allNovelsCount={allNovelsCount || 0}
      />
    );
  }

  // ── Administrator Command Center ──────────────────────────────
  const [
    { count: novelCount },
    { count: chapterCount },
    { data: popularNovels },
    { data: recentChapters },
    { data: allNovelsForViews },
    staffList,
    recentActivities,
  ] = await Promise.all([
    supabase.from("novels").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("chapters").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase
      .from("novels")
      .select("title, slug, view_count, author")
      .eq("is_published", true)
      .order("view_count", { ascending: false })
      .limit(6),
    supabase
      .from("chapters")
      .select("title, slug, chapter_number, created_at, novels!inner(slug, title)")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase.from("novels").select("view_count").eq("is_published", true),
    getStaffMembers(),
    getRecentActivityFeed(6),
  ]);

  const totalViews = (allNovelsForViews || []).reduce(
    (sum, n) => sum + (Number(n.view_count) || 0),
    0
  );

  return (
    <div>
      {/* Title & Actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <h1 className="h2" style={{ margin: 0 }}>Administrator Command Center</h1>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "#1F5FE0",
                background: "rgba(31, 95, 224, 0.1)",
                padding: "0.2rem 0.55rem",
                borderRadius: "999px",
                border: "1px solid rgba(31, 95, 224, 0.2)",
              }}
            >
              Role: Administrator
            </span>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: 0 }}>
            Real-time analytics, visitor trends, editorial staff management, and content index status.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/admin/editors" className="btn-secondary" style={{ fontSize: "0.85rem", gap: "0.35rem" }}>
            <Users size={15} /> Manage Staff
          </Link>
          <Link href="/admin/chapters/new" className="btn-secondary" style={{ fontSize: "0.85rem", gap: "0.35rem" }}>
            <Plus size={15} /> Add Chapter
          </Link>
          <Link href="/admin/novels/new" className="btn-primary" style={{ fontSize: "0.85rem", gap: "0.35rem" }}>
            <Plus size={15} /> New Novel
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        {/* Novels Metric */}
        <Link href="/admin/novels" style={{ textDecoration: "none" }}>
          <div className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(31, 95, 224, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen size={24} color="#1F5FE0" />
            </div>
            <div>
              <p style={{ fontSize: "1.85rem", fontWeight: 800, lineHeight: 1, margin: "0 0 0.25rem", color: "var(--text-primary)" }}>
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
          <div className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookMarked size={24} color="#10B981" />
            </div>
            <div>
              <p style={{ fontSize: "1.85rem", fontWeight: 800, lineHeight: 1, margin: "0 0 0.25rem", color: "var(--text-primary)" }}>
                {chapterCount || 0}
              </p>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600, margin: 0 }}>
                Live Chapters
              </p>
            </div>
          </div>
        </Link>

        {/* Editorial Staff Metric */}
        <Link href="/admin/editors" style={{ textDecoration: "none" }}>
          <div className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(139, 92, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={24} color="#8B5CF6" />
            </div>
            <div>
              <p style={{ fontSize: "1.85rem", fontWeight: 800, lineHeight: 1, margin: "0 0 0.25rem", color: "var(--text-primary)" }}>
                {staffList.length}
              </p>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600, margin: 0 }}>
                Active Editors & Staff
              </p>
            </div>
          </div>
        </Link>

        {/* Total Reads Metric */}
        <div className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(245, 158, 11, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Eye size={24} color="#F59E0B" />
          </div>
          <div>
            <p style={{ fontSize: "1.85rem", fontWeight: 800, lineHeight: 1, margin: "0 0 0.25rem", color: "var(--text-primary)" }}>
              {totalViews.toLocaleString()}
            </p>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600, margin: 0 }}>
              Total Read Impressions
            </p>
          </div>
        </div>
      </div>

      {/* ── Advanced Visitor & Popular Novels Graphs ─────── */}
      <AnalyticsCharts
        popularNovels={popularNovels || []}
        totalViews={totalViews}
        novelCount={novelCount || 0}
        chapterCount={chapterCount || 0}
      />

      {/* ── Editorial Staff Productivity Spotlight ────────── */}
      <div
        className="card"
        style={{
          padding: "1.75rem",
          marginBottom: "2.5rem",
          borderRadius: "16px",
          border: "1px solid var(--border-color)",
          background: "var(--bg-card)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.25rem",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Users size={18} color="#8B5CF6" />
              <h2 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                Editorial Staff & Publishing Performance
              </h2>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0.2rem 0 0" }}>
              Only Administrators can add new editors, assign passwords, and monitor contributor output.
            </p>
          </div>

          <Link
            href="/admin/editors"
            className="btn-primary"
            style={{ fontSize: "0.82rem", gap: "0.35rem", padding: "0.45rem 0.85rem" }}
          >
            <span>Open Staff Roster</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1rem",
          }}
        >
          {staffList.slice(0, 4).map((staff) => (
            <div
              key={staff.id}
              style={{
                padding: "1rem",
                borderRadius: "12px",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                  {staff.name}
                </div>
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    padding: "0.15rem 0.5rem",
                    borderRadius: "999px",
                    background: staff.role === "admin" ? "rgba(31, 95, 224, 0.12)" : "rgba(16, 185, 129, 0.12)",
                    color: staff.role === "admin" ? "#1F5FE0" : "#10B981",
                  }}
                >
                  {staff.role === "admin" ? "Admin" : "Editor"}
                </span>
              </div>

              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {staff.email}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.78rem",
                  paddingTop: "0.4rem",
                  borderTop: "1px solid var(--border-color)",
                }}
              >
                <span><strong>{staff.novels_count}</strong> Novels</span>
                <span><strong>{staff.chapters_count}</strong> Chapters</span>
                <span style={{ color: "#1F5FE0", fontWeight: 700 }}>{staff.total_views.toLocaleString()} reads</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Popular Novels & Recent Chapters */}
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
