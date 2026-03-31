# Cloud Sky Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the card grid homepage with a San Rita-style pannable cloud canvas where projects are pinned markers you discover by dragging.

**Architecture:** Single oversized div (250vw × 200vh) with a cloud gradient placeholder as background. CSS `transform: translate(x, y)` for panning. Project markers are absolutely positioned `<Link>` elements. Drag-to-pan via mousedown/mousemove/mouseup with momentum on release. Fixed edge UI: top bar, bottom bar, sidebar nav, edge labels. Hover tooltip for project info. GSAP entrance choreography.

**Tech Stack:** Next.js 16, React 19, GSAP, CSS transforms, vanilla JS drag events.

**Spec:** `docs/superpowers/specs/2026-03-31-cloud-sky-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/app/page.tsx` | **Rewrite** | Cloud Sky homepage — canvas, markers, drag logic, tooltip, sidebar, edge labels |
| `src/app/globals.css` | **Rewrite** | Design tokens, canvas styles, marker styles, tooltip, sidebar, edge labels, entrance |
| `src/app/layout.tsx` | **Keep** | No changes |
| `src/constants/pieces.ts` | **Keep** | Project data |
| `src/constants/contact.ts` | **Keep** | Links + email |
| All other files | **Keep** | Detail pages, about, utilities unchanged |

Only 2 files change. Everything else stays.

---

## Chunk 1: CSS Foundation

### Task 1: Rewrite globals.css

**Files:**
- Rewrite: `src/app/globals.css`

- [ ] **Step 1: Write the complete stylesheet**

