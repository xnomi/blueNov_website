"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "sepia" | "dark" | "black" | "system";
export type ResolvedTheme = "light" | "sepia" | "dark" | "black";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  resolvedTheme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = (localStorage.getItem("bluenov-theme") as Theme | null) || "dark";
    setThemeState(stored);
    applyTheme(stored);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      const currentStored = localStorage.getItem("bluenov-theme") as Theme | null;
      if (currentStored === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  const applyTheme = (targetTheme: Theme) => {
    let resolved: ResolvedTheme = "dark";
    if (targetTheme === "system") {
      const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      resolved = isSystemDark ? "dark" : "light";
    } else {
      resolved = targetTheme;
    }

    setResolvedTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
    document.documentElement.setAttribute("data-theme-setting", targetTheme);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("bluenov-theme", newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    // Cycle between light, sepia, dark, black
    const cycleMap: Record<ResolvedTheme, Theme> = {
      light: "sepia",
      sepia: "dark",
      dark: "black",
      black: "light",
    };
    const nextTheme = cycleMap[resolvedTheme] || "dark";
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
