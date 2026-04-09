"use client";

import {
  useRef,
  useEffect,
  type ReactNode,
  type CSSProperties,
} from "react";

/* ════════════════════════════════════════════════════════════
   BloomNode — 1:1 WuWa active-state treatment

   THE KEY INSIGHT: The border is not static. It's a flowing
   conic gradient that rotates continuously — liquid gold
   tracing the perimeter. A bright point sweeps around the
   rectangle, leaving a fading trail.

   Layers when active:
     1. Flowing border (rotating conic gradient)
     2. Inner atmospheric glow
     3. Outer bloom radiating into void
     4. Particle motes drifting from edges
     5. Corner marks at peak brightness
     6. Vertical light streak

   Inactive: thin static border, no glow, no particles.
   ════════════════════════════════════════════════════════════ */

interface BloomNodeProps {
  active: boolean;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  accentColor?: string;
  cornerSize?: number;
  noParticles?: boolean;
  as?: "div" | "button" | "a" | "li" | "nav";
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/* ── Particle system ─────────────────────────────────────── */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
}

function spawnParticle(w: number, h: number): Particle {
  const edge = Math.floor(Math.random() * 4);
  let x: number, y: number;
  switch (edge) {
    case 0: x = Math.random() * w; y = 0; break;
    case 1: x = w; y = Math.random() * h; break;
    case 2: x = Math.random() * w; y = h; break;
    default: x = 0; y = Math.random() * h; break;
  }
  const angle = Math.atan2(y - h / 2, x - w / 2) + (Math.random() - 0.5) * 0.8;
  const speed = 0.12 + Math.random() * 0.3;
  return {
    x, y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 0.08,
    size: 1.0 + Math.random() * 2.2,
    life: 1.0,
    maxLife: 2 + Math.random() * 2.5,
  };
}

function runParticles(
  canvas: HTMLCanvasElement,
  activeRef: { current: boolean },
  accentRef: { current: string },
) {
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx) return () => {};

  const particles: Particle[] = [];
  let raf = 0;
  let spawnTimer = 0;
  const PAD = 50;

  function resize() {
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (!rect) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = (rect.width + PAD * 2) * dpr;
    canvas.height = (rect.height + PAD * 2) * dpr;
    canvas.style.width = `${rect.width + PAD * 2}px`;
    canvas.style.height = `${rect.height + PAD * 2}px`;
    canvas.style.left = `${-PAD}px`;
    canvas.style.top = `${-PAD}px`;
    ctx.resetTransform();
    ctx.scale(dpr, dpr);
  }
  resize();

  function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace("#", "");
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }

  function frame() {
    const w = parseFloat(canvas.style.width);
    const h = parseFloat(canvas.style.height);
    ctx.clearRect(0, 0, w, h);

    if (activeRef.current) {
      spawnTimer += 1 / 60;
      if (spawnTimer > 0.12 && particles.length < 18) {
        const p = spawnParticle(w - PAD * 2, h - PAD * 2);
        p.x += PAD;
        p.y += PAD;
        particles.push(p);
        spawnTimer = 0;
      }
    }

    const [cr, cg, cb] = hexToRgb(accentRef.current);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= (1 / 60) / p.maxLife;
      if (p.life <= 0) { particles.splice(i, 1); continue; }

      const fadeIn = Math.min((1 - p.life) * 8, 1);
      const alpha = Math.min(fadeIn, p.life);
      const r = p.size * 5;

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      grad.addColorStop(0, `rgba(255, 245, 210, ${alpha * 0.85})`);
      grad.addColorStop(0.12, `rgba(${Math.min(cr + 60, 255)}, ${Math.min(cg + 50, 255)}, ${cb + 30}, ${alpha * 0.6})`);
      grad.addColorStop(0.4, `rgba(${cr}, ${cg}, ${cb}, ${alpha * 0.2})`);
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
  const onResize = () => resize();
  window.addEventListener("resize", onResize);
  return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
}

/* ── Component ───────────────────────────────────────────── */

