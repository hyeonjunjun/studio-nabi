"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { PIECES } from "@/constants/pieces";
import { CONTACT_EMAIL, SOCIALS } from "@/constants/contact";
import { useStore } from "@/store/useStore";
import BloomNode from "@/components/BloomNode";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const allPieces = [...PIECES].sort((a, b) => a.order - b.order);

/* Values calibrated to NaughtyDuk + Cathy Dolle references */
const MAX_W = 1200;
const PAD = "clamp(16px, 3vw, 48px)";

const mono: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  fontWeight: 400,
  textTransform: "uppercase" as const,
  letterSpacing: "0.06em",
  lineHeight: 1.2,
};

export default function Home() {
  const hoveredSlug = useStore((s) => s.hoveredSlug);
  const setHoveredSlug = useStore((s) => s.setHoveredSlug);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-reveal]", {
        opacity: 0, y: 20, duration: 0.5,
        stagger: 0.06, ease: "power2.out", delay: 0.2,
      });

      gsap.utils.toArray<HTMLElement>("[data-project]").forEach((el) => {
        gsap.from(el, {
          opacity: 0, y: 24, duration: 0.5, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={mainRef} id="main">
      {/* ── Hero ── */}
      <section
        style={{
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          maxWidth: MAX_W,
          margin: "0 auto",
          paddingInline: PAD,
          paddingBottom: 64,
        }}
      >
        <h1
          data-reveal
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(32px, 6vw, 96px)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          Hyeon Jun
        </h1>

        <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
          <span data-reveal style={{ ...mono, color: "var(--text-muted)" }}>
            Design Engineer
          </span>
          <span data-reveal style={{ ...mono, color: "var(--text-ghost)" }}>
            /
          </span>
          <span data-reveal style={{ ...mono, color: "var(--text-muted)" }}>
            New York
          </span>
        </div>
      </section>

      {/* ── Projects ── */}
      <section
        style={{
          maxWidth: MAX_W,
          margin: "0 auto",
          paddingInline: PAD,
        }}
      >
        {allPieces.map((piece, i) => {
          const isHovered = hoveredSlug === piece.slug;
          const anyHovered = hoveredSlug !== null;
          const isDimmed = anyHovered && !isHovered;

          return (
            <BloomNode
              key={piece.slug}
              active={isHovered}
              accentColor={piece.accent || "#C4A265"}
              noParticles={isDimmed}
              style={{ display: "block" }}
            >
              <Link
                href={`/work/${piece.slug}`}
                data-project
                className="project-item"
                onMouseEnter={() => setHoveredSlug(piece.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                style={{
                  display: "block",
                  textDecoration: "none",
                  color: "inherit",
                  paddingTop: 48,
                  paddingBottom: 48,
                  borderBottom: "1px solid var(--divider)",
                  opacity: isDimmed ? 0.5 : 1,
                  transition: "opacity 0.2s var(--ease)",
                }}
              >
                {/* Row 1: number + title + year */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                    <span style={{ ...mono, color: "var(--text-muted)", fontSize: 10 }}>
                      {piece.number}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "clamp(16px, 1.4vw, 20px)",
                        fontWeight: 500,
                        lineHeight: 1.3,
                        color: "var(--text-primary)",
                      }}
                    >
                      {piece.title}_
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
                    <span style={{ ...mono, color: "var(--text-muted)" }}>
                      {piece.sector}
                    </span>
                    <span style={{ ...mono, color: "var(--text-ghost)" }}>
                      {piece.status === "wip" ? "WIP" : piece.year}
                    </span>
                  </div>
                </div>

                {/* Row 2: description */}
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    maxWidth: "48ch",
                    lineHeight: 1.5,
                    margin: "0 0 24px",
                  }}
                >
                  {piece.description}
                </p>

                {/* Row 3: image */}
                {piece.image && (
                  <div style={{ overflow: "hidden" }}>
                    <Image
                      src={piece.image}
                      alt={piece.title}
                      width={1200}
                      height={700}
                      sizes="(max-width: 768px) 100vw, 1200px"
                      className="image-desaturated"
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                      }}
                    />
                  </div>
                )}

                {/* Row 4: tags */}
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    marginTop: 16,
                    flexWrap: "wrap",
                  }}
                >
                  {piece.tags.map((tag) => (
                    <span key={tag} style={{ ...mono, color: "var(--text-ghost)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </BloomNode>
          );
        })}
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          maxWidth: MAX_W,
          margin: "0 auto",
          paddingInline: PAD,
          paddingTop: 80,
          paddingBottom: 32,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          style={{ ...mono, color: "var(--text-muted)" }}
        >
          {CONTACT_EMAIL}
        </a>
        <div style={{ display: "flex", gap: 16 }}>
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...mono, color: "var(--text-muted)" }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </footer>

      {/* Depth-of-field hover — CSS fallback for touch devices */}
      <style>{`
        @media (hover: none) {
          .project-item { opacity: 1 !important; filter: none !important; }
        }
      `}</style>
    </main>
  );
}
