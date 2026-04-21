"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

const AsciiField = dynamic(() => import("@/components/AsciiField"), {
  ssr: false,
  loading: () => <div className="plate__placeholder" aria-hidden />,
});

const EMAIL = "rykjun@gmail.com";
const BUILD_HASH = process.env.NEXT_PUBLIC_BUILD_HASH ?? "3d70b0d";

type Entry = {
  slug: string;
  stamp: string;      // YYYY·MM
  title: string;
  sector: string;
  status: "shipped" | "wip";
};

const ENTRIES: Entry[] = [
  { slug: "clouds-at-sea", stamp: "2026·07", title: "Clouds at Sea", sector: "WebGL / Generative",  status: "shipped" },
  { slug: "gyeol",         stamp: "2026·04", title: "Gyeol",         sector: "Material Science",    status: "shipped" },
  { slug: "pane",          stamp: "2026·03", title: "Pane",          sector: "Ambient Computing",   status: "wip"     },
  { slug: "sift",          stamp: "2025·11", title: "Sift",          sector: "Mobile / AI",         status: "shipped" },
];

const SPECIMEN: { label: string; value: string; tabular?: boolean }[] = [
  { label: "Date",     value: "2026·04·20",       tabular: true  },
  { label: "Subject",  value: "Tidal atmosphere", tabular: false },
  { label: "Duration", value: "1200s",            tabular: true  },
  { label: "Coords",   value: "40.71° / −74.00°", tabular: true  },
  { label: "Observer", value: "HKJ",              tabular: false },
  { label: "Plate",    value: "№001 — Tide Field",tabular: true  },
];

