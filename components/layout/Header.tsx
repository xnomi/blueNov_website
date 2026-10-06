"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { Logo } from "@/components/common/Logo";
import { useAuth } from "@/hooks/useAuth";
import {
  Search,
  Menu,
  X,
  Sun,
  Moon,
  Bookmark,
  Compass,
  Home,
  Sliders,
  Sparkles,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Shield,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/novels", label: "Browse Novels" },
  { href: "/library", label: "My Library" },
];

export function Header() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const { user, isAuthenticated, loading: authLoading, signOut } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // If in chapter reader page (/novels/[slug]/[chapter]), hide global header
  const segments = pathname.split("/").filter(Boolean);
  const isReaderPage = segments.length >= 3 && segments[0] === "novels";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isReaderPage) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    await signOut();
    router.refresh();
  };

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const fullName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Reader";
  const userInitial = (fullName[0] || "U").toUpperCase();

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "var(--header-bg)",
          borderBottom: "1px solid var(--border-color)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          transition: "box-shadow 0.25s ease, background 0.25s ease",
          boxShadow: scrolled ? "var(--shadow-sm)" : "none",
        }}
      >
        <div
          className="container-main"
          style={{
            display: "flex",
            alignItems: "center",
            height: "64px",
            gap: "1.25rem",
          }}
        >
          {/* Brand Logo with Book & Glasses */}
          <Logo size="md" href="/" />

          {/* Desktop Nav */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              marginLeft: "1.25rem",
              flex: 1,
            }}
            className="desktop-nav"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: "0.45rem 0.85rem",
                    borderRadius: "10px",
                    fontSize: "0.88rem",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "var(--accent)" : "var(--text-secondary)",
                    background: isActive ? "var(--accent-light)" : "transparent",
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "var(--bg-secondary)";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginLeft: "auto",
            }}
          >
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search BlueNov"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "10px",
                padding: "0.5rem 0.75rem",
                cursor: "pointer",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.85rem",
              }}
            >
              <Search size={16} />
              <span className="hidden md:inline" style={{ color: "var(--text-muted)" }}>
                Search novels, authors...
              </span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Cycle theme"
              title={`Current theme: ${resolvedTheme}. Click to cycle.`}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "10px",
                padding: "0.5rem",
                cursor: "pointer",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s ease",
              }}
            >
              {resolvedTheme === "light" ? (
                <Sun size={18} />
              ) : resolvedTheme === "sepia" ? (
                <span style={{ fontSize: "1rem", lineHeight: 1 }}>📜</span>
              ) : (
                <Moon size={18} />
              )}
            </button>

            {/* Authentication Section */}
            {!authLoading && (
              <>
                {isAuthenticated && user ? (
                  <div style={{ position: "relative" }} ref={dropdownRef}>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.45rem",
                        padding: "0.3rem 0.55rem 0.3rem 0.3rem",
                        borderRadius: "999px",
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                      aria-label="User Account Menu"
                    >
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={fullName}
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #1F5FE0, #5BB8F5)",
                            color: "#FFFFFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                          }}
                        >
                          {userInitial}
                        </div>
                      )}
                      <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />
                    </button>

                    {/* Dropdown Menu */}
                    {userDropdownOpen && (
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: "calc(100% + 8px)",
                          width: "230px",
                          background: "var(--bg-card)",
                          border: "1px solid var(--border-color)",
                          borderRadius: "14px",
                          boxShadow: "var(--shadow-lg)",
                          padding: "0.6rem",
                          zIndex: 200,
                          animation: "fadeIn 0.15s ease",
                        }}
                      >
                        <div
                          style={{
                            padding: "0.5rem 0.65rem 0.65rem",
                            borderBottom: "1px solid var(--border-color)",
                            marginBottom: "0.4rem",
                          }}
                        >
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: "0.9rem",
                              color: "var(--text-primary)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {fullName}
                          </div>
                          <div
                            style={{
                              fontSize: "0.78rem",
                              color: "var(--text-muted)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {user.email}
                          </div>
                        </div>

                        <Link
                          href="/library"
                          onClick={() => setUserDropdownOpen(false)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.6rem",
                            padding: "0.5rem 0.65rem",
                            borderRadius: "8px",
                            fontSize: "0.85rem",
                            color: "var(--text-secondary)",
                            textDecoration: "none",
                            transition: "background 0.15s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "var(--bg-secondary)";
                            e.currentTarget.style.color = "var(--text-primary)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "var(--text-secondary)";
                          }}
                        >
                          <Bookmark size={15} />
                          <span>My Library</span>
                        </Link>

                        <Link
                          href="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.6rem",
                            padding: "0.5rem 0.65rem",
                            borderRadius: "8px",
                            fontSize: "0.85rem",
                            color: "var(--text-secondary)",
                            textDecoration: "none",
                            transition: "background 0.15s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "var(--bg-secondary)";
                            e.currentTarget.style.color = "var(--text-primary)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "var(--text-secondary)";
                          }}
                        >
                          <Sliders size={15} />
                          <span>Preferences</span>
                        </Link>

                        {user.email === "admin@bluenov.me" && (
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.6rem",
                              padding: "0.5rem 0.65rem",
                              borderRadius: "8px",
                              fontSize: "0.85rem",
                              color: "var(--accent)",
                              textDecoration: "none",
                              transition: "background 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "var(--accent-light)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                            }}
                          >
                            <Shield size={15} />
                            <span>Admin Panel</span>
                          </Link>
                        )}

                        <div
                          style={{
                            height: "1px",
                            background: "var(--border-color)",
                            margin: "0.4rem 0",
                          }}
                        />

                        <button
                          onClick={handleSignOut}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.6rem",
                            padding: "0.5rem 0.65rem",
                            borderRadius: "8px",
                            fontSize: "0.85rem",
                            color: "#ef4444",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "background 0.15s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <LogOut size={15} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={`/login?next=${encodeURIComponent(pathname)}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.45rem",
                      padding: "0.45rem 0.9rem",
                      borderRadius: "10px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      background: "var(--bg-card)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border-color)",
                      textDecoration: "none",
                      transition: "all 0.15s ease",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-color)";
                      e.currentTarget.style.transform = "none";
                    }}
                  >
                    <UserIcon size={15} style={{ color: "var(--accent)" }} />
                    <span>Sign In</span>
                  </Link>
                )}
              </>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile menu"
              className="mobile-menu-btn"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "10px",
                padding: "0.5rem",
                cursor: "pointer",
                color: "var(--text-secondary)",
                display: "none",
                alignItems: "center",
              }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Drawer */}
        {searchOpen && (
          <div
            style={{
              borderTop: "1px solid var(--border-color)",
              background: "var(--bg-card)",
              padding: "0.85rem 1.25rem",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <form
              onSubmit={handleSearch}
              className="container-main"
              style={{ display: "flex", gap: "0.5rem" }}
            >
              <div style={{ position: "relative", flex: 1 }}>
                <Search
                  size={16}
                  style={{
                    position: "absolute",
                    left: "0.85rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search over 80+ novels by title, author, or genre..."
                  autoFocus
                  className="form-input"
                  style={{ paddingLeft: "2.35rem" }}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ padding: "0 1.25rem" }}>
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Dropdown Nav */}
        {mobileOpen && (
          <div
            style={{
              borderTop: "1px solid var(--border-color)",
              background: "var(--bg-card)",
              padding: "1rem 1.25rem",
            }}
          >
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: "0.65rem 0.85rem",
                    borderRadius: "10px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    textDecoration: "none",
                    background: pathname === link.href ? "var(--accent-light)" : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              ))}

              <div className="divider" style={{ margin: "0.75rem 0" }} />

              {/* Mobile Auth State */}
              {isAuthenticated && user ? (
                <div style={{ padding: "0.35rem 0.5rem" }}>
                  <div
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Signed in as
                  </div>
                  <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem" }}>
                    {user.email}
                  </div>
                  <button
                    onClick={handleSignOut}
                    style={{
                      marginTop: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      color: "#ef4444",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      padding: 0,
                    }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  href={`/login?next=${encodeURIComponent(pathname)}`}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.75rem",
                    borderRadius: "12px",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-color)",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    textDecoration: "none",
                  }}
                >
                  <UserIcon size={16} style={{ color: "var(--accent)" }} />
                  <span>Sign In</span>
                </Link>
              )}

              <div className="divider" style={{ margin: "0.75rem 0" }} />

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Theme</span>
                <div style={{ display: "flex", gap: "0.3rem" }}>
                  {(["light", "sepia", "dark", "black"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      style={{
                        padding: "0.3rem 0.6rem",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        textTransform: "capitalize",
                        background: theme === t ? "var(--accent)" : "var(--bg-secondary)",
                        color: theme === t ? "#FFFFFF" : "var(--text-secondary)",
                        border: "1px solid var(--border-color)",
                        cursor: "pointer",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