```css
@import "tailwindcss";

:root {
  --bg: #0e0e0e;
  --bg-rgb: 14, 14, 14;
  --fg: #eae6df;
  --fg-rgb: 234, 230, 223;
  --fg-2: rgba(234, 230, 223, 0.60);
  --fg-3: rgba(234, 230, 223, 0.30);
  --fg-4: rgba(234, 230, 223, 0.12);
  --fg-5: rgba(234, 230, 223, 0.05);

  --font-body: var(--font-sans), system-ui, sans-serif;
  --font-mono: var(--font-fragment), "SF Mono", monospace;
  --font-display: var(--font-serif), Georgia, serif;

  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  --gutter: clamp(16px, 2vw, 28px);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-text-size-adjust: 100%; }
*::-webkit-scrollbar { display: none; }
* { scrollbar-width: none; }

body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
  height: 100dvh;
  cursor: grab;
}

body.is-dragging { cursor: grabbing; }

::selection { background: rgba(var(--fg-rgb), 0.12); }
:focus-visible { outline: 1px solid var(--fg-3); outline-offset: 3px; }

.skip-to-content {
  position: absolute; top: -100px; left: var(--gutter);
  z-index: 999; padding: 8px 16px;
  background: var(--fg); color: var(--bg);
  font: 500 11px/1 var(--font-mono); letter-spacing: 0.04em;
  text-decoration: none; transition: top 200ms var(--ease);
}
.skip-to-content:focus { top: 8px; }

/* ═══ PANNABLE CANVAS ═══ */

.sky-canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
  width: 250vw;
  height: 200vh;
  background: linear-gradient(135deg, #2a3040 0%, #1a1e28 40%, #0e1018 100%);
  background-size: cover;
  background-position: center;
  will-change: transform;
  /* Initial position: centered */
  transform: translate(-75vw, -50vh);
}

/* When a real cloud photo is added:
   .sky-canvas { background-image: url('/images/cloud-panorama.jpg'); }
*/

/* ═══ MARKERS ═══ */

.marker {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--fg);
  cursor: pointer;
  z-index: 2;
  transition: opacity 0.3s var(--ease);
}

.marker-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(var(--fg-rgb), 0.4);
  border: 1px solid rgba(var(--fg-rgb), 0.15);
  flex-shrink: 0;
  animation: marker-pulse 3s ease-in-out infinite;
}

@keyframes marker-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.4); }
}

.marker-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.02em;
  color: var(--fg-3);
  white-space: nowrap;
  transition: color 0.3s var(--ease);
}

.marker:hover .marker-dot {
  background: var(--fg);
  border-color: var(--fg);
}

.marker:hover .marker-label {
  color: var(--fg);
}

/* Dim non-hovered markers */
.sky-canvas.has-hover .marker:not(:hover) {
  opacity: 0.25;
}

/* Statement marker — larger text */
.marker--statement .marker-label {
  font-family: var(--font-display);
  font-size: clamp(16px, 2vw, 24px);
  font-weight: 400;
  letter-spacing: -0.01em;
  color: var(--fg-2);
  line-height: 1.2;
  max-width: 280px;
  white-space: normal;
}

.marker--statement .marker-dot { display: none; }

/* ═══ HOVER TOOLTIP ═══ */

.tooltip {
  position: fixed;
  z-index: 200;
  display: flex;
  background: rgba(8, 8, 8, 0.94);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
  width: 380px;
  height: 150px;
  pointer-events: none;
  animation: tooltip-in 0.2s var(--ease) forwards;
}

@keyframes tooltip-in {
  from { opacity: 0; transform: translateY(6px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.tooltip-image {
  width: 170px;
  height: 100%;
  flex-shrink: 0;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
}

.tooltip-image img { display: block; width: 100%; height: 100%; object-fit: cover; }

.tooltip-color { width: 100%; height: 100%; }

.tooltip-text {
  flex: 1;
  padding: 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #fff;
}

.tooltip-num { font-family: var(--font-mono); font-size: 11px; color: rgba(255,255,255,0.30); }
.tooltip-desc { font-family: var(--font-body); font-size: 11px; color: rgba(255,255,255,0.65); line-height: 1.4; }
.tooltip-name { font-family: var(--font-body); font-size: 13px; font-weight: 500; color: #fff; letter-spacing: -0.01em; }
.tooltip-meta { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 10px; color: rgba(255,255,255,0.30); font-variant-numeric: tabular-nums; }

@media (max-width: 600px) { .tooltip { display: none; } }

/* ═══ SIDEBAR NAV ═══ */

.sidebar {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 var(--gutter);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.02em;
}

.sidebar a {
  color: var(--fg-3);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.3s var(--ease);
}
.sidebar a:hover { color: var(--fg); }

.sidebar-legend {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 10px;
  color: var(--fg-4);
}

.sidebar-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: color 0.3s var(--ease);
}
.sidebar-legend-item:hover { color: var(--fg-3); }
.sidebar-legend-item.active { color: var(--fg-2); }

.sidebar-legend-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}

@media (max-width: 768px) {
  .sidebar { display: none; }
}

/* ═══ EDGE LABELS ═══ */

.edge-label {
  position: fixed;
  z-index: 10;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.02em;
  color: var(--fg-3);
  pointer-events: none;
}

.edge-tl { top: 12px; left: var(--gutter); font-weight: 500; color: var(--fg); }
.edge-tc { top: 12px; left: 50%; transform: translateX(-50%); font-variant-numeric: tabular-nums; }
.edge-tr { top: 12px; right: var(--gutter); }
.edge-bl { bottom: 12px; left: var(--gutter); pointer-events: auto; }
.edge-bc { bottom: 12px; left: 50%; transform: translateX(-50%); font-size: 10px; color: var(--fg-4); }
.edge-br { bottom: 12px; right: var(--gutter); pointer-events: auto; }

/* Vertical side labels */
.edge-left-vert {
  position: fixed;
  left: 6px;
  top: 50%;
  z-index: 10;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--fg-4);
  writing-mode: vertical-rl;
  transform: translateY(-50%) rotate(180deg);
  pointer-events: none;
}

.edge-right-vert {
  position: fixed;
  right: 6px;
  top: 50%;
  z-index: 10;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--fg-4);
  writing-mode: vertical-rl;
  pointer-events: none;
}

/* ═══ CENTER INVITATION ═══ */

.invitation {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  font-family: var(--font-mono);
  font-size: 14px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--fg-3);
  pointer-events: none;
  transition: opacity 0.5s var(--ease);
}

.invitation.hidden { opacity: 0; }

/* ═══ LATEST PROJECT CARD (bottom-right) ═══ */

.latest-card {
  position: fixed;
  bottom: 32px;
  right: var(--gutter);
  z-index: 10;
  background: rgba(var(--bg-rgb), 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(var(--fg-rgb), 0.06);
  border-radius: 4px;
  padding: 12px 16px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--fg-3);
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: background 0.3s var(--ease);
}
.latest-card:hover { background: rgba(var(--fg-rgb), 0.08); }
.latest-card-label { font-size: 9px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--fg-4); }
.latest-card-name { font-size: 12px; font-weight: 500; color: var(--fg); letter-spacing: -0.01em; font-family: var(--font-body); }

/* ═══ ENTRANCE ═══ */

.entrance-zoom { transform-origin: center center; }
.edge-label, .sidebar, .invitation, .latest-card { opacity: 0; }
.marker { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  .edge-label, .sidebar, .invitation, .latest-card, .marker { opacity: 1; }
  .marker-dot { animation: none; }
}

/* ═══ DETAIL PAGES ═══ */

[data-page-scrollable] { overflow: auto; height: 100dvh; scrollbar-width: none; }
[data-page-scrollable]::-webkit-scrollbar { display: none; }
```

