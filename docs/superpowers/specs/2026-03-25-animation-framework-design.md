# Animation Framework: "Tea House After Dark"

## Concept

The site is a tea house that changes with the time of day. Morning: warm paper, sunlight through screens. Night: dim amber, things emerging from shadow. Every animation shares one language — **things emerging from warmth and darkness into light.**

The feeling is jazzy, intimate, confident. Not fast, not flashy — deliberate. Like a bartender who doesn't rush.

## Section 1: Atmosphere System

### Time-of-Day Palette

The site palette shifts continuously based on NYC time (EST). Three states that blend:

| Time | Mode | Background | Text | Accent |
|---|---|---|---|---|
| 6am–4pm | Day | `#f7f6f3` (warm paper) | `rgba(35,32,28,0.82)` | `rgba(35,32,28,0.35)` |
| 4pm–7pm | Dusk | Gradient between day/night | Blending | Blending |
| 7pm–6am | Night | `#1a1815` (warm dark) | `rgba(240,235,227,0.85)` | `rgba(240,235,227,0.35)` |

### Implementation

A `data-timemode` attribute on `<html>` — set to `"day"`, `"dusk"`, or `"night"`. Updated every minute by a client-side script that checks NYC time (not local time — always EST).

CSS custom properties change based on this attribute:

```css
:root[data-timemode="day"] {
  --bg: #f7f6f3;
  --ink-full: rgba(35, 32, 28, 1);
  --ink-primary: rgba(35, 32, 28, 0.82);
  /* ... all ink tokens ... */
}

:root[data-timemode="night"] {
  --bg: #1a1815;
  --ink-full: rgba(240, 235, 227, 1);
  --ink-primary: rgba(240, 235, 227, 0.85);
  /* ... inverted tokens ... */
}

:root[data-timemode="dusk"] {
  /* interpolated values */
}
```

The WallLight shader also reads the time mode — its color palette shifts to match. During day: soft warm light on paper. During night: amber glow on dark surfaces, deeper shadows.

All transitions between modes use `transition: background-color 60s, color 60s` — imperceptible in real time but smooth if you watch.

### NYC Clock

Live clock in the nav bar. Format: `10:47 PM EST`. Fragment Mono, `--text-meta` size, `--ink-muted` color. Updates every minute.

At night: faint warm `text-shadow` glow like an illuminated clock face.

Component: `src/components/NYCClock.tsx` — `"use client"`, uses `setInterval` every 60s, formats to `America/New_York` timezone via `Intl.DateTimeFormat`.

## Section 2: Preloader — "Eyes Adjusting" (In-Page)

No separate overlay. The page itself is the preloader.

### First Visit Sequence

**Phase 1 (0–1.0s):** WallLight shader starts at near-black regardless of time of day. All page elements at `opacity: 0`. The shader brightens toward the current time-of-day ambient color — like a room slowly being lit.

**Phase 2 (1.0–1.8s):** Nav elements reveal — name, clock, nav links. These are the "fixtures" of the room, always present. Stagger: 0.06s. Duration: 0.6s. Ease: `power3.out`.

**Phase 3 (1.8–3.0s):** Hero text reveals with the standard reveal animation (Section 4). Project cards are scroll-triggered, so they wait for the user to scroll.

### Repeat Visit (within 30 minutes)

`sessionStorage` flag. WallLight starts at current brightness. Nav appears immediately. Hero does a quick 0.5s fade-in. No black phase.

### Reduced Motion

Skip all phases. Content visible immediately. WallLight renders single frame at current time.

### Component

`src/components/Preloader.tsx` — `"use client"`. Manages the sequence timeline via GSAP. Controls WallLight intensity via a shared ref or Zustand store value (`ambientIntensity: 0→1`). Sets a `data-loaded` attribute on `<html>` when complete.

## Section 3: Page Transitions

Moving between pages feels like moving through rooms in the same space.

### Exit (0.4s)

Current page content fades out. Not to black — to the current ambient color (`--bg`). Like lights dimming in this room. GSAP animates a full-page overlay (matching `--bg`) from `opacity: 0` to `opacity: 1`.

### Hold (0.1s)

Screen is at ambient color. Route changes underneath via `router.push`.

### Enter (0.6s)

Overlay fades from `opacity: 1` to `opacity: 0`. New page content is already rendered beneath. Elements on the new page use the reveal system (Section 4) — they stagger in as the overlay lifts.

### Total: ~1.1s

### Implementation

`src/components/PageTransition.tsx` — wraps page content. Provides a `<TransitionLink>` component that intercepts navigation.

`src/components/TransitionLink.tsx` — replaces `next/link` for internal navigation. `onClick`: triggers exit timeline, waits for completion, calls `router.push`, enter timeline triggers on new page mount.

The WallLight shader is **never interrupted** — it renders continuously behind the transition overlay. The ambient light is the one constant across all rooms.

### Back/Forward

