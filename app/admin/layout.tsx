import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import Link from "next/link";
import { Globe, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";

export const metadata = {
  title: "Admin Panel | BlueNov",
  robots: { index: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <>{children}</>;
  }

  const initial = (user.email?.[0] || "A").toUpperCase();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Modern Top Header Bar */}
        <header
          style={{
            height: "64px",
            borderBottom: "1px solid var(--border-color)",
            background: "var(--bg-card)",
            padding: "0 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            position: "sticky",
            top: 0,
            zIndex: 30,
            backdropFilter: "blur(12px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
              BlueNov Command
            </span>
            <span style={{ color: "var(--text-muted)" }}>/</span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              Content & SEO Operations
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {/* Quick SEO Link */}
            <Link
              href="/admin/seo"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.35rem 0.65rem",
                borderRadius: "8px",
                background: "rgba(31, 95, 224, 0.08)",
                border: "1px solid rgba(31, 95, 224, 0.2)",
                color: "var(--accent)",
                fontSize: "0.78rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <Globe size={13} />
              <span>Sitemap & Indexing</span>
            </Link>

            {/* Quick AGO Link */}
            <Link
              href="/admin/ago"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.35rem 0.65rem",
                borderRadius: "8px",
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                color: "#10b981",
                fontSize: "0.78rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <Sparkles size={13} />
              <span>AGO Hub</span>
            </Link>

            <div style={{ width: "1px", height: "20px", background: "var(--border-color)", margin: "0 0.25rem" }} />

            {/* User Chip */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.3rem 0.6rem 0.3rem 0.3rem",
                borderRadius: "999px",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #1F5FE0, #5BB8F5)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                }}
              >
                {initial}
              </div>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                {user.email}
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main style={{ flex: 1, padding: "2.5rem 2rem", maxWidth: "1200px", width: "100%" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
