"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, Loader2, Settings as SettingsIcon } from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    site_name: "BlueNov",
    tagline: "Free Novels & Articles Online",
    adsense_publisher_id: "",
    google_analytics_id: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await createClient().from("site_settings").select("*").eq("id", 1).single();
      if (data) setForm({ ...form, ...data });
      setLoading(false);
    })();
  }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(""); setSuccess("");
    const supabase = createClient();
    const { error: err } = await supabase
      .from("site_settings")
      .upsert({ id: 1, ...form, updated_at: new Date().toISOString() });
    if (err) { setError(err.message); setSaving(false); return; }
    setSuccess("Settings saved!"); setSaving(false);
  };

  if (loading) return <div style={{ padding: "2rem", color: "var(--text-muted)" }}>Loading settings...</div>;

  return (
    <div style={{ maxWidth: "600px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
        <SettingsIcon size={24} color="var(--accent)" />
        <div>
          <h1 className="h2">Settings</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Manage site-wide configuration</p>
        </div>
      </div>

      {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", color: "#ef4444" }}>{error}</div>}
      {success && <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", color: "#10b981" }}>{success}</div>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", background: "var(--bg-card)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
        <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-secondary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem" }}>General</h2>

        <div>
          <label className="form-label">Site Name</label>
          <input value={form.site_name} onChange={(e) => set("site_name", e.target.value)} className="form-input" />
        </div>
        <div>
          <label className="form-label">Tagline</label>
          <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} className="form-input" />
        </div>

        <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-secondary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem", marginTop: "0.5rem" }}>Analytics & Ads</h2>

        <div>
          <label className="form-label">Google Analytics ID (GA4)</label>
          <input value={form.google_analytics_id} onChange={(e) => set("google_analytics_id", e.target.value)} className="form-input" placeholder="G-XXXXXXXXXX" />
        </div>
        <div>
          <label className="form-label">Google AdSense Publisher ID</label>
          <input value={form.adsense_publisher_id} onChange={(e) => set("adsense_publisher_id", e.target.value)} className="form-input" placeholder="ca-pub-XXXXXXXXXXXXXXXX" />
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.375rem" }}>Add this after AdSense approval</p>
        </div>

        <button type="submit" disabled={saving} className="btn-primary" style={{ width: "fit-content" }}>
          {saving ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={16} />}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
