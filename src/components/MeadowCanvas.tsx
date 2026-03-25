"use client";

import { useRef, useEffect, useCallback } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ── Types ── */

interface GrassClump {
  x: number;
  y: number;
  blades: {
    angle: number;
    height: number;
    curve: number;
    width: number;
    hue: number;
    sat: number;
    light: number;
    phase: number;
  }[];
  hasSeed: boolean;
  seedAngle: number;
}

interface Flower {
  x: number;
  y: number;
  type: "daisy" | "poppy" | "small";
  size: number;
  phase: number;
  petalCount: number;
  hue: number;
  sat: number;
  stemHeight: number;
}

interface Butterfly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  wingPhase: number;
  hue: number;
  sat: number;
  light: number;
  size: number;
  targetX: number;
  targetY: number;
  scattered: boolean;
  scatterTimer: number;
}

interface Ladybug {
  x: number;
  y: number;
  angle: number;
  speed: number;
  paused: boolean;
  pauseTimer: number;
}

/* ── Helpers ── */

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function smoothNoise(x: number, y: number) {
  const n = x * 12.9898 + y * 78.233;
  return ((Math.sin(n) * 43758.5453) % 1 + 1) % 1;
}

/* ── Element Generators ── */

function edgeBias(): number {
  /* Returns 0-1, biased toward 0 and 1 (edges) */
  const r = Math.random();
  if (r < 0.5) return r * r * 2; /* clusters near 0 */
  return 1 - (1 - r) * (1 - r) * 2; /* clusters near 1 */
}

function generateGrass(w: number, h: number): GrassClump[] {
  const clumps: GrassClump[] = [];

  for (let i = 0; i < 55; i++) {
    /* Strongly edge-biased — grass frames the scene */
    let x: number, y: number;
    const edge = Math.random();
    if (edge < 0.3) {
      x = rand(-0.02, 0.12);
      y = rand(0, 1);
    } else if (edge < 0.6) {
      x = rand(0.88, 1.02);
      y = rand(0, 1);
    } else if (edge < 0.8) {
      x = rand(0, 1);
      y = rand(0.82, 1.02);
    } else {
      x = rand(0, 1);
      y = rand(-0.02, 0.18);
    }

    const bladeCount = Math.floor(rand(3, 7));
    const blades = [];
    for (let b = 0; b < bladeCount; b++) {
      blades.push({
        angle: rand(-0.6, 0.6),
        height: rand(30, 65),
        curve: rand(-15, 15),
        width: rand(1.2, 2.5),
        hue: rand(75, 115),
        sat: rand(15, 30),
        light: rand(45, 65),
        phase: rand(0, Math.PI * 2),
      });
    }

    clumps.push({
      x: x * w,
      y: y * h,
      blades,
      hasSeed: Math.random() < 0.3,
      seedAngle: rand(-0.3, 0.3),
    });
  }

  clumps.sort((a, b) => a.y - b.y);
  return clumps;
}

function generateFlowers(w: number, h: number): Flower[] {
  const flowers: Flower[] = [];

  /* Small wildflowers scattered throughout */
  for (let i = 0; i < 12; i++) {
    const type = Math.random() < 0.4 ? "daisy" : Math.random() < 0.5 ? "poppy" : "small";
    flowers.push({
      x: rand(0.08, 0.92) * w,
      y: rand(0.08, 0.92) * h,
      type,
      size: type === "small" ? rand(2, 4) : rand(4, 7),
      phase: rand(0, Math.PI * 2),
      petalCount: type === "daisy" ? Math.floor(rand(5, 8)) : type === "poppy" ? Math.floor(rand(4, 6)) : 0,
      hue: type === "daisy" ? 0 : type === "poppy" ? rand(5, 20) : rand(40, 60),
      sat: type === "poppy" ? rand(35, 50) : rand(10, 25),
      stemHeight: rand(15, 35),
    });
  }

  flowers.sort((a, b) => a.y - b.y);
  return flowers;
}

function generateButterflies(w: number, h: number): Butterfly[] {
  const colors = [
    { hue: 210, sat: 25, light: 70 },
    { hue: 35, sat: 35, light: 65 },
    { hue: 320, sat: 20, light: 72 },
  ];

  return colors.map((c) => {
    const x = rand(0.2, 0.8) * w;
    const y = rand(0.2, 0.8) * h;
    return {
      x, y, vx: 0, vy: 0,
      wingPhase: rand(0, Math.PI * 2),
      ...c,
      size: rand(7, 12),
      targetX: x, targetY: y,
      scattered: false, scatterTimer: 0,
    };
  });
}

