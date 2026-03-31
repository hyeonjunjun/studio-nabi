# The Constellation — Design Specification

> A luminous particle form floating in darkness. Art piece at rest. Portfolio when approached.

## Concept

The homepage is a dark void. In the center floats a cluster of light particles — an abstract constellation. It breathes, rotates slowly, glows. From a distance it's a sculpture. Move your cursor toward it and the particles spread apart, revealing that each bright node is a project. Hover a node to see its name. Click to enter. Pull away and the constellation collapses back into its abstract form.

The portfolio is simultaneously an art installation and a navigation system.

## Visual Reference

A person standing on an illuminated platform in total darkness, looking up at a shattered constellation of light suspended in the void. Vast negative space. The light IS the content.

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  HKJ                                    About · Connect  │  ← edge labels, very faint
│                                                          │
│                                                          │
│                    ✦  ·   ✦                              │
│                  ·   ✦  ·    ·                            │
│                    ✦    ✦  ·                              │  ← constellation (resting)
│                  ·   ✦  ·  ✦                              │
│                    ·   ✦                                  │
│                                                          │
│                                                          │
│  Design & development              Est. 2025             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

When cursor approaches the center:

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  HKJ                                    About · Connect  │
│                                                          │
│            ✦ GYEOL                                       │
│                          ✦ SIFT                          │
│                                                          │
│                 ✦ CONDUCTOR                               │  ← constellation (expanded)
│                                                          │
│                          ✦ SPRING GRAIN                  │
│         ✦ RAIN ON STONE                                  │
│                              ✦ CLOUDS AT SEA             │
│                                                          │
│  Design & development              Est. 2025             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Three.js Scene

**Renderer:**
- `WebGLRenderer` with `antialias: true`, `alpha: true`
- Canvas fills the viewport, `position: fixed`, `z-index: 0`
- Background: `#000000` (pure black — this is intentional for the void)
- `pixelRatio: Math.min(window.devicePixelRatio, 2)`

**Camera:**
- `PerspectiveCamera`, FOV 60, positioned at `z: 30`
- No camera movement — the camera is fixed. The constellation moves.

**The Constellation (Points geometry):**

Two types of particles:
1. **Project nodes** (6) — larger, brighter, interactive
2. **Ambient particles** (100-150) — smaller, dimmer, decorative. Fill out the form.

All particles positioned in a loose spherical cluster, radius ~8 units.

**Resting state (cursor far from center):**
- All particles clustered tightly (radius 3-5)
- Slow rotation: `rotation.y += 0.001` per frame
- Ambient gentle oscillation: each particle drifts on its own Perlin noise path
- Project nodes and ambient particles are indistinguishable — it's one abstract form
- Particle color: warm white `#f5f0e8` (matches `--fg`)
- Additive blending for glow effect
- Point size: project nodes 3px, ambient 1-2px
- Overall opacity breathes slowly: `0.7 → 1.0 → 0.7`, 4s cycle

**Expanding state (cursor approaching center):**
- As cursor moves toward the center of the viewport, a `proximity` value (0→1) is calculated
- At `proximity > 0.3`: particles begin spreading outward
- Project nodes move to their expanded positions (spread across a larger radius ~12-15 units)
- Ambient particles scatter further, become fainter
- Project labels appear (HTML overlays positioned via `Vector3.project()`)
- Transition: lerped over ~0.5s, eased

**Expanded state (cursor in center region):**
- Project nodes are spread apart, each clearly isolated
- Each node has an HTML label beside it: project title in Fragment Mono, 11px, `--fg-3`
- Hovered node: label brightens to `--fg`, particle grows to 5px, glow intensifies
- Non-hovered nodes: dim to 50% when any node is hovered
- Click a node: navigates to `/work/[slug]` or `/lab/[slug]`

**Collapsing state (cursor moves away from center):**
- Reverse of expanding. Particles pull back in. Labels fade. Returns to resting.

## Particle Glow

