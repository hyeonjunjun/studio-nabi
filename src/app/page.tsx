"use client";

import dynamic from "next/dynamic";

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
            <span className="poster__mark poster__mark--br">ASCII / FIELD</span>
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

      <style>{`
        .home {
          min-height: 100svh;
          display: grid;
          place-items: center;
          padding: clamp(32px, 6vh, 96px) clamp(24px, 4vw, 72px);
          background: var(--paper);
          color: var(--ink);
        }

        .poster {
          width: min(520px, 100%);
          display: grid;
          gap: clamp(22px, 3vh, 34px);
        }

        /* The "plate" — the ASCII field with whispered corner marks */
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

        /* Corner microtypography — archival plate marks, almost invisible */
        .poster__marks {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
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

        /* Caption — name + role below the plate, quiet */
        .poster__caption {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 8px;
          margin: 0;
        }
        .poster__name {
          font-family: var(--font-stack-serif);
          font-weight: 380;
          font-size: 15px;
          letter-spacing: 0.005em;
          color: var(--ink);
        }
        .poster__caption-sep {
          color: var(--ink-4);
          font-size: 12px;
        }
        .poster__role {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-3);
        }

        .poster__body {
          font-family: var(--font-stack-serif);
          font-weight: 360;
          font-size: 13px;
          line-height: 1.7;
          color: var(--ink-2);
          max-width: 420px;
          text-align: justify;
          text-justify: inter-word;
          word-spacing: 0.04em;
          hyphens: auto;
        }

        @media (max-width: 640px) {
          .poster__mark { font-size: 8px; letter-spacing: 0.12em; }
          .poster__mark--tl, .poster__mark--tr { top: 10px; }
          .poster__mark--bl, .poster__mark--br { bottom: 10px; }
        }
      `}</style>
    </main>
  );
}
