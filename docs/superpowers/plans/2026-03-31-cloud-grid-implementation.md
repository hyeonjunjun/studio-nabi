# Cloud Grid Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the HKJ homepage as a JSP-style multi-column frosted-glass card grid on a cloud-themed background with hover image cycling, category filters, and staggered entrance animations.

**Architecture:** Single-page grid layout. Fixed top bar and bottom filter bar frame a CSS Grid of glassmorphic project cards. Background is a placeholder gradient (cloud photo added later). Cards show project metadata; hover triggers image cycling. Filters narrow visible cards. GSAP handles entrance stagger. All interactions via CSS transitions + minimal React state.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind v4, GSAP (ScrollTrigger not needed — single viewport), CSS `backdrop-filter`, Next.js `<Image>`.

**Spec:** `docs/superpowers/specs/2026-03-31-cloud-grid-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/app/globals.css` | **Rewrite** | Design tokens, card styles, grid layout, bars, animations |
| `src/app/page.tsx` | **Rewrite** | Cloud Grid homepage — grid, cards, filters, hover logic |
| `src/app/layout.tsx` | **Keep** | No changes — fonts, metadata, dark mode script all correct |
| `src/constants/pieces.ts` | **Keep** | Project data — no changes |
| `src/constants/contact.ts` | **Keep** | Social links + email — no changes |
| `src/app/work/[slug]/page.tsx` | **Keep** | Detail pages stay as-is |
| `src/app/lab/[slug]/page.tsx` | **Keep** | Detail pages stay as-is |
| `src/app/work/page.tsx` | **Keep** | Already redirects to `/` |
| `src/app/lab/page.tsx` | **Keep** | Already redirects to `/` |
| `src/components/ClockDisplay.tsx` | **Delete** | Not used in this design |
| `src/components/GlobalNav.tsx` | **Delete** | Not used |
| `src/components/ApproachSection.tsx` | **Delete** | Not used |

---

## Chunk 1: Foundation — CSS + Layout

### Task 1: Rewrite globals.css

**Files:**
- Rewrite: `src/app/globals.css`

- [ ] **Step 1: Write the complete stylesheet**

Replace the entire file with the Cloud Grid design tokens and styles. This is the foundation everything builds on.

