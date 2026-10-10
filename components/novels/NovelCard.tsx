"use client";

import Link from "next/link";
import Image from "next/image";
import { Novel } from "@/types";
import { formatViews, statusLabel, truncate, formatCoverUrl } from "@/lib/utils";
import { Eye, BookOpen, Star, Sparkles } from "lucide-react";

interface NovelCardProps {
  novel: Novel;
  size?: "normal" | "compact" | "featured";
  priority?: boolean;
}

const STATUS_CLASS: Record<string, string> = {
  ongoing: "status-ongoing",
  completed: "status-completed",
  hiatus: "status-hiatus",
};

export function NovelCard({ novel, size = "normal", priority = false }: NovelCardProps) {
  // Deterministic mock rating from slug length/char codes so it's consistent
  const rating = (4.3 + (novel.title.charCodeAt(0) % 7) * 0.1).toFixed(1);
  const chapterCount = novel.chapter_count ?? novel.chapters?.length ?? 12;
  const coverUrl = formatCoverUrl(novel.cover_url);

  const isFeatured = size === "featured";
  const isCompact = size === "compact";

  return (
    <Link
      href={`/novels/${novel.slug}`}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
      className="group"
    >
      <article
        className="card"
        style={{
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: "16px",
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
        }}
      >
        {/* Cover 2:3 aspect ratio */}
        <div
          className="aspect-cover"
          style={{
            position: "relative",
            width: "100%",
            background: "linear-gradient(135deg, #0A1F5C 0%, #1F5FE0 100%)",
            overflow: "hidden",
          }}
        >
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={`${novel.title} cover`}
              fill
              priority={priority}
              unoptimized
              sizes={
                isFeatured
                  ? "(max-width: 768px) 100vw, 400px"
                  : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
              }
              style={{
                objectFit: "cover",
                transition: "transform 0.4s cubic-bezier(0.2, 0, 0, 1)",
              }}
              className="group-hover:scale-105"
            />
          ) : (
            <div
              className="cover-placeholder"
              style={{ width: "100%", height: "100%", padding: "1rem" }}
            >
              <div style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                {novel.title.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ fontSize: "0.75rem", opacity: 0.85, maxWidth: "120px" }}>
                {truncate(novel.title, 25)}
              </div>
            </div>
          )}

          {/* Top Overlays: Status Badge & Genre */}
          <div
            style={{
              position: "absolute",
              top: "0.6rem",
              left: "0.6rem",
              right: "0.6rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "0.4rem",
              pointerEvents: "none",
            }}
          >
            <span
              className={`badge ${STATUS_CLASS[novel.status] || ""}`}
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              {statusLabel(novel.status)}
            </span>

            {novel.genre && (
              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  padding: "0.18rem 0.55rem",
                  borderRadius: "999px",
                  background: "rgba(10, 31, 92, 0.82)",
                  color: "#EEF4FD",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                {novel.genre.name}
              </span>
            )}
          </div>

          {/* Bottom Overlay Gradient for Cover */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "45%",
              background: "linear-gradient(to top, rgba(10, 31, 92, 0.85) 0%, transparent 100%)",
              display: "flex",
              alignItems: "flex-end",
              padding: "0.5rem 0.75rem",
              color: "#FFFFFF",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                fontSize: "0.75rem",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#FBBF24", fontWeight: 700 }}>
                <Star size={13} fill="#FBBF24" />
                {rating}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#EEF4FD", opacity: 0.9 }}>
                <BookOpen size={13} />
                {chapterCount} Ch.
              </span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div style={{ padding: "0.875rem", display: "flex", flexDirection: "column", flex: 1 }}>
          <h3
            style={{
              fontSize: isFeatured ? "1.15rem" : isCompact ? "0.9rem" : "0.95rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.3,
              marginBottom: "0.3rem",
            }}
          >
            {truncate(novel.title, isFeatured ? 55 : 42)}
          </h3>

          {novel.author && (
            <p
              style={{
                fontSize: "0.78rem",
                color: "var(--text-secondary)",
                fontWeight: 500,
                marginBottom: "0.5rem",
              }}
            >
              by <span style={{ color: "var(--accent)" }}>{novel.author}</span>
            </p>
          )}

          {novel.description && !isCompact && (
            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                lineHeight: 1.45,
                marginBottom: "0.75rem",
                flex: 1,
              }}
            >
              {truncate(novel.description, isFeatured ? 110 : 70)}
            </p>
          )}

          {/* Footer Stats */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "0.72rem",
              color: "var(--text-muted)",
              marginTop: "auto",
              paddingTop: "0.5rem",
              borderTop: "1px solid var(--border-color)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Eye size={12} />
              {formatViews(novel.view_count || 0)} reads
            </span>
            <span style={{ color: "var(--accent)", fontWeight: 600 }}>
              Read Now →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
