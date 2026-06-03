import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit, Eye, BookOpen, Trash2 } from "lucide-react";
import { formatDateShort, formatViews, statusLabel } from "@/lib/utils";

export default async function AdminNovelsPage() {
  const supabase = await createClient();
  const { data: novels } = await supabase
    .from("novels")
    .select("*, genre:genres(name)")
    .order("updated_at", { ascending: false });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 className="h2">Novels</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{novels?.length || 0} novels total</p>
        </div>
        <Link href="/admin/novels/new" className="btn-primary">
          <Plus size={17} /> New Novel
        </Link>
      </div>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }}>
              {["Title", "Author", "Genre", "Status", "Views", "Updated", "Actions"].map((h) => (
                <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {novels?.map((novel) => (
              <tr key={novel.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{novel.title}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{novel.slug}</p>
                </td>
                <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>{novel.author || "—"}</td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  {novel.genre ? <span className="badge">{(novel.genre as any).name}</span> : "—"}
                </td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <span className={`badge status-${novel.status}`}>{statusLabel(novel.status)}</span>
                </td>
                <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Eye size={13} /> {formatViews(novel.view_count)}
                  </span>
                </td>
                <td style={{ padding: "0.875rem 1rem", fontSize: "0.8rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  {formatDateShort(novel.updated_at)}
                </td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Link
                      href={`/novels/${novel.slug}`}
                      target="_blank"
                      title="View"
                      style={{ padding: "0.375rem", borderRadius: "6px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-muted)", display: "flex" }}
                    >
                      <Eye size={14} />
                    </Link>
                    <Link
                      href={`/admin/novels/${novel.id}/edit`}
                      title="Edit"
                      style={{ padding: "0.375rem", borderRadius: "6px", background: "var(--accent-light)", border: "1px solid var(--border-color)", color: "var(--accent)", display: "flex" }}
                    >
                      <Edit size={14} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!novels || novels.length === 0) && (
          <div style={{ padding: "4rem", textAlign: "center" }}>
            <BookOpen size={40} color="var(--text-muted)" style={{ marginBottom: "0.75rem" }} />
            <p style={{ color: "var(--text-muted)" }}>No novels yet. Create your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
