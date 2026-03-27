# Contact Sheet Portfolio Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fresh single-screen contact sheet portfolio with 14-item dense grid, framer-motion animations, and layoutId page transitions.

**Architecture:** Fresh build keeping fonts, palette, constants, and case study data. All components rebuilt. Homepage is one viewport with no scroll — a CSS Grid of 14 project thumbnails with hover-to-magnify interaction. framer-motion handles all animation (springs, layoutId, AnimatePresence). Inner pages use Lenis smooth scroll.

**Tech Stack:** Next.js 16, TypeScript, Tailwind v4, framer-motion, Lenis, Zustand

---

## File Structure

### New files
- `src/components/ContactSheet.tsx` — The 14-item grid container
- `src/components/SheetItem.tsx` — Individual thumbnail with hover/caption
- `src/components/BlueDot.tsx` — Pulsing blue starting indicator
- `src/components/BottomBar.tsx` — Fixed bottom info bar
- `src/components/PageTransition.tsx` — AnimatePresence route wrapper (rewritten)
- `src/constants/sheet-items.ts` — Grid configuration (14 items with positions, types, images)

### Rewritten (same path, new content)
- `src/app/globals.css` — Simplified: ink tokens, spacing, font utilities, grid styles
- `src/app/layout.tsx` — Simplified: fonts, nav, AnimatePresence wrapper
- `src/app/page.tsx` — ContactSheet + BlueDot + BottomBar only
- `src/components/GlobalNav.tsx` — Minimal: HKJ left, ABOUT right
- `src/components/MobileMenu.tsx` — Simplified overlay
- `src/app/work/[slug]/page.tsx` — Rebuilt with framer-motion reveals + layoutId hero
- `src/app/exploration/page.tsx` — Rebuilt with framer-motion
- `src/app/writing/page.tsx` — Rebuilt with framer-motion
- `src/app/writing/[slug]/page.tsx` — Rebuilt with framer-motion
- `src/app/about/page.tsx` — Rebuilt with framer-motion
- `src/lib/store.ts` — Minimal: mobile menu only

### Kept as-is
- `src/fonts/` — All 3 font files
- `src/constants/projects.ts` — Project data
- `src/constants/case-studies.ts` — Case study editorial data
- `src/constants/explorations.ts` — Exploration data
- `src/constants/journal.ts` — Journal entries
- `src/constants/contact.ts` — Email + socials
- `src/constants/navigation.ts` — Nav links
- `src/components/RouteAnnouncer.tsx` — ARIA announcer
- `src/hooks/useReducedMotion.ts` — Accessibility hook
- `src/lib/utils.ts` — Utilities
- `public/images/` — All webp assets
- `public/assets/` — Videos

### Deleted
- `src/components/Cover.tsx`
- `src/components/DissolveImage.tsx`
- `src/components/GrainTexture.tsx`
- `src/components/MasonryGrid.tsx`
- `src/components/ProjectList.tsx`
- `src/components/Footer.tsx`
- `src/components/Preloader.tsx`
- `src/components/PreloaderWrapper.tsx`
- `src/components/TransitionLink.tsx`
- `src/components/TransitionManager.tsx`
- `src/components/TransitionManagerWrapper.tsx`
- `src/components/SmoothScroll.tsx` (Lenis will be re-added for inner pages only)
- `src/lib/animations.ts`
- `src/lib/timemode.ts`
- `src/lib/gsap.ts`
- `src/constants/now-playing.ts`
- `src/constants/now.ts`
- Any remaining dead components (Vinyl, KineticText, Cursor, WallLight, etc.)

---

## Chunk 1: Foundation — Dependencies, Cleanup, Tokens

### Task 1: Swap dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install framer-motion**

```bash
cd "c:/Users/Ryan Jun/.gemini/antigravity/scratch/hkjstudio"
npm install framer-motion
```

- [ ] **Step 2: Remove GSAP and related packages**

```bash
npm uninstall gsap @gsap/react 2>/dev/null
```

