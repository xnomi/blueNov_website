"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import { Save, ArrowLeft, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const RichEditor = dynamic(() => import("../../../../../components/admin/RichEditor"), { ssr: false, loading: () => <div className="form-input" style={{ height: "300px" }}>Loading editor...</div> });

interface Novel { id: string; title: string; }

export default function EditChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [chapterId, setChapterId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [novels, setNovels] = useState<Novel[]>([]);
  const [form, setForm] = useState<any>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    (async () => {
      const { id } = await params;
      setChapterId(id);
      const supabase = createClient();
      const [{ data: chapter }, { data: novelList }] = await Promise.all([
        supabase.from("chapters").select("*").eq("id", id).single(),
        supabase.from("novels").select("id, title").eq("is_published", true).order("title"),
      ]);
      if (chapter) setForm(chapter);
      setNovels(novelList || []);
      setLoading(false);
    })();
  }, []);

  const set = (k: string, v: unknown) => setForm((f: any) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(""); setSuccess("");
    const supabase = createClient();
    const { error: err } = await supabase.from("chapters").update({ ...form, updated_at: new Date().toISOString() }).eq("id", chapterId);
    if (err) { setError(err.message); setSaving(false); return; }
    setSuccess("Chapter saved!"); setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this chapter permanently?")) return;
    await createClient().from("chapters").delete().eq("id", chapterId);
    router.push("/admin/chapters");
  };

  if (loading) return <div style={{ padding: "2rem", color: "var(--text-muted)" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: "900px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/admin/chapters" className="btn-ghost" style={{ padding: "0.5rem" }}><ArrowLeft size={18} /></Link>
          <h1 className="h2">Edit Chapter</h1>
        </div>
        <button onClick={handleDelete} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", borderRadius: "8px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", cursor: "pointer", fontSize: "0.875rem" }}>
          <Trash2 size={15} /> Delete
        </button>
      </div>

      {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", color: "#ef4444" }}>{error}</div>}
      {success && <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", color: "#10b981" }}>{success}</div>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", background: "var(--bg-card)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.25rem" }}>
          <div>
            <label className="form-label">Novel *</label>
            <select required value={form.novel_id || ""} onChange={(e) => set("novel_id", e.target.value)} className="form-input">
              {novels.map((n) => <option key={n.id} value={n.id}>{n.title}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Chapter Number</label>
            <input type="number" min={1} value={form.chapter_number || 1} onChange={(e) => set("chapter_number", parseInt(e.target.value))} className="form-input" />
          </div>
          <div>
            <label className="form-label">Title</label>
            <input value={form.title || ""} onChange={(e) => set("title", e.target.value)} className="form-input" />
          </div>
          <div>
            <label className="form-label">Slug</label>
            <input value={form.slug || ""} onChange={(e) => set("slug", e.target.value)} className="form-input" />
          </div>
        </div>

        <div>
          <label className="form-label">Content</label>
          <RichEditor content={form.content || ""} onChange={(html) => set("content", html)} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <input type="checkbox" id="is_published" checked={form.is_published ?? true} onChange={(e) => set("is_published", e.target.checked)} style={{ width: "16px", height: "16px" }} />
          <label htmlFor="is_published" style={{ fontSize: "0.875rem", fontWeight: 500 }}>Published</label>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={16} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <Link href="/admin/chapters" className="btn-ghost">Back</Link>
        </div>
      </form>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
