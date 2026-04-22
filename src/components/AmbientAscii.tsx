"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * AmbientAscii — atmospheric ASCII landscape rendered by mapping a
 * density field to a character ramp. Not a scatter of dots — a real
 * image-to-ASCII style composition where darker regions take denser
 * glyphs (`@ 0 U Y L r l i ; : , . space`) and lighter regions fade
 * into whitespace.
 *
 * The field is zoned vertically to evoke a landscape: a sparse sky
 * band, a soft horizon, a denser foreground-foliage band. Multiple
 * sine harmonics per zone produce organic clustering rather than
 * grid artifacts. Slow drift per second — the scene evolves like
 * clouds passing, not like an animation.
 *
 * Reduced-motion clients get a single paint, no rAF loop.
 */

// Density ramp: sparsest on the left, densest on the right. The space
// at position 0 means cells below a low value render nothing.
const RAMP = " .,:;!lrLYU0@";
const CELL_FONT_PX = 11;
const CELL_W = 9;
const CELL_H = 14;
const SPEED = 0.06;

export default function AmbientAscii() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rafId = 0;
    const start = performance.now();

    let cssW = 0;
    let cssH = 0;
    let cols = 0;
    let rows = 0;

    const fontStack = `${CELL_FONT_PX}px var(--font-mono, "SF Mono"), "Consolas", monospace`;

    const measure = () => {
      cssW = window.innerWidth;
      cssH = window.innerHeight;
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(cssW / CELL_W) + 1;
      rows = Math.ceil(cssH / CELL_H) + 1;
    };

    measure();
    window.addEventListener("resize", measure);

    /** Zoned landscape density. Returns 0..~1 where higher = denser glyph. */
    const field = (c: number, r: number, t: number) => {
      const yNorm = r / Math.max(1, rows); // 0 at top, 1 at bottom

      // Multi-octave noise shared across zones
      const n1 =
        Math.sin(c * 0.078 + t * 0.11) *
        Math.cos(r * 0.095 - t * 0.07);
      const n2 =
        Math.sin((c - r) * 0.14 + t * 0.05) * 0.62;
      const n3 =
        Math.sin(c * 0.22 + r * 0.19 + t * 0.03) * 0.32;
      const base = (n1 + n2 + n3 + 1.94) / 3.88; // rough 0..1

      // ── Zone 1 — sky (top 32%) — very sparse, quiet cloud traces
      if (yNorm < 0.32) {
        const skyCurve = yNorm / 0.32; // 0 top → 1 at horizon
        // Only high values render; rest collapses to 0
        return base > 0.72 ? (base - 0.72) * (0.3 + skyCurve * 0.5) : 0;
      }

      // ── Zone 2 — horizon band (32%–52%) — soft clouds, moderate density
      if (yNorm < 0.52) {
        const cloudBand = Math.sin((yNorm - 0.32) / 0.20 * Math.PI); // 0→1→0
        return base * cloudBand * 0.55;
      }

      // ── Zone 3 — middle (52%–72%) — quiet, sparse
      if (yNorm < 0.72) {
        return base > 0.68 ? (base - 0.68) * 0.4 : 0;
      }

      // ── Zone 4 — foreground (72%–100%) — denser, foliage-like
      const fgLocal = (yNorm - 0.72) / 0.28; // 0 → 1 at bottom
      const foliage =
        Math.sin(c * 0.16 - t * 0.05) *
        Math.cos(r * 0.24 + t * 0.02) *
        0.5 + 0.5;
      return (base * 0.5 + foliage * 0.5) * (0.35 + fgLocal * 0.75);
    };

    const render = (now: number) => {
      const t = reduced ? 0 : ((now - start) / 1000) * SPEED;

      ctx.clearRect(0, 0, cssW, cssH);
      ctx.font = fontStack;
      ctx.textBaseline = "top";

      for (let r = 0; r < rows; r++) {
        const y = r * CELL_H;
        for (let c = 0; c < cols; c++) {
          const v = field(c, r, t);
          if (v <= 0.04) continue;

          const idx = Math.min(
            RAMP.length - 1,
            Math.max(0, Math.floor(v * RAMP.length * 1.05))
          );
          const ch = RAMP[idx];
          if (ch === " ") continue;

          // Per-cell alpha: lighter glyphs whisper, denser glyphs hold.
          const alpha = 0.32 + v * 0.55;
          ctx.fillStyle = `rgba(17, 17, 16, ${alpha.toFixed(3)})`;
          ctx.fillText(ch, c * CELL_W, y);
        }
      }

      if (!reduced) rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", measure);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="ambient-ascii"
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.16,
        mixBlendMode: "multiply",
      }}
    />
  );
}