```css
@import "tailwindcss";

:root {
  --bg: #ffffff;
  --bg-rgb: 255, 255, 255;
  --fg: #1a1917;
  --fg-rgb: 26, 25, 23;
  --fg-2: rgba(26, 25, 23, 0.55);
  --fg-3: rgba(26, 25, 23, 0.28);
  --fg-4: rgba(26, 25, 23, 0.10);
  --fg-5: rgba(26, 25, 23, 0.04);

  --font-body: var(--font-sans), system-ui, sans-serif;
  --font-mono: var(--font-fragment), "SF Mono", monospace;

  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  --gutter: clamp(12px, 2vw, 24px);

  --card-bg: rgba(255, 255, 255, 0.6);
  --card-bg-hover: rgba(255, 255, 255, 0.78);
  --card-blur: 12px;
  --card-border: rgba(26, 25, 23, 0.06);
  --card-radius: 4px;
}

html.dark {
  --bg: #0c0b09;
  --bg-rgb: 12, 11, 9;
  --fg: #e8e4dc;
  --fg-rgb: 232, 228, 220;
  --fg-2: rgba(232, 228, 220, 0.55);
  --fg-3: rgba(232, 228, 220, 0.28);
  --fg-4: rgba(232, 228, 220, 0.10);
  --fg-5: rgba(232, 228, 220, 0.04);

  --card-bg: rgba(12, 11, 9, 0.6);
  --card-bg-hover: rgba(12, 11, 9, 0.78);
  --card-border: rgba(232, 228, 220, 0.06);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-text-size-adjust: 100%; }
*::-webkit-scrollbar { display: none; }
* { scrollbar-width: none; }

body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
  height: 100dvh;
}

::selection { background: rgba(var(--fg-rgb), 0.08); }
:focus-visible { outline: 1px solid var(--fg-3); outline-offset: 3px; }

.skip-to-content {
  position: absolute; top: -100px; left: var(--gutter);
  z-index: 999; padding: 8px 16px;
  background: var(--fg); color: var(--bg);
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.04em;
  text-decoration: none; transition: top 200ms var(--ease);
}
.skip-to-content:focus { top: 8px; }

/* ── Cloud Background ── */

.cloud-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: linear-gradient(180deg, #e0ddd8 0%, #d5d0c9 40%, #c8c3bb 100%);
  animation: drift 90s ease-in-out infinite alternate;
}

@keyframes drift {
  from { background-position: 0% 0%; }
  to { background-position: 100% 100%; }
}

html.dark .cloud-bg {
  background: linear-gradient(180deg, #1a1816 0%, #141210 40%, #0c0b09 100%);
}

/* ── Top Bar ── */

.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px var(--gutter);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.02em;
}

.top-bar-mark { color: var(--fg); font-weight: 500; }
.top-bar-live { color: var(--fg-3); }

.top-bar-nav {
  display: flex;
  gap: clamp(12px, 2vw, 24px);
}

.top-bar-nav a {
  color: var(--fg-3);
  text-decoration: none;
  transition: color 0.3s var(--ease);
}
.top-bar-nav a:hover { color: var(--fg); }

/* ── Bottom Bar ── */

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px var(--gutter);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.02em;
}

.bottom-bar-filters {
  display: flex;
  gap: clamp(10px, 2vw, 20px);
}

.filter-btn {
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
  letter-spacing: inherit;
  color: var(--fg-3);
  padding: 0;
  transition: color 0.3s var(--ease);
}
.filter-btn:hover { color: var(--fg-2); }
.filter-btn.active { color: var(--fg); }

.bottom-bar-info { color: var(--fg-3); }

/* ── Card Grid ── */

.card-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: clamp(6px, 1vw, 12px);
  padding: 52px var(--gutter) 48px;
  min-height: 100dvh;
  align-content: start;
}

@media (max-width: 1200px) { .card-grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 900px) { .card-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 600px) { .card-grid { grid-template-columns: repeat(2, 1fr); } }

/* ── Card ── */

.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: var(--card-bg);
  backdrop-filter: blur(var(--card-blur));
  -webkit-backdrop-filter: blur(var(--card-blur));
  border: 1px solid var(--card-border);
  border-radius: var(--card-radius);
  padding: clamp(12px, 1.5vw, 20px);
  text-decoration: none;
  color: var(--fg);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: background 0.3s var(--ease), opacity 0.3s var(--ease);
  aspect-ratio: 1;
}

.card:hover {
  background: var(--card-bg-hover);
}

/* Dim non-hovered cards */
.card-grid:hover .card { opacity: 0.5; }
.card-grid:hover .card:hover { opacity: 1; }

/* Card text elements */
.card-head {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--fg-3);
  letter-spacing: 0.02em;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 4px;
}

.card-desc {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--fg-2);
  line-height: 1.4;
}

.card-name {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  color: var(--fg);
  letter-spacing: 0.01em;
}

.card-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--fg-3);
  letter-spacing: 0.02em;
  margin-top: 8px;
}

/* ── Card hover image ── */

.card-image-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.4s var(--ease);
  border-radius: var(--card-radius);
  overflow: hidden;
}

.card-image-layer.visible { opacity: 1; }

.card-image-layer img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%);
  z-index: 2;
}

.card-image-text {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: clamp(12px, 1.5vw, 20px);
  z-index: 3;
  color: #ffffff;
}

.card-image-text .card-name { color: #ffffff; }
.card-image-text .card-foot { color: rgba(255,255,255,0.6); }

/* ── Statement Card ── */

.card--statement {
  grid-column: span 2;
}

.card--statement .statement-headline {
  font-family: var(--font-body);
  font-size: clamp(16px, 2vw, 24px);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--fg);
}

.card--statement .statement-sub {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--fg-3);
  letter-spacing: 0.02em;
  margin-top: 8px;
}

/* ── Mark Card ── */

.card--mark {
  grid-column: span 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.mark-logo {
  font-family: var(--font-mono);
  font-size: clamp(24px, 3vw, 40px);
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--fg);
}

.mark-sub {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--fg-3);
  letter-spacing: 0.03em;
  margin-top: 8px;
}

/* ── Entrance ── */

.card-enter {
  opacity: 0;
  transform: translateY(12px);
}

/* ── Reduced Motion ── */

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  .card-enter { opacity: 1; transform: none; }
  .cloud-bg { animation: none; }
}

/* ── Detail Pages ── */

[data-page-scrollable] {
  overflow: auto;
  height: 100dvh;
  scrollbar-width: none;
}
[data-page-scrollable]::-webkit-scrollbar { display: none; }
```

