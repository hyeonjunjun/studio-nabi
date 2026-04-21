import CatalogFrame from "@/components/CatalogFrame";
import { PIECES } from "@/constants/pieces";

const EMAIL = "rykjun@gmail.com";

export default function Home() {
  return (
    <main id="main" className="home">
      <div className="home__grain" aria-hidden />

      <article className="catalog" aria-label="Selected work, 2025–2026">
        <header className="catalog__head">
          <p className="catalog__ident">
            <span>hyeonjoon jun</span>
            <span className="catalog__dot" aria-hidden>·</span>
            <span>design engineer, new york</span>
          </p>
        </header>

        <ol className="catalog__list">
          {PIECES.map((p) => (
            <li key={p.slug} className="catalog__item">
              <CatalogFrame
                slug={p.slug}
                title={p.title.replace(/:\s*[\u4E00-\u9FFF\uAC00-\uD7AF]+/, "")}
                sector={p.sector}
                year={p.year}
                cover={p.cover}
                coverFit={p.coverFit}
              />
            </li>
          ))}
        </ol>

        <footer className="catalog__foot">
          <a href={`mailto:${EMAIL}`} className="catalog__mail">
            {EMAIL}
          </a>
          <span className="catalog__foot-spacer" aria-hidden />
          <span className="catalog__loc tabular">2026, new york</span>
        </footer>
      </article>

      <style>{`
        .home {
          min-height: 100svh;
          background: var(--paper);
          color: var(--ink);
          padding: clamp(88px, 12vh, 128px) clamp(24px, 4vw, 72px) clamp(48px, 7vh, 80px);
          position: relative;
          overflow-x: hidden;
        }

        /* Subtle paper grain — the one material-as-message nod we keep */
        .home__grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.04;
          mix-blend-mode: multiply;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .catalog {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        /* ── Head: tiny name + role, top-left ─────────── */
        .catalog__head {
          padding-bottom: clamp(36px, 6vh, 64px);
        }
        .catalog__ident {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 10px;
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin: 0;
        }
        .catalog__dot { color: var(--ink-4); }

        /* ── List: tight stack, ~40vh gaps ────────────── */
        .catalog__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: clamp(40vh, 44vh, 48vh);
        }
        .catalog__item { margin: 0; }

        /* ── Foot: email + location ───────────────────── */
        .catalog__foot {
          display: flex;
          align-items: baseline;
          gap: 16px;
          padding-top: clamp(40px, 6vh, 72px);
          margin-top: clamp(40vh, 44vh, 48vh);
          border-top: 1px solid var(--ink-hair);
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .catalog__foot-spacer { flex: 1; }
        .catalog__mail {
          color: var(--ink);
          border-bottom: 1px solid var(--ink-hair);
          transition: border-color 180ms var(--ease);
        }
        .catalog__mail:hover { border-bottom-color: var(--ink); }
        .catalog__loc { color: var(--ink-3); }

        @media (max-width: 640px) {
          .catalog__list { gap: 30vh; }
          .catalog__foot { font-size: 9px; letter-spacing: 0.16em; }
        }
      `}</style>
    </main>
  );
}
