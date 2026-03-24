# Portfolio Rebuild v0.1.0 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fresh, shippable v0.1.0 of the HKJ portfolio following the RYKJUN Project Framework — homepage with identity, cover grid, now section, links, footer, and static nav.

**Architecture:** Single-column centered layout (540px text / 640px covers). Ink-on-paper color system (one warm ink at 7 opacity steps on `#f7f6f3` paper). Three new fonts (Newsreader, Satoshi, Fragment Mono). No entrance animations — content present on load. Lenis smooth scroll carried from current codebase.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, GSAP + Lenis (smooth scroll only in v0.1), Zustand (minimal)

**Spec:** `docs/superpowers/specs/2026-03-23-portfolio-rebuild-design.md`
**Framework:** `RYKJUN-PROJECT-FRAMEWORK.md` (source of truth for all ambiguous decisions)

---

## File Structure

### New files
- `src/fonts/newsreader/` — Newsreader variable font files
- `src/fonts/satoshi/` — Satoshi variable font files
- `src/fonts/fragment-mono/` — Fragment Mono font files
- `src/components/Cover.tsx` — Project cover card (color field + grain + type + hover)
- `src/components/GrainTexture.tsx` — SVG feTurbulence grain overlay (reusable)
- `src/components/RouteAnnouncer.tsx` — ARIA live region for route change announcements

### Major rewrites (same path, new content)
- `src/app/globals.css` — Complete rewrite: ink scale, spacing scale, type tokens, cover hover, grain
- `src/app/layout.tsx` — New fonts, simplified structure (no Preloader, no PageTransition)
- `src/app/page.tsx` — New homepage: Identity → Work → Now → Links
- `src/components/GlobalNav.tsx` — Static nav, no scroll-hide, no backdrop blur
- `src/components/MobileMenu.tsx` — Simplified overlay, paper bg, opacity transition
- `src/components/Footer.tsx` — Two-row layout, no ScrollTrigger reveal

### Modified
- `src/constants/projects.ts` — 3 projects only, new cover palettes, simplified interface
- `src/constants/navigation.ts` — New nav links (Work, Experiments, About)
- `src/constants/contact.ts` — Keep as-is (email + socials still valid)
- `src/lib/store.ts` — Simplified (remove transition state for v0.1)
- `src/lib/utils.ts` — Keep as-is
- `src/hooks/useReducedMotion.ts` — Keep as-is
- `next.config.ts` — Updated redirects
- `package.json` — Remove framer-motion, add nothing

### Kept as-is
- `src/components/SmoothScroll.tsx` — Lenis + GSAP ticker sync works
- `src/components/CloudCanvas.tsx` — Will relocate in v0.2, keep for now
- `src/lib/gsap.ts` — GSAP + ScrollTrigger registration
- `src/app/work/[slug]/page.tsx` — Case studies stay (refine in v0.2)

### Deleted
- `src/fonts/gt-alpina/` — Replaced by Newsreader
- `src/fonts/sohne/` — Replaced by Satoshi (JetBrains Mono replaced by Fragment Mono)
- `src/components/Preloader.tsx` — No entrance animation in v0.1
- `src/components/PageTransition.tsx` — Replaced by text scramble in v0.3
- `src/components/TransitionLink.tsx` — No transitions in v0.1, use Next.js Link directly
- `src/app/journal/` — Removed from sitemap
- `src/app/coddiwomple/` — Replaced by /experiments in v0.2
- `src/app/works/page.tsx` — Redirect no longer needed
- `src/app/template.tsx` — No-op, remove
- `src/constants/journal.ts` — No journal
- `src/constants/explorations.ts` — Will become experiments data in v0.2
- `src/lib/animations.ts` — No GSAP reveals in v0.1
- `src/hooks/useScrollNavigate.ts` — Case study scroll-nav, defer to v0.2
- `src/hooks/useTransitionNavigate.ts` — No page transitions in v0.1

---

## Chunk 1: Foundation (Fonts, Tokens, Config)

### Task 1: Download and install new fonts

**Files:**
- Create: `src/fonts/newsreader/Newsreader-VariableFont.woff2`
- Create: `src/fonts/satoshi/Satoshi-Variable.woff2`
- Create: `src/fonts/fragment-mono/FragmentMono-Regular.woff2`
- Delete: `src/fonts/gt-alpina/` (entire directory)
- Delete: `src/fonts/sohne/` (entire directory)

- [ ] **Step 1: Download Newsreader variable font**

Download from Google Fonts. We need the variable weight axis (300–800).

```bash
# Download Newsreader variable font
cd "c:/Users/Ryan Jun/.gemini/antigravity/scratch/hkjstudio"
mkdir -p src/fonts/newsreader
# Download from Google Fonts API — variable, latin subset
curl -L "https://fonts.google.com/download?family=Newsreader" -o /tmp/newsreader.zip
# Or use google-webfonts-helper / fontsource
# Alternative: use npm package @fontsource-variable/newsreader
```

If curl download doesn't provide woff2 directly, use fontsource:

```bash
npm install @fontsource-variable/newsreader --save-dev
# Then copy the woff2 file from node_modules/@fontsource-variable/newsreader/files/
cp node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2 src/fonts/newsreader/Newsreader-Variable.woff2
npm uninstall @fontsource-variable/newsreader
```

- [ ] **Step 2: Download Satoshi variable font**

