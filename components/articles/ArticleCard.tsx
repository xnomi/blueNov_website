"use client";

import Link from "next/link";
import Image from "next/image";
import { Article } from "@/types";
import { formatDateShort, formatViews, truncate } from "@/lib/utils";
import { Eye, Clock, Tag } from "lucide-react";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.slug}`} style={{ textDecoration: "none", display: "block" }}>
      <article
        className="card"
        style={{
          overflow: "hidden",
          display: featured ? "grid" : "block",
          gridTemplateColumns: featured ? "300px 1fr" : undefined,
        }}
      >
        {/* Cover */}
        <div style={{ height: featured ? "100%" : "200px", minHeight: featured ? "220px" : undefined, position: "relative", overflow: "hidden" }}>
          {article.cover_url ? (
            <Image
              src={article.cover_url}
              alt={`${article.title} cover`}
              fill
              style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            <div
              style={{
                width: "100%", height: "100%", minHeight: "200px",
                background: "linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2.5rem",
              }}
            >
              📰
            </div>
          )}
          {/* Category */}
          <div style={{ position: "absolute", top: "0.5rem", left: "0.5rem" }}>
            <span className="badge">{article.category}</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "1.125rem" }}>
          <h3 style={{
            fontWeight: 700,
            fontSize: featured ? "1.25rem" : "1rem",
            marginBottom: "0.5rem",
            color: "var(--text-primary)",
            lineHeight: 1.3,
            fontFamily: featured ? "var(--font-serif)" : "var(--font-sans)",
          }}>
            {truncate(article.title, featured ? 100 : 70)}
          </h3>

          {article.excerpt && (
            <p className="body-sm" style={{ color: "var(--text-secondary)", marginBottom: "0.75rem", lineHeight: 1.65 }}>
              {truncate(article.excerpt, featured ? 200 : 100)}
            </p>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", fontSize: "0.75rem", color: "var(--text-muted)", flexWrap: "wrap" }}>
            {article.author && (
              <span style={{ fontWeight: 500, color: "var(--accent)" }}>{article.author}</span>
            )}
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Clock size={12} />
              {formatDateShort(article.created_at)}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Eye size={12} />
              {formatViews(article.view_count)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
