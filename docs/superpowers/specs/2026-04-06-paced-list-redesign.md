# The Paced List — Full Redesign Spec

**Date:** 2026-04-06
**Status:** Draft
**Replaces:** Subdivision homepage (2026-04-01)

---

## 1. Design Intent

A minimalist editorial portfolio with atmospheric depth inspired by game UI (Wuthering Waves). Premium through restraint, personality through discoverable details. "Curated gallery with a wink."

**Core tension:** Premium but not sterile. Personal but not gimmicky. Editorial structure with game-UI atmosphere.

**Audience:** Design engineers and peers first, recruiters and clients second.

**Guiding principle for effects:** "Just noticeable" — not invisible, not obvious. The person with taste sees it and knows it was deliberate.

---

## 2. Visual Direction

### 2.1 Atmosphere

- Dark-first. Deep near-black base, faintly warm.
- Layered depth: content on a perceived midground, ambient particles drift in the foreground, soft gradient glows exist in the background layer.
- A subtle ambient particle layer across the entire site — tiny dots of light drifting slowly, like dust in a shaft of light. Low opacity (~0.03-0.05). Canvas-based.
- Light mode available as a toggle — inverts base colors, gradients shift to lower opacity. Not a simple inversion; a considered reinterpretation.

### 2.2 Color System

```
Dark mode (default):
--bg:           #0a0a0b          (near-black, faintly warm)
--bg-elevated:  #111113          (panels, preview areas)
--fg:           rgba(240, 238, 232, 0.88)  (warm off-white)
--fg-2:         rgba(240, 238, 232, 0.50)
--fg-3:         rgba(240, 238, 232, 0.20)
--fg-4:         rgba(240, 238, 232, 0.08)

--accent-warm:  gradient #c8a455 → #d4a04a → #e8c08a
                (interactive highlights, resonance moments)
--accent-cool:  gradient #4a8a8c → #3d6e8a → #2a4a6e
                (atmospheric elements, cursor, ambient glow)

Light mode:
--bg:           #f5f3ee          (warm off-white)
--bg-elevated:  #eceae4
--fg:           rgba(20, 18, 15, 0.82)
--fg-2:         rgba(20, 18, 15, 0.50)
--fg-3:         rgba(20, 18, 15, 0.20)
--fg-4:         rgba(20, 18, 15, 0.08)
Gradients: same hues, reduced opacity
```

### 2.3 Typography

| Role | Font | Usage |
|------|------|-------|
| Display | DM Serif Display, 400 | Project titles, hero tagline. 28-36px max. |
| Body | General Sans, 400 | Descriptions, article copy. 13-15px. |
| Mono | Fragment Mono, 400 | Nav, labels, meta, badges. 10-13px. All-caps at 10-11px with 0.06em tracking for labels. |

Typographic scale is restrained. The biggest element is a project title at ~28-36px. Everything else is 11-15px. Whitespace does the talking.

### 2.4 The Geometric Frame System

A consistent visual motif across the site — angular borders around media elements.

- Built with SVG paths + Framer Motion `motion.path` for draw-on animations
- Corner accents: small ticks or angle marks at 1-2 corners
- **Reveal animation:** frame draws itself one corner at a time as the element enters viewport
- **Hover glow:** on hover or activation, a soft gradient glow (warm gold) appears at one corner, fades after ~600ms
- Frame weight varies by context:
  - Homepage project sections: 1px, prominent
  - Index page thumbnails: 1px, thinner/smaller
  - Detail page hero: 1px with more detailed corner accents
  - About page portrait: 1px with slightly ornate corners

### 2.5 Micro-Illustrations

- ~6-8 small custom geometric icons, one per project type/tag (e.g., brand, product, generative, mobile)
- SVG-based, angular style matching the frame language. Precise, not cute.
- **Idle animation:** slow pulse or gentle float cycle (CSS or Framer Motion)
- **Cursor proximity:** within ~100px radius, icons subtly orient toward cursor (gravity influence). Settle back when cursor moves away.

---

## 3. Interaction Layer

### 3.1 Custom Cursor

Replaces the native cursor entirely. Rendered as a fixed Framer Motion overlay.

| State | Appearance |
|-------|-----------|
| Default | Thin geometric reticle — small circle with 4 short tick marks at cardinal points. Cool gradient tint, low opacity. |
| Over project media | Reticle expands, tick marks rotate slightly, faint warm glow appears. Spring-animated. |
| Over nav/links | Reticle shrinks to a minimal dot. Target element gets subtle gold highlight. |
| Idle (2+ seconds) | Reticle dims, tick marks slowly rotate (scanning). Revives on movement. |
| Fast movement | Slight motion stretch/trail on the reticle. Velocity-aware via `useMotionValue`. |

