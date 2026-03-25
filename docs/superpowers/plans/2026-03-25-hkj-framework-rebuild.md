# HKJ Framework Rebuild Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio from the HKJ Framework — warm paper, ink-on-paper tokens, text-list homepage with hover-activated covers, FLIP transitions, blur-reveal animations. Strip all Evening/dark-mode components.

**Architecture:** Single-pass rebuild. Strip the Evening components (WallLight, Vinyl, KineticText, Cursor, TimeModeProvider, time-mode CSS), restore the clean ink-on-paper base, then build the new homepage layout (text-list with hover covers). Keep working components (FLIP transitions, DissolveImage, blur-reveal presets, NYC Clock, Preloader).

**Tech Stack:** Next.js 16 (App Router), GSAP 3.14 + ScrollTrigger + Flip, Lenis, Tailwind v4, Zustand

**Framework:** `HKJ-FRAMEWORK.md` (source of truth)

---

## File Structure

### Delete
```
src/components/WallLight.tsx          — shader replaced by flat paper
src/components/WallLightWrapper.tsx   — wrapper no longer needed
src/components/Vinyl.tsx              — too playful for studio site
src/components/KineticText.tsx        — static text with mask reveal instead
src/components/Cursor.tsx             — default cursor is fine
src/components/CursorWrapper.tsx      — wrapper no longer needed
src/components/TimeModeProvider.tsx   — no time-of-day shifting
src/components/NowPlaying.tsx         — optional, remove if clutters nav
src/constants/now-playing.ts          — data for removed NowPlaying
src/lib/timemode.ts                   — time mode logic no longer needed
```

### Major Rewrites
```
src/app/globals.css         — Remove time-mode overrides, cursor CSS, restore flat paper body bg
src/app/layout.tsx          — Remove WallLight, Cursor, TimeModeProvider wrappers
src/app/page.tsx            — New text-list homepage with hover-activated covers
src/components/GlobalNav.tsx — Remove NowPlaying, keep clock, tighten spacing
src/components/Preloader.tsx — Simplified: no dark overlay, just content blur-reveal
src/lib/store.ts            — Remove vinylSpeed, scrollProgress; keep loaded, transitioning, mobileMenuOpen
```

### Keep As-Is
```
src/components/Cover.tsx              — Refactor: becomes the hover-reveal cover
src/components/DissolveImage.tsx      — Fits ink-on-paper metaphor
src/components/Footer.tsx             — Minor polish only
src/components/GrainTexture.tsx       — Material quality for color-field covers
src/components/MobileMenu.tsx         — Works, minor styling update
src/components/NYCClock.tsx           — Personal, stays in nav
src/components/PageTransition.tsx     — Keep hook + overlay
src/components/TransitionLink.tsx     — Keep FLIP-aware navigation
src/components/TransitionManager.tsx  — Keep FLIP logic
src/components/RouteAnnouncer.tsx     — Accessibility
src/components/SmoothScroll.tsx       — Remove scrollProgress dispatch
src/lib/animations.ts                — Already correct
src/lib/gsap.ts                      — Already correct
src/constants/projects.ts            — Already correct
src/constants/case-studies.ts        — Already correct
src/constants/explorations.ts        — Already correct
src/constants/journal.ts             — Already correct
src/constants/navigation.ts          — Already correct
src/constants/contact.ts             — Already correct
src/constants/now.ts                 — Keep for Now section
```

### Create
```
src/components/ProjectList.tsx        — Text-list with hover-activated cover reveals
src/components/SubstrateReveal.tsx    — Monospace character overlay for FLIP transitions
```

---

## Chunk 1: Strip Evening Components

### Task 1: Delete Evening-specific files

**Files:**
- Delete: `src/components/WallLight.tsx`
- Delete: `src/components/WallLightWrapper.tsx`
- Delete: `src/components/Vinyl.tsx`
- Delete: `src/components/KineticText.tsx`
- Delete: `src/components/Cursor.tsx`
- Delete: `src/components/CursorWrapper.tsx`
- Delete: `src/components/TimeModeProvider.tsx`
- Delete: `src/components/NowPlaying.tsx`
- Delete: `src/constants/now-playing.ts`
- Delete: `src/lib/timemode.ts`

- [ ] **Step 1: Delete all files**

