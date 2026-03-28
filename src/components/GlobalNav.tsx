"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStudioStore } from "@/lib/store";

export default function GlobalNav() {
  const pathname = usePathname();
  const currentSection = useStudioStore((s) => s.currentSection);

  const isHome = pathname === "/";

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 500,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 var(--grid-margin)",
        backgroundColor: "transparent",
        mixBlendMode: "multiply",
      }}
    >
      {/* Identity mark */}
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-label)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--ink-full)",
          textDecoration: "none",
        }}
      >
        HKJ
      </Link>

      {/* Section label — shows current scroll section on home, page name elsewhere */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-label)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--ink-muted)",
        }}
      >
        {isHome ? currentSection : pathname.replace("/", "").toUpperCase() || "HOME"}
      </span>
    </header>
  );
}
