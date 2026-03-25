# "The Evening" — Complete Portfolio Design

## Concept

The site is an evening you're invited into. Warm lighting, a record playing, work displayed like art on the walls of a space that exists at a specific time and place. Every interaction serves this atmosphere. The rendering style is "warm analog precision" — Aesop meets Kinfolk meets Teenage Engineering.

## Visual Language

### Typography

**Display (Newsreader italic):**
- Philosophy statement + case study project titles only
- Never above 32px. `font-feature-settings: "liga" 1, "kern" 1`
- `text-rendering: optimizeLegibility`. Line height 1.35.
- Color: `--ink-primary` (never full opacity)

**Body (Satoshi):**
- 15px, line-height 1.7, max-width 54ch
- `letter-spacing: -0.01em`. Weight 400 only — never bold.
- Hierarchy through opacity and size, never weight.

**System (Fragment Mono):**
- 10-11px, uppercase, `letter-spacing: 0.06em`
- Labels, clock, now-playing, metadata. Always `--ink-muted`.

### Color

**Day (6am–4pm):** Paper `#f7f6f3` with shader variation. Ink at opacity steps. Borders at `rgba(ink, 0.06)`.

**Night (7pm–6am):** Warm dark `#1a1815` with shader amber pools. Cream text `rgba(240, 235, 227, 0.85)`. Amber accents `rgba(200, 160, 80, 0.12)` on hover states.

**Dusk (4pm–7pm):** Continuous interpolation between day and night.

No flat colors anywhere. WallLight shader adds surface variation to every background state.

### Spacing

- Hero top padding: `clamp(120px, 22vh, 220px)`
- Section-to-section: `clamp(80px, 12vh, 140px)`
- Between project cards: `clamp(64px, 8vh, 100px)`
- Element-to-element: 16-24px
- When in doubt, more space.

### Image Treatment

- Border radius: 6px. No borders.
- Aspect ratio: 16:9 for covers.
- Shader dissolve reveal on viewport entry (noise-based materialization).
- Hover: `scale(1.02)` over 500ms ease-swift.
- Faint grain overlay (`mix-blend-mode: multiply, opacity: 0.03`).
- WebP quality 82.

### Grain & Texture

- WallLight shader: macro surface variation (light pools, shadow geography)
- Fine grain: `noise(uv * 18.0) * 0.012` in shader
- Image grain overlay: `opacity: 0.03`, multiply blend
- Never obvious. Registers as "warm surface" not "noise."

## Animation System

### Foundation: Rauno's Vocabulary

```css
--ease-swift: cubic-bezier(.23, .88, .26, .92);
--ease-snappy: cubic-bezier(.2, .8, .2, 1);
--ease-dropdown: cubic-bezier(.16, 1, .3, 1);
```

Two tempos only:
- **Immediate** (100-200ms): hover states, tooltips, micro-interactions
- **Considered** (400-600ms): page entrances, reveals, transitions

No middle ground.

### Blur Reveal (all content)

```
Enter: opacity(0) + y(40px) + blur(4px) → clear    [500ms, ease-swift]
Exit:  clear → opacity(0) + y(-40px) + blur(4px)   [400ms, ease-in]
```

Blur scales with element size: 1px for small metadata, 2px for cards, 4px for hero/large content.

Exit travels further than entry (asymmetric — gravity feel).

Stagger: 0.06s between elements in a group.

### Scroll-Triggered

- Elements reveal at 85% viewport entry, `once: true`
- Slow scroll: full 500ms blur reveal
- Fast scroll (velocity > threshold): instant reveal, no animation
- Implemented via ScrollTrigger with velocity check

## Interaction System

### 1. Preloader — "Eyes Adjusting"

Page starts with a fixed overlay at `#0a0908` (darker than night mode). Over 2.5s, the overlay fades to transparent, revealing the WallLight shader brightening underneath and the page content.

First visit: full dark-to-light sequence (2.5s).
Repeat visit (session): quick 0.6s fade from ambient color.
Reduced motion: skip, content visible immediately.

Component: `src/components/Preloader.tsx` (already built, refine timing to 2.5s with ease-swift)

### 2. FLIP Page Transitions

Clicking a project card morphs the card image into the case study hero.

**Sequence (800ms total):**
1. GSAP FLIP records card image position/size
2. Dim wash overlay fades in: `var(--bg)` at `opacity: 0→0.3` (NOT opaque — you see the morph through it)
3. Card image animates to full-width hero position (600ms, ease-swift)
4. Route changes, case study content blur-reveals below the hero image
5. Dim wash fades out (200ms)