If gsap isn't a direct dependency (might be), check package.json first. Remove whatever GSAP-related packages exist.

- [ ] **Step 3: Verify lenis and zustand remain**

```bash
npm list lenis zustand
```

Expected: both listed. If lenis is missing, install it: `npm install lenis`

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: swap gsap for framer-motion"
```

### Task 2: Delete dead components and files

**Files:**
- Delete: All files listed in "Deleted" section above

- [ ] **Step 1: Delete all dead component files**

```bash
cd "c:/Users/Ryan Jun/.gemini/antigravity/scratch/hkjstudio"
rm -f src/components/Cover.tsx \
      src/components/DissolveImage.tsx \
      src/components/GrainTexture.tsx \
      src/components/MasonryGrid.tsx \
      src/components/ProjectList.tsx \
      src/components/Footer.tsx \
      src/components/Preloader.tsx \
      src/components/PreloaderWrapper.tsx \
      src/components/TransitionLink.tsx \
      src/components/TransitionManager.tsx \
      src/components/TransitionManagerWrapper.tsx \
      src/components/SmoothScroll.tsx
```

- [ ] **Step 2: Delete dead lib files**

```bash
rm -f src/lib/animations.ts src/lib/timemode.ts src/lib/gsap.ts
rm -f src/constants/now-playing.ts src/constants/now.ts
```

- [ ] **Step 3: Delete any remaining dead components from previous iterations**

```bash
# Check for and remove any lingering files
rm -f src/components/Vinyl.tsx \
      src/components/KineticText.tsx \
      src/components/Cursor.tsx \
      src/components/CursorWrapper.tsx \
      src/components/WallLight.tsx \
      src/components/WallLightWrapper.tsx \
      src/components/BuildingOverlay.tsx \
      src/components/WatercolorSkyline.tsx \
      src/components/CloudCanvas.tsx \
      src/components/MeadowCanvas.tsx \
      src/components/LivingInk.tsx \
      src/components/NowPlaying.tsx \
      src/components/NYCClock.tsx \
      src/components/TimeModeProvider.tsx
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: delete all dead components and libs from v1"
```

### Task 3: Rewrite globals.css

**Files:**
- Rewrite: `src/app/globals.css`

- [ ] **Step 1: Replace globals.css entirely**

The new globals.css should contain ONLY:
- `@import "tailwindcss";`
- `:root` with ink palette tokens (paper, ink-full through ink-whisper, ink-rgb, accent-blue)
- Font custom properties (--font-display, --font-body, --font-mono)
- Text scale (--text-name: 14px, --text-title: 18px, --text-body: 15px, --text-nav: 13px, --text-label: 11px, --text-meta: 10px, --text-caption: 13px)
- Tracking (--tracking-label: 0.06em)
- Leading (--leading-display: 1.2, --leading-body: 1.7)
- Spacing scale (micro through breath, matching spec)
- Easing (--ease-swift: cubic-bezier(.23, .88, .26, .92))
- Base styles: `html, body { height: 100%; background: var(--paper); color: var(--ink-primary); }` and `body { font-family: var(--font-body); font-size: var(--text-body); line-height: var(--leading-body); overflow: hidden; }` — note `overflow: hidden` prevents page scroll
- Font utility classes (.font-display, .font-body, .font-mono)
- Selection styles
- Skip-to-content
- Focus-visible styles
- `@media (prefers-reduced-motion: reduce)` disabling all transitions

NO: scroll reveal classes, cover card styles, grain overlays, night mode tokens, section padding utilities.

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "style: rewrite globals.css — minimal ink tokens, no scroll"
```

### Task 4: Create sheet-items.ts configuration

**Files:**
- Create: `src/constants/sheet-items.ts`

- [ ] **Step 1: Create the grid item configuration**

