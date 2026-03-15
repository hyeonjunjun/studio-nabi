"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

interface SectionDividerProps {
  /** Which side the accent line originates from */
  direction?: "left" | "right";
}

/**
 * SectionDivider — Ambient parallax transition between sections
 *
 * A thin accent line that scales in from one side and drifts
 * at a different speed than surrounding content, creating a
 * floating depth layer at section boundaries.
 */
export default function SectionDivider({
  direction = "left",
}: SectionDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !lineRef.current) return;

    // Line scales in as it enters viewport
    gsap.fromTo(
      lineRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          end: "bottom 40%",
          scrub: 0.4,
        },
      }
    );

    // Container drifts at its own speed — creates floating depth
    gsap.fromTo(
      containerRef.current,
      { yPercent: 15 },
      {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.25,
        },
      }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden pointer-events-none"
      style={{
        height: "clamp(3rem, 6vh, 5rem)",
      }}
    >
      <div
        ref={lineRef}
        className="absolute"
        style={{
          top: "50%",
          ...(direction === "left"
            ? { left: "var(--page-px)" }
            : { right: "var(--page-px)" }),
          width: "60px",
          height: "1px",
          backgroundColor: "var(--color-accent)",
          opacity: 0.2,
          transformOrigin:
            direction === "left" ? "left center" : "right center",
          transform: "scaleX(0)",
        }}
      />
    </div>
  );
}
