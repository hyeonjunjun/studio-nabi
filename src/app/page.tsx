"use client";

import Link from "next/link";
import Image from "next/image";
import { PIECES } from "@/constants/pieces";
import { CONTACT_EMAIL, SOCIALS } from "@/constants/contact";

const projects = PIECES.filter((p) => p.type === "project").sort((a, b) => a.order - b.order);

// Organic positions for each project — asymmetric, not a grid
const POSITIONS = [
  { left: "5%", top: "8%" },
  { left: "38%", top: "18%" },
  { left: "68%", top: "5%" },
];

// Callout line configs per project — unique angles
const CALLOUTS = [
  { lineX1: 220, lineY1: 60, lineX2: 310, lineY2: 20, labelLeft: 318, labelTop: 12 },
  { lineX1: 220, lineY1: 90, lineX2: 300, lineY2: 120, labelLeft: 308, labelTop: 112 },
  { lineX1: 0, lineY1: 70, lineX2: -80, lineY2: 40, labelLeft: -200, labelTop: 32 },
];

export default function Home() {
  return (
    <main className="home" id="main">
      {/* ── Top bar ── */}
      <header className="top-bar fade-in" style={{ animationDelay: "0.1s" }}>
        <span className="top-bar-mark">HKJ Studio</span>
        <nav className="top-bar-nav">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          ))}
          <Link href="/about">About</Link>
          <a href={`mailto:${CONTACT_EMAIL}`}>Connect</a>
        </nav>
      </header>

      {/* ── Project area — organic placement ── */}
      <div className="project-area">
        {projects.map((piece, i) => {
          const pos = POSITIONS[i];
          const callout = CALLOUTS[i];
          const href = `/work/${piece.slug}`;
          const globalIdx = PIECES.indexOf(piece);

          return (
            <Link
              key={piece.slug}
              href={href}
              className="project-card fade-in"
              style={{
                left: pos.left,
                top: pos.top,
                animationDelay: `${0.3 + i * 0.15}s`,
              }}
            >
              {/* Thumbnail */}
              <div className="project-thumb">
                {piece.image ? (
                  <Image
                    src={piece.image}
                    alt={piece.title}
                    width={640}
                    height={400}
                    sizes="22vw"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : null}
              </div>

              {/* Project info */}
              <div className="project-info">
                <span className="project-num">{String(globalIdx + 1).padStart(2, "0")}</span>
                <span className="project-name">{piece.title}</span>
                <span className="project-year">{piece.year}</span>
              </div>

              {/* SVG callout line */}
              <svg className="callout-svg" viewBox="-200 -20 600 200">
                <line
                  x1={callout.lineX1}
                  y1={callout.lineY1}
                  x2={callout.lineX2}
                  y2={callout.lineY2}
                />
                <rect
                  x={callout.lineX2 - 3}
                  y={callout.lineY2 - 3}
                  width={6}
                  height={6}
                />
              </svg>

              {/* Callout label */}
              <span
                className="callout-label"
                style={{ left: callout.labelLeft, top: callout.labelTop }}
              >
                {piece.tags.map((tag, ti) => (
                  <span key={tag}>
                    {ti > 0 && " · "}
                    {ti === 0 ? <strong>{tag}</strong> : tag}
                  </span>
                ))}
              </span>
            </Link>
          );
        })}

        {/* ── Handwritten notes ── */}
        <span
          className="hand-note fade-in"
          style={{ bottom: "12%", right: "8%", animationDelay: "0.8s" }}
        >
          &ldquo;making things that feel right&rdquo;
        </span>

        <span
          className="hand-note fade-in"
          style={{ top: "4%", left: "42%", animationDelay: "0.9s" }}
        >
          latest work &darr;
        </span>

        <span
          className="hand-note fade-in"
          style={{ bottom: "25%", left: "35%", animationDelay: "1.0s" }}
        >
          brands, products, concepts
        </span>
      </div>

      {/* ── Bottom bar ── */}
      <footer className="bottom-bar fade-in" style={{ animationDelay: "0.6s" }}>
        <span>Design engineer</span>
        <span>Est. 2025</span>
      </footer>
    </main>
  );
}