This file defines all 14 items in the contact sheet grid. Each item has: `id`, `title`, `type` ("WORK" | "BRAND" | "EXPLORE"), `image` (path or null for color field), `color` (for placeholders), `href` (link destination or null), `description`, `year`, `wide` (boolean, true for span-2 items).

```typescript
export interface SheetItemData {
  id: string;
  title: string;
  type: "WORK" | "BRAND" | "EXPLORE";
  image: string | null;
  color?: string;
  href: string | null;
  description: string;
  year: string;
  wide?: boolean;
  wip?: boolean;
}

export const SHEET_ITEMS: SheetItemData[] = [
  {
    id: "gyeol",
    title: "GYEOL: 결",
    type: "WORK",
    image: "/images/gyeol-display-hanji.webp",
    href: "/work/gyeol",
    description: "material typography system exploring Korean craft and texture.",
    year: "2026",
  },
  {
    id: "sift",
    title: "Sift",
    type: "WORK",
    image: "/images/sift-v2.webp",
    href: "/work/sift",
    description: "an AI-powered tool for finding what matters in your camera roll.",
    year: "2025",
  },
  {
    id: "conductor",
    title: "Conductor",
    type: "WORK",
    image: null,
    color: "#3d3830",
    href: "/work/conductor",
    description: "a design system that orchestrates consistency across product surfaces.",
    year: "2026",
    wip: true,
  },
  {
    id: "brand-a",
    title: "Brand A",
    type: "BRAND",
    image: null,
    color: "#8B7355",
    href: null,
    description: "coming soon.",
    year: "2026",
    wide: true,
  },
  {
    id: "spring-grain",
    title: "Spring Grain",
    type: "EXPLORE",
    image: "/images/gyeol-spring.webp",
    href: null,
    description: "cherry blossom season captured in surface tension.",
    year: "2026",
  },
  {
    id: "brand-b",
    title: "Brand B",
    type: "BRAND",
    image: null,
    color: "#6B7B6B",
    href: null,
    description: "coming soon.",
    year: "2026",
    wide: true,
  },
  {
    id: "rain-on-stone",
    title: "Rain on Stone",
    type: "EXPLORE",
    image: "/images/gyeol-rain.webp",
    href: null,
    description: "wet granite. the way water reveals what was always there.",
    year: "2026",
  },
  {
    id: "hanji-display",
    title: "Hanji Display",
    type: "EXPLORE",
    image: "/images/gyeol-display-hanji.webp",
    href: null,
    description: "Korean mulberry paper — light passes through, never pierces.",
    year: "2026",
  },
  {
    id: "green-tea",
    title: "Green Tea",
    type: "EXPLORE",
    image: "/images/gyeol-green-tea.webp",
    href: null,
    description: "matcha as material. the green that calms before you taste it.",
    year: "2026",
  },
  {
    id: "cushion",
    title: "Cushion",
    type: "EXPLORE",
    image: "/images/cushion-gyeol.webp",
    href: null,
    description: "softness rendered. where does the surface end and the light begin?",
    year: "2025",
  },
  {
    id: "clouds-at-sea",
    title: "Clouds at Sea",
    type: "EXPLORE",
    image: "/assets/cloudsatsea.mp4",
    href: null,
    description: "somewhere between water and sky, the horizon dissolves.",
    year: "2026",
  },
  {
    id: "project-d",
    title: "Project D",
    type: "WORK",
    image: null,
    color: "#4A4540",
    href: null,
    description: "coming soon.",
    year: "2026",
  },
  {
    id: "project-e",
    title: "Project E",
    type: "WORK",
    image: null,
    color: "#5A5550",
    href: null,
    description: "coming soon.",
    year: "2026",
  },
  {
    id: "brand-c",
    title: "Brand C",
    type: "BRAND",
    image: null,
    color: "#7A6B5A",
    href: null,
    description: "coming soon.",
    year: "2026",
  },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/constants/sheet-items.ts
git commit -m "feat: add contact sheet grid item configuration"
```

---

## Chunk 2: Core Components — ContactSheet, SheetItem, BlueDot

