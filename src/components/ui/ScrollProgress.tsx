"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * ScrollProgress — Thin accent bar + percentage indicator
 *
 * 1px accent-colored bar at the very top of the viewport.
 * Percentage text in the bottom-right corner, fades in
 * once the user scrolls past the first few percent.
 */
export default function ScrollProgress() {
  const [pct, setPct] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const val = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      setPct(val);

      if (barRef.current) {
        gsap.to(barRef.current, {
          scaleX: val / 100,
          duration: 0.12,
          ease: "none",
          overwrite: true,
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Bar — top of viewport */}
      <div
        className="fixed top-0 left-0 right-0 z-[60] pointer-events-none"
        style={{ height: 1 }}
      >
        <div
          ref={barRef}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "var(--color-accent)",
            transformOrigin: "left center",
            transform: "scaleX(0)",
            opacity: 0.5,
          }}
        />
      </div>

      {/* Percentage — bottom-right corner */}
      <div
        className="fixed z-[55] font-mono pointer-events-none mix-blend-difference"
        style={{
          bottom: "clamp(1.5rem, 3vh, 2.5rem)",
          right: "var(--page-px)",
          fontSize: "var(--text-micro)",
          color: "var(--color-text-ghost)",
          letterSpacing: "0.06em",
          fontVariantNumeric: "tabular-nums",
          opacity: pct > 3 ? 0.5 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        {pct}%
      </div>
    </>
  );
}
