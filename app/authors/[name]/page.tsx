import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { NovelCard } from "@/components/novels/NovelCard";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { Novel } from "@/types";
import { User, BookOpen, Eye, Award } from "lucide-react";
import { formatViews } from "@/lib/utils";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  return {
    title: `${decodedName} — Novels & Stories | ${SITE_NAME}`,
    description: `Read free web novels and stories written by ${decodedName} at ${SITE_NAME}.`,
    alternates: { canonical: `${SITE_URL}/authors/${encodeURIComponent(name)}` },
  };
}

export default async function AuthorPage({ params }: PageProps) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const supabase = await createClient();

  const { data: novels } = await supabase
    .from("novels")
    .select("*, genre:genres(*)")
    .ilike("author", decodedName)
    .eq("is_published", true)
    .order("view_count", { ascending: false });

  const novelList = (novels as Novel[]) || [];

  if (novelList.length === 0) {
    notFound();
  }

  const totalReads = novelList.reduce((acc, n) => acc + (n.view_count || 0), 0);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Authors", url: `${SITE_URL}/novels` },
          { name: decodedName, url: `${SITE_URL}/authors/${encodeURIComponent(name)}` },
        ]}
      />

      {/* Author Header */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-primary) 100%)",
          borderBottom: "1px solid var(--border-color)",
          padding: "3.5rem 0 3rem",
        }}
      >
        <div className="container-main">
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1F5FE0, #5BB8F5)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                fontWeight: 700,
                boxShadow: "0 6px 18px rgba(31, 95, 224, 0.3)",
              }}
            >
              {decodedName[0]}
            </div>

            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.2rem" }}>
                <Award size={14} /> Verified Author
              </div>
              <h1 className="h1" style={{ margin: "0 0 0.5rem" }}>{decodedName}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", color: "var(--text-secondary)", fontSize: "0.88rem" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <BookOpen size={15} color="var(--accent)" />
                  <strong>{novelList.length}</strong> Works Published
                </span>
                <span>•</span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <Eye size={15} color="var(--text-muted)" />
                  <strong>{formatViews(totalReads)}</strong> Total Reads
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Works Grid */}
      <div className="container-main" style={{ padding: "3rem 1.25rem 6rem" }}>
        <div className="section-title">
          <div className="section-title-left">
            <div className="section-title-bar" />
            <h2 className="h2" style={{ margin: 0 }}>Published Novels ({novelList.length})</h2>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {novelList.map((novel) => (
            <NovelCard key={novel.id} novel={novel} />
          ))}
        </div>
      </div>
    </>
  );
}
