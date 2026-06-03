import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = { title: "Admin Panel | BlueNov", robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <AdminSidebar />
      <div style={{ flex: 1, overflowX: "hidden" }}>
        {/* Top bar */}
        <div style={{
          padding: "1rem 1.5rem",
          borderBottom: "1px solid var(--border-color)",
          background: "var(--bg-card)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Signed in as <span style={{ color: "var(--accent)", fontWeight: 500 }}>{user.email}</span>
          </p>
        </div>

        <div style={{ padding: "2rem 1.5rem" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
