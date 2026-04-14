"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { PIECES } from "@/constants/pieces";

const allPieces = [...PIECES].sort((a, b) => a.order - b.order);

const mono: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
};

/* Visual identity per project — flat color panels with centered mark */
const CARD_STYLES: Record<string, { bg: string; fg: string; mark: string }> = {
  gyeol: { bg: "#1a1a1a", fg: "#fafafa", mark: "T//" },
  sift: { bg: "#efefef", fg: "#1a1a1a", mark: "◆" },
  promptineer: { bg: "#d93b3b", fg: "#1a1a1a", mark: "///" },
  "clouds-at-sea": { bg: "#1a1a1a", fg: "#fafafa", mark: "X" },
};

export default function Home() {
  const [active, setActive] = useState(0);
  const total = allPieces.length;

  const next = useCallback(() => setActive((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setActive((i) => (i - 1 + total) % total), [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    let timer: ReturnType<typeof setTimeout> | null = null;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < 20 && Math.abs(e.deltaY) < 20) return;
      if (timer) return;
      if (e.deltaX > 0 || e.deltaY > 0) next();
      else prev();
      timer = setTimeout(() => { timer = null; }, 400);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      if (timer) clearTimeout(timer);
    };
  }, [next, prev]);

  const activePiece = allPieces[active];

  return (
    <main
      id="main"
      style={{
        position: "relative",
        minHeight: "100svh",
        overflow: "hidden",
      }}
    >
      {/* ── Carousel stage ── */}
      <section
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: "1400px",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "min(80vw, 1000px)",
            height: "min(48vw, 560px)",
            transformStyle: "preserve-3d",
          }}
        >
          {allPieces.map((piece, i) => {
            const offset = i - active;
            const abs = Math.abs(offset);
            const style = CARD_STYLES[piece.slug] ?? {
              bg: "#1a1a1a",
              fg: "#fafafa",
              mark: piece.number,
            };
            /* Cards to the side get tilted + pushed back */
            const translateX = offset * 62;
            const translateZ = -abs * 260;
            const rotateY = offset * -24;
            const opacity = abs > 2 ? 0 : 1 - abs * 0.25;

            return (
              <Link
                key={piece.slug}
                href={`/work/${piece.slug}`}
                onMouseEnter={() => setActive(i)}
                aria-label={piece.title}
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: `translate3d(${translateX}%, 0, ${translateZ}px) rotateY(${rotateY}deg)`,
                  transition: "transform 0.7s cubic-bezier(.2,.8,.2,1), opacity 0.5s ease",
                  transformOrigin: "center center",
                  opacity,
                  pointerEvents: abs > 1 ? "none" : "auto",
                  zIndex: 10 - abs,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: style.bg,
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: abs === 0
                      ? "0 40px 80px -20px rgba(0,0,0,0.4)"
                      : "0 20px 40px -20px rgba(0,0,0,0.2)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "clamp(48px, 8vw, 120px)",
                      fontWeight: 700,
                      color: style.fg,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                    }}
                  >
                    {style.mark}
                  </span>

                  {/* Corner marks */}
                  <span style={{ ...mono, position: "absolute", top: 12, left: 12, color: style.fg, opacity: 0.4 }}>
                    CH# {piece.number}
                  </span>
                  <span style={{ ...mono, position: "absolute", top: 12, right: 12, color: style.fg, opacity: 0.4 }}>
                    {piece.year}
                  </span>
                  <span style={{ ...mono, position: "absolute", bottom: 12, left: 12, color: style.fg, opacity: 0.4 }}>
                    {piece.title.replace(/_$/, "")}
                  </span>
                  <span style={{ ...mono, position: "absolute", bottom: 12, right: 12, color: style.fg, opacity: 0.4 }}>
                    {piece.status === "wip" ? "WIP" : "LIVE"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Caption beneath carousel ── */}
      <section
        style={{
          position: "absolute",
          bottom: "calc(16vh)",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          zIndex: 20,
          pointerEvents: "none",
          maxWidth: "min(90vw, 640px)",
        }}
      >
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          marginBottom: 12,
        }}>
          {allPieces.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to project ${i + 1}`}
              style={{
                width: i === active ? 20 : 6,
                height: 2,
                background: i === active ? "var(--nd-1100)" : "var(--nd-600)",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "width 0.4s var(--ease)",
                pointerEvents: "auto",
              }}
            />
          ))}
        </div>

        <h1 style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(18px, 1.8vw, 28px)",
          fontWeight: 600,
          color: "var(--nd-1100)",
          letterSpacing: "-0.02em",
          lineHeight: 1.3,
          margin: 0,
        }}>
          {activePiece.title.replace(/_$/, "")}
        </h1>

        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: "var(--nd-700)",
          lineHeight: 1.4,
          margin: "8px auto 0",
          maxWidth: "46ch",
        }}>
          {activePiece.description}
        </p>

        <div style={{ ...mono, marginTop: 16, color: "var(--nd-700)" }}>
          {activePiece.sector}&nbsp;&nbsp;/&nbsp;&nbsp;{String(active + 1).padStart(2, "0")} of {String(total).padStart(2, "0")}
        </div>
      </section>

      {/* ── Side arrow hints ── */}
      <button
        onClick={prev}
        aria-label="Previous project"
        style={{
          position: "fixed",
          left: 16,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 40,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-mono)",
          fontSize: 16,
          color: "var(--nd-700)",
          padding: 12,
          transition: "color 0.15s var(--ease)",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--nd-1100)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--nd-700)"; }}
      >
        ←
      </button>
      <button
        onClick={next}
        aria-label="Next project"
        style={{
          position: "fixed",
          right: 16,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 40,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-mono)",
          fontSize: 16,
          color: "var(--nd-700)",
          padding: 12,
          transition: "color 0.15s var(--ease)",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--nd-1100)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--nd-700)"; }}
      >
        →
      </button>
    </main>
  );
}
