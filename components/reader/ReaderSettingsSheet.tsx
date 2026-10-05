"use client";

import React, { useEffect } from "react";
import {
  X,
  RotateCcw,
  Sun,
  Moon,
  AlignLeft,
  AlignJustify,
  Volume2,
  BookOpen,
  Eye,
  Sliders,
  Sparkles,
} from "lucide-react";
import {
  useReaderSettings,
  FontFamily,
  ReaderMaxWidth,
  ReadingMode,
  ReaderTheme,
  TextAlign,
} from "@/hooks/useReaderSettings";
import { useTheme } from "@/components/layout/ThemeProvider";

interface ReaderSettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleSpeech?: () => void;
  isSpeaking?: boolean;
}

const FONTS: { id: FontFamily; label: string; group: string }[] = [
  { id: "Literata", label: "Literata", group: "Serif (Book)" },
  { id: "Merriweather", label: "Merriweather", group: "Serif (Book)" },
  { id: "Source Serif 4", label: "Source Serif", group: "Serif (Book)" },
  { id: "Lora", label: "Lora", group: "Serif (Book)" },
  { id: "Inter", label: "Inter", group: "Sans-Serif" },
  { id: "Atkinson Hyperlegible", label: "Atkinson", group: "High Legibility" },
  { id: "OpenDyslexic", label: "OpenDyslexic", group: "Accessible" },
  { id: "Noto Nastaliq Urdu", label: "Urdu (Nastaliq)", group: "Multilingual" },
];

const THEME_OPTIONS: { id: ReaderTheme; label: string; bg: string; text: string; border: string }[] = [
  { id: "light", label: "Light", bg: "#FFFFFF", text: "#0A1F5C", border: "#D6E3F8" },
  { id: "sepia", label: "Sepia", bg: "#F8F3E8", text: "#38291B", border: "#E2D7C2" },
  { id: "dark", label: "Dark", bg: "#0A1428", text: "#F1F6FD", border: "#1D3972" },
  { id: "black", label: "OLED", bg: "#000000", text: "#F4F4F5", border: "#222225" },
  { id: "system", label: "Auto", bg: "linear-gradient(135deg, #FFF 50%, #0A1428 50%)", text: "#3B82F6", border: "#3B82F6" },
];