export default function Home() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <main id="main" className="home">
      <div className="home__grain" aria-hidden />

      <article className="cover" aria-label="Hyeonjoon Jun — design engineer, New York">
        {/* ── Top register (hair-thin) ─────────────────── */}
        <header className="register register--top">
          <span>Observation Log · №001</span>
          <span className="register__gap" aria-hidden />
          <span className="tabular">
            40°43′N 73°59′W &nbsp;—&nbsp; 2026·04·21
          </span>
        </header>

        {/* ── Cover epigraph (centered, hara-style) ────── */}
        <p className="epigraph">
          A practice concerned with the invisible craft that makes software
          feel intentional — typography, motion, material, and the warmth
          of physical objects in digital form.
        </p>

        {/* ── Main split ───────────────────────────────── */}
        <div className="main">
          {/* Plate column */}
          <aside className="plate-col">
            <span className="plate-col__mark" aria-hidden>
              No. 001
            </span>

            <div className="plate">
              <AsciiField />
              <span className="plate__tick plate__tick--t" aria-hidden />
              <span className="plate__tick plate__tick--b" aria-hidden />
              <span className="plate__tick plate__tick--l" aria-hidden />
              <span className="plate__tick plate__tick--r" aria-hidden />
            </div>

            <dl className="specimen">
              {SPECIMEN.map((row) => (
                <div key={row.label} className="specimen__row">
                  <dt className="specimen__key">{row.label}</dt>
                  <dd className={`specimen__val${row.tabular ? " tabular" : ""}`}>
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>

          {/* Ledger column */}
          <section className="ledger" aria-label="Selected work">
            <header className="ledger__head">
              <span className="ledger__label">Index</span>
              <span className="ledger__count tabular">
                {String(ENTRIES.length).padStart(2, "0")} Entries — 2025 — 2026
              </span>
            </header>

            <ol className="ledger__list">
              {ENTRIES.map((e) => (
                <li key={e.slug} className="ledger__row">
                  <Link href={`/work/${e.slug}`} className="ledger__link">
                    <span className="ledger__stamp tabular">{e.stamp}</span>

                    <span className="ledger__typeset">
                      <span className="ledger__title">{e.title}</span>
                      <span className="ledger__leader" aria-hidden />
                      <span className="ledger__sector">{e.sector}</span>
                    </span>

                    <span
                      className={`ledger__status${e.status === "wip" ? " is-wip" : ""}`}
                    >
                      {e.status === "wip" ? "WIP" : "→"}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>

            <div className="correspondence">
              <span className="correspondence__label">Correspondence</span>
              <p className="correspondence__body">
                Available for select engagements through 2026.
              </p>
              <a
                href={`mailto:${EMAIL}`}
                onClick={handleCopy}
                className="correspondence__mail"
                data-copied={copied || undefined}
              >
                <span>{EMAIL}</span>
                <span className="correspondence__toast" aria-live="polite">
                  {copied ? "Copied" : "Copy"}
                </span>
              </a>
            </div>
          </section>
        </div>

        {/* ── Bottom register ──────────────────────────── */}
        <footer className="register register--bottom">
          <span>Observation Log — Unbound — New York 2026</span>
          <span className="register__gap" aria-hidden />
          <span className="tabular">Build {BUILD_HASH}</span>
        </footer>
      </article>

      <style>{`
        /* ── Frame ────────────────────────────────────── */
        .home {
          min-height: 100svh;
          background: var(--paper);
          color: var(--ink);
          padding: clamp(96px, 13vh, 144px) clamp(28px, 5vw, 72px) clamp(48px, 7vh, 80px);
          position: relative;
          overflow-x: hidden;
        }
        .home__grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.06;
          mix-blend-mode: multiply;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .cover {
          max-width: 1240px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          display: grid;
          /* vertical cadence — each moment gets its own breath */
        }

        /* ── Register strips (hair-thin chrome) ───────── */
        .register {
          display: flex;
          align-items: baseline;
          gap: 24px;
          padding: 10px 0;
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .register__gap { flex: 1; }
        .register--top    { border-bottom: 1px solid var(--ink-hair); }
        .register--bottom {
          border-top: 1px solid var(--ink-hair);
          margin-top: clamp(56px, 9vh, 96px);
        }

        /* ── Cover epigraph (centered) ────────────────── */
        .epigraph {
          font-family: var(--font-stack-sans);
          font-weight: 380;
          font-size: clamp(17px, 1.7vw, 21px);
          line-height: 1.55;
          letter-spacing: -0.003em;
          color: var(--ink);
          max-width: 54ch;
          margin: clamp(56px, 10vh, 120px) auto clamp(72px, 12vh, 140px);
          text-align: center;
        }

        /* ── Main split ───────────────────────────────── */
        .main {
          display: grid;
          grid-template-columns: minmax(320px, 420px) 1fr;
          gap: clamp(56px, 8vw, 128px);
          align-items: start;
          padding-bottom: clamp(56px, 9vh, 96px);
        }

        /* ── Plate column ─────────────────────────────── */
        .plate-col {
          position: sticky;
          top: 112px;
          display: grid;
          gap: 18px;
        }
        .plate-col__mark {
          font-family: var(--font-stack-serif);
          font-weight: 260;
          font-size: clamp(56px, 7vw, 88px);
          line-height: 0.9;
          letter-spacing: -0.03em;
          color: var(--ink-4);
          margin: 0 0 -8px 0;
          align-self: start;
        }

        .plate {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          background: color-mix(in oklab, var(--paper) 98%, var(--ink) 2%);
          overflow: hidden;
          box-shadow: inset 0 0 0 1px rgba(17, 17, 16, 0.08);
        }
        .plate__placeholder {
          position: absolute; inset: 0;
          background: color-mix(in oklab, var(--paper) 98%, var(--ink) 2%);
        }

        /* Registration ticks at midpoints — printer's mark */
        .plate__tick {
          position: absolute;
          pointer-events: none;
          background: rgba(17, 17, 16, 0.18);
        }
        .plate__tick--t, .plate__tick--b {
          left: 50%; width: 1px; height: 8px; transform: translateX(-50%);
        }
        .plate__tick--t { top: -10px; }
        .plate__tick--b { bottom: -10px; }
        .plate__tick--l, .plate__tick--r {
          top: 50%; height: 1px; width: 8px; transform: translateY(-50%);
        }
        .plate__tick--l { left: -10px; }
        .plate__tick--r { right: -10px; }

        /* Specimen card (museum tag) */
        .specimen {
          margin: 8px 0 0;
          padding-top: 16px;
          border-top: 1px solid var(--ink-hair);
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: 20px;
          row-gap: 14px;
        }
        .specimen__row {
          display: grid;
          gap: 4px;
          align-content: start;
        }
        .specimen__key {
          font-family: var(--font-stack-mono);
          font-size: 8.5px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--ink-4);
        }
        .specimen__val {
          font-family: var(--font-stack-mono);
          font-size: 10.5px;
          letter-spacing: 0.08em;
          color: var(--ink-2);
          margin: 0;
        }

        /* ── Ledger ───────────────────────────────────── */
        .ledger {
          display: grid;
          gap: clamp(28px, 4vh, 40px);
        }
        .ledger__head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 12px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--ink);
        }
        .ledger__label {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--ink);
        }
        .ledger__count {
          font-family: var(--font-stack-mono);
          font-size: 9.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-3);
        }

        .ledger__list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .ledger__row {
          border-bottom: 1px solid var(--ink-hair);
        }
        .ledger__link {
          display: grid;
          grid-template-columns: 88px 1fr 36px;
          align-items: baseline;
          gap: 20px;
          padding: clamp(24px, 3.4vh, 32px) 0;
          color: var(--ink);
          transition: background 200ms var(--ease);
        }
        .ledger__link:hover { background: var(--ink-ghost); }

        .ledger__stamp {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ink-3);
        }

        /* Typeset title + dot-leader + sector */
        .ledger__typeset {
          display: flex;
          align-items: baseline;
          gap: 14px;
          min-width: 0;
          overflow: hidden;
        }
        .ledger__title {
          font-family: var(--font-stack-sans);
          font-weight: 450;
          font-size: 20px;
          letter-spacing: -0.006em;
          color: var(--ink);
          white-space: nowrap;
        }
        .ledger__leader {
          flex: 1;
          min-width: 20px;
          height: 0;
          align-self: center;
          border-bottom: 1px dotted var(--ink-4);
          transform: translateY(-5px);
        }
        .ledger__sector {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ink-2);
          white-space: nowrap;
        }

        .ledger__status {
          font-family: var(--font-stack-mono);
          font-size: 13px;
          color: var(--ink-3);
          text-align: right;
          transition: transform 200ms var(--ease), color 200ms var(--ease);
        }
        .ledger__status.is-wip {
          font-size: 9px;
          letter-spacing: 0.22em;
          color: var(--ink-4);
        }
        .ledger__link:hover .ledger__status:not(.is-wip) {
          color: var(--ink);
          transform: translateX(4px);
        }

        /* ── Correspondence (marginalia) ──────────────── */
        .correspondence {
          display: grid;
          gap: 10px;
          padding-top: 8px;
          max-width: 52ch;
        }
        .correspondence__label {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .correspondence__body {
          font-family: var(--font-stack-sans);
          font-weight: 380;
          font-size: 14px;
          line-height: 1.65;
          color: var(--ink-2);
          margin: 0;
        }
        .correspondence__mail {
          display: inline-flex;
          align-items: baseline;
          gap: 12px;
          font-family: var(--font-stack-mono);
          font-size: 12px;
          letter-spacing: 0.06em;
          color: var(--ink);
          align-self: start;
          padding: 4px 0;
          border-bottom: 1px solid var(--ink-hair);
          transition: border-color 180ms var(--ease);
          cursor: pointer;
        }
        .correspondence__mail:hover,
        .correspondence__mail[data-copied] {
          border-bottom-color: var(--ink);
        }
        .correspondence__toast {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-3);
          padding: 2px 6px;
          border: 1px solid var(--ink-hair);
          border-radius: 2px;
          transition: color 180ms var(--ease), border-color 180ms var(--ease);
        }
        .correspondence__mail[data-copied] .correspondence__toast {
          color: var(--ink);
          border-color: var(--ink);
        }

        /* ── Responsive ───────────────────────────────── */
        @media (max-width: 900px) {
          .main {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .plate-col {
            position: static;
            max-width: 440px;
          }
          .plate-col__mark {
            font-size: 56px;
          }
          .register {
            flex-wrap: wrap;
            row-gap: 4px;
          }
        }

        @media (max-width: 640px) {
          .ledger__link {
            grid-template-columns: 68px 1fr 22px;
            gap: 14px;
          }
          .ledger__sector { display: none; }
          .specimen { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
