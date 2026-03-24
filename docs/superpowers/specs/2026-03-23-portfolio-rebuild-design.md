# HKJ Studio Portfolio Rebuild — Design Specification

> **Date:** 2026-03-23
> **Status:** Approved
> **Governing document:** `RYKJUN-PROJECT-FRAMEWORK.md` — all decisions in this spec derive from that framework. During implementation, the framework is the source of truth. If this spec and the framework conflict, the framework wins.

---

## 1. What we're building

A fresh build of the HKJ Studio portfolio, guided by the RYKJUN Project Framework. The current codebase provides reference infrastructure (fonts pipeline, Lenis/GSAP integration, case study layouts) but the site is being rebuilt from the framework's principles, not evolved from the current implementation.

### Design philosophy (from framework)

> Warm, quiet, and precise. Like a well-made book that happens to be interactive.

Two layers coexist:
- **Surface:** Craft-forward. Warm colors, considered typography, material textures. What visitors see first.
- **Substrate:** Code-structured. Sequential numbering, systematic spacing, monospace metadata. What visitors discover through attention.

The surface never goes away. The substrate never dominates.

---

## 2. Sitemap

```
/                       Homepage
/work/[slug]            Project detail (case study)
/experiments            Experiment archive
/experiments/[slug]     Individual experiment
/about                  Bio, philosophy, contact
```

**Removed from current site:** `/journal`, `/journal/[slug]`, `/coddiwomple`, `/coddiwomple/[slug]`, `/works`

**Rule:** No page ships until it has real content. `/experiments` ships when 3+ experiments exist. `/about` ships when the copy is written.

---

## 3. Typography

### Fonts

| Role | Font | Source | License |
|---|---|---|---|
| Display | Newsreader (variable) | Google Fonts, self-hosted | Free (OFL) |
| Body | Satoshi (variable) | Fontshare, self-hosted | Free (personal + commercial) |
| System | Fragment Mono | Google Fonts, self-hosted | Free (OFL) |

All fonts self-hosted and subsetted. Target: < 100KB total. `font-display: swap`.

**Note:** Font selection may change during implementation. The framework defines roles and criteria, not specific families. If Newsreader/Satoshi/Fragment Mono are swapped, the replacement must meet the same criteria:
- Display: serif with warmth and character, good at 28px and 18px
- Body: clean sans-serif, humanist not geometric, good readability
- System: monospace with good numerals, understated

### Type scale

| Element | Font | Size | Weight | Tracking | Line height | Ink level |
|---|---|---|---|---|---|---|
| Name | Newsreader | 28–36px | Regular | Default | 1.2 | `--ink-full` |
| Project title | Newsreader | 18–22px | Regular | Default | 1.2 | `--ink-primary` |
| Body text | Satoshi | 15–16px | Regular | Default | 1.7–1.8 | `--ink-primary` |
| Nav links | Satoshi | 12.5–13px | Regular | Default | — | `--ink-secondary` |
| Section label | Fragment Mono | 10.5–11px | Regular | 0.04em+ | — | `--ink-secondary` |
| Metadata | Fragment Mono | 10–11px | Regular | 0.04em+ | — | `--ink-muted` |

Nav uses Regular weight (not Medium) to stay consistent with the framework's "never bold body text — hierarchy through opacity only" principle. Nav hierarchy comes from its `--ink-secondary` opacity, not weight.

### Responsive type

Sizes use `clamp()` for fluid scaling between mobile and desktop breakpoints. The ranges above define the min and max. Example: `clamp(28px, 4vw, 36px)` for the Name. Exact clamp values are determined during implementation, but every element must stay within its defined range.

### Rules

- Never bold body text. Hierarchy through opacity only.
- Section labels are the structural rhythm — identical treatment everywhere.
- Monospace only in system contexts (dates, numbers, labels, code). Never in body text.

---

## 4. Color

### Ink-on-paper system

