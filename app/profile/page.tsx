"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Sliders,
  BookOpen,
  Bookmark,
  CheckCircle,
  Clock,
  RotateCcw,
  Sparkles,
  Shield,
  Palette,
  Sun,
  Moon,
  Heart,
  LogOut,
  LogIn,
} from "lucide-react";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import {
  useReaderSettings,
  FontFamily,
  ReadingMode,
  ReaderTheme,
} from "@/hooks/useReaderSettings";
import { useTheme } from "@/components/layout/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const { library, progress, clearHistory } = useReadingProgress();
  const { theme, setTheme: setAppTheme } = useTheme();
  const { user, isAuthenticated, loading: authLoading, signOut } = useAuth();

  const {
    fontFamily,
    fontSize,
    lineHeight,
    readingMode,
    setFontFamily,
    setFontSize,
    setLineHeight,
    setReadingMode,
    resetToDefault,
  } = useReaderSettings();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container-narrow" style={{ padding: "4rem 1.25rem" }}>
        <div className="skeleton" style={{ height: "180px", borderRadius: "16px" }} />
      </div>
    );
  }

  const readingCount = Object.values(library).filter((i) => i.shelf === "reading").length;
  const completedCount = Object.values(library).filter((i) => i.shelf === "completed").length;
  const favoritesCount = Object.values(library).filter((i) => i.shelf === "favorites").length;
  const totalChaptersRead = Object.values(progress).reduce(
    (acc, p) => acc + (p.lastChapterNumber || 1),
    0
  );

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const fullName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Reader";
  const userInitial = (fullName[0] || "U").toUpperCase();

  return (
    <div className="container-narrow" style={{ padding: "3rem 1.25rem 6rem" }}>
      {/* Profile Header */}
      <div
        className="card"
        style={{
          padding: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          marginBottom: "2rem",
          background: "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)",
          flexWrap: "wrap",
        }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={fullName}
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 6px 18px rgba(31, 95, 224, 0.3)",
              border: "3px solid var(--accent)",
            }}
          />
        ) : (
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #1F5FE0, #5BB8F5)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.75rem",
              fontWeight: 700,
              boxShadow: "0 6px 18px rgba(31, 95, 224, 0.3)",
            }}
          >
            {isAuthenticated ? userInitial : <User size={36} />}
          </div>
        )}

        <div style={{ flex: 1, minWidth: "220px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "var(--accent)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.2rem",
            }}
          >
            <Sparkles size={12} />
            {isAuthenticated ? "Authenticated Member" : "Guest Reader"}
          </div>
          <h1 className="h2" style={{ margin: "0 0 0.25rem" }}>
            {isAuthenticated ? fullName : "BlueNov Reader"}
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
            {isAuthenticated
              ? user?.email
              : "All progress and library items are saved directly to this device and browser."}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {isAuthenticated ? (
            <button
              onClick={() => signOut()}
              className="btn-ghost"
              style={{ fontSize: "0.85rem", gap: "0.4rem", color: "#ef4444" }}
            >
              <LogOut size={15} /> Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="btn-primary"
              style={{ fontSize: "0.85rem", gap: "0.45rem", padding: "0.55rem 1rem" }}
            >
              <Image src="/google_icon.png" alt="Google" width={16} height={16} />
              <span>Sign In with Google</span>
            </Link>
          )}

          {user?.email === "admin@bluenov.me" && (
            <Link
              href="/admin"
              className="btn-ghost"
              style={{ fontSize: "0.82rem", gap: "0.4rem" }}
            >
              <Shield size={14} /> Admin
            </Link>
          )}
        </div>
      </div>

      {/* Sync Callout for Guests */}
      {!isAuthenticated && !authLoading && (
        <div
          style={{
            background: "linear-gradient(135deg, rgba(31, 95, 224, 0.08) 0%, rgba(91, 184, 245, 0.08) 100%)",
            border: "1px solid rgba(31, 95, 224, 0.2)",
            borderRadius: "16px",
            padding: "1.25rem 1.5rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem", marginBottom: "0.2rem" }}>
              Sync your library across all devices
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Sign in with your Google account in one click to keep your progress safe.
            </div>
          </div>
          <Link
            href="/login"
            className="btn-primary"
            style={{ fontSize: "0.85rem", gap: "0.5rem" }}
          >
            <Image src="/google_icon.png" alt="Google" width={16} height={16} />
            <span>Connect Google</span>
          </Link>
        </div>
      )}

      {/* Reading Statistics Cards */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h2 className="h3" style={{ marginBottom: "1rem" }}>
          Reading Statistics
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "1rem",
          }}
        >
          <div className="card" style={{ padding: "1.25rem", textAlign: "center" }}>
            <BookOpen
              size={22}
              color="var(--accent)"
              style={{ margin: "0 auto 0.5rem" }}
            />
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "var(--text-primary)",
              }}
            >
              {readingCount}
            </div>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              Reading Now
            </span>
          </div>

          <div className="card" style={{ padding: "1.25rem", textAlign: "center" }}>
            <CheckCircle
              size={22}
              color="#10B981"
              style={{ margin: "0 auto 0.5rem" }}
            />
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "var(--text-primary)",
              }}
            >
              {completedCount}
            </div>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              Completed
            </span>
          </div>

          <div className="card" style={{ padding: "1.25rem", textAlign: "center" }}>
            <Heart
              size={22}
              color="#EF4444"
              style={{ margin: "0 auto 0.5rem" }}
            />
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "var(--text-primary)",
              }}
            >
              {favoritesCount}
            </div>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              Favorites
            </span>
          </div>

          <div className="card" style={{ padding: "1.25rem", textAlign: "center" }}>
            <Clock
              size={22}
              color="#F59E0B"
              style={{ margin: "0 auto 0.5rem" }}
            />
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "var(--text-primary)",
              }}
            >
              {totalChaptersRead}
            </div>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              Chapters Read
            </span>
          </div>
        </div>
      </section>

      {/* Default Reader Settings */}
      <section style={{ marginBottom: "2.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <h2 className="h3" style={{ margin: 0 }}>
            Default Reading Preferences
          </h2>
          <button
            onClick={resetToDefault}
            className="btn-ghost"
            style={{ fontSize: "0.8rem", gap: "0.35rem" }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>

        <div className="card" style={{ padding: "1.5rem" }}>
          {/* Font Family */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label className="form-label" style={{ marginBottom: "0.5rem" }}>
              Reading Font
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: "0.5rem",
              }}
            >
              {(
                [
                  { id: "Literata" as FontFamily, name: "Literata" },
                  { id: "Merriweather" as FontFamily, name: "Merriweather" },
                  { id: "Lora" as FontFamily, name: "Lora" },
                  { id: "Inter" as FontFamily, name: "Inter (Sans)" },
                  { id: "OpenDyslexic" as FontFamily, name: "OpenDyslexic" },
                ]
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFontFamily(f.id as FontFamily)}
                  style={{
                    padding: "0.6rem 0.8rem",
                    borderRadius: "10px",
                    border: `1px solid ${
                      fontFamily === f.id ? "var(--accent)" : "var(--border-color)"
                    }`,
                    background:
                      fontFamily === f.id ? "var(--accent-light)" : "var(--bg-primary)",
                    color:
                      fontFamily === f.id ? "var(--accent)" : "var(--text-primary)",
                    fontWeight: fontFamily === f.id ? 700 : 500,
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    transition: "all 0.15s ease",
                  }}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Reading Mode */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label className="form-label" style={{ marginBottom: "0.5rem" }}>
              Default Reading Mode
            </label>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => setReadingMode("scroll")}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "10px",
                  border: `1px solid ${
                    readingMode === "scroll"
                      ? "var(--accent)"
                      : "var(--border-color)"
                  }`,
                  background:
                    readingMode === "scroll"
                      ? "var(--accent-light)"
                      : "var(--bg-primary)",
                  color:
                    readingMode === "scroll"
                      ? "var(--accent)"
                      : "var(--text-primary)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                📜 Continuous Scroll
              </button>
              <button
                onClick={() => setReadingMode("paged")}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "10px",
                  border: `1px solid ${
                    readingMode === "paged" ? "var(--accent)" : "var(--border-color)"
                  }`,
                  background:
                    readingMode === "paged"
                      ? "var(--accent-light)"
                      : "var(--bg-primary)",
                  color:
                    readingMode === "paged"
                      ? "var(--accent)"
                      : "var(--text-primary)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                📖 Paged (E-Reader)
              </button>
            </div>
          </div>

          {/* Sliders */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.85rem",
                  marginBottom: "0.4rem",
                }}
              >
                <span className="form-label">Font Size</span>
                <span style={{ fontWeight: 600 }}>{fontSize}px</span>
              </div>
              <input
                type="range"
                min="14"
                max="28"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent)" }}
              />
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.85rem",
                  marginBottom: "0.4rem",
                }}
              >
                <span className="form-label">Line Spacing</span>
                <span style={{ fontWeight: 600 }}>{lineHeight.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="1.4"
                max="2.0"
                step="0.1"
                value={lineHeight}
                onChange={(e) => setLineHeight(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* History Management */}
      <section>
        <h2 className="h3" style={{ marginBottom: "1rem" }}>
          Data & Cache
        </h2>
        <div
          className="card"
          style={{
            padding: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.2rem" }}>
              Clear Reading History
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Removes cached chapter positions and recent novel read marks.
            </div>
          </div>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to clear your reading history?")) {
                clearHistory();
              }
            }}
            className="btn-ghost"
            style={{ color: "#EF4444", borderColor: "rgba(239, 68, 68, 0.3)" }}
          >
            Clear History
          </button>
        </div>
      </section>
    </div>
  );
}
