"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function GlobalNav() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 80 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 500,
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 var(--grid-margin)",
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 400ms var(--ease-out)",
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-label)",
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          color: "var(--ink-full)",
          textDecoration: "none",
        }}
      >
        HKJ
      </Link>

      <nav style={{ display: "flex", gap: 24, alignItems: "center" }}>
        {["Work", "About", "Contact"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-label)",
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              color: "var(--ink-secondary)",
              textDecoration: "none",
              transition: "color var(--dur-hover) var(--ease-out)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ink-full)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ink-secondary)"; }}
          >
            {item}
          </a>
        ))}
      </nav>
    </header>
  );
}