- [ ] **Step 2: Verify build**

Run: `npx next build`
Expected: passes (page.tsx will error until rewritten in Task 2, but CSS is standalone)

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "style: Cloud Sky design system — canvas, markers, tooltip, sidebar, edge labels"
```

---

## Chunk 2: Homepage Component

### Task 2: Rewrite page.tsx — the Cloud Sky

**Files:**
- Rewrite: `src/app/page.tsx`

This is the complete homepage. One file. It handles:
- The pannable canvas with drag + momentum
- Project markers at fixed coordinates
- Hover tooltip
- Sidebar navigation
- Edge labels
- Center invitation
- Latest project card
- Filter by category (via sidebar legend)
- Entrance animation
- Touch support

- [ ] **Step 1: Write the complete component**

```tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { PIECES } from "@/constants/pieces";
import { CONTACT_EMAIL, SOCIALS } from "@/constants/contact";

const pieces = [...PIECES].sort((a, b) => a.order - b.order);

const TAG_MAP: Record<string, string> = {
  brand: "BD", ecommerce: "BD", "3d": "BD",
  mobile: "PD", ai: "AI", product: "PD",
  "design-system": "PD", ui: "PD",
  texture: "CD", material: "CD", webgl: "CD", generative: "CD",
};
function getTag(tags: string[]): string {
  for (const t of tags) if (TAG_MAP[t]) return TAG_MAP[t];
  return "CD";
}

type Filter = "all" | "brand" | "product" | "lab";
function matchesFilter(p: (typeof pieces)[0], f: Filter): boolean {
  if (f === "all") return true;
  if (f === "lab") return p.type === "experiment";
  if (f === "brand") return p.tags.some((t) => ["brand", "ecommerce", "3d", "texture", "material"].includes(t));
  if (f === "product") return p.tags.some((t) => ["mobile", "ai", "product", "design-system", "ui", "webgl", "generative"].includes(t));
  return true;
}

// Marker positions on the canvas (percentage of canvas size)
const MARKER_POSITIONS: Record<string, { x: number; y: number }> = {
  gyeol: { x: 20, y: 30 },
  sift: { x: 55, y: 20 },
  conductor: { x: 35, y: 55 },
  "spring-grain": { x: 75, y: 35 },
  "rain-on-stone": { x: 60, y: 65 },
  "clouds-at-sea": { x: 25, y: 75 },
};

const STATEMENT_POS = { x: 45, y: 45 };

