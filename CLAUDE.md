# HKJ Studio — Creative & Technical Direction

> One-person design engineering studio portfolio for Ryan Jun (HKJ).
> Every decision filters through a single question: **"Would Nothing or Teenage Engineering ship this?"**

---

## Aesthetic Identity

### Core Concept: Hardware Spec Sheet
The site is a **technical manual**, not a marketing page. It reads like the documentation you'd find inside a Nothing Phone box or a Teenage Engineering OP-1 manual — dry, precise, beautiful in its restraint. Every element earns its place. If it doesn't serve function, it doesn't exist.

### Visual Pillars
1. **Monospace is the voice.** Labels, metadata, section headers, system language — all `font-mono` (Space Mono). Uppercase. Tracked wide. This is the soul of the site.
2. **1px borders are the grid.** Borders define structure the way lines define a schematic. Use `var(--color-border)` — never thick, never decorative.
3. **Ash gray is the material.** `#EAE8E3` is not white. It is warm, tactile, paper-like. The surface should feel like touching matte cardboard.
4. **Black is the ink.** `#000000` text. No gray body copy on important text. Dim text (`#555555`) is reserved for metadata and labels only.
5. **Red is the signal.** `#EB3300` appears only at moments of interaction or status — hover states, progress bars, active indicators, the accent that says "this is alive." Never decorative. Never gratuitous.

### Color Palette (Non-Negotiable)
| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#EAE8E3` | Page background, panels |
| `--color-surface` | `#E4E2DF` | Elevated cards, spec sheet bg |
| `--color-surface-raised` | `#DDDBD8` | Tertiary surfaces |
| `--color-border` | `rgba(0,0,0,0.1)` | Hairline separators, grid lines |
| `--color-border-strong` | `rgba(0,0,0,0.25)` | Emphasized borders |
| `--color-text` | `#000000` | Primary text |
| `--color-text-dim` | `#555555` | Supporting body copy |
| `--color-text-ghost` | `#888888` | Metadata labels, micro text |
| `--color-accent` | `#EB3300` | Interactive signal, hover, status |
| `--color-accent-warm` | `#CC2B00` | Accent hover/pressed state |

### Typography Stack
- **Display** (`--font-display`): System sans-serif. Bold. Uppercase. Tight tracking (`tracking-tighter`). Used for massive section headlines ("DESIGN ENGINEERING", "LET'S TALK").
- **Body** (`--font-sans` / Inter via `--font-satoshi`): Clean humanist sans. Regular weight. Used for editorial paragraphs and descriptions.
- **Mono** (`--font-mono` / Space Mono via `--font-space-mono`): The workhorse. Used for all labels, metadata, navigation, CTAs, spec tables, system language. Always uppercase with wide letter-spacing (`0.1em`–`0.2em`).
- **Serif** (`--font-editorial-new` / Newsreader): Reserved for case study editorial moments. Italic for subheads. Do not use on the homepage.

### Fluid Type Scale
All type uses `clamp()` for fluid sizing. Reference `--text-micro` through `--text-display` from `globals.css`. Never use hardcoded `px` for font sizes on text elements. The display scale goes up to `clamp(4rem, 3rem + 8vw, 12rem)` — it should feel **massive** on desktop and still functional on mobile.

---

## Design Language

### Textures & Backgrounds
- **Paper noise**: Subtle SVG fractalNoise overlay at `opacity: 0.03`, fixed position, `pointer-events: none`. Present globally via `.paper-noise`.
- **Grid lines**: CSS linear-gradient crosshatch at 60px intervals (`.grid-lines`). Used as subtle section backgrounds (StudioSection, CurtainPreloader, MobileMenu).
- **Dot matrix**: Radial gradient dots at 16px intervals (`.dot-matrix`). Secondary texture option.

### System Language
The site speaks in technical shorthand. Adopt these patterns:
- Section labels: `[ DIR: /WORK ]`, `// MANUAL : SEC.01`, `[ NAV : MENU ]`
- Status indicators: `SYS.INIT`, `SYS.INFO`, `READY`, `LOADING`
- Model numbers: `HKJ-01`, `FIG 1.0`
- Bracket labels: `[ OPEN ] →`, `[ CLOSE ]`
- Counters: Zero-padded — `01`, `02`, `003%`
- Copy button: "Click to copy" / "Copied to clipboard"

