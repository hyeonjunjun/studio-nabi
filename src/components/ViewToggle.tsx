"use client";

import { useHomeView, type HomeView } from "@/hooks/useHomeView";

/**
 * ViewToggle — fixed top-right gallery/list switch. Geist Sans 10–11px
 * tracked lowercase. The home page's only persistent UI primitive
 * beyond Folio + nav. Per spec §8, this *is* the home `!` moment —
 * discoverable but unannounced.
 */
export default function ViewToggle() {
  const { view, setView } = useHomeView();

  function pick(target: HomeView) {
    if (target !== view) setView(target);
  }

  return (
    <div className="view-toggle" role="group" aria-label="Home view">
      <button
        type="button"
        className="view-toggle__btn"
        data-active={view === "gallery"}
        aria-pressed={view === "gallery"}
        onClick={() => pick("gallery")}
      >
        gallery
      </button>
      <span className="view-toggle__sep" aria-hidden> / </span>
      <button
        type="button"
        className="view-toggle__btn"
        data-active={view === "list"}
        aria-pressed={view === "list"}
        onClick={() => pick("list")}
      >
        list
      </button>

      <style>{`
        .view-toggle {
          position: fixed;
          top: clamp(20px, 3vh, 36px);
          right: clamp(20px, 4vw, 56px);
          display: inline-flex;
          align-items: baseline;
          gap: 0;
          font-family: var(--font-stack-sans);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: lowercase;
          color: var(--ink-3);
          z-index: 5;
          background: transparent;
        }
        .view-toggle__btn {
          background: transparent;
          border: 0;
          padding: 0;
          margin: 0;
          font: inherit;
          color: var(--ink-3);
          cursor: pointer;
          letter-spacing: inherit;
          text-transform: inherit;
          transition: color 200ms var(--ease);
        }
        .view-toggle__btn[data-active="true"] {
          color: var(--ink);
        }
        .view-toggle__btn:hover { color: var(--ink); }
        .view-toggle__sep {
          color: var(--ink-4);
          padding-inline: 0.4em;
        }

        @media (prefers-reduced-motion: reduce) {
          .view-toggle__btn { transition: none; }
        }
      `}</style>
    </div>
  );
}