Download from Fontshare (https://www.fontshare.com/fonts/satoshi).

```bash
mkdir -p src/fonts/satoshi
# Download from Fontshare — variable, woff2
# Fontshare provides a zip with multiple formats
# Extract Satoshi-Variable.woff2 to src/fonts/satoshi/
```

Alternative: use fontsource if available:
```bash
npm install @fontsource-variable/satoshi --save-dev 2>/dev/null
# If not available, download manually from fontshare.com
```

- [ ] **Step 3: Download Fragment Mono font**

```bash
mkdir -p src/fonts/fragment-mono
# From Google Fonts
curl -L "https://fonts.google.com/download?family=Fragment+Mono" -o /tmp/fragment-mono.zip
# Or fontsource:
npm install @fontsource/fragment-mono --save-dev
cp node_modules/@fontsource/fragment-mono/files/fragment-mono-latin-400-normal.woff2 src/fonts/fragment-mono/FragmentMono-Regular.woff2
npm uninstall @fontsource/fragment-mono
```

- [ ] **Step 4: Delete old font directories**

```bash
rm -rf src/fonts/gt-alpina
rm -rf src/fonts/sohne
```

- [ ] **Step 5: Verify font files exist**

```bash
ls -la src/fonts/newsreader/
ls -la src/fonts/satoshi/
ls -la src/fonts/fragment-mono/
```

Expected: Each directory contains at least one `.woff2` file.

- [ ] **Step 6: Commit**

```bash
git add src/fonts/
git commit -m "chore: swap fonts to Newsreader, Satoshi, Fragment Mono

Replace GT Alpina (trial) + Söhne (trial) + JetBrains Mono with
freely licensed alternatives per RYKJUN framework."
```

---

### Task 2: Rewrite globals.css with new token system

**Files:**
- Rewrite: `src/app/globals.css`

The entire CSS file is replaced. New system: ink opacity scale, spacing scale, type tokens, cover interaction, grain utility.

- [ ] **Step 1: Write new globals.css**

```css
/* ==========================================================================
   HKJ Studio — Design Tokens
   Source of truth: RYKJUN-PROJECT-FRAMEWORK.md
   ========================================================================== */

@import "tailwindcss";

/* --------------------------------------------------------------------------
   1. INK-ON-PAPER COLOR SYSTEM
   One ink. One paper. Hierarchy through opacity.
   -------------------------------------------------------------------------- */

:root {
  /* Paper */
  --paper: #f7f6f3;

  /* Ink scale — rgba(35, 32, 28) at varying opacity */
  --ink-full:      rgba(35, 32, 28, 1.00);
  --ink-primary:   rgba(35, 32, 28, 0.82);
  --ink-secondary: rgba(35, 32, 28, 0.52);
  --ink-muted:     rgba(35, 32, 28, 0.35);
  --ink-faint:     rgba(35, 32, 28, 0.20);
  --ink-ghost:     rgba(35, 32, 28, 0.10);
  --ink-whisper:   rgba(35, 32, 28, 0.05);

  /* Raw ink RGB for rgba() usage in shadows, overlays */
  --ink-rgb: 35, 32, 28;

  /* --------------------------------------------------------------------------
     2. TYPOGRAPHY
     -------------------------------------------------------------------------- */

  --font-display: "Newsreader", Georgia, "Times New Roman", serif;
  --font-body: "Satoshi", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "Fragment Mono", "SF Mono", "Fira Code", monospace;

  /* Type scale — use clamp() for fluid sizing */
  --text-name:     clamp(28px, 4vw, 36px);
  --text-title:    clamp(18px, 2.5vw, 22px);
  --text-body:     15px;
  --text-nav:      13px;
  --text-label:    11px;
  --text-meta:     10.5px;

  /* Tracking */
  --tracking-label: 0.04em;

  /* Leading */
  --leading-display: 1.2;
  --leading-body:    1.75;

  /* --------------------------------------------------------------------------
     3. SPACING SCALE
     -------------------------------------------------------------------------- */

  --space-micro:       4px;
  --space-small:       8px;
  --space-compact:     12px;
  --space-standard:    16px;
  --space-comfortable: 24px;
  --space-room:        32px;
  --space-break:       48px;
  --space-section:     56px;
  --space-breath:      72px;

  /* --------------------------------------------------------------------------
     4. LAYOUT
     -------------------------------------------------------------------------- */

  --max-text:  540px;
  --max-cover: 640px;
  --page-px:   24px;

  /* --------------------------------------------------------------------------
     5. INTERACTION TIMING
     -------------------------------------------------------------------------- */

  --duration-hover:      320ms;
  --duration-press:      100ms;
  --duration-transition:  600ms;
  --ease-out:            cubic-bezier(0.16, 1, 0.3, 1);
  --ease-hover:          ease-out;
}

/* --------------------------------------------------------------------------
   BASE STYLES
   -------------------------------------------------------------------------- */

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  background-color: var(--paper);
  color: var(--ink-primary);
  font-family: var(--font-body);
  font-size: var(--text-body);
  line-height: var(--leading-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  background-color: var(--paper);
  min-height: 100dvh;
  padding-top: 48px; /* Fixed nav height offset */
}

::selection {
  background-color: rgba(var(--ink-rgb), 0.12);
  color: var(--ink-full);
}

/* --------------------------------------------------------------------------
   FOCUS STYLES
   -------------------------------------------------------------------------- */

:focus-visible {
  outline: 1px solid var(--ink-muted);
  outline-offset: 2px;
}

/* --------------------------------------------------------------------------
   SKIP LINK (accessibility)
   -------------------------------------------------------------------------- */

.skip-to-content {
  position: absolute;
  top: -100%;
  left: var(--page-px);
  z-index: 10000;
  padding: var(--space-small) var(--space-standard);
  background: var(--ink-full);
  color: var(--paper);
  font-family: var(--font-mono);
  font-size: var(--text-meta);
  text-decoration: none;
  border-radius: 4px;
}

.skip-to-content:focus {
  top: var(--space-small);
}

/* --------------------------------------------------------------------------
   TYPOGRAPHY UTILITIES
   -------------------------------------------------------------------------- */

.font-display {
  font-family: var(--font-display);
  line-height: var(--leading-display);
}

.font-mono {
  font-family: var(--font-mono);
  letter-spacing: var(--tracking-label);
}

/* --------------------------------------------------------------------------
   INK UTILITIES
   -------------------------------------------------------------------------- */

.ink-full      { color: var(--ink-full); }
.ink-primary   { color: var(--ink-primary); }
.ink-secondary { color: var(--ink-secondary); }
.ink-muted     { color: var(--ink-muted); }
.ink-faint     { color: var(--ink-faint); }
.ink-ghost     { color: var(--ink-ghost); }

/* --------------------------------------------------------------------------
   HOVER: opacity-step shift
   All interactive elements brighten one step on hover.
   -------------------------------------------------------------------------- */

.hover-step {
  transition: color var(--duration-hover) var(--ease-hover);
}

.hover-step.ink-muted:hover     { color: var(--ink-secondary); }
.hover-step.ink-secondary:hover { color: var(--ink-primary); }
.hover-step.ink-faint:hover     { color: var(--ink-muted); }
.hover-step.ink-ghost:hover     { color: var(--ink-faint); }

/* --------------------------------------------------------------------------
   COVER CARD
   -------------------------------------------------------------------------- */

[data-cover] {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform var(--duration-hover) var(--ease-out),
    box-shadow var(--duration-hover) var(--ease-out);
}

[data-cover]:hover {
  transform: translateY(-3px);
  box-shadow:
    0 4px 12px rgba(var(--ink-rgb), 0.06),
    0 8px 24px rgba(var(--ink-rgb), 0.04);
}

[data-cover]:active {
  transform: scale(0.98);
  transition-duration: var(--duration-press);
}

/* --------------------------------------------------------------------------
   GRAIN TEXTURE (SVG feTurbulence overlay)
   Applied via GrainTexture component as a pseudo-element.
   -------------------------------------------------------------------------- */

.grain-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  opacity: 0.28;
  mix-blend-mode: multiply;
}

.grain-overlay--dark {
  mix-blend-mode: soft-light;
  opacity: 0.25;
}

/* --------------------------------------------------------------------------
   LAYOUT
   -------------------------------------------------------------------------- */

.page-container {
  width: 100%;
  max-width: calc(var(--max-cover) + var(--page-px) * 2);
  margin: 0 auto;
  padding: 0 var(--page-px);
}

.text-column {
  max-width: var(--max-text);
}

.cover-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-compact);
  max-width: var(--max-cover);
}

@media (max-width: 480px) {
  .cover-grid {
    grid-template-columns: 1fr;
  }
}

/* --------------------------------------------------------------------------
   SECTION SPACING
   -------------------------------------------------------------------------- */

.section {
  margin-top: var(--space-section);
}

.section:first-child {
  margin-top: var(--space-breath);
}

.section-label {
  font-family: var(--font-mono);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  color: var(--ink-secondary);
  margin-bottom: var(--space-room);
}

/* --------------------------------------------------------------------------
   REDUCED MOTION
   -------------------------------------------------------------------------- */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Verify the file is saved correctly**

```bash
head -5 src/app/globals.css
```

Expected: The comment header and `@import "tailwindcss"` line.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: rewrite CSS tokens — ink-on-paper system, spacing scale

Replace multi-token color system with 7-step ink opacity scale.
New spacing scale (4–72px). New type tokens for Newsreader/Satoshi/Fragment Mono.
Per RYKJUN framework section 4–5."
```

---

### Task 3: Rewrite layout.tsx with new fonts and simplified structure

**Files:**
- Rewrite: `src/app/layout.tsx`
- Delete: `src/components/Preloader.tsx`
- Delete: `src/components/PageTransition.tsx`
- Delete: `src/components/TransitionLink.tsx`
- Delete: `src/app/template.tsx`

- [ ] **Step 1: Write new layout.tsx**

```tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GlobalNav } from "@/components/GlobalNav";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { RouteAnnouncer } from "@/components/RouteAnnouncer";

/* -----------------------------------------------------------------------
   Fonts — self-hosted, subsetted
   Roles: Display (Newsreader), Body (Satoshi), System (Fragment Mono)
   ----------------------------------------------------------------------- */

const newsreader = localFont({
  src: "../fonts/newsreader/Newsreader-Variable.woff2",
  variable: "--font-display",
  weight: "300 800",
  display: "swap",
  preload: true,
});

const satoshi = localFont({
  src: "../fonts/satoshi/Satoshi-Variable.woff2",
  variable: "--font-body",
  weight: "300 700",
  display: "swap",
  preload: true,
});

const fragmentMono = localFont({
  src: "../fonts/fragment-mono/FragmentMono-Regular.woff2",
  variable: "--font-mono",
  display: "swap",
  weight: "400",
  preload: true,
});

/* -----------------------------------------------------------------------
   Metadata
   ----------------------------------------------------------------------- */

export const metadata: Metadata = {
  metadataBase: new URL("https://hkjstudio.com"),
  title: { default: "HKJ", template: "%s — HKJ" },
  description: "Design engineer portfolio",
};

/* -----------------------------------------------------------------------
   Root Layout
   Simplified for v0.1: no Preloader, no PageTransition, no noise grain.
   Content is present immediately (framework: "confidence of immediate presence").
   ----------------------------------------------------------------------- */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${satoshi.variable} ${fragmentMono.variable}`}
    >
      <body>
        {/* Global SVG grain filter — referenced by Cover components */}
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves={4}
              stitchTiles="stitch"
            />
          </filter>
        </svg>

        <a href="#main" className="skip-to-content">
          Skip to content
        </a>

        {/* ARIA live region for route change announcements (accessibility) */}
        <RouteAnnouncer />

        <GlobalNav />
        <SmoothScroll>
          <main id="main">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create RouteAnnouncer component**

