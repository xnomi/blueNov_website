"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import { Search, Menu, X, Sun, Moon, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

const NAV_LINKS = [
  { href: "/novels", label: "Novels" },
  { href: "/articles", label: "Articles" },
  { href: "/genre/fantasy", label: "Fantasy" },
  { href: "/genre/romance", label: "Romance" },
  { href: "/genre/thriller", label: "Thriller" },
];

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "var(--header-bg)",
          borderBottom: "1px solid var(--border-color)",
          backdropFilter: "blur(12px)",
          transition: "box-shadow 0.3s ease",
          boxShadow: scrolled ? "var(--shadow-md)" : "none",
        }}
      >
        <div className="container-main" style={{ display: "flex", alignItems: "center", height: "64px", gap: "1rem" }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", flexShrink: 0 }}>
            <div style={{
              width: "36px", height: "36px",
              background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
              borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <BookOpen size={20} color="white" strokeWidth={2} />
            </div>
            <span style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 700,
              fontSize: "1.375rem",
              background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>BlueNov</span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: "flex", gap: "0.25rem", marginLeft: "1.5rem", flex: 1 }} className="desktop-nav">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "0.4rem 0.875rem",
                  borderRadius: "6px",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = "var(--bg-secondary)";
                  (e.target as HTMLElement).style.color = "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = "transparent";
                  (e.target as HTMLElement).style.color = "var(--text-secondary)";
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "auto" }}>
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                padding: "0.5rem",
                cursor: "pointer",
                color: "var(--text-secondary)",
                display: "flex", alignItems: "center",
                transition: "all 0.2s ease",
              }}
            >
              <Search size={18} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                padding: "0.5rem",
                cursor: "pointer",
                color: "var(--text-secondary)",
                display: "flex", alignItems: "center",
                transition: "all 0.2s ease",
              }}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="mobile-menu-btn"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                padding: "0.5rem",
                cursor: "pointer",
                color: "var(--text-secondary)",
                display: "none", alignItems: "center",
                transition: "all 0.2s ease",
              }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Search Bar dropdown */}
        {searchOpen && (
          <div style={{
            borderTop: "1px solid var(--border-color)",
            background: "var(--header-bg)",
            padding: "0.75rem 1.25rem",
          }}>
            <form onSubmit={handleSearch} className="container-main" style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search novels, articles, genres..."
                autoFocus
                className="form-input"
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn-primary">Search</button>
            </form>
          </div>
        )}

        {/* Mobile Nav */}
        {mobileOpen && (
          <div style={{
            borderTop: "1px solid var(--border-color)",
            background: "var(--bg-card)",
            padding: "1rem 1.25rem",
          }}>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: "0.625rem 0.75rem",
                    borderRadius: "8px",
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