### Task 5: Create SheetItem component

**Files:**
- Create: `src/components/SheetItem.tsx`

- [ ] **Step 1: Build the SheetItem component**

A `"use client"` component that renders a single thumbnail in the grid. Props: the `SheetItemData` object + `isFirst` boolean (for blue dot positioning).

Key behaviors:
- Uses `motion.div` with `whileHover={{ scale: 1.05, zIndex: 10 }}` and spring transition `{ type: "spring", stiffness: 400, damping: 30 }`
- On hover: shows type tag (WORK/BRAND/EXPLORE) at bottom-right corner with `motion.span` fade-in
- After 300ms hover (use `useState` + `useEffect` with timeout): shows caption panel below with title, description, "View →" link
- On leave: clear timeout, hide caption, type tag fades out
- Image: Next.js `<Image>` with `fill`, `object-cover`, `sizes` prop, `border-radius: 6px`
- Color field items: render a `div` with `backgroundColor` and subtle grain overlay (CSS `background-image: url("data:image/svg+xml,...")` noise pattern)
- WIP badge: if `wip: true`, show "IN PROGRESS" tag at top-right
- If `href` exists, the entire item is wrapped in `<Link>` with `layoutId={item.id}` on the image for page transition
- Shadow on hover: `boxShadow: "0 8px 32px rgba(35, 32, 28, 0.08)"`
- `aspect-ratio: 1` on the container (square by default, wide items are 2:1 via parent grid)
- Respect `prefers-reduced-motion` via the `useReducedMotion` hook — if true, no scale/spring, just opacity changes

- [ ] **Step 2: Commit**

```bash
git add src/components/SheetItem.tsx
git commit -m "feat: add SheetItem — thumbnail with hover magnify + caption"
```

### Task 6: Create BlueDot component

**Files:**
- Create: `src/components/BlueDot.tsx`

- [ ] **Step 1: Build the BlueDot component**

A `"use client"` component. Renders an 8px circle with `background: var(--accent-blue)`.

- Positioned absolutely, centered above the first grid item (pass position via CSS or parent)
- Pulse animation via framer-motion: `animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}` with `transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}`
- On hover: shows tooltip "start here" in Fragment Mono 9px via `motion.span` with spring entry
- Tooltip disappears on mouse leave

- [ ] **Step 2: Commit**

```bash
git add src/components/BlueDot.tsx
git commit -m "feat: add BlueDot — pulsing accent indicator"
```

### Task 7: Create ContactSheet component

**Files:**
- Create: `src/components/ContactSheet.tsx`

- [ ] **Step 1: Build the ContactSheet component**

A `"use client"` component. Renders the CSS Grid of 14 `SheetItem` components.

- CSS Grid: `gridTemplateColumns: "repeat(5, 1fr)"`, `gap: "8px"`, `maxWidth: "1200px"`, `margin: "0 auto"`, `padding: "0 24px"`
- The grid is vertically centered in the viewport using flexbox on the parent: `display: flex`, `alignItems: center`, `minHeight: calc(100vh - 48px - 32px)` (minus nav and bottom bar)
- Wide items get `gridColumn: "span 2"` via inline style based on `item.wide`
- Renders `BlueDot` positioned above the first item (use `position: relative` on first item wrapper with BlueDot absolutely positioned above)
- Load animation: each `SheetItem` wrapped in `motion.div` with `initial={{ opacity: 0, scale: 0.9 }}`, `animate={{ opacity: 1, scale: 1 }}`, `transition={{ delay: index * 0.03, type: "spring", stiffness: 300, damping: 25 }}`
- Mobile: at `<768px`, grid switches to `repeat(3, 1fr)` via CSS media query or Tailwind responsive

- [ ] **Step 2: Commit**

```bash
git add src/components/ContactSheet.tsx
git commit -m "feat: add ContactSheet — 14-item dense grid with stagger entrance"
```

---

## Chunk 3: Layout, Nav, Homepage

