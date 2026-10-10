"use client";

import { useState } from "react";
import {
  Users,
  UserPlus,
  KeyRound,
  Trash2,
  BookOpen,
  BookMarked,
  Eye,
  ShieldCheck,
  Feather,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Sparkles,
  Activity,
} from "lucide-react";
import { EditorSummary, EditorActivity } from "@/types";

interface EditorsManagerProps {
  initialStaff: EditorSummary[];
  initialActivities: EditorActivity[];
  currentUserId: string;
}

export function EditorsManager({
  initialStaff,
  initialActivities,
  currentUserId,
}: EditorsManagerProps) {
  const [staff, setStaff] = useState<EditorSummary[]>(initialStaff);
  const [activities, setActivities] = useState<EditorActivity[]>(initialActivities);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [resetTargetUser, setResetTargetUser] = useState<EditorSummary | null>(null);

  // Form states
  const [addForm, setAddForm] = useState({ email: "", full_name: "", password: "", role: "editor" });
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const parseResponse = async (res: Response) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { error: text || `Server error (${res.status}: ${res.statusText})` };
    }
  };

  const refreshStaff = async () => {
    try {
      const res = await fetch("/api/admin/editors");
      if (res.ok) {
        const data = await parseResponse(res);
        if (data.staff) setStaff(data.staff);
      }
    } catch {
      // ignore
    }
  };

  const handleAddEditor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/admin/editors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      const data = await parseResponse(res);

      if (!res.ok) {
        throw new Error(data.error || "Failed to create editor");
      }

      setStatusMsg({ type: "success", text: `Editor account created for ${addForm.email}!` });
      setShowAddModal(false);
      setAddForm({ email: "", full_name: "", password: "", role: "editor" });
      await refreshStaff();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTargetUser) return;
    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/admin/editors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: resetTargetUser.id,
          password: newPassword,
        }),
      });
      const data = await parseResponse(res);

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setStatusMsg({
        type: "success",
        text: `Password successfully updated for ${resetTargetUser.name || resetTargetUser.email}!`,
      });
      setResetTargetUser(null);
      setNewPassword("");
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEditor = async (userToDelete: EditorSummary) => {
    if (!confirm(`Are you sure you want to remove ${userToDelete.name} (${userToDelete.email})?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/editors?id=${userToDelete.id}`, {
        method: "DELETE",
      });
      const data = await parseResponse(res);

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete editor");
      }

      setStatusMsg({ type: "success", text: `Editor ${userToDelete.email} removed.` });
      await refreshStaff();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message });
    }
  };

  return (
    <div>
      {/* Notifications */}
      {statusMsg && (
        <div
          style={{
            padding: "0.85rem 1.25rem",
            borderRadius: "10px",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            fontSize: "0.88rem",
            fontWeight: 500,
            background:
              statusMsg.type === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
            color: statusMsg.type === "success" ? "#10B981" : "#EF4444",
            border: `1px solid ${statusMsg.type === "success" ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
          }}
        >
          {statusMsg.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{statusMsg.text}</span>
          <button
            onClick={() => setStatusMsg(null)}
            style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "inherit" }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header and Add Button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.75rem",
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 0.25rem", color: "var(--text-primary)" }}>
            Editorial Staff & Credentials
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
            Manage editorial permissions, provision editor logins, set passwords, and track posting productivity.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
          style={{ fontSize: "0.85rem", gap: "0.45rem", padding: "0.6rem 1.15rem" }}
        >
          <UserPlus size={16} />
          <span>Add New Editor</span>
        </button>
      </div>

      {/* Staff Grid Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2.5rem",
        }}
      >
        {staff.map((u) => {
          const isAdmin = u.role === "admin";
          const isMe = u.id === currentUserId;

          return (
            <div
              key={u.id}
              className="card"
              style={{
                padding: "1.5rem",
                borderRadius: "14px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-card)",
                display: "flex",
                flexDirection: "column",
                gap: "1.1rem",
                position: "relative",
              }}
            >
              {/* Header: Avatar, Name & Role Badge */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      background: isAdmin
                        ? "linear-gradient(135deg, #1F5FE0, #8B5CF6)"
                        : "linear-gradient(135deg, #10B981, #059669)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "1.05rem",
                    }}
                  >
                    {u.name[0]?.toUpperCase() || "E"}
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                      {u.name} {isMe && <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>(You)</span>}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{u.email}</div>
                  </div>
                </div>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    padding: "0.25rem 0.65rem",
                    borderRadius: "999px",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    background: isAdmin ? "rgba(31, 95, 224, 0.1)" : "rgba(16, 185, 129, 0.1)",
                    color: isAdmin ? "#1F5FE0" : "#10B981",
                    border: `1px solid ${isAdmin ? "rgba(31, 95, 224, 0.2)" : "rgba(16, 185, 129, 0.2)"}`,
                  }}
                >
                  {isAdmin ? <ShieldCheck size={13} /> : <Feather size={13} />}
                  <span>{isAdmin ? "Administrator" : "Editor"}</span>
                </span>
              </div>

              {/* Productivity Numbers */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "0.5rem",
                  padding: "0.75rem",
                  background: "var(--bg-secondary)",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>Novels</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "0.1rem" }}>
                    {u.novels_count}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>Chapters</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#10B981", marginTop: "0.1rem" }}>
                    {u.chapters_count}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>Reads</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1F5FE0", marginTop: "0.1rem" }}>
                    {u.total_views.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "0.5rem",
                  borderTop: "1px solid var(--border-color)",
                }}
              >
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Clock size={12} />
                  <span>
                    Active: {u.last_active ? new Date(u.last_active).toLocaleDateString() : "Recently"}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <button
                    onClick={() => {
                      setResetTargetUser(u);
                      setNewPassword("");
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      padding: "0.35rem 0.65rem",
                      borderRadius: "7px",
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-secondary)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    title="Set new password"
                  >
                    <KeyRound size={12} />
                    <span>Set Password</span>
                  </button>

                  {!isMe && !isAdmin && (
                    <button
                      onClick={() => handleDeleteEditor(u)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "0.35rem 0.5rem",
                        borderRadius: "7px",
                        background: "rgba(239, 68, 68, 0.08)",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        color: "#ef4444",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                      title="Remove editor"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Live Editor Activity Log ─────────────────────── */}
      <div
        className="card"
        style={{
          padding: "1.75rem",
          borderRadius: "16px",
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Activity size={18} color="#1F5FE0" />
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                Editor Publishing Activity & Post Stream
              </h3>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0.2rem 0 0" }}>
              Real-time audit record of stories and chapters posted by editors
            </p>
          </div>
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              padding: "0.2rem 0.55rem",
              borderRadius: "6px",
              background: "rgba(31, 95, 224, 0.08)",
              color: "#1F5FE0",
            }}
          >
            Live Logs ({activities.length})
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          {activities.map((act) => (
            <div
              key={act.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background:
                      act.action === "created_chapter"
                        ? "rgba(16, 185, 129, 0.12)"
                        : act.action === "created_novel"
                        ? "rgba(31, 95, 224, 0.12)"
                        : "rgba(139, 92, 246, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color:
                      act.action === "created_chapter"
                        ? "#10B981"
                        : act.action === "created_novel"
                        ? "#1F5FE0"
                        : "#8B5CF6",
                  }}
                >
                  {act.action.includes("chapter") ? <BookMarked size={16} /> : <BookOpen size={16} />}
                </div>

                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)" }}>
                    <span style={{ color: "#1F5FE0", fontWeight: 700 }}>{act.user_name || act.user_email}</span>{" "}
                    {act.action === "created_chapter" ? "published" : act.action === "created_novel" ? "created novel" : "updated"}{" "}
                    <span style={{ fontWeight: 600 }}>{act.target_title}</span>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    Target: {act.target_type} • Operator: {act.user_email}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>
                {new Date(act.created_at).toLocaleString()}
              </div>
            </div>
          ))}

          {activities.length === 0 && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", padding: "1rem 0" }}>
              No recent editor activity recorded yet.
            </p>
          )}
        </div>
      </div>

      {/* ── Modal: Add New Editor ────────────────────────── */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            zIndex: 100,
          }}
        >
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: "460px",
              padding: "2rem",
              borderRadius: "16px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <UserPlus size={20} color="#1F5FE0" />
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                  Provision Editor Account
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: "0 0 1.5rem" }}>
              New credentials will be directly stored in Supabase Auth. The editor can immediately sign in with this email and password.
            </p>

            <form onSubmit={handleAddEditor} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="form-label" style={{ fontSize: "0.8rem" }}>Full Name / Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={addForm.full_name}
                  onChange={(e) => setAddForm({ ...addForm, full_name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: "0.8rem" }}>Editor Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="editor@bluenov.me"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: "0.8rem" }}>Initial Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={addForm.password}
                  onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: "0.8rem" }}>System Role</label>
                <select
                  value={addForm.role}
                  onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                  className="form-input"
                >
                  <option value="editor">Editor (Can post & manage novels/chapters)</option>
                  <option value="admin">Administrator (Full command privileges)</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                  style={{ fontSize: "0.85rem" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ fontSize: "0.85rem", gap: "0.4rem" }}
                >
                  {loading && <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />}
                  <span>{loading ? "Creating..." : "Create Editor"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Set / Reset Password ──────────────────── */}
      {resetTargetUser && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            zIndex: 100,
          }}
        >
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: "420px",
              padding: "2rem",
              borderRadius: "16px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <KeyRound size={20} color="#1F5FE0" />
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                  Set New Password
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setResetTargetUser(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: "0 0 1.25rem" }}>
              Directly set a new password for <strong>{resetTargetUser.name}</strong> ({resetTargetUser.email}).
            </p>

            <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="form-label" style={{ fontSize: "0.8rem" }}>New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setResetTargetUser(null)}
                  className="btn-secondary"
                  style={{ fontSize: "0.85rem" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ fontSize: "0.85rem", gap: "0.4rem" }}
                >
                  {loading && <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />}
                  <span>{loading ? "Updating..." : "Update Password"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
