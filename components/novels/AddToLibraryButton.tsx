"use client";

import React, { useState, useEffect } from "react";
import { Bookmark, ChevronDown, Check, Trash2, Heart } from "lucide-react";
import { useReadingProgress, LibraryShelf } from "@/hooks/useReadingProgress";
import { Novel } from "@/types";

interface AddToLibraryButtonProps {
  novel: Pick<Novel, "id" | "title" | "slug" | "cover_url" | "author"> & {
    genre?: { name: string };
  };
}

const SHELVES: { id: LibraryShelf; label: string }[] = [
  { id: "reading", label: "Currently Reading" },
  { id: "plan_to_read", label: "Plan to Read" },
  { id: "completed", label: "Completed" },
  { id: "favorites", label: "Favorites" },
];

export function AddToLibraryButton({ novel }: AddToLibraryButtonProps) {
  const { library, setShelf, removeFromLibrary } = useReadingProgress();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="btn-secondary" style={{ padding: "0.65rem 1.25rem" }}>
        <Bookmark size={16} /> Add to Library
      </button>
    );
  }

  const currentItem = library[novel.slug];
  const currentShelf = currentItem?.shelf;

  const handleSelectShelf = (shelf: LibraryShelf) => {
    setShelf({
      novelId: novel.id,
      title: novel.title,
      slug: novel.slug,
      cover_url: novel.cover_url,
      author: novel.author,
      genre: novel.genre?.name,
      shelf,
    });
    setDropdownOpen(false);
  };

  const handleRemove = () => {
    removeFromLibrary(novel.slug);
    setDropdownOpen(false);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={currentShelf ? "btn-primary" : "btn-secondary"}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.65rem 1.25rem",
          fontSize: "0.9375rem",
        }}
      >
        {currentShelf === "favorites" ? (
          <Heart size={16} fill="currentColor" />
        ) : (
          <Bookmark size={16} fill={currentShelf ? "currentColor" : "none"} />
        )}
        <span>
          {currentShelf
            ? SHELVES.find((s) => s.id === currentShelf)?.label
            : "Add to Library"}
        </span>
        <ChevronDown size={14} />
      </button>

      {dropdownOpen && (
        <>
          <div
            onClick={() => setDropdownOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 100 }}
          />
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              zIndex: 110,
              minWidth: "200px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "14px",
              boxShadow: "var(--shadow-lg)",
              padding: "0.4rem",
              animation: "fadeIn 0.15s ease forwards",
            }}
          >
            {SHELVES.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectShelf(s.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "0.55rem 0.75rem",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  fontWeight: currentShelf === s.id ? 600 : 400,
                  background: currentShelf === s.id ? "var(--accent-light)" : "transparent",
                  color: currentShelf === s.id ? "var(--accent)" : "var(--text-primary)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (currentShelf !== s.id) {
                    e.currentTarget.style.background = "var(--bg-secondary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentShelf !== s.id) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <span>{s.label}</span>
                {currentShelf === s.id && <Check size={14} />}
              </button>
            ))}

            {currentShelf && (
              <>
                <div style={{ height: "1px", background: "var(--border-color)", margin: "0.3rem 0" }} />
                <button
                  onClick={handleRemove}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "8px",
                    fontSize: "0.82rem",
                    color: "#EF4444",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <Trash2 size={13} /> Remove from Library
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
