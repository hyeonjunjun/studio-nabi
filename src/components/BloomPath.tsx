"use client";

import { useRef, useEffect, type ReactNode } from "react";

/* ════════════════════════════════════════════════════════════
   BloomPath — WuWa vertical navigation treatment

   A vertical connecting line with icon nodes placed along it.
   The active node IS the light source — glow radiates FROM
   the icon center outward, not from a rectangular border.

   The connecting line brightens as it approaches the active
   node and fades back to dim as it moves away. Particles
   float along/near the vertical path.

   Structure:
     ·  (dim node)
     │  ← connecting line, brightens near active
     ◆  (ACTIVE — glow radiates from center)
     │
     ·  (dim node)
   ════════════════════════════════════════════════════════════ */

interface PathNode {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface BloomPathProps {
  nodes: PathNode[];
  activeId: string;
  onSelect: (id: string) => void;
  accentColor?: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
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

export default function BloomPath({
  nodes,
  activeId,
  onSelect,
  accentColor = "#C4A265",
}: BloomPathProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ activeId, accentColor });
  stateRef.current = { activeId, accentColor };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    let raf = 0;
    let time = 0;
    let activeSince = 0;
    let prevActiveId = stateRef.current.activeId;
    const particles: Particle[] = [];
    let spawnTimer = 0;

    // Node positions (populated from DOM)
    let nodePositions: { id: string; y: number }[] = [];

    function resize() {
      const rect = container!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      // Canvas covers the full container + padding for glow overflow
      const pad = 40;
      canvas!.width = (rect.width + pad * 2) * dpr;
      canvas!.height = (rect.height + pad * 2) * dpr;
      canvas!.style.width = `${rect.width + pad * 2}px`;
      canvas!.style.height = `${rect.height + pad * 2}px`;
      canvas!.style.left = `${-pad}px`;
      canvas!.style.top = `${-pad}px`;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      // Read node positions from DOM
      const containerRect = container!.getBoundingClientRect();
      nodePositions = [];
      container!.querySelectorAll("[data-path-node]").forEach((el) => {
        const elRect = (el as HTMLElement).getBoundingClientRect();
        nodePositions.push({
          id: (el as HTMLElement).dataset.pathNode!,
          y: elRect.top - containerRect.top + elRect.height / 2,
        });
      });
    }
    resize();

    // The vertical line x position — centered on the left side of the labels
    const LINE_X = 20; // px from left edge of container (center of the line)

    function getActiveNodeY(): number {
      const active = nodePositions.find((n) => n.id === stateRef.current.activeId);
      return active?.y ?? 0;
    }

    let currentActiveY = getActiveNodeY();

