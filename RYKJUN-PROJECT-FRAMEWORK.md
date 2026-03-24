# RYKJUN Portfolio — Project Framework

> This is the governing document for the portfolio.
> Every decision here exists because it makes the site better, not because it signals a trend.
> If a decision can't be justified by how it serves the visitor or the work, it doesn't belong here.

---

## What this site is

A portfolio for a design engineer. It shows work, demonstrates craft, and makes it easy for someone to understand what you do, how you think, and whether they want to work with you.

It should feel considered. Not flashy, not plain — considered. Every choice visible on the page should look like someone thought about it and decided yes, this is right. That quality is what separates a site that earns attention from one that demands it.

## What this site is not

- Not a tech demo. Effects serve the experience, not the other way around.
- Not a design trend showcase. The site shouldn't feel like a mood board of 2026 aesthetics.
- Not a clone of any reference. Flora, Emil, Rauno, Paco, Tomoya, Cathy — they inform taste, not templates.
- Not optimized for Awwwards scoring criteria. If the site is genuinely excellent, recognition follows. If it's engineered for a score, it shows.

---

## 1. Design direction

### The feel

Warm, quiet, and precise. Like a well-made book that happens to be interactive. The kind of site where someone scrolls slowly because the pacing invites it, not because animations force it.

The warmth comes from color and type choices — ink on paper, not pixels on screen. The quiet comes from restraint — generous spacing, minimal elements, no decoration. The precision comes from invisible details — the hover timing, the transition easing, the exact weight of a border.

### The duality

The site has two layers that coexist without competing:

**Surface:** Craft-forward. Warm colors, considered typography, material textures where they earn their place. This is what a visitor sees first and what defines the site's personality. It reads as someone with taste and care.

**Substrate:** Code-structured. Sequential numbering, systematic spacing, monospace metadata, and — selectively — computational effects (ASCII rendering, displacement, generative elements). This is what a visitor discovers through interaction or attention. It reads as someone who thinks in systems.

The surface never goes away. The substrate never dominates. A visitor who doesn't notice the code layer still gets a beautiful portfolio. A visitor who does notice it understands the maker more deeply.

### Where effects live

Computational effects (ASCII, displacement, generative visuals) are not features of the homepage. They are:

- **Cursor behavior** — subtle, ambient, always subordinate to content readability
- **Transition moments** — the brief passage between one state and another (page navigation, hover on/off)
- **Loading states** — where content isn't yet present and the effect fills the gap usefully
- **Experiment pages** — where technical demonstration is the actual content
- **Error states** — where surprise and delight are welcome

If an effect is noticeable enough that someone would describe the site as "the one with the ASCII effect," it's too prominent. The effect should be something they feel, not something they name.

---

## 2. Structure

### Pages

```
/                       Homepage
/work/[slug]            Project detail
/experiments            Experiment archive
/experiments/[slug]     Individual experiment
/about                  Bio, philosophy, contact
```

No page exists until it has real content. Don't ship `/about` until you've written something worth reading. Don't ship `/experiments` until you have experiments to show.

### Homepage sections

| Order | Section | Purpose | Presence |
|---|---|---|---|
| 1 | Identity | Name, role, one paragraph | Always |
| 2 | Work | Project covers — the visual center of the page | Always |
| 3 | Experiments | Small preview of recent experiments | When 3+ experiments exist |
| 4 | Now | Current focus, 2-3 sentences | Always, updated monthly |
| 5 | Links | Social and contact | Always |
| 6 | Footer | Copyright, version | Always |

The work section is the visual center of gravity. Everything above it sets context. Everything below it is supporting detail.

### Content priority

A first-time visitor should understand three things within 5 seconds:
1. Your name and what you do
2. The quality of your work (through the covers)
3. How to see more or get in touch

Everything else is second-visit depth.

---

## 3. Typography

### Principle

Typography is the primary design material. When the type is right, the page barely needs anything else.

### System

Three fonts. Three roles. No exceptions.

| Role | Usage | Selection criteria |
|---|---|---|
| Display | Name, project titles, headings | A serif with warmth and character. Not generic, not trendy. Should look good at 28px and 18px. |
| Body | Descriptions, paragraphs, nav | A clean sans-serif with good readability. Humanist, not geometric. |
| System | Dates, metadata, tags, labels, version | A monospace with good numerals. Understated. |

### Scale

The type scale should feel proportional, not arbitrary. Use a modular scale or define explicit sizes.

| Element | Size range | Notes |
|---|---|---|
| Name | 28–36px | The largest text on the page. Not dramatically large. |
| Project title | 18–22px | Prominent but not competing with the name. |
| Body text | 15–16px | Comfortable reading size. |
| Section label | 10.5–11px | Small, uppercase or lowercase, letterspaced. Monospace. |
| Metadata | 10–11px | The quietest text on the page. |
| Nav | 12.5–13px | Present but not dominant. |

### Rules