```css
--paper:         #f7f6f3;

--ink-full:      rgba(35, 32, 28, 1.00);   /* name, strong headings */
--ink-primary:   rgba(35, 32, 28, 0.82);   /* body text, project titles */
--ink-secondary: rgba(35, 32, 28, 0.52);   /* descriptions, nav */
--ink-muted:     rgba(35, 32, 28, 0.35);   /* hover target state */
--ink-faint:     rgba(35, 32, 28, 0.20);   /* borders, dividers */
--ink-ghost:     rgba(35, 32, 28, 0.10);   /* subtle backgrounds */
--ink-whisper:   rgba(35, 32, 28, 0.05);   /* grain, faint fills */
```

### Breaking changes from current codebase

The ink system replaces the current multi-token color system entirely:
- `--color-bg: #F5F2ED` → `--paper: #f7f6f3` (cooler, slightly lighter)
- `--ink: 26, 25, 23` → `rgb(35, 32, 28)` (warmer, lighter)
- **Deleted:** `--color-accent` (#5E84A0), `--color-warm` (#B89A78), `--color-warm-muted`, `--color-surface`, `--color-elevated`, `--color-border`, `--color-border-strong`, all `--color-text-*` tokens

### What's NOT here

No accent color on the base page. No gradients. No colored links, buttons, or highlights. The ink opacity scale handles all hierarchy.

### Cover colors

Each project defines its own palette in its content data:
- `cover.bg` — background color
- `cover.text` — text color (determined by background lightness)
- `cover.accent` — subtle accent (optional, for borders or details)

Rules: no pure black or pure white. Adjacent covers alternate light/dark. Max 3 values per cover palette.

---

## 5. Spacing

### Scale

```css
--space-micro:      4px;    /* tag padding, inline gaps */
--space-small:      8px;    /* tight internal spacing */
--space-compact:    12px;   /* related elements, cover grid gap */
--space-standard:   16px;   /* list items, internal padding */
--space-comfortable: 24px;  /* component padding, side padding */
--space-room:       32px;   /* gap between label and content */
--space-break:      48px;   /* between content blocks */
--space-section:    56px;   /* between ALL major sections */
--space-breath:     72px;   /* hero top margin, pre-footer space */
```

### Rules

- Section-to-section spacing is always 56px. No exceptions.
- Space above hero (name): 72px.
- Space before footer: 72px.
- Every value on-scale. No arbitrary pixel values.
- When in doubt, more space.

---

## 6. Layout

### Homepage

Single centered column. 24px side padding.

| Content type | Max width |
|---|---|
| Text sections (identity, now, links) | 540px |
| Cover grid | 640px |
| Experiment preview | 540px |

### Cover grid

2 columns, square aspect ratio, 12px gap. Never wider than 640px. Never more than 2 columns.

With 3 projects: 2 covers on row 1, 1 on row 2 (left-aligned). The asymmetry leaves breathing room.

Mobile (< 480px): 1 column. Covers get larger, maintaining visual impact.

### Project detail pages

Can break the 640px constraint. Full-width images, immersive layouts, larger type. The detail page is where visual ambition lives.

### Experiment detail pages

Live demo at top (full-width or near-full-width). Writeup below in 540px column.

---

## 7. Homepage sections

| Order | Section | Purpose | Max width | Content |
|---|---|---|---|---|
| 1 | Identity | Name, role, one paragraph | 540px | Name in Newsreader 28–36px. Role line in Satoshi. One paragraph about what you do and how you think. |
| 2 | Work | Project covers — visual center of gravity | 640px | 2-col grid of square covers. 3 projects: Gyeol, Sift, Conductor. Section label "Work" in Fragment Mono. |
| 3 | Experiments | Preview of recent experiments | 540px | Ships when 3+ experiments exist. Compact vertical list: each row is title (Satoshi, `--ink-primary`) + date (Fragment Mono, `--ink-muted`), separated by `--ink-faint` border. No cards, no colors — the simplicity contrasts with the cover grid above. Section label "Experiments". |
| 4 | Now | Current focus, updated monthly | 540px | 2–3 sentences. What you're actually working on this week. Section label "Now". |
| 5 | Links | Social and contact | 540px | Email + social links. Section label "Links" or none. |
| 6 | Footer | Copyright, version | 540px | Quiet. Year + copyright + version number. |

### First-visit priority

Within 5 seconds, a visitor understands:
1. Your name and what you do
2. The quality of your work (through the covers)
3. How to see more or get in touch

---

## 8. Covers

### Structure

Every cover shares:
- Square aspect ratio
- `border-radius: 8px`
- Project number: top-left, Fragment Mono, very faint
- Title: bottom area, Newsreader (display serif)
- Short note + year: below title, smaller, muted
- Grain texture: inline SVG `<feTurbulence>` noise filter (baseFrequency ~0.65, numOctaves 4), rendered as a pseudo-element overlay. Opacity 20–35%. `mix-blend-mode: multiply` on light covers, `soft-light` on dark. The noise gives flat color the quality of printed paper.

Every cover is unique in:
- Background color
- Text color
- Potentially: title treatment, typographic variation

### No images in v1

Color + type is the identity. If every cover needs an image to be interesting, the type and color choices aren't strong enough.

### Cover palettes

Per framework rule: adjacent covers must alternate light/dark for contrast. Current project data has all-dark covers — this must change. The 2-col grid layout (2 on row 1, 1 on row 2) means row 1 needs one dark + one light cover.

**Gyeol** (dark cover):
- `bg: "#2a241c"` (warm dark brown)
- `text: "rgba(255, 252, 245, 0.85)"` (warm off-white)
- `accent: "rgba(255, 252, 245, 0.15)"`

**Sift** (light cover — changed from current dark):
- `bg: "#e8e2d8"` (warm parchment)
- `text: "rgba(35, 32, 28, 0.82)"` (ink-primary)
- `accent: "rgba(35, 32, 28, 0.10)"`

**Conductor** (dark cover, WIP):
- `bg: "#3d3830"` (warm charcoal)
- `text: "rgba(255, 252, 245, 0.80)"` (warm off-white, slightly dimmer)
- `accent: "rgba(255, 252, 245, 0.12)"`
- Include "In progress" label in Fragment Mono, same treatment as year/note metadata.

These palettes are starting points. Exact values may be refined during implementation to ensure covers feel like artifacts (printed cards, book covers), not flat UI.

### Interaction

| State | Effect | Duration | Easing |
|---|---|---|---|
| Hover | `translateY(-3px)` + warm shadow grows | 350ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Press | `scale(0.98)` | 100ms | ease-out |

Shadow color: always warm ink-base at low opacity, never pure black.

---

## 9. Navigation

### GlobalNav

- **Left:** Name as text home link (Satoshi)
- **Right:** Work, Experiments, About (Satoshi, 12.5–13px, `ink-secondary`)
- Static position (no scroll-direction hide/show in v1)
- 48px height
- No backdrop blur

### Mobile

- Hamburger trigger (top-right, Satoshi, `--ink-secondary`) → full-screen overlay
- Background: `--paper`. No blur, no dark overlay — same warmth as the page.
- Links: Work, Experiments, About — Newsreader, 22–28px, `--ink-primary`, stacked vertically with `--space-comfortable` (24px) gap
- Email + socials at bottom, Fragment Mono, `--ink-muted`
- Active page indicated (matching desktop treatment)
- Open/close: 350ms ease-out opacity transition. No clip-path, no slide — simple presence.
- Focus trap when open
- Close on Escape key or close button

### Footer

Two rows:
- **Row 1:** Nav links (Work, Experiments, About) + email link + social links (GitHub, X/Twitter, LinkedIn). All in Satoshi, `--ink-secondary`, separated by `--ink-faint` dividers or generous spacing.
- **Row 2:** "© 2026 HKJ" + version number (e.g., "v0.1.0"). Fragment Mono, `--ink-muted`.

Full width of content column (540px max), horizontally centered.

---

## 10. Interaction design

### Timing

| Context | Duration | Easing |
|---|---|---|
| Hover states | 300–350ms | ease-out |
| Press/active | 100ms | ease-out |
| Border/underline changes | 350ms | ease |
| Page transitions | 500–800ms | ease-out |
| Content reveals (v0.3+) | 500ms | ease-out |

### Hover behavior

All hover states shift one step up the ink opacity scale:
- `ink-ghost` → `ink-faint`
- `ink-faint` → `ink-muted`
- `ink-muted` → `ink-secondary`

Consistent "brighten on hover" across the entire site.

### v0.1 behavior (ships first)

- No entrance animations. Content present on load.
- Hover opacity-step shifts
- Cover hover: translateY + shadow
- Lenis smooth scroll
- `prefers-reduced-motion` disables all motion, opacity changes instant, transforms removed

### v0.3+ behavior (added later)

- Cursor: 1–2px displacement field. Ambient, subtle. Invisible to most visitors.
- Page transitions: text scramble through random monospace characters before resolving (300ms). Replaces current cinematic overlay.
- Scroll reveals: gentle fade-in + small translateY on viewport entry. Never scrubbed (never tied to scroll position).
- ASCII loading placeholders (replace skeleton screens)
- ASCII 404 page

### The rule

If someone would describe the site as "the one with the X effect," X is too prominent. Effects are felt, not named.

---

## 11. Computational effects placement

| Location | Effect | Ships in |
|---|---|---|
| Cursor | 1–2px displacement warp | v0.3 |
| Page transitions | Monospace text scramble (300ms) | v0.3 |
| Loading states | ASCII-noise placeholder | v0.3 |
| Experiment pages | Full effects (the content itself) | v0.2 |
| 404 page | Full ASCII rendering | v0.4 |

### Where effects NEVER appear

- Hero / Identity section
- Cover grid
- Body text
- Navigation

---

## 12. Accessibility

- `prefers-reduced-motion`: all motion disabled, opacity instant, transforms removed
- Skip-to-content link (visually hidden, visible on focus)
- ARIA live region for route changes
- Focus trap on mobile menu
- `aria-label` on cover links ("View Gyeol case study")
- Keyboard navigable throughout
- No effect drops frame rate below 60fps on a 2-year-old laptop

---

## 13. Performance targets

| Metric | Target |
|---|---|
| LCP | < 2.5s |
| CLS | < 0.1 |
| Initial JS | < 150KB gzipped |
| Total homepage weight | < 500KB |
| Fonts | < 100KB total (subsetted) |

---

## 14. Technical stack

```
Next.js 16 (App Router) — current version, not downgrading to 14
TypeScript (strict)
Tailwind CSS v4
GSAP (ScrollTrigger — v0.3+. SplitText requires Club GreenSock license; use custom character-split implementation if unlicensed)
Lenis (smooth scroll)
Zustand (minimal state)
Vercel (deployment)
```

### Code quality (from framework)

- No component libraries. Build what you need.
- No utility packages for things you can write in < 30 lines.
- CSS custom properties for all design tokens (colors, spacing, timing, easing).
- Every component is a single file unless complexity genuinely requires splitting.

### Carried from current codebase

- Font loading pipeline (swap to new fonts)
- Lenis + GSAP ticker sync (`autoRaf: false`, `gsap.ticker.add` drives `lenis.raf`)
- Case study page layout (`/work/[slug]`) — refine, don't rebuild
- CloudCanvas component → relocate to `/experiments/clouds-at-sea`
- SmoothScroll wrapper

**Removed:**
- Preloader component
- PageTransition overlay (replaced by text scramble in v0.3)
- All staggered GSAP entrance animations (v0.1 has none)
- Journal pages + data
- Coddiwomple pages (replaced by `/experiments`)
- Multi-token color system (replaced by ink scale)
- MobileMenu (rebuilt simpler)
- GlobalNav scroll-direction behavior (static in v1)

**Deleted from projects data:**
- Moji, Hana, Pour, Atlas (stubs with no content)

---

## 15. Content writing rules (from framework)

- No buzzwords. No "passionate about design." No "crafting delightful experiences."
- Write like you talk. If you wouldn't say it in a conversation, don't write it on the site.
- Bio: specific about what you do and how you think. Reference real details (tools, techniques, values), not abstractions.
- Project descriptions: what the project IS, not what stack it uses. The stack belongs in the detail page, not the cover.
- Now section: genuinely current. What you're actually working on this week, not what sounds impressive.

---

## 16. Content data structures

### Project frontmatter

```yaml
---
title: "Gyeol"
slug: "gyeol"
date: "2025-XX-XX"
order: 1
description: "One sentence about what the project is and does."
cover:
  bg: "#2a241c"
  text: "rgba(255,252,245,0.85)"
  accent: "rgba(255,252,245,0.15)"
status: "shipped"       # or "wip" for Conductor
---
```

### Experiment meta

```json
{
  "title": "Clouds at Sea",
  "date": "2026-XX-XX",
  "tags": ["webgl", "shader", "generative"],
  "description": "Procedural FBM clouds with cursor-driven wind.",
  "color": "#e2ddd5",
  "status": "shipped"
}
```

---

## 17. Ship plan

### v0.1.0 — Exists

- [ ] Fresh Next.js scaffold, Tailwind configured, new fonts loaded (Newsreader, Satoshi, Fragment Mono)
- [ ] CSS custom properties: ink scale, spacing scale, type scale
- [ ] Homepage: Identity, Work (cover grid with 3 projects), Now, Links, Footer
- [ ] Cover component: color field, grain texture, typography, hover interaction
- [ ] GlobalNav: static, name + 3 links
- [ ] Mobile responsive (1-col covers below 480px)
- [ ] Lenis smooth scroll
- [ ] Deployed to Vercel
- [ ] No entrance animations — content present on load

### v0.2.0 — Has depth

- [ ] `/work/[slug]` project detail pages (carry over + refine Gyeol, Sift case studies)
- [ ] Conductor case study (build out from WIP data)
- [ ] `/experiments` page with grid
- [ ] `/experiments/clouds-at-sea` with CloudCanvas
- [ ] Content pipeline (MDX or structured data)
- [ ] First 3+ experiments shipped

### v0.3.0 — Has craft

- [ ] Page transitions: text scramble through monospace (300ms)
- [ ] Cursor displacement effect (1–2px)
- [ ] ScrollTrigger section reveals (gentle, minimal)
- [ ] ASCII loading placeholders
- [ ] Performance audit against targets

### v0.4.0 — Has polish

- [ ] `/about` page (when copy is written)
- [ ] 404 page with ASCII rendering
- [ ] OG images
- [ ] SEO, sitemap
- [ ] Accessibility audit
- [ ] Consider sound design only if it genuinely improves the experience (not in scope by default)

---

## 18. Governing principles (from framework)

1. **If removing it doesn't make the site worse, remove it.**
2. **The work is louder than the container.**
3. **Warmth is the default. Code is the discovery.**
4. **Ship, then polish. Never polish what hasn't shipped.**
5. **Write descriptions about what things do, not what they're built with.**
6. **The site should feel like someone made it on purpose.**
7. **Don't chase the award. Build something the award chases.**

---

## 19. Reference documents

- **`RYKJUN-PROJECT-FRAMEWORK.md`** — The governing framework. Source of truth for all design decisions. Must be consulted during implementation for any ambiguous decision.
- **Current codebase** (`src/`) — Reference for reusable infrastructure. Not the starting point for new components.
- **Portfolio analysis** (Bao To, Sarah Chen) — Informed font selection and ink-opacity approach. Not templates to copy.