```tsx
// src/components/RouteAnnouncer.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * ARIA live region that announces route changes to screen readers.
 * Spec section 12: "ARIA live region for route changes."
 */
export function RouteAnnouncer() {
  const pathname = usePathname();
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    // Build a human-readable page title from the pathname
    const title = pathname === "/"
      ? "Homepage"
      : pathname
          .replace(/^\//, "")
          .replace(/\//g, " — ")
          .replace(/-/g, " ");
    setAnnouncement(`Navigated to ${title}`);
  }, [pathname]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "absolute",
        width: 1,
        height: 1,
        overflow: "hidden",
        clip: "rect(0 0 0 0)",
        whiteSpace: "nowrap",
      }}
    >
      {announcement}
    </div>
  );
}
```

- [ ] **Step 3: Delete removed components**

```bash
rm -f src/components/Preloader.tsx
rm -f src/components/PageTransition.tsx
rm -f src/components/TransitionLink.tsx
rm -f src/app/template.tsx
```

- [ ] **Step 3: Verify layout renders**

```bash
npm run dev
```

Check: site loads at localhost without errors. No preloader, no page transition overlay. Content appears immediately. The body should show the paper background (`#f7f6f3`).

Note: The dev server will likely error at this point because `page.tsx`, `GlobalNav.tsx`, and `Footer.tsx` still reference old imports (animations.ts, TransitionLink, framer-motion, old store shape). That's expected — we fix these files in Tasks 5–13. Skip dev verification here and move to the next task.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/components/Preloader.tsx src/components/PageTransition.tsx src/components/TransitionLink.tsx src/app/template.tsx
git commit -m "feat: simplify layout — new fonts, remove Preloader/PageTransition

