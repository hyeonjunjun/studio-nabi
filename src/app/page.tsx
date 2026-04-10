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

  // Update store for waveform
  useEffect(() => {
    setStoreHovered(activePiece.slug);
    return () => setStoreHovered(null);
  }, [activePiece.slug, setStoreHovered]);

  // Entrance animation
  useEffect(() => {
    if (!containerRef.current) return;
    const els = containerRef.current.querySelectorAll("[data-reveal]");
    gsap.fromTo(
      els,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out", delay: 0.2 }
    );
  }, []);

  // Animate on project switch
  useEffect(() => {
    if (!containerRef.current) return;
    const info = containerRef.current.querySelector("[data-project-info]");
    if (info) {
      gsap.fromTo(
        info.querySelectorAll("[data-info-item]"),
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: "power2.out" }
      );
    }
  }, [activeIndex]);

  return (
    <main
      id="main"
      ref={containerRef}
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ════════════════════════════════════════════════════════
          LAYER 0 — Full-viewport project visual
          The project IS the background. It owns the space.
          ════════════════════════════════════════════════════════ */}
      {allPieces.map((piece, i) => (
        <div
          key={piece.slug}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            opacity: i === activeIndex ? 1 : 0,
            transition: "opacity 0.8s cubic-bezier(.23,.88,.26,.92)",
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
                filter: "brightness(0.35) saturate(0.7) contrast(1.1)",
              }}
            />
          ) : piece.video ? (
            <video
              src={piece.video}
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.3) saturate(0.6) contrast(1.1)",
              }}
            />
          ) : (
            /* WIP — color field */
            <div
              style={{
                width: "100%",
                height: "100%",
                background: `radial-gradient(ellipse at 60% 40%, ${piece.accent || "#1a1a1a"}22 0%, #0D0D0D 70%)`,
              }}
            />
          )}

          {/* Atmospheric gradient overlay — creates depth */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `
                linear-gradient(180deg, rgba(13,13,13,0.3) 0%, transparent 30%, transparent 60%, rgba(13,13,13,0.7) 100%),
                linear-gradient(90deg, rgba(13,13,13,0.6) 0%, transparent 40%)
              `,
            }}
          />
        </div>
      ))}

      {/* ════════════════════════════════════════════════════════
          LAYER 1 — Left info panel
          Floating over the visual. Semi-transparent.
          Like WuWa's character stats panel.
          ════════════════════════════════════════════════════════ */}
      <div
        data-project-info
        style={{
          position: "absolute",
          left: "clamp(32px, 5vw, 80px)",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 3,
          maxWidth: 400,
        }}
      >
        {/* Project number — large, like WuWa's level number */}
        <div data-info-item style={{ marginBottom: 4 }}>
          <span
            className="font-mono"
            style={{
              fontSize: "clamp(48px, 6vw, 72px)",
              fontWeight: 300,
              color: "var(--ink-primary)",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {activePiece.number}
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: 14,
              color: "var(--ink-muted)",
              marginLeft: 8,
            }}
          >
            /{String(allPieces.length).padStart(2, "0")}
          </span>
        </div>

        {/* Title */}
        <h1
          data-info-item
          className="font-display"
          style={{
            fontSize: "clamp(28px, 3.5vw, 44px)",
            fontWeight: 400,
            fontStyle: "italic",
            lineHeight: 1.15,
            color: "var(--ink-full)",
            letterSpacing: "-0.02em",
          }}
        >
          {activePiece.title}
        </h1>

        {/* Sector + Year tag */}
        <div
          data-info-item
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginTop: 12,
          }}
        >
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 11,
              letterSpacing: "0.08em",
              color: "var(--gold)",
              padding: "3px 8px",
              border: "1px solid rgba(196,162,101,0.3)",
            }}
          >
            {activePiece.sector}
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: 11,
              color: "var(--ink-muted)",
            }}
          >
            {activePiece.status === "wip" ? "In Progress" : activePiece.year}
          </span>
        </div>

        {/* Divider line */}
        <div
          data-info-item
          style={{
            width: "100%",
            height: 1,
            background: "rgba(255,255,255,0.08)",
            marginTop: 24,
            marginBottom: 20,
          }}
        />

        {/* Description */}
        <p
          data-info-item
          className="font-body"
          style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: "var(--ink-secondary)",
            maxWidth: "38ch",
          }}
        >
          {activePiece.description}
        </p>

        {/* Tags */}
        <div
          data-info-item
          style={{
            display: "flex",
            gap: 8,
            marginTop: 16,
            flexWrap: "wrap",
          }}
        >
          {activePiece.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono uppercase"
              style={{
                fontSize: 11,
                letterSpacing: "0.04em",
                color: "var(--ink-ghost)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={`/work/${activePiece.slug}`}
          data-info-item
          className="font-mono uppercase"
          style={{
            display: "inline-block",
            marginTop: 32,
            fontSize: 11,
            letterSpacing: "0.08em",
            color: "var(--ink-muted)",
            padding: "10px 24px",
            border: "1px solid rgba(255,255,255,0.1)",
            transition: "all 0.3s var(--ease-swift)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(196,162,101,0.4)";
            e.currentTarget.style.color = "var(--ink-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            e.currentTarget.style.color = "var(--ink-muted)";
          }}
        >
          View Case Study
        </Link>
      </div>

      {/* ════════════════════════════════════════════════════════
          LAYER 2 — Right project selector
          Circular thumbnails like WuWa's character selector.
          Vertical stack with numbered indices.
          ════════════════════════════════════════════════════════ */}
      <div
        data-reveal
        style={{
          position: "absolute",
          right: "clamp(24px, 3vw, 56px)",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          opacity: 0,
        }}
      >
        {allPieces.map((piece, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={piece.slug}
              onClick={() => setActiveIndex(i)}
              style={{
                position: "relative",
                width: isActive ? 56 : 44,
                height: isActive ? 56 : 44,
                borderRadius: "50%",
                border: `2px solid ${isActive ? "rgba(196,162,101,0.6)" : "rgba(255,255,255,0.1)"}`,
                background: "rgba(13,13,13,0.4)",
                backdropFilter: "blur(8px)",
                cursor: "pointer",
                overflow: "hidden",
                transition: "all 0.4s cubic-bezier(.23,.88,.26,.92)",
                boxShadow: isActive
                  ? "0 0 20px 4px rgba(196,162,101,0.12), 0 0 40px 10px rgba(196,162,101,0.05)"
                  : "none",
                padding: 0,
              }}
            >
              {/* Thumbnail image */}
              {(piece.image || piece.coverArt) ? (
                <Image
                  src={piece.coverArt || piece.image!}
                  alt={piece.title}
                  fill
                  sizes="56px"
                  style={{
                    objectFit: "cover",
                    filter: isActive ? "saturate(0.8) brightness(0.9)" : "saturate(0.2) brightness(0.5)",
                    transition: "filter 0.4s",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: piece.accent || "rgba(255,255,255,0.05)",
                    opacity: isActive ? 0.4 : 0.15,
                  }}
                />
              )}
            </button>
          );
        })}

        {/* Index number below selector */}
        <span
          className="font-mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.06em",
            color: "var(--ink-ghost)",
            fontVariantNumeric: "tabular-nums",
            marginTop: 4,
          }}
        >
          {activePiece.number}/{String(allPieces.length).padStart(2, "0")}
        </span>
      </div>

      {/* ════════════════════════════════════════════════════════
          LAYER 3 — Corner UI chrome (the marginalia)
          ════════════════════════════════════════════════════════ */}

      {/* Top-left: Identity */}
      <div
        data-reveal
        style={{
          position: "absolute",
          top: "clamp(16px, 2.5vh, 28px)",
          left: "clamp(24px, 3vw, 48px)",
          zIndex: 4,
          opacity: 0,
        }}
      >
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 12,
            letterSpacing: "0.1em",
            color: "var(--ink-primary)",
          }}
        >
          HKJ
        </span>
      </div>

      {/* Bottom-left: Contact */}
      <div
        data-reveal
        style={{
          position: "absolute",
          bottom: "clamp(16px, 2.5vh, 28px)",
          left: "clamp(24px, 3vw, 48px)",
          zIndex: 4,
          display: "flex",
          alignItems: "center",
          gap: 16,
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
          }}
        >
          {CONTACT_EMAIL}
        </a>
        <span
          className="font-mono"
          style={{ fontSize: 11, color: "var(--ink-ghost)" }}
        >
          ·
        </span>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 11,
            letterSpacing: "0.06em",
            color: "var(--ink-ghost)",
          }}
        >
          New York
        </span>
      </div>

      {/* Bottom-right: System label */}
      <div
        data-reveal
        style={{
          position: "absolute",
          bottom: "clamp(16px, 2.5vh, 28px)",
          right: "clamp(24px, 3vw, 56px)",
          zIndex: 4,
          opacity: 0,
        }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.04em",
            color: "var(--ink-ghost)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          Design Engineering · 2026
        </span>
      </div>

      {/* Bottom-center: Enter prompt */}
      <Link
        href={`/work/${activePiece.slug}`}
        data-reveal
        style={{
          position: "absolute",
          bottom: "clamp(16px, 2.5vh, 28px)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 4,
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: 0,
          padding: "8px 20px",
          border: "1px solid rgba(196,162,101,0.2)",
          transition: "border-color 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(196,162,101,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(196,162,101,0.2)";
        }}
      >
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 11,
            letterSpacing: "0.12em",
            color: "var(--ink-muted)",
          }}
        >
          View Project
        </span>
      </Link>
    </main>
  );
}
