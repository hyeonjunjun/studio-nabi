"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { useStudioStore } from "@/lib/store";
import { PROJECTS } from "@/constants/projects";

const GHOST_COUNT = 2;

export default function HeroBlock() {
  const isLoaded = useStudioStore((s) => s.isLoaded);
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP stagger entrance after preloader
  useEffect(() => {
    if (!isLoaded) return;
    const lines = containerRef.current?.querySelectorAll("[data-hero-line]");
    if (!lines?.length) return;

    gsap.fromTo(
      lines,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      }
    );
  }, [isLoaded]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col justify-end"
      style={{
        height: "100vh",
        padding: "0 var(--page-px) 0",
      }}
    >
      {/* Main headline — fills the lower portion */}
      <div style={{ marginBottom: "clamp(2rem, 4vh, 3.5rem)" }}>
        <h1
          data-hero-line
          className="opacity-0"
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            fontSize: "clamp(3.5rem, 2rem + 7vw, 9rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            color: "var(--color-text)",
            textTransform: "uppercase",
          }}
        >
          Design
        </h1>
        <h1
          data-hero-line
          className="opacity-0"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: "clamp(3.5rem, 2rem + 7vw, 9rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            color: "var(--color-text)",
          }}
        >
          engineering.
        </h1>
      </div>

      {/* Bottom rail — micro details */}
      <div
        data-hero-line
        className="flex items-center opacity-0"
        style={{
          paddingBottom: "clamp(1.5rem, 3vh, 2.5rem)",
          borderTop: "1px solid var(--color-border)",
          paddingTop: "1rem",
          gap: "clamp(1.5rem, 3vw, 3rem)",
        }}
      >
        <span
          className="font-mono uppercase tracking-[0.15em]"
          style={{
            fontSize: "var(--text-micro)",
            color: "var(--color-text-secondary)",
          }}
        >
          NYC & Seoul
        </span>

        <span
          className="font-mono uppercase tracking-[0.15em]"
          style={{
            fontSize: "var(--text-micro)",
            color: "var(--color-text-ghost)",
          }}
        >
          {PROJECTS.length} Projects
        </span>

        <span
          className="font-mono uppercase tracking-[0.15em]"
          style={{
            fontSize: "var(--text-micro)",
            color: "var(--color-text-ghost)",
          }}
        >
          {GHOST_COUNT} In Dev
        </span>

        <span
          className="font-mono uppercase tracking-[0.15em] ml-auto hidden sm:block"
          style={{
            fontSize: "var(--text-micro)",
            color: "var(--color-text-ghost)",
          }}
        >
          Est. 2024
        </span>
      </div>
    </div>
  );
}
