"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Bot,
  BrainCircuit,
  FileText,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Search,
  BookOpen,
  HelpCircle,
  Cpu,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function AdminAgoPage() {
  const [copied, setCopied] = useState(false);
  const [testPremise, setTestPremise] = useState(
    "The Shadow Chronicles is an epic fantasy web novel set in the realm of Eldoria, following shadow-warrior Kaelen as he confronts an ancient darkness threatening the mortal plane."
  );

  const siteUrl = "https://bluenov.me";
  const llmsUrl = `${siteUrl}/llms.txt`;

  const copyLlms = () => {
    navigator.clipboard.writeText(llmsUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: "1000px" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
          <div
            style={{
              padding: "0.35rem 0.65rem",
              borderRadius: "999px",
              background: "linear-gradient(135deg, rgba(31, 95, 224, 0.15), rgba(91, 184, 245, 0.15))",
              color: "var(--accent)",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            <Sparkles size={12} />
            Answer Engine Optimization (AGO / AEO)
          </div>
        </div>
        <h1 className="h2" style={{ margin: "0 0 0.5rem" }}>
          AI Generated Optimization (AGO) Center
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: 0 }}>
          Optimize BlueNov novels for generative AI answer engines including Perplexity AI, ChatGPT Search, Google Gemini & AI Overviews, and Claude.
        </p>
      </div>

      {/* llms.txt Showcase Card */}
      <div
        className="card"
        style={{
          padding: "2rem",
          marginBottom: "2rem",
          background: "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
              <Bot size={22} color="var(--accent)" />
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
                Machine-Readable llms.txt Manifest
              </h2>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
              The standardized file format read by AI web crawlers to instantly discover, summarize, and cite BlueNov web novels without hallucination.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={copyLlms}
              className="btn-ghost"
              style={{ fontSize: "0.8rem", gap: "0.35rem", padding: "0.4rem 0.75rem" }}
            >
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </button>
            <a
              href="/llms.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ fontSize: "0.8rem", gap: "0.4rem", padding: "0.4rem 0.85rem" }}
            >
              <ExternalLink size={14} />
              <span>View Live llms.txt</span>
            </a>
          </div>
        </div>

        {/* URL Pill */}
        <div
          style={{
            padding: "0.85rem 1.25rem",
            background: "var(--bg-primary)",
            borderRadius: "12px",
            border: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
              Live Endpoint
            </div>
            <code style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>
              {llmsUrl}
            </code>
          </div>
          <span className="badge" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
            Status: 200 OK (Cached 24h)
          </span>
        </div>
      </div>

      {/* AI Bot Crawler Permission Matrix */}
      <div className="card" style={{ padding: "2rem", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.35rem" }}>
          AI Search Engine Access Matrix
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          Configured in robots.txt to welcome AI answer engines while shielding admin panels.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          {[
            {
              engine: "Perplexity AI",
              bot: "PerplexityBot",
              purpose: "Direct answer engine & novel citations",
              status: "Authorized",
              icon: "🔍",
            },
            {
              engine: "ChatGPT Search",
              bot: "GPTBot / ChatGPT-User",
              purpose: "OpenAI web search & book recommendations",
              status: "Authorized",
              icon: "🤖",
            },
            {
              engine: "Google Gemini",
              bot: "Google-Extended",
              purpose: "Google AI Overviews & knowledge synthesis",
              status: "Authorized",
              icon: "✨",
            },
            {
              engine: "Anthropic Claude",
              bot: "ClaudeBot",
              purpose: "Literary analysis & character summarization",
              status: "Authorized",
              icon: "🧠",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                padding: "1.25rem",
                borderRadius: "12px",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "1.5rem" }}>{item.icon}</span>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#10b981", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <CheckCircle2 size={13} /> {item.status}
                </span>
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "0.2rem" }}>
                {item.engine}
              </div>
              <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "var(--accent)", marginBottom: "0.5rem" }}>
                User-Agent: {item.bot}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                {item.purpose}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Novel AGO Readiness Guidelines */}
      <div className="card" style={{ padding: "2rem" }}>
        <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.35rem" }}>
          AGO Novel Writing & Tagging Checklist
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          Follow these best practices when publishing novels to maximize discovery in AI prompts.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[
            {
              title: "Lead with a Definitive One-Sentence Premise",
              desc: "State protagonist name, genre, core conflict, and setting in the first 25 words. AI answer engines extract this directly for book recommendation cards.",
              score: "Crucial",
            },
            {
              title: "Explicit Genre Taxonomy",
              desc: "Tag novels with exact genres (e.g., 'Fantasy', 'Romance', 'Sci-Fi') rather than obscure abbreviations so semantic vector search correctly groups them.",
              score: "High",
            },
            {
              title: "Clean Scene Breaks & Dialogue Formatting",
              desc: "Avoid excessive ASCII art borders. Real <p> tags with proper dialogue quotes allow LLMs to parse characters and dialogue trees cleanly.",
              score: "High",
            },
            {
              title: "Distinct Chapter Titles",
              desc: "Pair numbers with descriptive names (e.g. 'Chapter 1: The Gathering Shadows') rather than just 'Ch. 1' to provide semantic anchors.",
              score: "Recommended",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem",
                padding: "1rem",
                borderRadius: "10px",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "var(--accent-light)",
                  color: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              >
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                  {item.title}
                </div>
                <div style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {item.desc}
                </div>
              </div>
              <span
                style={{
                  padding: "0.2rem 0.55rem",
                  borderRadius: "6px",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  background: "rgba(31, 95, 224, 0.1)",
                  color: "var(--accent)",
                  whiteSpace: "nowrap",
                }}
              >
                {item.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
