"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Sparkles,
  Save,
  Loader2,
  Upload,
  Image as ImageIcon,
  Check,
  CheckCircle2,
  AlertCircle,
  Eye,
  Star,
  Search,
  BookOpen,
  ArrowRight,
  Layers,
  Sliders,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { HeroSettings, HeroLayoutTemplate, Novel } from "@/types";
import { HERO_TEMPLATES_INFO, DEFAULT_HERO_SETTINGS_FALLBACK } from "@/lib/constants/hero";
import { formatCoverUrl, formatViews } from "@/lib/utils";

export default function AdminHeroCustomizerPage() {
  const [activeTab, setActiveTab] = useState<"hero" | "featured" | "preview">("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State for Hero Section
  const [heroForm, setHeroForm] = useState<HeroSettings>(DEFAULT_HERO_SETTINGS_FALLBACK);

  // Featured Novels State
  const [allNovels, setAllNovels] = useState<Novel[]>([]);
  const [featuredIds, setFeaturedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load initial settings and novels
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [heroRes, novelsRes] = await Promise.all([
          fetch("/api/admin/hero-settings"),
          fetch("/api/admin/featured-novels"),
        ]);

        const heroData = await heroRes.json();
        const novelsData = await novelsRes.json();

        if (heroData.success && heroData.settings) {
          setHeroForm(heroData.settings);
        }

        if (novelsData.success && novelsData.novels) {
          setAllNovels(novelsData.novels);
          setFeaturedIds(novelsData.featuredIds || heroData.settings?.featured_novel_ids || []);
        }
      } catch (err: any) {
        setFeedback({ type: "error", text: "Failed to load customizer data." });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleHeroFieldChange = (field: keyof HeroSettings, value: any) => {
    setHeroForm((prev) => ({ ...prev, [field]: value }));
  };

  // Image upload directly to Supabase storage bucket bluenov_media
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload-hero-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image to Supabase");
      }

      handleHeroFieldChange("image_url", data.url);
      setFeedback({ type: "success", text: "Hero image uploaded to Supabase Storage bucket successfully!" });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Upload failed." });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Toggle Featured status of novel
  const toggleFeaturedNovel = (novelId: string) => {
    setFeaturedIds((prev) => {
      if (prev.includes(novelId)) {
        return prev.filter((id) => id !== novelId);
      } else {
        return [...prev, novelId];
      }
    });
  };

  // Save everything
  const handleSaveAll = async () => {
    setSaving(true);
    setFeedback(null);

    try {
      // 1. Save Hero Settings
      const heroPayload = {
        ...heroForm,
        featured_novel_ids: featuredIds,
      };

      const heroRes = await fetch("/api/admin/hero-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(heroPayload),
      });

      const heroData = await heroRes.json();
      if (!heroRes.ok || !heroData.success) {
        throw new Error(heroData.error || "Failed to save hero settings");
      }

      // 2. Save Featured Novels
      const featRes = await fetch("/api/admin/featured-novels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured_novel_ids: featuredIds }),
      });

      const featData = await featRes.json();
      if (!featRes.ok || !featData.success) {
        throw new Error(featData.error || "Failed to save featured novels");
      }

      setFeedback({ type: "success", text: "Homepage Hero & Featured Novels updated successfully!" });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to save changes" });
    } finally {
      setSaving(false);
    }
  };

  const filteredNovels = allNovels.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.author && n.author.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
        <Loader2 size={32} className="animate-spin" style={{ margin: "0 auto 1rem" }} />
        <p>Loading Hero & Featured Customizer...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", paddingBottom: "4rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <Sparkles size={24} color="var(--accent)" />
            <h1 className="h2" style={{ margin: 0 }}>
              Hero & Featured Customizer
            </h1>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: 0 }}>
            Choose hero layout templates, customize copy & images, and control featured novels on the homepage.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="btn-primary"
          style={{
            padding: "0.65rem 1.75rem",
            fontSize: "0.9rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          <span>{saving ? "Saving Changes..." : "Publish to Homepage"}</span>
        </button>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.85rem 1.25rem",
            borderRadius: "12px",
            marginBottom: "1.5rem",
            fontSize: "0.9rem",
            background:
              feedback.type === "success" ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)",
            border: `1px solid ${
              feedback.type === "success" ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"
            }`,
            color: feedback.type === "success" ? "#10B981" : "#EF4444",
          }}
        >
          {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Tab Switcher */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          borderBottom: "1px solid var(--border-color)",
          marginBottom: "2rem",
        }}
      >
        <button
          onClick={() => setActiveTab("hero")}
          style={{
            padding: "0.75rem 1.25rem",
            fontSize: "0.9rem",
            fontWeight: 600,
            border: "none",
            background: "none",
            color: activeTab === "hero" ? "var(--accent)" : "var(--text-secondary)",
            borderBottom: activeTab === "hero" ? "2px solid var(--accent)" : "2px solid transparent",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Sliders size={16} /> Hero Section & Layouts
        </button>

        <button
          onClick={() => setActiveTab("featured")}
          style={{
            padding: "0.75rem 1.25rem",
            fontSize: "0.9rem",
            fontWeight: 600,
            border: "none",
            background: "none",
            color: activeTab === "featured" ? "var(--accent)" : "var(--text-secondary)",
            borderBottom: activeTab === "featured" ? "2px solid var(--accent)" : "2px solid transparent",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Star size={16} /> Featured Novels ({featuredIds.length})
        </button>

        <button
          onClick={() => setActiveTab("preview")}
          style={{
            padding: "0.75rem 1.25rem",
            fontSize: "0.9rem",
            fontWeight: 600,
            border: "none",
            background: "none",
            color: activeTab === "preview" ? "var(--accent)" : "var(--text-secondary)",
            borderBottom: activeTab === "preview" ? "2px solid var(--accent)" : "2px solid transparent",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Eye size={16} /> Live Preview
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TAB 1: HERO SECTION CONFIGURATION                        */}
      {/* ══════════════════════════════════════════════════════════ */}
      {activeTab === "hero" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Layout Template Selector */}
          <div
            className="card"
            style={{
              padding: "1.75rem",
              background: "var(--bg-card)",
              borderRadius: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Layers size={18} color="var(--accent)" />
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                Choose Hero Layout Template
              </h2>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
              Select from pre-engineered responsive layout templates. Switch styles anytime without losing your copy.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {HERO_TEMPLATES_INFO.map((tpl) => {
                const isSelected = heroForm.layout_template === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => handleHeroFieldChange("layout_template", tpl.id)}
                    style={{
                      padding: "1.25rem",
                      borderRadius: "14px",
                      border: `2px solid ${isSelected ? "var(--accent)" : "var(--border-color)"}`,
                      background: isSelected ? "var(--accent-light)" : "var(--bg-secondary)",
                      cursor: "pointer",
                      position: "relative",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          padding: "0.15rem 0.5rem",
                          borderRadius: "999px",
                          background: isSelected ? "var(--accent)" : "var(--bg-primary)",
                          color: isSelected ? "#FFFFFF" : "var(--text-secondary)",
                        }}
                      >
                        {tpl.tag}
                      </span>

                      {isSelected && (
                        <div
                          style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "50%",
                            background: "var(--accent)",
                            color: "#FFFFFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Check size={14} />
                        </div>
                      )}
                    </div>

                    <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.35rem" }}>
                      {tpl.name}
                    </h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                      {tpl.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Copy & Content Editor */}
          <div
            className="card"
            style={{
              padding: "1.75rem",
              background: "var(--bg-card)",
              borderRadius: "16px",
            }}
          >
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem", color: "var(--text-primary)" }}>
              Hero Typography & Copy
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              {/* Badge Text */}
              <div style={{ gridColumn: "span 2" }}>
                <label className="form-label" style={{ fontWeight: 600, fontSize: "0.82rem" }}>
                  Pill Badge Text
                </label>
                <input
                  type="text"
                  value={heroForm.badge_text}
                  onChange={(e) => handleHeroFieldChange("badge_text", e.target.value)}
                  className="form-input"
                  placeholder="e.g. Premium Web Novel Reader • 100% Free"
                />
              </div>

              {/* Main Title Headline */}
              <div>
                <label className="form-label" style={{ fontWeight: 600, fontSize: "0.82rem" }}>
                  Main Headline Title
                </label>
                <input
                  type="text"
                  value={heroForm.title}
                  onChange={(e) => handleHeroFieldChange("title", e.target.value)}
                  className="form-input"
                  placeholder="e.g. Immerse Yourself in Stories"
                />
              </div>

              {/* Title Highlight */}
              <div>
                <label className="form-label" style={{ fontWeight: 600, fontSize: "0.82rem" }}>
                  Highlighted / Accent Words
                </label>
                <input
                  type="text"
                  value={heroForm.title_highlight}
                  onChange={(e) => handleHeroFieldChange("title_highlight", e.target.value)}
                  className="form-input"
                  placeholder="e.g. Without Limits"
                />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem", display: "block" }}>
                  Will render with vibrant gradient or stylized font
                </span>
              </div>

              {/* Subtitle */}
              <div style={{ gridColumn: "span 2" }}>
                <label className="form-label" style={{ fontWeight: 600, fontSize: "0.82rem" }}>
                  Hero Subtitle / Description
                </label>
                <textarea
                  rows={3}
                  value={heroForm.subtitle}
                  onChange={(e) => handleHeroFieldChange("subtitle", e.target.value)}
                  className="form-input"
                  placeholder="Write a compelling introductory narrative for readers..."
                  style={{ resize: "vertical" }}
                />
              </div>

              {/* Primary CTA */}
              <div>
                <label className="form-label" style={{ fontWeight: 600, fontSize: "0.82rem" }}>
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={heroForm.cta_primary_text}
                  onChange={(e) => handleHeroFieldChange("cta_primary_text", e.target.value)}
                  className="form-input"
                  placeholder="Browse All Novels"
                />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 600, fontSize: "0.82rem" }}>
                  Primary Button Link URL
                </label>
                <input
                  type="text"
                  value={heroForm.cta_primary_link}
                  onChange={(e) => handleHeroFieldChange("cta_primary_link", e.target.value)}
                  className="form-input"
                  placeholder="/novels"
                />
              </div>

              {/* Secondary CTA */}
              <div>
                <label className="form-label" style={{ fontWeight: 600, fontSize: "0.82rem" }}>
                  Secondary Button Text
                </label>
                <input
                  type="text"
                  value={heroForm.cta_secondary_text}
                  onChange={(e) => handleHeroFieldChange("cta_secondary_text", e.target.value)}
                  className="form-input"
                  placeholder="My Library"
                />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 600, fontSize: "0.82rem" }}>
                  Secondary Button Link URL
                </label>
                <input
                  type="text"
                  value={heroForm.cta_secondary_link}
                  onChange={(e) => handleHeroFieldChange("cta_secondary_link", e.target.value)}
                  className="form-input"
                  placeholder="/library"
                />
              </div>
            </div>
          </div>

          {/* Hero Image & Supabase Bucket Upload */}
          <div
            className="card"
            style={{
              padding: "1.75rem",
              background: "var(--bg-card)",
              borderRadius: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <ImageIcon size={18} color="var(--accent)" />
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                Hero Image (Supabase Bucket)
              </h2>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
              Uploaded images are stored directly in your Supabase Storage bucket (<code>bluenov_media/hero/</code>) and served over high-speed CDN.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", alignItems: "start" }}>
              {/* Upload Input & Actions */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                  id="hero-image-upload"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: "2px dashed var(--border-color)",
                    borderRadius: "14px",
                    padding: "2rem",
                    textAlign: "center",
                    cursor: "pointer",
                    background: "var(--bg-secondary)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
                >
                  {uploadingImage ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                      <Loader2 size={28} className="animate-spin" color="var(--accent)" />
                      <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Uploading to Supabase Storage...</span>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          background: "var(--accent-light)",
                          color: "var(--accent)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 0.75rem",
                        }}
                      >
                        <Upload size={22} />
                      </div>
                      <strong style={{ display: "block", fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                        Click to upload hero image
                      </strong>
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        Supports JPG, PNG, WEBP (Max 8MB)
                      </span>
                    </>
                  )}
                </div>

                {/* Direct URL input fallback */}
                <div style={{ marginTop: "1rem" }}>
                  <label className="form-label" style={{ fontSize: "0.78rem" }}>
                    Or paste image URL directly
                  </label>
                  <input
                    type="url"
                    value={heroForm.image_url || ""}
                    onChange={(e) => handleHeroFieldChange("image_url", e.target.value)}
                    className="form-input"
                    placeholder="https://..."
                    style={{ fontSize: "0.85rem" }}
                  />
                </div>
              </div>

              {/* Image Preview Box */}
              <div>
                <span style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                  Current Hero Image Preview
                </span>
                {heroForm.image_url ? (
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "220px",
                      borderRadius: "14px",
                      overflow: "hidden",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-secondary)",
                    }}
                  >
                    <Image
                      src={heroForm.image_url}
                      alt="Hero preview"
                      fill
                      unoptimized
                      style={{ objectFit: "cover" }}
                    />
                    <button
                      onClick={() => handleHeroFieldChange("image_url", "")}
                      style={{
                        position: "absolute",
                        top: "0.75rem",
                        right: "0.75rem",
                        background: "rgba(239, 68, 68, 0.9)",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "8px",
                        padding: "0.4rem 0.6rem",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      height: "220px",
                      borderRadius: "14px",
                      border: "1px dashed var(--border-color)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-muted)",
                      background: "var(--bg-secondary)",
                    }}
                  >
                    <ImageIcon size={32} style={{ opacity: 0.4, marginBottom: "0.5rem" }} />
                    <span style={{ fontSize: "0.85rem" }}>No image assigned (defaults to gradient theme)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TAB 2: FEATURED NOVELS MANAGER                            */}
      {/* ══════════════════════════════════════════════════════════ */}
      {activeTab === "featured" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Controls Bar */}
          <div
            className="card"
            style={{
              padding: "1.25rem 1.5rem",
              background: "var(--bg-card)",
              borderRadius: "14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 0.25rem", color: "var(--text-primary)" }}>
                Selected Featured Novels ({featuredIds.length})
              </h2>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                These novels will be highlighted at the top of the homepage in the Featured Novels showcase.
              </span>
            </div>

            {/* Search filter */}
            <div style={{ position: "relative", minWidth: "260px" }}>
              <Search
                size={16}
                color="var(--text-muted)"
                style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search novel title or author..."
                className="form-input"
                style={{ paddingLeft: "2.25rem", fontSize: "0.85rem" }}
              />
            </div>
          </div>

          {/* Grid of all novels with Featured Toggle */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1rem",
            }}
          >
            {filteredNovels.map((novel) => {
              const isFeatured = featuredIds.includes(novel.id);
              const cover = formatCoverUrl(novel.cover_url);

              return (
                <div
                  key={novel.id}
                  className="card"
                  style={{
                    padding: "1rem",
                    borderRadius: "14px",
                    background: isFeatured ? "var(--accent-light)" : "var(--bg-card)",
                    border: `2px solid ${isFeatured ? "var(--accent)" : "var(--border-color)"}`,
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                    transition: "all 0.2s ease",
                  }}
                >
                  {/* Cover thumbnail */}
                  <div
                    style={{
                      width: "60px",
                      height: "85px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      position: "relative",
                      background: "linear-gradient(135deg, #0A1F5C 0%, #1F5FE0 100%)",
                      flexShrink: 0,
                    }}
                  >
                    {cover ? (
                      <Image
                        src={cover}
                        alt={novel.title}
                        fill
                        unoptimized
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          color: "#FFFFFF",
                          fontWeight: 700,
                          fontSize: "1rem",
                        }}
                      >
                        {novel.title.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Novel Meta */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        margin: "0 0 0.25rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {novel.title}
                    </h3>

                    <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: "0 0 0.5rem" }}>
                      by {novel.author || "Unknown"}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      <span>{formatViews(novel.view_count || 0)} reads</span>
                      {novel.genre && <span>• {novel.genre.name}</span>}
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <button
                    type="button"
                    onClick={() => toggleFeaturedNovel(novel.id)}
                    style={{
                      padding: "0.45rem 0.85rem",
                      borderRadius: "999px",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      border: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      background: isFeatured ? "var(--accent)" : "var(--bg-secondary)",
                      color: isFeatured ? "#FFFFFF" : "var(--text-secondary)",
                      boxShadow: isFeatured ? "0 2px 8px rgba(31, 95, 224, 0.3)" : "none",
                    }}
                  >
                    <Star size={13} fill={isFeatured ? "currentColor" : "none"} />
                    <span>{isFeatured ? "Featured" : "Feature"}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TAB 3: LIVE PREVIEW                                       */}
      {/* ══════════════════════════════════════════════════════════ */}
      {activeTab === "preview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div
            className="card"
            style={{
              padding: "1rem 1.5rem",
              background: "var(--bg-card)",
              borderRadius: "14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>
                Live Hero Section Preview
              </strong>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
                This is how readers will experience your hero section on the homepage.
              </p>
            </div>

            <span
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                textTransform: "uppercase",
                padding: "0.25rem 0.75rem",
                borderRadius: "999px",
                background: "var(--accent-light)",
                color: "var(--accent)",
              }}
            >
              Template: {heroForm.layout_template}
            </span>
          </div>

          {/* Interactive Preview Container */}
          <div
            style={{
              borderRadius: "20px",
              overflow: "hidden",
              border: "2px solid var(--border-color)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            {/* Template 1: Modern Split Preview */}
            {heroForm.layout_template === "modern-split" && (
              <div
                style={{
                  background: "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-primary) 100%)",
                  padding: "3.5rem 2rem",
                  position: "relative",
                }}
              >
                <div style={{ maxWidth: "700px" }}>
                  {heroForm.badge_text && (
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        background: "var(--accent-light)",
                        borderRadius: "999px",
                        padding: "0.3rem 0.9rem",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: "var(--accent)",
                        marginBottom: "1rem",
                      }}
                    >
                      <Sparkles size={13} /> {heroForm.badge_text}
                    </div>
                  )}

                  <h1 className="h1" style={{ marginBottom: "1rem" }}>
                    {heroForm.title}{" "}
                    <span
                      style={{
                        background: "linear-gradient(135deg, #1F5FE0 0%, #5BB8F5 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {heroForm.title_highlight}
                    </span>
                  </h1>

                  <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                    {heroForm.subtitle}
                  </p>

                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <button className="btn-primary" style={{ padding: "0.7rem 1.5rem" }}>
                      {heroForm.cta_primary_text || "Browse All Novels"}
                    </button>
                    <button className="btn-secondary" style={{ padding: "0.7rem 1.5rem" }}>
                      {heroForm.cta_secondary_text || "My Library"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Template 2: Cinematic Banner Preview */}
            {heroForm.layout_template === "cinematic-banner" && (
              <div
                style={{
                  background: "linear-gradient(180deg, #07153D 0%, #0A1F5C 100%)",
                  padding: "4rem 2rem",
                  color: "#FFFFFF",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    maxWidth: "750px",
                    background: "rgba(10, 31, 92, 0.6)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "20px",
                    padding: "2.5rem",
                  }}
                >
                  {heroForm.badge_text && (
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        background: "rgba(91, 184, 245, 0.2)",
                        borderRadius: "999px",
                        padding: "0.3rem 0.9rem",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: "#EEF4FD",
                        marginBottom: "1rem",
                      }}
                    >
                      {heroForm.badge_text}
                    </div>
                  )}

                  <h1 className="h1" style={{ color: "#FFFFFF", marginBottom: "1rem" }}>
                    {heroForm.title}{" "}
                    <span style={{ color: "#5BB8F5" }}>{heroForm.title_highlight}</span>
                  </h1>

                  <p style={{ color: "rgba(238, 244, 253, 0.85)", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                    {heroForm.subtitle}
                  </p>

                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <button className="btn-primary" style={{ padding: "0.75rem 1.75rem" }}>
                      {heroForm.cta_primary_text || "Browse All Novels"}
                    </button>
                    <button
                      style={{
                        padding: "0.75rem 1.5rem",
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.15)",
                        color: "#FFFFFF",
                        border: "1px solid rgba(255, 255, 255, 0.25)",
                        fontWeight: 600,
                      }}
                    >
                      {heroForm.cta_secondary_text || "My Library"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Template 3: Editorial Spotlight Preview */}
            {heroForm.layout_template === "editorial-spotlight" && (
              <div
                style={{
                  background: "var(--bg-secondary)",
                  padding: "4rem 2rem",
                }}
              >
                <div style={{ maxWidth: "700px" }}>
                  {heroForm.badge_text && (
                    <div
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--accent)",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {heroForm.badge_text}
                    </div>
                  )}

                  <h1
                    className="h1"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "2.75rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {heroForm.title}{" "}
                    <span style={{ fontStyle: "italic", color: "var(--accent)" }}>
                      {heroForm.title_highlight}
                    </span>
                  </h1>

                  <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                    {heroForm.subtitle}
                  </p>

                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <button className="btn-primary" style={{ padding: "0.75rem 1.75rem" }}>
                      {heroForm.cta_primary_text || "Browse All Novels"}
                    </button>
                    <button className="btn-secondary" style={{ padding: "0.75rem 1.5rem" }}>
                      {heroForm.cta_secondary_text || "My Library"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