```bash
rm -f src/components/WallLight.tsx src/components/WallLightWrapper.tsx \
      src/components/Vinyl.tsx src/components/KineticText.tsx \
      src/components/Cursor.tsx src/components/CursorWrapper.tsx \
      src/components/TimeModeProvider.tsx src/components/NowPlaying.tsx \
      src/constants/now-playing.ts src/lib/timemode.ts
```

- [ ] **Step 2: Commit deletion**

```bash
git add -A
git commit -m "strip: remove Evening components — WallLight, Vinyl, KineticText, Cursor, TimeModeProvider, NowPlaying, timemode"
```

### Task 2: Clean globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Read the current globals.css**

- [ ] **Step 2: Remove time-mode CSS overrides**

Delete the entire `:root[data-timemode="dusk"]` and `:root[data-timemode="night"]` blocks. Delete the `:root, :root[data-timemode="day"]` block (the day defaults are already in the main `:root`).

- [ ] **Step 3: Remove cursor CSS**

Delete all `.cursor-dot` rules, `html[data-cursor-active]` rules.

- [ ] **Step 4: Restore body background**

Change `body { background-color: var(--bg); }` to `body { background-color: var(--paper); }`. Remove `--bg` and `--bg-rgb` from `:root` if they exist (use `--paper` directly).

Remove the `transition: background-color 2s ease, color 2s ease` from body — no more time transitions.

- [ ] **Step 5: Remove time-mode slow transitions block**

Delete the block that applies `transition: color 2s ease, background-color 2s ease` to `body, .page-container, [data-cover], .font-mono, .font-display`.

- [ ] **Step 6: Keep everything else**

Keep: link hover underlines (`[data-link]`), card hover glow, press states, clock night glow (remove the night-glow rule since no night mode), eq-bar keyframes, mask-line CSS, focus styles, skip-to-content, all layout utilities, all spacing tokens.

- [ ] **Step 7: Build and commit**

```bash
npm run build 2>&1 | grep -c "Compiled successfully"
git add src/app/globals.css
git commit -m "strip: remove time-mode CSS, cursor CSS, restore flat paper background"
```

### Task 3: Clean layout.tsx

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Read current layout.tsx**

- [ ] **Step 2: Remove imports and components**

Remove imports for: `WallLightWrapper`, `CursorWrapper`, `TimeModeProvider`, `PreloaderWrapper` (if the preloader needs rework — but keep PreloaderWrapper for now and update Preloader in a later task).

Actually keep `PreloaderWrapper` and `TransitionManagerWrapper` — those still work.

Remove from JSX: `<WallLightWrapper />`, `<CursorWrapper />`. Remove the `<TimeModeProvider>` wrapper (but keep its children — just unwrap them).

- [ ] **Step 3: Remove z-index from main**

The `<main>` had `style={{ position: "relative", zIndex: 1 }}` to sit above WallLight. Remove the zIndex since WallLight is gone. Keep `position: relative` if needed.

- [ ] **Step 4: Build and commit**

```bash
npm run build 2>&1 | grep -c "Compiled successfully"
git add src/app/layout.tsx
git commit -m "strip: remove WallLight, Cursor, TimeModeProvider from layout"
```

### Task 4: Clean store.ts and SmoothScroll.tsx

**Files:**
- Modify: `src/lib/store.ts`
- Modify: `src/components/SmoothScroll.tsx`

- [ ] **Step 1: Remove vinylSpeed and scrollProgress from store**

Keep only: `mobileMenuOpen`, `setMobileMenuOpen`, `loaded`, `setLoaded`, `transitioning`, `setTransitioning`.

- [ ] **Step 2: Remove scrollProgress dispatch from SmoothScroll**

Remove the scroll event handler that was calling `setScrollProgress()`. Keep the Lenis + GSAP ticker sync.

- [ ] **Step 3: Build and commit**

```bash
npm run build 2>&1 | grep -c "Compiled successfully"
git add src/lib/store.ts src/components/SmoothScroll.tsx
git commit -m "strip: clean store and SmoothScroll — remove scrollProgress, vinylSpeed"
```

---

## Chunk 2: New Homepage — Text List with Hover Covers

### Task 5: Build ProjectList component

**Files:**
- Create: `src/components/ProjectList.tsx`

