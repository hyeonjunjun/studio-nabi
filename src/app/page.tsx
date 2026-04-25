"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import CopyEmailLink from "@/components/CopyEmailLink";
import Folio from "@/components/Folio";
import { PIECES, type Piece } from "@/constants/pieces";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const displayTitle = (t: string) =>
  t.replace(/:\s*[一-鿿가-힯]+/, "").toLowerCase();

function Tile({ piece }: { piece: Piece }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <Link href={`/work/${piece.slug}`} className="home__tile">
      <div className="home__tile-frame">
        {piece.cover?.kind === "video" ? (
          <video
            ref={videoRef}
            className="home__tile-media"
            src={piece.cover.src}
            poster={piece.cover.poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          />
        ) : piece.cover?.kind === "image" ? (
          <Image
            src={piece.cover.src}
            alt={`${piece.title} — cover`}
            fill
            sizes="(max-width: 720px) 100vw, 50vw"
            className="home__tile-media"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="home__tile-placeholder">
            <span className="plate-mark">In development · {piece.year}</span>
          </div>
        )}
      </div>
      <div className="home__tile-cap">
        <span className="home__tile-num tabular">{piece.number}</span>
        <span
          className="home__tile-name"
          style={{ viewTransitionName: `work-title-${piece.slug}` } as React.CSSProperties}
        >
          {displayTitle(piece.title)}
        </span>
        <span className="home__tile-meta">{piece.sector.toLowerCase()}</span>
      </div>
    </Link>
  );
}

/**
 * Home — studio catalog. A scaling 2-column grid of project plates,
 * each at uniform 4:5 aspect, captioned with number / title / sector.
 * Cover videos play only while in view (IntersectionObserver, 0.35).
 * Each title carries a per-slug view-transition-name so the click into
 * a case study morphs the active title into the case-study h1.
 *
 * Hara-grounded composition: documentary equality across plates, generous
 * margins, no decorative chrome, no carousel mechanic. The grid grows
 * 2 × n as more pieces ship.
 */
export default function Home() {
  return (
    <main id="main" className="home">
      <Folio token="§01" />

      <header className="home__head">
        <p className="eyebrow">
          <span>Selected work</span>
          <span className="eyebrow__sep">·</span>
          <span className="tabular">2025 — 2026</span>
        </p>
        <h1 className="home__name">
          <span>Hyeonjoon Jun</span>
          <span className="home__name-sep" aria-hidden>·</span>
          <span className="home__name-role">design engineer, new york</span>
        </h1>
      </header>

      <section className="home__grid" aria-label="Project catalog">
        {PIECES.map((piece) => (
          <Tile key={piece.slug} piece={piece} />
        ))}
      </section>

      <footer className="home__foot">
        <CopyEmailLink className="home__mail" />
        <span className="home__loc tabular">2026 · new york</span>
      </footer>

      <style>{`
        .home {
          min-height: 100svh;
          background: var(--paper);
          color: var(--ink);
          padding: clamp(88px, 12vh, 128px) clamp(20px, 4vw, 56px) clamp(56px, 9vh, 88px);
          display: grid;
          gap: clamp(48px, 8vh, 88px);
        }

        .home__head {
          max-width: 920px;
          margin-inline: auto;
          width: 100%;
          display: grid;
          gap: 14px;
        }
        .home__name {
          font-family: var(--font-stack-mono);
          font-weight: 400;
          font-size: clamp(18px, 1.6vw, 22px);
          letter-spacing: 0.02em;
          color: var(--ink);
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .home__name-sep { color: var(--ink-4); }
        .home__name-role { color: var(--ink-3); }

        .home__grid {
          max-width: 920px;
          margin-inline: auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(28px, 4vw, 48px) clamp(20px, 3vw, 36px);
        }

        .home__tile {
          display: grid;
          gap: 14px;
          color: var(--ink);
        }

        .home__tile-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          background: var(--paper-2);
          overflow: hidden;
        }
        .home__tile-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .home__tile-placeholder {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 24px;
        }

        .home__tile-cap {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 14px;
          align-items: baseline;
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }
        .home__tile-num { color: var(--ink-4); }
        .home__tile-name { color: var(--ink); letter-spacing: 0.18em; }
        .home__tile-meta { color: var(--ink-3); text-align: right; }

        .home__foot {
          max-width: 920px;
          margin-inline: auto;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-top: clamp(16px, 2.5vh, 24px);
          border-top: 1px solid var(--ink-hair);
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .home__mail { color: var(--ink); }
        .home__mail[data-copied] { color: var(--ink-3); }
        .home__loc { color: var(--ink-3); }

        @media (max-width: 720px) {
          .home__grid { grid-template-columns: 1fr; }
          .home__head { gap: 12px; }
        }
      `}</style>
    </main>
  );
}