`popstate` event triggers the same transition in reverse.

## Section 4: Reveal System

One reveal language for all content. Elements emerge from shadow into focus.

### Base Reveal

```
from: { opacity: 0, y: 16, filter: "blur(3px)" }
to:   { opacity: 1, y: 0,  filter: "blur(0px)" }
duration: 0.8s
ease: power3.out
```

The blur is essential — it makes elements feel like they're coming into focus, not sliding into place. Like your eyes adjusting.

### Variants

| Context | Duration | Y offset | Scale | Blur | Stagger |
|---|---|---|---|---|---|
| Hero text | 1.0s | 24px | — | 4px | 0.10s |
| Nav elements | 0.6s | 10px | — | 2px | 0.06s |
| Project cards | 0.9s | 20px | 0.98→1.0 | 3px | 0.12s |
| Section content | 0.8s | 16px | — | 3px | 0.08s |
| Metadata/labels | 0.6s | 8px | — | 2px | 0.05s |

### Scroll Triggering

Elements below the fold reveal when entering 85% of the viewport. `ScrollTrigger`, `once: true`. Above-fold elements reveal in the entrance sequence (Phase 3).

### Implementation

`src/lib/animations.ts` — export reveal presets:

```ts
export const REVEAL_HERO = { from: {...}, to: {...} };
export const REVEAL_CARD = { from: {...}, to: {...} };
export const REVEAL_CONTENT = { from: {...}, to: {...} };
export const REVEAL_META = { from: {...}, to: {...} };
```

Each page's `useEffect` applies the appropriate presets via GSAP. Scroll reveals use `gsap.fromTo` + `scrollTrigger`.

## Section 5: Micro-interactions

### Link Hover — "warmth approaching"

Opacity steps up one level in the ink scale. A warm underline draws in from the left:

```css
[data-link]::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--ink-muted);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s var(--ease-out);
}
[data-link]:hover::after {
  transform: scaleX(1);
}
```

### Project Card Hover

Image: `scale(1.02)` over 0.5s. Faint warm glow shadow appears: `box-shadow: 0 8px 32px rgba(180, 140, 80, 0.08)`. At night the glow is amber (`rgba(200, 160, 80, 0.12)`).

Video crossfade on hover (already built for Gyeol) continues as-is.

### Active/Press

`scale(0.98)` for 100ms on all clickable elements. `ease-out`.

### Nav Link Hover

Same opacity step + underline draw as regular links. Active page has underline permanently visible at `scaleX(1)`.

### Cursor

No custom cursor. Default is fine. Revisit in v2.

## Section 6: Shared Timing & Easing

All animations reference shared tokens for consistency:

```css
:root {
  --ease-reveal: cubic-bezier(0.16, 1, 0.3, 1);    /* power3.out */
  --ease-hover: cubic-bezier(0.4, 0, 0.2, 1);       /* standard ease */
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);           /* accelerate out */
  --ease-enter: cubic-bezier(0, 0, 0.2, 1);          /* decelerate in */

  --duration-reveal: 0.8s;
  --duration-hover: 0.3s;
  --duration-press: 0.1s;
  --duration-transition: 0.4s;
  --duration-preloader: 1.0s;
}
```

## Component Architecture

```
src/lib/animations.ts         — Reveal presets (HERO, CARD, CONTENT, META)
src/lib/timemode.ts            — NYC time calculation, mode detection
src/components/Preloader.tsx   — In-page entrance sequence
src/components/PageTransition.tsx — Ambient-color page transition wrapper
src/components/TransitionLink.tsx — Navigation link with transition
src/components/NYCClock.tsx    — Live EST clock for nav
src/components/WallLight.tsx   — Updated: reads time mode, stronger palette shifts
```

Existing files modified:
- `src/app/globals.css` — time-mode CSS custom properties, hover utilities, transition tokens
- `src/app/layout.tsx` — wrap with PageTransition, add Preloader, add timemode script
- `src/app/page.tsx` — remove BuildingOverlay, use reveal presets
- `src/components/GlobalNav.tsx` — add NYCClock, link hover styles
- `src/lib/store.ts` — add ambientIntensity for preloader↔WallLight coordination

Deleted:
- `src/components/BuildingOverlay.tsx` — building concept replaced
- `src/components/LivingInk.tsx` — no longer used

## Success Criteria

1. First visit: screen starts dark, brightens over 3s, content reveals. Feels like entering a room.
2. Navigating between pages: smooth ambient-color fade, no white flash, no jarring load.
3. Visit at 2pm: warm paper, dark text, soft light. Visit at 10pm: dark room, cream text, amber glow. Same site, different mood.
4. Every hover feels warm — underlines draw in, cards glow softly.
5. The blur on reveals makes content feel like it's coming into focus, not sliding in.
6. NYC clock in nav connects the visual atmosphere to real time.
7. `prefers-reduced-motion`: everything works, nothing animates. Content visible immediately.