- Line height: 1.2 for display, 1.7–1.8 for body.
- Never bold body text. Use color/opacity hierarchy instead.
- Section labels are the structural rhythm of the page. They should all feel identical in treatment.
- Monospace appears only in system contexts (dates, numbers, labels, code). Never in body text.

---

## 4. Color

### Principle

One ink. One paper. That's the foundation. Everything else is a project-specific accent on covers.

### Base

```css
--paper: #f7f6f3;
--ink-full: rgba(35, 32, 28, 1);
--ink-primary: rgba(35, 32, 28, 0.82);
--ink-secondary: rgba(35, 32, 28, 0.52);
--ink-muted: rgba(35, 32, 28, 0.35);
--ink-faint: rgba(35, 32, 28, 0.2);
--ink-ghost: rgba(35, 32, 28, 0.1);
--ink-whisper: rgba(35, 32, 28, 0.05);
```

### Why this works

Pure black on white is clinical. This palette has warmth built in — every text element, every border, every shadow carries the same warm undertone. The consistency is what makes the page feel unified rather than assembled.

### Cover colors

Each project gets its own color identity defined in its content file. Covers are the only place non-ink colors appear on the homepage.

Rules for cover palettes:
- No pure black or pure white.
- Dark covers and light covers should alternate in the grid for contrast.
- Each cover palette is max 3 values: background, text, accent.

### What's not here

No accent color for the base page. No gradients on the base page. No colored links, buttons, or highlights. The ink opacity scale handles all hierarchy. This sounds limiting but it's actually liberating — you never have to decide which shade of blue a link should be.

---

## 5. Spacing

### Principle

Spacing is the equivalent of silence in music. Where you leave space matters as much as what you put in it.

### Scale

```
4px    — micro: tag padding, inline gaps
8px    — small: tight internal spacing
12px   — compact: related elements
16px   — standard: list items, internal padding
24px   — comfortable: component padding
32px   — room: gap between label and content
48px   — break: between content blocks
56px   — section: between major sections
72px   — breath: hero top margin, pre-footer space
```

### Rules

- Section-to-section spacing is always 56px. Consistency creates rhythm.
- The space above the hero (name) is 72px. This is the opening pause.
- Space before the footer is 72px. This is the closing breath.
- Every spacing value is on-scale. No arbitrary pixel values.
- When in doubt, more space. Cramped layouts are the most common failure mode.

---

## 6. Layout

### Homepage

The homepage is a single column. Max-width varies by content type:

- Text sections (identity, now, links): 540px max
- Cover grid: 640px max (2 columns x covers + gap)
- Experiment preview: 540px max

Centered horizontally with 24px side padding.

### Cover grid

2 columns, square aspect ratio, 12px gap. The grid is never wider than 640px and never more than 2 columns. More columns dilute the visual weight of each cover. Fewer columns make the page too long.

On mobile (< 480px), the grid becomes 1 column. The covers get larger, maintaining their visual impact.

### Project detail pages

These can break the 640px constraint. Full-width images, immersive layouts, larger type — the detail page is where visual ambition lives. The homepage is the frame. The project page is the gallery.

### Experiment detail pages

The live demo renders at the top (full-width or near-full-width). The writeup sits below in a 540px column. The demo is the content; the writeup is the context.

---

## 7. Covers

### What they are

Project covers are the most visual element on the homepage. Each one is a square with a color field, project number, title, and short note. They should feel like artifacts — printed cards, record sleeves, book covers — not digital UI cards.

### Structure

Every cover shares:
- Square aspect ratio
- Border-radius: 8px
- Project number: top-left corner, monospace, very faint
- Title: bottom area, display serif
- Short note + year: below title, smaller, muted
- Grain texture: subtle, giving the flat color a material quality

Every cover is unique in:
- Background color
- Text color (determined by background lightness)
- Potentially: title treatment, typographic variation

### Grain texture

A subtle SVG noise overlay gives flat color fields the quality of printed paper. Opacity between 20–35%. Blend mode: multiply on light covers, soft-light on dark covers. If the grain is the first thing you notice, it's too strong.

### Interaction

Hover: translateY(-3px) with a warm shadow that grows gradually. Duration: 350ms. Easing: cubic-bezier(0.16, 1, 0.3, 1). The shadow color is always warm (ink-base with low opacity), never pure black.

Press: scale(0.98) for 100ms. Instant feedback.

### Rules

- No images on covers in v1. Color + type is the identity. If every cover needs an image to be interesting, the type and color choices aren't strong enough.
- Adjacent covers should contrast (light next to dark).
- Cover titles use the display serif. This is the one place the serif does heavy lifting.

---

## 8. Interaction

### Principle

Interactions should feel physical — like touching a warm surface, not clicking a cold button. Slower than app-UI (this is a space to spend time in), faster than art-site (this is still functional).

### Timing

| Context | Duration | Easing |
|---|---|---|
| Hover states | 300–350ms | ease-out |
| Press/active states | 100ms | ease-out |
| Border/underline changes | 350ms | ease |
| Page transitions | 500–800ms | ease-out |
| Content reveals on scroll | 500ms | ease-out |