- [ ] **Step 1: Create the component**

A text list of projects. Each row shows: number + title + metadata. On hover (desktop), the project's cover image materializes below the row using DissolveImage.

```tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { REVEAL_CARD } from "@/lib/animations";
import TransitionLink from "@/components/TransitionLink";
import type { Project } from "@/constants/projects";

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rows = listRef.current.querySelectorAll("[data-project-row]");
    gsap.fromTo(rows, REVEAL_CARD.from, { ...REVEAL_CARD.to });
  }, []);

  return (
    <div ref={listRef}>
      {projects.map((project, i) => (
        <ProjectRow
          key={project.id}
          project={project}
          index={i}
          isHovered={hoveredId === project.id}
          isDimmed={hoveredId !== null && hoveredId !== project.id}
          onHover={() => setHoveredId(project.id)}
          onLeave={() => setHoveredId(null)}
        />
      ))}
    </div>
  );
}

function ProjectRow({
  project, index, isHovered, isDimmed, onHover, onLeave
}: {
  project: Project;
  index: number;
  isHovered: boolean;
  isDimmed: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <TransitionLink
      href={`/work/${project.slug}`}
      flipId={project.coverImage ? `project-${project.id}` : undefined}
      data-project-row
      data-link
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        display: "block",
        textDecoration: "none",
        paddingTop: "clamp(24px, 3vh, 36px)",
        paddingBottom: "clamp(24px, 3vh, 36px)",
        borderBottom: "1px solid rgba(var(--ink-rgb), 0.06)",
        opacity: isDimmed ? 0.3 : 1,
        filter: isDimmed ? "blur(1px)" : "none",
        transition: "opacity 0.3s cubic-bezier(.23,.88,.26,.92), filter 0.3s cubic-bezier(.23,.88,.26,.92)",
        visibility: "hidden", /* GSAP autoAlpha handles this */
      }}
    >
      {/* Row: number + title + metadata */}
      <div style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: "var(--space-standard)",
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-standard)" }}>
          <span
            className="font-mono"
            style={{
              fontSize: "var(--text-meta)",
              letterSpacing: "var(--tracking-label)",
              color: "var(--ink-ghost)",
            }}
          >
            {number}
          </span>
          <span
            className="font-display"
            style={{
              fontSize: "clamp(18px, 2.5vw, 24px)",
              fontStyle: "italic",
              color: "var(--ink-primary)",
            }}
          >
            {project.title}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-compact)" }}>
          <span
            className="font-mono"
            style={{
              fontSize: "var(--text-meta)",
              letterSpacing: "var(--tracking-label)",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
            }}
          >
            {project.sector}
          </span>
          <span className="font-mono" style={{ fontSize: "var(--text-meta)", color: "var(--ink-ghost)" }}>·</span>
          <span
            className="font-mono"
            style={{
              fontSize: "var(--text-meta)",
              letterSpacing: "var(--tracking-label)",
              color: "var(--ink-muted)",
            }}
          >
            {project.year}
          </span>
          {project.status === "wip" && (
            <>
              <span className="font-mono" style={{ fontSize: "var(--text-meta)", color: "var(--ink-ghost)" }}>·</span>
              <span className="font-mono" style={{ fontSize: "var(--text-meta)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--ink-muted)" }}>
                In progress
              </span>
            </>
          )}
        </div>
      </div>

      {/* Cover image — reveals on hover */}
      {project.coverImage && (
        <div
          style={{
            maxHeight: isHovered ? "500px" : "0",
            opacity: isHovered ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 0.5s cubic-bezier(.23,.88,.26,.92), opacity 0.4s cubic-bezier(.23,.88,.26,.92)",
            marginTop: isHovered ? "var(--space-comfortable)" : "0",
          }}
        >
          <div
            data-cover-image
            style={{
              position: "relative",
              aspectRatio: "16 / 9",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 900px"
              style={{ objectFit: "cover" }}
              placeholder={project.coverBlur ? "blur" : undefined}
              blurDataURL={project.coverBlur}
            />
          </div>
        </div>
      )}
    </TransitionLink>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProjectList.tsx
git commit -m "feat: ProjectList — text rows with hover-activated cover reveals"
```

### Task 6: Rewrite homepage

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Complete rewrite of page.tsx**