    function frame() {
      const cw = parseFloat(canvas!.style.width);
      const ch = parseFloat(canvas!.style.height);
      const PAD = 40;

      ctx.clearRect(0, 0, cw, ch);
      time += 1 / 60;

      const s = stateRef.current;
      const [cr, cg, cb] = hexToRgb(s.accentColor);

      // Detect active change for bounce
      if (s.activeId !== prevActiveId) {
        activeSince = time;
        prevActiveId = s.activeId;
      }

      const targetY = getActiveNodeY();
      currentActiveY += (targetY - currentActiveY) * 0.08;

      const timeSinceSwitch = time - activeSince;
      const bounceDecay = Math.exp(-timeSinceSwitch * 4);

      ctx.save();
      ctx.translate(PAD, PAD);

      const lineX = LINE_X;
      const firstY = nodePositions[0]?.y ?? 0;
      const lastY = nodePositions[nodePositions.length - 1]?.y ?? ch - PAD * 2;

      /* ── Draw the connecting vertical line ─────────────── */
      const LINE_SAMPLES = 200;
      const lineTop = firstY;
      const lineBottom = lastY;
      const lineHeight = lineBottom - lineTop;

      for (let i = 0; i < LINE_SAMPLES; i++) {
        const t = i / LINE_SAMPLES;
        const y = lineTop + t * lineHeight;
        const yNext = lineTop + ((i + 1) / LINE_SAMPLES) * lineHeight;

        // Distance from active node (normalized 0-1 where 0 = at active)
        const distFromActive = Math.abs(y - currentActiveY) / (lineHeight * 0.5 || 1);
        const proximity = Math.max(0, 1 - distFromActive);
        const smoothProx = proximity * proximity * (3 - 2 * proximity);

        // Line displacement — subtle undulation near active node
        const calmWave = Math.sin(y * 0.04 - time * 1.2) * 0.4 * smoothProx;
        const bounceWave = Math.sin(y * 0.1 + time * 8) * bounceDecay * 1.5 * smoothProx;
        const dx = calmWave + bounceWave;

        const calmWaveNext = Math.sin(yNext * 0.04 - time * 1.2) * 0.4 * smoothProx;
        const bounceWaveNext = Math.sin(yNext * 0.1 + time * 8) * bounceDecay * 1.5 * smoothProx;
        const dxNext = calmWaveNext + bounceWaveNext;

        // Brightness: dim far from active, bright near active
        const baseAlpha = 0.06;
        const peakAlpha = 0.6;
        const alpha = baseAlpha + smoothProx * (peakAlpha - baseAlpha);

        // Color: white dim → gold near active
        const r = Math.round(255 - smoothProx * (255 - cr));
        const g = Math.round(255 - smoothProx * (255 - cg));
        const b = Math.round(255 - smoothProx * (255 - cb));

        ctx.beginPath();
        ctx.moveTo(lineX + dx, y);
        ctx.lineTo(lineX + dxNext, yNext);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.stroke();

        // Glow near active
        if (smoothProx > 0.3) {
          ctx.beginPath();
          ctx.moveTo(lineX + dx, y);
          ctx.lineTo(lineX + dxNext, yNext);
          ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${smoothProx * 0.08})`;
          ctx.lineWidth = 8;
          ctx.filter = "blur(3px)";
          ctx.stroke();
          ctx.filter = "none";
        }
      }

      /* ── Draw node indicators ──────────────────────────── */
      for (const node of nodePositions) {
        const isActive = node.id === s.activeId;

        if (isActive) {
          // Active node: radiant glow emanating FROM the center

          // Layer 1: Wide atmospheric bloom
          const outerGrad = ctx.createRadialGradient(lineX, node.y, 0, lineX, node.y, 50);
          outerGrad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.08)`);
          outerGrad.addColorStop(0.4, `rgba(${cr}, ${cg}, ${cb}, 0.03)`);
          outerGrad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
          ctx.fillStyle = outerGrad;
          ctx.beginPath();
          ctx.arc(lineX, node.y, 50, 0, Math.PI * 2);
          ctx.fill();

          // Layer 2: Tight inner glow
          const innerGrad = ctx.createRadialGradient(lineX, node.y, 0, lineX, node.y, 12);
          innerGrad.addColorStop(0, `rgba(255, 240, 200, 0.5)`);
          innerGrad.addColorStop(0.3, `rgba(${cr}, ${cg}, ${cb}, 0.3)`);
          innerGrad.addColorStop(0.7, `rgba(${cr}, ${cg}, ${cb}, 0.08)`);
          innerGrad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
          ctx.fillStyle = innerGrad;
          ctx.beginPath();
          ctx.arc(lineX, node.y, 12, 0, Math.PI * 2);
          ctx.fill();

          // Layer 3: Bright core dot
          const coreGrad = ctx.createRadialGradient(lineX, node.y, 0, lineX, node.y, 4);
          coreGrad.addColorStop(0, `rgba(255, 248, 220, 0.9)`);
          coreGrad.addColorStop(0.5, `rgba(255, 230, 170, 0.6)`);
          coreGrad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
          ctx.fillStyle = coreGrad;
          ctx.beginPath();
          ctx.arc(lineX, node.y, 4, 0, Math.PI * 2);
          ctx.fill();

        } else {
          // Inactive node: small dim outlined circle
          ctx.beginPath();
          ctx.arc(lineX, node.y, 3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, 0.12)`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Tiny dim center dot
          ctx.beginPath();
          ctx.arc(lineX, node.y, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, 0.08)`;
          ctx.fill();
        }
      }

      /* ── Particles floating along the path near active ── */
      spawnTimer += 1 / 60;
      if (spawnTimer > 0.25 && particles.length < 12) {
        // Spawn near the active node, along the vertical line
        const spawnY = currentActiveY + (Math.random() - 0.5) * 40;
        particles.push({
          x: lineX + (Math.random() - 0.5) * 8,
          y: spawnY,
          vx: (Math.random() - 0.5) * 0.2,
          vy: -(0.1 + Math.random() * 0.25), // float upward
          size: 0.8 + Math.random() * 1.8,
          life: 1.0,
          maxLife: 2.5 + Math.random() * 2.5,
        });
        spawnTimer = 0;
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        // Gentle drift toward the line
        p.vx += (lineX - p.x) * 0.001;
        p.life -= (1 / 60) / p.maxLife;
        if (p.life <= 0) { particles.splice(i, 1); continue; }

        const fadeIn = Math.min((1 - p.life) * 6, 1);
        const alpha = Math.min(fadeIn, p.life);
        const r = p.size * 4;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        grad.addColorStop(0, `rgba(255, 245, 210, ${alpha * 0.7})`);
        grad.addColorStop(0.2, `rgba(${cr}, ${cg}, ${cb}, ${alpha * 0.35})`);
        grad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);

        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      }

      ctx.restore();
      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [nodes.length]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 32,
        paddingLeft: 48, // space for line + glow on left
      }}
    >
      {/* Canvas for the line, glow, particles */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Node labels — positioned to the right of the line */}
      {nodes.map((node) => {
        const isActive = node.id === activeId;
        return (
          <button
            key={node.id}
            data-path-node={node.id}
            onClick={() => onSelect(node.id)}
            style={{
              position: "relative",
              zIndex: 1,
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              padding: "6px 0",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {node.icon && (
              <span
                style={{
                  fontSize: 16,
                  color: isActive ? accentColor : `rgba(255,255,255,0.2)`,
                  transition: "color 300ms",
                  filter: isActive ? `drop-shadow(0 0 6px ${accentColor}60)` : "none",
                }}
              >
                {node.icon}
              </span>
            )}
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 11,
                letterSpacing: "0.08em",
                color: isActive ? "var(--ink-primary)" : "var(--ink-muted)",
                transition: "color 300ms",
              }}
            >
              {node.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