### Task 8: Rewrite GlobalNav

**Files:**
- Rewrite: `src/components/GlobalNav.tsx`

- [ ] **Step 1: Rewrite GlobalNav as minimal nav**

`"use client"` component. Fixed top, 48px height, transparent background, `z-index: 100`.

- Left: `HKJ` — `<Link href="/">`, Satoshi Medium, 14px, `--ink-full`
- Right: `ABOUT` — `<Link href="/about">`, Fragment Mono, 11px, uppercase, `letter-spacing: 0.06em`, `--ink-secondary`
- Hover on both: opacity transition to `--ink-full`, 150ms
- Mobile (<768px): add hamburger button that opens MobileMenu via Zustand store
- No scroll-hide, no backdrop blur, no clock, no now-playing

- [ ] **Step 2: Commit**

```bash
git add src/components/GlobalNav.tsx
git commit -m "feat: rewrite GlobalNav — minimal HKJ + ABOUT"
```

### Task 9: Create BottomBar

**Files:**
- Create: `src/components/BottomBar.tsx`

- [ ] **Step 1: Build the BottomBar component**

Server component (no "use client" needed). Fixed bottom, 32px height, `z-index: 100`.

- Left: `design engineer · brands · software` — Fragment Mono, 10px, `--ink-muted`
- Right: `NYC` — Fragment Mono, 10px, `--ink-muted`
- Flex layout: `justify-between`, `align-center`, padding `0 24px`

- [ ] **Step 2: Commit**

```bash
git add src/components/BottomBar.tsx
git commit -m "feat: add BottomBar — fixed bottom info bar"
```

### Task 10: Rewrite MobileMenu

**Files:**
- Rewrite: `src/components/MobileMenu.tsx`

- [ ] **Step 1: Rewrite MobileMenu**

`"use client"` component. Uses Zustand store for open/close state.

- Fixed overlay, inset 0, z-index 9500, `background: var(--paper)`
- Framer-motion: `AnimatePresence` + `motion.div` with `initial={{ opacity: 0 }}`, `animate={{ opacity: 1 }}`, `exit={{ opacity: 0 }}`, spring transition
- Links: Work (href="/"), Exploration (/exploration), Writing (/writing), About (/about)
- Font: Newsreader italic, clamp(22px, 5vw, 28px), centered, stacked with 24px gap
- Contact email + socials at bottom in Fragment Mono
- Close on: Escape key, route change (usePathname effect), close button
- Focus trap: on open, focus first link. Tab wraps within menu.
- Body scroll lock: not needed (homepage has no scroll anyway)

- [ ] **Step 2: Commit**

```bash
git add src/components/MobileMenu.tsx
git commit -m "feat: rewrite MobileMenu — framer-motion, minimal"
```

### Task 11: Rewrite layout.tsx

**Files:**
- Rewrite: `src/app/layout.tsx`

- [ ] **Step 1: Rewrite root layout**

Keep the 3 font declarations (localFont for Newsreader, Satoshi, Fragment Mono). Keep metadata.

Body contains:
- Skip-to-content link
- `RouteAnnouncer`
- `GlobalNav`
- `<main id="main">{children}</main>`
- NO SmoothScroll wrapper on homepage (add Lenis only on inner page layouts later)
- NO Preloader, NO TransitionManager, NO TimeModeProvider
- NO SVG grain filter (not needed in v2)

- [ ] **Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "refactor: rewrite layout — minimal, no preloader or transitions"
```

### Task 12: Rewrite homepage

**Files:**
- Rewrite: `src/app/page.tsx`

- [ ] **Step 1: Rewrite the homepage**

Simple server component (or client if needed for ContactSheet). Contains:
- `<ContactSheet />` — the grid
- `<BottomBar />` — fixed bottom

That's it. No hero, no sections, no footer. The ContactSheet IS the page.

The page wrapper should have: `display: flex`, `flexDirection: column`, `height: 100vh`, `overflow: hidden` — ensuring no scroll and the grid centers between nav and bottom bar.

- [ ] **Step 2: Verify the homepage renders**

```bash
npm run dev
# Open localhost:3000 — should see the 14-item grid with blue dot
```

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: rewrite homepage — contact sheet grid, single screen"
```

