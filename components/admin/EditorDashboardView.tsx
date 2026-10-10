"use client";

import Link from "next/link";
import { AdminSignOutButton } from "@/components/admin/AdminSignOutButton";
import {
  BookOpen,
  BookMarked,
  Eye,
  Plus,
  ArrowRight,
  Sparkles,
  Feather,
  Clock,
  CheckCircle2,
  FileEdit,
  ExternalLink,
} from "lucide-react";

interface NovelItem {
  id: string;
  title: string;
  slug: string;
  author?: string;
  view_count: number;
  status: string;
}

interface ChapterItem {
  id: string;
  title: string;
  slug: string;
  chapter_number: number;
  created_at: string;
  novels?: any;
}

interface EditorDashboardViewProps {
  userName: string;
  userEmail: string;
  myNovels: NovelItem[];
  recentChapters: ChapterItem[];
  allNovelsCount: number;
}

export function EditorDashboardView({
  userName,
  userEmail,
  myNovels,
  recentChapters,
  allNovelsCount,
}: EditorDashboardViewProps) {
  const myChaptersCount = recentChapters.length;
  const myTotalReads = myNovels.reduce((sum, n) => sum + (Number(n.view_count) || 0), 0);

  return (
    <div>
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          padding: "2rem",
          marginBottom: "2rem",
          borderRadius: "16px",
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(31, 95, 224, 0.08) 100%)",
          border: "1px solid rgba(16, 185, 129, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.25rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                padding: "0.2rem 0.55rem",
                borderRadius: "999px",
                fontSize: "0.72rem",
                fontWeight: 700,
                background: "rgba(16, 185, 129, 0.15)",
                color: "#10b981",
                border: "1px solid rgba(16, 185, 129, 0.3)",
              }}
            >
              <Feather size={12} /> Editorial Workspace
            </span>
          </div>

          <h1 className="h2" style={{ margin: "0 0 0.35rem", fontSize: "1.65rem" }}>
            Welcome back, {userName}!
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: 0, maxWidth: "600px" }}>
            This is your dedicated BlueNov Editorial Studio. Compose new chapters, manage your novels, and track story performance.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <Link href="/admin/chapters/new" className="btn-secondary" style={{ fontSize: "0.85rem", gap: "0.35rem" }}>
            <Plus size={15} /> Add Chapter
          </Link>
          <Link href="/admin/novels/new" className="btn-primary" style={{ fontSize: "0.85rem", gap: "0.35rem" }}>
            <Plus size={15} /> Write New Novel
          </Link>
          <AdminSignOutButton variant="button" />
        </div>
      </div>

      {/* Editor Key Metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2.5rem",
        }}
      >
        <Link href="/admin/novels" style={{ textDecoration: "none" }}>
          <div className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(31, 95, 224, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BookOpen size={24} color="#1F5FE0" />
            </div>
            <div>
              <p style={{ fontSize: "1.85rem", fontWeight: 800, lineHeight: 1, margin: "0 0 0.25rem", color: "var(--text-primary)" }}>
                {myNovels.length || allNovelsCount}
              </p>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600, margin: 0 }}>
                {myNovels.length > 0 ? "My Authored Novels" : "Available Novels"}
              </p>
            </div>
          </div>
        </Link>

        <Link href="/admin/chapters" style={{ textDecoration: "none" }}>
          <div className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(16, 185, 129, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BookMarked size={24} color="#10B981" />
            </div>
            <div>
              <p style={{ fontSize: "1.85rem", fontWeight: 800, lineHeight: 1, margin: "0 0 0.25rem", color: "var(--text-primary)" }}>
                {myChaptersCount}
              </p>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600, margin: 0 }}>
                Published Chapters
              </p>
            </div>
          </div>
        </Link>

        <div className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(139, 92, 246, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Eye size={24} color="#8B5CF6" />
          </div>
          <div>
            <p style={{ fontSize: "1.85rem", fontWeight: 800, lineHeight: 1, margin: "0 0 0.25rem", color: "var(--text-primary)" }}>
              {myTotalReads.toLocaleString()}
            </p>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600, margin: 0 }}>
              Reader Impressions
            </p>
          </div>
        </div>
      </div>

      {/* Editor Main Content: Active Novels & Publishing Stream */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.75rem", marginBottom: "2.5rem" }}>
        {/* Active Novels */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <h2 style={{ fontWeight: 700, fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
              <BookOpen size={18} color="#1F5FE0" /> Assigned Stories & Series
            </h2>
            <Link href="/admin/novels" style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
              View All
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {(myNovels.length > 0 ? myNovels : []).slice(0, 6).map((n) => (
              <div
                key={n.slug}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
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
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                    Status: <span style={{ textTransform: "capitalize" }}>{n.status}</span> • by {n.author || userName}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Link
                    href={`/admin/chapters/new?novelId=${n.id}`}
                    style={{
                      padding: "0.3rem 0.6rem",
                      borderRadius: "6px",
                      background: "rgba(31, 95, 224, 0.1)",
                      color: "#1F5FE0",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    + Add Ch
                  </Link>
                </div>
              </div>
            ))}

            {myNovels.length === 0 && (
              <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.88rem" }}>
                <p style={{ margin: "0 0 0.75rem" }}>You haven't authored any specific novels under your name yet.</p>
                <Link href="/admin/novels/new" className="btn-primary" style={{ fontSize: "0.8rem", display: "inline-flex" }}>
                  <Plus size={14} /> Start Your First Novel
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Latest Chapter Updates */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <h2 style={{ fontWeight: 700, fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
              <BookMarked size={18} color="#10B981" /> Recent Chapter Publications
            </h2>
            <Link href="/admin/chapters" style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
              View Chapters
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {recentChapters.slice(0, 6).map((ch) => (
              <div
                key={ch.slug}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
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
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                    Series: {Array.isArray(ch.novels) ? ch.novels[0]?.title : ch.novels?.title || "Novel"}
                  </div>
                </div>

                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  {new Date(ch.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}

            {recentChapters.length === 0 && (
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No chapters posted yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Editorial Best Practices Guide Box */}
      <div
        className="card"
        style={{
          padding: "1.5rem 1.75rem",
          borderRadius: "14px",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          display: "flex",
          gap: "1.25rem",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "10px",
            background: "rgba(139, 92, 246, 0.1)",
            color: "#8B5CF6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Sparkles size={22} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "0.3rem" }}>
            Editorial Quality Standards & Search Crawling
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Every chapter you publish is automatically added into our dynamic sitemap and feed for Google indexing.
            For maximum reader retention, aim for <strong>1,500 – 2,500 words per chapter</strong>, end each release with a strong hook, and ensure correct chapter numbering.
          </div>
        </div>
      </div>
    </div>
  );
}
