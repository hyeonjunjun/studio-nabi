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
  const [prevIndex, setPrevIndex] = useState(0);
  const setStoreHovered = useStore((s) => s.setHoveredSlug);
  const containerRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const activePiece = allPieces[activeIndex];

  useEffect(() => {
    setStoreHovered(activePiece.slug);
    return () => setStoreHovered(null);
  }, [activePiece.slug, setStoreHovered]);

  // Entrance
  useEffect(() => {
    if (!containerRef.current) return;
    const els = containerRef.current.querySelectorAll("[data-reveal]");
    gsap.set(els, { opacity: 0, y: 12 });
    gsap.to(els, { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: "power2.out", delay: 0.4 });
  }, []);

  // Project switch — cinematic info animation
  useEffect(() => {
    if (!infoRef.current) return;
    const items = infoRef.current.querySelectorAll("[data-info-item]");
    gsap.fromTo(items,
      { opacity: 0, x: -12 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.04, ease: "power3.out", delay: 0.15 }
    );
  }, [activeIndex]);

  const switchProject = (index: number) => {
    if (index === activeIndex) return;
    setPrevIndex(activeIndex);
    setActiveIndex(index);
  };

  return (
    <main
      id="main"
      ref={containerRef}
      style={{ height: "100vh", width: "100vw", overflow: "hidden", position: "relative" }}
    >
      {/* ══════════════════════════════════════════════════
          LAYER 0 — Full-viewport project atmosphere
          The image is LUMINOUS. Not crushed dark.
          Each project is a world you're looking into.
          ══════════════════════════════════════════════════ */}
      {allPieces.map((piece, i) => {
        const isActive = i === activeIndex;
        const isLeaving = i === prevIndex && i !== activeIndex;

        return (
          <div
            key={piece.slug}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              opacity: isActive ? 1 : 0,
              /* Cinematic transition: incoming zooms in slightly, outgoing zooms out */
              transform: isActive ? "scale(1)" : isLeaving ? "scale(1.03)" : "scale(1.05)",
              transition: "opacity 1.2s cubic-bezier(.23,.88,.26,.92), transform 1.4s cubic-bezier(.23,.88,.26,.92)",
              pointerEvents: "none",
            }}
          >
            {(piece.atmosphere || piece.image) ? (
              <Image
                src={piece.atmosphere || piece.image!}
                alt=""
                fill
                sizes="100vw"
                priority={i === 0}
                style={{
                  objectFit: "cover",
                  objectPosition: "center 35%",
                  /* LUMINOUS: let the image breathe. Warm, atmospheric.
                     atmosphere images get lighter treatment since they're
                     already art-directed for the viewport. */
                  filter: piece.atmosphere
                    ? "brightness(0.95) saturate(0.9) contrast(1.05)"
                    : "brightness(0.85) saturate(0.85) contrast(1.08)",
                }}
              />
            ) : piece.video ? (
              <video
                src={piece.video}
                autoPlay muted loop playsInline
                style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  filter: "brightness(0.75) saturate(0.8) contrast(1.1)",
                }}
              />
            ) : (
              /* WIP — atmospheric gradient suggesting dawn/potential */
              <div style={{
                width: "100%", height: "100%",
                background: `
                  radial-gradient(ellipse 80% 60% at 60% 40%, ${piece.accent || "#2a2520"}30 0%, transparent 60%),
                  linear-gradient(180deg, #1a1a2a 0%, #0D0D0D 100%)
                `,
              }} />
            )}

            {/* Selective vignette — cinematic, not blanket darkening.
                Left edge dark for text. Bottom dark for grounding.
                Center and right CLEAR — the atmosphere shines through. */}
            <div style={{
              position: "absolute", inset: 0,
              background: `
                linear-gradient(90deg, rgba(10,10,12,0.75) 0%, rgba(10,10,12,0.35) 25%, transparent 50%),
                linear-gradient(180deg, rgba(10,10,12,0.15) 0%, transparent 15%, transparent 75%, rgba(10,10,12,0.5) 100%)
              `,
            }} />

            {/* Warm atmospheric fog — very subtle, pushes toward golden hour */}
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse 100% 80% at 65% 45%, rgba(196,162,101,0.03) 0%, transparent 60%)",
              mixBlendMode: "screen",
            }} />
          </div>
        );
      })}

      {/* ══════════════════════════════════════════════════
          LAYER 1 — Left info panel
          Frosted glass floating in the atmosphere
          ══════════════════════════════════════════════════ */}
      <div
        ref={infoRef}
        data-project-info
        style={{
          position: "absolute",
          left: "clamp(36px, 5vw, 80px)",
          top: "50%",
          transform: "translateY(-55%)",
          zIndex: 3,
          maxWidth: 420,
        }}
      >
        {/* Frosted glass backdrop */}
        <div style={{
          position: "absolute",
          inset: "-28px -32px",
          background: "rgba(10,10,12,0.2)",
          backdropFilter: "blur(20px) saturate(1.2)",
          WebkitBackdropFilter: "blur(20px) saturate(1.2)",
          border: "1px solid rgba(255,255,255,0.04)",
          borderRadius: 2,
          zIndex: -1,
        }} />

        {/* Number */}
        <div data-info-item style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 2 }}>
          <span className="font-mono" style={{
            fontSize: "clamp(56px, 7vw, 88px)", fontWeight: 200,
            color: "rgba(255,255,255,0.85)", lineHeight: 1,
            fontVariantNumeric: "tabular-nums", letterSpacing: "-0.03em",
          }}>
            {activePiece.number}
          </span>
          <span className="font-mono" style={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}>
            /{String(allPieces.length).padStart(2, "0")}
          </span>
        </div>

        {/* Title */}
        <h1 data-info-item className="font-display" style={{
          fontSize: "clamp(30px, 3.8vw, 52px)", fontWeight: 400,
          fontStyle: "italic", lineHeight: 1.1,
          color: "rgba(255,255,255,0.95)", letterSpacing: "-0.025em",
        }}>
          {activePiece.title}
        </h1>

        {/* Sector tag */}
        <div data-info-item style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 14 }}>
          <span className="font-mono uppercase" style={{
            fontSize: 10, letterSpacing: "0.1em",
            color: "var(--gold)", padding: "4px 10px",
            border: "1px solid rgba(196,162,101,0.25)",
            background: "rgba(196,162,101,0.04)",
          }}>
            {activePiece.sector}
          </span>
          <span className="font-mono" style={{
            fontSize: 11, color: "rgba(255,255,255,0.3)", fontVariantNumeric: "tabular-nums",
          }}>
            {activePiece.status === "wip" ? "In Progress" : activePiece.year}
          </span>
        </div>

        {/* Separator with registration marks */}
        <div data-info-item style={{ position: "relative", marginTop: 28, marginBottom: 24 }}>
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
          <div style={{ position: "absolute", top: -3, left: 0, width: 6, height: 6,
            borderTop: "1px solid rgba(196,162,101,0.25)", borderLeft: "1px solid rgba(196,162,101,0.25)" }} />
          <div style={{ position: "absolute", top: -3, right: 0, width: 6, height: 6,
            borderTop: "1px solid rgba(196,162,101,0.25)", borderRight: "1px solid rgba(196,162,101,0.25)" }} />
        </div>

        {/* Description */}
        <p data-info-item className="font-body" style={{
          fontSize: 15, lineHeight: 1.75, color: "rgba(255,255,255,0.55)", maxWidth: "36ch",
        }}>
          {activePiece.description}
        </p>

        {/* Tags */}
        <div data-info-item style={{ display: "flex", gap: 12, marginTop: 14 }}>
          {activePiece.tags.map((tag, i) => (
            <span key={tag}>
              <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.06em", color: "rgba(255,255,255,0.2)" }}>
                {tag}
              </span>
              {i < activePiece.tags.length - 1 && (
                <span style={{ color: "rgba(255,255,255,0.08)", margin: "0 0 0 12px", fontSize: 10 }}>·</span>
              )}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={`/work/${activePiece.slug}`}
          data-info-item
          className="font-mono uppercase"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginTop: 36,
            fontSize: 11, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)",
            padding: "11px 28px", border: "1px solid rgba(255,255,255,0.08)",
            transition: "all 0.4s var(--ease-swift)", position: "relative",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(196,162,101,0.5)";
            e.currentTarget.style.color = "rgba(255,255,255,0.85)";
            e.currentTarget.style.boxShadow = "0 0 24px 4px rgba(196,162,101,0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            e.currentTarget.style.color = "rgba(255,255,255,0.35)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          View Case Study
          <span style={{ fontSize: 14, opacity: 0.4 }}>→</span>
        </Link>
      </div>

      {/* ══════════════════════════════════════════════════
          LAYER 2 — Right project selector
          ══════════════════════════════════════════════════ */}
      <div
        data-reveal
        style={{
          position: "absolute",
          right: "clamp(28px, 3.5vw, 60px)",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 3,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 0,
          opacity: 0,
        }}
      >
        {allPieces.map((piece, i) => {
          const isActive = i === activeIndex;
          const size = isActive ? 58 : 46;
          const isLast = i === allPieces.length - 1;

          return (
            <div key={piece.slug} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => switchProject(i)}
                  style={{
                    position: "relative", width: size, height: size, borderRadius: "50%",
                    border: `1.5px solid ${isActive ? "rgba(196,162,101,0.7)" : "rgba(255,255,255,0.1)"}`,
                    background: "rgba(10,10,12,0.3)",
                    backdropFilter: "blur(8px)",
                    cursor: "pointer", overflow: "hidden",
                    transition: "all 0.5s cubic-bezier(.23,.88,.26,.92)",
                    boxShadow: isActive
                      ? "0 0 16px 3px rgba(196,162,101,0.15), 0 0 40px 8px rgba(196,162,101,0.06), inset 0 0 12px rgba(196,162,101,0.08)"
                      : "0 2px 8px rgba(0,0,0,0.2)",
                    padding: 0,
                  }}
                >
                  {(piece.image || piece.coverArt) ? (
                    <Image
                      src={piece.coverArt || piece.image!}
                      alt={piece.title}
                      fill sizes="58px"
                      style={{
                        objectFit: "cover",
                        filter: isActive ? "saturate(0.9) brightness(1)" : "saturate(0.2) brightness(0.5)",
                        transition: "filter 0.5s",
                      }}
                    />
                  ) : (
                    <div style={{
                      width: "100%", height: "100%",
                      background: piece.accent || "rgba(255,255,255,0.03)",
                      opacity: isActive ? 0.4 : 0.1,
                    }} />
                  )}
                </button>

                {/* Number index — left of circle */}
                <span className="font-mono" style={{
                  position: "absolute", right: size + 10, top: "50%", transform: "translateY(-50%)",
                  fontSize: 10, letterSpacing: "0.04em",
                  color: isActive ? "var(--gold)" : "rgba(255,255,255,0.15)",
                  fontVariantNumeric: "tabular-nums", transition: "color 0.3s", whiteSpace: "nowrap",
                }}>
                  {piece.number}
                </span>
              </div>

              {/* Connecting line */}
              {!isLast && (
                <div style={{
                  width: 1, height: 16,
                  background: `linear-gradient(180deg,
                    ${i === activeIndex ? "rgba(196,162,101,0.3)" : "rgba(255,255,255,0.04)"} 0%,
                    ${i + 1 === activeIndex ? "rgba(196,162,101,0.3)" : "rgba(255,255,255,0.04)"} 100%)`,
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

      <div data-reveal style={{
        position: "absolute", top: "clamp(20px, 3vh, 32px)", left: "clamp(28px, 3.5vw, 52px)", zIndex: 4, opacity: 0,
      }}>
        <span className="font-mono uppercase" style={{ fontSize: 12, letterSpacing: "0.12em", color: "rgba(255,255,255,0.7)" }}>
          HKJ
        </span>
      </div>

      <div data-reveal style={{
        position: "absolute", bottom: "clamp(20px, 3vh, 32px)", left: "clamp(28px, 3.5vw, 52px)", zIndex: 4,
        display: "flex", alignItems: "center", gap: 14, opacity: 0,
      }}>
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono" style={{
          fontSize: 11, letterSpacing: "0.04em", color: "rgba(255,255,255,0.3)", transition: "color 0.3s",
        }}>{CONTACT_EMAIL}</a>
        <span className="font-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.1)" }}>│</span>
        <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: "0.08em", color: "rgba(255,255,255,0.15)" }}>
          New York
        </span>
      </div>

      <div data-reveal style={{
        position: "absolute", bottom: "clamp(20px, 3vh, 32px)", right: "clamp(28px, 3.5vw, 60px)", zIndex: 4, opacity: 0,
      }}>
        <span className="font-mono" style={{ fontSize: 10, letterSpacing: "0.06em", color: "rgba(255,255,255,0.15)", fontVariantNumeric: "tabular-nums" }}>
          Design Engineering · 2026
        </span>
      </div>

      {/* Bottom-center: Enter prompt */}
      <div data-reveal style={{
        position: "absolute", bottom: "clamp(20px, 3vh, 32px)", left: "50%", transform: "translateX(-50%)",
        zIndex: 4, display: "flex", alignItems: "center", gap: 14, opacity: 0,
      }}>
        <span style={{ width: 20, height: 1, background: "rgba(196,162,101,0.12)" }} />
        <Link
          href={`/work/${activePiece.slug}`}
          className="font-mono uppercase"
          style={{ fontSize: 10, letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", transition: "color 0.3s" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
        >
          Enter Project
        </Link>
        <span style={{ width: 20, height: 1, background: "rgba(196,162,101,0.12)" }} />
      </div>
    </main>
  );
}
