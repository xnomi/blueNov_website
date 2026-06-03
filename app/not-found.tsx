import Link from "next/link";
import { BookOpen, Home, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found — BlueNov",
  description: "The page you're looking for doesn't exist.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ textAlign: "center", maxWidth: "500px" }}>
        <div style={{
          fontSize: "7rem",
          fontFamily: "var(--font-serif)",
          fontWeight: 900,
          background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          lineHeight: 1,
          marginBottom: "1rem",
        }}>
          404
        </div>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📚</div>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.75rem" }}>
          Page Not Found
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", lineHeight: 1.7 }}>
          Looks like this chapter is missing from our library. The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn-primary">
            <Home size={17} /> Go Home
          </Link>
          <Link href="/novels" className="btn-ghost">
            <BookOpen size={17} /> Browse Novels
          </Link>
        </div>
      </div>
    </div>
  );
}
