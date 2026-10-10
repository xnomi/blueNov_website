"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, Loader2 } from "lucide-react";

interface AdminSignOutButtonProps {
  variant?: "header" | "button";
}

export function AdminSignOutButton({ variant = "header" }: AdminSignOutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/admin/login");
      router.refresh();
    } catch {
      setLoading(false);
    }
  };

  if (variant === "button") {
    return (
      <button
        onClick={handleSignOut}
        disabled={loading}
        className="btn-secondary"
        style={{
          fontSize: "0.82rem",
          gap: "0.4rem",
          padding: "0.45rem 0.85rem",
          color: "#ef4444",
          borderColor: "rgba(239, 68, 68, 0.25)",
        }}
      >
        {loading ? (
          <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
        ) : (
          <LogOut size={14} />
        )}
        <span>{loading ? "Signing out..." : "Sign Out"}</span>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </button>
    );
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.32rem 0.7rem",
        borderRadius: "8px",
        background: "rgba(239, 68, 68, 0.08)",
        border: "1px solid rgba(239, 68, 68, 0.2)",
        color: "#ef4444",
        fontSize: "0.78rem",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)";
      }}
      title="Sign out of account"
    >
      {loading ? (
        <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
      ) : (
        <LogOut size={13} />
      )}
      <span>Sign Out</span>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}
