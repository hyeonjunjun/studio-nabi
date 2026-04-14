"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavCoordinates() {
  const pathname = usePathname();
  const linkStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: "var(--font-mono)",
    fontSize: 9,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: active ? "var(--nd-100)" : "var(--nd-600)",
    textDecoration: "none",
    transition: "color 0.15s var(--ease)",
  });

  return (
    <nav
      aria-label="Site navigation"
      style={{
        position: "fixed",
        top: 16,
        left: 16,
        right: 16,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        background: "var(--pill-bg)",
        borderRadius: 4,
        pointerEvents: "none",
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--nd-100)",
          textDecoration: "none",
          pointerEvents: "auto",
        }}
      >
        HKJ / Design Engineer
      </Link>

      <div style={{ display: "flex", gap: 20, pointerEvents: "auto" }}>
        <Link href="/" style={linkStyle(pathname === "/")}>Work</Link>
        <Link href="/about" style={linkStyle(pathname === "/about")}>About</Link>
        <Link href="/archive" style={linkStyle(pathname === "/archive")}>Archive</Link>
      </div>

      <span style={{
        fontFamily: "var(--font-mono)",
        fontSize: 9,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--nd-600)",
      }}>
        NY / 2026
      </span>
    </nav>
  );
}
