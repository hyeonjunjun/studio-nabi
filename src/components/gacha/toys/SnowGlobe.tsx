"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import type { ToyProps } from "./index";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random(),
    y: 0.7 + Math.random() * 0.3, // settled at bottom
    vx: 0,
    vy: 0,
    size: 1 + Math.random() * 2,
    opacity: 0.3 + Math.random() * 0.7,
  }));
}

export default function SnowGlobe({ reducedMotion }: ToyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>(createParticles(30));
  const rafRef = useRef<number>(0);
  const [shaken, setShaken] = useState(false);

  const shake = useCallback(() => {
    setShaken(true);
    for (const p of particlesRef.current) {
      p.vx = (Math.random() - 0.5) * 0.03;
      p.vy = -(Math.random() * 0.02 + 0.01);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = 100;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    if (reducedMotion) {
      // Static render
      ctx.clearRect(0, 0, size, size);
      // Letters
      ctx.font = "italic 20px Newsreader, Georgia, serif";
      ctx.fillStyle = "rgba(35, 32, 28, 0.25)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("RJ", size / 2, size / 2);
      // Particles at rest
      for (const p of particlesRef.current) {
        ctx.beginPath();
        ctx.arc(p.x * size, p.y * size, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      }
      return;
    }

    const animate = () => {
      ctx.clearRect(0, 0, size, size);

      // Letters
      ctx.font = "italic 20px Newsreader, Georgia, serif";
      ctx.fillStyle = "rgba(35, 32, 28, 0.25)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("RJ", size / 2, size / 2);

      // Particles
      for (const p of particlesRef.current) {
        p.vy += 0.0003; // gravity
        p.vx *= 0.99; // drag
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < 0.05) { p.x = 0.05; p.vx *= -0.5; }
        if (p.x > 0.95) { p.x = 0.95; p.vx *= -0.5; }
        if (p.y > 0.92) { p.y = 0.92; p.vy *= -0.3; }
        if (p.y < 0.05) { p.y = 0.05; p.vy *= -0.5; }

        ctx.beginPath();
        ctx.arc(p.x * size, p.y * size, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reducedMotion]);

  return (
    <div
      onClick={shake}
      style={{
        width: 110,
        height: 120,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {/* Globe */}
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 30%, rgba(200, 220, 240, 0.4) 0%, rgba(150, 180, 210, 0.2) 60%, rgba(120, 150, 180, 0.15) 100%)",
          border: "2px solid rgba(180, 200, 220, 0.5)",
          overflow: "hidden",
          boxShadow: "inset 0 -8px 16px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.1)",
          position: "relative",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: 100, height: 100 }}
        />
        {/* Glass highlight */}
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 20,
            width: 30,
            height: 12,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.35)",
            transform: "rotate(-25deg)",
            pointerEvents: "none",
          }}
        />
      </div>
      {/* Base */}
      <div
        style={{
          width: 60,
          height: 14,
          borderRadius: "0 0 8px 8px",
          background: "linear-gradient(180deg, #8b7b6b 0%, #6b5b4b 100%)",
          marginTop: -4,
          boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
        }}
      />
      {!shaken && (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 7,
            color: "var(--ink-muted, rgba(35,32,28,0.35))",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginTop: 4,
          }}
        >
          tap to shake
        </span>
      )}
    </div>
  );
}