### Interaction Patterns
- **Hover**: Accent red color shift on text/icons. Grayscale→color on images. `transition-colors duration-300`.
- **Cursor**: Custom `mix-blend-difference` white dot. Morphs to labeled rings on images ("View"), links (shrink), and explore targets ("Open"). Click triggers accent red ripple ring. Desktop only (`pointer: fine`).
- **Text scramble**: Hacker-style character randomization on mount + hover for hero words. Uses `useTextScramble` hook with `requestAnimationFrame`.
- **Scroll reveals**: GSAP ScrollTrigger with `once: true`. Subtle — `opacity: 0 → 1`, `y: 20 → 0`. Staggered for lists (`.spec-row`, `.work-row`).
- **No springs on content animation.** GSAP uses `power2.out`. Framer Motion uses custom bezier `[0.16, 1, 0.3, 1]`. Springs are reserved for cursor physics only.

### Spacing & Layout
- Page padding: `var(--page-px)` = `clamp(1.5rem, 1rem + 3vw, 4rem)`
- Grid gap: `var(--grid-gap)` = `clamp(1rem, 0.8rem + 1vw, 2rem)`
- 12-column CSS grid for SelectedWork and case study layouts
- Max content width: `900px` for case study prose, full-bleed for index/hero
- Borders as dividers between columns (`divide-x`, `divide-y`, `border-b`)

---

## Component Architecture

### Page Flow
```
CurtainPreloader → [HeroSection → StudioSection → SelectedWork → ContactSection]
```

### Section Contracts
| Section | Role | Key Visual |
|---|---|---|
| **CurtainPreloader** | Boot sequence. Grid bg, HKJ brand watermark, red accent progress bar. Skipped on return visits via `sessionStorage`. | "HKJ-01 / SYS.INIT" → "READY" |
| **HeroSection** | Pure typography. Massive "DESIGN ENGINEERING" with ScrambleWord. Noise grain bg. Bottom bar with tagline + scroll prompt. | `clamp(4.5rem, 16vw, 18rem)` text |
| **StudioSection** | Hardware spec sheet. Two-column: bordered image frame ("FIG 1.0") with grayscale photo + specs table on surface bg. | `Model: HKJ-01`, grid bg, shadow box |
| **SelectedWork** | 12-col bordered table. Index numbers, grayscale→color thumbnails, sector badges, `[ OPEN ] →` CTAs. | Hover row highlight, accent transitions |
| **ContactSection** | 4-col info grid (email, services, socials, time) + massive 19vw "LET'S TALK" CTA that copies email. | Edge-to-edge typography |

### Global Persistent Elements
- **GlobalNav**: Fixed top bar, `mix-blend-difference` white. Shrinking "HKJ" logo on scroll (Framer `useTransform`). Hamburger always visible. Desktop: Work/Studio nav links + rotated "Get In Touch" side element.
- **MobileMenu**: Full-screen overlay. Grid bg. `[ NAV : MENU ]` header. Numbered links (`01 Work`, `02 Studio`, `03 Contact`). `SYS.INFO` footer with email + LiveClock + availability status.
- **Cursor**: Desktop-only custom cursor. States: default (8px white dot), link (6px), image (50px ring + "View"), explore (60px ring + "Open"), play (50px ring + play icon).

### Case Study (`/work/[slug]`)
7-chapter editorial structure with pinned `ChapterSidebar`:
1. **Cover** — Full-bleed hero image + TL;DR panel
2. **The Brief** — Editorial headline + metadata grid
3. **The Process** — Rough sketches/wireframes
4. **The Craft** — Highlight accordion (challenge/recipe pattern)
5. **The Engine** — Engineering copy + signal tags
6. **The Numbers** — Stat grid dashboard
7. **Credits** — Contributors + schematic summary

Separated by `StrataBand` components (48px surface-colored dividers).

---

## Animation Philosophy

