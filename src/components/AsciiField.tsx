"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * AsciiField — a slowly breathing density field rendered as monospace
 * characters on a 2D canvas. Reads like a poster plate, not a hero gimmick.
 *
 * Density ramp runs from whitespace through pale ornament to medium weight;
 * we never land on `#` or `@` — those shout. Everything stays quiet.
 */

const RAMP = " .··─—=+*";
const CELL_FONT_PX = 12;
const LINE_HEIGHT = 16;

export default function AsciiField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let rafId = 0;
    const start = performance.now();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const monoVar =
      getComputedStyle(canvas).getPropertyValue("--font-mono").trim() ||
      "monospace";
    const fontStack = `${CELL_FONT_PX}px ${monoVar}, "SF Mono", Consolas, monospace`;

    let cssW = 0;
    let cssH = 0;
    let charW = 8;
    let cols = 0;
    let rows = 0;

    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      cssW = rect.width;
      cssH = rect.height;
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.font = fontStack;
      charW = ctx.measureText("M").width || 7.2;
      cols = Math.max(1, Math.floor(cssW / charW));
      rows = Math.max(1, Math.floor(cssH / LINE_HEIGHT));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(canvas);

    // Layered sinusoidal pseudo-noise. Three harmonics, scaled so the
    // field reads as soft clouds rather than regular stripes.
    const field = (cx: number, cy: number, t: number) => {
      const a =
        Math.sin(cx * 0.14 + t * 0.22) *
        Math.cos(cy * 0.11 - t * 0.17);
      const b =
        Math.sin(cx * 0.07 - cy * 0.08 + t * 0.13) * 0.7;
      const c = Math.cos(cx * 0.23 + cy * 0.27 - t * 0.09) * 0.35;
      // Range roughly [-2.05, 2.05] → [0, 1]
      return (a + b + c) * 0.245 + 0.5;
    };

    const render = (now: number) => {
      const t = reduced ? 0 : (now - start) / 1000;

      ctx.clearRect(0, 0, cssW, cssH);
      ctx.font = fontStack;
      ctx.textBaseline = "top";

      for (let r = 0; r < rows; r++) {
        const y = r * LINE_HEIGHT;
        for (let c = 0; c < cols; c++) {
          const n = field(c, r, t);
          // Bias toward quiet: square falls off low values fast
          const biased = n * n * 0.92;
          const idx = Math.min(
            RAMP.length - 1,
            Math.max(0, Math.floor(biased * RAMP.length))
          );
          const ch = RAMP[idx];
          if (ch === " ") continue;

          const alpha = 0.14 + biased * 0.5;
          ctx.fillStyle = `rgba(17, 17, 16, ${alpha.toFixed(3)})`;
          ctx.fillText(ch, c * charW, y);
        }
      }

      if (!reduced) rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
