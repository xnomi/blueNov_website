"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface Genre { id: string; name: string; }

export default function NewNovelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [form, setForm] = useState({
    title: "", slug: "", author: "", description: "", cover_url: "",
    genre_id: "", status: "ongoing", is_published: true,
    meta_title: "", meta_description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    createClient().from("genres").select("id, name").order("name").then(({ data }) => setGenres(data || []));
  }, []);

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleTitleChange = (title: string) => {
    set("title", title);
    set("slug", slugify(title));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");

    const supabase = createClient();
    const { error: err } = await supabase.from("novels").insert([{
      ...form,
      genre_id: form.genre_id || null,
    }]);

    if (err) { setError(err.message); setLoading(false); return; }

    setSuccess("Novel created successfully!");
    setTimeout(() => router.push("/admin/novels"), 1000);
  };

  return (
    <div style={{ maxWidth: "800px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <Link href="/admin/novels" className="btn-ghost" style={{ padding: "0.5rem" }}><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="h2">New Novel</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Add a new novel to the library</p>
        </div>
      </div>

      {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", color: "#ef4444" }}>{error}</div>}
      {success && <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", color: "#10b981" }}>{success}</div>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", background: "var(--bg-card)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          <div>
            <label className="form-label">Title *</label>
            <input required value={form.title} onChange={(e) => handleTitleChange(e.target.value)} className="form-input" placeholder="Novel Title" />
          </div>
          <div>
            <label className="form-label">Slug *</label>
            <input required value={form.slug} onChange={(e) => set("slug", e.target.value)} className="form-input" placeholder="novel-slug" />
          </div>
          <div>
            <label className="form-label">Author</label>
            <input value={form.author} onChange={(e) => set("author", e.target.value)} className="form-input" placeholder="Author Name" />
          </div>
          <div>
            <label className="form-label">Genre</label>
            <select value={form.genre_id} onChange={(e) => set("genre_id", e.target.value)} className="form-input">
              <option value="">— Select Genre —</option>
              {genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Status</label>
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
          <label className="form-label">Description</label>
          <textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} className="form-input" placeholder="Novel synopsis..." style={{ resize: "vertical" }} />
        </div>

        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1.25rem" }}>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "1rem" }}>SEO (Optional)</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            <div>
              <label className="form-label">Meta Title</label>
              <input value={form.meta_title} onChange={(e) => set("meta_title", e.target.value)} className="form-input" placeholder="Override title for search engines" />
            </div>
            <div>
              <label className="form-label">Meta Description</label>
              <input value={form.meta_description} onChange={(e) => set("meta_description", e.target.value)} className="form-input" placeholder="160-character description" />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <input type="checkbox" id="is_published" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} style={{ width: "16px", height: "16px" }} />
          <label htmlFor="is_published" style={{ fontSize: "0.875rem", fontWeight: 500 }}>Published (visible to readers)</label>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={16} />}
            {loading ? "Saving..." : "Create Novel"}
          </button>
          <Link href="/admin/novels" className="btn-ghost">Cancel</Link>
        </div>
      </form>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
