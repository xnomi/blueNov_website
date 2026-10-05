"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import { BookOpen, ArrowRight, Sparkles, Clock } from "lucide-react";
import { formatCoverUrl } from "@/lib/utils";

export function ContinueReadingCard() {
  const { getRecentProgress } = useReadingProgress();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="card"
        style={{
          padding: "1.5rem",
          borderRadius: "16px",
          minHeight: "130px",
          display: "flex",
          alignItems: "center",
          background: "var(--bg-card)",
        }}
      >
        <div className="skeleton" style={{ width: "100%", height: "80px" }} />
      </div>
    );
  }

  const recents = getRecentProgress();
  const latest = recents[0];

  if (!latest) {
    return (
      <div
        className="card"
        style={{
          padding: "1.5rem",
          borderRadius: "16px",
          background: "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)",
          border: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "var(--accent-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Sparkles size={24} color="var(--accent)" />
          </div>
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "0 0 0.2rem" }}>
              Start Your First Journey
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
              Over 80 curated web novels across Fantasy, Romance, Sci-Fi, and Mystery.
            </p>
          </div>
        </div>

        <Link href="/novels" className="btn-primary" style={{ padding: "0.55rem 1.25rem", fontSize: "0.875rem" }}>
          Explore Library <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div
      className="card"
      style={{
        padding: "1.25rem 1.5rem",
        borderRadius: "16px",
        background: "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)",
        border: "1px solid var(--accent)",
        boxShadow: "0 8px 24px -6px rgba(31, 95, 224, 0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1.5rem",
        flexWrap: "wrap",
      }}
    >
      {/* Novel info */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", minWidth: 0 }}>
        {/* Cover thumbnail */}
        <div
          style={{
            width: "56px",
            height: "80px",
            borderRadius: "8px",
            overflow: "hidden",
            position: "relative",
            flexShrink: 0,
            background: "linear-gradient(135deg, #0A1F5C, #1F5FE0)",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          }}
        >
          {formatCoverUrl(latest.novelCover) ? (
            <Image
              src={formatCoverUrl(latest.novelCover)!}
              alt={latest.novelTitle}
              fill
              unoptimized
              style={{ objectFit: "cover" }}
              sizes="56px"
            />
          ) : (
            <div className="cover-placeholder" style={{ width: "100%", height: "100%", fontSize: "1rem" }}>
              {latest.novelTitle.slice(0, 2)}
            </div>
          )}
        </div>

        {/* Text */}
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "var(--accent)",
              marginBottom: "0.2rem",
            }}
          >
            <BookOpen size={12} /> Continue Reading
          </div>
          <h3
            style={{
              fontSize: "1.05rem",
              fontWeight: 700,
              margin: "0 0 0.2rem",
              color: "var(--text-primary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "360px",
            }}
          >
            {latest.novelTitle}
          </h3>
          <p
            style={{
              fontSize: "0.82rem",
              color: "var(--text-secondary)",
              margin: "0 0 0.5rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Chapter {latest.lastChapterNumber}: {latest.lastChapterTitle}
          </p>

          {/* Progress bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", maxWidth: "260px" }}>
            <div
              style={{
                flex: 1,
                height: "5px",
                background: "var(--border-color)",
                borderRadius: "999px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${latest.percent}%`,
                  height: "100%",
                  background: "var(--accent)",
                  borderRadius: "999px",
                }}
              />
            </div>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)" }}>
              {latest.percent}%
            </span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <Link
        href={`/novels/${latest.novelSlug}/${latest.lastChapterSlug}`}
        className="btn-primary"
        style={{ padding: "0.65rem 1.35rem", whiteSpace: "nowrap", gap: "0.5rem" }}
      >
        Resume Chapter {latest.lastChapterNumber} <ArrowRight size={16} />
      </Link>
    </div>
  );
}
