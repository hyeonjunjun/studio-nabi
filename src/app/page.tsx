"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PIECES } from "@/constants/pieces";
import { CASE_STUDIES } from "@/constants/case-studies";
import AsciiFrame from "@/components/AsciiFrame";
import AsciiGradient from "@/components/AsciiGradient";
import gsap from "gsap";

const bySlug = (slug: string) => PIECES.find((p) => p.slug === slug)!;

const TILES = [
  { piece: bySlug("gyeol"), area: "gyeol", ratio: "4 / 3", priority: true },
  { piece: bySlug("sift"), area: "sift", ratio: "4 / 3", priority: true },
  { piece: bySlug("clouds-at-sea"), area: "clouds", ratio: "21 / 8", priority: false },
  { piece: bySlug("pane"), area: "pane", ratio: "1 / 1", priority: false },
];

const QUOTES = Object.entries(CASE_STUDIES)
  .filter(([, cs]) => Boolean(cs.paradox))
  .map(([key, cs]) => ({ text: cs.paradox as string, slug: key }));

function formatUptime(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function timeTint(h: number): string {
  // Returns rgba overlay color based on time of day
  if (h >= 5 && h <= 8) return "rgba(255, 220, 160, 0.02)"; // dawn warm yellow
  if (h >= 9 && h <= 16) return "rgba(0, 0, 0, 0)"; // neutral
  if (h >= 17 && h <= 20) return "rgba(255, 170, 110, 0.02)"; // dusk warm orange
  return "rgba(91, 137, 181, 0.01)"; // night cool blue
}

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const citeRef = useRef<HTMLElement>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [uptime, setUptime] = useState<number>(0);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const tintColor = useMemo(() => timeTint(new Date().getHours()), []);

  // Live uptime ticker
  useEffect(() => {
    const id = setInterval(() => setUptime((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Quote rotation with GSAP crossfade
  useEffect(() => {
    if (QUOTES.length <= 1) return;
    const id = setInterval(() => {
      const q = quoteRef.current;
      const c = citeRef.current;
      if (!q) return;
      gsap.to([q, c].filter(Boolean), {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          setQuoteIndex((i) => (i + 1) % QUOTES.length);
          gsap.to([q, c].filter(Boolean), {
            opacity: 1,
            duration: 0.3,
            ease: "power2.in",
          });
        },
      });
    }, 8000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const played = sessionStorage.getItem("hkj_intro_played");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (played || reduced) {
        gsap.set(".hero-tile[data-reveal]", { opacity: 1, clipPath: "inset(0)" });
        gsap.set(".hero-display[data-reveal]", { opacity: 1, y: 0 });
        gsap.set(".hero-quote[data-reveal]", { opacity: 1, y: 0 });
        gsap.set(".hero-tile__matrix", { opacity: 0 });
        gsap.set("[data-intro-status]", { opacity: 0 });
        if (reduced) sessionStorage.setItem("hkj_intro_played", "1");
        return;
      }

      gsap.set(".hero-tile[data-reveal]", { opacity: 0, clipPath: "inset(45% 45% 45% 45%)" });
      gsap.set(".hero-display[data-reveal]", { opacity: 0, y: 8 });
      gsap.set(".hero-quote[data-reveal]", { opacity: 0, y: 8 });
      gsap.set(".hero-tile__matrix", { opacity: 1 });
      gsap.set("[data-intro-status]", { opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => sessionStorage.setItem("hkj_intro_played", "1"),
      });
      tl.to("[data-intro-status]", { opacity: 1, duration: 0.3, ease: "power2.out" }, 0);
      tl.to(".hero-tile[data-reveal]", { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, stagger: 0.08, ease: "power3.out" }, 0.2);
      tl.to(".hero-tile__matrix", { opacity: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" }, 0.7);
      tl.call(() => { if (statusRef.current) statusRef.current.textContent = "HJ / READY · 2026"; }, undefined, 1.3);
      tl.to("[data-intro-status]", { color: "var(--accent)", duration: 0.1 }, 1.3);
      tl.to("[data-intro-status]", { color: "var(--ink-muted)", duration: 0.3 }, 1.5);
      tl.to(".hero-display[data-reveal]", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 1.2);
      tl.to(".hero-quote[data-reveal]", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 1.4);

      const skip = () => tl.progress(1);
      window.addEventListener("keydown", skip, { once: true });
      window.addEventListener("click", skip, { once: true });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  const currentQuote = QUOTES[quoteIndex] ?? { text: "", slug: "" };

  return (
    <main ref={mainRef} id="main" style={{ position: "relative", zIndex: 1, paddingTop: "clamp(72px, 10vh, 120px)" }}>
      {/* Atmospheric background layer */}
      <div className="atmosphere" aria-hidden />
      <div className="atmosphere-vignette" aria-hidden />
      <div className="atmosphere-tint" aria-hidden style={{ background: tintColor }} />

      <div ref={statusRef} className="intro-status" data-intro-status>
        HJ / INITIALIZING · 2026
      </div>
      <section className="hero-intro" data-reveal>
        <div className="hero-intro__kicker">HYEONJOON · DESIGN ENGINEER · NEW YORK</div>
        <h1 className="hero-intro__headline">
          I&apos;m <span className="hero-intro__name">Ryan</span> — I design
        </h1>
        <p className="hero-intro__sub">
          Selected work below. For inquiries — <a href="mailto:hyeonjunjun07@gmail.com">hyeonjunjun07@gmail.com</a>.
        </p>
      </section>
      <div className="hero-grid">
        {TILES.map(({ piece, area, ratio, priority }) => {
          const isHovered = hoveredSlug === piece.slug;
          const isDimmed = hoveredSlug !== null && !isHovered;
          const isPane = area === "pane";
          return (
            <Link
              key={piece.slug}
              href={`/work/${piece.slug}`}
              data-reveal
              data-tile={area}
              data-reticle-lock
              data-reticle-label={`${piece.number} ${piece.title}`.toUpperCase()}
              onMouseEnter={() => setHoveredSlug(piece.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              className={`hero-tile hero-tile--${area}`}
              style={{
                opacity: isDimmed ? 0.5 : 1,
              }}
            >
              <AsciiFrame
                topLeft={`${piece.number} / ${piece.title}`}
                topRight={String(piece.year)}
                bottomLeft={piece.sector}
                bottomRight={piece.status === "wip" ? "IN PROGRESS" : "SHIPPED"}
                bottomRightAccent={piece.status !== "wip"}
                padding={0}
              >
                <div className="hero-tile__media" style={{ aspectRatio: ratio }}>
                  {piece.video ? (
                    <video
                      src={piece.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : piece.image ? (
                    <Image
                      src={piece.image}
                      alt={piece.title}
                      fill
                      sizes="(max-width: 767px) 100vw, 60vw"
                      style={{ objectFit: "cover" }}
                      priority={priority}
                    />
                  ) : isPane ? (
                    <div className="hero-tile__jarvis">
                      <div className="jarvis-row">
                        <span className="jarvis-label">&#9656; STATUS</span>
                        <span className="jarvis-value">BUILDING</span>
                      </div>
                      <div className="jarvis-row">
                        <span className="jarvis-label">&#9656; COMMIT</span>
                        <span className="jarvis-value">2026.04.14 &middot; 3d ago</span>
                      </div>
                      <div className="jarvis-row">
                        <span className="jarvis-label">&#9656; UPTIME</span>
                        <span className="jarvis-value">{formatUptime(uptime)}</span>
                      </div>
                      <div className="jarvis-row">
                        <span className="jarvis-label">&#9656; FOCUS</span>
                        <span className="jarvis-value">ambient</span>
                      </div>
                      <div className="jarvis-row jarvis-row--tick">
                        <span className="jarvis-label">&#9656; TICK</span>
                        <span className="jarvis-value jarvis-value--tick">
                          <AsciiGradient
                            direction="horizontal"
                            stops={20}
                            ramp=" ·-:=+*▓█▓*+=:-· "
                            charSize={12}
                            height={16}
                          />
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="hero-tile__wip">IN PROGRESS &middot; 2026</div>
                  )}
                  <div className="hero-tile__matrix" aria-hidden />
                </div>
              </AsciiFrame>
            </Link>
          );
        })}
      </div>

      <section className="hero-display" data-reveal>
        <span className="hero-display__word">work.</span>
      </section>

      {QUOTES.length > 0 && (
        <section className="hero-quote" data-reveal>
          <AsciiGradient direction="horizontal" stops={100} height={16} charSize={10} ramp=" ·-:=+*▒▓" />
          <blockquote className="hero-quote__text" ref={quoteRef}>
            {currentQuote.text}
          </blockquote>
          <cite className="hero-quote__source" ref={citeRef}>
            &mdash; {currentQuote.slug}
          </cite>
          <AsciiGradient direction="horizontal" stops={100} height={16} charSize={10} ramp="▓▒*+=:-· " />
        </section>
      )}

      <div aria-hidden style={{ height: "30vh" }} />

      <style>{`
        @keyframes atmosphere {
          0%   { background-position: 30% 40%, 70% 70%; }
          50%  { background-position: 35% 45%, 65% 65%; }
          100% { background-position: 30% 40%, 70% 70%; }
        }
        .atmosphere {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse at 30% 40%, rgba(255, 230, 200, 0.06), transparent 60%),
            radial-gradient(ellipse at 70% 70%, rgba(91, 137, 181, 0.04), transparent 60%);
          animation: atmosphere 40s linear infinite;
        }
        .atmosphere-vignette {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background: radial-gradient(ellipse at center, transparent 50%, rgba(28, 28, 26, 0.04));
        }
        .atmosphere-tint {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .intro-status {
          position: absolute;
          top: 12px;
          left: 24px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-muted);
          pointer-events: none;
          z-index: 5;
        }
        .hero-tile__matrix {
          position: absolute;
          inset: 0;
          background-color: var(--paper-2);
          background-image: radial-gradient(circle, var(--ink-faint) 1px, transparent 1.5px);
          background-size: 8px 8px;
          pointer-events: none;
          z-index: 3;
        }
        .hero-intro {
          max-width: 1400px;
          margin: 0 auto clamp(48px, 8vh, 96px);
          padding: 0 clamp(24px, 4vw, 64px);
        }
        .hero-intro__kicker {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 24px;
        }
        .hero-intro__headline {
          font-family: var(--font-sans);
          font-weight: 400;
          font-size: clamp(28px, 3.2vw, 44px);
          line-height: 1.2;
          letter-spacing: -0.02em;
          color: var(--ink);
          max-width: 32ch;
          margin: 0 0 20px;
        }
        .hero-intro__name {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 400;
        }
        .hero-intro__sub {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-muted);
        }
        .hero-intro__sub a {
          color: var(--accent);
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: clamp(16px, 2vw, 32px);
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 clamp(24px, 4vw, 64px);
          position: relative;
          z-index: 1;
        }
        .hero-tile {
          display: block;
          transition: opacity 0.3s var(--ease);
          position: relative;
        }
        .hero-tile--gyeol { grid-column: 1 / span 6; }
        .hero-tile--sift { grid-column: 7 / span 6; }
        .hero-tile--clouds { grid-column: 1 / span 12; }
        .hero-tile--pane { grid-column: 1 / span 6; }
        .hero-tile__media {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: var(--paper-2);
        }
        .hero-tile:hover .hero-tile__media img,
        .hero-tile:hover .hero-tile__media video {
          transform: scale(1.04);
          transition: transform 600ms var(--ease);
        }
        .hero-tile__wip {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-muted);
          background: var(--paper-2);
        }
        .hero-tile__jarvis {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 10px;
          padding: 32px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.06em;
          text-align: left;
          background-color: var(--paper-2);
          background-image: radial-gradient(circle, rgba(0, 0, 0, 0.06) 1px, transparent 1.5px);
          background-size: 8px 8px;
        }
        .jarvis-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          text-transform: uppercase;
        }
        .jarvis-label {
          color: var(--ink-muted);
          flex: 0 0 auto;
        }
        .jarvis-value {
          color: var(--ink);
          text-align: right;
          font-variant-numeric: tabular-nums;
        }
        .jarvis-row--tick {
          align-items: center;
        }
        .jarvis-value--tick {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          overflow: hidden;
        }
        .hero-quote {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: clamp(96px, 14vh, 160px) auto;
          padding: 0 clamp(24px, 4vw, 64px);
          text-align: center;
        }
        .hero-quote__text {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: clamp(28px, 3.5vw, 48px);
          line-height: 1.25;
          font-weight: 400;
          color: var(--ink);
          letter-spacing: -0.02em;
          margin: 24px 0 12px;
          min-height: 1.25em;
        }
        .hero-quote__source {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-muted);
          font-style: normal;
        }
        .hero-display {
          max-width: 1400px;
          margin: clamp(96px, 14vh, 160px) auto clamp(96px, 14vh, 160px);
          padding: 0 clamp(24px, 4vw, 64px);
          text-align: left;
        }
        .hero-display__word {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 400;
          font-size: clamp(96px, 14vw, 200px);
          line-height: 0.9;
          letter-spacing: -0.04em;
          color: var(--ink);
          display: inline-block;
        }
        @media (prefers-reduced-motion: reduce) {
          .atmosphere,
          .hero-tile__media img,
          .hero-tile__media video {
            animation: none !important;
          }
        }
        @media (max-width: 767px) {
          .hero-grid {
            gap: 16px;
          }
          .hero-tile--gyeol,
          .hero-tile--sift,
          .hero-tile--clouds,
          .hero-tile--pane {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </main>
  );
}
