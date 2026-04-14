"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { PIECES } from "@/constants/pieces";
import { CONTACT_EMAIL, SOCIALS } from "@/constants/contact";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const allPieces = [...PIECES].sort((a, b) => a.order - b.order);

const mono: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  lineHeight: 1.4,
};

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-reveal]", {
        opacity: 0, y: 16, duration: 0.6, stagger: 0.06,
        ease: "power2.out", delay: 0.3,
      });
      gsap.utils.toArray<HTMLElement>("[data-project]").forEach((el) => {
        gsap.from(el, {
          opacity: 0, y: 24, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={mainRef} id="main" style={{ position: "relative", zIndex: 2 }}>
      {/* ── Hero: big statement, edge-to-edge ── */}
      <section
        style={{
          minHeight: "90svh",
          padding: "120px 16px 64px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <span data-reveal style={{ ...mono, color: "var(--text-muted)", display: "block", marginBottom: 40 }}>
            Portfolio / 2021 — 2026
          </span>
        </div>

        <div>
          <h1
            data-reveal
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(48px, 9vw, 160px)",
              fontWeight: 500,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              margin: 0,
              maxWidth: "14ch",
            }}
          >
            Design engineer building considered digital work.
          </h1>

          <div
            data-reveal
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginTop: 48,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <span style={{ ...mono, color: "var(--text-muted)" }}>
              Hyeon Jun / New York
            </span>
            <span style={{ ...mono, color: "var(--text-muted)" }}>
              Scroll to explore ↓
            </span>
          </div>
        </div>
      </section>

      {/* ── Projects: full-bleed cards, 4rem gaps (NaughtyDuk pattern) ── */}
      <section
        style={{
          padding: "0 16px",
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          columnGap: 16,
          rowGap: 64,
        }}
      >
        {allPieces.map((piece, i) => {
          /* Alternate layout: even = left-2-col, odd = right-offset */
          const isOdd = i % 2 === 1;
          return (
            <Link
              key={piece.slug}
              href={`/work/${piece.slug}`}
              data-project
              style={{
                gridColumn: isOdd
                  ? "7 / span 6"
                  : "1 / span 7",
                display: "block",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <ProjectCard piece={piece} />
            </Link>
          );
        })}
      </section>

      {/* ── Footer pill (matches nav) ── */}
      <footer
        style={{
          margin: "120px 16px 16px",
          padding: "16px 20px",
          background: "var(--pill-bg)",
          borderRadius: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          style={{ ...mono, color: "var(--nd-100)" }}
        >
          {CONTACT_EMAIL}
        </a>
        <div style={{ display: "flex", gap: 20 }}>
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...mono, color: "var(--nd-600)" }}
            >
              {s.label}
            </a>
          ))}
        </div>
        <span style={{ ...mono, color: "var(--nd-600)" }}>
          © {new Date().getFullYear()} HKJ
        </span>
      </footer>

      {/* Mobile: collapse grid to single column */}
      <style>{`
        @media (max-width: 768px) {
          main section:nth-of-type(2) > a {
            grid-column: 1 / -1 !important;
          }
        }
      `}</style>
    </main>
  );
}

/* ── Project card with image + metadata ── */
function ProjectCard({ piece }: { piece: typeof allPieces[0] }) {
  return (
    <article>
      {/* Image */}
      {piece.image ? (
        <div
          style={{
            position: "relative",
            aspectRatio: "4 / 3",
            overflow: "hidden",
            borderRadius: 2,
            background: "var(--nd-400)",
          }}
        >
          <Image
            src={piece.image}
            alt={piece.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{
              objectFit: "cover",
              transition: "transform 0.6s var(--ease)",
            }}
          />
        </div>
      ) : (
        <div
          style={{
            aspectRatio: "4 / 3",
            background: "var(--nd-400)",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ ...mono, color: "var(--text-faint)" }}>
            {piece.status === "wip" ? "In progress" : piece.title}
          </span>
        </div>
      )}

      {/* Meta row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginTop: 12,
          gap: 12,
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
          <span style={{ ...mono, color: "var(--text-faint)" }}>
            {piece.number}
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--text-primary)",
            }}
          >
            {piece.title}
          </span>
        </div>
        <span style={{ ...mono, color: "var(--text-muted)" }}>
          {piece.sector} / {piece.status === "wip" ? "WIP" : piece.year}
        </span>
      </div>
    </article>
  );
}