function generateLadybugs(w: number, h: number): Ladybug[] {
  return [0, 1].map(() => ({
    x: rand(0.15, 0.85) * w,
    y: rand(0.15, 0.85) * h,
    angle: rand(0, Math.PI * 2),
    speed: rand(0.06, 0.15),
    paused: false,
    pauseTimer: rand(0, 3),
  }));
}

/* ── Drawing Functions ── */

function drawGround(ctx: CanvasRenderingContext2D, w: number, h: number) {
  /* Warm, muted base — like bao's paper-toned backgrounds */
  const grad = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, w * 0.8);
  grad.addColorStop(0, "hsl(72, 18%, 68%)");
  grad.addColorStop(0.5, "hsl(80, 16%, 62%)");
  grad.addColorStop(1, "hsl(90, 14%, 55%)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  /* Very subtle warm patches — barely visible texture */
  ctx.globalCompositeOperation = "multiply";
  for (let i = 0; i < 80; i++) {
    const px = Math.random() * w;
    const py = Math.random() * h;
    const r = rand(20, 80);
    const grad2 = ctx.createRadialGradient(px, py, 0, px, py, r);
    const l = rand(92, 100);
    grad2.addColorStop(0, `hsl(${rand(60, 100)}, 10%, ${l}%)`);
    grad2.addColorStop(1, `hsl(${rand(60, 100)}, 5%, 100%)`);
    ctx.fillStyle = grad2;
    ctx.fillRect(px - r, py - r, r * 2, r * 2);
  }
  ctx.globalCompositeOperation = "source-over";
}

