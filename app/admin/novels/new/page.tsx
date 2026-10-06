"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import {
  Save,
  ArrowLeft,
  Loader2,
  Globe,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface Genre {
  id: string;
  name: string;
}

export default function NewNovelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    author: "",
    description: "",
    cover_url: "",
    genre_id: "",
    status: "ongoing",
    is_published: true,
    meta_title: "",
    meta_description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    createClient()
      .from("genres")
      .select("id, name")
      .order("name")
      .then(({ data }) => setGenres(data || []));
  }, []);

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleTitleChange = (title: string) => {
    set("title", title);
    if (!form.slug || form.slug === slugify(form.title || "")) {
      set("slug", slugify(title));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const supabase = createClient();
    const { error: err } = await supabase.from("novels").insert([
      {
        ...form,
        genre_id: form.genre_id || null,
      },
    ]);

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    setSuccess("Novel and SEO metadata created successfully!");
    setTimeout(() => router.push("/admin/novels"), 1000);
  };

  // SEO previews
  const displayTitle = form.meta_title || (form.title ? `${form.title} — Free Web Novel | BlueNov` : "New Web Novel");
  const displayDesc = form.meta_description || form.description || "Read free web novel chapters online on BlueNov.";
  const displaySlug = form.slug || "new-novel";

  let seoScore = 0;
  if (form.title) seoScore += 25;
  if (form.description && form.description.length > 50) seoScore += 25;
  if (form.cover_url) seoScore += 25;
  if (form.genre_id) seoScore += 25;

  return (
    <div style={{ maxWidth: "900px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <Link href="/admin/novels" className="btn-ghost" style={{ padding: "0.5rem" }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="h2" style={{ margin: "0 0 0.2rem" }}>New Novel</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: 0 }}>
            Publish a new web novel with integrated SEO and AI answer engine metadata.
          </p>
        </div>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "0.85rem 1.25rem", marginBottom: "1.25rem", color: "#ef4444", fontSize: "0.88rem" }}>
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "10px", padding: "0.85rem 1.25rem", marginBottom: "1.25rem", color: "#10b981", fontSize: "0.88rem" }}>
          ✓ {success}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
        {/* Core Novel Details */}
        <div className="card" style={{ padding: "2rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem" }}>
            General Information
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
            <div>
              <label className="form-label">Title *</label>
              <input required value={form.title} onChange={(e) => handleTitleChange(e.target.value)} className="form-input" placeholder="Title" />
            </div>
            <div>
              <label className="form-label">Slug (URL) *</label>
              <input required value={form.slug} onChange={(e) => set("slug", e.target.value)} className="form-input" placeholder="novel-slug" />
            </div>
            <div>
              <label className="form-label">Author Name</label>
              <input value={form.author} onChange={(e) => set("author", e.target.value)} className="form-input" placeholder="Author" />
            </div>
            <div>
              <label className="form-label">Genre</label>
              <select value={form.genre_id} onChange={(e) => set("genre_id", e.target.value)} className="form-input">
                <option value="">— Select Genre —</option>
                {genres.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Publication Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className="form-input">
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="hiatus">On Hiatus</option>
              </select>
            </div>
            <div>
              <label className="form-label">Cover Image URL</label>
              <input value={form.cover_url} onChange={(e) => set("cover_url", e.target.value)} className="form-input" placeholder="https://..." />
            </div>
          </div>

          <div>
            <label className="form-label">Synopsis / Description</label>
            <textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} className="form-input" placeholder="Novel summary..." style={{ resize: "vertical" }} />
          </div>
        </div>

        {/* SEO & AGO Suite */}
        <div
          className="card"
          style={{
            padding: "2rem",
            background: "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Globe size={18} color="var(--accent)" />
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
                SEO & Answer Engine Optimization (AGO)
              </h2>
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.25rem 0.65rem",
                borderRadius: "999px",
                background: seoScore >= 75 ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                color: seoScore >= 75 ? "#10b981" : "#f59e0b",
                fontSize: "0.78rem",
                fontWeight: 700,
              }}
            >
              <Sparkles size={12} /> Index Readiness: {seoScore}%
            </div>
          </div>

          {/* Google Result Preview */}
          <div
            style={{
              padding: "1.25rem",
              background: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              marginBottom: "1.5rem",
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.35rem" }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#1F5FE0", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700 }}>
                B
              </div>
              <span style={{ fontSize: "0.78rem", color: "#4d5156" }}>
                https://bluenov.me › novels › {displaySlug}
              </span>
            </div>
            <div style={{ color: "#1a0dab", fontSize: "1.15rem", fontWeight: 400, lineHeight: 1.3, marginBottom: "0.3rem", fontFamily: "arial, sans-serif" }}>
              {displayTitle}
            </div>
            <div style={{ color: "#4d5156", fontSize: "0.85rem", lineHeight: 1.45, fontFamily: "arial, sans-serif" }}>
              {displayDesc.slice(0, 160)}...
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                <label className="form-label" style={{ margin: 0 }}>Custom Meta Title</label>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {form.meta_title.length} / 60
                </span>
              </div>
              <input value={form.meta_title} onChange={(e) => set("meta_title", e.target.value)} className="form-input" placeholder="Override search title" />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                <label className="form-label" style={{ margin: 0 }}>Meta Description</label>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {form.meta_description.length} / 160
                </span>
              </div>
              <input value={form.meta_description} onChange={(e) => set("meta_description", e.target.value)} className="form-input" placeholder="120–160 char summary" />
            </div>
          </div>
        </div>

        {/* Publication Toggle */}
        <div
          className="card"
          style={{
            padding: "1.25rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "0.2rem" }}>
              Visibility Status
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              When enabled, novel appears on homepage, browse, search, and is indexed in <code>sitemap.xml</code>.
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}>
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => set("is_published", e.target.checked)}
              style={{ width: "18px", height: "18px", accentColor: "var(--accent)" }}
            />
            <span>Published</span>
          </label>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: "0.75rem 1.5rem", fontSize: "0.95rem" }}>
            {loading ? <Loader2 size={16} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} /> : <Save size={16} />}
            <span>{loading ? "Publishing..." : "Create Novel & Publish"}</span>
          </button>
          <Link href="/admin/novels" className="btn-ghost" style={{ padding: "0.75rem 1.25rem" }}>
            Cancel
          </Link>
        </div>
      </form>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