Content present on load (no entrance animation per framework v0.1).
Skip-to-content link for accessibility. Simplified layout tree."
```

---

### Task 4: Update config files

**Files:**
- Modify: `next.config.ts`
- Modify: `package.json` (remove framer-motion)

- [ ] **Step 1: Update next.config.ts**

Replace the redirects to point old routes to home, and remove `/explore` redirects (no more coddiwomple):

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Legacy routes → homepage
      { source: "/works", destination: "/", permanent: true },
      { source: "/explore", destination: "/", permanent: true },
      { source: "/explore/:slug", destination: "/", permanent: true },
      { source: "/coddiwomple", destination: "/", permanent: true },
      { source: "/coddiwomple/:slug", destination: "/", permanent: true },
      { source: "/journal", destination: "/", permanent: true },
      { source: "/journal/:slug", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 2: Remove framer-motion**

```bash
npm uninstall framer-motion
```

- [ ] **Step 3: Commit**

```bash
git add next.config.ts package.json package-lock.json
git commit -m "chore: update config — legacy redirects, remove framer-motion"
```

---

## Chunk 2: Navigation

### Task 5: Update constants

**Files:**
- Rewrite: `src/constants/navigation.ts`
- Modify: `src/constants/projects.ts`
- Keep: `src/constants/contact.ts`
- Delete: `src/constants/journal.ts`
- Delete: `src/constants/explorations.ts`

- [ ] **Step 1: Rewrite navigation constants**

```ts
// src/constants/navigation.ts

export const NAV_LINKS = [
  { label: "Work", href: "/#work" },
  { label: "Experiments", href: "/experiments" },
  { label: "About", href: "/about" },
] as const;

export const FOOTER_LINKS = NAV_LINKS;
```

- [ ] **Step 2: Rewrite projects constant**

Simplified interface — only the data needed for v0.1 covers + case study pages. 3 projects, new cover palettes with light/dark alternation.

```ts
// src/constants/projects.ts

export interface ProjectCover {
  bg: string;
  text: string;
  accent: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  order: number;
  description: string;
  year: string;
  sector: string;
  cover: ProjectCover;
  status: "shipped" | "wip";
}

export const PROJECTS: Project[] = [
  {
    id: "gyeol",
    title: "Gyeol",
    slug: "gyeol",
    order: 1,
    description: "A material typography system rooted in Korean craft traditions.",
    year: "2026",
    sector: "Material Science",
    cover: {
      bg: "#2a241c",
      text: "rgba(255, 252, 245, 0.85)",
      accent: "rgba(255, 252, 245, 0.15)",
    },
    status: "shipped",
  },
  {
    id: "sift",
    title: "Sift",
    slug: "sift",
    order: 2,
    description: "An AI-powered tool for finding what matters in your camera roll.",
    year: "2025",
    sector: "Mobile / AI",
    cover: {
      bg: "#e8e2d8",
      text: "rgba(35, 32, 28, 0.82)",
      accent: "rgba(35, 32, 28, 0.10)",
    },
    status: "shipped",
  },
  {
    id: "conductor",
    title: "Conductor",
    slug: "conductor",
    order: 3,
    description: "A design system that orchestrates consistency across product surfaces.",
    year: "2026",
    sector: "Design Systems",
    cover: {
      bg: "#3d3830",
      text: "rgba(255, 252, 245, 0.80)",
      accent: "rgba(255, 252, 245, 0.12)",
    },
    status: "wip",
  },
];
```

- [ ] **Step 3: Delete unused constants**

```bash
rm -f src/constants/journal.ts
rm -f src/constants/explorations.ts
```

- [ ] **Step 4: Commit**

```bash
git add src/constants/
git commit -m "feat: update constants — 3 projects, new nav links, remove journal/explorations"
```

---

### Task 6: Rewrite GlobalNav

**Files:**
- Rewrite: `src/components/GlobalNav.tsx`

Static nav, no scroll-direction hide/show, no backdrop blur. Name on left, 3 links on right.

- [ ] **Step 1: Write new GlobalNav**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/constants/navigation";

export function GlobalNav() {
  const pathname = usePathname();

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 500,
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `0 var(--page-px)`,
        backgroundColor: "var(--paper)",
      }}
    >
      {/* Name — home link */}
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-nav)",
          color: "var(--ink-full)",
          textDecoration: "none",
          letterSpacing: "0.01em",
        }}
      >
        HKJ
      </Link>

      {/* Desktop nav */}
      <nav
        style={{ display: "flex", gap: "var(--space-comfortable)" }}
        aria-label="Main navigation"
      >
        {NAV_LINKS.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/" && pathname.startsWith(link.href.replace("/#", "/")));

          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-nav)",
                color: isActive ? "var(--ink-primary)" : "var(--ink-secondary)",
                textDecoration: "none",
                transition: `color var(--duration-hover) var(--ease-hover)`,
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = "var(--ink-primary)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = "var(--ink-secondary)";
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile menu trigger — visible below 768px */}
      <MobileMenuTrigger />
    </header>
  );
}

function MobileMenuTrigger() {
  // Placeholder — implemented in Task 7
  return null;
}
```

