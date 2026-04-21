"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * AsciiField — a quiet seascape in monospace. Horizon roughly 40% down;
 * sky kept almost empty; sea rendered as rolling wave bands that slowly
 * travel toward the foreground and break into stippled foam at the crest.
 *
 * No figuration beyond the ramp: troughs are whitespace, bodies are dash/tilde,
 * crests are the long overbar. Foam is the smaller dot characters catching
 * light at the top of each band. Everything breathes at ~24fps — slow enough
 * to read as tidal rhythm rather than animation.
 */

const CELL_FONT_PX = 12;
const LINE_HEIGHT = 16;
const HORIZON_FRAC = 0.42;

// Ramp from trough → body → crest. Kept deliberately narrow so the
// image reads as continuous tone, not stipple.
const RAMP_SEA = " ·-~≈─";
const FOAM = ".·";

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
    let horizonR = 0;

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
      horizonR = Math.floor(rows * HORIZON_FRAC);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(canvas);

    // Stable per-cell hash for stippled foam placement.
    const hash = (c: number, r: number) => {
      const h = Math.sin(c * 127.1 + r * 311.7) * 43758.5453;
      return h - Math.floor(h);
    };

    // Sea wave intensity at (c, r, t). Returns a value in [0, 1.1] where
    // > ~0.9 reads as crest line and just-below-crest triggers foam.
    const sea = (c: number, r: number, t: number) => {
      const depth = (r - horizonR) / Math.max(1, rows - horizonR); // 0 far → 1 near

      // Horizontal band phase — waves roll from horizon toward shore.
      // Wavelength widens with depth (perspective). Speed grows near shore.
      const bandFreq = 0.58 - depth * 0.30;       // 0.58 far → 0.28 near
      const bandSpeed = 0.55 + depth * 0.70;      // slow far → brisk near
      const bandY = r * bandFreq - t * bandSpeed;

      // Horizontal variation — gives the wave fronts gentle lateral curl
      // so they don't read as straight stripes.
      const xFreq = 0.05 + (1 - depth) * 0.04;
      const lateral = Math.sin(c * xFreq + t * 0.18 + r * 0.09) * 0.9;

      // Secondary ripple — tiny cross-grain texture
      const ripple = Math.sin(c * 0.32 + r * 0.25 - t * 0.22) * 0.18;

      const wave = Math.sin(bandY + lateral) + ripple;

      // Keep only the positive lobe — troughs are empty water.
      const lobe = Math.max(0, wave);

      // Depth falloff + gentle lift toward foreground (crashing grows).
      return lobe * (0.38 + depth * 0.75);
    };

    // Sky is almost empty; occasional quiet dot to suggest air.
    const sky = (c: number, r: number, t: number) => {
      const n =
        Math.sin(c * 0.045 - t * 0.04) *
        Math.cos(r * 0.11 + t * 0.025) +
        Math.cos(c * 0.09 + r * 0.07 - t * 0.03) * 0.45;
      const v = (n + 1.45) / 2.9; // rough normalize
      return v > 0.86 ? (v - 0.86) * 3 : 0;
    };

    const render = (now: number) => {
      const t = reduced ? 0 : (now - start) / 1000;

      ctx.clearRect(0, 0, cssW, cssH);
      ctx.font = fontStack;
      ctx.textBaseline = "top";

      for (let r = 0; r < rows; r++) {
        const y = r * LINE_HEIGHT;

        // Horizon line — one row, gentle hair
        if (r === horizonR) {
          ctx.fillStyle = `rgba(17, 17, 16, 0.28)`;
          for (let c = 0; c < cols; c++) {
            ctx.fillText("─", c * charW, y);
          }
          continue;
        }

        // Sky — above horizon, very sparse
        if (r < horizonR) {
          for (let c = 0; c < cols; c++) {
            const v = sky(c, r, t);
            if (v < 0.15) continue;
            const alpha = 0.08 + v * 0.14;
            ctx.fillStyle = `rgba(17, 17, 16, ${alpha.toFixed(3)})`;
            ctx.fillText("·", c * charW, y);
          }
          continue;
        }

        // Sea — below horizon
        for (let c = 0; c < cols; c++) {
          const v = sea(c, r, t);
          if (v < 0.10) continue;

          // Crest band — render the overbar + stippled foam above
          if (v > 0.90) {
            ctx.fillStyle = `rgba(17, 17, 16, ${(0.30 + Math.min(0.25, v - 0.9)).toFixed(3)})`;
            ctx.fillText("─", c * charW, y);

            // Foam: deterministic stipple drawn just above the crest
            const h = hash(c, r);
            if (h > 0.55) {
              const ch = FOAM[Math.floor(h * FOAM.length) % FOAM.length];
              ctx.fillStyle = `rgba(17, 17, 16, ${(0.14 + h * 0.18).toFixed(3)})`;
              ctx.fillText(
                ch,
                c * charW + (h - 0.5) * charW * 0.6,
                y - LINE_HEIGHT * 0.5
              );
            }
            continue;
          }

          const idx = Math.min(
            RAMP_SEA.length - 1,
            Math.max(0, Math.floor(v * RAMP_SEA.length))
          );
          const ch = RAMP_SEA[idx];
          if (ch === " ") continue;

          const alpha = 0.13 + v * 0.42;
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
