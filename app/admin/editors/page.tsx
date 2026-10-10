import { createClient } from "@/lib/supabase/server";
import { getCurrentUserRole, getStaffMembers, getRecentActivityFeed } from "@/lib/auth/rbac";
import { EditorsManager } from "@/components/admin/EditorsManager";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Staff & Editors Management | BlueNov Admin",
};

export default async function AdminEditorsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const role = await getCurrentUserRole(user.id, user.email);

  if (role !== "admin") {
    return (
      <div
        className="card"
        style={{
          padding: "3rem 2rem",
          textAlign: "center",
          maxWidth: "600px",
          margin: "4rem auto",
          borderRadius: "16px",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          background: "rgba(239, 68, 68, 0.04)",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "rgba(239, 68, 68, 0.1)",
            color: "#ef4444",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.25rem",
          }}
        >
          <ShieldAlert size={28} />
        </div>
        <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: "0 0 0.5rem", color: "var(--text-primary)" }}>
          Administrator Privilege Required
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.75rem" }}>
          Your account is currently registered with the <strong>Editor</strong> role. Only full Administrators can create accounts, set passwords, or manage editorial permissions.
        </p>
        <Link href="/admin" className="btn-primary" style={{ display: "inline-flex", gap: "0.4rem" }}>
          <ArrowLeft size={16} /> Return to Workspace
        </Link>
      </div>
    );
  }

  const [staff, activities] = await Promise.all([
    getStaffMembers(),
    getRecentActivityFeed(25),
  ]);

  return (
    <div>
      <EditorsManager
        initialStaff={staff}
        initialActivities={activities}
        currentUserId={user.id}
      />
    </div>
  );
}
