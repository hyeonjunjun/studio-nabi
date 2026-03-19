# HKJ Studio — Cinematic Redesign

**Date:** 2026-03-19
**Status:** Approved
**Author:** Ryan Jun + Claude

## 1. Overview

A complete visual and structural redesign of hkjstudio.com, shifting from a warm light editorial aesthetic to a cool dark cinematic direction. The site adopts a **layered register** approach: the homepage and transitions carry cinematic, atmospheric energy (video, mood, drama), while case studies and inner pages remain clean, typographic, and professional. Two registers that complement each other — you lead with feeling, then deliver substance.

### Design References

- **Cathydolle** (cathydolle.com) — Full-viewport List/Slider homepage pattern, minimal UX, opacity-based hover interactions, toggle between text list and visual slider
- **Tomoya Okada** (tomoya-okada.com) — Bold parallax, WebGL transitions, fluid expression, Lenis smooth scroll integration
- **Wuthering Waves** — Atmospheric depth, dramatic lighting, letterboxed framing, fog/particles, moody cinematic color grading

### What This Replaces

- Dictionary-style homepage (headword, phonetic, definitions) — removed entirely
- Warm light palette (#F5F2ED background) — replaced with cool dark
- Separate `/works` route — homepage absorbs project index; `/works` redirects to `/`
- Time-based theming (dawn/day/dusk/night) — replaced with single cool dark theme

## 2. Site Architecture

| Route | Register | Purpose |
|-------|----------|---------|
| `/` | Cinematic | Homepage — List/Slider project index, full-viewport, no scroll |
| `/work/[slug]` | Professional | Case study — clean editorial, magazine-spread layout |
| `/about` | Professional | About — typography-forward, single-column |
| `/coddiwomple` | Atmospheric | Visual explorations — masonry gallery, bridges both registers |
| `/works` | — | 301 redirect to `/` (backward compatibility) |

No separate `/works` page. The homepage IS the project index (Cathydolle pattern).

### Navigation Constants Update

```ts
// src/constants/navigation.ts
export const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Coddiwomple", href: "/coddiwomple" },  // renamed from "Coddiwompling" to match route
];

export const MENU_LINKS = [
  { label: "About", href: "/about" },
  { label: "Coddiwomple", href: "/coddiwomple" },
];
```

The "Work" link is removed — the homepage IS the work index. "Coddiwompling" label renamed to "Coddiwomple" to match the route path. Homepage chrome includes these same links.

## 3. Color Palette

Cool atmospheric dark theme. Single theme (no time-based variants).

| Token | Hex | Role |
|-------|-----|------|
| `--color-bg` | `#0C0D10` | Deep dark background |
| `--color-bg-rgb` | `12, 13, 16` | RGB decomposition for rgba() usage |
| `--color-surface` | `#141619` | Cards, elevated areas |
| `--color-elevated` | `#1A1E26` | Hover states, active surfaces |
| `--color-text` | `#D4D0CA` | Primary text (warm off-white) |
| `--color-text-rgb` | `212, 208, 202` | RGB decomposition for rgba() usage |
| `--color-text-secondary` | `#8A8580` | Secondary/supporting text |
| `--color-text-dim` | `#555250` | Tertiary text, inactive UI |
| `--color-text-ghost` | `#333130` | Subtle UI elements, dividers |
| `--color-accent` | `#8BA4B8` | Cool steel-blue accent |
| `--color-warm` | `#B89A78` | Warm accent (used sparingly) |

### Token Migration Table

| Old Token | Old Value | New Token | New Value | Action |
|-----------|-----------|-----------|-----------|--------|
| `--color-bg` | `#F5F2ED` | `--color-bg` | `#0C0D10` | Replace |
| `--color-bg-rgb` | `245, 242, 237` | `--color-bg-rgb` | `12, 13, 16` | Replace |
| `--color-surface` | `#EDE9E3` | `--color-surface` | `#141619` | Replace |
| `--color-text` | `#1A1917` | `--color-text` | `#D4D0CA` | Replace |
| `--color-text-rgb` | `26, 25, 23` | `--color-text-rgb` | `212, 208, 202` | Replace |
| `--color-text-secondary` | `#4A4540` | `--color-text-secondary` | `#8A8580` | Replace |
| `--color-text-dim` | `#7A756D` | `--color-text-dim` | `#555250` | Replace |
| `--color-text-ghost` | `#A8A29E` | `--color-text-ghost` | `#333130` | Replace |
| `--color-accent` | `#B8956A` | `--color-accent` | `#8BA4B8` | Replace |
| `--color-accent-2` | `#7D6B5D` | `--color-warm` | `#B89A78` | Rename + replace |
| `--color-ink` | `#E5E0D8` | — | — | Remove |
| `--color-border` | `rgba(text-rgb, 0.06)` | `--color-border` | `rgba(212,208,202, 0.06)` | Keep pattern, new values |
| `--color-border-strong` | `rgba(text-rgb, 0.12)` | `--color-border-strong` | `rgba(212,208,202, 0.12)` | Keep pattern, new values |
| `--ink` | `35, 32, 28` | `--ink` | `212, 208, 202` | Replace (inverted for dark bg) |
| `--ink-primary` through `--ink-whisper` | — | — | — | Keep scale, values auto-update via `--ink` |
| — | — | `--color-elevated` | `#1A1E26` | New token |
| Time-based palettes (dawn/day/dusk/night) | — | — | — | Remove entirely |

### WCAG Contrast Notes

- `--color-text` (#D4D0CA) on `--color-bg` (#0C0D10): **13.7:1** — passes AAA
- `--color-text-secondary` (#8A8580) on `--color-bg` (#0C0D10): **5.2:1** — passes AA
- `--color-text-dim` (#555250) on `--color-bg` (#0C0D10): **2.8:1** — decorative/non-essential text only
- `--color-accent` (#8BA4B8) on `--color-bg` (#0C0D10): **7.4:1** — passes AAA

### Grain Overlay

The existing noise grain overlay uses `mix-blend-mode: multiply` which is invisible on dark backgrounds. Change to:
- `mix-blend-mode: screen` at `opacity: 0.03` — subtle texture on dark surface
- Or `mix-blend-mode: overlay` at `opacity: 0.04` — slightly more visible alternative
- Also update `z-index` from `1` to `100` (see z-index strategy in Section 14)

## 4. Typography

Fonts remain unchanged. The restraint is the point.

| Font | Variable | Usage |
|------|----------|-------|
| GT Alpina | `--font-display` | Display serif — project titles in slider, email, headings, pull quotes |
| Sohne | `--font-sans` | Body sans — case study body, about page content |
| JetBrains Mono | `--font-mono` | Chrome UI — nav, counters, tags, list mode rows, labels, metadata |

### Type Scale (unchanged from current codebase)

```css
--text-display: clamp(1.6rem, 2.4vw, 2.2rem);
--text-h2: clamp(1.2rem, 1.6vw, 1.5rem);
--text-h3: clamp(0.95rem, 1.2vw, 1.1rem);
--text-body: 15px;
--text-small: clamp(0.72rem, 0.8vw, 0.78rem);
--text-micro: 10px;
```

Homepage chrome: `--text-micro` (10px) JetBrains Mono uppercase throughout.

### Spacing Tokens (unchanged)

```css
--page-px: clamp(1.5rem, 5vw, 5rem);
--section-py: clamp(8rem, 16vh, 14rem);
--row-py: clamp(2.5rem, 5.5vh, 5rem);
```

## 5. Homepage — List/Slider

Full-viewport, no scroll. Two view modes toggled by user.

### 5.1 List Mode (Default)

The default view. Clean text-only project index.

**Layout:**
- Full viewport height (`100dvh`)
- Single-column project rows, vertically centered
- Each row: `{number}  {title}  {tags}  {year}` in JetBrains Mono, `--text-micro`, uppercase
- Rows spaced with consistent gap (~28-32px)

**Interactions:**
- Hover a row: sibling rows fade to `opacity: 0.3`, hovered row stays `1.0`
- Click/tap navigates to case study with cinematic page transition
- Transition: `opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)` for hover fade

**Chrome:**
- Top-left: "hkj" wordmark (JetBrains Mono, `--text-micro`, uppercase)
- Top-right: nav links (About, Coddiwomple) — JetBrains Mono, `--text-micro`, uppercase
- Bottom-left: email in GT Alpina italic, `--text-small` size
- Bottom-right: location + List/Slider toggle
- Toggle: `[LIST]  SLIDER` or `LIST  [SLIDER]` — active state indicated by brackets or opacity difference

### 5.2 Slider Mode

Cinematic video/image card carousel. Each project gets a generous frame.

**Layout:**
- Full viewport, single card visible at a time
- Card contains ambient video loop OR static poster image (see Video Asset Matrix below)
- Video: `autoplay muted loop playsinline`, letterboxed (16:9 or 2.39:1 aspect)
- Next card peeks from right edge: ~60px on desktop, ~40px on tablet
- On mobile (<768px): no peek, card fills viewport width

**Card structure:**
```
┌─────────────────────────────────────────────┐
│                                             │
│           ┌───────────────────────┐         │
│           │                       │         │
│           │  Video Loop / Poster  │         │
│           │                       │         │
│           └───────────────────────┘         │
│                                             │
│  01                                         │
│  GYEOL · 결                                 │
│  MATERIAL · DIGITAL                  2026   │
└─────────────────────────────────────────────┘
```

- Number: JetBrains Mono, `--text-micro`, top of metadata
- Title: GT Alpina, `--text-display`, below number
- Tags + year: JetBrains Mono, `--text-micro`, bottom row

**Navigation:**
- Drag/swipe horizontally (Framer Motion drag)
- Arrow keys (left/right) with focus management
- Counter in bottom-right: `01 / 07`
- Same chrome as list mode (wordmark, nav, email, toggle)

**Transitions between modes:**
- List → Slider: rows dissolve, first card scales in from center
- Slider → List: card fades, rows stagger in
- Duration: 600-800ms, `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out)

### 5.3 Video Asset Matrix

| Project | `cardVideo` | `cardVideos` | Slider Fallback |
|---------|-------------|--------------|-----------------|
| GYEOL · 결 | `/assets/gyeol-broll3.mp4` | 4 clips | Video plays |
| CONDUCTOR | — | — | Static poster (project `image` or `cover.bg` gradient) |
| Sift: Digital Sanctuary | — | — | Static poster (`/images/sift-v2.jpg`) |
| Moji | — | — | Static poster (`cover.bg` gradient with title overlay) |
| 하나 Hana | — | — | Static poster (`cover.bg` gradient with title overlay) |
| Pour | — | — | Static poster (`cover.bg` gradient with title overlay) |
| Atlas | — | — | Static poster (`cover.bg` gradient with title overlay) |

**Fallback strategy:**
1. If `cardVideo` exists → play ambient video loop
2. Else if `image` exists and is non-empty → display as static poster in letterbox frame
3. Else → render a gradient card using `cover.bg` with the project title in GT Alpina centered

The slider mode works without video for all projects. Video is an enhancement, not a requirement. As the portfolio grows and video assets are created, the slider progressively becomes more cinematic.

## 6. Case Studies (`/work/[slug]`)

Professional register. Clean, editorial, trustworthy.

**Layout:**
- Existing 12-column magazine-spread grid
- Hero section at top: full-width project image or video (cinematic entry point)
- Body: Sohne, well-spaced, max ~700px reading width for text blocks
- Images span various column widths (full-bleed, 7-col, etc.)

**Palette application:**
- Same cool dark background (`--color-bg`)
- Text in `--color-text` (primary) and `--color-text-secondary`
- No atmospheric effects — typography and imagery do the work

**Navigation within:**
- "Next Project" link at bottom with cinematic transition to next case study
- Back to homepage via nav or browser back

## 7. About Page (`/about`)

Professional register. Typography-forward.

**Layout:**
- Single-column, max-width ~560px, centered
- GT Alpina for headings and callouts
- Sohne for body paragraphs
- JetBrains Mono for labels and metadata

**Content structure unchanged**, just palette swap to cool dark.

## 8. Coddiwomple (`/coddiwomple`)

Bridges cinematic and professional registers.

**Layout:**
- Masonry grid gallery (existing pattern)
- Cool dark palette applied
- Images carry the atmospheric weight

**Accessibility fix:** The current inline `opacity: 0` on gallery items (line ~89 of `coddiwomple/page.tsx`) hides content with no CSS fallback for users with reduced motion or JS disabled. Fix: set initial CSS to `opacity: 1`, add `@media (prefers-reduced-motion: no-preference)` block that sets `opacity: 0` for GSAP to animate. This ensures content is visible by default and only hidden when animation is available.

## 9. Navigation

### Global Nav
- Hidden on homepage (homepage has its own chrome)
- Visible on all inner pages
- Scroll-direction show/hide (scroll down = hide, scroll up = reveal)
- Dark transparent background with backdrop-blur on inner pages
- Links: JetBrains Mono, `--text-micro`, uppercase
- Remove the redundant desktop "Menu" button (currently visible on desktop with no responsive hiding)

### Mobile Menu
- Full-screen overlay on dark background (`--color-bg`)
- Same links as desktop nav
- Smooth open/close animation

### Mobile Homepage Chrome
- Top: "hkj" wordmark (left) + hamburger (right, triggers MobileMenu)
- Bottom: stacked — email on first line, toggle + location on second line
- Breakpoint: `<768px`

## 10. Page Transitions

Cinematic quality transitions between all pages.

**Mechanism:**
- Existing `TransitionLink` + Zustand store pattern (`isTransitioning`, `pendingRoute`, `startTransition`, `endTransition`)
- `PageTransition` component handles the overlay

**Animation:**
- Full-screen overlay fades in (`opacity 0 → 1`), content behind fades out
- Route changes while overlay is opaque
- Overlay fades out, new content fades in with staggered reveals
- Easing: `cubic-bezier(0.86, 0, 0.07, 1)` at 1-1.5s total duration
- Content entrance: elements stagger in with `[0.16, 1, 0.3, 1]` (expo-out) at 0.6-0.9s

**`prefers-reduced-motion`:** When reduced motion is preferred, skip the overlay animation entirely — instant route change with a simple opacity crossfade at 200ms.

## 11. Technology Stack

| Tool | Role | Notes |
|------|------|-------|
| Next.js 16 | Framework | App router, React 19 |
| Tailwind CSS v4 | Styling | Utility-first, custom tokens in globals.css |
| GSAP + ScrollTrigger | Animation | Scroll-triggered reveals, timeline sequences |
| Framer Motion | Transitions | AnimatePresence, layoutId, drag (slider), imperative animate |
| Lenis | Smooth scroll | Inner pages only (homepage is full-viewport, no scroll) |
| Zustand | State | isLoaded, navVisible, mobileMenuOpen, isTransitioning, viewMode |
| HTML5 Video | Slider cards | Self-hosted, optimized (compressed MP4, poster frames) |
| Three.js/WebGL | Future | Available for atmospheric effects if needed later |

### New State

Add to Zustand store:
- `viewMode: 'list' | 'slider'` — homepage view toggle
- `activeProjectIndex: number` — current project in slider mode

## 12. Components — What Changes

### New Components
| Component | Purpose |
|-----------|---------|
| `HomepageList` | List mode — project rows with hover fade |
| `HomepageSlider` | Slider mode — cinematic video card carousel |
| `HomepageChrome` | Shared top/bottom bars (wordmark, nav, email, toggle) |
| `ViewToggle` | List/Slider toggle control |
| `VideoCard` | Individual project card with video/poster, metadata overlay |

### Modified Components
| Component | Changes |
|-----------|---------|
| `GlobalNav` | Palette swap, remove redundant desktop "Menu" button |
| `MobileMenu` | Palette swap to cool dark |
| `PageTransition` | Enhanced cinematic animation (overlay + stagger), reduced-motion fallback |
| `globals.css` | Complete palette overhaul, remove time-based themes, update grain blend mode |

### Removed Components
| Component | Reason |
|-----------|--------|
| `Hero` | Dictionary concept replaced by HomepageList/Slider |
| `WorkIndex` | Absorbed into HomepageList |
| `TimeProvider` | Time-based theming removed |
| `PixelArt` | Time-based pixel art tied to removed theming system |
| `StudioPreloader` | Replaced — see Preloader section below |
| `ProjectCover` | No longer needed; slider cards handle project visuals |

### Removed Routes
| Route | Reason |
|-------|--------|
| `/works` | Homepage is now the project index (add 301 redirect) |

### Preloader

The existing `StudioPreloader` (image-split animation) is tied to the warm palette and dictionary concept. Replace with a minimal cinematic preloader:
- Dark screen with "hkj" wordmark fading in (JetBrains Mono, centered)
- Wordmark holds for ~0.8s, then fades out as homepage content fades in
- Total preloader duration: ~1.5s
- Uses the same cinematic easing: `cubic-bezier(0.86, 0, 0.07, 1)`
- Only plays on first visit (controlled by `isLoaded` in Zustand store)

## 13. Responsive Behavior

### Desktop (>1024px)
- Full layout as described
- Slider: drag + arrow key navigation, 60px peek
- List: hover fade interactions

### Tablet (768-1024px)
- Same layout, slightly tighter spacing
- Slider: swipe navigation, 40px peek
- List: tap to navigate (no hover on touch)

### Mobile (<768px)
- List mode: single column, full-width rows, tap to navigate
- Slider mode: full-width cards, swipe navigation, no peek (card fills viewport)
- Nav: hamburger → full-screen mobile menu
- Bottom bar: stacked (email above, toggle + location below)
- Page padding reduces to `--page-px` minimum (1.5rem)

## 14. Z-Index Strategy

| Layer | z-index | Element |
|-------|---------|---------|
| Base content | 0 | Page content, homepage list/slider |
| Grain overlay | 100 | `.noise-grain` (covers content, pointer-events: none) |
| Homepage chrome | 200 | `HomepageChrome` (wordmark, nav, bottom bar) |
| Global nav | 500 | `GlobalNav` on inner pages |
| Page transition | 9000 | `PageTransition` overlay |
| Mobile menu | 9500 | `MobileMenu` full-screen overlay |
| Preloader | 9999 | Preloader (highest, only on first load) |

## 15. Accessibility

- **Keyboard navigation:** Slider supports arrow keys (left/right) for card navigation. Focus is managed — when slider is active, it captures arrow key events. Tab moves between chrome elements (nav links, toggle, email).
- **Screen reader:** Each video card has `aria-label` describing the project (e.g., "Project 1 of 7: GYEOL, Material and Digital, 2026"). Videos are decorative (`aria-hidden="true"`, no captions needed for ambient loops). The List/Slider toggle uses `role="tablist"` with `role="tab"` for each option.
- **`prefers-reduced-motion`:** All GSAP/Framer Motion animations check `prefers-reduced-motion: reduce`. When active: no page transition overlay, no staggered reveals, no slider drag physics — just instant state changes with simple opacity fades at 200ms.
- **Coddiwomple fix:** Items default to `opacity: 1` in CSS. GSAP animation only runs inside `@media (prefers-reduced-motion: no-preference)`.
- **Color contrast:** All text/background combinations meet WCAG AA minimum (see Section 3 WCAG notes). `--color-text-dim` is used only for decorative/non-essential text.

## 16. Performance Considerations

- **Video optimization:** Compress slider videos aggressively (target <5MB per clip, 10-15s loops, 720p max). Use `poster` attribute for instant visual before video loads. Only load video for the active card + adjacent cards.
- **Preloading:** Preload the next/prev video in slider mode. Videos for non-adjacent cards load on demand.
- **No WebGL on initial load:** Three.js is available but not loaded until explicitly needed.
- **Lighthouse target:** Performance score >80 measured on List mode (default). Slider mode with video is expected to have slightly higher LCP but should remain >70.
- **Existing optimizations:** GSAP/Lenis sync pattern, Tailwind purging, Next.js image optimization all continue.

## 17. Success Criteria

1. Homepage loads and displays list mode within 2s on broadband
2. List/Slider toggle feels instant (<300ms visual response)
3. Slider video cards play without visible buffering on broadband
4. Page transitions feel cinematic — smooth, intentional, not janky
5. Case studies are readable and professional — no atmosphere getting in the way of content
6. Mobile experience is polished — swipe works, text is legible, no layout breaks
7. Lighthouse performance score >80 (list mode), >70 (slider mode)
8. All text meets WCAG AA contrast on `--color-bg`
9. Site is fully navigable via keyboard
10. `prefers-reduced-motion` users get a functional, non-animated experience

## 18. Implementation Order

Dependencies flow top-to-bottom. Each step must be complete before the next begins.

1. **`globals.css` palette swap** — All token replacements from migration table. Remove time-based themes. Update grain overlay. This unblocks everything else.
2. **Remove `TimeProvider`, `PixelArt`** — Clean up removed components from layout.tsx. Also remove `timePeriod`, `timeOverride`, and `TimePeriod` type from Zustand store (`src/lib/store.ts`)
3. **`HomepageChrome`** — Shared chrome (wordmark, nav links, email, toggle) used by both modes
4. **`HomepageList`** — List mode with project rows and hover fade
5. **`ViewToggle`** — Toggle control wired to Zustand `viewMode`
6. **`VideoCard`** — Individual card with video/poster fallback
7. **`HomepageSlider`** — Slider carousel using VideoCard, drag/swipe, arrow keys
8. **Wire homepage** — Replace Hero with HomepageList/Slider, connect chrome
9. **`PageTransition` upgrade** — Enhanced cinematic overlay + stagger
10. **Preloader replacement** — Minimal "hkj" fade preloader
11. **`GlobalNav` + `MobileMenu`** — Palette swap, remove "Menu" button
12. **Inner pages palette** — About, Coddiwomple, case studies, 404
13. **`/works` redirect** — Add redirect, update navigation constants
14. **Accessibility pass** — Reduced motion, ARIA labels, keyboard nav, contrast audit
15. **Remove dead code** — Hero, WorkIndex, StudioPreloader, ProjectCover, old routes
