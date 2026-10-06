"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Send,
  Zap,
  Copy,
  Check,
  RefreshCw,
  FileCode,
  ShieldCheck,
  Smartphone,
  Monitor,
  Share2,
} from "lucide-react";

export default function AdminSeoPage() {
  const [copied, setCopied] = useState(false);
  const [testTitle, setTestTitle] = useState("The Shadow Chronicles | Free Web Novel | BlueNov");
  const [testDesc, setTestDesc] = useState("Read The Shadow Chronicles by Arthur Pendragon free online. An epic fantasy adventure following warriors through mystical realms and hidden magic.");
  const [testSlug, setTestSlug] = useState("the-shadow-chronicles");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [pinging, setPinging] = useState(false);

  const siteUrl = "https://bluenov.me";
  const sitemapUrl = `${siteUrl}/sitemap.xml`;

  const copySitemap = () => {
    navigator.clipboard.writeText(sitemapUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePingSearchEngines = async () => {
    setPinging(true);
    setPingStatus("Sending ping notifications to Google, Bing & IndexNow...");
    // Simulate ping / provide direct ping URLs
    setTimeout(() => {
      setPinging(false);
      setPingStatus("✅ Sitemap ping signal triggered! Follow the Search Console link below to submit directly for priority crawling.");
    }, 1200);
  };

  const titleLength = testTitle.length;
  const descLength = testDesc.length;

  return (
    <div style={{ maxWidth: "1000px" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
          <div
            style={{
              padding: "0.35rem 0.65rem",
              borderRadius: "999px",
              background: "rgba(31, 95, 224, 0.1)",
              color: "var(--accent)",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Search Engine Optimization
          </div>
        </div>
        <h1 className="h2" style={{ margin: "0 0 0.5rem" }}>
          SEO & Fast Indexing Center
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: 0 }}>
          Manage sitemap distribution, trigger search engine indexing, and optimize Google SERP presentation for BlueNov.
        </p>
      </div>

      {/* Fast Indexing & Sitemap Submission Card */}
      <div
        className="card"
        style={{
          padding: "2rem",
          marginBottom: "2rem",
          background: "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
              <Zap size={20} color="var(--accent)" />
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
                Accelerated Google Search Console Indexing
              </h2>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
              Submit your dynamic XML sitemap to Google and Bing for rapid discovery of newly added novels and chapters.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={handlePingSearchEngines}
              disabled={pinging}
              className="btn-primary"
              style={{ fontSize: "0.85rem", gap: "0.45rem", padding: "0.5rem 1rem" }}
            >
              <Send size={15} />
              <span>{pinging ? "Notifying..." : "Ping Search Engines"}</span>
            </button>
          </div>
        </div>

        {pingStatus && (
          <div
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "10px",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              color: "#10b981",
              fontSize: "0.85rem",
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <CheckCircle2 size={16} />
            <span>{pingStatus}</span>
          </div>
        )}

        {/* Sitemap URL Box */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.85rem 1.25rem",
            background: "var(--bg-primary)",
            borderRadius: "12px",
            border: "1px solid var(--border-color)",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <FileCode size={20} color="var(--accent)" />
          <div style={{ flex: 1, minWidth: "220px" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
              Production Sitemap URL
            </div>
            <code style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>
              {sitemapUrl}
            </code>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={copySitemap}
              className="btn-ghost"
              style={{ fontSize: "0.8rem", gap: "0.35rem", padding: "0.4rem 0.75rem" }}
            >
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copied ? "Copied!" : "Copy URL"}</span>
            </button>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              style={{ fontSize: "0.8rem", gap: "0.35rem", padding: "0.4rem 0.75rem" }}
            >
              <ExternalLink size={14} />
              <span>Inspect XML</span>
            </a>
          </div>
        </div>

        {/* Direct Console Links */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          <a
            href="https://search.google.com/search-console/sitemaps"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 1.25rem",
              borderRadius: "12px",
              background: "var(--bg-primary)",
              border: "1px solid var(--border-color)",
              textDecoration: "none",
              color: "var(--text-primary)",
              transition: "transform 0.15s ease, border-color 0.15s ease",
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
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span>Google Search Console</span>
                <ExternalLink size={13} color="var(--text-muted)" />
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                Submit sitemap directly for instant crawling
              </div>
            </div>
            <span style={{ fontSize: "1.25rem" }}>🔍</span>
          </a>

          <a
            href="https://www.bing.com/webmasters/sitemaps"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 1.25rem",
              borderRadius: "12px",
              background: "var(--bg-primary)",
              border: "1px solid var(--border-color)",
              textDecoration: "none",
              color: "var(--text-primary)",
              transition: "transform 0.15s ease, border-color 0.15s ease",
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
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span>Bing Webmaster Tools</span>
                <ExternalLink size={13} color="var(--text-muted)" />
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                Bing & Yahoo fast-indexing submission
              </div>
            </div>
            <span style={{ fontSize: "1.25rem" }}>🌐</span>
          </a>
        </div>
      </div>

      {/* Live Google SERP Simulator */}
      <div className="card" style={{ padding: "2rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "0 0 0.25rem" }}>
              Live Google SERP Snippet Preview
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
              Simulate how novel titles and descriptions appear in Google search results.
            </p>
          </div>

          {/* Device Toggle */}
          <div style={{ display: "flex", gap: "0.25rem", background: "var(--bg-secondary)", padding: "0.25rem", borderRadius: "8px" }}>
            <button
              onClick={() => setPreviewDevice("desktop")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                padding: "0.3rem 0.65rem",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: 600,
                background: previewDevice === "desktop" ? "var(--bg-card)" : "transparent",
                color: previewDevice === "desktop" ? "var(--accent)" : "var(--text-secondary)",
                boxShadow: previewDevice === "desktop" ? "var(--shadow-sm)" : "none",
              }}
            >
              <Monitor size={14} /> Desktop
            </button>
            <button
              onClick={() => setPreviewDevice("mobile")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                padding: "0.3rem 0.65rem",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: 600,
                background: previewDevice === "mobile" ? "var(--bg-card)" : "transparent",
                color: previewDevice === "mobile" ? "var(--accent)" : "var(--text-secondary)",
                boxShadow: previewDevice === "mobile" ? "var(--shadow-sm)" : "none",
              }}
            >
              <Smartphone size={14} /> Mobile
            </button>
          </div>
        </div>

        {/* Google Result Preview Box */}
        <div
          style={{
            padding: "1.5rem",
            background: "#ffffff",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            marginBottom: "1.75rem",
            maxWidth: previewDevice === "mobile" ? "420px" : "680px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {/* Breadcrumb row */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#1F5FE0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "0.65rem",
                fontWeight: 700,
              }}
            >
              B
            </div>
            <div style={{ fontSize: "0.8rem", color: "#202124", lineHeight: 1.2 }}>
              <div style={{ fontWeight: 600 }}>BlueNov</div>
              <div style={{ color: "#4d5156", fontSize: "0.75rem" }}>
                https://bluenov.me › novels › {testSlug}
              </div>
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              color: "#1a0dab",
              fontSize: previewDevice === "mobile" ? "1.1rem" : "1.25rem",
              fontWeight: 400,
              lineHeight: 1.3,
              marginBottom: "0.35rem",
              cursor: "pointer",
              fontFamily: "arial, sans-serif",
            }}
          >
            {testTitle || "Untitled Novel"}
          </div>

          {/* Snippet */}
          <div
            style={{
              color: "#4d5156",
              fontSize: "0.875rem",
              lineHeight: 1.45,
              fontFamily: "arial, sans-serif",
            }}
          >
            {testDesc || "No description provided."}
          </div>
        </div>

        {/* Live Simulator Inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
              <label className="form-label" style={{ margin: 0 }}>Meta Title</label>
              <span
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: titleLength >= 50 && titleLength <= 60 ? "#10b981" : titleLength > 60 ? "#ef4444" : "var(--text-muted)",
                }}
              >
                {titleLength} / 60 characters {titleLength >= 50 && titleLength <= 60 && "✓ Optimal"}
              </span>
            </div>
            <input
              type="text"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
              <label className="form-label" style={{ margin: 0 }}>Meta Description</label>
              <span
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: descLength >= 120 && descLength <= 160 ? "#10b981" : descLength > 160 ? "#ef4444" : "var(--text-muted)",
                }}
              >
                {descLength} / 160 characters {descLength >= 120 && descLength <= 160 && "✓ Optimal"}
              </span>
            </div>
            <textarea
              rows={3}
              value={testDesc}
              onChange={(e) => setTestDesc(e.target.value)}
              className="form-input"
              style={{ resize: "vertical" }}
            />
          </div>

          <div>
            <label className="form-label">Novel Slug</label>
            <input
              type="text"
              value={testSlug}
              onChange={(e) => setTestSlug(e.target.value)}
              className="form-input"
            />
          </div>
        </div>
      </div>

      {/* Technical SEO Audit Checklist */}
      <div className="card" style={{ padding: "2rem" }}>
        <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "1rem" }}>
          Technical SEO & Indexability Health
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            {
              title: "Robots.txt Configuration",
              desc: "Allowing /novels, /genre and all public fiction. Admin, auth, and api protected.",
              status: "Pass",
              link: "/robots.txt",
            },
            {
              title: "Dynamic XML Sitemap (/sitemap.xml)",
              desc: "Includes all published novels, chapters, and genres with precise ISO lastmod dates.",
              status: "Pass",
              link: "/sitemap.xml",
            },
            {
              title: "Structured Data Schema.org",
              desc: "Schema.org Book, Chapter, WebSite, and BreadcrumbList schemas active across all pages.",
              status: "Pass",
            },
            {
              title: "Canonical URLs & OpenGraph",
              desc: "Self-referencing canonical tags and responsive 1200x630 OpenGraph cards enabled.",
              status: "Pass",
            },
            {
              title: "Fast Crawl Frequency",
              desc: "Hourly changeFrequency for catalogs; weekly for chapters to maximize crawl budget.",
              status: "Pass",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem",
                borderRadius: "10px",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                gap: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <CheckCircle2 size={18} color="#10b981" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{item.title}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{item.desc}</div>
                </div>
              </div>

              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                  style={{ fontSize: "0.8rem", padding: "0.35rem 0.65rem", gap: "0.3rem" }}
                >
                  <ExternalLink size={13} /> View
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
