"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavCoordinates() {
  const pathname = usePathname();
  const aboutActive = pathname === "/about";
  const archiveActive = pathname === "/archive";

  const link = (active: boolean): React.CSSProperties => ({
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: active ? "var(--text-primary)" : "var(--text-muted)",
    textDecoration: "none",
    transition: "color 0.15s var(--ease)",
  });

  return (
    <nav
      aria-label="Site navigation"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px clamp(16px, 3vw, 48px)",
        pointerEvents: "none",
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--text-primary)",
          textDecoration: "none",
          pointerEvents: "auto",
        }}
      >
        HKJ
      </Link>

      <div style={{ display: "flex", gap: 16, pointerEvents: "auto" }}>
        <Link href="/about" style={link(aboutActive)}>About</Link>
        <Link href="/archive" style={link(archiveActive)}>Archive</Link>
      </div>
    </nav>
  );
}
