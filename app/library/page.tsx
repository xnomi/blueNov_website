"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bookmark,
  Clock,
  CheckCircle,
  Heart,
  BookOpen,
  Trash2,
  Compass,
  ArrowRight,
} from "lucide-react";
import { useReadingProgress, LibraryShelf } from "@/hooks/useReadingProgress";
import { formatCoverUrl } from "@/lib/utils";

const TABS: { id: LibraryShelf | "history"; label: string; icon: any }[] = [
  { id: "reading", label: "Currently Reading", icon: BookOpen },
  { id: "plan_to_read", label: "Plan to Read", icon: Bookmark },
  { id: "completed", label: "Completed", icon: CheckCircle },
  { id: "favorites", label: "Favorites", icon: Heart },
  { id: "history", label: "Reading History", icon: Clock },
];

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<LibraryShelf | "history">("reading");
  const [mounted, setMounted] = useState(false);
  const { library, progress, removeFromLibrary, clearHistory } = useReadingProgress();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container-main" style={{ padding: "4rem 1.25rem" }}>
        <div className="skeleton" style={{ height: "40px", width: "240px", marginBottom: "2rem" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: "140px", borderRadius: "16px" }} />
          ))}
        </div>
      </div>
    );
  }

  const shelfItems =
    activeTab === "history"
      ? []
      : Object.values(library).filter((item) => item.shelf === activeTab);

  const historyItems = Object.values(progress).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="container-main" style={{ padding: "3rem 1.25rem 6rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
          <Bookmark size={28} color="var(--accent)" />
          <h1 className="h2" style={{ margin: 0 }}>My Personal Library</h1>
        </div>
        <p style={{ color: "var(--text-secondary)", margin: 0 }}>
          Track reading progress, save favorites, and organize novels on your personal shelf.
        </p>
      </div>

      {/* Shelf Tabs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          overflowX: "auto",
          paddingBottom: "0.5rem",
          marginBottom: "2rem",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const count =
            tab.id === "history"
              ? historyItems.length
              : Object.values(library).filter((i) => i.shelf === tab.id).length;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.6rem 1.1rem",
                borderRadius: "10px",
                fontSize: "0.88rem",
                fontWeight: isActive ? 700 : 500,
                background: isActive ? "var(--accent-light)" : "transparent",
                color: isActive ? "var(--accent)" : "var(--text-secondary)",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: "0.72rem",
                  padding: "0.1rem 0.45rem",
                  borderRadius: "999px",
                  background: isActive ? "var(--accent)" : "var(--bg-secondary)",
                  color: isActive ? "#FFFFFF" : "var(--text-muted)",
                  fontWeight: 600,
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "history" ? (
        /* Reading History */
        historyItems.length === 0 ? (
          <EmptyState
            title="No Reading History Yet"
            description="As you read chapters, your progress and last positions will appear here automatically."
          />
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
              <button
                onClick={clearHistory}
                className="btn-ghost"
                style={{ fontSize: "0.8rem", color: "#EF4444" }}
              >
                <Trash2 size={13} /> Clear History
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {historyItems.map((item) => (
                <div
                  key={item.novelSlug}
                  className="card"
                  style={{
                    padding: "1rem 1.25rem",
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "85px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      position: "relative",
                      flexShrink: 0,
                      background: "linear-gradient(135deg, #0A1F5C, #1F5FE0)",
                    }}
                  >
                    {formatCoverUrl(item.novelCover) ? (
                      <Image
                        src={formatCoverUrl(item.novelCover)!}
                        alt={item.novelTitle}
                        fill
                        unoptimized
                        style={{ objectFit: "cover" }}
                        sizes="60px"
                      />
                    ) : (
                      <div className="cover-placeholder" style={{ width: "100%", height: "100%", fontSize: "1.2rem" }}>
                        {item.novelTitle.slice(0, 2)}
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        margin: "0 0 0.2rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.novelTitle}
                    </h3>

                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-secondary)",
                        margin: "0 0 0.5rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Ch. {item.lastChapterNumber}: {item.lastChapterTitle}
                    </p>

                    {/* Progress Bar */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                      <div
                        style={{
                          flex: 1,
                          height: "4px",
                          background: "var(--border-color)",
                          borderRadius: "999px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${item.percent}%`,
                            height: "100%",
                            background: "var(--accent)",
                          }}
                        />
                      </div>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>
                        {item.percent}%
                      </span>
                    </div>

                    <Link
                      href={`/novels/${item.novelSlug}/${item.lastChapterSlug}`}
                      className="btn-primary"
                      style={{
                        padding: "0.4rem 0.85rem",
                        fontSize: "0.8rem",
                        width: "100%",
                      }}
                    >
                      Continue Ch. {item.lastChapterNumber} <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ) : /* Shelf Items */
      shelfItems.length === 0 ? (
        <EmptyState
          title={`No Novels in "${TABS.find((t) => t.id === activeTab)?.label}"`}
          description="Explore our novel library and click 'Add to Library' to save stories to this shelf."
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {shelfItems.map((item) => {
            const novelProg = progress[item.slug];
            return (
              <div
                key={item.slug}
                className="card"
                style={{
                  padding: "1rem 1.25rem",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "65px",
                    height: "92px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    position: "relative",
                    flexShrink: 0,
                    background: "linear-gradient(135deg, #0A1F5C, #1F5FE0)",
                  }}
                >
                  {formatCoverUrl(item.cover_url) ? (
                    <Image
                      src={formatCoverUrl(item.cover_url)!}
                      alt={item.title}
                      fill
                      unoptimized
                      style={{ objectFit: "cover" }}
                      sizes="65px"
                    />
                  ) : (
                    <div className="cover-placeholder" style={{ width: "100%", height: "100%", fontSize: "1.25rem" }}>
                      {item.title.slice(0, 2)}
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <h3
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        margin: "0 0 0.2rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "180px",
                      }}
                    >
                      {item.title}
                    </h3>
                    <button
                      onClick={() => removeFromLibrary(item.slug)}
                      title="Remove from shelf"
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        padding: "0.2rem",
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {item.author && (
                    <p style={{ fontSize: "0.78rem", color: "var(--accent)", margin: "0 0 0.4rem" }}>
                      by {item.author}
                    </p>
                  )}

                  {novelProg && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                      <div
                        style={{
                          flex: 1,
                          height: "4px",
                          background: "var(--border-color)",
                          borderRadius: "999px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${novelProg.percent}%`,
                            height: "100%",
                            background: "var(--accent)",
                          }}
                        />
                      </div>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>
                        {novelProg.percent}%
                      </span>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <Link
                      href={`/novels/${item.slug}`}
                      className="btn-secondary"
                      style={{ flex: 1, padding: "0.4rem 0.5rem", fontSize: "0.78rem" }}
                    >
                      Overview
                    </Link>
                    <Link
                      href={
                        novelProg
                          ? `/novels/${item.slug}/${novelProg.lastChapterSlug}`
                          : `/novels/${item.slug}/chapter-1`
                      }
                      className="btn-primary"
                      style={{ flex: 1.2, padding: "0.4rem 0.5rem", fontSize: "0.78rem" }}
                    >
                      {novelProg ? `Resume Ch. ${novelProg.lastChapterNumber}` : "Read"}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div
      className="card"
      style={{
        textAlign: "center",
        padding: "4rem 1.5rem",
        background: "var(--bg-card)",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "14px",
          background: "var(--accent-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.25rem",
        }}
      >
        <Compass size={28} color="var(--accent)" />
      </div>
      <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.4rem" }}>{title}</h3>
      <p style={{ color: "var(--text-secondary)", maxWidth: "420px", margin: "0 auto 1.5rem", fontSize: "0.9rem" }}>
        {description}
      </p>
      <Link href="/novels" className="btn-primary" style={{ padding: "0.6rem 1.5rem" }}>
        Discover Novels <ArrowRight size={16} />
      </Link>
    </div>
  );
}
