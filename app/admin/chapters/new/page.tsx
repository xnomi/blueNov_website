"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { slugify } from "@/lib/utils";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const RichEditor = dynamic(() => import("../../../../components/admin/RichEditor"), {
  ssr: false,
  loading: () => <div className="form-input" style={{ height: "300px" }}>Loading editor...</div>,
});

interface Novel {
  id: string;
  title: string;
}

export default function NewChapterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const novelParamId = searchParams.get("novel_id");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [novels, setNovels] = useState<Novel[]>([]);
  const [form, setForm] = useState({
    novel_id: "",
    title: "",
    slug: "",
    chapter_number: 1,
    content: "",
    is_published: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch novels on load
  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: novelList } = await supabase
        .from("novels")
        .select("id, title")
        .eq("is_published", true)
        .order("title");
      
      const list = novelList || [];
      setNovels(list);

      // Determine initial novel selection
      let initialNovelId = "";
      if (novelParamId && list.some(n => n.id === novelParamId)) {
        initialNovelId = novelParamId;
      } else if (list.length > 0) {
        initialNovelId = list[0].id;
      }

      if (initialNovelId) {
        setForm(f => ({ ...f, novel_id: initialNovelId }));
        await suggestNextChapterNumber(initialNovelId);
      }
      setLoading(false);
    })();
  }, [novelParamId]);

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  // Suggest the next chapter number for a given novel
  const suggestNextChapterNumber = async (novelId: string) => {
    if (!novelId) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("chapters")
      .select("chapter_number")
      .eq("novel_id", novelId)
      .order("chapter_number", { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      set("chapter_number", data[0].chapter_number + 1);
    } else {
      set("chapter_number", 1);
    }
  };

  const handleNovelChange = async (novelId: string) => {
    set("novel_id", novelId);
    await suggestNextChapterNumber(novelId);
  };

  const handleTitleChange = (title: string) => {
    set("title", title);
    set("slug", slugify(title));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.novel_id) {
      setError("Please select a novel.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");

    const supabase = createClient();
    const { error: err } = await supabase.from("chapters").insert([form]);

    if (err) {
      setError(err.message);
      setSaving(false);
      return;
    }

    setSuccess("Chapter created successfully!");

    try {
      fetch("/api/admin/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "created_chapter",
          targetType: "chapter",
          targetTitle: `Ch. ${form.chapter_number}: ${form.title}`,
        }),
      });
    } catch {}

    setTimeout(() => router.push("/admin/chapters"), 1000);
  };

  if (loading) {
    return <div style={{ padding: "2rem", color: "var(--text-muted)" }}>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: "900px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <Link href="/admin/chapters" className="btn-ghost" style={{ padding: "0.5rem" }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="h2">New Chapter</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Add a new chapter to a novel</p>
        </div>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", color: "#ef4444" }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", color: "#10b981" }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", background: "var(--bg-card)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.25rem" }}>
          <div>
            <label className="form-label">Novel *</label>
            <select required value={form.novel_id} onChange={(e) => handleNovelChange(e.target.value)} className="form-input">
              <option value="">— Select Novel —</option>
              {novels.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Chapter Number *</label>
            <input type="number" required min={1} value={form.chapter_number} onChange={(e) => set("chapter_number", parseInt(e.target.value) || 1)} className="form-input" />
          </div>
          <div>
            <label className="form-label">Title *</label>
            <input required value={form.title} onChange={(e) => handleTitleChange(e.target.value)} className="form-input" placeholder="e.g. The Beginning of the Journey" />
          </div>
          <div>
            <label className="form-label">Slug *</label>
            <input required value={form.slug} onChange={(e) => set("slug", e.target.value)} className="form-input" placeholder="e.g. chapter-1" />
          </div>
        </div>

        <div>
          <label className="form-label">Content *</label>
          <RichEditor content={form.content} onChange={(html) => set("content", html)} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <input type="checkbox" id="is_published" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} style={{ width: "16px", height: "16px" }} />
          <label htmlFor="is_published" style={{ fontSize: "0.875rem", fontWeight: 500 }}>Published (visible to readers)</label>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={16} />}
            {saving ? "Creating..." : "Create Chapter"}
          </button>
          <Link href="/admin/chapters" className="btn-ghost">Cancel</Link>
        </div>
      </form>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}