export default function BloomNode({
  active,
  children,
  className = "",
  style = {},
  accentColor = "#C4A265",
  cornerSize = 16,
  noParticles = false,
  as: Tag = "div",
  onClick,
  onMouseEnter,
  onMouseLeave,
}: BloomNodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const accentRef = useRef(accentColor);
  const cleanupRef = useRef<(() => void) | null>(null);
  activeRef.current = active;
  accentRef.current = accentColor;

  useEffect(() => {
    if (noParticles || !canvasRef.current) return;
    cleanupRef.current = runParticles(canvasRef.current, activeRef, accentRef);
    return () => { cleanupRef.current?.(); };
  }, [noParticles]);

  const cs = cornerSize;
  const cornerColor = active ? `rgba(196, 162, 101, 0.85)` : `rgba(255, 255, 255, 0.06)`;

  const containerStyle: CSSProperties = {
    position: "relative",
    overflow: "visible",
    /* The border is handled by the ::before pseudo — keep actual border transparent */
    border: "1px solid transparent",
    boxShadow: active
      ? [
          `inset 0 0 25px rgba(196, 162, 101, 0.12)`,
          `inset 0 0 60px rgba(196, 162, 101, 0.05)`,
          `0 0 15px 2px rgba(196, 162, 101, 0.15)`,
          `0 0 40px 10px rgba(196, 162, 101, 0.08)`,
          `0 0 80px 30px rgba(196, 162, 101, 0.04)`,
          `0 0 120px 50px rgba(196, 162, 101, 0.02)`,
        ].join(", ")
      : "none",
    transition: "box-shadow 500ms var(--ease-swift)",
    ...style,
  };

  return (
    <Tag
      className={`bloom-node ${active ? "bloom-active" : ""} ${className}`}
      style={containerStyle}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* ── The flowing border ───────────────────────────
           This is the core WuWa effect:
           - A conic-gradient rotates around the element
           - It's masked so only the border perimeter shows
           - The bright point sweeps with a trailing fade
           Implemented via CSS @property + @keyframes below */}

      {/* Corner marks */}
      {[
        { top: -1, left: -1, bt: true, bl: true },
        { top: -1, right: -1, bt: true, br: true },
        { bottom: -1, left: -1, bb: true, bl: true },
        { bottom: -1, right: -1, bb: true, br: true },
      ].map((pos, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            position: "absolute",
            width: cs,
            height: cs,
            pointerEvents: "none",
            transition: "border-color 200ms var(--ease-swift)",
            ...(pos.top !== undefined && { top: pos.top }),
            ...(pos.bottom !== undefined && { bottom: pos.bottom }),
            ...(pos.left !== undefined && { left: pos.left }),
            ...(pos.right !== undefined && { right: pos.right }),
            ...(pos.bt && { borderTop: `1px solid ${cornerColor}` }),
            ...(pos.bb && { borderBottom: `1px solid ${cornerColor}` }),
            ...(pos.bl && { borderLeft: `1px solid ${cornerColor}` }),
            ...(pos.br && { borderRight: `1px solid ${cornerColor}` }),
          }}
        />
      ))}

      {/* Vertical light streak */}
      {active && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-50%",
            bottom: "-50%",
            left: "50%",
            width: 1,
            transform: "translateX(-0.5px)",
            background: `linear-gradient(180deg,
              transparent 0%,
              rgba(196,162,101,0.02) 20%,
              rgba(196,162,101,0.15) 40%,
              rgba(196,162,101,0.3) 50%,
              rgba(196,162,101,0.15) 60%,
              rgba(196,162,101,0.02) 80%,
              transparent 100%
            )`,
            pointerEvents: "none",
            zIndex: -1,
          }}
        />
      )}

      {/* Particle canvas */}
      {!noParticles && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{ position: "absolute", pointerEvents: "none", zIndex: -1 }}
        />
      )}

      {children}

      {/* ── Inline styles for the flowing border animation ── */}
      <style>{`
        .bloom-node {
          --border-angle: 0deg;
          isolation: isolate;
        }

        .bloom-node::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          pointer-events: none;
          z-index: -1;
          opacity: 0;
          transition: opacity 300ms var(--ease-swift);

          /* The flowing border: a conic gradient that rotates */
          background: conic-gradient(
            from var(--border-angle),
            transparent 0%,
            transparent 30%,
            rgba(196, 162, 101, 0.08) 38%,
            rgba(196, 162, 101, 0.25) 43%,
            rgba(255, 220, 150, 0.7) 45%,
            rgba(196, 162, 101, 0.9) 47%,
            rgba(255, 235, 180, 1.0) 50%,
            rgba(196, 162, 101, 0.9) 53%,
            rgba(255, 220, 150, 0.7) 55%,
            rgba(196, 162, 101, 0.25) 57%,
            rgba(196, 162, 101, 0.08) 62%,
            transparent 70%,
            transparent 100%
          );

          /* Mask: only show the gradient along a thin border */
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          padding: 1.5px;
        }

        /* Static dim border for inactive state */
        .bloom-node::after {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          pointer-events: none;
          z-index: -1;
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: opacity 200ms var(--ease-swift);
        }

        .bloom-active::before {
          opacity: 1;
          animation: bloom-rotate 4s linear infinite;
        }

        .bloom-active::after {
          /* Dim base border still visible behind the flow */
          border-color: rgba(196, 162, 101, 0.15);
        }

        @keyframes bloom-rotate {
          0% { --border-angle: 0deg; }
          100% { --border-angle: 360deg; }
        }

        /* CSS @property for animating the conic gradient angle */
        @property --border-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
      `}</style>
    </Tag>
  );
}
