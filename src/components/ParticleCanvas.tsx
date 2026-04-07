"use client";

import { useEffect, useRef, useCallback } from "react";

type Density = "normal" | "dense";

interface ParticleCanvasProps {
  density?: Density;
  cursorResponsive?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
}

const WARM_COLORS = ["#c8a455", "#d4a04a", "#e8c08a"];
const COOL_COLORS = ["#4a8a8c", "#3d6e8a", "#2a4a6e"];
const ALL_COLORS = [...WARM_COLORS, ...COOL_COLORS];

const DAMPING = 0.999;
const CURSOR_RADIUS = 150;
const CURSOR_FORCE = 0.15;

function createParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.15,
    vy: -(Math.random() * 0.1 + 0.02), // mostly upward
    radius: Math.random() * 1.5 + 0.5,
    color: ALL_COLORS[Math.floor(Math.random() * ALL_COLORS.length)],
    opacity: Math.random() * 0.01 + 0.02, // 0.02–0.03
  };
}

export default function ParticleCanvas({
  density = "normal",
  cursorResponsive = true,
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number>(0);
  const reducedMotionRef = useRef(false);

  const count = density === "dense" ? 50 : 15;

  const initParticles = useCallback(
    (w: number, h: number) => {
      const particles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        particles.push(createParticle(w, h));
      }
      particlesRef.current = particles;
    },
    [count]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check reduced motion preference
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mql.matches;
    const onMotionChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    mql.addEventListener("change", onMotionChange);

    // Size canvas
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (particlesRef.current.length === 0) {
        initParticles(window.innerWidth, window.innerHeight);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseLeave = () => {
      mouseRef.current = null;
    };
    if (cursorResponsive) {
      window.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseleave", onMouseLeave);
    }

    // Animation loop
    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      for (const p of particlesRef.current) {
        if (!reducedMotionRef.current) {
          // Cursor repulsion
          if (cursorResponsive && mouseRef.current) {
            const dx = p.x - mouseRef.current.x;
            const dy = p.y - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < CURSOR_RADIUS && dist > 0) {
              const force = (1 - dist / CURSOR_RADIUS) * CURSOR_FORCE;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
            }
          }

          // Apply velocity with damping
          p.vx *= DAMPING;
          p.vy *= DAMPING;
          p.x += p.vx;
          p.y += p.vy;

          // Wrap edges
          if (p.x < 0) p.x += w;
          if (p.x > w) p.x -= w;
          if (p.y < 0) p.y += h;
          if (p.y > h) p.y -= h;
        }

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      mql.removeEventListener("change", onMotionChange);
      if (cursorResponsive) {
        window.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseleave", onMouseLeave);
      }
    };
  }, [count, cursorResponsive, initParticles]);

  return <canvas ref={canvasRef} className="particle-canvas" />;
}
