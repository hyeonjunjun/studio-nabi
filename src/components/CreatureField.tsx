"use client";

import { useEffect, useRef } from "react";
import type { Mode } from "@/hooks/useMode";
import type { Theme } from "@/hooks/useTheme";

type Props = {
  mode: Mode;
  theme: Theme;
  count?: number;
};

type Creature = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  phase: number;
  size: number;
  alpha: number; // 0..1 — used for scatter/enter transitions
  fading?: boolean;
};

const MODE_COUNTS: Record<Mode, number> = {
  sea: 24,
  land: 14,
  sky: 12,
  space: 36,
};

const MAX_SPEED = 0.78;
const MAX_ACCEL = 0.05;
const CURSOR_ATTR_RADIUS = 420;
const CURSOR_ATTR_WEIGHT = 0.022;
const SEPARATION_RADIUS = 22;
const NEIGHBOR_RADIUS = 70;
const SEPARATION_WEIGHT = 1.6;
const ALIGNMENT_WEIGHT = 0.9;
const COHESION_WEIGHT = 0.55;

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function limit(vx: number, vy: number, max: number): [number, number] {
  const m = Math.hypot(vx, vy);
  if (m > max) {
    const k = max / m;
    return [vx * k, vy * k];
  }
  return [vx, vy];
}