export function ReaderSettingsSheet({
  isOpen,
  onClose,
  onToggleSpeech,
  isSpeaking = false,
}: ReaderSettingsSheetProps) {
  const { setTheme: setAppTheme } = useTheme();

  const {
    fontFamily,
    fontSize,
    lineHeight,
    paragraphSpacing,
    letterSpacing,
    textAlign,
    maxWidth,
    readingMode,
    theme,
    focusMode,
    autoHideUI,
    keepAwake,
    blueLightFilter,
    speechRate,
    setFontFamily,
    setFontSize,
    setLineHeight,
    setParagraphSpacing,
    setLetterSpacing,
    setTextAlign,
    setMaxWidth,
    setReadingMode,
    setTheme,
    setFocusMode,
    setAutoHideUI,
    setKeepAwake,
    setBlueLightFilter,
    setSpeechRate,
    resetToDefault,
  } = useReaderSettings();

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

  const handleThemeChange = (newTheme: ReaderTheme) => {
    setTheme(newTheme);
    setAppTheme(newTheme);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 250,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
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
        }}
      />

      {/* Sheet / Modal Container */}
      <div
        className="reader-settings-panel"
        style={{
          position: "relative",
          zIndex: 260,
          width: "100%",
          maxWidth: "540px",
          maxHeight: "88vh",
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "20px 20px 0 0",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "slideUpSheet 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1rem 1.25rem",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--bg-secondary)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sliders size={18} color="var(--accent)" />
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>Reading Preferences</h3>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button
              onClick={resetToDefault}
              title="Reset to default settings"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                fontSize: "0.78rem",
                color: "var(--text-muted)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "0.3rem 0.5rem",
                borderRadius: "6px",
              }}
            >
              <RotateCcw size={13} /> Reset
            </button>
            <button
              onClick={onClose}
              aria-label="Close settings"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                padding: "0.4rem",
                cursor: "pointer",
                color: "var(--text-secondary)",
                display: "flex",
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {/* ── Theme Selection ────────────────────────── */}
          <section>
            <label className="form-label" style={{ marginBottom: "0.5rem" }}>Theme & Color Scheme</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.5rem" }}>
              {THEME_OPTIONS.map((opt) => {
                const isActive = theme === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleThemeChange(opt.id)}
                    style={{
                      height: "56px",
                      borderRadius: "12px",
                      background: opt.bg,
                      color: opt.text,
                      border: isActive ? "2px solid var(--accent)" : `1px solid ${opt.border}`,
                      boxShadow: isActive ? "0 0 0 3px var(--accent-light)" : "none",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "transform 0.15s ease",
                      transform: isActive ? "scale(1.03)" : "scale(1)",
                      fontWeight: isActive ? 700 : 500,
                      fontSize: "0.75rem",
                    }}
                  >
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── Reading Mode (Scroll vs Paged) ─────────── */}
          <section>
            <label className="form-label" style={{ marginBottom: "0.5rem" }}>Reading Mode</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              <button
                onClick={() => setReadingMode("scroll")}
                className={readingMode === "scroll" ? "btn-primary" : "btn-secondary"}
                style={{ fontSize: "0.85rem", padding: "0.6rem" }}
              >
                Vertical Scroll
              </button>
              <button
                onClick={() => setReadingMode("paged")}
                className={readingMode === "paged" ? "btn-primary" : "btn-secondary"}
                style={{ fontSize: "0.85rem", padding: "0.6rem" }}
              >
                Paged (Tap/Swipe)
              </button>
            </div>
          </section>

          {/* ── Font Family ────────────────────────────── */}
          <section>
            <label className="form-label" style={{ marginBottom: "0.5rem" }}>Font Family</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.4rem" }}>
              {FONTS.map((f) => {
                const isSelected = fontFamily === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFontFamily(f.id)}
                    style={{
                      padding: "0.6rem 0.75rem",
                      borderRadius: "10px",
                      textAlign: "left",
                      background: isSelected ? "var(--accent-light)" : "var(--bg-secondary)",
                      border: isSelected ? "1.5px solid var(--accent)" : "1px solid var(--border-color)",
                      color: isSelected ? "var(--accent)" : "var(--text-primary)",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: isSelected ? 600 : 400,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span style={{ fontFamily: `var(--font-${f.id.toLowerCase().replace(/\s+/g, "-")})` }}>
                      {f.label}
                    </span>
                    {isSelected && <span style={{ fontSize: "0.7rem", color: "var(--accent)" }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── Font Size Slider with Preview ─────────── */}
          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
              <label className="form-label" style={{ margin: 0 }}>Font Size</label>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent)" }}>{fontSize}px</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>14px</span>
              <input
                type="range"
                min="14"
                max="28"
                step="1"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                style={{ flex: 1, accentColor: "var(--accent)", cursor: "pointer" }}
              />
              <span style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}>28px</span>
            </div>
            {/* Live miniature preview */}
            <div
              style={{
                marginTop: "0.5rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "8px",
                background: "var(--bg-secondary)",
                border: "1px dashed var(--border-color)",
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight,
                fontFamily: `var(--reader-font-family, serif)`,
                color: "var(--text-primary)",
              }}
            >
              The ancient stars glowed like sapphire fire above Eldoria.
            </div>
          </section>

          {/* ── Line Height Slider ─────────────────────── */}
          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
              <label className="form-label" style={{ margin: 0 }}>Line Height (Spacing)</label>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent)" }}>{lineHeight.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="1.4"
              max="2.2"
              step="0.1"
              value={lineHeight}
              onChange={(e) => setLineHeight(parseFloat(e.target.value))}
              style={{ width: "100%", accentColor: "var(--accent)", cursor: "pointer" }}
            />
          </section>

          {/* ── Reading Width & Text Alignment ─────────── */}
          <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="form-label" style={{ marginBottom: "0.4rem" }}>Page Width</label>
              <div style={{ display: "flex", gap: "0.3rem" }}>
                {(["narrow", "medium", "wide"] as ReaderMaxWidth[]).map((w) => (
                  <button
                    key={w}
                    onClick={() => setMaxWidth(w)}
                    style={{
                      flex: 1,
                      padding: "0.45rem",
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                      fontWeight: maxWidth === w ? 700 : 500,
                      background: maxWidth === w ? "var(--accent)" : "var(--bg-secondary)",
                      color: maxWidth === w ? "#FFFFFF" : "var(--text-secondary)",
                      border: "1px solid var(--border-color)",
                      cursor: "pointer",
                      textTransform: "capitalize",
                    }}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label" style={{ marginBottom: "0.4rem" }}>Alignment</label>
              <div style={{ display: "flex", gap: "0.3rem" }}>
                <button
                  onClick={() => setTextAlign("left")}
                  style={{
                    flex: 1,
                    padding: "0.45rem",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.25rem",
                    fontSize: "0.75rem",
                    fontWeight: textAlign === "left" ? 700 : 500,
                    background: textAlign === "left" ? "var(--accent)" : "var(--bg-secondary)",
                    color: textAlign === "left" ? "#FFFFFF" : "var(--text-secondary)",
                    border: "1px solid var(--border-color)",
                    cursor: "pointer",
                  }}
                >
                  <AlignLeft size={14} /> Left
                </button>
                <button
                  onClick={() => setTextAlign("justify")}
                  style={{
                    flex: 1,
                    padding: "0.45rem",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.25rem",
                    fontSize: "0.75rem",
                    fontWeight: textAlign === "justify" ? 700 : 500,
                    background: textAlign === "justify" ? "var(--accent)" : "var(--bg-secondary)",
                    color: textAlign === "justify" ? "#FFFFFF" : "var(--text-secondary)",
                    border: "1px solid var(--border-color)",
                    cursor: "pointer",
                  }}
                >
                  <AlignJustify size={14} /> Justify
                </button>
              </div>
            </div>
          </section>

          {/* ── Warmth / Blue-Light Filter Slider ──────── */}
          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
              <label className="form-label" style={{ margin: 0 }}>Blue-Light / Warmth Filter</label>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--accent)" }}>
                {Math.round(blueLightFilter * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="0.4"
              step="0.05"
              value={blueLightFilter}
              onChange={(e) => setBlueLightFilter(parseFloat(e.target.value))}
              style={{ width: "100%", accentColor: "#f59e0b", cursor: "pointer" }}
            />
          </section>

          {/* ── Toggle Switches ────────────────────────── */}
          <section style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {/* Focus Mode */}
            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>Focus Mode</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Hides top and bottom navigation completely</div>
              </div>
              <input
                type="checkbox"
                checked={focusMode}
                onChange={(e) => setFocusMode(e.target.checked)}
                style={{ width: "18px", height: "18px", accentColor: "var(--accent)" }}
              />
            </label>

            {/* Auto-Hide UI on Scroll */}
            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>Auto-Hide UI on Scroll</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Hides bars when scrolling down, shows on scroll up</div>
              </div>
              <input
                type="checkbox"
                checked={autoHideUI}
                onChange={(e) => setAutoHideUI(e.target.checked)}
                style={{ width: "18px", height: "18px", accentColor: "var(--accent)" }}
              />
            </label>

            {/* Keep Screen Awake */}
            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>Keep Screen Awake</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Prevents device screen from dimming or sleeping</div>
              </div>
              <input
                type="checkbox"
                checked={keepAwake}
                onChange={(e) => setKeepAwake(e.target.checked)}
                style={{ width: "18px", height: "18px", accentColor: "var(--accent)" }}
              />
            </label>
          </section>

          {/* ── Text-to-Speech Controls ────────────────── */}
          {onToggleSpeech && (
            <section style={{ padding: "0.875rem", borderRadius: "12px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                  <Volume2 size={18} color="var(--accent)" />
                  <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>Text-to-Speech (TTS)</span>
                </div>
                <button
                  onClick={onToggleSpeech}
                  className="btn-primary"
                  style={{ fontSize: "0.8rem", padding: "0.35rem 0.85rem", borderRadius: "8px" }}
                >
                  {isSpeaking ? "Pause Audio" : "Listen Chapter"}
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Speech Speed:</span>
                {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setSpeechRate(rate)}
                    style={{
                      padding: "0.2rem 0.5rem",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: speechRate === rate ? 700 : 500,
                      background: speechRate === rate ? "var(--accent)" : "var(--bg-card)",
                      color: speechRate === rate ? "#FFFFFF" : "var(--text-primary)",
                      border: "1px solid var(--border-color)",
                      cursor: "pointer",
                    }}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUpSheet {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @media (min-width: 640px) {
          .reader-settings-panel {
            border-radius: 20px !important;
            margin-bottom: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