Note: Mobile menu trigger will be wired up in Task 7. For now, the desktop nav works.

- [ ] **Step 2: Verify nav renders**

```bash
npm run dev
```

Check: Fixed nav at top. "HKJ" on left, "Work / Experiments / About" on right. Hover brightens links. No scroll behavior — stays fixed and visible.

- [ ] **Step 3: Commit**

```bash
git add src/components/GlobalNav.tsx
git commit -m "feat: rewrite GlobalNav — static, ink-secondary links, no scroll-hide"
```

---

### Task 7: Rewrite MobileMenu

**Files:**
- Rewrite: `src/components/MobileMenu.tsx`
- Modify: `src/components/GlobalNav.tsx` (wire up trigger)
- Modify: `src/lib/store.ts` (simplify)

- [ ] **Step 1: Simplify store**

```ts
// src/lib/store.ts
import { create } from "zustand";

interface StudioStore {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useStudioStore = create<StudioStore>((set) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
}));
```

- [ ] **Step 2: Write new MobileMenu**

```tsx
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStudioStore } from "@/lib/store";
import { NAV_LINKS } from "@/constants/navigation";
import { CONTACT_EMAIL, SOCIALS } from "@/constants/contact";

export function MobileMenu() {
  const { mobileMenuOpen, setMobileMenuOpen } = useStudioStore();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Close on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mobileMenuOpen, setMobileMenuOpen]);

  // Focus trap — focus first link on open, trap Tab within menu
  useEffect(() => {
    if (!mobileMenuOpen) return;
    if (firstLinkRef.current) firstLinkRef.current.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !menuRef.current) return;
      const focusable = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [mobileMenuOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <div
      ref={menuRef}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9500,
        backgroundColor: "var(--paper)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "var(--space-comfortable)",
        opacity: mobileMenuOpen ? 1 : 0,
        pointerEvents: mobileMenuOpen ? "auto" : "none",
        transition: `opacity var(--duration-hover) var(--ease-hover)`,
      }}
    >
      {/* Close button */}
      <button
        onClick={() => setMobileMenuOpen(false)}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: 48,
          padding: `0 var(--page-px)`,
          background: "none",
          border: "none",
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-nav)",
          color: "var(--ink-secondary)",
          cursor: "pointer",
        }}
        aria-label="Close menu"
      >
        Close
      </button>

      {/* Nav links */}
      <nav style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-comfortable)" }}>
        {NAV_LINKS.map((link, i) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href.replace("/#", "/"));
          return (
            <Link
              key={link.href}
              href={link.href}
              ref={i === 0 ? firstLinkRef : undefined}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(22px, 5vw, 28px)",
                lineHeight: "var(--leading-display)",
                color: isActive ? "var(--ink-full)" : "var(--ink-primary)",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Contact at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: "var(--space-breath)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-small)",
        }}
      >
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-meta)",
            letterSpacing: "var(--tracking-label)",
            color: "var(--ink-muted)",
            textDecoration: "none",
          }}
        >
          {CONTACT_EMAIL}
        </a>
        <div style={{ display: "flex", gap: "var(--space-standard)" }}>
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-meta)",
                letterSpacing: "var(--tracking-label)",
                color: "var(--ink-muted)",
                textDecoration: "none",
                transition: `color var(--duration-hover) var(--ease-hover)`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ink-secondary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ink-muted)"; }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Wire mobile trigger into GlobalNav**

Update `GlobalNav.tsx` — replace the `MobileMenuTrigger` placeholder:

```tsx
// Add at top of GlobalNav.tsx:
import { useStudioStore } from "@/lib/store";
import { MobileMenu } from "@/components/MobileMenu";

// Replace MobileMenuTrigger function with:
function MobileMenuTrigger() {
  const { setMobileMenuOpen } = useStudioStore();

  return (
    <>
      <button
        onClick={() => setMobileMenuOpen(true)}
        style={{
          display: "none", // Hidden on desktop, shown via media query
          background: "none",
          border: "none",
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-nav)",
          color: "var(--ink-secondary)",
          cursor: "pointer",
        }}
        className="mobile-menu-trigger"
        aria-label="Open navigation menu"
      >
        Menu
      </button>
      <MobileMenu />
    </>
  );
}
```

Add to `globals.css` the responsive show/hide:

```css
/* Mobile menu trigger visibility */
@media (max-width: 768px) {
  .mobile-menu-trigger {
    display: block !important;
  }
  [data-desktop-nav] {
    display: none !important;
  }
}
```

And add `data-desktop-nav` attribute to the nav element in GlobalNav, and `className="mobile-menu-trigger"` to the trigger button.

- [ ] **Step 4: Verify mobile menu works**

```bash
npm run dev
```

Check at mobile viewport (< 768px): "Menu" button appears, desktop links hidden. Tapping "Menu" opens full-screen overlay with Newsreader links. Close button works. Escape key works. Links navigate and close menu.

- [ ] **Step 5: Commit**

```bash
git add src/components/GlobalNav.tsx src/components/MobileMenu.tsx src/lib/store.ts src/app/globals.css
git commit -m "feat: rewrite MobileMenu — paper overlay, focus trap, simplified store"
```

---

## Chunk 3: Homepage

### Task 8: Create GrainTexture component

**Files:**
- Create: `src/components/GrainTexture.tsx`

- [ ] **Step 1: Define global SVG grain filter in layout.tsx**

Rather than putting the SVG filter inside each Cover (which causes duplicate `id` collisions), define it once globally in `layout.tsx` and reference it from all covers via CSS.

Add this to the `<body>` in `layout.tsx`, before the skip-to-content link:

```tsx
{/* Global SVG grain filter — referenced by Cover components */}
<svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
  <filter id="grain">
    <feTurbulence
      type="fractalNoise"
      baseFrequency="0.65"
      numOctaves={4}
      stitchTiles="stitch"
    />
  </filter>
