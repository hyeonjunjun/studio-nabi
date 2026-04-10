"use client";

import { useRef, useEffect } from "react";

/* ════════════════════════════════════════════════════════════
   BloomBar — WuWa nav bar treatment

   A thin horizontal line that spans the full nav width.
   The active section has a concentrated bright segment with:
   - Flowing undulation on the line
   - Bright gold sweep traveling through the active zone
   - Particle motes rising from the active segment
   - Subtle glow beneath the active section

   The bar is ONE continuous line. The bright portion sits
   at the active tab's position.
   ════════════════════════════════════════════════════════════ */

interface BloomBarProps {
  /** Normalized x position of active segment center (0-1) */
  activePosition: number;
  /** Normalized width of active segment (0-1) */
  activeWidth: number;
  /** Whether any section is active */
  isActive: boolean;
  /** Bar width in px — usually matches parent width */
  width: number;
  /** Accent color */
  accentColor?: string;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

export default function BloomBar({
  activePosition,
  activeWidth,
  isActive,
  width,
  accentColor = "#C4A265",
  className = "",
}: BloomBarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    activePosition,
    activeWidth,
    isActive,
    accentColor,
  });

  // Update refs without re-render
  stateRef.current = { activePosition, activeWidth, isActive, accentColor };

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvasRef.current) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    const HEIGHT = 60; // canvas height to accommodate glow + particles
    const LINE_Y = 10; // the bar line sits near the top
    const particles: Particle[] = [];
    let raf = 0;
    let time = 0;
    let activeSince = -1;
    let wasActive = false;
    let spawnTimer = 0;

    // Current lerped values for smooth transitions
    let currentPos = activePosition;
    let currentWidth = activeWidth;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = stateRef.current.isActive ? width : width;
      canvas.width = w * dpr;
      canvas.height = HEIGHT * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${HEIGHT}px`;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    }
    resize();

    function frame() {
      const s = stateRef.current;
      const w = parseFloat(canvas.style.width);

      ctx.clearRect(0, 0, w, HEIGHT);
      time += 1 / 60;

      if (s.isActive && !wasActive) activeSince = time;
      wasActive = s.isActive;

      // Smooth lerp position and width
      currentPos += (s.activePosition - currentPos) * 0.08;
      currentWidth += (s.activeWidth - currentWidth) * 0.08;

      const [cr, cg, cb] = hexToRgb(s.accentColor);
      const timeSinceActive = activeSince > 0 ? time - activeSince : 0;

      // Bounce decay
      const bounceDecay = Math.exp(-timeSinceActive * 5);
      const bounceAmp = bounceDecay * 1.5;

      // Active zone in pixels
      const activeStart = currentPos * w - (currentWidth * w) / 2;
      const activeEnd = currentPos * w + (currentWidth * w) / 2;

      const SAMPLES = Math.ceil(w);

      for (let i = 0; i < SAMPLES; i++) {
        const x = i;
        const xNorm = x / w; // 0-1

        // Distance from active center (normalized)
        const distFromCenter = Math.abs(xNorm - currentPos);
        const halfWidth = currentWidth / 2;

        // Smooth falloff from active zone
        let intensity = 0;
        if (s.isActive) {
          if (distFromCenter < halfWidth * 0.6) {
            // Inside core: full intensity
            intensity = 1;
          } else if (distFromCenter < halfWidth * 1.2) {
            // Transition zone: smooth cubic falloff
            const t = (distFromCenter - halfWidth * 0.6) / (halfWidth * 0.6);
            intensity = 1 - t * t * (3 - 2 * t);
          }
        }

        // Calm undulation — only in the active zone
        const calmWave = Math.sin(x * 0.03 - time * 1.5);
        const bounceWave = Math.sin(x * 0.08 + time * 8);
        const displacement = (calmWave * 0.5 + bounceWave * bounceAmp) * intensity;

        const y = LINE_Y + displacement;

        // Brightness
        const baseAlpha = 0.06; // dim bar everywhere
        const peakAlpha = 0.85;
        const alpha = baseAlpha + intensity * (peakAlpha - baseAlpha);

        // Color: white dim → gold bright
        const r = Math.round(255 - intensity * (255 - cr));
        const g = Math.round(255 - intensity * (255 - cg));
        const b = Math.round(255 - intensity * (255 - cb));

        // Draw pixel segment
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 1.5, y);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Glow on bright portions
        if (intensity > 0.4) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + 1.5, y);
          ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${intensity * 0.1})`;
          ctx.lineWidth = 8;
          ctx.filter = "blur(3px)";
          ctx.stroke();
          ctx.filter = "none";
        }
      }

      // Bright sweep within the active zone
      if (s.isActive) {
        const sweepPos = activeStart + ((time * 0.03) % 1) * (activeEnd - activeStart);
        const sweepWidth = (activeEnd - activeStart) * 0.3;

        for (let i = Math.max(0, Math.floor(sweepPos - sweepWidth)); i < Math.min(w, sweepPos + sweepWidth); i++) {
          const dist = Math.abs(i - sweepPos);
          const sweepIntensity = Math.max(0, 1 - dist / sweepWidth);
          const smooth = sweepIntensity * sweepIntensity;

          if (smooth > 0.05) {
            ctx.beginPath();
            ctx.moveTo(i, LINE_Y);
            ctx.lineTo(i + 1.5, LINE_Y);
            ctx.strokeStyle = `rgba(255, 240, 200, ${smooth * 0.3})`;
            ctx.lineWidth = 1;
            ctx.globalCompositeOperation = "lighter";
            ctx.stroke();
            ctx.globalCompositeOperation = "source-over";
          }
        }

        // Endpoint dots at the active segment boundaries
        for (const ex of [activeStart, activeEnd]) {
          const grad = ctx.createRadialGradient(ex, LINE_Y, 0, ex, LINE_Y, 3);
          grad.addColorStop(0, `rgba(255, 240, 200, 0.5)`);
          grad.addColorStop(0.4, `rgba(${cr}, ${cg}, ${cb}, 0.2)`);
          grad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(ex, LINE_Y, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Downward glow beneath active section
        const glowGrad = ctx.createLinearGradient(0, LINE_Y, 0, LINE_Y + 30);
        glowGrad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.06)`);
        glowGrad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
        ctx.fillStyle = glowGrad;
        ctx.fillRect(activeStart, LINE_Y, activeEnd - activeStart, 30);
      }

      /* ── Particles rising from active segment ──────────── */
      if (s.isActive) {
        spawnTimer += 1 / 60;
        if (spawnTimer > 0.2 && particles.length < 10) {
          const px = activeStart + Math.random() * (activeEnd - activeStart);
          particles.push({
            x: px,
            y: LINE_Y,
            vx: (Math.random() - 0.5) * 0.3,
            vy: -(0.15 + Math.random() * 0.3), // float upward (above the bar)
            size: 0.8 + Math.random() * 1.5,
            life: 1.0,
            maxLife: 2 + Math.random() * 2,
          });
          spawnTimer = 0;
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= (1 / 60) / p.maxLife;
        if (p.life <= 0) { particles.splice(i, 1); continue; }

        const fadeIn = Math.min((1 - p.life) * 6, 1);
        const alpha = Math.min(fadeIn, p.life);
        const r = p.size * 4;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        grad.addColorStop(0, `rgba(255, 245, 210, ${alpha * 0.7})`);
        grad.addColorStop(0.2, `rgba(${cr}, ${cg}, ${cb}, ${alpha * 0.4})`);
        grad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);

        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      }

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [width]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{
        display: "block",
        pointerEvents: "none",
      }}
    />
  );
}
