"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, Share2, Bookmark } from "lucide-react";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import { AddToLibraryButton } from "./AddToLibraryButton";
import { Novel, Chapter } from "@/types";

interface NovelHeroActionsProps {
  novel: Pick<Novel, "id" | "title" | "slug" | "cover_url" | "author"> & {
    genre?: { name: string };
  };
  firstChapterSlug?: string;
}

export function NovelHeroActions({ novel, firstChapterSlug }: NovelHeroActionsProps) {
  const { getProgress } = useReadingProgress();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const progress = mounted ? getProgress(novel.slug) : undefined;

  const targetSlug = progress?.lastChapterSlug || firstChapterSlug || "chapter-1";
  const buttonLabel = progress
    ? `Continue Ch. ${progress.lastChapterNumber}`
    : "Start Reading Ch. 1";

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: novel.title,
          text: `Read ${novel.title} online for free at BlueNov!`,
          url,
        });
      } catch (e) {}
    } else {
      await navigator.clipboard.writeText(url);
      alert("Novel link copied to clipboard!");
    }
  };

  return (
    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
      {/* Primary Read CTA */}
      <Link
        href={`/novels/${novel.slug}/${targetSlug}`}
        className="btn-primary"
        style={{ padding: "0.75rem 1.6rem", fontSize: "0.95rem" }}
      >
        <BookOpen size={18} />
        <span>{buttonLabel}</span>
        <ArrowRight size={16} />
      </Link>

      {/* Add to Library */}
      <AddToLibraryButton novel={novel} />

      {/* Share */}
      <button
        onClick={handleShare}
        className="btn-secondary"
        style={{ padding: "0.65rem 0.85rem" }}
        title="Share Novel"
        aria-label="Share Novel"
      >
        <Share2 size={16} />
      </button>
    </div>
  );
}
