"use client";

import Link from "next/link";
import { PIECES } from "@/constants/pieces";

export default function WorkIndexPage() {
  const entries = [...PIECES].sort((a, b) => a.order - b.order);

  return (
    <main id="main" className="work-index">
      <article className="work-index__inner">
        <header className="work-index__head">
          <p className="eyebrow">
            <span>Work</span>
            <span className="eyebrow__sep">·</span>
            <span>New York</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">2026</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">{String(entries.length).padStart(2, "0")} Entries</span>
          </p>
          <h1 className="work-index__title">Selected projects, 2025—2026.</h1>
          <p className="work-index__lede">
            Brand, product, and material studies made as a design engineering
            practice. Each entry is a plate — what it is, why it was made, and
            how it was built.
          </p>
        </header>

        <ol className="work-index__list">
          {entries.map((piece) => (
            <li key={piece.slug} className="work-row">
              <Link href={`/work/${piece.slug}`} className="work-row__link">
                <span className="work-row__num tabular">{piece.number}</span>
                <span className="work-row__title">{piece.title}</span>
                <span className="work-row__sector">{piece.sector}</span>
                <span className="work-row__year tabular">
                  {piece.status === "wip" ? "WIP" : piece.year}
                </span>
                <span className="work-row__arrow" aria-hidden>→</span>
              </Link>
            </li>
          ))}
        </ol>

        <footer className="work-index__foot">
          <p className="plate-mark">
            Additional work on request — hyeonjunjun07@gmail.com
          </p>
        </footer>
      </article>

      <style>{`
        .work-index {
          min-height: 100svh;
          padding: clamp(96px, 14vh, 160px) clamp(24px, 6vw, 72px) clamp(64px, 10vh, 120px);
          display: flex;
          justify-content: center;
        }
        .work-index__inner {
          width: 100%;
          max-width: 760px;
          display: grid;
          gap: clamp(56px, 8vh, 96px);
        }
        .work-index__head {
          display: grid;
          gap: 20px;
        }
        .work-index__title {
          font-family: var(--font-stack-serif);
          font-weight: 380;
          font-size: clamp(28px, 3.2vw, 38px);
          line-height: 1.2;
          letter-spacing: -0.005em;
          color: var(--ink);
          margin: 0;
          max-width: 22ch;
        }
        .work-index__lede {
          font-family: var(--font-stack-serif);
          font-weight: 380;
          font-size: 15px;
          line-height: 1.7;
          color: var(--ink-2);
          max-width: 52ch;
          margin: 0;
        }

        .work-index__list {
          list-style: none;
          margin: 0;
          padding: 0;
          border-top: 1px solid var(--ink-hair);
        }
        .work-row {
          border-bottom: 1px solid var(--ink-hair);
        }
        .work-row__link {
          display: grid;
          grid-template-columns: 46px 1fr auto auto 28px;
          align-items: baseline;
          gap: 20px;
          padding: 22px 0;
          transition: opacity 200ms var(--ease);
        }
        .work-row__link:hover { opacity: 1; }
        .work-index__list:hover .work-row__link { opacity: 0.38; }
        .work-index__list:hover .work-row__link:hover { opacity: 1; }

        .work-row__num {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          color: var(--ink-4);
        }
        .work-row__title {
          font-family: var(--font-stack-serif);
          font-weight: 400;
          font-size: 20px;
          letter-spacing: 0;
          color: var(--ink);
        }
        .work-row__sector {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .work-row__year {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          color: var(--ink-3);
        }
        .work-row__arrow {
          font-family: var(--font-stack-mono);
          font-size: 14px;
          color: var(--ink-3);
          transition: transform 220ms var(--ease), color 220ms var(--ease);
        }
        .work-row__link:hover .work-row__arrow {
          color: var(--ink);
          transform: translateX(4px);
        }

        .work-index__foot {
          display: flex;
          justify-content: space-between;
        }

        @media (max-width: 640px) {
          .work-row__link {
            grid-template-columns: 32px 1fr auto;
            gap: 12px;
            padding: 16px 0;
          }
          .work-row__sector,
          .work-row__arrow { display: none; }
          .work-row__title { font-size: 17px; }
        }
      `}</style>
    </main>
  );
}
