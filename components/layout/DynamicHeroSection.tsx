import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HeroSettings, Novel } from "@/types";
import { ContinueReadingCard } from "@/components/novels/ContinueReadingCard";
import {
  Sparkles,
  Compass,
  Bookmark,
  ArrowRight,
  BookOpen,
  Flame,
  Award,
  Zap,
} from "lucide-react";

interface DynamicHeroSectionProps {
  settings: HeroSettings;
  featuredNovel?: Novel;
}

export function DynamicHeroSection({ settings, featuredNovel }: DynamicHeroSectionProps) {
  const {
    layout_template = "modern-split",
    badge_text = "Premium Web Novel Reader • 100% Free",
    title = "Immerse Yourself in Stories",
    title_highlight = "Without Limits",
    subtitle = "Explore rich fantasy epics, heartwarming romances, sci-fi sagas, and detective thrillers. Read with customizable typography, dark & sepia themes, and zero ads in your reading flow.",
    cta_primary_text = "Browse All Novels",
    cta_primary_link = "/novels",
    cta_secondary_text = "My Library",
    cta_secondary_link = "/library",
    image_url = "",
  } = settings;

  // ══════════════════════════════════════════════════════════════
  // TEMPLATE 1: Modern Split Showcase (Default)
  // ══════════════════════════════════════════════════════════════
  if (layout_template === "modern-split") {
    return (
      <section
        style={{
          background: "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-primary) 100%)",
          borderBottom: "1px solid var(--border-color)",
          padding: "3.5rem 0 3rem",
          position: "relative",
          overflow: "hidden",
          width: "100%",
          maxWidth: "100vw",
        }}
      >
        {/* Decorative ambient gradients */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: 0,
            width: "min(500px, 90vw)",
            height: "min(500px, 90vw)",
            background: "radial-gradient(circle, rgba(31, 95, 224, 0.12) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: 0,
            width: "min(360px, 80vw)",
            height: "min(360px, 80vw)",
            background: "radial-gradient(circle, rgba(91, 184, 245, 0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div className="container-main" style={{ position: "relative" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: image_url ? "repeat(auto-fit, minmax(320px, 1fr))" : "1fr",
              gap: "2.5rem",
              alignItems: "center",
              marginBottom: "2.5rem",
            }}
          >
            {/* Left Column: Text & Actions */}
            <div style={{ maxWidth: "760px" }}>
              {/* Pill Badge */}
              {badge_text && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "var(--accent-light)",
                    borderRadius: "999px",
                    padding: "0.35rem 1rem",
                    marginBottom: "1.25rem",
                    border: "1px solid rgba(31, 95, 224, 0.15)",
                  }}
                >
                  <Sparkles size={14} color="var(--accent)" />
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--accent)" }}>
                    {badge_text}
                  </span>
                </div>
              )}

              {/* Headline */}
              <h1 className="h1" style={{ marginBottom: "1.1rem" }}>
                {title}{" "}
                {title_highlight && (
                  <span
                    style={{
                      background: "linear-gradient(135deg, #1F5FE0 0%, #5BB8F5 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {title_highlight}
                  </span>
                )}
              </h1>

              {/* Subtitle */}
              {subtitle && (
                <p
                  className="body-lg"
                  style={{
                    color: "var(--text-secondary)",
                    marginBottom: "2rem",
                    maxWidth: "620px",
                    lineHeight: 1.7,
                  }}
                >
                  {subtitle}
                </p>
              )}

              {/* CTAs */}
              <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap", alignItems: "center" }}>
                {cta_primary_text && (
                  <Link
                    href={cta_primary_link || "/novels"}
                    className="btn-primary"
                    style={{ padding: "0.75rem 1.75rem", fontSize: "0.95rem" }}
                  >
                    <Compass size={18} />
                    {cta_primary_text}
                  </Link>
                )}
                {cta_secondary_text && (
                  <Link
                    href={cta_secondary_link || "/library"}
                    className="btn-secondary"
                    style={{ padding: "0.75rem 1.5rem", fontSize: "0.95rem" }}
                  >
                    <Bookmark size={18} />
                    {cta_secondary_text}
                  </Link>
                )}
              </div>
            </div>

            {/* Right Column: Hero Image Showcase if uploaded */}
            {image_url && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "480px",
                    height: "320px",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 20px 40px -15px rgba(10, 31, 92, 0.35)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <Image
                    src={image_url}
                    alt="BlueNov Hero Illustration"
                    fill
                    priority
                    unoptimized
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 480px"
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(10, 31, 92, 0.5) 0%, transparent 60%)",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Continue Reading Card in Hero */}
          <div style={{ maxWidth: "800px" }}>
            <ContinueReadingCard />
          </div>
        </div>
      </section>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // TEMPLATE 2: Immersive Cinematic Banner
  // ══════════════════════════════════════════════════════════════
  if (layout_template === "cinematic-banner") {
    return (
      <section
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "100vw",
          overflow: "hidden",
          background: "linear-gradient(180deg, #07153D 0%, #0A1F5C 50%, var(--bg-primary) 100%)",
          color: "#FFFFFF",
          padding: "4.5rem 0 3.5rem",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        {/* Background Artwork Backdrop if image is set */}
        {image_url && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              opacity: 0.35,
              filter: "blur(2px)",
            }}
          >
            <Image
              src={image_url}
              alt="Cinematic Background"
              fill
              priority
              unoptimized
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

        {/* Ambient Overlay Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 80% 20%, rgba(91, 184, 245, 0.2) 0%, transparent 60%), linear-gradient(180deg, rgba(7, 21, 61, 0.7) 0%, rgba(10, 31, 92, 0.95) 100%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        <div className="container-main" style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              maxWidth: "840px",
              background: "rgba(10, 31, 92, 0.55)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "24px",
              padding: "clamp(1.75rem, 4vw, 3rem)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              marginBottom: "2.5rem",
            }}
          >
            {/* Pill Badge */}
            {badge_text && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "rgba(91, 184, 245, 0.2)",
                  borderRadius: "999px",
                  padding: "0.35rem 1rem",
                  marginBottom: "1.25rem",
                  border: "1px solid rgba(91, 184, 245, 0.4)",
                }}
              >
                <Flame size={14} color="#5BB8F5" />
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#EEF4FD" }}>
                  {badge_text}
                </span>
              </div>
            )}

            {/* Headline */}
            <h1
              className="h1"
              style={{
                color: "#FFFFFF",
                marginBottom: "1.25rem",
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              {title}{" "}
              {title_highlight && (
                <span
                  style={{
                    background: "linear-gradient(135deg, #5BB8F5 0%, #EEF4FD 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {title_highlight}
                </span>
              )}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p
                style={{
                  color: "rgba(238, 244, 253, 0.88)",
                  fontSize: "clamp(1rem, 2vw, 1.15rem)",
                  lineHeight: 1.7,
                  marginBottom: "2rem",
                  maxWidth: "680px",
                }}
              >
                {subtitle}
              </p>
            )}

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              {cta_primary_text && (
                <Link
                  href={cta_primary_link || "/novels"}
                  className="btn-primary"
                  style={{
                    padding: "0.85rem 2rem",
                    fontSize: "0.98rem",
                    background: "#1F5FE0",
                    boxShadow: "0 4px 14px rgba(31, 95, 224, 0.4)",
                  }}
                >
                  <Compass size={18} />
                  {cta_primary_text}
                </Link>
              )}
              {cta_secondary_text && (
                <Link
                  href={cta_secondary_link || "/library"}
                  style={{
                    padding: "0.85rem 1.75rem",
                    fontSize: "0.98rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    borderRadius: "10px",
                    color: "#FFFFFF",
                    background: "rgba(255, 255, 255, 0.12)",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                    textDecoration: "none",
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                  }}
                >
                  <Bookmark size={18} />
                  {cta_secondary_text}
                </Link>
              )}
            </div>
          </div>

          <div style={{ maxWidth: "800px" }}>
            <ContinueReadingCard />
          </div>
        </div>
      </section>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // TEMPLATE 3: Editorial Book Spotlight
  // ══════════════════════════════════════════════════════════════
  return (
    <section
      style={{
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border-color)",
        padding: "4rem 0 3.5rem",
        position: "relative",
        width: "100%",
        maxWidth: "100vw",
        overflow: "hidden",
      }}
    >
      <div className="container-main">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "3rem",
            alignItems: "center",
            marginBottom: "2.5rem",
          }}
        >
          {/* Left Column */}
          <div>
            {badge_text && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--accent)",
                  marginBottom: "1rem",
                }}
              >
                <Award size={15} />
                <span>{badge_text}</span>
              </div>
            )}

            <h1
              className="h1"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                lineHeight: 1.15,
                marginBottom: "1.25rem",
                letterSpacing: "-0.02em",
              }}
            >
              {title}{" "}
              {title_highlight && (
                <span
                  style={{
                    fontStyle: "italic",
                    color: "var(--accent)",
                    textDecoration: "underline",
                    textDecorationColor: "rgba(31, 95, 224, 0.3)",
                    textUnderlineOffset: "6px",
                  }}
                >
                  {title_highlight}
                </span>
              )}
            </h1>

            {subtitle && (
              <p
                style={{
                  fontSize: "1.05rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                  marginBottom: "2rem",
                  maxWidth: "580px",
                }}
              >
                {subtitle}
              </p>
            )}

            {/* Action pill buttons */}
            <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap", alignItems: "center" }}>
              {cta_primary_text && (
                <Link
                  href={cta_primary_link || "/novels"}
                  className="btn-primary"
                  style={{ padding: "0.8rem 1.75rem", fontSize: "0.95rem" }}
                >
                  <BookOpen size={18} />
                  {cta_primary_text}
                </Link>
              )}
              {cta_secondary_text && (
                <Link
                  href={cta_secondary_link || "/library"}
                  className="btn-secondary"
                  style={{ padding: "0.8rem 1.5rem", fontSize: "0.95rem" }}
                >
                  <ArrowRight size={18} />
                  {cta_secondary_text}
                </Link>
              )}
            </div>
          </div>

          {/* Right Column: Editorial Highlight Artwork / Spotlight Book */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            {image_url ? (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "420px",
                  height: "360px",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-cover)",
                  border: "2px solid var(--border-color)",
                }}
              >
                <Image
                  src={image_url}
                  alt="Editorial Spotlight Cover"
                  fill
                  priority
                  unoptimized
                  style={{ objectFit: "cover" }}
                />
              </div>
            ) : (
              <div
                className="card"
                style={{
                  padding: "2rem",
                  maxWidth: "420px",
                  width: "100%",
                  background: "var(--bg-card)",
                  borderRadius: "20px",
                  boxShadow: "var(--shadow-md)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <Zap size={18} color="var(--accent)" />
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase" }}>
                    Curated Spotlight
                  </span>
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 0.5rem", color: "var(--text-primary)" }}>
                  Pure Reading Pleasure
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 1.25rem" }}>
                  Enjoy unlimited access to web novels with customizable reading aesthetics: serif fonts, light, sepia, dark, and OLED themes.
                </p>
                <Link
                  href="/novels"
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center", fontSize: "0.85rem" }}
                >
                  Explore Catalog →
                </Link>
              </div>
            )}
          </div>
        </div>

        <div style={{ maxWidth: "800px" }}>
          <ContinueReadingCard />
        </div>
      </div>
    </section>
  );
}