export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -75, y: -50 }); // vw/vh units
  const velRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [showInvite, setShowInvite] = useState(true);
  const [time, setTime] = useState("");

  const hoveredPiece = pieces.find((p) => p.slug === hoveredSlug);

  // Clock
  useEffect(() => {
    const fmt = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    fmt();
    const i = setInterval(fmt, 1000);
    return () => clearInterval(i);
  }, []);

  // Apply canvas position
  const applyTransform = useCallback(() => {
    if (!canvasRef.current) return;
    canvasRef.current.style.transform = `translate(${posRef.current.x}vw, ${posRef.current.y}vh)`;
  }, []);

  // Momentum loop
  useEffect(() => {
    const loop = () => {
      if (!draggingRef.current) {
        const vx = velRef.current.x;
        const vy = velRef.current.y;
        if (Math.abs(vx) > 0.01 || Math.abs(vy) > 0.01) {
          posRef.current.x += vx;
          posRef.current.y += vy;
          velRef.current.x *= 0.95;
          velRef.current.y *= 0.95;

          // Boundaries: clamp with rubber-band
          const minX = -150; // can't pan past left edge
          const maxX = 0;
          const minY = -100;
          const maxY = 0;
          if (posRef.current.x < minX) { posRef.current.x += (minX - posRef.current.x) * 0.2; velRef.current.x = 0; }
          if (posRef.current.x > maxX) { posRef.current.x += (maxX - posRef.current.x) * 0.2; velRef.current.x = 0; }
          if (posRef.current.y < minY) { posRef.current.y += (minY - posRef.current.y) * 0.2; velRef.current.y = 0; }
          if (posRef.current.y > maxY) { posRef.current.y += (maxY - posRef.current.y) * 0.2; velRef.current.y = 0; }

          applyTransform();
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [applyTransform]);

  // Drag handlers
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      draggingRef.current = true;
      document.body.classList.add("is-dragging");
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
      velRef.current = { x: 0, y: 0 };
    };
    const onMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!draggingRef.current) return;
      const dx = e.clientX - lastMouseRef.current.x;
      const dy = e.clientY - lastMouseRef.current.y;
      // Convert px to vw/vh
      const vwPx = window.innerWidth / 100;
      const vhPx = window.innerHeight / 100;
      posRef.current.x += dx / vwPx;
      posRef.current.y += dy / vhPx;
      velRef.current = { x: dx / vwPx, y: dy / vhPx };
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
      applyTransform();
      if (!hasDraggedRef.current) {
        hasDraggedRef.current = true;
        setShowInvite(false);
      }
    };
    const onUp = () => {
      draggingRef.current = false;
      document.body.classList.remove("is-dragging");
    };

    // Touch
    const onTouchStart = (e: TouchEvent) => {
      draggingRef.current = true;
      lastMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      velRef.current = { x: 0, y: 0 };
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!draggingRef.current) return;
      const dx = e.touches[0].clientX - lastMouseRef.current.x;
      const dy = e.touches[0].clientY - lastMouseRef.current.y;
      const vwPx = window.innerWidth / 100;
      const vhPx = window.innerHeight / 100;
      posRef.current.x += dx / vwPx;
      posRef.current.y += dy / vhPx;
      velRef.current = { x: dx / vwPx, y: dy / vhPx };
      lastMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      applyTransform();
      if (!hasDraggedRef.current) { hasDraggedRef.current = true; setShowInvite(false); }
    };
    const onTouchEnd = () => { draggingRef.current = false; };

    window.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [applyTransform]);

  // Entrance animation
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".edge-label, .sidebar, .invitation, .latest-card, .marker").forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
      });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Zoom out
    if (canvasRef.current) {
      gsap.set(canvasRef.current, { scale: 1.2 });
      tl.to(canvasRef.current, { scale: 1, duration: 1.2 }, 0);
    }

    // Edge labels
    tl.to(".edge-label", { opacity: 1, duration: 0.5, stagger: 0.05 }, 0.4);

    // Sidebar
    tl.to(".sidebar", { opacity: 1, x: 0, duration: 0.5 }, 0.6);

    // Markers
    tl.to(".marker", { opacity: 1, duration: 0.4, stagger: 0.1 }, 0.8);

    // Invitation
    tl.to(".invitation", { opacity: 1, duration: 0.4 }, 1.2);

    // Latest card
    tl.to(".latest-card", { opacity: 1, duration: 0.4 }, 1.0);
  }, []);

  const filters: { label: string; value: Filter }[] = [
    { label: "All", value: "all" },
    { label: "Brand", value: "brand" },
    { label: "Product", value: "product" },
    { label: "Lab", value: "lab" },
  ];

  return (
    <>
      {/* ═══ PANNABLE CANVAS ═══ */}
      <div
        ref={canvasRef}
        className={`sky-canvas entrance-zoom${hoveredSlug ? " has-hover" : ""}`}
        id="main"
      >
        {/* Project markers */}
        {pieces.map((piece) => {
          const pos = MARKER_POSITIONS[piece.slug];
          if (!pos) return null;
          const globalIdx = pieces.indexOf(piece);
          const href = piece.type === "project" ? `/work/${piece.slug}` : `/lab/${piece.slug}`;
          const visible = matchesFilter(piece, activeFilter);

          return (
            <Link
              key={piece.slug}
              href={href}
              className="marker"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                opacity: visible ? undefined : 0.08,
                animationDelay: `${globalIdx * 0.4}s`,
              }}
              onMouseEnter={(e) => { e.stopPropagation(); setHoveredSlug(piece.slug); }}
              onMouseLeave={() => setHoveredSlug(null)}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="marker-dot" />
              <span className="marker-label">
                {String(globalIdx + 1).padStart(2, "0")} {piece.title}
              </span>
            </Link>
          );
        })}

        {/* Statement marker */}
        <div
          className="marker marker--statement"
          style={{ left: `${STATEMENT_POS.x}%`, top: `${STATEMENT_POS.y}%` }}
        >
          <span className="marker-label">
            Build with intention.<br />
            Make things that feel right.
          </span>
        </div>
      </div>

      {/* ═══ HOVER TOOLTIP ═══ */}
      {hoveredPiece && (
        <div
          className="tooltip"
          style={{
            left: Math.min(mousePos.x + 16, (typeof window !== "undefined" ? window.innerWidth : 1440) - 400),
            top: Math.min(mousePos.y - 70, (typeof window !== "undefined" ? window.innerHeight : 900) - 170),
          }}
        >
          <div className="tooltip-image">
            {hoveredPiece.image ? (
              <Image
                src={hoveredPiece.image}
                alt={hoveredPiece.title}
                width={340}
                height={200}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div className="tooltip-color" style={{ backgroundColor: hoveredPiece.cover.bg }} />
            )}
          </div>
          <div className="tooltip-text">
            <span className="tooltip-num">{String(pieces.indexOf(hoveredPiece) + 1).padStart(2, "0")}</span>
            <span className="tooltip-desc">{hoveredPiece.description}</span>
            <span className="tooltip-name">{hoveredPiece.title}</span>
            <div className="tooltip-meta">
              <span>{hoveredPiece.year}</span>
              <span>{getTag(hoveredPiece.tags)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ═══ SIDEBAR NAV ═══ */}
      <nav className="sidebar">
        <Link href="/">Map</Link>
        <Link href="/about">About</Link>
        <a href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
        {SOCIALS.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
        ))}

        <div className="sidebar-legend">
          {filters.map((f) => (
            <div
              key={f.value}
              className={`sidebar-legend-item${activeFilter === f.value ? " active" : ""}`}
              onClick={() => setActiveFilter(f.value)}
            >
              <span className="sidebar-legend-dot" />
              {f.label}
            </div>
          ))}
        </div>
      </nav>

      {/* ═══ EDGE LABELS ═══ */}
      <span className="edge-label edge-tl">HKJ</span>
      <span className="edge-label edge-tc">{time}</span>
      <span className="edge-label edge-tr">Est. 2025</span>
      <span className="edge-label edge-bl">Design & development</span>
      <span className="edge-label edge-bc">Brands, products, concepts</span>

      <span className="edge-left-vert">DESIGN & DEVELOPMENT</span>
      <span className="edge-right-vert">CRAFTED AND HAND-CODED</span>

      {/* ═══ CENTER INVITATION ═══ */}
      <div className={`invitation${!showInvite ? " hidden" : ""}`}>
        Drag to explore
      </div>

      {/* ═══ LATEST PROJECT CARD ═══ */}
      <Link href={`/work/${pieces[0].slug}`} className="latest-card">
        <span className="latest-card-label">Latest project</span>
        <span className="latest-card-name">{pieces[0].title}</span>
        <span>{pieces[0].year}</span>
      </Link>
    </>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx next build`
Expected: passes with zero errors

- [ ] **Step 3: Start dev server and verify**

Run: `npx next dev --port 3847`
Verify:
- Dark gradient sky visible, fills beyond viewport
- Drag pans the canvas, momentum on release
- Markers visible at their coordinates with pulsing dots
- Hover shows dark tooltip with project info
- Click navigates to detail page
- Sidebar nav on left with links + legend filters
- Edge labels at all corners + vertical side text
- "DRAG TO EXPLORE" centered, fades on first drag
- Latest project card bottom-right
- Entrance animation: zoom out, staggered reveals
- Touch drag works on mobile

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/app/globals.css
git commit -m "feat: Cloud Sky homepage — pannable canvas with pinned project markers

San Rita-style interactive sky canvas:
- Drag-to-pan with momentum and boundary clamping
- Project markers at hand-picked coordinates with pulse animation
- Dark frosted glass hover tooltip with project image/info
- Sidebar navigation with category filter legend
- Edge labels (mark, clock, est., disciplines, vertical text)
- Latest project card (bottom-right)
- 'Drag to explore' center invitation, dismissed on first drag
- GSAP entrance choreography (zoom out, staggered reveals)
- Touch support for mobile
- prefers-reduced-motion respected

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Verification Checklist

After all tasks complete:

1. `npx next build` passes
2. Canvas fills beyond viewport with dark gradient placeholder
3. Drag pans smoothly in all directions
4. Momentum carries after release, decays with friction
5. Can't pan past boundaries (rubber-band effect)
6. 6 project markers visible with pulsing dots
7. Statement text visible at center of canvas
8. Hover marker → tooltip appears with image + info
9. Click marker → navigates to /work/[slug] or /lab/[slug]
10. "DRAG TO EXPLORE" appears on load, fades after first drag
11. Edge labels at all corners: HKJ, clock, Est. 2025, disciplines
12. Vertical text on left and right edges
13. Sidebar nav: Map, About, Contact, LinkedIn, GitHub
14. Legend filters: All, Brand, Product, Lab — clicking dims non-matching markers
15. Latest project card bottom-right with link
16. Entrance: canvas zooms from 1.2→1, elements stagger in
17. Touch drag works on mobile
18. `prefers-reduced-motion`: all visible immediately
19. Detail pages still work (/work/gyeol, /lab/spring-grain, etc.)
20. About page still works
