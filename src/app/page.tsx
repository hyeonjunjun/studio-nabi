"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { PIECES } from "@/constants/pieces";

const AsciiField = dynamic(() => import("@/components/AsciiField"), {
  ssr: false,
  loading: () => <div className="poster__plate-placeholder" aria-hidden />,
});

export default function Home() {
  return (
    <main id="main" className="home">
      <article className="poster" aria-label="Hyeonjoon Jun — design engineer, New York">
        <p className="eyebrow">
          <span>Observation Log</span>
          <span className="eyebrow__sep">·</span>
          <span>New York</span>
          <span className="eyebrow__sep">·</span>
          <span className="tabular">2026</span>
          <span className="eyebrow__sep">·</span>
          <span className="tabular">№001</span>
        </p>

        <div className="poster__plate">
          <AsciiField />
          <div className="poster__marks" aria-hidden>
            <span className="poster__mark poster__mark--tl">HKJ / PLATE №001</span>
            <span className="poster__mark poster__mark--tr tabular">2026·04·20</span>
            <span className="poster__mark poster__mark--bl tabular">40°43′N 73°59′W</span>
            <span className="poster__mark poster__mark--br">TIDE / FIELD</span>
          </div>
        </div>

        <figcaption className="poster__caption">
          <span className="poster__name">Hyeonjoon Jun</span>
          <span className="poster__caption-sep">—</span>
          <span className="poster__role">design engineer, New York</span>
        </figcaption>

        <p className="poster__body">
          A practice concerned with the invisible craft that makes software
          feel intentional. Typography, motion, material — the warmth of
          physical objects in digital form.
        </p>
      </article>

      <section className="ledger" aria-label="Selected works">
        <header className="ledger__head">
          <p className="eyebrow">
            <span>Selected Works</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">{String(PIECES.length).padStart(2, "0")} Entries</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">2025 — 2026</span>
          </p>
        </header>

        <ol className="ledger__list">
          {PIECES.map((p) => (
            <li key={p.slug} className="ledger__row">
              <Link href={`/work/${p.slug}`} className="ledger__link">
                <span className="ledger__num tabular">№{p.number}</span>
                <span className="ledger__title">{p.title}</span>
                <span className="ledger__sector">{p.sector}</span>
                <span className="ledger__year tabular">{p.year}</span>
                <span className="ledger__arrow" aria-hidden>
                  {p.status === "wip" ? "·" : "→"}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <footer className="home__foot">
        <span className="plate-mark">Archive continues — Vol. 01</span>
        <span className="plate-mark tabular">Hyeonjoon Jun · 2026</span>
      </footer>

      <style>{`
        .home {
          min-height: 100svh;
          padding: clamp(72px, 10vh, 120px) clamp(24px, 4vw, 72px) clamp(64px, 10vh, 120px);
          display: grid;
          justify-items: center;
          gap: clamp(96px, 14vh, 160px);
          background: var(--paper);
          color: var(--ink);
        }

        /* ── Poster (plate) ──────────────────────────────── */
        .poster {
          width: min(520px, 100%);
          display: grid;
          gap: clamp(22px, 3vh, 34px);
        }
        .poster__plate {
          position: relative;
          aspect-ratio: 4 / 5;
          background: color-mix(in oklab, var(--paper) 98%, var(--ink) 2%);
          overflow: hidden;
          box-shadow: inset 0 0 0 1px rgba(17, 17, 16, 0.06);
        }
        .poster__plate-placeholder {
          position: absolute;
          inset: 0;
          background: color-mix(in oklab, var(--paper) 98%, var(--ink) 2%);
        }

        .poster__marks { position: absolute; inset: 0; pointer-events: none; }
        .poster__mark {
          position: absolute;
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(17, 17, 16, 0.38);
          mix-blend-mode: multiply;
        }
        .poster__mark--tl { top: 12px; left: 14px; }
        .poster__mark--tr { top: 12px; right: 14px; }
        .poster__mark--bl { bottom: 12px; left: 14px; }
        .poster__mark--br { bottom: 12px; right: 14px; }

        .poster__caption {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 8px;
          margin: 0;
        }
        .poster__name {
          font-family: var(--font-stack-sans);
          font-weight: 500;
          font-size: 15px;
          letter-spacing: 0.005em;
          color: var(--ink);
        }
        .poster__caption-sep { color: var(--ink-4); font-size: 12px; }
        .poster__role {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-3);
        }

        .poster__body {
          font-family: var(--font-stack-sans);
          font-weight: 380;
          font-size: 13px;
          line-height: 1.7;
          color: var(--ink-2);
          max-width: 420px;
          hyphens: auto;
        }

        /* ── Ledger (Selected Works) ─────────────────────── */
        .ledger {
          width: min(760px, 100%);
          display: grid;
          gap: clamp(28px, 4vh, 40px);
        }
        .ledger__head { display: grid; gap: 10px; }
        .ledger__list {
          list-style: none;
          margin: 0;
          padding: 0;
          border-top: 1px solid var(--ink-hair);
        }
        .ledger__row {
          border-bottom: 1px solid var(--ink-hair);
        }
        .ledger__link {
          display: grid;
          grid-template-columns: 56px 1.05fr 1.25fr 68px 18px;
          align-items: baseline;
          gap: 18px;
          padding: 18px 0;
          color: var(--ink);
          transition: background 200ms var(--ease);
        }
        .ledger__link:hover {
          background: var(--ink-ghost);
        }
        .ledger__num {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .ledger__title {
          font-family: var(--font-stack-sans);
          font-weight: 450;
          font-size: 17px;
          letter-spacing: -0.005em;
          color: var(--ink);
        }
        .ledger__sector {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-2);
        }
        .ledger__year {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          color: var(--ink-3);
          text-align: right;
        }
        .ledger__arrow {
          font-family: var(--font-stack-mono);
          font-size: 12px;
          color: var(--ink-3);
          text-align: right;
          transition: transform 200ms var(--ease), color 200ms var(--ease);
        }
        .ledger__link:hover .ledger__arrow {
          color: var(--ink);
          transform: translateX(4px);
        }

        /* ── Footer ───────────────────────────────────────── */
        .home__foot {
          width: min(760px, 100%);
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 12px;
          padding-top: 20px;
          border-top: 1px solid var(--ink-hair);
        }

        /* ── Responsive ───────────────────────────────────── */
        @media (max-width: 640px) {
          .poster__mark { font-size: 8px; letter-spacing: 0.12em; }
          .poster__mark--tl, .poster__mark--tr { top: 10px; }
          .poster__mark--bl, .poster__mark--br { bottom: 10px; }

          .ledger__link {
            grid-template-columns: 44px 1fr 14px;
            gap: 14px;
            padding: 16px 0;
          }
          .ledger__sector, .ledger__year { display: none; }
        }
      `}</style>
    </main>
  );
}