### GSAP (Scroll-Driven)
- Used for: ScrollTrigger reveals, staggered list entrances, timeline sequences
- Always `once: true` on ScrollTrigger — no reverse/replay
- Easing: `power2.out` for reveals. Never bounce, never elastic.
- Stagger: `0.1s` for list items
- Lenis synced: `autoRaf: false`, GSAP ticker drives `lenis.raf(time)`

### Framer Motion (Declarative UI)
- Used for: Cursor spring physics, page transitions (AnimatePresence), hover state morphs, scroll-linked transforms (`useScroll`, `useTransform`)
- Default ease: `[0.16, 1, 0.3, 1]` (fast-in, gentle-out)
- AnimatePresence for: MobileMenu, CurtainPreloader, cursor ripple
- `layoutId` for case study hero image shared element transition

### What NOT to Do
- No bounce/spring on content (only cursor)
- No parallax on text
- No 3D transforms or perspective effects
- No infinite looping animations (except status pulse dots)
- No audio, no WebGL, no particle effects
- Respect `prefers-reduced-motion` — all animations collapse to instant

---

## Tech Stack & Patterns

### Stack
- **Next.js 16** + **React 19** (App Router, Server Components by default)
- **Tailwind CSS v4** (`@import "tailwindcss"` syntax, `@tailwindcss/postcss`)
- **GSAP 3** + `@gsap/react` (useGSAP hook) + ScrollTrigger
- **Framer Motion 12** (motion components, AnimatePresence, springs)
- **Lenis** (smooth scroll, synced to GSAP ticker)
- **Zustand 5** (minimal global state: `isLoaded`, `scrollY`, `activeSection`)

### File Conventions
- Sections live in `src/components/sections/`
- UI primitives in `src/components/ui/`
- Case study components in `src/components/case-study/`
- Hooks in `src/hooks/`
- Constants/data in `src/constants/`
- Store in `src/lib/store.ts`
- GSAP init in `src/lib/gsap.ts`
- Design tokens in `src/app/globals.css`

### Client vs Server Components
- `page.tsx` files are Server Components (no `"use client"`)
- All interactive components use `"use client"` directive
- `not-found.tsx` is a Server Component — no event handlers

### CSS Approach
- Tailwind utility classes for layout and spacing
- CSS custom properties for all colors, type sizes, and spacing values
- Inline `style={{}}` for dynamic values and CSS variables that Tailwind can't reference
- Custom utility classes in `globals.css` `@layer utilities`: `.label`, `.micro`, `.bracket-label`, `.grid-lines`, `.dot-matrix`, `.te-panel`, `.hairline`
- No CSS modules, no styled-components

---

## Content & Copy Voice

### Tone
Clinical. Precise. Understated confidence. The copy reads like a spec sheet, not a sales pitch.

- "Tactile products at the intersection of high-fidelity craft and deep systems thinking."
- Not: "I build amazing websites that will blow your mind!"

### Project Data
All project content lives in `src/constants/projects.ts` as a typed `PROJECTS` array. Each project has: editorial, process, highlights (challenge/recipe), engineering (signals), statistics, schematic (stack/grid/typography/colors), and contributors.

### System Strings
Use technical nomenclature consistently:
- "Available" (not "Open for work")
- "Start a Conversation" (not "Hire me")
- "Services & Context" (not "What I do")
- "Local Time" (not "Current time")
- Index numbers always zero-padded: `01`, `02`, `03`

---

## Hard Rules

1. **No gradients** except the bottom-fade on case study hero images for text legibility.
2. **No shadows** except the subtle `4px 4px 0` hard shadow on the StudioSection image frame.
3. **No rounded corners** on containers. Square edges only. Exception: status indicator dots (`rounded-full`).
4. **No color outside the palette.** No blues, no greens (except the availability status dot), no purples.
5. **No emoji** in the UI. Technical symbols only: `→`, `←`, `↑`, `//`, `[ ]`, `&copy;`.
6. **No Lorem Ipsum.** Every string should feel like it belongs in a technical manual.
7. **No WebGL, no Three.js in production.** The R3F deps in `package.json` are legacy — do not use them.
8. **No audio.** The site is silent.
9. **Images default to grayscale** (`grayscale contrast-125`) and reveal color on hover.
10. **Scrollbar is styled.** 4px width, accent red on hover. This is part of the experience.