- [ ] **Step 2: Verify the build**

Run: `npx next build`
Expected: passes with no errors

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "style: Cloud Grid design tokens and layout system"
```

---

## Chunk 2: Homepage — Page Component

### Task 2: Rewrite page.tsx

**Files:**
- Rewrite: `src/app/page.tsx`

- [ ] **Step 1: Write the complete homepage component**

```tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { PIECES } from "@/constants/pieces";
import { CONTACT_EMAIL, SOCIALS } from "@/constants/contact";

const pieces = [...PIECES].sort((a, b) => a.order - b.order);

type Filter = "all" | "brand" | "product" | "lab";

function matchesFilter(piece: (typeof pieces)[0], filter: Filter): boolean {
  if (filter === "all") return true;
  if (filter === "lab") return piece.type === "experiment";
  if (filter === "brand")
    return piece.tags.some((t) => ["brand", "ecommerce", "3d", "texture", "material"].includes(t));
  if (filter === "product")
    return piece.tags.some((t) => ["mobile", "ai", "product", "design-system", "ui", "webgl", "generative"].includes(t));
  return true;
}

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

// Grid items: projects + statement card + mark card
type GridItem =
  | { kind: "project"; piece: (typeof pieces)[0]; globalIndex: number }
  | { kind: "statement" }
  | { kind: "mark" };

