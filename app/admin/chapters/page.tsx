import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit, Eye, BookMarked } from "lucide-react";
import { formatDateShort, formatViews } from "@/lib/utils";

export default async function AdminChaptersPage() {
  const supabase = await createClient();
  const { data: chapters } = await supabase
    .from("chapters")
    .select("*, novels!inner(title, slug)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 className="h2">Chapters</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{chapters?.length || 0} chapters total</p>
        </div>
        <Link href="/admin/chapters/new" className="btn-primary"><Plus size={17} /> New Chapter</Link>
      </div>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
          <thead>
            <tr style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }}>
              {["#", "Title", "Novel", "Views", "Published", "Date", "Actions"].map((h) => (
                <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chapters?.map((ch: any) => (
              <tr key={ch.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--accent)" }}>{ch.chapter_number}</span>
                </td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <p style={{ fontWeight: 500, fontSize: "0.875rem", color: "var(--text-primary)" }}>{ch.title}</p>
                </td>
                <td style={{ padding: "0.875rem 1rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  {ch.novels?.title || "—"}
                </td>
                <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Eye size={13} /> {formatViews(ch.view_count)}
                  </span>
                </td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "0.2rem 0.5rem", borderRadius: "999px", background: ch.is_published ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.1)", color: ch.is_published ? "#10b981" : "#ef4444" }}>
                    {ch.is_published ? "Live" : "Draft"}
                  </span>
                </td>
                <td style={{ padding: "0.875rem 1rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>{formatDateShort(ch.created_at)}</td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {ch.novels?.slug && (
                      <Link href={`/novels/${ch.novels.slug}/${ch.slug}`} target="_blank" title="View" style={{ padding: "0.375rem", borderRadius: "6px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-muted)", display: "flex" }}>
                        <Eye size={14} />
                      </Link>
                    )}
                    <Link href={`/admin/chapters/${ch.id}/edit`} title="Edit" style={{ padding: "0.375rem", borderRadius: "6px", background: "var(--accent-light)", border: "1px solid var(--border-color)", color: "var(--accent)", display: "flex" }}>
                      <Edit size={14} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!chapters || chapters.length === 0) && (
          <div style={{ padding: "4rem", textAlign: "center" }}>
            <BookMarked size={40} color="var(--text-muted)" style={{ marginBottom: "0.75rem" }} />
            <p style={{ color: "var(--text-muted)" }}>No chapters yet. Add the first chapter!</p>
          </div>
        )}
      </div>
    </div>
  );
}