</svg>
```

- [ ] **Step 2: Write GrainTexture component that references the global filter**

```tsx
// src/components/GrainTexture.tsx

/**
 * Grain overlay that references the global #grain filter in layout.tsx.
 * Gives flat color fields the quality of printed paper.
 * Per framework: opacity 20-35%, multiply on light, soft-light on dark.
 */
export function GrainTexture({ dark = false }: { dark?: boolean }) {
  return (
    <svg
      className={dark ? "grain-overlay grain-overlay--dark" : "grain-overlay"}
      aria-hidden="true"
    >
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}
```

This is a Server Component (no `"use client"`) — it has no client-side state or hooks.

- [ ] **Step 2: Commit**

```bash
git add src/components/GrainTexture.tsx
git commit -m "feat: add GrainTexture component — SVG feTurbulence noise overlay"
```

---

### Task 9: Create Cover component

**Files:**
- Create: `src/components/Cover.tsx`

- [ ] **Step 1: Write Cover component**

```tsx
import Link from "next/link";
import type { Project } from "@/constants/projects";
import { GrainTexture } from "@/components/GrainTexture";

/**
 * Project cover card — Server Component (no client-side hooks needed).
 * Square color field + grain + project number + title + note.
 * Per framework section 7: "They should feel like artifacts —
 * printed cards, record sleeves, book covers — not digital UI cards."
 */
export function Cover({ project, index }: { project: Project; index: number }) {
  const isDark = isDarkColor(project.cover.bg);
  const number = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={`/work/${project.slug}`}
      data-cover
      aria-label={`View ${project.title} case study`}
      style={{
        display: "block",
        backgroundColor: project.cover.bg,
        textDecoration: "none",
        position: "relative",
      }}
    >
      {/* Grain texture */}
      <GrainTexture dark={isDark} />

      {/* Project number — top left, very faint */}
      <span
        style={{
          position: "absolute",
          top: "var(--space-comfortable)",
          left: "var(--space-comfortable)",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-meta)",
          letterSpacing: "var(--tracking-label)",
          color: project.cover.accent,
        }}
      >
        {number}
      </span>

      {/* Title + note — bottom area */}
      <div
        style={{
          position: "absolute",
          bottom: "var(--space-comfortable)",
          left: "var(--space-comfortable)",
          right: "var(--space-comfortable)",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-title)",
            lineHeight: "var(--leading-display)",
            color: project.cover.text,
            marginBottom: "var(--space-small)",
          }}
        >
          {project.title}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-meta)",
            letterSpacing: "var(--tracking-label)",
            color: project.cover.accent,
            display: "flex",
            gap: "var(--space-small)",
            flexWrap: "wrap",
          }}
        >
          <span>{project.sector}</span>
          <span>·</span>
          <span>{project.year}</span>
          {project.status === "wip" && (
            <>
              <span>·</span>
              <span>In progress</span>
            </>
          )}
        </p>
      </div>
    </Link>
  );
}

/**
 * Determine if a hex color is dark (for grain blend mode).
 * Uses relative luminance approximation.
 */
function isDarkColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Cover.tsx
git commit -m "feat: add Cover component — color field, grain, typography, hover"
```

---

### Task 10: Rewrite homepage

**Files:**
- Rewrite: `src/app/page.tsx`

- [ ] **Step 1: Write new homepage**

```tsx
// src/app/page.tsx
import { PROJECTS } from "@/constants/projects";
import { CONTACT_EMAIL, SOCIALS } from "@/constants/contact";
import { Cover } from "@/components/Cover";

/**
 * Homepage — v0.1
 * Sections: Identity → Work → Now → Links
 * No entrance animations. Content present on load.
 * Per framework: "The confidence of immediate presence says more
 * than a choreographed reveal."
 */
