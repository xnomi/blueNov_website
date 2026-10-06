"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/common/Logo";
import {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  Settings,
  LogOut,
  ChevronRight,
  ExternalLink,
  Mail,
  Globe,
  Sparkles,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/novels", label: "Novels", icon: BookOpen },
  { href: "/admin/chapters", label: "Chapters", icon: BookMarked },
  { href: "/admin/seo", label: "SEO & Indexing", icon: Globe },
  { href: "/admin/ago", label: "AI & Search (AGO)", icon: Sparkles },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside
      className="admin-sidebar"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "260px",
        background: "var(--bg-card)",
        borderRight: "1px solid var(--border-color)",
        minHeight: "100vh",
        padding: "1.5rem 0",
      }}
    >
      {/* Brand Header with Official Logo */}
      <div style={{ padding: "0 1.25rem 1.5rem", borderBottom: "1px solid var(--border-color)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size="md" href="/admin" />
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              padding: "0.2rem 0.5rem",
              borderRadius: "6px",
              background: "rgba(31, 95, 224, 0.1)",
              color: "var(--accent)",
            }}
          >
            Admin
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          padding: "1.25rem 0.85rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.3rem",
        }}
      >
        <div
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "var(--text-muted)",
            padding: "0 0.65rem 0.4rem",
          }}
        >
          Management
        </div>

        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.625rem 0.85rem",
                borderRadius: "10px",
                textDecoration: "none",
                background: active
                  ? "linear-gradient(135deg, #1F5FE0 0%, #174ab5 100%)"
                  : "transparent",
                color: active ? "#ffffff" : "var(--text-secondary)",
                fontWeight: active ? 600 : 500,
                fontSize: "0.88rem",
                transition: "all 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: active ? "0 4px 12px rgba(31, 95, 224, 0.3)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "var(--bg-secondary)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }
              }}
            >
              <Icon size={17} strokeWidth={active ? 2.5 : 2} />
              <span>{label}</span>
              {active && <ChevronRight size={14} style={{ marginLeft: "auto", opacity: 0.8 }} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div style={{ padding: "0.85rem", borderTop: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <Link
          href="/"
          target="_blank"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.7rem",
            padding: "0.55rem 0.85rem",
            borderRadius: "8px",
            textDecoration: "none",
            color: "var(--text-secondary)",
            fontSize: "0.85rem",
            fontWeight: 500,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-secondary)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          <ExternalLink size={15} />
          <span>View Public Site</span>
        </Link>

        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "0.7rem",
            padding: "0.55rem 0.85rem",
            borderRadius: "8px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#ef4444",
            fontSize: "0.85rem",
            fontWeight: 500,
            transition: "all 0.15s ease",
            textAlign: "left",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
