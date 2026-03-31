# HKJ Portfolio Framework — Design Specification

> A structural framework derived from jinsupark.com, jungheonlee.com, and corentinbernadou.com. Defines architecture, slots, and rules. Creative decisions (copy, imagery, alive signals) are yours to fill in.

## References

| Site | What it provides to this framework |
|------|-----------------------------------|
| jinsupark.com | Page architecture, project feed format, filter bar, live data pattern, spacing rhythm |
| jungheonlee.com | Interactive hero slot, scroll-triggered reveals, sparse/deliberate curation, "site as proof" |
| corentinbernadou.com | Editorial framing system, animation-driven pacing, film-grade presentation of limited work |

## Overall Architecture

```
┌─────────────────────────────────────────────────────┐
│ TOP BAR                                              │
├─────────────────────────────────────────────────────┤
│ HERO SECTION                                         │
│  ├─ Welcome text slot                                │
│  ├─ Live data / signature element slot               │
│  ├─ Display headline slot                            │
│  └─ Subtitle slot                                    │
├─────────────────────────────────────────────────────┤
│ FILTER BAR                                           │
├─────────────────────────────────────────────────────┤
│ PROJECT FEED                                         │
│  ├─ Project entry (text row + full-bleed image)      │
│  ├─ Project entry                                    │
│  ├─ ...repeats for each piece                        │
│  └─ (scroll-triggered fade-in per entry)             │
├─────────────────────────────────────────────────────┤
│ FOOTER                                               │
└─────────────────────────────────────────────────────┘
```

**No max-width container.** The page is full-bleed. Images go edge-to-edge. Text content lives within gutter margins (`--gutter`).

**Single vertical scroll.** No sections, no snapping, no scroll-hijacking. Just a continuous feed.

---

## Section 1: Top Bar

**Architecture (from JSP):**
```
[brand mark]                    [link] [link] [link] [link]
```

**Rules:**
- One horizontal flex row, `justify-content: space-between`
- Padding: `20px var(--gutter)`
- Font: mono, 12px, `letter-spacing: 0.01em`
- Brand mark: left-aligned, `color: var(--fg-2)`
- Links: right-aligned, `color: var(--fg-3)`, hover `color: var(--fg)`
- Not sticky — scrolls with the page
- Transition: `color 0.3s var(--ease)`

**Slots you fill:**
- Brand mark text (e.g., "HKJ Studio", "HKJ", etc.)
- Links (social links, contact, about — your choice of which and how many)

---

## Section 2: Hero

**Architecture (hybrid JSP + jungheonlee + corentinbernadou):**
```
[welcome text — small, muted, max-width ~520px]

[signature element slot — can be anything: clock, canvas, live data, coordinates, editorial label, or nothing]

[display headline — large, bold, spanning]

[subtitle — mono, small, muted]
```

**Rules:**
- Padding: `clamp(40px, 8vh, 80px) var(--gutter) clamp(56px, 12vh, 120px)`
- Welcome text: body font, `clamp(13px, 1.2vw, 15px)`, `line-height: 1.7`, `color: var(--fg-2)`, `max-width: 520px`
- Headline: display font, `clamp(32px, 5vw, 64px)`, `font-weight: 500-600`, `line-height: 1.1`, `letter-spacing: -0.025em`, `color: var(--fg)`
- Subtitle: mono, 12px, `color: var(--fg-3)`
- Each child element gets an entrance animation (`opacity: 0 → 1`, staggered by `--i * 80ms`)
- Generous vertical spacing between elements: `clamp(32px, 5vh, 56px)` margin-bottom on each

**Slots you fill:**
- Welcome text content
- What the signature element IS (clock, live data row, editorial label, interactive element, or empty)
- Headline text
- Subtitle text

---

## Section 3: Filter Bar

**Architecture (from JSP):**
```
[All] [Category1] [Category2] [Category3] ...
```

**Rules:**
- One horizontal flex row
- Padding: `16px var(--gutter)`
- Font: mono, 12px, `letter-spacing: 0.02em`
- Active filter: `color: var(--fg)`
- Inactive: `color: var(--fg-3)`, hover `color: var(--fg-2)`
- No border lines. Whitespace above and below separates from other sections.
- Gap between buttons: `clamp(14px, 2.5vw, 24px)`
- Transition: `color 0.3s var(--ease)`

**Slots you fill:**
- Filter categories (how you group your work — by discipline, by type, by year, etc.)
- Optional: a count label on the right side (`Showing all — 12 projects`)

---

## Section 4: Project Feed

**Architecture (from JSP):**

Each project entry is:
```
[text row — inside gutter margins]
[full-bleed image — edge to edge, no side padding]
[vertical space]
```

