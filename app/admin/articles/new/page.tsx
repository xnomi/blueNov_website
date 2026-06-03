"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const RichEditor = dynamic(() => import("../../../../components/admin/RichEditor"), { ssr: false, loading: () => <div className="form-input" style={{ height: "300px" }}>Loading editor...</div> });

const CATEGORIES = ["General", "Reviews", "News", "Recommendations", "Writing Tips"];

export default function NewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", slug: "", author: "", excerpt: "", content: "",
    category: "General", cover_url: "", is_published: true,
    meta_title: "", meta_description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleTitleChange = (title: string) => {
    set("title", title);
    set("slug", slugify(title));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.content.trim()) { setError("Article content is required."); return; }
    setLoading(true); setError(""); setSuccess("");
    const { error: err } = await createClient().from("articles").insert([form]);
    if (err) { setError(err.message); setLoading(false); return; }
    setSuccess("Article created!");
    setTimeout(() => router.push("/admin/articles"), 1000);
  };

  return (
    <div style={{ maxWidth: "900px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <Link href="/admin/articles" className="btn-ghost" style={{ padding: "0.5rem" }}><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="h2">New Article</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Create a new article or post</p>
        </div>
      </div>

      {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", color: "#ef4444" }}>{error}</div>}
      {success && <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", color: "#10b981" }}>{success}</div>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", background: "var(--bg-card)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          <div>
            <label className="form-label">Title *</label>
            <input required value={form.title} onChange={(e) => handleTitleChange(e.target.value)} className="form-input" placeholder="Article Title" />
          </div>
          <div>
            <label className="form-label">Slug *</label>
            <input required value={form.slug} onChange={(e) => set("slug", e.target.value)} className="form-input" />
          </div>
          <div>
            <label className="form-label">Author</label>
            <input value={form.author} onChange={(e) => set("author", e.target.value)} className="form-input" />
          </div>
          <div>
            <label className="form-label">Category</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className="form-input">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="form-label">Cover Image URL</label>
            <input value={form.cover_url} onChange={(e) => set("cover_url", e.target.value)} className="form-input" placeholder="https://..." />
          </div>
        </div>

        <div>
          <label className="form-label">Excerpt (shown in listings)</label>
          <textarea rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} className="form-input" style={{ resize: "vertical" }} placeholder="Short summary of the article..." />
        </div>

        <div>
          <label className="form-label">Content *</label>
          <RichEditor content={form.content} onChange={(html) => set("content", html)} />
        </div>

        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1.25rem" }}>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "1rem" }}>SEO</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            <div>
              <label className="form-label">Meta Title</label>
              <input value={form.meta_title} onChange={(e) => set("meta_title", e.target.value)} className="form-input" />
            </div>
            <div>
              <label className="form-label">Meta Description</label>
              <input value={form.meta_description} onChange={(e) => set("meta_description", e.target.value)} className="form-input" />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <input type="checkbox" id="is_published" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} style={{ width: "16px", height: "16px" }} />
          <label htmlFor="is_published" style={{ fontSize: "0.875rem", fontWeight: 500 }}>Published</label>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={16} />}
            {loading ? "Publishing..." : "Create Article"}
          </button>
          <Link href="/admin/articles" className="btn-ghost">Cancel</Link>
        </div>
      </form>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