export default function HomePage() {
  return (
    <div className="page-container">
      {/* 1. Identity */}
      <section className="section text-column" style={{ marginTop: "var(--space-breath)" }}>
        <h1
          className="font-display ink-full"
          style={{ fontSize: "var(--text-name)", marginBottom: "var(--space-compact)" }}
        >
          Hyeon Jun
        </h1>
        <p
          className="ink-secondary"
          style={{ fontSize: "var(--text-nav)", marginBottom: "var(--space-standard)" }}
        >
          Design Engineer
        </p>
        <p className="ink-primary" style={{ maxWidth: "var(--max-text)" }}>
          I design and build digital products with care for craft, clarity, and the
          details that make interfaces feel considered. Currently based in New York,
          open to collaborations.
        </p>
      </section>

      {/* 2. Work */}
      <section className="section" id="work">
        <p className="section-label">Work</p>
        <div className="cover-grid">
          {PROJECTS.map((project, i) => (
            <Cover key={project.id} project={project} index={i} />
          ))}
        </div>
      </section>

      {/* 3. Now */}
      <section className="section text-column">
        <p className="section-label">Now</p>
        <p className="ink-primary">
          Building out case studies for recent work and experimenting with
          generative interfaces. Exploring how computational effects can feel
          warm rather than cold.
        </p>
      </section>

      {/* 4. Links */}
      <section className="section text-column" style={{ marginBottom: "var(--space-breath)" }}>
        <p className="section-label">Contact</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-compact)" }}>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="ink-secondary hover-step"
            style={{ textDecoration: "none", fontFamily: "var(--font-body)" }}
          >
            {CONTACT_EMAIL}
          </a>
          <div style={{ display: "flex", gap: "var(--space-standard)" }}>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ink-muted hover-step font-mono"
                style={{
                  fontSize: "var(--text-meta)",
                  textDecoration: "none",
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
```

Note: This homepage is a Server Component (no `"use client"`) — it has no client-side state or effects. This is better for performance and aligns with the framework's "content present on load" principle.

- [ ] **Step 2: Verify homepage renders**

```bash
npm run dev
```

Check at localhost:
- Paper background (#f7f6f3)
- "Hyeon Jun" in Newsreader serif, largest text on page
- "Design Engineer" in Satoshi, ink-secondary
- Body paragraph in Satoshi, ink-primary
- "Work" section label in Fragment Mono, uppercase-ish, ink-secondary
- 2-col grid: Gyeol (dark), Sift (light), Conductor (dark) covers
- Covers have grain, number top-left, title + metadata bottom
- Hover: translateY(-3px) + shadow
- "Now" section with Fragment Mono label
- "Contact" section with email + social links
- Single column, centered, 640px max for grid, 540px max for text

Mobile check (< 480px): covers stack to 1 column.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: rewrite homepage — Identity, Work covers, Now, Links

Server Component, no client-side animations.
Content present on load per framework v0.1."
```

---

## Chunk 4: Footer + Cleanup

### Task 11: Rewrite Footer

**Files:**
- Rewrite: `src/components/Footer.tsx`

- [ ] **Step 1: Write new Footer**

```tsx
// src/components/Footer.tsx
import Link from "next/link";
import { NAV_LINKS } from "@/constants/navigation";
import { CONTACT_EMAIL, SOCIALS } from "@/constants/contact";

/**
 * Footer — two rows.
 * Row 1: nav links + email + socials
 * Row 2: copyright + version
 * No ScrollTrigger reveal in v0.1.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        width: "100%",
        maxWidth: `calc(var(--max-text) + var(--page-px) * 2)`,
        margin: "0 auto",
        padding: `var(--space-breath) var(--page-px) var(--space-room)`,
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-standard)",
      }}
    >
      {/* Row 1: links */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "var(--space-standard)",
          borderTop: "1px solid var(--ink-faint)",
          paddingTop: "var(--space-comfortable)",
        }}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="ink-secondary hover-step"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-nav)",
              textDecoration: "none",
            }}
          >
            {link.label}
          </Link>
        ))}

        <span style={{ color: "var(--ink-faint)" }}>·</span>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="ink-secondary hover-step"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-nav)",
            textDecoration: "none",
          }}
        >
          Email
        </a>

        {SOCIALS.map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ink-secondary hover-step"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-nav)",
              textDecoration: "none",
            }}
          >
            {s.label}
          </a>
        ))}
      </div>

      {/* Row 2: colophon */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-meta)",
          letterSpacing: "var(--tracking-label)",
          color: "var(--ink-muted)",
        }}
      >
        © {year} HKJ · v0.1.0
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: rewrite Footer — two-row layout, nav + colophon, no scroll reveal"
```

---

### Task 12: Delete unused pages and files

**Files:**
- Delete: `src/app/journal/` (entire directory)
- Delete: `src/app/coddiwomple/` (entire directory)
- Delete: `src/app/works/page.tsx`
- Delete: `src/lib/animations.ts`
- Delete: `src/hooks/useScrollNavigate.ts`
- Delete: `src/hooks/useTransitionNavigate.ts`

- [ ] **Step 1: Remove deleted pages**

```bash
rm -rf src/app/journal
rm -rf src/app/coddiwomple
rm -rf src/app/works
```

- [ ] **Step 2: Remove unused lib/hooks**

```bash
rm -f src/lib/animations.ts
rm -f src/hooks/useScrollNavigate.ts
rm -f src/hooks/useTransitionNavigate.ts
```

- [ ] **Step 3: Verify no import errors**

```bash
npm run build
```

Fix any import errors that reference deleted files. Common places to check:
- `src/app/work/[slug]/page.tsx` — may import `useScrollNavigate`, `animations.ts`, `TransitionLink`
- `src/app/about/page.tsx` — may import `animations.ts`, `TransitionLink`
- Any component importing from deleted constants

If `work/[slug]/page.tsx` fails, temporarily simplify it to a placeholder that reads project data and renders basic content. The full case study page will be refined in v0.2.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove journal, coddiwomple, works redirect, unused animations/hooks

Legacy pages now redirect via next.config.ts.
Animations and scroll-navigate hooks return in v0.3."
```

---

### Task 13: Fix case study and about pages for v0.1 compatibility

**Files:**
- Modify: `src/app/work/[slug]/page.tsx`
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/not-found.tsx`

These pages import deleted modules. They need to be updated to work without TransitionLink, animations.ts, and useScrollNavigate.

- [ ] **Step 1: Update work/[slug]/page.tsx**

This is the most complex file. For v0.1, remove:
- `useScrollNavigate` import and hook usage
- `animations.ts` imports (REVEAL_CONTENT, REVEAL_MEDIA)
- `TransitionLink` usage (replace with Next.js `Link`)
- All GSAP entrance animations (useGSAP effects)
- Scroll-to-navigate progress bar and keyboard nav

Keep:
- Project data lookup from `PROJECTS`
- Basic content rendering (metadata, editorial, images, videos)
- General layout structure

Replace the entire GSAP animation setup with static rendering. Content is present on load.

The exact changes depend on the current file's structure. The implementing agent should:
1. Read the current `work/[slug]/page.tsx` fully
2. Remove all imports from deleted files
3. Replace `TransitionLink` with `Link` from `next/link`
4. Remove all `useGSAP` / `useLayoutEffect` animation blocks
5. Remove `useScrollNavigate` hook and related UI (progress bar, direction indicator)
6. Keep the content rendering structure intact
7. Update the `PROJECTS` import to use the new simplified interface
8. Handle the fact that the old `Project` interface had many more fields (editorial, process, highlights, etc.) — these fields no longer exist on the type but the data for Gyeol and Sift is still in the old format. For v0.1, the implementing agent should keep a separate `LEGACY_PROJECTS` data file or inline the case study data until the MDX content pipeline is built in v0.2.

**Important decision:** The case study pages are complex and use fields not on the new `Project` interface. Rather than losing that data, create `src/constants/case-studies.ts` that holds the full editorial content for Gyeol and Sift (extracted from the old projects.ts before it was rewritten). The simplified `projects.ts` handles covers; `case-studies.ts` handles detail pages.

The interface for `case-studies.ts`:

```ts
// src/constants/case-studies.ts

export interface CaseStudy {
  id: string;
  client: string;
  role: string;
  tags: string[];
  editorial: { heading: string; copy: string };
  process?: { heading: string; copy: string }[];
  highlights?: { title: string; description: string }[];
  engineering?: { heading: string; copy: string };
  statistics?: { label: string; value: string }[];
  videos?: { src: string; poster?: string; caption?: string }[];
  contributors?: { name: string; role: string }[];
  paradox?: string;
  stakes?: string;
  gutPunch?: string;
}

// Extract the editorial data from the OLD projects.ts BEFORE rewriting it.
// Copy the full object data for gyeol and sift into this file.
export const CASE_STUDIES: Record<string, CaseStudy> = {
  gyeol: { /* ... copy from old projects.ts ... */ },
  sift: { /* ... copy from old projects.ts ... */ },
};
```

The implementing agent MUST read the old `src/constants/projects.ts` and extract the editorial fields into this file BEFORE rewriting `projects.ts` to the simplified interface in Task 5.

- [ ] **Step 2: Update about/page.tsx**

Remove:
- GSAP animation imports and `useGSAP` blocks
- `TransitionLink` (replace with `Link`)

Keep:
- Content structure (about text, experience list, contact section)
- Layout (`maxWidth: 560` or update to `540px` per framework)

- [ ] **Step 3: Update not-found.tsx**

Remove `TransitionLink`, replace with `Link`. Keep the 404 content. Update colors from old tokens to ink scale.

- [ ] **Step 4: Verify full build passes**

```bash
npm run build
```

Expected: Build succeeds with no errors. All pages render.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "fix: update case study, about, 404 pages for v0.1 compatibility

Remove deleted imports (TransitionLink, animations, useScrollNavigate).
Static rendering — no entrance animations. Content present on load."
```

---

### Task 14: Final verification and cleanup

- [ ] **Step 1: Run dev server and verify all pages**

```bash
npm run dev
```

Check each route:
- `/` — Homepage with Identity, Work (3 covers), Now, Links, Footer
- `/work/gyeol` — Case study loads without errors
- `/work/sift` — Case study loads without errors
- `/work/conductor` — Case study loads (may be sparse for WIP)
- `/about` — About page loads
- `/journal` — Redirects to `/`
- `/coddiwomple` — Redirects to `/`
- 404 — Navigate to `/nonexistent`, verify 404 page renders

- [ ] **Step 2: Check mobile responsiveness**

At viewport < 480px:
- Cover grid is 1 column
- Mobile menu trigger visible, desktop nav hidden
- Mobile menu opens/closes correctly
- All text readable, no overflow

At viewport < 768px:
- Mobile menu trigger appears
- Desktop nav links hidden

- [ ] **Step 3: Check reduced motion**

In browser dev tools, enable "prefers-reduced-motion: reduce":
- No animations anywhere
- All hover states still work (instant, no transition)
- Page is fully functional

- [ ] **Step 4: Run production build**

```bash
npm run build
```

Expected: Build succeeds. Check bundle size — initial JS should be well under 150KB gzipped since we removed framer-motion, Preloader, PageTransition, and all GSAP entrance animations.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: v0.1.0 — portfolio rebuild complete

Fresh build per RYKJUN framework. Ink-on-paper color system,
Newsreader/Satoshi/Fragment Mono type stack, single-column
centered layout, 3 project covers with grain texture.
No entrance animations — content present on load."
```

---

### Task 15: Deploy to Vercel

- [ ] **Step 1: Verify production build passes**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Push to remote**

```bash
git push origin master
```

If Vercel is connected to the repo, this triggers automatic deployment. If not, deploy manually:

```bash
npx vercel --prod
```

- [ ] **Step 3: Verify deployed site**

Check the live URL:
- Homepage loads with all sections
- Covers render with correct colors and grain
- Mobile responsive
- No console errors

---

## Implementation Notes

### For the implementing agent

1. **Always consult two documents** before making ambiguous decisions:
   - `RYKJUN-PROJECT-FRAMEWORK.md` (source of truth)
   - `docs/superpowers/specs/2026-03-23-portfolio-rebuild-design.md` (implementation spec)

2. **Font file names may vary.** The exact `.woff2` filenames depend on the download source. Update `layout.tsx` font paths to match actual filenames.

3. **The case study page (Task 13) is the hardest task.** The old `projects.ts` had a massive `Project` interface with editorial content, videos, process steps, etc. The new interface is minimal (covers only). You need to preserve the case study content somewhere. Options:
   - Create `src/constants/case-studies.ts` with the full data
   - Keep the old `Project` interface as `LegacyProject` alongside the new one
   - Inline the data in the case study page component

   Choose whichever is cleanest. This will be properly solved in v0.2 with an MDX content pipeline.

4. **The `hover-step` CSS class** requires both the class and an ink level class (e.g., `ink-secondary hover-step`). The hover effect shifts one step up. Make sure both classes are applied.

5. **SVG grain filter.** The grain filter is defined globally once in `layout.tsx`. All `GrainTexture` instances reference it via `url(#grain)`. No ID collision.

6. **Server Components by default.** The homepage, Cover, GrainTexture, and Footer are all Server Components. Only GlobalNav, MobileMenu, RouteAnnouncer, and SmoothScroll need `"use client"`. The `[data-cover]` hover effects are CSS-only.
