"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { PIECES } from "@/constants/pieces";
import { CONTACT_EMAIL } from "@/constants/contact";
import { useStore } from "@/store/useStore";

const allPieces = [...PIECES].sort((a, b) => a.order - b.order);

export default function Home() {
  const [hoveredSlug, setLocalHovered] = useState<string | null>(null);
  const setStoreHovered = useStore((s) => s.setHoveredSlug);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleHover = (slug: string | null) => {
    setLocalHovered(slug);
    setStoreHovered(slug);
  };

  // Entrance animation
  useEffect(() => {
    if (!containerRef.current) return;
    const els = containerRef.current.querySelectorAll("[data-reveal]");
    gsap.fromTo(
      els,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.3,
      }
    );
  }, []);

  const hoveredPiece = allPieces.find((p) => p.slug === hoveredSlug);

  return (
    <main
      id="main"
      ref={containerRef}
      style={{
        height: "100vh",
        display: "flex",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ════════════════════════════════════════════════════
          Background image — hovered project's image fades
          in behind everything at low opacity, desaturated.
          A memory surfacing behind the composition.
          ════════════════════════════════════════════════════ */}
      {allPieces.map((piece) => (
        piece.image && (
          <div
            key={piece.slug}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              opacity: hoveredSlug === piece.slug ? 0.1 : 0,
              transition: "opacity 0.8s cubic-bezier(.23,.88,.26,.92)",
              pointerEvents: "none",
            }}
          >
            <Image
              src={piece.image}
              alt=""
              fill
              sizes="100vw"
              style={{
                objectFit: "cover",
                filter: "saturate(0.3) contrast(1.1) brightness(0.6)",
              }}
              priority={false}
            />
          </div>
        )
      ))}

      {/* ════════════════════════════════════════════════════
          Zone 1 — Identity (left ~40%)
          The anchor. Who you are. Static, typographic.
          Like the left page of an open book.
          ════════════════════════════════════════════════════ */}
      <div
        style={{
          width: "40%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 clamp(32px, 5vw, 80px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Name */}
        <h1
          data-reveal
          className="font-display"
          style={{
            fontSize: "clamp(36px, 4vw, 56px)",
            fontWeight: 400,
            fontStyle: "italic",
            lineHeight: 1.1,
            color: "var(--ink-primary)",
            letterSpacing: "-0.02em",
            opacity: 0,
          }}
        >
          Hyeon Jun
        </h1>

        {/* Role */}
        <p
          data-reveal
          className="font-mono uppercase"
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "var(--ink-muted)",
            marginTop: 16,
            opacity: 0,
          }}
        >
          Design Engineer
        </p>

        {/* Divider */}
        <div
          data-reveal
          style={{
            width: 32,
            height: 1,
            background: "var(--ink-ghost)",
            marginTop: 32,
            marginBottom: 32,
            opacity: 0,
          }}
        />

        {/* Statement */}
        <p
          data-reveal
          className="font-body"
          style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: "var(--ink-secondary)",
            maxWidth: "32ch",
            opacity: 0,
          }}
        >
          Building at the intersection of craft and systems thinking.
        </p>

        {/* Bottom metadata */}
        <div
          data-reveal
          style={{
            position: "absolute",
            bottom: "clamp(24px, 4vh, 48px)",
            left: "clamp(32px, 5vw, 80px)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            opacity: 0,
          }}
        >
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.04em",
              color: "var(--ink-muted)",
              transition: "color 0.3s",
            }}
          >
            {CONTACT_EMAIL}
          </a>
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 11,
              letterSpacing: "0.08em",
              color: "var(--ink-ghost)",
            }}
          >
            New York · 2026
          </span>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 2 — Work (right ~60%)
          Stacked project cards with depth.
          Like photographs laid on a surface.
          ════════════════════════════════════════════════════ */}
      <div
        style={{
          width: "60%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "clamp(320px, 80%, 560px)",
            height: "clamp(360px, 65vh, 520px)",
          }}
        >
          {allPieces.map((piece, i) => {
            const isHovered = hoveredSlug === piece.slug;
            const isAnyHovered = hoveredSlug !== null;
            const isDimmed = isAnyHovered && !isHovered;

            // Stacked card positions — each offset slightly
            // Creates depth like photographs laid out
            const offsets = [
              { top: "0%", left: "0%", rotate: -1.2, z: 4 },
              { top: "8%", left: "12%", rotate: 0.8, z: 3 },
              { top: "16%", left: "4%", rotate: -0.5, z: 2 },
              { top: "24%", left: "16%", rotate: 1.0, z: 1 },
            ];
            const offset = offsets[i] || offsets[0];

            return (
              <Link
                key={piece.slug}
                href={`/work/${piece.slug}`}
                data-reveal
                onMouseEnter={() => handleHover(piece.slug)}
                onMouseLeave={() => handleHover(null)}
                style={{
                  position: "absolute",
                  top: offset.top,
                  left: offset.left,
                  width: "clamp(280px, 70%, 420px)",
                  zIndex: isHovered ? 10 : offset.z,
                  transform: `
                    rotate(${offset.rotate}deg)
                    ${isHovered ? "translateY(-12px) scale(1.03)" : ""}
                    ${isDimmed ? "scale(0.97)" : ""}
                  `,
                  transition: "transform 0.5s cubic-bezier(.23,.88,.26,.92), opacity 0.4s, z-index 0s",
                  opacity: isDimmed ? 0.3 : 0,
                  display: "block",
                  cursor: "pointer",
                }}
              >
                {/* Card border + inner structure */}
                <div
                  style={{
                    border: `1px solid ${isHovered ? "rgba(196,162,101,0.4)" : "rgba(255,255,255,0.06)"}`,
                    background: isHovered
                      ? "rgba(196,162,101,0.02)"
                      : "rgba(255,255,255,0.01)",
                    transition: "border-color 0.4s, background 0.5s, box-shadow 0.5s",
                    boxShadow: isHovered
                      ? [
                          "inset 0 0 30px rgba(196,162,101,0.06)",
                          "0 0 30px 8px rgba(196,162,101,0.04)",
                          "0 8px 32px rgba(0,0,0,0.4)",
                        ].join(", ")
                      : "0 4px 20px rgba(0,0,0,0.3)",
                    overflow: "hidden",
                  }}
                >
                  {/* Project image */}
                  {piece.image ? (
                    <div
                      style={{
                        aspectRatio: "16/10",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={piece.image}
                        alt={piece.title}
                        fill
                        sizes="420px"
                        style={{
                          objectFit: "cover",
                          filter: isHovered
                            ? "saturate(0.85) contrast(1.05)"
                            : "saturate(0.4) contrast(1.05) brightness(0.7)",
                          transition: "filter 0.6s cubic-bezier(.23,.88,.26,.92)",
                        }}
                      />
                    </div>
                  ) : (
                    // WIP / no image — color field with grain
                    <div
                      style={{
                        aspectRatio: "16/10",
                        background: piece.accent || "rgba(255,255,255,0.03)",
                        opacity: 0.15,
                      }}
                    />
                  )}

                  {/* Card info */}
                  <div style={{ padding: "16px 20px" }}>
                    {/* Meta line */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginBottom: 8,
                      }}
                    >
                      <span
                        className="font-mono"
                        style={{
                          fontSize: 11,
                          letterSpacing: "0.06em",
                          color: isHovered ? "var(--gold)" : "var(--ink-ghost)",
                          transition: "color 0.3s",
                        }}
                      >
                        {piece.number}
                      </span>
                      <span
                        className="font-mono uppercase"
                        style={{
                          fontSize: 11,
                          letterSpacing: "0.06em",
                          color: "var(--ink-ghost)",
                        }}
                      >
                        {piece.status === "wip" ? "In Progress" : piece.year}
                      </span>
                    </div>

                    {/* Title */}
                    <h2
                      className="font-display"
                      style={{
                        fontSize: "clamp(18px, 2vw, 24px)",
                        fontWeight: 400,
                        fontStyle: "italic",
                        lineHeight: 1.2,
                        color: isHovered ? "var(--ink-full)" : "var(--ink-primary)",
                        transition: "color 0.3s",
                      }}
                    >
                      {piece.title}
                    </h2>

                    {/* Sector */}
                    <span
                      className="font-mono uppercase"
                      style={{
                        fontSize: 11,
                        letterSpacing: "0.06em",
                        color: "var(--ink-muted)",
                        marginTop: 6,
                        display: "block",
                      }}
                    >
                      {piece.sector}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Corner metadata — the marginalia frame
          ════════════════════════════════════════════════════ */}

      {/* Top-left: HKJ wordmark */}
      <div
        className="font-mono uppercase"
        style={{
          position: "absolute",
          top: 20,
          left: "clamp(24px, 3vw, 48px)",
          fontSize: 11,
          letterSpacing: "0.08em",
          color: "var(--ink-muted)",
          zIndex: 3,
        }}
      >
        HKJ
      </div>

      {/* Bottom-right: project count */}
      <div
        className="font-mono"
        style={{
          position: "absolute",
          bottom: 20,
          right: "clamp(24px, 3vw, 48px)",
          fontSize: 11,
          letterSpacing: "0.06em",
          color: "var(--ink-ghost)",
          zIndex: 3,
        }}
      >
        {String(allPieces.length).padStart(2, "0")} Projects
      </div>
    </main>
  );
}