---

## Chunk 4: Inner Pages + Page Transitions

### Task 13: Rebuild case study page with framer-motion

**Files:**
- Rewrite: `src/app/work/[slug]/page.tsx`

- [ ] **Step 1: Rewrite case study page**

Keep all the existing content rendering logic (editorial, process, highlights, videos from CASE_STUDIES). Replace all GSAP animations with framer-motion:

- Hero image: `<motion.div layoutId={slug}>` wrapping the `<Image>` — this enables the layoutId morph from the grid
- Each content section: `<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: [.22, 1, .36, 1] }}>`
- Back link at top: "← Back" linking to `/`
- Remove all GSAP imports, ScrollTrigger, useEffect animations
- Add `overflow: auto` to the page wrapper (this page DOES scroll, unlike homepage)

- [ ] **Step 2: Commit**

```bash
git add src/app/work/[slug]/page.tsx
git commit -m "feat: rebuild case study page with framer-motion reveals"
```

### Task 14: Rebuild exploration page

**Files:**
- Rewrite: `src/app/exploration/page.tsx`

- [ ] **Step 1: Rewrite exploration page**

Flat gallery grid. 3 columns. Non-clickable images with captions.

- Uses `EXPLORATIONS` from constants
- CSS Grid: `repeat(3, 1fr)`, gap 16px, max-width 1200px centered
- Each item: `<motion.div>` with `whileInView` fade-in reveal
- Image + caption (title + medium + date) below
- Page wrapper: `overflow: auto` (this page scrolls)

- [ ] **Step 2: Commit**

```bash
git add src/app/exploration/page.tsx
git commit -m "feat: rebuild exploration gallery with framer-motion"
```

### Task 15: Rebuild writing pages

**Files:**
- Rewrite: `src/app/writing/page.tsx`
- Rewrite: `src/app/writing/[slug]/page.tsx`

- [ ] **Step 1: Rewrite writing list page**

Keep the tag filter + entry list structure. Replace GSAP with framer-motion `whileInView` reveals. Use `AnimatePresence` for filter transitions (entries fade in/out when tag changes).

- [ ] **Step 2: Rewrite writing detail page**

Keep the body rendering. Replace GSAP with framer-motion reveals. Add back link to `/writing`.

- [ ] **Step 3: Commit**

```bash
git add src/app/writing/
git commit -m "feat: rebuild writing pages with framer-motion"
```

### Task 16: Rebuild about page

**Files:**
- Rewrite: `src/app/about/page.tsx`

- [ ] **Step 1: Rewrite about page**

Keep content. Replace animations with framer-motion `whileInView` reveals. Single scrolling page with section reveals.

- [ ] **Step 2: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: rebuild about page with framer-motion"
```

---

## Chunk 5: Build Verification + Deploy

### Task 17: Full build check

**Files:**
- None (verification only)

- [ ] **Step 1: Run build**

```bash
cd "c:/Users/Ryan Jun/.gemini/antigravity/scratch/hkjstudio"
npm run build
```

Expected: All routes compile. No errors.

- [ ] **Step 2: Fix any build errors**

If errors exist, fix them. Common issues:
- Imports referencing deleted files
- Missing "use client" directives
- Type errors from changed interfaces

- [ ] **Step 3: Test all routes**

```bash
npm run dev
# Test: /, /work/gyeol, /work/sift, /exploration, /writing, /writing/on-restraint, /about
```

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve build errors from v2 rebuild"
```

### Task 18: Push and deploy

- [ ] **Step 1: Push to remote**

```bash
git push origin master
```

- [ ] **Step 2: Verify Vercel deployment**

Check that Vercel picks up the push and deploys successfully.
