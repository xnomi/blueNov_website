"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { X, Search, BookOpen, CheckCircle, ArrowRight } from "lucide-react";
import { Chapter } from "@/types";

interface ChapterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  novelSlug: string;
  novelTitle: string;
  chapters: Pick<Chapter, "id" | "slug" | "title" | "chapter_number">[];
  currentChapterSlug: string;
}

export function ChapterDrawer({
  isOpen,
  onClose,
  novelSlug,
  novelTitle,
  chapters,
  currentChapterSlug,
}: ChapterDrawerProps) {
  const [search, setSearch] = useState("");
  const [jumpNumber, setJumpNumber] = useState("");
  const activeItemRef = useRef<HTMLAnchorElement | null>(null);

  // Auto-scroll active chapter into view when drawer opens
  useEffect(() => {
    if (isOpen && activeItemRef.current) {
      setTimeout(() => {
        activeItemRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 150);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredChapters = chapters.filter((c) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return (
      c.title.toLowerCase().includes(query) ||
      `chapter ${c.chapter_number}`.includes(query) ||
      `${c.chapter_number}` === query
    );
  });

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(jumpNumber.trim(), 10);
    if (!isNaN(num)) {
      const match = chapters.find((c) => c.chapter_number === num);
      if (match) {
        window.location.href = `/novels/${novelSlug}/${match.slug}`;
      }
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.55)",
          backdropFilter: "blur(4px)",
          animation: "fadeIn 0.2s ease forwards",
        }}
      />

      {/* Drawer Container */}
      <div
        style={{
          position: "relative",
          zIndex: 210,
          width: "100%",
          maxWidth: "380px",
          height: "100%",
          background: "var(--bg-card)",
          borderRight: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "var(--shadow-lg)",
          animation: "slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: "1.25rem 1.25rem 1rem",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--bg-secondary)",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--accent)",
              }}
            >
              Table of Contents
            </span>
            <h3
              style={{
                fontSize: "1.05rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                margin: 0,
              }}
            >
              {novelTitle}
            </h3>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {chapters.length} Total Chapters
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close table of contents"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "10px",
              padding: "0.45rem",
              cursor: "pointer",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search & Jump Controls */}
        <div style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid var(--border-color)" }}>
          <div style={{ position: "relative", marginBottom: "0.625rem" }}>
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
              style={{ paddingLeft: "2.25rem", fontSize: "0.875rem", borderRadius: "10px" }}
            />
          </div>

          {/* Jump to # */}
          <form onSubmit={handleJump} style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="number"
              min="1"
              max={chapters.length}
              placeholder={`Jump to ch. (1-${chapters.length})`}
              value={jumpNumber}
              onChange={(e) => setJumpNumber(e.target.value)}
              className="form-input"
              style={{ fontSize: "0.85rem", padding: "0.45rem 0.75rem", borderRadius: "8px", flex: 1 }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: "0.45rem 0.75rem", fontSize: "0.85rem", borderRadius: "8px" }}
            >
              Go <ArrowRight size={14} />
            </button>
          </form>
        </div>

        {/* Chapter List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0.625rem 0.75rem",
          }}
        >
          {filteredChapters.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
              <BookOpen size={32} style={{ margin: "0 auto 0.5rem", opacity: 0.5 }} />
              <p style={{ fontSize: "0.9rem" }}>No matching chapters found</p>
            </div>
          ) : (
            filteredChapters.map((chapter) => {
              const isCurrent = chapter.slug === currentChapterSlug;
              return (
                <Link
                  key={chapter.id}
                  ref={isCurrent ? activeItemRef : null}
                  href={`/novels/${novelSlug}/${chapter.slug}`}
                  onClick={onClose}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "10px",
                    textDecoration: "none",
                    marginBottom: "0.25rem",
                    fontSize: "0.875rem",
                    transition: "all 0.15s ease",
                    background: isCurrent ? "var(--accent-light)" : "transparent",
                    color: isCurrent ? "var(--accent)" : "var(--text-primary)",
                    fontWeight: isCurrent ? 600 : 400,
                    border: isCurrent ? "1px solid var(--accent)" : "1px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrent) {
                      e.currentTarget.style.background = "var(--bg-secondary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrent) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <div style={{ minWidth: 0, paddingRight: "0.5rem" }}>
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: isCurrent ? "var(--accent)" : "var(--text-muted)",
                        marginRight: "0.5rem",
                      }}
                    >
                      Ch. {chapter.chapter_number}
                    </span>
                    <span>{chapter.title}</span>
                  </div>
                  {isCurrent && (
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        background: "var(--accent)",
                        color: "#FFFFFF",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "999px",
                        flexShrink: 0,
                      }}
                    >
                      Reading
                    </span>
                  )}
                </Link>
              );
            })
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
