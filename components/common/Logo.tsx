"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/components/layout/ThemeProvider";
import { useEffect, useState } from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  href?: string;
  className?: string;
}

export function Logo({
  size = "md",
  showText = true,
  href = "/",
  className = "",
}: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dimensions = {
    sm: { icon: 32, text: "1.15rem", gap: "0.5rem" },
    md: { icon: 42, text: "1.35rem", gap: "0.65rem" },
    lg: { icon: 54, text: "1.75rem", gap: "0.85rem" },
  }[size];

  const content = (
    <div
      className={`inline-flex items-center select-none group ${className}`}
      style={{ gap: dimensions.gap, textDecoration: "none" }}
    >
      <div
        style={{
          width: dimensions.icon,
          height: dimensions.icon,
          position: "relative",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
        className="group-hover:scale-105"
      >
        <Image
          src="/bluenov_logo_mark.png"
          alt="BlueNov Logo"
          width={dimensions.icon * 2}
          height={dimensions.icon * 2}
          priority
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "drop-shadow(0 2px 8px rgba(31, 95, 224, 0.3))",
          }}
        />
      </div>

      {showText && (
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 800,
            fontSize: dimensions.text,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          <span style={{ color: "var(--text-primary)" }}>Blue</span>
          <span
            style={{
              background: "linear-gradient(135deg, #1F5FE0 0%, #5BB8F5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Nov
          </span>
        </span>
      )}
    </div>
  );

  if (!href) return content;
  return (
    <Link href={href} style={{ textDecoration: "none", display: "inline-flex" }}>
      {content}
    </Link>
  );
}
