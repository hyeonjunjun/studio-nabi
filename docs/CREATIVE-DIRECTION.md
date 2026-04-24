# Hyeonjoon — Creative Direction

> Studio catalog. One register, one voice, paper ground. Last updated 2026-04-24.

---

## 1. Concept

The portfolio is a **studio catalog** — not a showcase, not a data-viz artifact, not a cinematic experience. A visitor arrives into a single calm register, reads the work, follows the writing, feels atmosphere through ink-and-paper composition rather than theatrical framing.

The positioning: an A/V-inspired design-engineer portfolio that reads as a studio catalog. The heartfeltness of Craig Mod, the engineering rigor of Rauno Freiberg, the luminous restraint of Joanie Lemercier, grounded in Kenya Hara's *ma*.

**Guiding principle:** if removing an element doesn't hurt the composition, it shouldn't be there.

## 2. Taste lineage

| Reference | What it contributes |
|---|---|
| **Kenya Hara** — *Designing Design*, Muji | The page as emptiness; observation stance; *ma* as active material |
| **Massimo Vignelli** | Grid discipline; color as punctuation, never decoration |
| **Dieter Rams** | "Less, but better"; honest material |
| **Teenage Engineering** | Dense mono labels; numbered entries; utilitarian panel layout |
| **Craig Mod** | Essay-publication cadence; dated ledgers; scholarly density |
| **Rauno Freiberg** | Interactive micro-flourish as the engineer tell; keyboard fluency |
| **Joanie Lemercier** | Luminous-catalog restraint; content carries the atmosphere |

## 3. Architecture

One register. Paper ground everywhere. No dark mode.

### Pages

- **`/`** — cathydolle mirror-gutter composition. Left column (01–02), center GutterStrip (wheel-snap media carousel), right column (03–04). Single viewport, no scroll.
- **`/work/[slug]`** — case study. Eyebrow metadata, mono title (weight 380), hero plate with plate-marks, modular editorial sections with scroll-triggered reveal.
- **`/about`** — first-person editorial. Philosophy statement, experience timeline, contact.
- **`/shelf`** — grouped verticals (Read/Watch/Keep/Visit). Warm paper cards, typewriter labels.
- **`/notes`** — dated stream with running-head band on detail pages.
- **`/colophon`** — typographic manifesto (typefaces, grid, motion, stack).
- **`/contact`** — business card composition.

### Layout components

- `PaperGrain` — static SVG fractal-noise overlay (0.055 opacity, multiply blend)
- `NavCoordinates` — top nav with hide-on-scroll-down, reveal-on-scroll-up
- `Folio` — fixed corner stamp: `HKJ / §NN / 2026`

## 4. Design system

### Palette

```css
--paper:   #FBFAF6
--paper-2: #F4F3EE
--paper-3: #E8E7E1
--ink:     #111110
--ink-2:   #55554F
--ink-3:   #8E8E87
--ink-4:   #BFBEB8
--ink-hair: rgba(17, 17, 16, 0.10)
--ink-ghost: rgba(17, 17, 16, 0.06)
```

No accent color. Ink hierarchy does all the work.

### Typography

Two fonts. No exceptions.

| Stack | Font | Role |
|---|---|---|
| `--font-stack-mono` | Fragment Mono 400 | Everything — labels, titles, chrome, prose |
| `--font-stack-serif` | Gambetta 300–800 | Case-study body prose only |

Italics globally suppressed. Emphasis through weight, tracking, and caps.

### OpenType

- `onum` on Gambetta prose (old-style figures)
- `tnum + lnum` on grids, ledgers, stats, dates

### Easing (4 curves total)

- `cubic-bezier(.4, 0, .2, 1)` — default
- `cubic-bezier(.22, 1, .36, 1)` — ease-out-quart (reveals, wheel-snap)
- `cubic-bezier(.33, .12, .15, 1)` — hover-slide (arrow-glyph)
- `cubic-bezier(.41, .1, .13, 1)` — view-transition root

### Motion budgets

- Hover underline fade: 180ms
- Arrow-glyph slide: 200ms
- Section reveal: 280ms, 50ms stagger capped at 5
- Route crossfade: 300ms
- View-transition title morph: 420ms
- GutterStrip wheel-snap: 920ms

Nothing on idle. No cinematic set-pieces.

## 5. Hover vocabulary

- **Underline-color fade** on inline links (`.prose a`, `.cd__mail`, `.about__mail`, `.card__handle`). 180ms.
- **Arrow-glyph slide** on forward actions. 6px translateX, 200ms.
- **Ghost background** on grid/ledger rows. 120ms.
- `.shelf__row-link` excluded from underline vocabulary (grid row with background hover).

## 6. `!` moments

One hand-placed detail per page. Felt on careful reading.

- `/` — active row title sits 1px proud (`translateY(-1px)`)
- `/work/gyeol` — second eyebrow separator is `結`
- `/work/clouds-at-sea` — coordinate line: `40°43′N 73°59′W · horizon dissolve`
- `/about` — `::first-letter` drop cap on the AI collaborator paragraph
- `/shelf` — Butterfly Stool year reads `"1954 –"` (open-ended)
- `/colophon` — live build hash
- `/notes/[slug]` — `runheadKeyword` at full ink in running-head band

## 7. View transitions

Browser-native shared-element crossfades via View Transitions API.

- Root crossfade: 300ms
- Shared `work-title` morph between home `.cd__name` and case study `.case__title`: 420ms, no filter
- Reduced-motion: all view-transition animations disabled

## 8. Rules for new work

1. **One register.** Paper ground everywhere. If a surface wants atmosphere, it's achieved through whitespace and type, not color shift.
2. **Two fonts.** Fragment Mono + Gambetta. No third face.
3. **No set pieces.** No entrance animation, no loading moment, no hero animation. The site opens as it lives.
4. **Interactions as marginalia.** Small, tuned, felt-not-seen.
5. **The content carries the luminosity.** Photographs do the emotional work. The interface holds them.
6. **Beauty over novelty.** Every decision should make the work more beautiful, not more impressive.
