"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PIECES } from "@/constants/pieces";

function isDarkColor(hex: string): boolean {
  const clean = hex.replace("#", "");
  if (clean.length < 6) return false;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}

export default function ArchiveSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const pieces = [...PIECES].sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (headerRef.current) headerRef.current.style.opacity = "1";
      if (gridRef.current) {
        gsap.set(gridRef.current.children, { autoAlpha: 1, y: 0 });
      }
      return;
    }

    const ctx = gsap.context(() => {
      // Header
      ScrollTrigger.create({
        trigger: headerRef.current,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            headerRef.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" }
          );
        },
      });

      // Grid cards stagger
      ScrollTrigger.create({
        trigger: gridRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            gridRef.current!.children,
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.06,
              ease: "expo.out",
            }
          );
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Adaptive columns: 3 cols for 6 items, works on desktop
  const colCount = pieces.length <= 4 ? 2 : pieces.length <= 6 ? 3 : 4;

  return (
    <section
      ref={sectionRef}
      id="work"
      style={{ padding: "0 var(--grid-margin) var(--space-3xl)" }}
    >
      {/* Section header */}
      <div
        ref={headerRef}
        style={{
          maxWidth: "var(--grid-max)",
          marginInline: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          paddingBottom: "var(--space-lg)",
          borderBottom: "1px solid rgba(var(--ink-rgb), 0.08)",
          marginBottom: "var(--space-lg)",
          opacity: 0,
        }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: "var(--text-label)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--ink-secondary)",
          }}
        >
          Selected Work
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: "var(--text-label)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--ink-secondary)",
          }}
        >
          {pieces.length} Pieces
        </span>
      </div>

      {/* Archive grid */}
      <div
        ref={gridRef}
        className="archive-grid"
        style={{
          maxWidth: "var(--grid-max)",
          marginInline: "auto",
          gridTemplateColumns: `repeat(${colCount}, 1fr)`,
        }}
      >
        {pieces.map((piece, i) => {
          const dark = isDarkColor(piece.cover.bg);
          const textColor = dark
            ? "rgba(255,252,245,0.85)"
            : "rgba(28,26,23,0.75)";
          const mutedColor = dark
            ? "rgba(255,252,245,0.45)"
            : "rgba(28,26,23,0.35)";
          const num = String(i + 1).padStart(2, "0");
          const href = piece.type === "project" ? `/work/${piece.slug}` : `/lab/${piece.slug}`;

          return (
            <Link
              key={piece.slug}
              href={href}
              style={{
                display: "block",
                position: "relative",
                aspectRatio: "4/5",
                backgroundColor: piece.cover.bg,
                textDecoration: "none",
                overflow: "hidden",
                transition: "transform var(--dur-hover) var(--ease-out)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
              aria-label={`View ${piece.title}`}
            >
              {/* Grain */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.2,
                  filter: "url(#grain)",
                  background: piece.cover.bg,
                  mixBlendMode: "multiply",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />

              {/* Content */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  padding: "clamp(12px, 2.5%, 20px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  zIndex: 2,
                }}
              >
                {/* Top: number + year */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "var(--text-meta)",
                      letterSpacing: "0.06em",
                      color: mutedColor,
                    }}
                  >
                    {num}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "var(--text-meta)",
                      letterSpacing: "0.06em",
                      color: mutedColor,
                    }}
                  >
                    {piece.year}
                  </span>
                </div>

                {/* Bottom: title + tags */}
                <div>
                  <p
                    className="font-display"
                    style={{
                      fontSize: "var(--text-heading)",
                      fontWeight: 500,
                      lineHeight: "var(--leading-heading)",
                      color: textColor,
                      marginBottom: 4,
                    }}
                  >
                    {piece.title}
                  </p>
                  <p
                    className="font-mono"
                    style={{
                      fontSize: "var(--text-meta)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: mutedColor,
                    }}
                  >
                    {piece.tags.slice(0, 2).join(" / ")}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