function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number) {
  /* Smooth oval vignette — paper bleeds in at edges */
  const cx = w / 2;
  const cy = h / 2;
  const rx = w * 0.52;
  const ry = h * 0.48;

  /* Use multiple gradient layers for smooth falloff */
  const grad = ctx.createRadialGradient(cx, cy, Math.min(rx, ry) * 0.6, cx, cy, Math.max(rx, ry) * 1.4);
  grad.addColorStop(0, "rgba(247, 246, 243, 0)");
  grad.addColorStop(0.5, "rgba(247, 246, 243, 0)");
  grad.addColorStop(0.7, "rgba(247, 246, 243, 0.25)");
  grad.addColorStop(0.85, "rgba(247, 246, 243, 0.6)");
  grad.addColorStop(1, "rgba(247, 246, 243, 0.92)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

function drawGrassClump(
  ctx: CanvasRenderingContext2D,
  clump: GrassClump,
  t: number,
  mouseX: number,
  mouseY: number,
  interactive: boolean
) {
  const { x, y } = clump;

  for (const blade of clump.blades) {
    /* Wind sway — gentle, organic */
    const sway = interactive
      ? Math.sin(t * 0.9 + blade.phase) * 4 + Math.sin(t * 0.5 + blade.phase * 1.7) * 2
      : 0;

    /* Cursor displacement */
    let push = 0;
    if (interactive) {
      const tipApproxX = x + Math.sin(blade.angle) * blade.height * 0.5;
      const tipApproxY = y - blade.height * 0.5;
      const d = dist(tipApproxX, tipApproxY, mouseX, mouseY);
      const influence = Math.max(0, 1 - d / 90);
      push = influence * influence * 30 * (mouseX < x ? 1 : -1);
    }

    const totalBend = blade.angle + (sway + push) * 0.02;

    /* Draw blade as a stroke with gentle curve */
    const tipX = x + Math.sin(totalBend) * blade.height;
    const tipY = y - Math.cos(totalBend) * blade.height;
    const cpX = x + Math.sin(totalBend * 0.5) * blade.height * 0.5 + blade.curve;
    const cpY = y - blade.height * 0.55;

    ctx.strokeStyle = `hsla(${blade.hue}, ${blade.sat}%, ${blade.light}%, 0.85)`;
    ctx.lineWidth = blade.width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(cpX, cpY, tipX, tipY);
    ctx.stroke();

    /* Lighter highlight stroke on one side */
    ctx.strokeStyle = `hsla(${blade.hue - 5}, ${blade.sat - 5}%, ${blade.light + 12}%, 0.3)`;
    ctx.lineWidth = blade.width * 0.4;
    ctx.beginPath();
    ctx.moveTo(x + 0.5, y);
    ctx.quadraticCurveTo(cpX + 0.5, cpY, tipX + 0.5, tipY);
    ctx.stroke();
  }

  /* Seed head (cattail) on tallest blade */
  if (clump.hasSeed) {
    const tallest = clump.blades.reduce((a, b) => (a.height > b.height ? a : b));
    const sway = interactive
      ? Math.sin(t * 0.9 + tallest.phase) * 4 + Math.sin(t * 0.5 + tallest.phase * 1.7) * 2
      : 0;
    const bend = tallest.angle + clump.seedAngle + sway * 0.02;
    const tipX = x + Math.sin(bend) * tallest.height;
    const tipY = y - Math.cos(bend) * tallest.height;

    ctx.fillStyle = `hsla(25, 30%, 38%, 0.9)`;
    ctx.beginPath();
    ctx.ellipse(tipX, tipY - 4, 2.5, 6, bend, 0, Math.PI * 2);
    ctx.fill();

    /* Smaller accent seed */
    ctx.fillStyle = `hsla(20, 25%, 42%, 0.7)`;
    ctx.beginPath();
    ctx.ellipse(tipX + 1, tipY - 2, 1.5, 4, bend + 0.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawFlower(ctx: CanvasRenderingContext2D, flower: Flower, t: number) {
  const { x, y, type, size, phase, petalCount, hue, sat, stemHeight } = flower;
  const sway = Math.sin(t * 0.6 + phase) * 1.5;
  const fx = x + sway;
  const fy = y - stemHeight;

  /* Stem */
  ctx.strokeStyle = `hsla(90, 18%, 50%, 0.6)`;
  ctx.lineWidth = 1;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + sway * 0.3, y - stemHeight * 0.5, fx, fy);
  ctx.stroke();

  ctx.save();
  ctx.globalAlpha = 0.85;

  if (type === "daisy") {
    for (let i = 0; i < petalCount; i++) {
      const a = (i / petalCount) * Math.PI * 2 + phase * 0.1;
      const px = fx + Math.cos(a) * size * 0.7;
      const py = fy + Math.sin(a) * size * 0.7;
      ctx.fillStyle = `hsl(0, 0%, 92%)`;
      ctx.beginPath();
      ctx.ellipse(px, py, size * 0.35, size * 0.15, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "hsl(45, 50%, 60%)";
    ctx.beginPath();
    ctx.arc(fx, fy, size * 0.22, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === "poppy") {
    for (let i = 0; i < petalCount; i++) {
      const a = (i / petalCount) * Math.PI * 2 + phase * 0.1;
      const px = fx + Math.cos(a) * size * 0.35;
      const py = fy + Math.sin(a) * size * 0.35;
      ctx.fillStyle = `hsla(${hue}, ${sat}%, 55%, 0.75)`;
      ctx.beginPath();
      ctx.ellipse(px, py, size * 0.4, size * 0.3, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = `hsl(${hue}, 15%, 28%)`;
    ctx.beginPath();
    ctx.arc(fx, fy, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
  } else {
    /* Small simple dot flower */
    ctx.fillStyle = `hsla(${hue}, ${sat}%, 70%, 0.7)`;
    ctx.beginPath();
    ctx.arc(fx, fy, size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawButterfly(ctx: CanvasRenderingContext2D, b: Butterfly, t: number) {
  const wingFlap = Math.sin(t * 5.5 + b.wingPhase) * 0.65 + 0.35;

  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.globalAlpha = 0.82;

  const col = `hsl(${b.hue}, ${b.sat}%, ${b.light}%)`;
  const colInner = `hsl(${b.hue}, ${b.sat + 8}%, ${b.light - 10}%)`;

  /* Wings with flap */
  ctx.fillStyle = col;
  ctx.save();
  ctx.scale(1, wingFlap);
  /* Left wings */
  ctx.beginPath();
  ctx.ellipse(-b.size * 0.35, -b.size * 0.05, b.size * 0.5, b.size * 0.35, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = colInner;
  ctx.beginPath();
  ctx.ellipse(-b.size * 0.2, b.size * 0.15, b.size * 0.3, b.size * 0.2, -0.3, 0, Math.PI * 2);
  ctx.fill();
  /* Right wings */
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.ellipse(b.size * 0.35, -b.size * 0.05, b.size * 0.5, b.size * 0.35, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = colInner;
  ctx.beginPath();
  ctx.ellipse(b.size * 0.2, b.size * 0.15, b.size * 0.3, b.size * 0.2, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  /* Body */
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = `hsl(${b.hue}, 15%, 32%)`;
  ctx.beginPath();
  ctx.ellipse(0, 0, 1, b.size * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();

  /* Antennae */
  ctx.strokeStyle = `hsla(${b.hue}, 10%, 40%, 0.6)`;
  ctx.lineWidth = 0.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, -b.size * 0.2);
  ctx.quadraticCurveTo(-b.size * 0.25, -b.size * 0.5, -b.size * 0.2, -b.size * 0.6);
  ctx.moveTo(0, -b.size * 0.2);
  ctx.quadraticCurveTo(b.size * 0.25, -b.size * 0.5, b.size * 0.2, -b.size * 0.6);
  ctx.stroke();

  ctx.restore();
}

function drawLadybug(ctx: CanvasRenderingContext2D, bug: Ladybug) {
  ctx.save();
  ctx.translate(bug.x, bug.y);
  ctx.rotate(bug.angle);
  ctx.globalAlpha = 0.85;

  /* Shadow */
  ctx.fillStyle = "rgba(30, 20, 15, 0.1)";
  ctx.beginPath();
  ctx.ellipse(0.5, 0.5, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  /* Body */
  ctx.fillStyle = "hsl(5, 45%, 45%)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 3, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  /* Wing line */
  ctx.strokeStyle = "hsl(5, 25%, 28%)";
  ctx.lineWidth = 0.4;
  ctx.beginPath();
  ctx.moveTo(0, -4);
  ctx.lineTo(0, 4);
  ctx.stroke();

  /* Spots */
  ctx.fillStyle = "hsl(0, 0%, 15%)";
  ctx.beginPath();
  ctx.arc(-1.2, -0.8, 0.8, 0, Math.PI * 2);
  ctx.arc(1.2, -0.8, 0.8, 0, Math.PI * 2);
  ctx.arc(-1, 1.2, 0.7, 0, Math.PI * 2);
  ctx.arc(1, 1.2, 0.7, 0, Math.PI * 2);
  ctx.fill();

  /* Head */
  ctx.fillStyle = "hsl(0, 0%, 16%)";
  ctx.beginPath();
  ctx.arc(0, -4.5, 1.8, 0, Math.PI * 2);
  ctx.fill();

  /* Eyes */
  ctx.fillStyle = "hsl(0, 0%, 85%)";
  ctx.beginPath();
  ctx.arc(-0.8, -4.8, 0.4, 0, Math.PI * 2);
  ctx.arc(0.8, -4.8, 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/* ── Update Functions ── */

function updateButterfly(
  b: Butterfly, dt: number, t: number,
  w: number, h: number, mx: number, my: number
) {
  const d = dist(b.x, b.y, mx, my);
  if (d < 65 && !b.scattered) {
    b.scattered = true;
    b.scatterTimer = 2.5;
    const a = Math.atan2(b.y - my, b.x - mx);
    b.vx += Math.cos(a) * 2;
    b.vy += Math.sin(a) * 2;
  }

  if (b.scattered) {
    b.scatterTimer -= dt;
    if (b.scatterTimer <= 0) {
      b.scattered = false;
      b.targetX = rand(0.2, 0.8) * w;
      b.targetY = rand(0.2, 0.8) * h;
    }
  } else {
    b.targetX += (smoothNoise(t * 0.2, b.wingPhase) - 0.5) * 0.6;
    b.targetY += (smoothNoise(t * 0.2 + 10, b.wingPhase) - 0.5) * 0.6;
    b.targetX = Math.max(w * 0.1, Math.min(w * 0.9, b.targetX));
    b.targetY = Math.max(h * 0.1, Math.min(h * 0.9, b.targetY));

    const dx = b.targetX - b.x;
    const dy = b.targetY - b.y;
    const dd = Math.sqrt(dx * dx + dy * dy);
    if (dd > 1) {
      b.vx += (dx / dd) * 0.025;
      b.vy += (dy / dd) * 0.025;
    }
    if (dd < 8 || Math.random() < 0.002) {
      b.targetX = rand(0.15, 0.85) * w;
      b.targetY = rand(0.15, 0.85) * h;
    }
  }

  b.vx *= 0.965;
  b.vy *= 0.965;
  b.x += b.vx;
  b.y += b.vy;
  b.x = Math.max(15, Math.min(w - 15, b.x));
  b.y = Math.max(15, Math.min(h - 15, b.y));
}

function updateLadybug(
  bug: Ladybug, dt: number,
  w: number, h: number, mx: number, my: number
) {
  const d = dist(bug.x, bug.y, mx, my);
  if (d < 55) {
    bug.paused = true;
    bug.pauseTimer = 1.5;
  }

  if (bug.paused) {
    bug.pauseTimer -= dt;
    if (bug.pauseTimer <= 0) bug.paused = false;
    return;
  }

  bug.x += Math.cos(bug.angle) * bug.speed;
  bug.y += Math.sin(bug.angle) * bug.speed;

  if (Math.random() < 0.008) bug.angle += rand(-0.6, 0.6);
  if (Math.random() < 0.002) { bug.paused = true; bug.pauseTimer = rand(1.5, 5); }

  const m = 25;
  if (bug.x < m || bug.x > w - m || bug.y < m || bug.y > h - m) {
    bug.angle += Math.PI + rand(-0.4, 0.4);
    bug.x = Math.max(m, Math.min(w - m, bug.x));
    bug.y = Math.max(m, Math.min(h - m, bug.y));
  }
}

/* ── Component ── */

interface MeadowCanvasProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function MeadowCanvas({ className, style }: MeadowCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef(0);
  const mouseRef = useRef({ x: -999, y: -999 });
  const startRef = useRef(0);
  const elemRef = useRef<{
    grass: GrassClump[];
    flowers: Flower[];
    butterflies: Butterfly[];
    ladybugs: Ladybug[];
  } | null>(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const prefersReduced = useReducedMotion();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const c = canvasRef.current;
    if (!c || !e.touches[0]) return;
    const r = c.getBoundingClientRect();
    mouseRef.current = { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -999, y: -999 };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const offscreen = document.createElement("canvas");
    offscreenRef.current = offscreen;

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      sizeRef.current = { w, h };

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      offscreen.width = w * dpr;
      offscreen.height = h * dpr;
      const offCtx = offscreen.getContext("2d");
      if (offCtx) {
        offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawGround(offCtx, w, h);
        drawVignette(offCtx, w, h);
      }

      elemRef.current = {
        grass: generateGrass(w, h),
        flowers: generateFlowers(w, h),
        butterflies: generateButterflies(w, h),
        ladybugs: generateLadybugs(w, h),
      };
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    startRef.current = performance.now() / 1000;
    let lastTime = startRef.current;

    const render = () => {
      const now = performance.now() / 1000;
      const t = now - startRef.current;
      const dt = Math.min(now - lastTime, 0.05);
      lastTime = now;

      const { w, h } = sizeRef.current;
      const elems = elemRef.current;
      if (!elems) return;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const active = !prefersReduced;

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(offscreen, 0, 0, offscreen.width, offscreen.height, 0, 0, w, h);

      if (active) {
        for (const b of elems.butterflies) updateButterfly(b, dt, t, w, h, mx, my);
        for (const bug of elems.ladybugs) updateLadybug(bug, dt, w, h, mx, my);
      }

      /* Merge all elements by y-position for proper depth */
      type DrawItem = { y: number; draw: () => void };
      const items: DrawItem[] = [];

      for (const f of elems.flowers) {
        items.push({ y: f.y, draw: () => drawFlower(ctx, f, active ? t : 0) });
      }
      for (const c of elems.grass) {
        items.push({ y: c.y, draw: () => drawGrassClump(ctx, c, active ? t : 0, mx, my, active) });
      }
      for (const bug of elems.ladybugs) {
        items.push({ y: bug.y, draw: () => drawLadybug(ctx, bug) });
      }
      for (const b of elems.butterflies) {
        items.push({ y: b.y, draw: () => drawButterfly(ctx, b, active ? t : 0) });
      }

      items.sort((a, b) => a.y - b.y);
      for (const item of items) item.draw();

      /* Vignette on top */
      drawVignette(ctx, w, h);

      if (!prefersReduced) {
        rafRef.current = requestAnimationFrame(render);
      }
    };

    if (prefersReduced) {
      render();
    } else {
      rafRef.current = requestAnimationFrame(render);
    }

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
  }, [prefersReduced, handleMouseMove, handleTouchMove, handleMouseLeave]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        cursor: "default",
        ...style,
      }}
      aria-label="Interactive meadow illustration — move cursor to part the grass and scatter butterflies"
      role="img"
    />
  );
}
