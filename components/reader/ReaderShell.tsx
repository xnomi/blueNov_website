"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Sliders,
  Bookmark,
  Share2,
  Volume2,
  VolumeX,
  ArrowLeft,
  Sun,
  Moon,
  Clock,
  BookOpen,
  Home,
} from "lucide-react";
import { Chapter, Novel } from "@/types";
import { useReaderSettings } from "@/hooks/useReaderSettings";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import { ReaderProgressBar } from "./ReaderProgressBar";
import { ChapterDrawer } from "./ChapterDrawer";
import { ReaderSettingsSheet } from "./ReaderSettingsSheet";

interface ReaderShellProps {
  novel: Pick<Novel, "id" | "title" | "slug" | "cover_url" | "author">;
  chapter: Chapter;
  chapters: Pick<Chapter, "id" | "slug" | "title" | "chapter_number">[];
  prevChapter?: Pick<Chapter, "slug" | "title" | "chapter_number"> | null;
  nextChapter?: Pick<Chapter, "slug" | "title" | "chapter_number"> | null;
}

export function ReaderShell({
  novel,
  chapter,
  chapters,
  prevChapter,
  nextChapter,
}: ReaderShellProps) {
  const router = useRouter();

  // Settings
  const {
    readingMode,
    focusMode,
    autoHideUI,
    keepAwake,
    blueLightFilter,
    speechRate,
  } = useReaderSettings();

  const { saveProgress, getProgress } = useReadingProgress();

  // UI state
  const [uiVisible, setUiVisible] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const lastScrollY = useRef(0);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const pagedViewportRef = useRef<HTMLDivElement | null>(null);
  const wakeLockRef = useRef<any>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Estimate read time
  const wordCount = chapter.content
    ? chapter.content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length
    : 400;
  const estimatedMinutes = Math.max(1, Math.round(wordCount / 220));

  // ── Wake Lock API ──────────────────────────────────────────
  useEffect(() => {
    let released = false;
    const requestLock = async () => {
      if (keepAwake && "wakeLock" in navigator && !wakeLockRef.current) {
        try {
          wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
        } catch (e) {
          console.warn("Wake Lock error:", e);
        }
      }
    };

    if (keepAwake) {
      requestLock();
    } else if (wakeLockRef.current) {
      wakeLockRef.current.release();
      wakeLockRef.current = null;
    }

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };
  }, [keepAwake]);

  // ── Auto-Save Progress ─────────────────────────────────────
  const recordProgress = useCallback(
    (percent: number) => {
      setProgressPercent(percent);
      saveProgress({
        novelSlug: novel.slug,
        novelTitle: novel.title,
        novelCover: novel.cover_url,
        author: novel.author,
        lastChapterSlug: chapter.slug,
        lastChapterNumber: chapter.chapter_number,
        lastChapterTitle: chapter.title,
        totalChapters: chapters.length,
        percent: Math.round(percent),
        updatedAt: new Date().toISOString(),
      });
    },
    [novel, chapter, chapters, saveProgress]
  );

  // ── Scroll Listener for auto-hiding UI & progress ─────────
  useEffect(() => {
    if (readingMode === "paged") return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (currentScrollY / docHeight) * 100 : 0;

      recordProgress(scrollPercent);

      // Auto-hide top & bottom bars on scroll down, reveal on scroll up
      if (autoHideUI && !focusMode) {
        if (currentScrollY > 100 && currentScrollY > lastScrollY.current + 8) {
          setUiVisible(false);
        } else if (currentScrollY < lastScrollY.current - 12 || currentScrollY <= 80) {
          setUiVisible(true);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [readingMode, autoHideUI, focusMode, recordProgress]);

  // ── Keyboard Navigation ────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === "ArrowLeft") {
        if (readingMode === "paged" && pageIndex > 0) {
          setPageIndex((p) => p - 1);
        } else if (prevChapter) {
          router.push(`/novels/${novel.slug}/${prevChapter.slug}`);
        }
      } else if (e.key === "ArrowRight") {
        if (readingMode === "paged" && pageIndex < totalPages - 1) {
          setPageIndex((p) => p + 1);
        } else if (nextChapter) {
          router.push(`/novels/${novel.slug}/${nextChapter.slug}`);
        }
      } else if (e.key.toLowerCase() === "j") {
        window.scrollBy({ top: 300, behavior: "smooth" });
      } else if (e.key.toLowerCase() === "k") {
        window.scrollBy({ top: -300, behavior: "smooth" });
      } else if (e.key === " " && readingMode === "scroll") {
        e.preventDefault();
        window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevChapter, nextChapter, novel.slug, readingMode, pageIndex, totalPages, router]);

  // ── Paged Mode Column Width & Paging ───────────────────────
  useEffect(() => {
    if (readingMode === "paged" && pagedViewportRef.current && contentRef.current) {
      const viewportWidth = pagedViewportRef.current.clientWidth;
      const scrollWidth = contentRef.current.scrollWidth;
      const count = Math.max(1, Math.ceil(scrollWidth / (viewportWidth + 48)));
      setTotalPages(count);
      setProgressPercent(Math.round(((pageIndex + 1) / count) * 100));
    }
  }, [readingMode, pageIndex, chapter.content]);

  // ── Text-to-Speech (TTS) ───────────────────────────────────
  const toggleSpeech = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-Speech is not supported on this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const plainText = contentRef.current?.innerText || "";
    if (!plainText) return;

    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = speechRate;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    speechUtteranceRef.current = utterance;

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // ── Share Action ───────────────────────────────────────────
  const handleShare = async () => {
    const url = window.location.href;
    const title = `${novel.title} — Chapter ${chapter.chapter_number}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text: `Read Chapter ${chapter.chapter_number} of ${novel.title}`, url });
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(url);
      alert("Chapter link copied to clipboard!");
    }
  };

  // Center click toggles UI
  const handleCenterTap = (e: React.MouseEvent) => {
    const x = e.clientX;
    const width = window.innerWidth;

    if (readingMode === "paged") {
      // Left 28% -> prev page, Right 28% -> next page, Center 44% -> toggle UI
      if (x < width * 0.28) {
        if (pageIndex > 0) setPageIndex((p) => p - 1);
        else if (prevChapter) router.push(`/novels/${novel.slug}/${prevChapter.slug}`);
      } else if (x > width * 0.72) {
        if (pageIndex < totalPages - 1) setPageIndex((p) => p + 1);
        else if (nextChapter) router.push(`/novels/${novel.slug}/${nextChapter.slug}`);
      } else {
        setUiVisible((prev) => !prev);
      }
    } else {
      // In scroll mode, clicking margins/canvas outside interactive elements toggles UI
      if ((e.target as HTMLElement).tagName !== "A" && (e.target as HTMLElement).tagName !== "BUTTON") {
        setUiVisible((prev) => !prev);
      }
    }
  };

  const showBars = uiVisible && !focusMode;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--reader-bg)",
        color: "var(--reader-text)",
        position: "relative",
        transition: "background 0.25s ease, color 0.25s ease",
      }}
    >
      {/* Prefetch Next Chapter */}
      {nextChapter && (
        <link rel="prefetch" href={`/novels/${novel.slug}/${nextChapter.slug}`} />
      )}

      {/* Blue Light / Warmth Filter */}
      {blueLightFilter > 0 && <div className="reader-warmth-overlay" />}

      {/* Progress Bar (Always thin at very top) */}
      <ReaderProgressBar
        progressPercent={progressPercent}
        currentChapterNumber={chapter.chapter_number}
        totalChapters={chapters.length}
        estimatedMinutes={estimatedMinutes}
      />

      {/* ── Auto-hiding Top Header Bar ────────────────────────── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 80,
          background: "var(--header-bg)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border-color)",
          transform: showBars ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: showBars ? "var(--shadow-sm)" : "none",
        }}
      >
        <div
          className="container-main"
          style={{
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
        >
          {/* Left: Back to Novel / Home */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 }}>
            <Link
              href={`/novels/${novel.slug}`}
              className="btn-ghost"
              style={{ padding: "0.4rem 0.65rem", fontSize: "0.85rem", gap: "0.35rem" }}
              title="Return to Novel Details"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline" style={{ maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {novel.title}
              </span>
            </Link>
          </div>

          {/* Center: Chapter indicator */}
          <div
            style={{
              textAlign: "center",
              minWidth: 0,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                maxWidth: "280px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Chapter {chapter.chapter_number}: {chapter.title}
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              {Math.round(progressPercent)}% read • ~{estimatedMinutes} min
            </span>
          </div>

          {/* Right: Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            {/* TOC Drawer button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="btn-ghost"
              style={{ padding: "0.45rem" }}
              title="Table of Contents"
              aria-label="Table of Contents"
            >
              <Menu size={18} />
            </button>

            {/* TTS Listen Button */}
            <button
              onClick={toggleSpeech}
              className="btn-ghost"
              style={{
                padding: "0.45rem",
                color: isSpeaking ? "var(--accent)" : "inherit",
              }}
              title={isSpeaking ? "Pause Audio" : "Listen to chapter"}
              aria-label="Listen to chapter"
            >
              {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="btn-ghost"
              style={{ padding: "0.45rem" }}
              title="Share Chapter"
              aria-label="Share"
            >
              <Share2 size={18} />
            </button>

            {/* Settings */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="btn-ghost"
              style={{ padding: "0.45rem" }}
              title="Reader Settings"
              aria-label="Reader Settings"
            >
              <Sliders size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Reading Canvas ───────────────────────────────── */}
      <main
        onClick={handleCenterTap}
        style={{
          padding: "2.5rem 1.25rem 6rem",
          cursor: readingMode === "paged" ? "default" : "auto",
        }}
      >
        <div className="reader-canvas">
          {/* Chapter Meta Header */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--accent)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.5rem",
              }}
            >
              Chapter {chapter.chapter_number}
            </p>
            <h1
              style={{
                fontFamily: "var(--reader-font-family, serif)",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 700,
                color: "var(--reader-text)",
                lineHeight: 1.2,
                marginBottom: "0.875rem",
              }}
            >
              {chapter.title}
            </h1>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "1rem",
                fontSize: "0.8rem",
                color: "var(--text-muted)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Clock size={13} /> {estimatedMinutes} min read
              </span>
              <span>•</span>
              <span>{wordCount.toLocaleString()} words</span>
            </div>
          </div>

          {/* Chapter Content */}
          {readingMode === "scroll" ? (
            <div
              ref={contentRef}
              dangerouslySetInnerHTML={{ __html: chapter.content }}
              style={{ minHeight: "60vh" }}
            />
          ) : (
            <div className="reader-paged-viewport" ref={pagedViewportRef}>
              <div
                ref={contentRef}
                className="reader-paged-columns"
                style={{
                  transform: `translateX(-${pageIndex * (pagedViewportRef.current?.clientWidth || 720) + pageIndex * 48}px)`,
                }}
                dangerouslySetInnerHTML={{ __html: chapter.content }}
              />
            </div>
          )}

          {/* Scene Break / Divider */}
          <div className="scene-break" />

          {/* End of Chapter Navigation Buttons */}
          <div
            style={{
              marginTop: "3rem",
              paddingTop: "2rem",
              borderTop: "1px solid var(--border-color)",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                gap: "0.75rem",
                alignItems: "center",
              }}
            >
              {/* Prev Chapter */}
              <div>
                {prevChapter ? (
                  <Link
                    href={`/novels/${novel.slug}/${prevChapter.slug}`}
                    className="btn-secondary"
                    style={{ width: "100%", fontSize: "0.875rem", padding: "0.65rem 0.85rem" }}
                  >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">Prev Ch. {prevChapter.chapter_number}</span>
                    <span className="sm:hidden">Prev</span>
                  </Link>
                ) : (
                  <div />
                )}
              </div>

              {/* Center: TOC */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="btn-ghost"
                style={{ fontSize: "0.85rem", padding: "0.65rem 1rem" }}
              >
                <BookOpen size={16} /> All Chapters
              </button>

              {/* Next Chapter */}
              <div style={{ textAlign: "right" }}>
                {nextChapter ? (
                  <Link
                    href={`/novels/${novel.slug}/${nextChapter.slug}`}
                    className="btn-primary"
                    style={{ width: "100%", fontSize: "0.875rem", padding: "0.65rem 0.85rem" }}
                  >
                    <span className="hidden sm:inline">Next Ch. {nextChapter.chapter_number}</span>
                    <span className="sm:hidden">Next</span>
                    <ChevronRight size={16} />
                  </Link>
                ) : (
                  <Link
                    href={`/novels/${novel.slug}`}
                    className="btn-primary"
                    style={{ width: "100%", fontSize: "0.875rem" }}
                  >
                    Novel Overview
                  </Link>
                )}
              </div>
            </div>

            {/* Reading shortcuts helper for desktop */}
            <p
              className="caption hidden sm:block"
              style={{ textAlign: "center", color: "var(--text-muted)", marginTop: "0.5rem" }}
            >
              Keyboard shortcuts: <strong>←</strong> Prev chapter &nbsp;•&nbsp; <strong>→</strong> Next chapter &nbsp;•&nbsp; <strong>J / K</strong> Scroll up/down
            </p>
          </div>
        </div>
      </main>

      {/* ── Auto-hiding Bottom Bar ────────────────────────────── */}
      <footer
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 80,
          background: "var(--header-bg)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid var(--border-color)",
          transform: showBars ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div
          className="container-main"
          style={{
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Prev */}
          {prevChapter ? (
            <Link
              href={`/novels/${novel.slug}/${prevChapter.slug}`}
              className="btn-ghost"
              style={{ fontSize: "0.85rem", gap: "0.3rem" }}
            >
              <ChevronLeft size={16} /> Ch. {prevChapter.chapter_number}
            </Link>
          ) : (
            <div style={{ width: "80px" }} />
          )}

          {/* Quick TOC button */}
          <button
            onClick={() => setDrawerOpen(true)}
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "999px",
              padding: "0.35rem 1rem",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Menu size={14} /> Ch. {chapter.chapter_number} / {chapters.length}
          </button>

          {/* Next */}
          {nextChapter ? (
            <Link
              href={`/novels/${novel.slug}/${nextChapter.slug}`}
              className="btn-primary"
              style={{ fontSize: "0.85rem", padding: "0.45rem 1rem", gap: "0.3rem" }}
            >
              Ch. {nextChapter.chapter_number} <ChevronRight size={16} />
            </Link>
          ) : (
            <Link
              href={`/novels/${novel.slug}`}
              className="btn-ghost"
              style={{ fontSize: "0.85rem" }}
            >
              Completed
            </Link>
          )}
        </div>
      </footer>

      {/* ── Table of Contents Drawer ─────────────────────────── */}
      <ChapterDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        novelSlug={novel.slug}
        novelTitle={novel.title}
        chapters={chapters}
        currentChapterSlug={chapter.slug}
      />

      {/* ── Personalization Panel Bottom Sheet ───────────────── */}
      <ReaderSettingsSheet
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onToggleSpeech={toggleSpeech}
        isSpeaking={isSpeaking}
      />
    </div>
  );
}
