import CopyEmailLink from "@/components/CopyEmailLink";
import Folio from "@/components/Folio";
import HomeViewInit from "@/components/HomeViewInit";
import ViewToggle from "@/components/ViewToggle";
import WorkPlate from "@/components/WorkPlate";
import WorkList from "@/components/WorkList";
import { PIECES } from "@/constants/pieces";

/**
 * Home — monograph register. Single warm-paper ground. The catalog
 * is one composition with two views: a vertical sequence of
 * full-width plates (gallery, default) or a typeset row index
 * (list). The toggle is the home `!` moment per the monograph spec
 * §11 — discoverable, unannounced. View persistence is governed by
 * data-home-view on <html>, set before paint by HomeViewInit.
 */
export default function Home() {
  // PIECES is sorted by `order` already; no client-side sort needed.
  const pieces = [...PIECES].sort((a, b) => a.order - b.order);

  return (
    <>
      <HomeViewInit />
      <main id="main" className="home">
        <Folio token="§01" />
        <ViewToggle />

        <section className="home__gallery" aria-label="Studio catalog (gallery)">
          {pieces.map((piece) => (
            <WorkPlate key={piece.slug} piece={piece} />
          ))}
        </section>

        <section className="home__list" aria-label="Studio catalog (list)">
          <WorkList pieces={pieces} />
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
            padding: clamp(140px, 26vh, 240px) clamp(20px, 4vw, 56px) clamp(56px, 9vh, 88px);
            display: grid;
            gap: clamp(40px, 6vh, 72px);
          }

          /* Gallery widens from the previous 600px (which was sized
             for two ~290px tile columns) to 720px for single-column
             plates — single column wants more breathing room before
             the caption block reaches its 60ch internal cap. */
          .home__gallery {
            max-width: 720px;
            margin-inline: auto;
            width: 100%;
            display: grid;
            gap: 0;
          }

          .home__list {
            display: grid;
            width: 100%;
          }

          /* Visibility governed by data-home-view on <html>, set by
             HomeViewInit before paint. */
          html[data-home-view="gallery"] .home__list { display: none; }
          html[data-home-view="list"] .home__gallery { display: none; }
          /* Fallback when the attribute hasn't been set yet (script
             blocked, JS off): show gallery only. */
          html:not([data-home-view]) .home__list { display: none; }

          .home__foot {
            max-width: 720px;
            margin-inline: auto;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            padding-top: clamp(16px, 2.5vh, 24px);
            border-top: 1px solid var(--ink-hair);
            font-family: var(--font-stack-sans);
            font-size: 10px;
            letter-spacing: 0.06em;
            text-transform: uppercase;
          }
          .home__mail { color: var(--ink); }
          .home__mail[data-copied] { color: var(--ink-3); }
          .home__loc { color: var(--ink-3); }
        `}</style>
      </main>
    </>
  );
}