function buildGrid(filtered: typeof pieces): GridItem[] {
  const items: GridItem[] = [];

  filtered.forEach((piece, i) => {
    const globalIndex = pieces.indexOf(piece);
    items.push({ kind: "project", piece, globalIndex });

    // Insert statement card after 3rd project
    if (i === 2) items.push({ kind: "statement" });
  });

  // Mark card at the end
  items.push({ kind: "mark" });

  return items;
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [hoverImageIdx, setHoverImageIdx] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = pieces.filter((p) => matchesFilter(p, activeFilter));
  const gridItems = buildGrid(filtered);

  const filters: { label: string; value: Filter }[] = [
    { label: "All", value: "all" },
    { label: "Product", value: "product" },
    { label: "Brand", value: "brand" },
    { label: "Lab", value: "lab" },
  ];

  // Hover image cycling
  useEffect(() => {
    if (!hoveredSlug) return;
    setHoverImageIdx(0);
    const interval = setInterval(() => {
      setHoverImageIdx((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, [hoveredSlug]);

  // Entrance animation
  useEffect(() => {
    if (!gridRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gridRef.current.querySelectorAll(".card-enter").forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
        (el as HTMLElement).style.transform = "none";
      });
      return;
    }

    const cards = gridRef.current.querySelectorAll(".card-enter");
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.06,
      ease: "power4.out",
      delay: 0.1,
    });
  }, [activeFilter]);

  // Current time for top bar
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true }));
    };
    fmt();
    const i = setInterval(fmt, 60_000);
    return () => clearInterval(i);
  }, []);

  return (
    <>
      {/* Cloud background */}
      <div className="cloud-bg" />

      {/* Top bar */}
      <header className="top-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(16px, 3vw, 32px)" }}>
          <span className="top-bar-mark">HKJ</span>
          <span className="top-bar-live">{time ? `New York · ${time}` : ""}</span>
        </div>
        <nav className="top-bar-nav">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
          ))}
          <a href={`mailto:${CONTACT_EMAIL}`}>Connect</a>
          <Link href="/about">About</Link>
        </nav>
      </header>

      {/* Card grid */}
      <div className="card-grid" ref={gridRef} id="main">
        {gridItems.map((item, i) => {
          if (item.kind === "statement") {
            return (
              <div key="statement" className="card card--statement card-enter">
                <div />
                <div>
                  <div className="statement-headline">
                    Build with intention<br />
                    Make things that feel right
                  </div>
                  <div className="statement-sub">
                    Curated works at the intersection of design, engineering, and craft.
                  </div>
                </div>
                <div />
              </div>
            );
          }

          if (item.kind === "mark") {
            return (
              <div key="mark" className="card card--mark card-enter">
                <div />
                <div>
                  <div className="mark-logo">HKJ</div>
                  <div className="mark-sub">HKJ Studio — Est. 2025</div>
                </div>
                <div />
              </div>
            );
          }

          const { piece, globalIndex } = item;
          const tag = getTag(piece.tags);
          const href = piece.type === "project" ? `/work/${piece.slug}` : `/lab/${piece.slug}`;
          const isHovered = hoveredSlug === piece.slug;
          const images = piece.image ? [piece.image] : [];
          const currentImage = images.length > 0 ? images[hoverImageIdx % images.length] : null;

          return (
            <Link
              key={piece.slug}
              href={href}
              className="card card-enter"
              onMouseEnter={() => setHoveredSlug(piece.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
            >
              {/* Hover image layer */}
              {currentImage && (
                <div className={`card-image-layer${isHovered ? " visible" : ""}`}>
                  <Image
                    src={currentImage}
                    alt={piece.title}
                    fill
                    sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, 17vw"
                  />
                  <div className="card-image-overlay" />
                  <div className="card-image-text">
                    <div className="card-name">{piece.title}</div>
                    <div className="card-foot">
                      <span>{piece.year}</span>
                      <span>{piece.status === "wip" ? "WIP" : "—"}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Default text content */}
              <div className="card-head">
                <span>{String(globalIndex + 1).padStart(2, "0")}</span>
                <span>{tag}</span>
              </div>
              <div className="card-body">
                <div className="card-desc">{piece.description}</div>
                <div className="card-name">{piece.title}</div>
              </div>
              <div className="card-foot">
                <span>{piece.year}</span>
                <span>{piece.status === "wip" ? "WIP" : "—"}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom bar */}
      <footer className="bottom-bar">
        <div className="bottom-bar-filters">
          {filters.map((f) => (
            <button
              key={f.value}
              className={`filter-btn${activeFilter === f.value ? " active" : ""}`}
              onClick={() => setActiveFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className="bottom-bar-info">
          Design engineer — brands, products, concepts
        </span>
      </footer>
    </>
  );
}
```

- [ ] **Step 2: Verify the build**

Run: `npx next build`
Expected: passes with no errors

- [ ] **Step 3: Start dev server and verify visually**

Run: `npx next dev --port 3847`
Verify:
- Grid of frosted glass cards on gradient background
- 6 project cards + 1 statement card + 1 mark card
- Hover dims non-hovered cards, brightens hovered
- Hover on project with image shows image overlay
- Filters narrow the grid
- Top bar shows HKJ + time + links
- Bottom bar shows filters + bio

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: Cloud Grid homepage — card grid with filters and hover cycling"
```

---

## Chunk 3: Cleanup

### Task 3: Delete unused components

**Files:**
- Delete: `src/components/ClockDisplay.tsx`
- Delete: `src/components/GlobalNav.tsx`
- Delete: `src/components/ApproachSection.tsx`

- [ ] **Step 1: Remove files**

```bash
rm src/components/ClockDisplay.tsx src/components/GlobalNav.tsx src/components/ApproachSection.tsx
```

- [ ] **Step 2: Verify no broken imports**

Run: `npx next build`
Expected: passes — none of these components are imported by remaining pages

- [ ] **Step 3: Commit**

```bash
git add -u
git commit -m "chore: remove unused components (ClockDisplay, GlobalNav, ApproachSection)"
```

---

## Verification Checklist

After all tasks:

1. `npx next build` passes
2. Grid fills the viewport with frosted glass cards
3. Gradient background visible behind semi-transparent cards
4. Hover dims non-hovered cards to 0.5 opacity
5. Hover on project with image shows image covering the card with gradient overlay
6. Filter buttons narrow visible cards
7. Cards stagger-fade on page load (GSAP)
8. Statement card spans 2 columns with headline text
9. Mark card spans 2 columns with HKJ logo
10. Top bar: HKJ + time + nav links
11. Bottom bar: filters + bio text
12. Mobile: 2-column grid
13. Dark mode: inverted tokens
14. Scrollbar hidden
15. `prefers-reduced-motion`: no animations
16. Detail pages (`/work/[slug]`, `/lab/[slug]`) still work
17. About page still works
