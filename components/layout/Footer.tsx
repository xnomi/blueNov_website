"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/common/Logo";
import { Heart, Compass, Bookmark, BookOpen, Sparkles } from "lucide-react";

const GENRES = [
  { name: "Fantasy", slug: "fantasy" },
  { name: "Romance", slug: "romance" },
  { name: "Sci-Fi", slug: "sci-fi" },
  { name: "Mystery", slug: "mystery" },
  { name: "Thriller", slug: "thriller" },
  { name: "Adventure", slug: "adventure" },
  { name: "Horror", slug: "horror" },
  { name: "Drama", slug: "drama" },
];

const FOOTER_NAV = {
  "Explore": [
    { href: "/novels", label: "All Novels" },
    { href: "/novels?status=ongoing", label: "Ongoing Series" },
    { href: "/novels?status=completed", label: "Completed Novels" },
    { href: "/library", label: "My Library Shelf" },
    { href: "/search", label: "Search Directory" },
  ],
  "Company": [
    { href: "/about", label: "About BlueNov" },
    { href: "/contact", label: "Contact Us" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  // If in chapter reading route (/novels/[slug]/[chapter]) or admin panel (/admin), hide global footer
  const segments = pathname.split("/").filter(Boolean);
  const isReaderPage = segments.length >= 3 && segments[0] === "novels";
  const isAdminPage = pathname.startsWith("/admin");

  if (isReaderPage || isAdminPage) return null;

  return (
    <>
      <footer
        style={{
          background: "var(--bg-card)",
          borderTop: "1px solid var(--border-color)",
          marginTop: "4rem",
        }}
      >
        <div className="container-main" style={{ padding: "3.5rem 1.25rem 2rem" }}>
          <div className="footer-grid">
            {/* Brand Column */}
            <div>
              <div style={{ marginBottom: "1rem" }}>
                <Logo size="md" href="/" />
              </div>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  maxWidth: "320px",
                  marginBottom: "1.25rem",
                }}
              >
                BlueNov is a premium web novel reading platform. Read immersive fiction across all genres with customizable typography, dark & sepia themes, and zero distractions.
              </p>

              {/* Genre Pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", maxWidth: "340px" }}>
                {GENRES.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/genre/${g.slug}`}
                    style={{
                      padding: "0.2rem 0.65rem",
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-secondary)",
                      textDecoration: "none",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent)";
                      e.currentTarget.style.color = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-color)";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }}
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Navigation Columns */}
            {Object.entries(FOOTER_NAV).map(([title, links]) => (
              <div key={title}>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    marginBottom: "1rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {title}
                </h3>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.55rem",
                  }}
                >
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        style={{
                          color: "var(--text-secondary)",
                          textDecoration: "none",
                          fontSize: "0.875rem",
                          transition: "color 0.15s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="divider" style={{ margin: "2.5rem 0 1.5rem" }} />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <p className="caption" style={{ color: "var(--text-muted)" }}>
              © {year} BlueNov — bluenov.me. All rights reserved.
            </p>
            <p
              className="caption"
              style={{
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              Crafted with <Heart size={12} color="#EF4444" fill="#EF4444" /> for novel lovers worldwide
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 2.5rem;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </>
  );
}
