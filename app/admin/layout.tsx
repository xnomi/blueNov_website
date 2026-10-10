import { createClient } from "@/lib/supabase/server";
import { getCurrentUserRole } from "@/lib/auth/rbac";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import Link from "next/link";
import { Globe, ShieldCheck, Sparkles, Feather, Users } from "lucide-react";

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

  const role = await getCurrentUserRole(user.id, user.email);
  const isAdmin = role === "admin";
  const initial = (user.email?.[0] || "A").toUpperCase();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <AdminSidebar role={role} />
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
              {isAdmin ? "Administrator Operations & Analytics" : "Editorial Studio & Writing"}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {isAdmin && (
              <>
                {/* Editors Management shortcut */}
                <Link
                  href="/admin/editors"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.35rem 0.65rem",
                    borderRadius: "8px",
                    background: "rgba(139, 92, 246, 0.08)",
                    border: "1px solid rgba(139, 92, 246, 0.2)",
                    color: "#8b5cf6",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  <Users size={13} />
                  <span>Manage Editors</span>
                </Link>

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
                  <span>Sitemap</span>
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
              </>
            )}

            {/* Role Badge Indicator */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                padding: "0.3rem 0.65rem",
                borderRadius: "999px",
                fontSize: "0.75rem",
                fontWeight: 700,
                background: isAdmin ? "rgba(31, 95, 224, 0.1)" : "rgba(16, 185, 129, 0.1)",
                color: isAdmin ? "#1F5FE0" : "#10b981",
                border: `1px solid ${isAdmin ? "rgba(31, 95, 224, 0.25)" : "rgba(16, 185, 129, 0.25)"}`,
              }}
            >
              {isAdmin ? <ShieldCheck size={13} /> : <Feather size={13} />}
              <span>{isAdmin ? "Admin" : "Editor"}</span>
            </div>

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
                  background: isAdmin
                    ? "linear-gradient(135deg, #1F5FE0, #5BB8F5)"
                    : "linear-gradient(135deg, #10B981, #34D399)",
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
        <main style={{ flex: 1, padding: "2.5rem 2rem", maxWidth: "1280px", width: "100%" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
