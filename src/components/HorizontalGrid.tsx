"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Lenis from "lenis";
import { gsap } from "@/lib/gsap";
import type { Piece } from "@/constants/pieces";

interface HorizontalGridProps {
  pieces: Piece[];
}

/*
 * TLB-style horizontal scrolling grid.
 * Images vary in height creating an organic, wave-like rhythm.
 * Horizontal scroll via Lenis (wheel → horizontal translation).
 */

// Height variants for visual rhythm — cycles through these
const HEIGHT_PATTERN = [
  "55vh",  // short
  "70vh",  // tall
  "45vh",  // shorter
  "65vh",  // medium-tall
  "50vh",  // medium
  "72vh",  // tallest
];

export default function HorizontalGrid({ pieces }: HorizontalGridProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const lenisRef = useRef<Lenis | null>(null);

  // Lenis horizontal scroll
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const lenis = new Lenis({
      wrapper,
      content,
      orientation: "horizontal" as const,
      smoothWheel: true,
      lerp: 0.07,
      wheelMultiplier: 1.2,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // Skew items based on scroll velocity
    lenis.on("scroll", (e: { velocity: number }) => {
      const skew = Math.max(-4, Math.min(4, e.velocity * 0.15));
      itemRefs.current.forEach((el) => {
        if (el) {
          el.style.transform = `skewX(${skew}deg)`;
        }
      });
    });

    let raf: number;
    function tick(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  // Entrance animation
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      itemRefs.current.forEach((el) => {
        if (el) el.style.opacity = "1";
      });
      return;
    }

    gsap.fromTo(
      itemRefs.current.filter(Boolean),
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.2,
      }
    );
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: "100%",
        height: "100%",
        overflowX: "auto",
        overflowY: "hidden",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <div
        ref={contentRef}
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "clamp(8px, 1.5vw, 16px)",
          height: "100%",
          padding: "0 var(--grid-margin)",
          paddingBottom: "clamp(48px, 8vh, 80px)",
        }}
      >
        {pieces.map((piece, i) => {
          const height = HEIGHT_PATTERN[i % HEIGHT_PATTERN.length];
          const href =
            piece.type === "project"
              ? `/work/${piece.slug}`
              : `/lab/${piece.slug}`;

          return (
            <Link
              key={piece.slug}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              href={href}
              style={{
                display: "block",
                flexShrink: 0,
                width: "clamp(180px, 22vw, 320px)",
                height,
                position: "relative",
                backgroundColor: piece.cover.bg,
                overflow: "hidden",
                textDecoration: "none",
                opacity: 0,
                transition: "transform 0.15s ease-out",
                willChange: "transform",
              }}
              aria-label={`View ${piece.title}`}
            >
              {/* Image */}
              {piece.image && (
                <Image
                  src={piece.image}
                  alt={piece.title}
                  fill
                  sizes="22vw"
                  style={{ objectFit: "cover" }}
                />
              )}

              {/* Grain */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.1,
                  filter: "url(#grain)",
                  background: piece.cover.bg,
                  mixBlendMode: "multiply",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />

              {/* Hover overlay — shows on hover */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0)",
                  transition: "background 0.3s ease",
                  zIndex: 2,
                  pointerEvents: "none",
                }}
                className="hover-overlay"
              />
            </Link>
          );
        })}
      </div>

      {/* CSS for hover overlay + scrollbar hide */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
