"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import type { Project } from "@/constants/projects";

interface CoverProps {
  project: Project;
  index: number;
  colSpan?: number;
  aspectRatio?: string;
}

export function Cover({ project, index, colSpan = 6, aspectRatio = "4/3" }: CoverProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const accentBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  const isDark = isDarkColor(project.cover.bg);
  const textColor = isDark ? "rgba(255,252,245,0.85)" : "rgba(35,32,28,0.82)";
  const number = String(index + 1).padStart(2, "0");

  function onEnter() {
    gsap.to(cardRef.current, { y: -4, duration: 0.35, ease: "expo.out" });
    gsap.to(titleRef.current, { y: -4, duration: 0.4, ease: "expo.out", delay: 0.04 });
    gsap.to(accentBarRef.current, { scaleY: 1, duration: 0.3, ease: "expo.out", delay: 0.05 });
    gsap.to(bottomBarRef.current, { scaleX: 1, duration: 0.3, ease: "expo.out" });
  }

  function onLeave() {
    gsap.to(cardRef.current, { y: 0, duration: 0.4, ease: "expo.out" });
    gsap.to(titleRef.current, { y: 0, duration: 0.4, ease: "expo.out" });
    gsap.to(accentBarRef.current, { scaleY: 0, duration: 0.25, ease: "expo.out" });
    gsap.to(bottomBarRef.current, { scaleX: 0, duration: 0.25, ease: "expo.out" });
  }

  return (
    <Link
      ref={cardRef}
      href={`/work/${project.slug}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        gridColumn: `span ${colSpan}`,
        display: "block",
        position: "relative",
        backgroundColor: project.cover.bg,
        aspectRatio,
        textDecoration: "none",
        overflow: "hidden",
        borderRadius: 0,
      }}
      aria-label={`View ${project.title}`}
    >
      {/* Cover image */}
      {project.coverImage && (
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          style={{ objectFit: "cover" }}
          priority={index === 0}
        />
      )}

      {/* Grain overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.25,
          filter: "url(#grain)",
          background: project.cover.bg,
          mixBlendMode: "multiply",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Left accent bar — hover reveal */}
      <div
        ref={accentBarRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 3,
          height: "100%",
          backgroundColor: "var(--accent)",
          transformOrigin: "bottom center",
          transform: "scaleY(0)",
          zIndex: 4,
          pointerEvents: "none",
        }}
      />

      {/* Bottom border — hover reveal */}
      <div
        ref={bottomBarRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          backgroundColor: "var(--raw)",
          transformOrigin: "left center",
          transform: "scaleX(0)",
          zIndex: 4,
          pointerEvents: "none",
        }}
      />

      {/* Interior content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "clamp(14px, 3%, 24px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          zIndex: 2,
        }}
      >
        {/* Top row: number + year */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span
            className="font-mono"
            style={{
              fontSize: "var(--text-label)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: textColor,
            }}
          >
            {number}
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: "var(--text-label)",
              letterSpacing: "0.08em",
              color: textColor,
              opacity: 0.5,
            }}
          >
            {project.year}
          </span>
        </div>

        {/* Bottom: title block */}
        <div ref={titleRef}>
          <p
            className="font-display"
            style={{
              fontSize: "var(--text-display-sm)",
              fontWeight: 700,
              lineHeight: "var(--leading-display-md)",
              color: textColor,
              marginBottom: "var(--space-small)",
            }}
          >
            {project.title}
          </p>
          <p
            className="font-mono"
            style={{
              fontSize: "var(--text-label)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: textColor,
              opacity: 0.6,
            }}
          >
            {project.sector}
          </p>
        </div>
      </div>
    </Link>
  );
}

function isDarkColor(hex: string): boolean {
  const clean = hex.replace("#", "");
  if (clean.length < 6) return false;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}
