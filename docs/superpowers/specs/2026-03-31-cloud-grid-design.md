# The Cloud Grid — Design Framework

> JSP's multi-column card grid architecture. Cloud photography background. Frosted glass cards. Hover image cycling. Subtle drift animation. Framework only — media is placeholder.

## Reference Architecture

**jinsupark.com (OA1):**
- Multi-column grid of project cards (7 columns on wide screens)
- Dark semi-transparent cards on a blurred background
- Each card: number, project title, description, client, year, category tag
- Hover: card cycles through project images
- Mixed content cards: statement card, showreel card, logo card live in the grid alongside projects
- Top bar: logo, live data (NYC temp, timezone), git commit hash
- Bottom bar: filters (All, Product, AI, Brand, Graphic, Web, Creative) + bio text
- The grid IS the page. One view. Everything visible.

**sanrita.ca:**
- Full-viewport immersive visual (terrain map)
- Navigation sidebar with icon + text links
- "Scroll to enter our world" invitation
- Live clock, editorial labels along edges
- The visual IS the brand

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│ BACKGROUND: cloud photography (full-bleed, fixed)        │
│                                                          │
│ ┌─ TOP BAR ──────────────────────────────────────────┐   │
│ │ [mark]  [live data]           [nav links]          │   │
│ └────────────────────────────────────────────────────┘   │
│                                                          │
│ ┌─ GRID ─────────────────────────────────────────────┐   │
│ │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │   │
│ │ │ 01  │ │ 02  │ │ 03  │ │ 04  │ │ 05  │ │ 06  │  │   │
│ │ │proj │ │proj │ │proj │ │STMT │ │proj │ │proj │  │   │
│ │ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘  │   │
│ │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │   │
│ │ │proj │ │proj │ │REEL │ │proj │ │proj │ │MARK │  │   │
│ │ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘  │   │
│ └────────────────────────────────────────────────────┘   │
│                                                          │
│ ┌─ BOTTOM BAR ───────────────────────────────────────┐   │
│ │ [filters]                              [bio/info]  │   │
│ └────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

**Single page. No scroll (or minimal scroll on smaller screens).** The grid fills the viewport. Like JSP.

---

## Background Layer

- Full-viewport cloud photograph, `position: fixed`, `z-index: 0`
- `object-fit: cover`, `width: 100vw`, `height: 100vh`
- Subtle CSS animation: `background-position` shifts slowly over 60-120s, loops. Creates drift.
- Alternative: 2-3 cloud layers at different `z` with parallax on mousemove (cursor-reactive). More immersive but heavier.
- Light, bright clouds — daytime sky. NOT dark/moody.
- Placeholder: solid `#e8e4e0` or a CSS gradient (`#ddd` to `#f5f5f5`) until you add the actual cloud photo.

**Dark mode:** Switch to a dusk/night cloud photo. Or invert to a dark gradient placeholder.

---

## Top Bar

```
[HKJ]    [New York · 12:34 PM]              [LinkedIn] [GitHub] [Connect] [About]
```

- `position: fixed`, `top: 0`, `z-index: 100`
- Full-width, `padding: 12px var(--gutter)`
- Font: mono, 11px
- Background: `transparent` or very subtle `backdrop-filter: blur(8px)` if readability needs it
- Mark: left, `color: var(--fg)`, weight 500
- Live data: left-center, `color: var(--fg-3)` — simple time readout, not the A Million Times clock. The clock can be a separate page/experiment.
- Nav links: right, `color: var(--fg-3)`, hover `var(--fg)`

---

## Card Grid

**Grid system:**
- `display: grid`
- Desktop (>1200px): `grid-template-columns: repeat(6, 1fr)` — 6 columns
- Laptop (900-1200px): `repeat(4, 1fr)` — 4 columns
- Tablet (600-900px): `repeat(3, 1fr)` — 3 columns
- Mobile (<600px): `repeat(2, 1fr)` — 2 columns
- Gap: `clamp(6px, 1vw, 12px)` — tight, like JSP
- Padding: `var(--gutter)` on all sides
- Margin-top: enough to clear the fixed top bar (~52px)

**The grid should fill the viewport.** Cards size to fill available space. If content overflows on small screens, allow vertical scroll.

### Project Card

```
┌─────────────────────────┐
│ 01                   BD │  ← number + tag
│                         │
│ Conceptual fragrance    │  ← project description
│ and e-commerce brand    │
│ GYEOL                   │  ← client/project name
│                         │
│ 2026               --   │  ← year + status indicator
└─────────────────────────┘
```

**Card styling:**
- Background: `rgba(var(--bg-rgb), 0.6)` — semi-transparent
- `backdrop-filter: blur(12px)` — frosted glass
- Border: `1px solid rgba(var(--fg-rgb), 0.06)` — barely visible edge
- `border-radius: 4px`
- Padding: `clamp(12px, 1.5vw, 20px)`
- Font: mono, 11px for metadata (number, tag, year), mono 11px for description, mono 12px weight 500 for project name
- Color: `var(--fg)` for name, `var(--fg-2)` for description, `var(--fg-3)` for number/tag/year
- Cursor: pointer

**Hover state:**
- Background shifts to `rgba(var(--bg-rgb), 0.75)` — slightly more opaque
- If the project has images: the card background transitions to the project image, cycling through available images (every 2 seconds). Image covers the card, text overlays with a subtle dark gradient at bottom for readability.
- If no images: card just brightens slightly
- Transition: `background 0.3s var(--ease), backdrop-filter 0.3s var(--ease)`

