"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { PIECES, type Piece } from "@/constants/pieces";
import PageTransition from "@/components/PageTransition";

const pieces = [...PIECES].sort((a, b) => a.order - b.order);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const imageRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Cursor-following image
  const xTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useEffect(() => {
    if (!imageRef.current) return;
    gsap.set(imageRef.current, { xPercent: -50, yPercent: -50 });
    xTo.current = gsap.quickTo(imageRef.current, "x", {
      duration: 0.5,
      ease: "power3",
    });
    yTo.current = gsap.quickTo(imageRef.current, "y", {
      duration: 0.5,
      ease: "power3",
    });
  }, []);

  // Entrance animation
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (navRef.current) navRef.current.style.opacity = "1";
      rowsRef.current.forEach((r) => {
        if (r) {
          r.style.opacity = "1";
          r.style.clipPath = "none";
        }
      });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.2 });

    // Nav
    tl.fromTo(navRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0);

    // Rows clip-reveal stagger
    const validRows = rowsRef.current.filter(Boolean);
    tl.fromTo(
      validRows,
      { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        opacity: 1,
        duration: 0.8,
        stagger: 0.06,
      },
      0.15
    );
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (xTo.current && yTo.current) {
        xTo.current(e.clientX);
        yTo.current(e.clientY);
      }
    },
    []
  );

  const handleRowEnter = useCallback((piece: Piece, index: number) => {
    setActiveIndex(index);

    // Background color shift
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        backgroundColor: piece.cover.bg,
        duration: 0.5,
        ease: "power2.out",
      });
    }

    // Show cursor image
    if (imageRef.current) {
      imageRef.current.style.backgroundColor = piece.cover.bg;
      gsap.to(imageRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power2.out",
      });
    }
  }, []);

  const handleRowLeave = useCallback(() => {
    setActiveIndex(null);

    // Return to paper
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        backgroundColor: "#f5f4f0",
        duration: 0.45,
        ease: "power2.out",
      });
    }

    // Hide cursor image
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        opacity: 0,
        scale: 0.92,
        duration: 0.3,
      });
    }
  }, []);

  return (
    <PageTransition>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        style={{
          height: "100dvh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--paper)",
          transition: "color 0.4s ease",
          position: "relative",
        }}
      >
        {/* ── Cursor-following image preview ── */}
        <div
          ref={imageRef}
          style={{
            position: "fixed",
            width: "clamp(200px, 22vw, 320px)",
            aspectRatio: "3/4",
            pointerEvents: "none",
            zIndex: 50,
            opacity: 0,
            scale: 0.92,
            overflow: "hidden",
            filter: "url(#grain)",
            mixBlendMode: "multiply",
          }}
        />

        {/* ── Nav ── */}
        <header
          ref={navRef}
          style={{
            height: 48,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 var(--grid-margin)",
            opacity: 0,
            position: "relative",
            zIndex: 10,
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: activeIndex !== null ? getDynamicTextColor(pieces[activeIndex].cover.bg) : "var(--ink-full)",
              transition: "color 0.4s ease",
            }}
          >
            HKJ
          </span>
          <nav style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {[
              { label: "Work", href: "/work" },
              { label: "Lab", href: "/lab" },
              { label: "About", href: "/about" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: activeIndex !== null
                    ? getDynamicMutedColor(pieces[activeIndex].cover.bg)
                    : "var(--ink-secondary)",
                  textDecoration: "none",
                  transition: "color 0.4s ease",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        {/* ── Project Index ── */}
        <main
          id="main"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 var(--grid-margin)",
            minHeight: 0,
            position: "relative",
            zIndex: 10,
          }}
        >
          {pieces.map((piece, i) => {
            const num = String(i + 1).padStart(2, "0");
            const isReversed = i >= Math.ceil(pieces.length / 2);
            const isActive = activeIndex === i;
            const isDimmed = activeIndex !== null && activeIndex !== i;
            const href =
              piece.type === "project"
                ? `/work/${piece.slug}`
                : `/lab/${piece.slug}`;

            // Dynamic text colors based on hovered project's bg
            const textColor =
              activeIndex !== null
                ? getDynamicTextColor(pieces[activeIndex].cover.bg)
                : "var(--ink-full)";
            const mutedColor =
              activeIndex !== null
                ? getDynamicMutedColor(pieces[activeIndex].cover.bg)
                : "var(--ink-secondary)";

            return (
              <Link
                key={piece.slug}
                ref={(el) => { rowsRef.current[i] = el; }}
                href={href}
                onMouseEnter={() => handleRowEnter(piece, i)}
                onMouseLeave={handleRowLeave}
                style={{
                  display: "flex",
                  flexDirection: isReversed ? "row-reverse" : "row",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  textDecoration: "none",
                  padding: "0 clamp(0px, 2vw, 24px)",
                  height: `${Math.floor(
                    (100 - 10) / pieces.length
                  )}%`,
                  opacity: isDimmed ? 0.2 : 1,
                  transition:
                    "opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1), transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                  transform: isActive ? "translateX(8px)" : "translateX(0)",
                  clipPath: "inset(100% 0% 0% 0%)",
                  borderBottom: `1px solid ${
                    activeIndex !== null
                      ? isDarkColor(pieces[activeIndex].cover.bg)
                        ? "rgba(255,252,245,0.06)"
                        : "rgba(28,26,23,0.06)"
                      : "rgba(var(--ink-rgb), 0.06)"
                  }`,
                }}
                aria-label={`View ${piece.title}`}
              >
                {/* Left group: number + title */}
                <span
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "0.5em",
                  }}
                >
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.06em",
                      color: mutedColor,
                      transition: "color 0.4s ease",
                    }}
                  >
                    {num}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.06em",
                      color: mutedColor,
                      transition: "color 0.4s ease",
                    }}
                  >
                    /
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: textColor,
                      transition: "color 0.4s ease",
                    }}
                  >
                    {piece.title}
                  </span>
                </span>

                {/* Right group: tags + year */}
                <span
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "clamp(12px, 2vw, 24px)",
                  }}
                >
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: mutedColor,
                      transition: "color 0.4s ease, opacity 0.3s ease, transform 0.3s ease",
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "translateY(0)" : "translateY(4px)",
                    }}
                  >
                    {piece.tags.slice(0, 2).join(" / ")}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.06em",
                      color: mutedColor,
                      transition: "color 0.4s ease",
                    }}
                  >
                    {piece.year}
                  </span>
                </span>
              </Link>
            );
          })}
        </main>

        {/* ── Footer line ── */}
        <footer
          style={{
            height: 36,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 var(--grid-margin)",
            position: "relative",
            zIndex: 10,
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.06em",
              color: activeIndex !== null
                ? getDynamicMutedColor(pieces[activeIndex].cover.bg)
                : "var(--ink-secondary)",
              transition: "color 0.4s ease",
            }}
          >
            Design & Engineering
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.06em",
              color: activeIndex !== null
                ? getDynamicMutedColor(pieces[activeIndex].cover.bg)
                : "var(--ink-secondary)",
              transition: "color 0.4s ease",
            }}
          >
            Seoul, 2026
          </span>
        </footer>
      </div>
    </PageTransition>
  );
}

/* ── Helpers ── */

function isDarkColor(hex: string): boolean {
  const clean = hex.replace("#", "");
  if (clean.length < 6) return false;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}

function getDynamicTextColor(bg: string): string {
  return isDarkColor(bg)
    ? "rgba(255, 252, 245, 0.85)"
    : "rgba(28, 26, 23, 0.82)";
}

function getDynamicMutedColor(bg: string): string {
  return isDarkColor(bg)
    ? "rgba(255, 252, 245, 0.35)"
    : "rgba(28, 26, 23, 0.30)";
}
