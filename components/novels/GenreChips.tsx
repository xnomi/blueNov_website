"use client";

import React from "react";
import Link from "next/link";
import { Genre } from "@/types";

interface GenreChipsProps {
  genres: Genre[];
  selectedSlug?: string;
  baseUrl?: string;
}

const GENRE_EMOJIS: Record<string, string> = {
  fantasy: "🧙‍♂️",
  romance: "💖",
  thriller: "⚡",
  "sci-fi": "🚀",
  mystery: "🔍",
  horror: "👻",
  adventure: "🗺️",
  drama: "🎭",
};

export function GenreChips({
  genres,
  selectedSlug,
  baseUrl = "/novels",
}: GenreChipsProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        overflowX: "auto",
        padding: "0.25rem 0 0.5rem",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <Link
        href={baseUrl}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          padding: "0.45rem 1rem",
          borderRadius: "999px",
          fontSize: "0.82rem",
          fontWeight: 600,
          textDecoration: "none",
          whiteSpace: "nowrap",
          background: !selectedSlug ? "var(--accent)" : "var(--bg-card)",
          color: !selectedSlug ? "#FFFFFF" : "var(--text-secondary)",
          border: "1px solid var(--border-color)",
          boxShadow: !selectedSlug ? "0 2px 8px rgba(31, 95, 224, 0.25)" : "none",
          transition: "all 0.15s ease",
        }}
      >
        <span>📚</span>
        <span>All Genres</span>
      </Link>

      {genres.map((g) => {
        const isSelected = selectedSlug === g.slug || selectedSlug === g.id;
        const emoji = GENRE_EMOJIS[g.slug.toLowerCase()] || "📖";

        const href = baseUrl === "/novels" ? `/novels?genre=${g.id}` : `/genre/${g.slug}`;

        return (
          <Link
            key={g.id}
            href={href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.45rem 1rem",
              borderRadius: "999px",
              fontSize: "0.82rem",
              fontWeight: 600,
              textDecoration: "none",
              whiteSpace: "nowrap",
              background: isSelected ? "var(--accent)" : "var(--bg-card)",
              color: isSelected ? "#FFFFFF" : "var(--text-secondary)",
              border: isSelected ? "1px solid var(--accent)" : "1px solid var(--border-color)",
              boxShadow: isSelected ? "0 2px 8px rgba(31, 95, 224, 0.25)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            <span>{emoji}</span>
            <span>{g.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
