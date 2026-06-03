"use client";

import Link from "next/link";
import Image from "next/image";
import { Novel } from "@/types";
import { formatDateShort, formatViews, statusLabel, truncate } from "@/lib/utils";
import { Eye, BookOpen, Clock } from "lucide-react";

interface NovelCardProps {
  novel: Novel;
  size?: "normal" | "large";
}

const STATUS_COLORS: Record<string, string> = {
  ongoing: "status-ongoing",
  completed: "status-completed",
  hiatus: "status-hiatus",
};

export function NovelCard({ novel, size = "normal" }: NovelCardProps) {
  const isLarge = size === "large";
  const coverHeight = isLarge ? 280 : 220;

  return (
    <Link
      href={`/novels/${novel.slug}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <article
        className="card"
        style={{ overflow: "hidden", cursor: "pointer" }}
      >
        {/* Cover */}
        <div style={{ height: coverHeight, position: "relative", overflow: "hidden" }}>
          {novel.cover_url ? (
            <Image
              src={novel.cover_url}
              alt={`${novel.title} cover`}
              fill
              style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.transform = "scale(1.04)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.transform = "scale(1)")}
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
            />
          ) : (
            <div
              className="cover-placeholder"
              style={{ width: "100%", height: "100%", fontSize: isLarge ? "3rem" : "2.5rem" }}
            >
              {novel.title.slice(0, 2).toUpperCase()}
            </div>
          )}

          {/* Status badge overlaid */}
          <div style={{ position: "absolute", top: "0.5rem", left: "0.5rem" }}>
            <span className={`badge ${STATUS_COLORS[novel.status] || ""}`} style={{ fontSize: "0.7rem" }}>
              {statusLabel(novel.status)}
            </span>
          </div>

          {/* Genre badge */}
          {novel.genre && (
            <div style={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}>
              <span className="badge">{novel.genre.name}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "0.875rem" }}>
          <h3
            style={{
              fontWeight: 600,
              fontSize: isLarge ? "1.05rem" : "0.9375rem",
              marginBottom: "0.3rem",
              color: "var(--text-primary)",
              lineHeight: 1.3,
            }}
          >
            {truncate(novel.title, isLarge ? 60 : 45)}
          </h3>

          {novel.author && (
            <p className="caption" style={{ color: "var(--accent)", marginBottom: "0.4rem", fontWeight: 500 }}>
              {novel.author}
            </p>
          )}

          {novel.description && (
            <p className="body-sm" style={{ color: "var(--text-secondary)", marginBottom: "0.625rem" }}>
              {truncate(novel.description, 80)}
            </p>
          )}

          {/* Stats */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Eye size={12} />
              {formatViews(novel.view_count)}
            </span>
            {novel.chapter_count !== undefined && (
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <BookOpen size={12} />
                {novel.chapter_count} ch.
              </span>
            )}
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginLeft: "auto" }}>
              <Clock size={12} />
              {formatDateShort(novel.updated_at)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