The homepage becomes:
1. Hero: philosophy statement (static, mask-line or blur reveal) + status line
2. Work: ProjectList component with all projects
3. Exploration teaser
4. Now section
5. (Footer is in layout.tsx)

```tsx
"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { REVEAL_HERO, REVEAL_CONTENT } from "@/lib/animations";
import { PROJECTS } from "@/constants/projects";
import { NOW_TEXT } from "@/constants/now";
import { useStudioStore } from "@/lib/store";
import TransitionLink from "@/components/TransitionLink";
import ProjectList from "@/components/ProjectList";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const loaded = useStudioStore((s) => s.loaded);

  useEffect(() => {
    if (!loaded) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (heroRef.current) {
      const els = heroRef.current.querySelectorAll("[data-hero-el]");
      gsap.fromTo(els, REVEAL_HERO.from, { ...REVEAL_HERO.to, delay: 0.2 });
    }

    if (sectionsRef.current) {
      const sections = sectionsRef.current.querySelectorAll("[data-reveal]");
      sections.forEach((section) => {
        gsap.fromTo(section, REVEAL_CONTENT.from, {
          ...REVEAL_CONTENT.to,
          scrollTrigger: { trigger: section, start: "top 85%", once: true },
        });
      });
    }
  }, [loaded]);

  return (
    <div className="page-container">
      {/* Hero */}
      <header
        ref={heroRef}
        style={{
          paddingTop: "var(--space-breath)",
          paddingBottom: "var(--space-section)",
          maxWidth: "var(--max-cover)",
        }}
      >
        <p
          data-hero-el
          className="font-display"
          style={{
            fontStyle: "italic",
            fontSize: "clamp(22px, 3vw, 32px)",
            lineHeight: 1.35,
            color: "var(--ink-primary)",
            maxWidth: "520px",
            opacity: 0,
          }}
        >
          design engineering studio building interfaces, systems, and the quiet details between them.
        </p>
        <div
          data-hero-el
          className="font-mono"
          style={{
            fontSize: "var(--text-meta)",
            letterSpacing: "var(--tracking-label)",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
            marginTop: "var(--space-standard)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-small)",
            opacity: 0,
          }}
        >
          <span>New York</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: "var(--ink-muted)" }} />
          <span>Open to work</span>
        </div>
      </header>

      {/* Work */}
      <section id="work" style={{ maxWidth: "var(--max-cover)" }}>
        <ProjectList projects={PROJECTS} />
      </section>

      {/* Below fold */}
      <div ref={sectionsRef}>
        {/* Exploration */}
        <section
          data-reveal
          style={{
            maxWidth: "var(--max-cover)",
            paddingTop: "var(--space-section)",
            paddingBottom: "var(--space-section)",
            borderTop: "1px solid rgba(var(--ink-rgb), 0.06)",
            marginTop: "var(--space-section)",
            opacity: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-small)" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-standard)" }}>
              <h2 className="font-display" style={{ fontSize: "var(--text-body)", fontStyle: "italic", color: "var(--ink-full)" }}>
                Exploration
              </h2>
              <span style={{ fontSize: "var(--text-body)", color: "var(--ink-secondary)" }}>
                texture studies, generative work, and other small things.
              </span>
            </div>
            <TransitionLink href="/exploration" className="font-mono hover-step-muted" data-link style={{ fontSize: "var(--text-meta)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", flexShrink: 0 }}>
              View all →
            </TransitionLink>
          </div>
        </section>

        {/* Now */}
        <section
          data-reveal
          style={{
            maxWidth: "var(--max-cover)",
            paddingTop: "var(--space-section)",
            paddingBottom: "var(--space-breath)",
            opacity: 0,
          }}
        >
          <span className="font-mono" style={{ fontSize: "var(--text-meta)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--ink-muted)", display: "block", marginBottom: "var(--space-standard)" }}>
            Now
          </span>
          <p style={{ fontSize: "var(--text-body)", color: "var(--ink-secondary)", lineHeight: 1.7, maxWidth: "54ch" }}>
            {NOW_TEXT}
          </p>
        </section>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build and commit**

```bash
npm run build 2>&1 | grep -c "Compiled successfully"
git add src/app/page.tsx
git commit -m "feat: new homepage — text-list projects, clean hero, no Evening components"
```

### Task 7: Update GlobalNav

**Files:**
- Modify: `src/components/GlobalNav.tsx`

- [ ] **Step 1: Read current GlobalNav**

- [ ] **Step 2: Remove NowPlaying import and component**

Keep NYCClock. Remove NowPlaying widget. Ensure layout is:
- Left: HKJ wordmark (Fragment Mono, uppercase, letterspaced) → TransitionLink to /
- Center/right area: NYCClock + nav links (Work, Exploration, Writing, About)
- Background: `var(--paper)` (not `var(--bg)`)
- No blur, no shadow

- [ ] **Step 3: Build and commit**

```bash
npm run build 2>&1 | grep -c "Compiled successfully"
git add src/components/GlobalNav.tsx
git commit -m "feat: clean nav — HKJ wordmark, clock, links, no NowPlaying"
```

### Task 8: Update Preloader

**Files:**
- Modify: `src/components/Preloader.tsx`

- [ ] **Step 1: Read current Preloader**

- [ ] **Step 2: Simplify — no dark overlay**

The preloader should NOT start with a dark screen (that was The Evening concept). Instead:
- First visit: a paper-colored (`--paper`) overlay fades from opacity 1 to 0 over 1.5s. Content blur-reveals underneath as the overlay lifts.
- Repeat visit: skip entirely, content visible immediately.
- The overlay color is `var(--paper)`, matching the page background — so there's no flash.

- [ ] **Step 3: Build and commit**

```bash
npm run build 2>&1 | grep -c "Compiled successfully"
git add src/components/Preloader.tsx
git commit -m "feat: paper-colored preloader — gentle reveal, no dark flash"
```

---

## Chunk 3: Polish Inner Pages

### Task 9: Case study page — use --paper bg, consistent spacing

**Files:**
- Modify: `src/app/work/[slug]/page.tsx`

- [ ] **Step 1: Ensure background is paper, not transparent**

Change `backgroundColor: "transparent"` to just remove the background property entirely (body bg handles it).

- [ ] **Step 2: Verify spacing matches framework**

Top padding: `clamp(80px, 12vh, 140px)`. Max-width: `var(--max-cover)`. Section gaps: `clamp(48px, 6vh, 72px)`.

- [ ] **Step 3: Build and commit**

### Task 10: About page — framework-consistent styling

**Files:**
- Modify: `src/app/about/page.tsx`

- [ ] **Step 1: Match framework spacing and tokens**

- [ ] **Step 2: Build and commit**

### Task 11: Writing + exploration pages — same treatment

**Files:**
- Modify: `src/app/writing/page.tsx`
- Modify: `src/app/writing/[slug]/page.tsx`
- Modify: `src/app/exploration/page.tsx`

- [ ] **Step 1: Consistent spacing, transparent backgrounds removed, framework tokens**

- [ ] **Step 2: Exploration title size: reduce from `clamp(2.2rem, 4.5vw, 3.2rem)` to `clamp(22px, 3vw, 32px)`**

- [ ] **Step 3: Build and commit**

---

## Chunk 4: Mobile + Build + Deploy

### Task 12: Mobile responsiveness

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/ProjectList.tsx`

- [ ] **Step 1: Add/verify mobile breakpoints in globals.css**

At 768px: reduce page padding, project covers always visible (no hover reveal).
At 480px: further reduce padding.

- [ ] **Step 2: ProjectList mobile mode**

On mobile (no hover), show cover images always-visible below each project row instead of hover-activated.

- [ ] **Step 3: Build and commit**

### Task 13: Final build, verification, push

- [ ] **Step 1: Clean build**

```bash
rm -rf .next && npm run build
```

- [ ] **Step 2: Verify all routes render**

- [ ] **Step 3: Push**

```bash
git push
```

---

## Success Criteria

1. Homepage is warm paper with typographic project list — covers appear on hover
2. No dark mode, no shader, no vinyl, no custom cursor
3. Every page uses the same ink-on-paper tokens
4. Blur-reveal animations on all content
5. FLIP transitions from project rows to case study pages
6. NYC Clock in nav
7. Mobile: covers always visible, no hover interactions
8. Build passes clean, all routes rendering
9. The site feels like a well-made book, not a tech demo
