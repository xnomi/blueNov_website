import Link from "next/link";
import { BookOpen, Heart, FileText } from "lucide-react";

const FOOTER_LINKS = {
  "Discover": [
    { href: "/articles", label: "All Articles" },
    { href: "/articles?category=Reviews", label: "Reviews" },
    { href: "/articles?category=News", label: "News" },
    { href: "/articles?category=Writing+Tips", label: "Writing Tips" },
    { href: "/articles?category=Recommendations", label: "Recommendations" },
    { href: "/articles?category=General", label: "General" },
  ],
  "Information": [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

const ARTICLE_CATEGORIES = ["Reviews", "News", "Writing Tips", "Recommendations", "General"];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <footer style={{
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border-color)",
        marginTop: "4rem",
      }}>
        <div className="container-main" style={{ padding: "3rem 1.25rem 2rem" }}>
          <div className="footer-grid">
            {/* Brand */}
            <div>
              <Link href="/" className="footer-logo" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", marginBottom: "1rem" }}>
                <div style={{
                  width: "32px", height: "32px",
                  background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                  borderRadius: "7px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <FileText size={17} color="white" />
                </div>
                <span style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 700, fontSize: "1.25rem",
                  background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>BlueNov</span>
              </Link>
              <p className="body-sm" style={{ color: "var(--text-secondary)", maxWidth: "300px", marginBottom: "1.25rem" }}>
                Your destination for free articles, reviews, and insights. Deep-dive reads across writing, literature, and storytelling — completely free.
              </p>
              {/* Category Pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {ARTICLE_CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    href={`/articles?category=${encodeURIComponent(cat)}`}
                    className="genre-pill"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h3 style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "1rem", color: "var(--text-primary)" }}>{title}</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="footer-link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="divider" />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <p className="caption" style={{ color: "var(--text-muted)" }}>
              © {year} BlueNov — bluenov.me. All rights reserved.
            </p>
            <p className="caption" style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              Made with <Heart size={12} color="#ef4444" fill="#ef4444" /> for readers everywhere
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
        .footer-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.15s ease;
        }
        .footer-link:hover { color: var(--accent); }
        .genre-pill {
          padding: 0.2rem 0.625rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 500;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.15s ease;
        }
        .genre-pill:hover { background: var(--accent-light); color: var(--accent); }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