### Hover states

All hover states shift one step in the opacity scale. ghost → faint, faint → muted, muted → secondary. This creates a consistent "brighten on hover" feel across the entire site.

### Page load

v1: No entrance animation. Content is present when the page loads. The confidence of immediate presence says more than a choreographed reveal.

v2+: If entrance animation is added, it should be a single orchestrated moment (< 500ms), not individually staggered elements. Everything appears together, slightly delayed, like a curtain rising.

### Scroll behavior

Smooth scroll via Lenis. Content reveals via ScrollTrigger are permitted but should be minimal — a gentle fade-in and small translateY when entering the viewport. Never scrubbed animations (animations that progress as you scroll). The visitor controls the pace.

### prefers-reduced-motion

All motion is disabled when the user has requested reduced motion. Opacity changes happen instantly. Transforms are removed. The site remains fully functional and readable.

---

## 9. Computational effects

### Principle

These effects exist to communicate something about who you are — someone who works at the intersection of design and engineering. They are not decoration. They are not the personality of the site. They are a subtle layer that rewards attention.

### Where they can appear

| Location | Effect | Justification |
|---|---|---|
| Cursor | Very subtle displacement field (1–2px radius warp) | Makes the page feel responsive to presence. Invisible to most visitors. |
| Page transitions | Text characters scramble through random monospace characters before resolving (300ms) | Replaces generic fade. Communicates "tuning in" without being theatrical. |
| Loading states | ASCII-noise placeholder that resolves into content | Replaces generic skeleton blocks. Unique to this site. |
| Experiment pages | Full effects as the actual content | Experiments ARE technical demonstrations. Effects are appropriate here. |
| 404 page | Full ASCII rendering | Unexpected, delightful, appropriate for an error state. |

### Where they don't appear

- Hero section. The name and bio are typography, not a tech demo.
- Cover grid. Covers are visual artifacts, not shader canvases.
- Body text. Text is always immediately readable.
- Navigation. Navigation is always immediately functional.

### Performance rule

No effect should drop the frame rate below 60fps on a 2-year-old laptop. If it does, simplify or remove it. The warmth of the experience matters more than the technical impressiveness of an effect.

---

## 10. Technical

### Stack

```
Next.js 16 (App Router)
TypeScript (strict)
Tailwind CSS v4
GSAP (ScrollTrigger, SplitText)
Lenis (smooth scroll)
Zustand (minimal state)
Vercel (deployment)
```

### Performance targets

| Metric | Target |
|---|---|
| LCP | < 2.5s |
| CLS | < 0.1 |
| Initial JS | < 150KB gzipped |
| Total homepage weight | < 500KB |
| Fonts | < 100KB total (subsetted) |

### Font loading

Self-hosted. Subsetted to only the characters used. `font-display: swap` to prevent invisible text during load. Fonts are the first visual impression — they must load fast.

### Code quality

- No component libraries. Build what you need.
- No utility packages for things you can write in < 30 lines.
- CSS custom properties for all design tokens (colors, spacing, timing, easing).
- Every component is a single file unless complexity genuinely requires splitting.

---

## 11. Content

### Writing rules

- No buzzwords. No "passionate about design." No "crafting delightful experiences."
- Write like you talk. If you wouldn't say it in a conversation, don't write it on the site.
- Bio: specific about what you do and how you think. Reference real details (tools, techniques, values), not abstractions.
- Project descriptions: what the project IS, not what stack it uses. The stack belongs in the detail page, not the cover.
- Now section: genuinely current. What you're actually working on this week, not what sounds impressive.

---

## 12. Ship plan

### v0.1.0 — Exists

- [ ] Next.js project, Tailwind configured, fonts loaded
- [ ] Homepage: identity, cover grid (3 covers), now, links, footer
- [ ] Cover component with color, grain, hover
- [ ] Lenis smooth scroll
- [ ] Mobile responsive
- [ ] Deployed to Vercel

### v0.2.0 — Has depth

- [ ] /work/[slug] project detail pages
- [ ] /experiments page with grid
- [ ] /experiments/[slug] with live demo
- [ ] First 3+ experiments shipped
- [ ] Content pipeline working

### v0.3.0 — Has craft

- [ ] Page transitions (text scramble)
- [ ] Cursor displacement effect
- [ ] ScrollTrigger section reveals
- [ ] ASCII loading states
- [ ] Performance audit

### v0.4.0 — Has polish

- [ ] About page
- [ ] 404 page with ASCII rendering
- [ ] OG images
- [ ] SEO, sitemap
- [ ] Accessibility audit

---

## 13. Principles (reference always)

1. **If removing it doesn't make the site worse, remove it.**
2. **The work is louder than the container.**
3. **Warmth is the default. Code is the discovery.**
4. **Ship, then polish. Never polish what hasn't shipped.**
5. **Write descriptions about what things do, not what they're built with.**
6. **The site should feel like someone made it on purpose.**
7. **Don't chase the award. Build something the award chases.**