**Implementation:** `useMotionValue` for raw position, `useSpring` for smooth following. Custom `<Cursor />` component rendered in the layout as a fixed overlay with `pointer-events: none`.

### 3.2 Scroll-Triggered Animations (Framer Motion)

- `whileInView` with `once: true` — elements animate in as they enter the viewport (~20% visible), stay revealed.
- No exit animations.
- Homepage project sections stagger: frame draws → media fades in → title materializes → meta appears last.
- Inner pages: subtler, faster reveals. The homepage is the show; detail pages serve content.

### 3.3 Page Transitions

- **Shared layout animations** via Framer Motion `layoutId`:
  - Clicking a project on the homepage or index page: the media frame animates and expands to become the detail page hero frame. Spatial continuity.
  - Back navigation: hero frame contracts back to its origin position.
- **Fallback:** If no shared element exists (e.g., direct URL navigation), the detail page fades in with a subtle upward slide.

### 3.4 Smooth Scroll

- **Lenis** for momentum-based smooth scrolling across all pages.
- Native scrollbar hidden (already implemented via CSS `scrollbar-width: none` and `::-webkit-scrollbar`).
- Lenis config: moderate smoothness, not too heavy. The scroll should feel weighted but not fight the user.

### 3.5 Ambient Particles

- Lightweight `<canvas>` element spanning the full viewport, fixed position, behind content.
- ~30-50 particles, slow drift (upward or lateral), very low opacity (~0.03-0.05).
- Particles are tiny dots of warm gold and cool teal — matching the gradient system.
- **Cursor interaction:** particles within ~150px of the cursor gently drift away or toward it — a subtle breathing effect.
- **About page:** particle density slightly increased, more responsive to cursor. A signal that this page is "yours."
- Runs on its own `requestAnimationFrame` loop, independent of React renders.
- Respects `prefers-reduced-motion`: particles freeze in place, no drift.

---

## 4. Pages

### 4.1 Homepage

**Structure:** Single vertically-scrolled page with Lenis smooth scroll. No scroll snapping.

**Above the fold:**
- Nav: "HKJ" mark left, links right (Index, Archive, About). Fragment Mono, quiet.
- Active nav item: small gold dot or thin underline that slides with spring physics.
- ~40vh of space below nav.
- Single line of display text — tagline in DM Serif Display. Understated, calm fade on load.
- Behind the tagline: very faint radial gradient glow (warm gold center, fading to transparent). Barely perceptible.

**Project sections (scrolling down):**
- Each project is a generous full-width section with ~6-8vw horizontal padding.
- Alternating asymmetric layouts:
  - Odd sections: media (60% width) left, text (40%) right, vertically centered.
  - Even sections: text left, media right.
- Media is enclosed in the geometric frame.
- **Scroll-triggered reveal per section:**
  1. Geometric frame draws itself (corner by corner, ~400ms)
  2. Image/video fades in within the frame (200ms delay after frame)
  3. A thin horizontal line draws beside the media
  4. Title fades up from the line (12-16px Y offset, spring)
  5. Meta fades in last
  6. A subtle warm gold glow pulses once at a corner of the frame (~600ms, then fades)
- Between sections: 30-40vh of whitespace. Particles slightly more visible in this breathing room.
- WIP projects: solid color block placeholder within the frame, small micro-illustration, "In progress" label in mono.

### 4.2 Index Page (/index)

**Purpose:** Focused list of shipped projects.

**Structure:**
- Same nav as homepage.
- Page title: "Index" in small mono caps below nav. Quiet label.
- **Two-panel layout:**
  - Left (~65%): vertical list of project rows.
  - Right (~35%): persistent preview panel with thin angular frame.
- **Each project row:**
  - Small thumbnail (~120x90) on the left with thin geometric frame
  - Title in body type
  - One-line description in muted text
  - Year right-aligned
  - Rows separated by 1px line at `--fg-4`
- **Row hover:**
  - Thumbnail scales subtly (1.02)
  - Frame border glows with warm gradient
  - Faint gold left-border or background tint
- **Preview panel (right side):**
  - Updates on row hover: large image/video, description, tags as geometric badges
  - Transitions between projects: crossfade + subtle vertical slide
  - Thin angular frame around the panel — game-menu energy
- **Click:** transitions to detail page. Thumbnail frame expands outward via `layoutId`.
- **Mobile:** preview panel hidden. Rows become tappable with thumbnail inline.

### 4.3 Archive Page (/archive)

**Same structure as Index with lighter treatment:**
- Page title: "Archive"
- Rows may lack full descriptions — just title, type label, year.
- Thumbnails more expressive: color blocks, video loops, generative previews.
- Geometric frames use cool gradient instead of warm — visual distinction from Index.
- No preview panel. Hover just highlights the row.