**Hover image cycling (JSP's signature interaction):**
- On mouseenter: start cycling through `piece.image` (and any additional images you add later)
- Each image fades in over 400ms
- On mouseleave: return to text-only card
- Implementation: state tracks `hoveredSlug`, an interval cycles an image index, images are absolutely positioned inside the card with `opacity` transitions

### Statement Card

Mixed into the grid. Same dimensions as a project card, but contains:
```
┌─────────────────────────┐
│                         │
│ Build with intention    │  ← display font, larger
│ Make things that        │
│ feel right              │
│                         │
│ Curated works...        │  ← mono, small, muted
└─────────────────────────┘
```

- Same frosted glass treatment
- Headline: body/display font, `clamp(16px, 2vw, 24px)`, weight 500, `color: var(--fg)`
- Subtitle: mono, 10px, `color: var(--fg-3)`
- Can span 2 columns on desktop: `grid-column: span 2`

### Showreel Card (optional slot)

```
┌─────────────────────────┐
│                         │
│ Studio Showreel         │
│ Watch showreel →        │
│                         │
└─────────────────────────┘
```

- Links to a video or external URL
- Same card treatment
- You fill this when ready

### Mark Card (optional slot)

```
┌─────────────────────────┐
│                         │
│        HKJ              │  ← large mark
│                         │
│ © HKJ Studio — Est.2025 │
└─────────────────────────┘
```

- Your brand mark, large
- Copyright/establishment
- Can span 2 columns

---

## Bottom Bar

```
[All] [Product] [Brand] [Lab]                [bio text — one line]
```

- `position: fixed`, `bottom: 0`, `z-index: 100`
- Full-width, `padding: 12px var(--gutter)`
- Font: mono, 11px
- Background: transparent or subtle blur
- Filters: left-aligned. Active: `var(--fg)`, inactive: `var(--fg-3)`
- Bio: right-aligned, `var(--fg-3)`, one line, truncated on mobile

---

## Design Tokens

```css
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
  --card-bg-hover: rgba(255, 255, 255, 0.75);
  --card-blur: 12px;
  --card-border: rgba(26, 25, 23, 0.06);
  --card-radius: 4px;
}

html.dark {
  --bg: #0c0b09;
  --bg-rgb: 12, 11, 9;
  --fg: #e8e4dc;
  --fg-rgb: 232, 228, 220;
  /* ... corresponding dark values ... */
  --card-bg: rgba(12, 11, 9, 0.6);
  --card-bg-hover: rgba(12, 11, 9, 0.75);
  --card-border: rgba(232, 228, 220, 0.06);
}
```

---

## Interactions Summary

| Element | Interaction | Timing |
|---------|------------|--------|
| Project card hover | bg brightens, image cycling starts | 300ms transition, 2s per image |
| Project card click | navigates to /projects/[slug] | instant |
| Filter click | grid filters to category | cards fade out/in 300ms |
| Background clouds | slow drift animation | 60-120s loop |
| Card entrance | staggered fade-in on page load | 60ms per card, 400ms each |
| Non-hovered cards | dim to opacity 0.6 when any card hovered | 300ms |
| Top/bottom bar links | color transition on hover | 300ms |

---

## Pages

```
/                    → Cloud Grid (this spec)
/projects/[slug]     → Project detail (keep existing Cathy Dolle-style pages)
/about               → About page (keep existing)
```

The `/work` and `/lab` routes redirect to `/` since the grid shows everything with filters.

---

## What This Spec Does NOT Decide (Your Slots)

1. **Cloud photography** — which image(s), brightness, color temperature
2. **Statement text** — your headline, subtitle, bio line
3. **Card content order** — what goes where within each card
4. **Which cards span 2 columns** — statement, showreel, mark, or none
5. **Grid column count** — 6 is JSP's number, you might want 4 or 5
6. **Showreel** — whether to include, what it links to
7. **Mark card** — whether to include, what it shows
8. **Dark mode cloud image** — dusk, night, or dark gradient
9. **Additional project images** — for hover cycling, you'll add these
10. **Filter categories** — exact groupings

---

## Technical Notes

- **No Three.js, no WebGL** — pure CSS + Next.js Image + GSAP for entrance
- **backdrop-filter** — supported in all modern browsers. Falls back to opaque card on older browsers.
- **Image cycling** — `setInterval` in a `useEffect`, triggered by hover state. Cleanup on mouseleave.
- **Cloud drift** — CSS `@keyframes` on `background-position` or `transform: translate()`. No JS needed.
- **Performance** — `backdrop-filter: blur(12px)` on many cards can be heavy. Use `will-change: backdrop-filter` on hover only. Or pre-blur the background image and skip `backdrop-filter` entirely for better perf.

---

## Verification

1. `npx next build` passes
2. Grid fills the viewport with cards on desktop
3. Cloud background visible behind semi-transparent cards
4. Hover dims non-hovered cards and brightens hovered card
5. Hover on project with images cycles through them
6. Filters narrow visible cards
7. Cards stagger-fade on page load
8. Background drifts subtly
9. Mobile: 2-column grid, cards stack
10. Dark mode: inverted tokens, dark card glass
11. Scrollbar hidden
12. `prefers-reduced-motion`: no entrance animation, no drift, no hover cycling
