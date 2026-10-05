"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Chapter } from "@/types";
import { Search, ArrowUpDown, Clock, BookOpen, Check } from "lucide-react";
import { useReadingProgress } from "@/hooks/useReadingProgress";

interface ChapterListProps {
  novelSlug: string;
  chapters: Pick<Chapter, "id" | "slug" | "title" | "chapter_number" | "created_at">[];
}

export function ChapterList({ novelSlug, chapters }: ChapterListProps) {
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [displayCount, setDisplayCount] = useState(30);
  const { getProgress } = useReadingProgress();

  const progress = getProgress(novelSlug);
  const lastReadChapter = progress?.lastChapterNumber ?? 0;

  // Filter
  const filtered = chapters.filter((c) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return (
      c.title.toLowerCase().includes(query) ||
      `chapter ${c.chapter_number}`.includes(query) ||
      `${c.chapter_number}` === query
    );
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    return sortAsc
      ? a.chapter_number - b.chapter_number
      : b.chapter_number - a.chapter_number;
  });

  const visible = sorted.slice(0, displayCount);

  return (
    <div style={{ marginTop: "1rem" }}>
      {/* Controls Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            type="text"
            placeholder="Search chapter title or #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: "2.25rem", fontSize: "0.875rem", height: "40px" }}
          />
        </div>

        {/* Sort Button */}
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="btn-secondary"
          style={{ height: "40px", fontSize: "0.85rem", padding: "0 0.85rem", gap: "0.4rem" }}
        >
          <ArrowUpDown size={15} />
          <span>{sortAsc ? "Ch. 1 → End" : "Ch. End → 1"}</span>
        </button>
      </div>

      {/* Chapters Grid / List */}
      {visible.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
          <BookOpen size={32} style={{ margin: "0 auto 0.5rem", opacity: 0.4 }} />
          <p>No chapters match your search.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "0.5rem",
          }}
        >
          {visible.map((chapter) => {
            const isRead = chapter.chapter_number <= lastReadChapter && lastReadChapter > 0;
            const isCurrent = chapter.chapter_number === lastReadChapter;

            return (
              <Link
                key={chapter.id}
                href={`/novels/${novelSlug}/${chapter.slug}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  background: isCurrent ? "var(--accent-light)" : "var(--bg-card)",
                  border: isCurrent
                    ? "1px solid var(--accent)"
                    : "1px solid var(--border-color)",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  color: isCurrent ? "var(--accent)" : "var(--text-primary)",
                }}
                onMouseEnter={(e) => {
                  if (!isCurrent) {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.background = "var(--bg-card-hover)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCurrent) {
                    e.currentTarget.style.borderColor = "var(--border-color)";
                    e.currentTarget.style.background = "var(--bg-card)";
                  }
                }}
              >
                <div style={{ minWidth: 0, paddingRight: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: isCurrent ? "var(--accent)" : "var(--text-muted)",
                      }}
                    >
                      Ch. {chapter.chapter_number}
                    </span>
                    {isRead && (
                      <span
                        title="Read"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          color: "#10B981",
                        }}
                      >
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: isCurrent ? 600 : 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginTop: "0.1rem",
                    }}
                  >
                    {chapter.title}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--text-muted)",
                    flexShrink: 0,
                  }}
                >
                  {isCurrent ? "Last read" : "Free"}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Show more button if list is long */}
      {sorted.length > displayCount && (
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <button
            onClick={() => setDisplayCount((c) => c + 30)}
            className="btn-secondary"
            style={{ fontSize: "0.875rem" }}
          >
            Show More Chapters ({sorted.length - displayCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
