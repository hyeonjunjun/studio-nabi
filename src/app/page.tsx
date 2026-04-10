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
  const [activeIndex, setActiveIndex] = useState(0);
  const setStoreHovered = useStore((s) => s.setHoveredSlug);
  const containerRef = useRef<HTMLDivElement>(null);

  const activePiece = allPieces[activeIndex];

  useEffect(() => {
    setStoreHovered(activePiece.slug);
    return () => setStoreHovered(null);
  }, [activePiece.slug, setStoreHovered]);

  // Entrance
  useEffect(() => {
    if (!containerRef.current) return;
    const els = containerRef.current.querySelectorAll("[data-reveal]");
    gsap.set(els, { opacity: 0, y: 14 });
    gsap.to(els, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power2.out", delay: 0.3 });
  }, []);

  // Project switch animation
  useEffect(() => {
    if (!containerRef.current) return;
    const items = containerRef.current.querySelectorAll("[data-info-item]");
    gsap.fromTo(items,
      { opacity: 0, x: -8 },
      { opacity: 1, x: 0, duration: 0.45, stagger: 0.035, ease: "power3.out" }
    );
  }, [activeIndex]);

  return (
    <main
      id="main"
      ref={containerRef}
      style={{ height: "100vh", width: "100vw", overflow: "hidden", position: "relative" }}
    >
      {/* ══════════════════════════════════════════════════
          LAYER 0 — Full-viewport project visual
          ══════════════════════════════════════════════════ */}
      {allPieces.map((piece, i) => (
        <div
          key={piece.slug}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            opacity: i === activeIndex ? 1 : 0,
            transition: "opacity 1s cubic-bezier(.23,.88,.26,.92)",
            pointerEvents: "none",
          }}
        >
          {piece.image ? (
            <Image
              src={piece.image}
              alt=""
              fill
              sizes="100vw"
              priority={i === 0}
              style={{
                objectFit: "cover",
                objectPosition: "center 30%",
                /* Brighter than before — let the image breathe.
                   Vignette overlay handles the darkening selectively. */
                filter: "brightness(0.5) saturate(0.75) contrast(1.15)",
              }}
            />
          ) : piece.video ? (
            <video
              src={piece.video}
              autoPlay muted loop playsInline
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                filter: "brightness(0.4) saturate(0.6) contrast(1.1)",
              }}
            />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: `radial-gradient(ellipse at 55% 40%, ${piece.accent || "#1a1a1a"}18 0%, #0D0D0D 80%)`,
            }} />
          )}

          {/* Cinematic vignette — dark edges, breathing center.
              Left side darker (for text readability).
              Bottom darker (grounds the composition). */}
          <div style={{
            position: "absolute", inset: 0,
            background: `
              radial-gradient(ellipse 70% 60% at 55% 45%, transparent 0%, rgba(13,13,13,0.5) 100%),
              linear-gradient(90deg, rgba(13,13,13,0.65) 0%, rgba(13,13,13,0.15) 35%, transparent 55%),
              linear-gradient(180deg, rgba(13,13,13,0.2) 0%, transparent 20%, transparent 70%, rgba(13,13,13,0.6) 100%)
            `,
          }} />
        </div>
      ))}

      {/* ══════════════════════════════════════════════════
          LAYER 1 — Left info panel
          Semi-transparent backdrop. Precise spacing.
          ══════════════════════════════════════════════════ */}
      <div
        data-project-info
        style={{
          position: "absolute",
          left: "clamp(36px, 5vw, 80px)",
          top: "50%",
          transform: "translateY(-55%)", /* slightly above true center — feels better */
          zIndex: 3,
          maxWidth: 420,
        }}
      >
        {/* Subtle backdrop panel — barely visible, aids readability */}
        <div style={{
          position: "absolute",
          inset: "-24px -28px",
          background: "rgba(13,13,13,0.25)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.03)",
          zIndex: -1,
        }} />

        {/* Project number — large, thin, like WuWa's level display */}
        <div data-info-item style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 2 }}>
          <span
            className="font-mono"
            style={{
              fontSize: "clamp(56px, 7vw, 88px)",
              fontWeight: 200,
              color: "rgba(255,255,255,0.9)",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.03em",
            }}
          >
            {activePiece.number}
          </span>
          <span className="font-mono" style={{ fontSize: 13, color: "var(--ink-ghost)" }}>
            /{String(allPieces.length).padStart(2, "0")}
          </span>
        </div>

        {/* Title */}
        <h1
          data-info-item
          className="font-display"
          style={{
            fontSize: "clamp(30px, 3.8vw, 52px)",
            fontWeight: 400,
            fontStyle: "italic",
            lineHeight: 1.1,
            color: "var(--ink-full)",
            letterSpacing: "-0.025em",
          }}
        >
          {activePiece.title}
        </h1>

        {/* Sector tag + year — WuWa-style tag with thin gold border */}
        <div data-info-item style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 14 }}>
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "0.1em",
              color: "var(--gold)",
              padding: "4px 10px",
              border: "1px solid rgba(196,162,101,0.25)",
              background: "rgba(196,162,101,0.04)",
            }}
          >
            {activePiece.sector}
          </span>
          <span className="font-mono" style={{ fontSize: 11, color: "var(--ink-muted)", fontVariantNumeric: "tabular-nums" }}>
            {activePiece.status === "wip" ? "In Progress" : activePiece.year}
          </span>
        </div>

        {/* Thin separator with corner marks */}
        <div data-info-item style={{ position: "relative", marginTop: 28, marginBottom: 24 }}>
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
          {/* Left registration mark */}
          <div style={{
            position: "absolute", top: -3, left: 0,
            width: 6, height: 6,
            borderTop: "1px solid rgba(196,162,101,0.3)",
            borderLeft: "1px solid rgba(196,162,101,0.3)",
          }} />
          {/* Right registration mark */}
          <div style={{
            position: "absolute", top: -3, right: 0,
            width: 6, height: 6,
            borderTop: "1px solid rgba(196,162,101,0.3)",
            borderRight: "1px solid rgba(196,162,101,0.3)",
          }} />
        </div>

        {/* Description */}
        <p
          data-info-item
          className="font-body"
          style={{ fontSize: 15, lineHeight: 1.75, color: "var(--ink-secondary)", maxWidth: "36ch" }}
        >
          {activePiece.description}
        </p>

        {/* Tags as inline metadata */}
        <div data-info-item style={{ display: "flex", gap: 12, marginTop: 14 }}>
          {activePiece.tags.map((tag, i) => (
            <span key={tag}>
              <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.06em", color: "var(--ink-ghost)" }}>
                {tag}
              </span>
              {i < activePiece.tags.length - 1 && (
                <span style={{ color: "var(--ink-whisper)", margin: "0 0 0 12px", fontSize: 10 }}>·</span>
              )}
            </span>
          ))}
        </div>

        {/* CTA — ghost bracket style */}
        <Link
          href={`/work/${activePiece.slug}`}
          data-info-item
          className="font-mono uppercase"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginTop: 36,
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "var(--ink-muted)",
            padding: "11px 28px",
            border: "1px solid rgba(255,255,255,0.08)",
            transition: "all 0.4s var(--ease-swift)",
            position: "relative",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(196,162,101,0.5)";
            e.currentTarget.style.color = "rgba(255,255,255,0.85)";
            e.currentTarget.style.boxShadow = "0 0 20px 4px rgba(196,162,101,0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            e.currentTarget.style.color = "var(--ink-muted)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          View Case Study
          <span style={{ fontSize: 14, opacity: 0.5 }}>→</span>
        </Link>
      </div>

      {/* ══════════════════════════════════════════════════
          LAYER 2 — Right project selector
          Circular portraits with numbered indices.
          Connected by a thin vertical line.
          ══════════════════════════════════════════════════ */}
      <div
        data-reveal
        style={{
          position: "absolute",
          right: "clamp(28px, 3.5vw, 60px)",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          opacity: 0,
        }}
      >
        {allPieces.map((piece, i) => {
          const isActive = i === activeIndex;
          const size = isActive ? 58 : 46;
          const isLast = i === allPieces.length - 1;

          return (
            <div key={piece.slug} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* Node */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setActiveIndex(i)}
                  style={{
                    position: "relative",
                    width: size, height: size,
                    borderRadius: "50%",
                    border: `1.5px solid ${isActive ? "rgba(196,162,101,0.7)" : "rgba(255,255,255,0.08)"}`,
                    background: "rgba(13,13,13,0.5)",
                    backdropFilter: "blur(6px)",
                    cursor: "pointer",
                    overflow: "hidden",
                    transition: "all 0.5s cubic-bezier(.23,.88,.26,.92)",
                    boxShadow: isActive
                      ? "0 0 16px 3px rgba(196,162,101,0.15), 0 0 40px 8px rgba(196,162,101,0.06), inset 0 0 12px rgba(196,162,101,0.08)"
                      : "0 2px 8px rgba(0,0,0,0.3)",
                    padding: 0,
                  }}
                >
                  {(piece.image || piece.coverArt) ? (
                    <Image
                      src={piece.coverArt || piece.image!}
                      alt={piece.title}
                      fill
                      sizes="58px"
                      style={{
                        objectFit: "cover",
                        filter: isActive ? "saturate(0.85) brightness(0.95)" : "saturate(0.15) brightness(0.4)",
                        transition: "filter 0.5s",
                      }}
                    />
                  ) : (
                    <div style={{
                      width: "100%", height: "100%",
                      background: piece.accent || "rgba(255,255,255,0.03)",
                      opacity: isActive ? 0.35 : 0.1,
                    }} />
                  )}
                </button>

                {/* Number index — positioned to the left of the circle */}
                <span
                  className="font-mono"
                  style={{
                    position: "absolute",
                    right: size + 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 10,
                    letterSpacing: "0.04em",
                    color: isActive ? "var(--gold)" : "var(--ink-ghost)",
                    fontVariantNumeric: "tabular-nums",
                    transition: "color 0.3s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {piece.number}
                </span>
              </div>

              {/* Connecting line between nodes */}
              {!isLast && (
                <div style={{
                  width: 1,
                  height: 16,
                  background: `linear-gradient(180deg,
                    ${i === activeIndex ? "rgba(196,162,101,0.3)" : "rgba(255,255,255,0.04)"}
                    0%,
                    ${i + 1 === activeIndex ? "rgba(196,162,101,0.3)" : "rgba(255,255,255,0.04)"}
                    100%
                  )`,
                  transition: "background 0.5s",
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════
          LAYER 3 — Corner chrome
          ══════════════════════════════════════════════════ */}

      {/* Top-left: HKJ */}
      <div data-reveal style={{
        position: "absolute", top: "clamp(20px, 3vh, 32px)", left: "clamp(28px, 3.5vw, 52px)", zIndex: 4, opacity: 0,
      }}>
        <span className="font-mono uppercase" style={{ fontSize: 12, letterSpacing: "0.12em", color: "var(--ink-primary)" }}>
          HKJ
        </span>
      </div>

      {/* Bottom-left: Contact + Location */}
      <div data-reveal style={{
        position: "absolute", bottom: "clamp(20px, 3vh, 32px)", left: "clamp(28px, 3.5vw, 52px)", zIndex: 4,
        display: "flex", alignItems: "center", gap: 14, opacity: 0,
      }}>
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono" style={{
          fontSize: 11, letterSpacing: "0.04em", color: "var(--ink-muted)", transition: "color 0.3s",
        }}>{CONTACT_EMAIL}</a>
        <span className="font-mono" style={{ fontSize: 9, color: "var(--ink-whisper)" }}>│</span>
        <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: "0.08em", color: "var(--ink-ghost)" }}>
          New York
        </span>
      </div>

      {/* Bottom-right: System */}
      <div data-reveal style={{
        position: "absolute", bottom: "clamp(20px, 3vh, 32px)", right: "clamp(28px, 3.5vw, 60px)", zIndex: 4, opacity: 0,
      }}>
        <span className="font-mono" style={{ fontSize: 10, letterSpacing: "0.06em", color: "var(--ink-ghost)", fontVariantNumeric: "tabular-nums" }}>
          Design Engineering · 2026
        </span>
      </div>

      {/* Bottom-center: View prompt with decorative flanking marks */}
      <div data-reveal style={{
        position: "absolute", bottom: "clamp(20px, 3vh, 32px)", left: "50%", transform: "translateX(-50%)",
        zIndex: 4, display: "flex", alignItems: "center", gap: 14, opacity: 0,
      }}>
        <span style={{ width: 20, height: 1, background: "rgba(196,162,101,0.15)" }} />
        <Link
          href={`/work/${activePiece.slug}`}
          className="font-mono uppercase"
          style={{
            fontSize: 10, letterSpacing: "0.14em", color: "var(--ink-muted)",
            transition: "color 0.3s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ink-primary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ink-muted)"; }}
        >
          Enter Project
        </Link>
        <span style={{ width: 20, height: 1, background: "rgba(196,162,101,0.15)" }} />
      </div>
    </main>
  );
}
