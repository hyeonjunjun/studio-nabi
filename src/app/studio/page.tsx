"use client";

import CopyEmailLink from "@/components/CopyEmailLink";
import Folio from "@/components/Folio";
import { CONTACT_EMAIL, NETWORKS } from "@/constants/contact";
import { EXPERIENCE } from "@/constants/experience";

/**
 * Studio — single surface for bio, engagements, contact, and a condensed
 * colophon. Consolidates the prior /about, /contact, /colophon routes
 * into one quiet page (architecture pass against Pawson's stopping rule:
 * three half-populated pages collapse into one substantive page).
 *
 * Composition: eyebrow → name → one-line lede → bio → engagements →
 * contact → colophon. Running prose where prose belongs; rows where
 * data belongs. No section ornaments beyond the existing eyebrow grammar.
 */
export default function StudioPage() {
  return (
    <main id="main" className="studio">
      <Folio token="§02" />
      <article className="studio__inner">
        <header className="studio__head">
          <p className="eyebrow">
            <span>Studio</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">2026</span>
          </p>
          <h1 className="studio__title">Hyeonjoon Jun.</h1>
          <p className="studio__lede">
            Designer working on interfaces and brands. New York. Available
            through 2026.{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="studio__mail">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </header>

        <section className="studio__section">
          <header className="studio__section-head">
            <span className="studio__section-label">Bio</span>
          </header>
          <div className="studio__prose">
            <p>
              I build for the web — brands, interfaces, and small experiments in
              between. I care about typography, motion, and the parts that make
              software feel made, not assembled.
            </p>
            <p className="studio__prose-drop">
              I treat AI as a collaborator, not a shortcut.
            </p>
          </div>
        </section>

        <section className="studio__section">
          <header className="studio__section-head">
            <span className="studio__section-label">Engagements</span>
            <span className="studio__section-count tabular">
              {String(EXPERIENCE.length).padStart(2, "0")} Entries
            </span>
          </header>
          <dl className="studio__timeline">
            {EXPERIENCE.map((e) => (
              <div key={e.period} className="studio__timeline-row">
                <dt className="studio__timeline-period tabular">{e.period}</dt>
                <dd className="studio__timeline-role">
                  <span>{e.role}</span>
                  {e.org ? <span className="studio__timeline-org">, {e.org}</span> : null}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="studio__section">
          <header className="studio__section-head">
            <span className="studio__section-label">Contact</span>
          </header>
          <ul className="studio__contact">
            <li className="studio__contact-row">
              <span className="studio__contact-key">Email</span>
              <CopyEmailLink className="studio__handle" />
            </li>
            {NETWORKS.map((n) => (
              <li key={n.label} className="studio__contact-row">
                <span className="studio__contact-key">{n.label}</span>
                <a
                  href={n.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="studio__handle"
                >
                  {n.handle}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="studio__section">
          <header className="studio__section-head">
            <span className="studio__section-label">Colophon</span>
          </header>
          <div className="studio__prose">
            <p>
              Set in Geist Sans and Newsreader. Modular type scale on a
              Perfect Fourth ratio. Paper-and-ink palette — no second hue.
              Motion sits in a 120–400 ms window with one approved easing
              catalog; nothing animates on idle. Built with Next.js 16 and
              the View Transitions API. Hosted on Vercel.
            </p>
          </div>
        </section>

        <footer className="studio__foot">
          <span>Hyeonjoon Jun</span>
          <span className="studio__foot-dot" aria-hidden>·</span>
          <span>New York</span>
          <span className="studio__foot-dot" aria-hidden>·</span>
          <span className="tabular">2026</span>
        </footer>
      </article>

      <style>{`
        .studio {
          min-height: 100svh;
          padding: clamp(88px, 12vh, 128px) clamp(24px, 4vw, 72px) clamp(56px, 9vh, 96px);
          display: flex;
          justify-content: center;
          color: var(--ink);
        }
        .studio__inner {
          width: 100%;
          max-width: 600px;
          display: grid;
          gap: clamp(48px, 7vh, 72px);
        }

        .studio__head { display: grid; gap: 18px; }
        .studio__title {
          font-family: var(--font-stack-sans);
          font-weight: 400;
          font-size: clamp(28px, 3.4vw, 42px);
          line-height: 1.15;
          letter-spacing: -0.005em;
          color: var(--ink);
          margin: 0;
        }
        .studio__lede {
          font-family: var(--font-stack-sans);
          font-size: 13px;
          line-height: 1.7;
          color: var(--ink-2);
          max-width: 56ch;
          margin: 0;
        }

        .studio__section { display: grid; gap: 16px; }
        .studio__section-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--ink);
        }
        .studio__section-label {
          font-family: var(--font-stack-sans);
          font-size: 10px;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: var(--ink);
        }
        .studio__section-count {
          font-family: var(--font-stack-sans);
          font-size: 9px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-3);
        }

        .studio__prose {
          display: grid;
          gap: 1em;
          font-family: var(--font-stack-sans);
          font-size: 13px;
          line-height: 1.85;
          color: var(--ink-2);
          max-width: 56ch;
        }
        .studio__prose p { margin: 0; }
        .studio__prose-drop::first-letter {
          font-family: var(--font-stack-serif);
          font-weight: 500;
          font-size: 1.6em;
          line-height: 1;
          float: left;
          margin-right: 0.1em;
          margin-top: 0.06em;
          color: var(--ink);
        }

        .studio__timeline { margin: 0; display: grid; gap: 0; }
        .studio__timeline-row {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 24px;
          padding: 12px 0;
          border-bottom: 1px solid var(--ink-hair);
          align-items: baseline;
        }
        .studio__timeline-period {
          font-family: var(--font-stack-sans);
          font-size: 10px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .studio__timeline-role {
          font-family: var(--font-stack-sans);
          font-size: 12px;
          color: var(--ink);
          margin: 0;
        }
        .studio__timeline-org { color: var(--ink-3); }

        .studio__contact { list-style: none; margin: 0; padding: 0; display: grid; gap: 0; }
        .studio__contact-row {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 24px;
          padding: 12px 0;
          border-bottom: 1px solid var(--ink-hair);
          align-items: baseline;
        }
        .studio__contact-key {
          font-family: var(--font-stack-sans);
          font-size: 10px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .studio__handle {
          font-family: var(--font-stack-sans);
          font-size: 12px;
          color: var(--ink);
        }
        .studio__handle[data-copied] { color: var(--ink-3); }

        .studio__mail { color: var(--ink); }

        .studio__foot {
          display: flex;
          align-items: baseline;
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid var(--ink-hair);
          font-family: var(--font-stack-sans);
          font-size: 9px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .studio__foot-dot { color: var(--ink-4); }

        @media (max-width: 640px) {
          .studio__timeline-row,
          .studio__contact-row {
            grid-template-columns: 1fr;
            gap: 4px;
          }
        }
      `}</style>
    </main>
  );
}
