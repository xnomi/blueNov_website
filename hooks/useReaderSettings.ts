"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type FontFamily =
  | "Literata"
  | "Merriweather"
  | "Source Serif 4"
  | "Lora"
  | "Inter"
  | "Atkinson Hyperlegible"
  | "OpenDyslexic"
  | "Noto Nastaliq Urdu";

export type ReaderMaxWidth = "narrow" | "medium" | "wide";
export type ReadingMode = "scroll" | "paged";
export type TextAlign = "left" | "justify";
export type ReaderTheme = "light" | "sepia" | "dark" | "black" | "system";

export interface ReaderSettingsState {
  fontFamily: FontFamily;
  fontSize: number; // 14 to 28
  lineHeight: number; // 1.4 to 2.0
  paragraphSpacing: number; // 1.0 to 2.4
  letterSpacing: number; // -0.02 to 0.08
  textAlign: TextAlign;
  maxWidth: ReaderMaxWidth;
  readingMode: ReadingMode;
  theme: ReaderTheme;
  focusMode: boolean;
  autoHideUI: boolean;
  keepAwake: boolean;
  blueLightFilter: number; // 0 to 0.45
  speechRate: number; // 0.75, 1, 1.25, 1.5, 2

  // Actions
  setFontFamily: (font: FontFamily) => void;
  setFontSize: (size: number) => void;
  setLineHeight: (height: number) => void;
  setParagraphSpacing: (spacing: number) => void;
  setLetterSpacing: (spacing: number) => void;
  setTextAlign: (align: TextAlign) => void;
  setMaxWidth: (width: ReaderMaxWidth) => void;
  setReadingMode: (mode: ReadingMode) => void;
  setTheme: (theme: ReaderTheme) => void;
  setFocusMode: (focus: boolean) => void;
  setAutoHideUI: (autoHide: boolean) => void;
  setKeepAwake: (awake: boolean) => void;
  setBlueLightFilter: (filter: number) => void;
  setSpeechRate: (rate: number) => void;
  resetToDefault: () => void;
}

const DEFAULT_SETTINGS = {
  fontFamily: "Literata" as FontFamily,
  fontSize: 19,
  lineHeight: 1.7,
  paragraphSpacing: 1.5,
  letterSpacing: 0,
  textAlign: "left" as TextAlign,
  maxWidth: "medium" as ReaderMaxWidth,
  readingMode: "scroll" as ReadingMode,
  theme: "dark" as ReaderTheme,
  focusMode: false,
  autoHideUI: true,
  keepAwake: false,
  blueLightFilter: 0,
  speechRate: 1.0,
};

const FONT_MAP: Record<FontFamily, string> = {
  "Literata": "'Literata', Georgia, serif",
  "Merriweather": "'Merriweather', Georgia, serif",
  "Source Serif 4": "'Source Serif 4', Georgia, serif",
  "Lora": "'Lora', Georgia, serif",
  "Inter": "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  "Atkinson Hyperlegible": "'Atkinson Hyperlegible', sans-serif",
  "OpenDyslexic": "'OpenDyslexic', sans-serif",
  "Noto Nastaliq Urdu": "'Noto Nastaliq Urdu', serif",
};

const MAX_WIDTH_MAP: Record<ReaderMaxWidth, string> = {
  narrow: "620px",
  medium: "720px",
  wide: "840px",
};

export function applyReaderCssVariables(state: Partial<ReaderSettingsState>) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  if (state.fontFamily) {
    root.style.setProperty("--reader-font-family", FONT_MAP[state.fontFamily] || FONT_MAP.Literata);
  }
  if (state.fontSize !== undefined) {
    root.style.setProperty("--reader-font-size", `${state.fontSize}px`);
  }
  if (state.lineHeight !== undefined) {
    root.style.setProperty("--reader-line-height", `${state.lineHeight}`);
  }
  if (state.paragraphSpacing !== undefined) {
    root.style.setProperty("--reader-paragraph-spacing", `${state.paragraphSpacing}em`);
  }
  if (state.letterSpacing !== undefined) {
    root.style.setProperty("--reader-letter-spacing", `${state.letterSpacing}em`);
  }
  if (state.textAlign) {
    root.style.setProperty("--reader-text-align", state.textAlign);
  }
  if (state.maxWidth) {
    root.style.setProperty("--reader-max-width", MAX_WIDTH_MAP[state.maxWidth]);
  }
  if (state.blueLightFilter !== undefined) {
    root.style.setProperty("--reader-warmth", `${state.blueLightFilter}`);
  }
}

export const useReaderSettings = create<ReaderSettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      setFontFamily: (fontFamily) => {
        set({ fontFamily });
        applyReaderCssVariables({ fontFamily });
      },
      setFontSize: (fontSize) => {
        set({ fontSize });
        applyReaderCssVariables({ fontSize });
      },
      setLineHeight: (lineHeight) => {
        set({ lineHeight });
        applyReaderCssVariables({ lineHeight });
      },
      setParagraphSpacing: (paragraphSpacing) => {
        set({ paragraphSpacing });
        applyReaderCssVariables({ paragraphSpacing });
      },
      setLetterSpacing: (letterSpacing) => {
        set({ letterSpacing });
        applyReaderCssVariables({ letterSpacing });
      },
      setTextAlign: (textAlign) => {
        set({ textAlign });
        applyReaderCssVariables({ textAlign });
      },
      setMaxWidth: (maxWidth) => {
        set({ maxWidth });
        applyReaderCssVariables({ maxWidth });
      },
      setReadingMode: (readingMode) => set({ readingMode }),
      setTheme: (theme) => set({ theme }),
      setFocusMode: (focusMode) => set({ focusMode }),
      setAutoHideUI: (autoHideUI) => set({ autoHideUI }),
      setKeepAwake: (keepAwake) => set({ keepAwake }),
      setBlueLightFilter: (blueLightFilter) => {
        set({ blueLightFilter });
        applyReaderCssVariables({ blueLightFilter });
      },
      setSpeechRate: (speechRate) => set({ speechRate }),
      resetToDefault: () => {
        set(DEFAULT_SETTINGS);
        applyReaderCssVariables(DEFAULT_SETTINGS);
      },
    }),
    {
      name: "bluenov-reader-settings-v2",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyReaderCssVariables(state);
        }
      },
    }
  )
);