### 4.4 Project Detail Page (/index/[slug] or /archive/[slug])

**Entry transition:**
- From index/homepage: media frame animates and expands to become hero frame (shared layout animation via `layoutId`).
- From direct URL: fade in with subtle upward slide.

**Structure:**
- **Hero:** full-width media with geometric frame. Larger corner accents than homepage. Faint gold glow at one corner.
- **Header** below hero:
  - Title in DM Serif Display, left-aligned
  - One-liner in body text, muted
  - Meta: year, tags as geometric badges, status. Horizontal layout, generous spacing.
- **Content body:**
  - Long-form sections with subheadings (Fragment Mono, small caps)
  - Body copy in General Sans
  - Inline images with thin frame borders
  - Section dividers: thin horizontal line with a small geometric diamond or dot at center
  - Scroll-triggered reveals: same "line draws, content materializes" pattern, but faster and subtler than homepage
- **Next project link** at bottom:
  - "Next" in mono caps
  - Next project title with small framed thumbnail
  - Hover: frame glows warmly
  - Creates a browsing loop through all projects

### 4.5 About Page (/about)

**The most personal page.**

- **Portrait:** photo of you, desaturated with subtle warm gradient overlay at edges. Geometric frame with slightly ornate corner treatment. Character-portrait energy.
- **Bio:** short, first person, body type. Not a résumé — how you think about design and engineering.
- **Details block:** location, role, education — displayed like character-sheet stats. Small mono labels, values beside them. Clean two-column grid.
- **Links:** socials, email, résumé. Quiet row, mono type, each with a custom icon that has the gravity-influence hover effect.
- **Easter egg:** particles are slightly denser and more cursor-responsive on this page.

---

## 5. Navigation

**Structure:** Index, Archive, About (+ HKJ mark as home link)

- Consistent across all pages. Fixed top bar.
- Fragment Mono, 13px, 0.01em tracking for the mark. 10px uppercase with 0.06em tracking for links.
- Active state: small gold dot or thin underline that slides to the active item with spring physics.
- On detail pages: nav sits on solid `--bg` background with bottom border.
- On homepage: nav overlays the dark background, uses rgba white for text.
- Theme toggle present in nav (sun/moon icon, subtle).

---

## 6. Technical Stack

| Layer | Tool | Rationale |
|-------|------|-----------|
| Framework | Next.js App Router | Already in place. SSR, file-based routing. |
| Styling | Tailwind CSS | Utility classes for layout, spacing, typography. |
| Animation | Framer Motion | Replaces GSAP. Spring physics, `layoutId`, `whileInView`, `useSpring` for cursor. One library covers all animation needs natively in React. |
| Smooth scroll | Lenis | Momentum-based smooth scrolling. ~4kb. Weighted feel without fighting the user. |
| Particles | Canvas API (vanilla) | ~30-50 particles doesn't need Three.js. Single `<canvas>` + `requestAnimationFrame`. No dependency. |
| Frames/Icons | Inline SVG + Framer Motion `motion.path` | Geometric frames and micro-illustrations as SVG. `pathLength` for draw-on effects. |
| Fonts | General Sans (local), Fragment Mono (local), DM Serif Display (Google) | Already loaded. Good typographic range. |

**Removed:** GSAP (replaced by Framer Motion)

**Performance:**
- Particles run on own rAF loop, independent of React
- `whileInView` uses IntersectionObserver, no scroll listeners
- Cursor uses `pointermove` + spring interpolation at 60fps
- SVG `pathLength` animations are GPU-composited
- All animations respect `prefers-reduced-motion`: particles freeze, reveals instant, cursor becomes native

---

## 7. Responsive Behavior

**Breakpoint:** 768px (mobile)

**Mobile adaptations:**
- Custom cursor disabled — native touch interactions
- Particles reduced to ~15, lower opacity
- Homepage: sections stack vertically, media full-width above text
- Index page: preview panel hidden, rows tappable with inline thumbnails
- Geometric frames: simplified, thinner, no draw-on animation
- Nav: collapses to HKJ mark + hamburger or minimal inline links
- Page transitions: simpler crossfades, no shared layout animations (performance)

---

## 8. Accessibility

- All animations respect `prefers-reduced-motion`: instant reveals, no particles, native cursor
- Keyboard navigation: focus-visible outlines maintained (existing)
- Skip-to-content link (existing)
- Semantic HTML: proper heading hierarchy, landmark regions
- Images: meaningful alt text on project media
- Color contrast: fg/bg ratios meet WCAG AA at all opacity levels used for readable text
- Custom cursor: underlying native cursor behavior preserved for assistive tech (cursor component is decorative overlay only)
- Route announcer for SPA navigation (existing)