Each particle rendered as a soft circle texture:
- White center, radial gradient to transparent
- Additive blending (`THREE.AdditiveBlending`)
- This creates the "luminous point of light" look from the reference image
- No post-processing bloom needed — additive blending on a black background IS bloom

## Project Label Overlays

- HTML `<div>` elements positioned over the Three.js canvas
- Position calculated by projecting each project node's 3D position to 2D screen coordinates (`vector.project(camera)`)
- Fragment Mono, 11px, letter-spacing 0.02em
- Default: `color: var(--fg-3)`, `opacity: 0`
- When expanded: `opacity: 1`, transition 300ms
- Hovered: `color: var(--fg)`
- Each label is a `<Link>` wrapping the text

## Edge Labels (fixed HTML, always visible)

- **Top-left:** `HKJ` — Fragment Mono, 11px, `--fg-3`
- **Top-right:** `About · Connect` — links, Fragment Mono, 11px, `--fg-4`
- **Bottom-left:** `Design & development` — Fragment Mono, 10px, `--fg-4`
- **Bottom-right:** `Est. 2025` — Fragment Mono, 10px, `--fg-4`
- All edge labels at very low opacity — they're there but barely. The void dominates.

## Entrance Animation

1. (0s): Pure black screen. Nothing visible.
2. (0.5s): First particle appears at center. Then more, one by one, staggering in.
3. (0.5–2.0s): Particles accumulate into the constellation form, each arriving with a soft fade.
4. (2.0s): Constellation fully formed, begins breathing and rotating.
5. (2.0–2.5s): Edge labels fade in at `--fg-4` opacity.
6. `prefers-reduced-motion`: constellation appears immediately, no stagger.

## Colors

```css
body { background: #000000; }
/* Particle color: */ #f5f0e8 (warm white)
/* Edge labels: */ rgba(234, 230, 223, 0.12) to rgba(234, 230, 223, 0.30)
/* Hovered label: */ #eae6df
```

No dark mode toggle — the site IS dark mode. Always.

## Typography

- Fragment Mono for ALL text (labels, nav, metadata)
- 11px, letter-spacing 0.02em
- No display font on the homepage — the constellation IS the display element

## Performance

- Total particles: ~160 (6 project + ~150 ambient). Trivial for GPU.
- One `Points` object for ambient, separate `Points` for project nodes (for raycasting)
- Raycasting only on project nodes (6 points), not ambient
- Label positioning: calculated once per frame via `requestAnimationFrame`, only when expanded
- No post-processing passes
- Target: 60fps on integrated GPU

## Mobile / Touch

- Touch replaces cursor proximity: tap anywhere in center region to expand
- Tap a project label to navigate
- Tap outside to collapse
- Constellation rotation continues on mobile
- If device pixel ratio > 2, reduce ambient particle count to 80

## Pages

```
/                    → The Constellation (this spec)
/work/[slug]         → Project detail (keep existing)
/lab/[slug]          → Experiment detail (keep existing)
/about               → About page (keep existing)
```

## Dependencies

- **Add:** `three` (Three.js)
- **Add:** `simplex-noise` (for particle drift)
- **Keep:** `gsap` (for entrance stagger)
- **Keep:** Everything else

## Files

| File | Action |
|------|--------|
| `src/app/page.tsx` | **Rewrite** — the constellation homepage |
| `src/app/globals.css` | **Rewrite** — minimal: black bg, edge labels, reduced motion |
| `src/components/Constellation.tsx` | **Create** — Three.js scene component |
| `package.json` | **Add** `three` and `@types/three` and `simplex-noise` |

## Verification

1. `npx next build` passes
2. Black viewport with luminous particle constellation in center
3. Constellation rotates slowly and breathes
4. Moving cursor toward center expands the constellation
5. Expanded: project labels visible, hoverable, clickable
6. Moving cursor away collapses back to abstract form
7. Clicking a project navigates to detail page
8. Edge labels faintly visible at corners
9. Entrance: particles stagger in from nothing
10. Mobile: tap to expand/collapse
11. 60fps performance
12. `prefers-reduced-motion`: static constellation, no animation
