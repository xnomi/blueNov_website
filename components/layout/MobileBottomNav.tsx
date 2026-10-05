"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Bookmark, User, Sliders } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  // If in chapter reading route (/novels/[slug]/[chapter]), hide mobile bottom nav
  const segments = pathname.split("/").filter(Boolean);
  const isReaderPage = segments.length >= 3 && segments[0] === "novels";

  if (isReaderPage) {
    return null;
  }

  const NAV_ITEMS = [
    { href: "/", label: "Home", icon: Home },
    { href: "/novels", label: "Browse", icon: Compass },
    { href: "/library", label: "Library", icon: Bookmark },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="mobile-bottom-bar" aria-label="Mobile Navigation">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.2rem",
              textDecoration: "none",
              color: isActive ? "var(--accent)" : "var(--text-muted)",
              minWidth: "60px",
              minHeight: "44px",
              transition: "color 0.15s ease",
            }}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: isActive ? 700 : 500,
                letterSpacing: "0.01em",
              }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