Entries stack vertically with no dividers between them.

### Text Row

**Architecture:**
```
[num]  [primary text]  [secondary text]  [year]  [tag]
```

**Rules:**
- `display: flex`, `align-items: baseline`
- Padding: `16px var(--gutter) 12px`
- Font: mono, 12px, `letter-spacing: 0.01em`
- Number: `color: var(--fg-3)`, `font-variant-numeric: tabular-nums`, `flex-shrink: 0`, width ~32px
- Primary text: `color: var(--fg)`, `flex: 1`, truncate with ellipsis
- Secondary text: `color: var(--fg-2)`, `flex-shrink: 0`
- Year: `color: var(--fg-3)`, tabular-nums, right-aligned, ~48px
- Tag: `color: var(--fg-3)`, ~32px

**Slots you fill:**
- What goes in "primary text" vs "secondary text" (description + title, or title + client, etc.)
- The tag system (2-letter codes like PD/BD/CD, or full words, or nothing)

### Image

**Rules:**
- `width: 100%` — full-bleed, no side padding
- `aspect-ratio: 16/9` (or your choice — all images must be the same ratio)
- `object-fit: cover`
- `border-radius: 0` — no rounding
- Background: `var(--fg-5)` while loading
- Pieces without images: solid color field (`piece.cover.bg`) at same aspect ratio, with piece title centered in `var(--fg-3)` mono 12px

### Spacing Between Entries

- Gap: `clamp(48px, 10vh, 100px)` — roughly one project per viewport height

### Scroll-Triggered Reveal

- Each entry starts at `opacity: 0, y: 60`
- Fades in when entering viewport at 85% mark
- Duration: `0.9s`, ease: `power4.out`
- `once: true` — only animates once
- `prefers-reduced-motion`: no animation, content visible immediately

### Hover Behavior

- All non-hovered entries dim to `opacity: 0.15`
- Hovered entry stays at `opacity: 1`
- Image zooms `scale(1.01)` on hover
- Transition: `opacity 0.4s var(--ease)`

---

## Section 5: Footer

**Architecture (from JSP):**
```
                [footer text — centered]
```

**Rules:**
- Padding: `clamp(24px, 5vh, 48px) var(--gutter)`
- Font: mono, 12px, `color: var(--fg-3)`
- `text-align: center`

**Slots you fill:**
- Footer text (e.g., "HKJ Studio — Est. 2025", or copyright, or nothing)

---

## Design Tokens

```css
:root {
  --bg: #ffffff;
  --fg: #0e0e0e;
  --fg-2: rgba(14,14,14, 0.55);
  --fg-3: rgba(14,14,14, 0.30);
  --fg-4: rgba(14,14,14, 0.12);
  --fg-5: rgba(14,14,14, 0.05);
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  --gutter: clamp(24px, 5vw, 56px);
}
```

Dark mode inverts to warm off-black/cream.

**Fonts:**
- Body/display: General Sans (variable, 200-700)
- Mono: Fragment Mono (400)
- The body `font-family` on `<body>` is the sans. Mono is applied explicitly where specified above.

---

## What This Framework Does NOT Decide

These are your creative decisions:

1. **Hero content** — what text, what signature element, what headline
2. **Category system** — how you classify your work
3. **Text row format** — what data goes in which column
4. **Image aspect ratio** — 16/9 is default but you can change it
5. **Editorial framing** — whether to add issue numbers, reference codes, collection labels
6. **Alive signal** — clock, live data, git hash, coordinates, or nothing
7. **Color** — the token values above are starting points
8. **Font choice** — General Sans is loaded but you could swap it
9. **Detail page design** — this spec covers homepage only
10. **Mobile adaptations** — the framework collapses to single column; specific mobile decisions are yours

---

## Technical Requirements

- **Framework:** Next.js 16 (App Router), already in place
- **Animation:** GSAP (ScrollTrigger) for scroll reveals, CSS transitions for hover states
- **No Three.js, no Framer Motion, no Lenis** on the homepage — keep it light
- **Images:** Next.js `<Image>` with `priority` on first 2, `sizes="100vw"` for full-bleed
- **Scrollbar:** Hidden globally
- **Performance:** No `filter` animations, no compositor-heavy effects. Transform + opacity only.

---

## Verification

After building:
1. `npx next build` passes
2. Page scrolls vertically with no jank
3. Images are full-bleed (no side margins)
4. Text rows have gutter margins
5. Scroll reveals fire once per entry
6. Hover dims non-hovered entries
7. Filters narrow the project list
8. `prefers-reduced-motion` disables all animation
9. Mobile: single column, text wraps, images still full-bleed
10. Dark mode tokens apply correctly
