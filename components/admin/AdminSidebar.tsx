"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  BookMarked,
  Settings,
  LogOut,
  ChevronRight,
  ExternalLink,
  Mail,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/novels", label: "Novels", icon: BookOpen },
  { href: "/admin/chapters", label: "Chapters", icon: BookMarked },
  { href: "/admin/articles", label: "Articles", icon: FileText },
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
    <aside className="admin-sidebar" style={{ display: "flex", flexDirection: "column", padding: "1.5rem 0" }}>
      {/* Brand */}
      <div style={{ padding: "0 1.25rem 1.5rem", borderBottom: "1px solid var(--border-color)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <div style={{
            width: "32px", height: "32px",
            background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
            borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <BookOpen size={17} color="white" />
          </div>
          <span style={{ fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: "1.125rem", color: "var(--text-primary)" }}>
            BlueNov
          </span>
        </Link>
        <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.35rem", marginLeft: "2.5rem" }}>
          Admin Panel
        </p>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
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
                padding: "0.625rem 0.875rem",
                borderRadius: "8px",
                textDecoration: "none",
                background: active ? "var(--accent)" : "transparent",
                color: active ? "#fff" : "var(--text-secondary)",
                fontWeight: active ? 600 : 500,
                fontSize: "0.9rem",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                }
              }}
            >
              <Icon size={18} />
              {label}
              {active && <ChevronRight size={14} style={{ marginLeft: "auto" }} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "0.75rem", borderTop: "1px solid var(--border-color)" }}>
        <Link
          href="/"
          target="_blank"
          style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            padding: "0.5rem 0.875rem",
            borderRadius: "8px",
            textDecoration: "none",
            color: "var(--text-muted)",
            fontSize: "0.875rem",
            marginBottom: "0.25rem",
          }}
        >
          <ExternalLink size={16} /> View Site
        </Link>
        <button
          onClick={handleLogout}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: "0.75rem",
            padding: "0.5rem 0.875rem",
            borderRadius: "8px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#ef4444",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