**Back navigation:** Reverse — hero image morphs back to card position.

**Requires:** GSAP FLIP plugin. The card image and case study hero image share a `data-flip-id` attribute.

Components:
- `src/components/FlipTransition.tsx` — manages FLIP state and overlay
- `src/components/TransitionLink.tsx` — updated to trigger FLIP instead of simple overlay fade

### 3. Magnetic Cursor

Custom cursor replacing the default — a small warm circle (16px) that follows at a slight delay (lerp 0.15).

**Context-aware states:**
- Default: 16px warm dot, `--ink-muted` color
- Near links: grows to 24px, snaps to link center (magnetic radius ~40px)
- On project cards: transforms into "View" text label (Fragment Mono, 10px), follows within card bounds
- On vinyl: hidden (grab cursor takes over)
- On text: default system cursor (don't interfere with selection)

Transitions between states: 150ms ease-swift.

Component: `src/components/Cursor.tsx` — `"use client"`, absolutely positioned div, RAF loop for position, CSS transitions for size/content changes. Hidden on touch devices.

### 4. Kinetic Hero Typography

Philosophy statement letters have subtle physics:
- On load: letters settle into place with micro-bounce (spring easing via GSAP)
- Cursor proximity: letters within ~80px of cursor displace 1-2px away (like text resting on a surface disturbed by cursor "wind")
- At rest: perfectly static and readable
- Variable font weight shifts with time of day: weight 380 (day) → weight 420 (night). Text gets subtly bolder as the room darkens.

Component: `src/components/KineticText.tsx` — splits text into `<span>` per character, GSAP for physics, RAF for cursor tracking.

### 5. The Vinyl + Cat

Already built (`src/components/Vinyl.tsx`). Refinements:
- Entrance: blur(4px) + scale(0.96) → clear, 600ms ease-swift (matches the reveal vocabulary)
- Groove light reflection direction syncs with WallLight shader angle
- Cat idle animation at 2fps (pixel art should feel low-framerate)
- Drop shadow: `0 4px 24px rgba(0,0,0,0.12)` grounding it on the surface

### 6. Fader Hover on Project Cards

Already built. Refinements:
- Dimmed state: `opacity: 0.35` (was 0.4) + `blur(1.5px)` (was 1px) for stronger separation
- Focused state: `scale(1.005)` + `box-shadow: 0 12px 40px rgba(180, 140, 80, 0.08)`
- Night mode glow: `rgba(200, 160, 80, 0.12)`
- Transition: 400ms ease-swift (not ease-out — snappier)

### 7. Shader Dissolve on Project Images

Project images don't fade in — they materialize through a noise-based dissolve.

A WebGL overlay on each project image that uses FBM noise to progressively reveal the image from transparent to fully visible. The noise pattern matches the WallLight grain texture for cohesion. Like ink spreading across paper.

Duration: 800ms, triggered by ScrollTrigger entering viewport.

Component: `src/components/DissolveImage.tsx` — wraps Next.js `<Image>`, adds a canvas overlay with the dissolve shader. Falls back to standard opacity reveal if WebGL unavailable.

### 8. Atmospheric Parallax

WallLight shader angle shifts 2-3° as you scroll the page. The light source is "behind and above" — as you scroll down (walk deeper into the room), the light angle changes imperceptibly. You'd never consciously notice it, but the page feels spatial.

Implementation: pass `scrollProgress` (0-1) to WallLight via a shared ref or Zustand store value. The shader uses it to offset `u_lightAngle` by `scrollProgress * 0.05` radians.

### 9. Spatial Audio (Opt-in)

Faint ambient tone that shifts with time of day:
- Day: bright, airy, like distant wind chimes
- Night: warm, low, vinyl crackle + distant bass
- Volume: barely perceptible (gain 0.03-0.05)

Toggle: small speaker icon in nav, next to now-playing. Off by default. Uses Web Audio API with pre-loaded short loops (~10s, crossfaded).

Component: `src/components/AmbientAudio.tsx` — toggle state in Zustand store, Web Audio API, gain node for volume.

## Homepage Layout

### The Entrance (hero)

```
[generous empty space — the ceiling of the room]

        [vinyl record spinning]
        [pixel cat riding along]

  the quiet details are the loudest ones.

        NEW YORK · OPEN TO WORK

[generous space — you're taking in the room]
```

Centered layout. `max-width: 900px`. The emptiness IS the design.

### The Walls (work)

```
[project 1 — full width image with dissolve reveal]
  GYEOL: 결
  material typography exploring korean craft and texture.
  MATERIAL SCIENCE · 2026

[generous space]

[project 2 — same treatment]
  Sift
  camera roll search that surfaces the photos you actually want.
  MOBILE / AI · 2025

[generous space]

[project 3 — color field, no image]
  Conductor
  design system for scaling consistency across product surfaces.
  DESIGN SYSTEMS · 2026 · IN PROGRESS

[generous space]

[2 empty slots — dashed border, "coming soon"]
```

Single column. Each project has its own moment. The fader hover makes the focused project "light up" while others recede.

### The Corner (exploration)

```
  EXPLORATION
  texture studies, generative work, and other small things.
  View all →
```

Minimal teaser. Links to flat gallery page.

### The Table (now + writing)

```
  NOW
  finishing conductor. reading 'the timeless way of building'
  by christopher alexander. making pour-overs that take too long.
```

```
  WRITING
  notes and observations.
  View all →
```

### The Door (footer)

```
  hello@hkjstudio.com
  GitHub · X · LinkedIn

  © 2026 HKJ Studio
```

## Nav Bar

```
RYAN JUN  DESIGN ENGINEER    10:47 PM EST    ♫ Nikes — Frank Ocean  |||    WORK  EXPLORATION  WRITING  ABOUT
```

- Left: identity (TransitionLink to home)
- Center-left: NYC Clock
- Center-right: Now Playing (album art + title + EQ bars)
- Right: nav links with data-link hover underlines
- Fixed top, z-index 500, `var(--bg)` background, no blur
- 48px height
- At night: clock gets warm text-shadow glow

## File Architecture

### New files
```
src/components/FlipTransition.tsx    — FLIP page transition manager
src/components/Cursor.tsx            — Magnetic custom cursor
src/components/KineticText.tsx       — Physics-driven hero typography
src/components/DissolveImage.tsx     — WebGL noise dissolve for images
src/components/AmbientAudio.tsx      — Opt-in spatial audio
src/constants/now-playing.ts         — Current song (already created)
src/constants/now.ts                 — Now section text (already created)
```

### Modified files
```
src/app/globals.css                  — ease-swift, updated durations, cursor styles
src/app/layout.tsx                   — Add Cursor, FlipTransition
src/app/page.tsx                     — New hero layout, KineticText, fader refinements
src/components/TransitionLink.tsx    — FLIP-aware navigation
src/components/Cover.tsx             — DissolveImage, refined fader values
src/components/Vinyl.tsx             — Entrance animation, shadow, refined rendering
src/components/WallLight.tsx         — Scroll-linked angle offset
src/components/GlobalNav.tsx         — Refined spacing, cursor integration
src/lib/animations.ts                — Updated presets with ease-swift, blur(4px), y(40px)
src/lib/store.ts                     — Add vinylSpeed, scrollProgress, audioEnabled
```

### Deleted files
```
src/components/BuildingOverlay.tsx   — concept replaced
src/components/LivingInk.tsx         — if not already deleted
```

## Implementation Order

1. **Animation foundation** — update easing curves, reveal presets, globals.css
2. **Cursor** — magnetic cursor (visible impact, touches everything)
3. **KineticText** — hero typography with physics
4. **Vinyl refinements** — entrance animation, shadow, groove rendering
5. **DissolveImage** — shader reveal on project images
6. **FLIP transitions** — the biggest technical piece
7. **Fader hover refinements** — tighter values
8. **Atmospheric parallax** — scroll-linked WallLight
9. **Spatial audio** — opt-in ambient sound
10. **Polish pass** — timing adjustments, mobile, edge cases

## Success Criteria

1. First-time visitors stay on the hero for 3+ seconds (the vinyl and atmosphere hold attention)
2. Someone describes the site as "it feels like walking into a room" without being told the concept
3. The FLIP transition makes someone say "how did they do that"
4. The time-of-day shift makes return visitors notice something different
5. The pixel cat makes someone smile and screenshot
6. Every hover state feels warm and immediate (< 200ms)
7. Performance: 60fps on a 2-year-old laptop, < 3s LCP, < 150KB initial JS
8. Reduced motion: fully functional, no animation, all content accessible
9. Mobile: all interactions gracefully degrade (no cursor, no vinyl drag, tap-friendly)