export default function CreatureField({
  mode,
  theme,
  count,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const creaturesRef = useRef<Creature[]>([]);
  const modeRef = useRef<Mode>(mode);
  const themeRef = useRef<Theme>(theme);
  const themeBlendRef = useRef<number>(theme === "dark" ? 1 : 0);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const dimRef = useRef({ w: 0, h: 0, dpr: 1 });
  const rafRef = useRef<number | null>(null);
  const transitionRef = useRef({ t: 1, from: mode, to: mode });
  const countOverrideRef = useRef<number | undefined>(count);

  useEffect(() => {
    countOverrideRef.current = count;
  }, [count]);

  useEffect(() => {
    const prev = modeRef.current;
    if (prev !== mode) {
      transitionRef.current = { t: 0, from: prev, to: mode };
    }
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dimRef.current.dpr = dpr;

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = parent ? parent.clientHeight : window.innerHeight;
      dimRef.current.w = w;
      dimRef.current.h = h;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const makeCreature = (xOverride?: number, yOverride?: number): Creature => {
      const { w, h } = dimRef.current;
      const angle = Math.random() * Math.PI * 2;
      const speed = rand(0.3, 0.8);
      return {
        x: xOverride ?? rand(0.1 * w, 0.9 * w),
        y: yOverride ?? rand(0.15 * h, 0.85 * h),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        ax: 0,
        ay: 0,
        phase: Math.random() * Math.PI * 2,
        size: rand(0.9, 1.15),
        alpha: 1,
      };
    };

    const seed = (): Creature[] => {
      const target = countOverrideRef.current ?? MODE_COUNTS[modeRef.current];
      const arr: Creature[] = [];
      for (let i = 0; i < target; i++) arr.push(makeCreature());
      return arr;
    };
    creaturesRef.current = seed();

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current.x = e.clientX - rect.left;
      pointerRef.current.y = e.clientY - rect.top;
      pointerRef.current.active = true;
    };
    const onLeave = () => {
      pointerRef.current.active = false;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const getInkColor = (alpha: number) => {
      const isDark = themeRef.current === "dark";
      if (isDark) {
        return `rgba(234, 226, 212, ${alpha})`;
      }
      return `rgba(28, 28, 26, ${alpha})`;
    };

    const getStardustColor = (alpha: number) => `rgba(245, 239, 227, ${alpha})`;

    const drawStar = (cx: number, cy: number, rOuter: number, rInner: number) => {
      const points = 5;
      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? rOuter : rInner;
        const ang = (i * Math.PI) / points - Math.PI / 2;
        const px = cx + Math.cos(ang) * r;
        const py = cy + Math.sin(ang) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    const drawCreature = (c: Creature, currentMode: Mode) => {
      const angle = Math.atan2(c.vy, c.vx);
      const isDark = themeRef.current === "dark";
      ctx.save();
      const bob = reduced ? 0 : Math.sin(c.phase * 1.3 + c.x * 0.01) * 0.8;
      ctx.translate(c.x, c.y + bob);
      ctx.rotate(angle);
      const a = c.alpha;

      if (currentMode === "sea") {
        const fishAlpha = isDark ? 0.85 * a : 0.72 * a;
        ctx.fillStyle = getInkColor(fishAlpha);
        const L = 13 * c.size;
        const B = 4.0 * c.size;
        ctx.beginPath();
        ctx.ellipse(0, 0, L, B, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-L, 0);
        ctx.lineTo(-L - 6 * c.size, -3.5 * c.size);
        ctx.lineTo(-L - 6 * c.size, 3.5 * c.size);
        ctx.closePath();
        ctx.fill();
        const hlAlpha = isDark ? 0.65 * a : 0.5 * a;
        const hlColor = isDark ? `rgba(245, 239, 227, ${hlAlpha})` : `rgba(255, 255, 255, ${hlAlpha})`;
        ctx.fillStyle = hlColor;
        ctx.beginPath();
        ctx.arc(-1 * c.size, -B * 0.5, B * 0.32, 0, Math.PI * 2);
        ctx.fill();
      } else if (currentMode === "land") {
        // Bee — chunky oval body with a pale band, two small oval wings above,
        // rim highlight. Oriented to velocity.
        const beeAlpha = isDark ? 0.88 * a : 0.78 * a;
        const bodyL = 5.2 * c.size;
        const bodyB = 3.4 * c.size;

        // Wings — two small pale ellipses flanking the top of the body.
        // Flap: scale on the minor axis driven by phase.
        const flap = 0.55 + Math.sin(c.phase * 2.2) * 0.35;
        const wingAlpha = isDark ? 0.42 * a : 0.32 * a;
        const wingColor = isDark ? `rgba(245, 239, 227, ${wingAlpha})` : `rgba(255, 255, 255, ${wingAlpha * 2})`;
        ctx.fillStyle = wingColor;
        ctx.strokeStyle = getInkColor(wingAlpha * 1.4);
        ctx.lineWidth = 0.8;
        // left wing
        ctx.beginPath();
        ctx.ellipse(-bodyL * 0.1, -bodyB * 0.85, bodyL * 0.55, bodyB * 0.55 * flap, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // right wing
        ctx.beginPath();
        ctx.ellipse(bodyL * 0.3, -bodyB * 0.85, bodyL * 0.55, bodyB * 0.55 * flap, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Body
        ctx.fillStyle = getInkColor(beeAlpha);
        ctx.beginPath();
        ctx.ellipse(0, 0, bodyL, bodyB, 0, 0, Math.PI * 2);
        ctx.fill();

        // Single faint band across the body (bee stripe hint)
        const bandColor = isDark ? `rgba(14, 17, 23, ${0.35 * a})` : `rgba(247, 247, 245, ${0.5 * a})`;
        ctx.fillStyle = bandColor;
        ctx.beginPath();
        ctx.ellipse(-bodyL * 0.25, 0, bodyL * 0.22, bodyB, 0, 0, Math.PI * 2);
        ctx.fill();

        // Rim highlight on top-back of body
        const hlAlpha = isDark ? 0.55 * a : 0.45 * a;
        const hlColor = isDark ? `rgba(245, 239, 227, ${hlAlpha})` : `rgba(255, 255, 255, ${hlAlpha})`;
        ctx.fillStyle = hlColor;
        ctx.beginPath();
        ctx.arc(bodyL * 0.35, -bodyB * 0.45, bodyB * 0.32, 0, Math.PI * 2);
        ctx.fill();
      } else if (currentMode === "sky") {
        // Bird — seagull silhouette. Two arcing wings meeting at a small body oval.
        // Drawn with quadratic curves for a soft sweep.
        const birdAlpha = isDark ? 0.90 * a : 0.82 * a;
        ctx.strokeStyle = getInkColor(birdAlpha);
        ctx.lineWidth = 2.0;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const W = 11 * c.size;  // wing span (each side)
        const H = 2.5 * c.size; // wing height at tip
        const apexY = -H * 0.1;

        // Left wing — quadratic curve arcing up from tip, dipping slightly, to apex
        ctx.beginPath();
        ctx.moveTo(-W, H * 0.4);
        ctx.quadraticCurveTo(-W * 0.45, -H * 1.2, 0, apexY);
        ctx.stroke();
        // Right wing — mirror
        ctx.beginPath();
        ctx.moveTo(0, apexY);
        ctx.quadraticCurveTo(W * 0.45, -H * 1.2, W, H * 0.4);
        ctx.stroke();

        // Tiny body oval at the apex
        const bodyAlpha = isDark ? 0.95 * a : 0.88 * a;
        ctx.fillStyle = getInkColor(bodyAlpha);
        ctx.beginPath();
        ctx.ellipse(0, apexY, 1.6 * c.size, 1.0 * c.size, 0, 0, Math.PI * 2);
        ctx.fill();

        // Rim highlight on body
        const hlAlpha = isDark ? 0.55 * a : 0.4 * a;
        const hlColor = isDark ? `rgba(245, 239, 227, ${hlAlpha})` : `rgba(255, 255, 255, ${hlAlpha})`;
        ctx.fillStyle = hlColor;
        ctx.beginPath();
        ctx.arc(-0.4 * c.size, apexY - 0.2 * c.size, 0.6 * c.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.rotate(-angle);
        // Star — 5-point rounded, refined colors, gentle glow.
        // Per-creature brightness variance based on phase (some stars brighter).
        const brightness = 0.75 + Math.sin(c.phase * 0.7) * 0.25; // 0.5..1.0

        const outerR = 4.4 * c.size * brightness;
        const innerR = 1.9 * c.size * brightness;

        if (isDark) {
          // Outer halo — soft atmospheric glow
          const haloGrad = ctx.createRadialGradient(0, 0, outerR * 0.5, 0, 0, outerR * 2.2);
          haloGrad.addColorStop(0, `rgba(245, 239, 227, ${0.28 * a * brightness})`);
          haloGrad.addColorStop(1, `rgba(245, 239, 227, 0)`);
          ctx.fillStyle = haloGrad;
          ctx.beginPath();
          ctx.arc(0, 0, outerR * 2.2, 0, Math.PI * 2);
          ctx.fill();
          // Star body — warm cream
          ctx.fillStyle = `rgba(248, 240, 220, ${0.95 * a})`;
          drawStar(0, 0, outerR, innerR);
          ctx.fill();
          // Small central glow highlight
          const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, outerR * 0.8);
          coreGrad.addColorStop(0, `rgba(255, 255, 255, ${0.6 * a})`);
          coreGrad.addColorStop(1, `rgba(255, 255, 255, 0)`);
          ctx.fillStyle = coreGrad;
          ctx.beginPath();
          ctx.arc(0, 0, outerR * 0.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Light mode — cleaner filled star, no outline. Warmer amber.
          // Soft amber halo beneath
          const haloGrad = ctx.createRadialGradient(0, 0, outerR * 0.4, 0, 0, outerR * 1.8);
          haloGrad.addColorStop(0, `rgba(214, 180, 110, ${0.18 * a})`);
          haloGrad.addColorStop(1, `rgba(214, 180, 110, 0)`);
          ctx.fillStyle = haloGrad;
          ctx.beginPath();
          ctx.arc(0, 0, outerR * 1.8, 0, Math.PI * 2);
          ctx.fill();
          // Star fill — warm amber, no outline
          ctx.fillStyle = `rgba(196, 162, 101, ${0.85 * a})`;
          drawStar(0, 0, outerR, innerR);
          ctx.fill();
          // Tiny bright core
          ctx.fillStyle = `rgba(255, 242, 210, ${0.65 * a})`;
          ctx.beginPath();
          ctx.arc(0, 0, outerR * 0.22, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();

      const blend = themeBlendRef.current;
      if (blend > 0.02 && currentMode !== "space") {
        const particles = 4;
        const now = performance.now();
        for (let k = 0; k < particles; k++) {
          let pAlpha: number;
          let pDist: number;
          let pAngle: number;
          if (reduced) {
            pAngle = c.phase + (k * Math.PI * 2) / particles;
            pDist = 9 + k * 2;
            pAlpha = 0.28 * a;
          } else {
            pAngle = c.phase + (k * Math.PI * 2) / particles + now * 0.0003;
            pDist = 9 + (k * 2) + Math.sin(c.phase * 0.8 + k) * 3;
            const twinklePhase = c.phase * 0.3 + k * 2.1 + now * 0.0007;
            const twinkle = 0.5 + Math.sin(twinklePhase) * 0.5;
            pAlpha = (0.15 + 0.35 * twinkle) * a;
          }
          const px = c.x + Math.cos(pAngle) * pDist;
          const py = c.y + Math.sin(pAngle) * pDist * 0.7;
          ctx.fillStyle = getStardustColor(Math.max(0, pAlpha) * blend);
          const pSize = 1 + (k % 2 === 0 ? 0 : 1);
          ctx.fillRect(px, py, pSize, pSize);
        }
      }
    };

    const step = () => {
      const { w, h } = dimRef.current;
      const creatures = creaturesRef.current;
      const p = pointerRef.current;
      const t = transitionRef.current;

      const targetBlend = themeRef.current === "dark" ? 1 : 0;
      themeBlendRef.current += (targetBlend - themeBlendRef.current) * 0.06;

      if (t.t < 1) {
        t.t = Math.min(1, t.t + 0.018);
      }
      const scattering = t.t < 0.45 && t.from !== t.to;
      const settling = t.t >= 0.45 && t.t < 1 && t.from !== t.to;
      const transitionDone = t.t >= 1;

      if (scattering) {
        const desired = countOverrideRef.current ?? MODE_COUNTS[t.to];
        if (desired < creatures.length) {
          const excess = creatures.length - desired;
          let marked = 0;
          for (let i = 0; i < creatures.length && marked < excess; i++) {
            if (!creatures[i].fading) {
              creatures[i].fading = true;
              marked++;
            }
          }
        }
      }
      if (settling) {
        const desired = countOverrideRef.current ?? MODE_COUNTS[t.to];
        const activeCount = creatures.filter((c) => !c.fading).length;
        if (activeCount < desired) {
          const toAdd = desired - activeCount;
          for (let i = 0; i < toAdd; i++) {
            const edge = Math.floor(Math.random() * 4);
            let x = 0, y = 0;
            if (edge === 0) { x = -10; y = rand(0, h); }
            else if (edge === 1) { x = w + 10; y = rand(0, h); }
            else if (edge === 2) { x = rand(0, w); y = -10; }
            else { x = rand(0, w); y = h + 10; }
            const nc = makeCreature(x, y);
            nc.alpha = 0;
            creatures.push(nc);
          }
        }
      }

      for (let i = 0; i < creatures.length; i++) {
        const c = creatures[i];
        c.ax = 0;
        c.ay = 0;

        if (!reduced && !scattering) {
          let sepX = 0, sepY = 0, sepN = 0;
          let alignX = 0, alignY = 0, alignN = 0;
          let cohX = 0, cohY = 0, cohN = 0;

          for (let j = 0; j < creatures.length; j++) {
            if (i === j) continue;
            const o = creatures[j];
            const dx = c.x - o.x;
            const dy = c.y - o.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < SEPARATION_RADIUS * SEPARATION_RADIUS && d2 > 0.01) {
              const d = Math.sqrt(d2);
              sepX += dx / d;
              sepY += dy / d;
              sepN++;
            }
            if (d2 < NEIGHBOR_RADIUS * NEIGHBOR_RADIUS) {
              alignX += o.vx;
              alignY += o.vy;
              alignN++;
              cohX += o.x;
              cohY += o.y;
              cohN++;
            }
          }

          if (sepN > 0) {
            c.ax += (sepX / sepN) * SEPARATION_WEIGHT * 0.05;
            c.ay += (sepY / sepN) * SEPARATION_WEIGHT * 0.05;
          }
          if (alignN > 0) {
            c.ax += ((alignX / alignN) - c.vx) * ALIGNMENT_WEIGHT * 0.04;
            c.ay += ((alignY / alignN) - c.vy) * ALIGNMENT_WEIGHT * 0.04;
          }
          if (cohN > 0) {
            const tx = cohX / cohN;
            const ty = cohY / cohN;
            c.ax += (tx - c.x) * COHESION_WEIGHT * 0.0004;
            c.ay += (ty - c.y) * COHESION_WEIGHT * 0.0004;
          }

          if (p.active) {
            const dx = p.x - c.x;
            const dy = p.y - c.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < CURSOR_ATTR_RADIUS * CURSOR_ATTR_RADIUS) {
              const dist = Math.sqrt(d2);
              const norm = dist / CURSOR_ATTR_RADIUS;
              const falloff = Math.max(0, 1 - norm * norm);
              c.ax += dx * CURSOR_ATTR_WEIGHT * 0.004 * falloff;
              c.ay += dy * CURSOR_ATTR_WEIGHT * 0.004 * falloff;
            }
          }
        }

        if (scattering) {
          const dx = c.x - w / 2;
          const dy = c.y - h / 2;
          const d = Math.hypot(dx, dy) || 1;
          c.ax += (dx / d) * 0.12;
          c.ay += (dy / d) * 0.12;
          c.alpha = Math.max(0, 1 - t.t / 0.45);
        } else if (settling) {
          const ease = (t.t - 0.45) / 0.55;
          if (c.fading) {
            c.alpha = 0;
          } else {
            c.alpha = Math.min(1, ease * 1.4);
          }
        } else if (transitionDone) {
          if (!c.fading) c.alpha = 1;
        }

        if (!reduced) {
          const [clampedAx, clampedAy] = limit(c.ax, c.ay, MAX_ACCEL);
          c.vx += clampedAx;
          c.vy += clampedAy;
          const [cvx, cvy] = limit(c.vx, c.vy, MAX_SPEED);
          c.vx = cvx;
          c.vy = cvy;
          c.x += c.vx;
          c.y += c.vy;
          c.phase += 0.08;
        }

        const edge = 30;
        if (c.x < -edge) c.x = w + edge;
        else if (c.x > w + edge) c.x = -edge;
        if (c.y < -edge) c.y = h + edge;
        else if (c.y > h + edge) c.y = -edge;
      }

      if (transitionDone) {
        creaturesRef.current = creatures.filter((c) => !c.fading);
      }

      ctx.clearRect(0, 0, w, h);
      const currentMode = settling || transitionDone ? t.to : t.from;
      const list = creaturesRef.current;
      for (let i = 0; i < list.length; i++) {
        const c = list[i];
        if (c.alpha <= 0.01) continue;
        drawCreature(c, currentMode);
      }

      rafRef.current = window.requestAnimationFrame(step);
    };

    rafRef.current = window.requestAnimationFrame(step);

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}
