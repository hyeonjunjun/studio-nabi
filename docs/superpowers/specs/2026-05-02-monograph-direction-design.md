# Monograph Direction — Design Spec

**Date:** 2026-05-02
**Status:** Draft — pending user review
**Supersedes:** [2026-04-24-stage-and-paper-design.md](./2026-04-24-stage-and-paper-design.md) (reconciled 2026-04-30)
**Extends:** [2026-04-24-studio-catalog-design.md](./2026-04-24-studio-catalog-design.md)
**Anchored to:** the user's written taste profile (recorded in conversation 2026-05-02)

---

## Goal

Lock the portfolio to a **single warm-paper register, monograph composition** with **media visible on the home page** and **microtype caption density that makes every plate a real document**. Retire the second register (Stage), retire the cinematic entrance, retire the ASCII→video preloader, retire all path-blur / long-exposure-smear motion grammar. Add one borrowed move: a **dual list/gallery toggle** on the home page index — pulled from NaughtyDuk and Adovasio — that lets the catalog be either *scanned* (typeset list) or *immersed in* (full-width plates).

This spec is anchored to the user's own written taste profile. The brief that launched the conversation (aino.agency-style cinematic preloader + dark Stage register) was set aside after that profile was surfaced. Direction A — *follow the profile fully* — is what's being committed.

## Why this change

**The taste profile contradicts the prior spec on six points:**

| Stage & Paper spec | Taste profile |
|---|---|
| 1.1s cinematic entrance | "Your retirement list — killing the cinematic entrance" |
| Dark luminous Stage register on `/`, `/work/[slug]` | "Warm minimalism. Cream paper, dark wood, unglazed ceramic" |
| Path-blur, long-exposure smear motion grammar | "Motion that breathes, not performs" |
| Tendril / aino-derived 2-up cinematic plates | "Magazine vs monograph — you value the monograph" |
| `RegisterController` writing `data-register` to `<html>` | "You design the rules that produce consistent beauty" — a register switch on every nav is the opposite |
| Newsreader 600 cinematic title face | "You reject anything that looks like it's trying" |

The prior spec is structurally correct in its restraint claims but ships theatrical primitives the user has explicitly retired in their own framing. That contradiction is no longer hypothetical; it is recorded in the user's profile. The spec moves to honor the profile.

**The reference set further confirms the direction:**

A research pass through Awwwards SOTD (2026-Q2) for the intersection of *microtypographic + media-visible + warm restraint* found one closest match (**Adovasio**, SOTD 2026-03-05 — warm `#F5F2ED` + near-black `#232323`, photography-dominant, monograph-shaped) and one second-closest (**Adcker**, SOTD 2026-05-01 — `#191919` + `#efedea`, two-tone restraint). NaughtyDuk© (SOTD 2026-04-12) added one borrowable move (dual Projects-Grid / Projects-List view) but its WebGL-heavy stack and high-contrast B&W palette sit outside the profile.

The composition the profile asks for — warm paper, single-column plates, thick microtype captions, photograph-as-cover, no theatrics — is genuinely rare on contemporary award shows. That rarity is the opportunity.

## Principles

1. **One register. One voice. One composition per page.** Paper ground everywhere. The page is the unit; sections within it are quiet.
2. **The home page shows the work.** Media is visible. The user's prior `/contact` consolidation principle (Pawson's stopping rule) extends here: a tabular index without media reads as withheld; the warm-paper monograph holds plates *and* captions both.
3. **Caption density is the signature.** Every plate's caption answers *what · when · by whom · in what medium*. Bare titles are insufficient; thick captions are the move that distinguishes a monograph from a magazine spread.
4. **Reduction reveals conviction.** The spec retires more than it adds. Every component that survives must earn its place against the profile's "what remains after reduction is what the designer truly believed in."
5. **Motion settles, not arrives.** The four-curve catalog holds. Path-blur, long-exposure smear, lateral drift, cinematic entrance — all retired. Section reveal stays as opacity + small vertical translate. Underline-color fade stays. Wheel-snap (when reintroduced) stays.
6. **Cultural identity is felt, not shown.** Korean structural duality (warm/cool, ondol/maru, ma) shows up in the *spatial rhythm* of the page — gravity-low text, generous vertical air, asymmetric placement — never in surface ornament.
7. **No new tokens. No new faces. No new curves.** The token system, type system, and easing catalog from the taste-polish spec hold. This spec adds composition primitives only.

---

## What this retires (clean break, second time)

The studio-catalog spec from 2026-04-24 already retired Stage once; it was reinstated under the reconciled stage-and-paper spec on 2026-04-30. This is the second retirement, anchored to the profile. To prevent re-litigation:

- **Stage register entirely.** No dark luminous home, no dark `/work/[slug]`. Single warm-paper register everywhere.
- **The 1.1s cinematic entrance** (`CinematicEntrance.tsx` was never built — never build it).
- **ASCII→video preloader.** Held in reserve only as one possible `!` moment for a single page (Clouds at Sea), if and only if it is *static and captioned* — never as a transition or entrance.
- **Path-blur, long-exposure smear, lateral-drift section reveal** — all Stage-grammar motion. Retired. Section reveal stays at the existing vertical translate + opacity hook.
- **Newsreader 600 hero face.** Newsreader stays at body weight only.
- **`--stage*`, `--glow*`, `--palette-overlay` tokens** — never added.
- **`RegisterController` + `data-register` system** — removed in the prior subtraction pass; will not be reintroduced. (The `data-home-view` attribute used by `ViewToggle` is unrelated — local to one page, visibility-only, never crosses routes.)
- **Aino-derived 2-up cinematic plates.**
- **Cross-register navigation rules.**
- **Per-slug `viewTransitionName` blur-in-transit.** View transitions stay; blur is retired.

What survives, untouched:

- `--paper #FBFAF6`, `--ink #111110`, `--ink-hair`, `--ink-ghost` — existing tokens
- Geist Sans + Newsreader two-face discipline (mono retired in prior session)
- The four approved easing curves: `(.4,0,.2,1)`, `(.22,1,.36,1)`, `(.33,.12,.15,1)`, `(.41,.1,.13,1)`
- `useSectionReveal` hook (vertical translate + opacity)
- Underline-color fade on `.prose a` links
- View transitions on route change (300ms crossfade, no blur, no shared-element morph beyond the existing per-slug `work-cover-{slug}` and `work-title-{slug}` wiring)
- `Folio` running head
- `PaperGrain` static SVG turbulence at 0.055 opacity multiply
- `NavCoordinates` in tracked Geist Sans 10–11px all-caps
- The `!` moment practice (one per page, hand-tuned, discoverable)
- Per-slug `viewTransitionName` wiring (without the blur-in-transit treatment)
- The data-annotation primitives (`.case__coord`, `.case__param`, `.case__signal`, `.case__module`, `.case__timecode`) — rendered as quiet Paper-register captions, not Stage chrome

---

## Composition

### Home (`/`) — single-column scrolling plates, with a dual list/gallery toggle

The current 2-col 1:1 grid retires. The home page becomes a **vertical sequence of full-width plates**, each plate ~50–60vh, separated by ~15–25vh of vertical air, with a thick microtype caption beneath each plate.

A small **view toggle** sits in a fixed margin position (top-right, aligned with the Folio) — `gallery / list` in Geist Sans 10–11px tracked all-caps. The toggle switches between two compositions of the same data:

- **Gallery (default):** plates stacked vertically. One project per plate. Image at full width. Caption block beneath.
- **List:** typeset Wang Zhi-Hong-style index. No images. Just rows: `№02 · Gyeol · 2024 · Identity · Service Design · A music app for resonant texture`.

The toggle persists across sessions via `localStorage('hkj.home.view')`. Default is `gallery` for first-time visitors. Both views read the same `case-studies.ts` source — no content duplication.

#### Why this composition

The single-column scrolling plate pattern is the **literal monograph**: each project gets its own page-spread weight (Lars Müller / Formafantasma / Wang Zhi-Hong), no fight for attention from neighbours, the photograph carries genuine cover-status. The dual toggle satisfies the user's "I want to present a deep focus on details" request: the *gallery is the reading*, the *list is the index* — both useful, neither performative.

#### Why it doesn't read thin with 4 projects

A vertical sequence of 4 full-width plates separated by 15–25vh fills 4 × (50vh plate + 15–25vh air + caption) ≈ 4 × 80vh = ~3.2 viewport-heights of scroll, plus header and foot. That's substantive without bloat. The 2-col grid's "thin spread" risk is structural; the single-column doesn't carry it.

### `/work/[slug]` — paper register, photograph plates inside the editorial flow

Case studies stay on Paper. The Stage skin (dark ground, halation, long-exposure smear arrival) does not happen.

Photographs (when long-exposure or otherwise) live as **full-width plates inside the editorial flow**, captioned with EXIF or coordinate microtype beneath. Same plate primitive as home, just embedded between sections. The case study reads like a Lars Müller catalogue essay, not a takram case film.

Existing `useSectionReveal` stays. Existing per-slug `viewTransitionName` morph stays (cover and title only — no blur). Newsreader stays at reading weight (no 600 hero variant).

The data-annotation primitives stay as document microtype: project number, year, role, medium, location, date, source. They sit in `--ink-3` or `--ink-4`, never compete with the photograph or the body prose.

### `/studio`, `/bookmarks`, `/notes`, `/notes/[slug]` — unchanged

These were already on Paper. Nothing about them changes in this spec.

---

## The `WorkPlate` component

The signature primitive. Used on home (gallery view) and inside case studies for embedded photographs.

### Anatomy

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│                                                        │
│                  [full-width image]                    │   ← 50–60vh
│                                                        │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  №02   Gyeol         2024 · Identity, Service Design   │   ← caption block,
│                                                        │     ~10vh of air
│  A music app for resonant texture.                     │     beneath plate
│                                                        │
└────────────────────────────────────────────────────────┘
```

- **Image:** full container width, `aspect-ratio: 4/3` or `3/2` depending on the source. Object-fit cover. No halation, no glow. PaperGrain mounts globally; no per-plate grain.
- **Caption block:** sits beneath the plate with ~3–4vh of air between image and caption. Caption itself is one editorial unit, ~3 lines of microtype + 1 line of body prose.
- **Microtype line 1:** `№NN · Title · Year · Role · Medium`
- **Body line 2:** one-sentence description, sentence case, Geist Sans 15px
- **Microtype line 3 (optional):** location, source, EXIF, or other contextual data — `40°43′N 73°59′W · long exposure · 30s · ƒ/8 · ISO 64`
- **Glyph separators:** middle dot `·` for in-line separation, em-dash `—` for inline qualification. No pipes `|`. No arrows in caption (arrows live on hover).

### States

- **Default:** image at full opacity, caption at full ink hierarchy.
- **Hover (desktop only, `(hover: hover) and (pointer: fine)`):** image swaps to alternate frame if the project provides one in `case-studies.ts` as `coverAlt`. If no alternate, image scales to 1.012 over 280ms on the existing `--ease`. Caption remains static.
- **Reduced motion:** no image swap, no scale. Hover is a no-op visually.
- **View transition:** the plate's image element carries `viewTransitionName: work-cover-{slug}`. The plate's title in the caption block carries `viewTransitionName: work-title-{slug}`. Existing wiring; no blur-in-transit.

### TypeScript shape

```ts
type WorkPlate = {
  slug: string;
  number: string;          // "№02"
  title: string;
  year: number;
  role: string;            // "Identity, Service Design"
  medium?: string;         // optional, slot 4
  description: string;     // one sentence
  cover: string;           // path or import
  coverAlt?: string;       // optional hover frame
  meta?: string;           // optional bottom line — coords, EXIF, etc.
};
```

This shape extends the existing `case-studies.ts` schema rather than replacing it. New fields: `coverAlt`, `meta`. Existing fields (`slug`, `title`, `year`, `cover`) are reused.

---

## The `WorkList` component

The list view of the same data. Used only on the home page when the toggle is set to `list`.

### Anatomy

```
№01   Sift                2023   Tooling, Concept       Browse less, choose better.
№02   Gyeol               2024   Identity, Service      A music app for resonant texture.
№03   Pane                2024   Concept                A reading surface for slow attention.
№04   Clouds at Sea       2025   Photography, Concept   The horizon dissolves into its own data.
```

- **One row per project.** Tabular alignment via Geist `tnum` for the number column.
- **Columns:** `№NN` · title · year · role · description.
- **Type:** Geist Sans 15px body weight for title, year, role. Geist Sans 14px for description in `--ink-3`.
- **Row spacing:** `padding-block: 0.9rem`. Hairline separator `border-top: 1px solid var(--ink-hair)` between rows.
- **Hover:** row gains `background: var(--ink-hair)` over 200ms on `--ease`. Row's title gains an `→` glyph at the right margin via `::after`. No image expansion (full reduction — clicking opens the case study).
- **Keyboard navigation:** rows are real `<a>` elements; `Tab` moves between them; `Enter` follows. Arrow keys don't intercept (would conflict with scroll).
- **Reduced motion:** no background fade, instant.

### TypeScript shape

Reads the same `WorkPlate` shape from `case-studies.ts`. Renders only the metadata, not `cover` / `coverAlt`.

---

## The `ViewToggle` component

The toggle that switches between `gallery` and `list`.

### Placement

Fixed top-right margin, vertically aligned with the Folio mark. `position: fixed; top: var(--folio-y); right: var(--page-margin);`. `z-index` above page content, below modal overlays (none currently exist).

### Anatomy

```
gallery / list
```

Two text labels separated by ` / `. Active label is ink-1; inactive label is ink-3. Clicking either swaps. No icons. No animation on the labels themselves; the page content beneath crossfades on toggle (see *Toggle motion* below).

### Type

Geist Sans 10–11px, `letter-spacing: 0.08em`, `text-transform: lowercase`. Same metric as the Folio.

### Toggle motion

When the user toggles:
- The current view fades out over 200ms on `--ease` (opacity 1 → 0).
- The new view fades in over 280ms on `--ease` (opacity 0 → 1, 80ms after old view starts fading).
- No translate, no scale.
- Reduced motion: instant swap.

The toggle does NOT use the View Transitions API for this — view transitions imply route change, and this is intra-route. Plain CSS class swap is sufficient.

### Persistence

`localStorage.setItem('hkj.home.view', 'gallery' | 'list')` on toggle.
On mount, the home page reads `localStorage.getItem('hkj.home.view')`; defaults to `gallery` when absent or `null`.

**SSR / hydration rule.** To avoid hydration mismatch *and* the brief flash of `gallery` for returning visitors who prefer `list`, the page uses the **theme-flash mitigation pattern**: an inline blocking script in `<head>` reads `localStorage.getItem('hkj.home.view')` before paint and sets `document.documentElement.dataset.homeView = 'gallery' | 'list'`. CSS scopes `[data-home-view="list"] .home__gallery { display: none }` and `[data-home-view="gallery"] .home__list { display: none }`. Both compositions render to DOM (server renders both, no JS-only branch), and only the active one is visible. The toggle switches the attribute. This is the same pattern Next.js documents for theme persistence; it shifts the cost from a hydration flash to a tiny inline script in `<head>`.

This is the only `data-*` attribute the spec writes to `<html>`. It is not the same mechanism as the retired `data-register` system — it is local to one page, governs visibility only, and never crosses route boundaries.

### Why this primitive earns its place

The dual-view is the one move pulled from outside the user's existing reference frame (NaughtyDuk's signature). It earns its place because:

1. It serves *both* the user's stated preference for "deep focus on details, micro-interactions" (the toggle is itself a micro-interaction) and the profile's "you design the rules that produce consistent beauty" (the rule = same data, two views, perfectly mirrored).
2. It removes the false choice between "scan the catalog" and "immerse in the catalog" — visitors get both, on their terms.
3. It costs ~80 lines of new code, no new dependencies, no new tokens.

---

## Microtype rigor — the load-bearing detail

This is the hardest part of the spec to fake; it is the part that distinguishes a monograph from a magazine spread.

### The four data fields, always

Every `WorkPlate` caption (and every `WorkList` row) carries, in this order:

1. **Number.** `№02` — Geist Sans 11px tracked, `tnum`.
2. **Title.** Geist Sans 15px body, ink-1.
3. **Year + Role.** Geist Sans 13px, ink-3, separated by `·`. Year first, then role(s).
4. **One-sentence description.** Geist Sans 15px, ink-2 (slightly damped for visual hierarchy beneath the title).

### The optional fifth, when applicable

**Meta:** `meta` field. For photographic plates, this carries EXIF or coordinate. For non-photographic plates, this can carry medium-specific data: `Built with Three.js · 60fps · WebAudio` (work piece-specific), `Read-time 4m · Mon 9 March '26` (notes), `40°43′N 73°59′W · horizon dissolve` (Clouds at Sea).

When present, `meta` sits as a fourth visual line in microtype 11px ink-4, with a glyph separator from the description (em-dash `—` or paragraph break, depending on layout).

### Glyph discipline

- `·` for inline separation between metadata fields. Always with surrounding spaces.
- `—` (em-dash) for inline qualification within a sentence.
- `№` for the number prefix.
- `→` for link affordance on hover only — never in static caption text.
- No pipes (`|`). No semicolons in microtype. No square brackets.

### Type sizes (locked)

- Microtype small: **11px** (number, year+role, meta line)
- Body short: **15px** (title, description)
- Tracking: 0.06em on body (`title`, `description`); 0.08em on microtype small (`number`, `year+role`, `meta`)
- Capitalization: sentence case for title, year, and description; `№NN` form for number; sentence case for role until a strict tag taxonomy exists. ALL-CAPS is not used in caption text. (If a future content model introduces tag-form roles, ALL-CAPS becomes available — but not in this spec.)

---

## Photograph treatment

### On home (gallery view)

Plate image is the photograph. No frame, no border, no halation. Background is `--paper`. Image is the full content of the plate.

### Inside case studies

A photograph appears as a `WorkPlate`-shaped block embedded in the editorial flow. Generous vertical air on either side (~10–15vh top and bottom). Caption beneath in the standard four-line form. Treatment is identical between home and case-study contexts so the same component is reused.

### Long-exposure photographs (Clouds at Sea, future work)

When a photograph is a long-exposure, its `meta` line carries the EXIF as a real document caption: `ƒ/8 · 30s · ISO 64 · 40°43′N 73°59′W · 2025-08-14 04:12 EDT`. This is the same data-annotation grammar that was previously locked in the Stage spec, but rendered as paper-register microtype rather than Stage chrome.

### Signature dialect — preserved as a content commitment, decoupled from register

The locked photograph commitment from the Stage spec (option C: four long-exposure photographs in 8 weeks) survives as a **content goal**, not a register-determining one. The reduction is that the photographs no longer have to fill a Stage frame to read as the work — paper-register plates work just as well, often better, because the caption density does the framing.

If the photograph commitment slips, the fallback is **not** option B (ASCII as decoration). The fallback is: **fewer plates, more writing.** A case study without a photographic plate uses an editorial section reveal and lets the prose do the work. This was previously option B's territory; the profile clarifies that ASCII-as-decoration is also retired.

---

## Motion language

### Existing motion (locked, unchanged)

- **Underline-color fade** on `.prose a` (180ms, `--ease`)
- **`.arrow-glyph` slide** on `:hover` (200ms, `--ease`)
- **Section reveal** via `useSectionReveal` (280ms, vertical translate + opacity, 60ms stagger capped at 5)
- **View transitions** on route change: **300ms root crossfade across all paper-internal navigation, including home → case-study and case-study → case-study.** Per-slug `work-cover-{slug}` + `work-title-{slug}` shared morph at 300ms — **without** the blur-in-transit treatment from the retired Stage spec. (The prior Stage spec extended this to 420ms because the dark ground demanded a longer beat. With one register, that justification is gone; uniform 300ms restores the "one voice" rule.)
- **Folio reveal** on first paint
- **Easing catalog:** `cubic-bezier(.4,0,.2,1)` / `(.22,1,.36,1)` / `(.33,.12,.15,1)` / `(.41,.1,.13,1)` — no additions

### New motion (this spec adds)

- **`WorkPlate` hover image swap** — desktop only, `(hover: hover) and (pointer: fine)`, opacity crossfade between `cover` and `coverAlt` over 320ms on `--ease`. Reduced motion: no-op.
- **`WorkPlate` hover scale fallback** (when `coverAlt` is absent) — image scales to 1.012 over 280ms on `--ease`. Genuinely new motion grammar — the rest of the site uses opacity-fade hovers only. Earns its place because a static hover on a plate-sized surface reads as broken; scale + opacity crossfade are both legitimate "settling" responses to user proximity. Reduced motion: no-op.
- **`ViewToggle` swap** — opacity-only crossfade between gallery and list views. 200ms out, 280ms in, 80ms overlap. Reduced motion: instant.

### Retired motion (will not be added)

- Path-blur on Stage tile hover
- Long-exposure smear on hero arrival
- Lateral drift section reveal (alternating direction by index)
- View-transition blur-in-transit
- Cinematic entrance (1.1s wordmark)
- Cross-register hard-cut rules (no second register)

### `prefers-reduced-motion`

All motion has a reduced-motion path. Hover image swaps become instant (or absent). Section reveals become instant. View transitions resolve to crossfade-only (no shared morph). Toggle is instant.

### `prefers-reduced-data`

`coverAlt` not loaded. `cover` loaded at lower-resolution variant if Next.js image config supports it. PaperGrain disabled.

---

## Components — final inventory

### New (this spec)

- `WorkPlate.tsx` — full-width image + caption block. Used on home and inside case studies.
- `WorkList.tsx` — typeset list view of the same data.
- `ViewToggle.tsx` — gallery/list switcher.

### Existing (preserved)

- `Folio.tsx` — running head with page coordinate
- `NavCoordinates.tsx` — top nav, all-caps tracked sans
- `PaperGrain.tsx` — static SVG turbulence
- `CopyEmailLink.tsx` — click-to-copy email primitive
- `CaseStudy.tsx` — case-study renderer (gets `WorkPlate` integration for embedded photographs in Phase 5)

### Retired (this spec confirms)

- `GutterStrip.tsx` — already deleted
- `CatalogFrame.tsx` — already deleted
- `AmbientAscii.tsx`, `CornerStamp.tsx`, `AmbientGarden.tsx`, `MarqueeStrip.tsx` — already deleted
- `RegisterController.tsx` — removed in the prior subtraction pass; will not be reintroduced
- `CinematicEntrance.tsx` — never built; will not be built
- The current home grid composition in `src/app/page.tsx` — replaced with `WorkPlate` × N + `WorkList` + `ViewToggle`

### Out of scope (future)

- `CommandPalette.tsx` (cmdk) — held in spec hold from prior session. Not built. If/when built, it follows the existing taste-polish overlay rules. Out of scope for this spec.

---

## Tokens & color

**No new tokens.** The existing taste-polish token system holds:

```css
--paper:    #FBFAF6;
--ink:      #111110;
--ink-2:    #2A2925;
--ink-3:    #5A5852;
--ink-4:    #8B8983;
--ink-hair: rgba(17, 17, 16, 0.08);
--ink-ghost: rgba(17, 17, 16, 0.04);
```

PaperGrain at 0.055 opacity multiply, mounted globally. No per-plate or per-component grain variant.

If a damped-overlay token is later needed (e.g., for a future modal), it gets added in its own spec. Not added preemptively.

---

## Type

**No new faces.** Existing two-face discipline holds:

- **Geist Sans** — chrome face. All UI text 9–17px. Tabular figures via OpenType `tnum` for any column of numbers (caption number column, list view year column).
- **Newsreader** — body serif. Long-form prose only: case-study editorial sections, `/notes/[slug]` detail body. Reading-weight (400 typically; 500 for emphasis).

**No new sizes.** The taste-polish scale holds: 11 / 13 / 15 / 17 / 24 / 32 / 48 / 64 (px).

**No display register.** Newsreader 600 was the Stage hero face — retired with Stage. Newsreader stays at reading weight only.

---

## The `!` moment practice — updated for monograph register

The `!` moment practice from the prior spec holds. The list of moments is updated to reflect the retired Stage register and the new home composition.

### Per surface

- **`/` (home)** — the **`ViewToggle` itself** is the home `!` moment. Its existence is discoverable but never announced. A visitor who doesn't toggle never notices it; one who does discovers a second composition of the same catalog. The toggle is hand-tuned (Geist Sans 10–11px, lowercased, ` / ` separator at 0.08em tracking) and specific to the home page.
- **`/work/gyeol`** — **shipped.** Eyebrow separator `·` becomes `結` (project's namesake character). Preserved.
- **`/work/clouds-at-sea`** — **partial.** `.case__coord` line `40°43′N 73°59′W · horizon dissolve` shipped. The pairing photograph arrives when the photograph commitment lands. The page already has its `!` (the coord line); the photograph completes the existing moment, it does not introduce a second one. (The earlier sessions explored an ASCII rendering of the long-exposure as an alternate `!`; per the profile, ASCII-as-decoration is retired, and the page does not need a second moment. The coord line stays as the surface's only `!`.)
- **`/work/pane`** — **pending content.** A `!` moment requires substantive prose first; deferred until the case study has body.
- **`/work/sift`** — **pending content.** Same as above.
- **`/studio`** — **pending.** The argument paragraph (AI-as-collaborator) drop cap was retired in the prior subtraction pass. Decision: **do not return** — drop caps read as performative on a single-paragraph essay. The studio page's `!` becomes the colophon Build SHA going live (see below).
- **`/bookmarks`** — **shipped.** Butterfly Stool year `1954 –` (open-ended range). Preserved.
- **`/notes/[slug]`** — **shipped.** Running-head keyword reveal. Preserved.
- **Colophon** (foot of `/studio`) — **pending.** Build SHA goes live via `NEXT_PUBLIC_BUILD_SHA`. The genuinely live piece of typography that distinguishes the site as a built object. Reactivated as the studio-page `!`.
- **Contact cluster** (inside `/studio`) — **deferred.** Left honest until a specific, non-forced detail emerges.

### Rule

One per page. Discoverable, not announced. Specific to the page. Must serve the page. The `ViewToggle` is the home `!` because it is *itself* a hand-tuned moment of micro-interaction craft, fully consistent with the user's "deep focus on details, micro-interactions, change of states" stated preference.

---

## Phased rollout

Each phase ships independently. No phase regresses earlier phases.

### Phase 0 — Spec retirements (this commit)

- Retire the Stage and Stage-and-Paper spec entries from TASKS.md (repo-side).
- *(User action, outside the implementation plan):* update the user's auto-memory `MEMORY.md` to point to this spec as the current direction. The planner does not have write access to the user's memory directory and should not include this in its task list.
- No code changes.

### Phase 1 — Token + type audit

- Confirm no `--stage*`, `--glow*`, `--palette-overlay` tokens exist in `globals.css`. If any were added, remove.
- Confirm no `RegisterController` or `data-register` writes exist anywhere. If any were added, remove.
- Confirm no Newsreader-600 declarations exist. If any, retire.
- Confirm view transitions have no `filter: blur()` declarations. If any, remove.
- Verification: type check clean, all routes render unchanged from current state.

### Phase 2 — Build `WorkPlate.tsx`

- New component at `src/components/WorkPlate.tsx`.
- Reads from extended `case-studies.ts` shape (adds `coverAlt`, `meta` optional fields).
- Renders image + caption block per spec §6 (Anatomy).
- Hover image swap with `coverAlt` if present; scale fallback if absent.
- Reduced-motion path.
- Per-slug `viewTransitionName` wiring on image and caption title.
- Verification: rendered in Storybook-equivalent state (or a new test page); existing case studies still render correctly.

### Phase 3 — Build `WorkList.tsx` + `ViewToggle.tsx`

- New components at `src/components/WorkList.tsx` and `src/components/ViewToggle.tsx`.
- Toggle persists to `localStorage('hkj.home.view')`.
- Crossfade between views per spec §8 (Toggle motion).
- Keyboard accessibility on list rows (real `<a>` elements).
- Verification: type check clean; toggle works on home; persists across reload; reduced-motion respected.

### Phase 4 — Replace home composition

- `src/app/page.tsx` rewritten: removes the 2-col 1:1 grid; mounts `WorkPlate` × N + `WorkList` + `ViewToggle`.
- The four current case studies (Sift, Gyeol, Pane, Clouds at Sea) get extended `case-studies.ts` entries with `coverAlt` (where available) and `meta`. **Schema change is purely additive at the top level** — adds two optional fields (`coverAlt: string | undefined`, `meta: string | undefined`) to the existing `CaseStudy` type. Phase 5 will further extend the same type with a separate optional nested field; the two extensions do not collide.
- Existing `viewTransitionName` per-slug wiring preserved.
- Verification: home page renders; toggle works; navigating into a case study triggers the existing shared-element morph (cover + title only, no blur).

### Phase 5 — Case-study photograph integration

- `CaseStudy.tsx` gains an optional `photographs` array in the `case-studies.ts` shape. **Additive over Phase 4's extension** — `photographs` is a new optional nested array of `{ src, alt, meta }` entries, parallel to (not in tension with) the top-level `coverAlt` and `meta` fields added in Phase 4.
- Each photograph entry uses the `WorkPlate` shape (image + caption block, reused component).
- Photographs render between editorial sections at the position specified by the case-study content.
- Verification: Clouds at Sea renders with the `40°43′N 73°59′W` coordinate caption present; long-exposure photograph slot is visible (placeholder if image not yet shot).

### Phase 6 — `!` moment audit + colophon SHA

- Confirm each page's `!` moment per spec §11.
- Implement live Build SHA on `/studio` colophon via `NEXT_PUBLIC_BUILD_SHA` from Vercel.
- Verification: colophon renders SHA on production; `!` moments documented in TASKS.md.

---

## Verification criteria

- **V1:** No new tokens beyond the existing taste-polish set.
- **V2:** No new easing curves beyond the approved four.
- **V3:** Two typefaces: Geist Sans + Newsreader. Mono not loaded. Newsreader stays at reading weight; no 600 hero variant.
- **V4:** `data-register` attribute is not set anywhere in the DOM. `RegisterController` does not exist.
- **V5:** No `filter: blur()` declarations exist in any CSS file. No `mix-blend-mode` declarations beyond `multiply` on `PaperGrain`.
- **V6:** No `CinematicEntrance` component, no `sessionStorage('hkj.entered')` flag, no entrance overlay. The site loads as itself.
- **V7:** Home page renders as `WorkPlate` × N (gallery) or `WorkList` (list), based on `localStorage('hkj.home.view')`. `ViewToggle` is fixed to the top-right margin.
- **V8:** Each `WorkPlate` caption carries all 4 mandatory metadata fields (number, title, year+role, description). `meta` is optional and appears on photographic plates.
- **V9:** `prefers-reduced-motion`: section reveal instant; image swap absent; toggle instant; view transitions resolve to crossfade-only.
- **V10:** `prefers-reduced-data`: `coverAlt` not loaded; `PaperGrain` not mounted.
- **V11:** All Paper routes (`/studio`, `/bookmarks`, `/notes`, `/notes/[slug]`) render unchanged from current state.
- **V12:** View transitions on route change preserve existing per-slug `work-cover-{slug}` and `work-title-{slug}` shared-element morph at 300ms, without blur.
- **V13:** Core Web Vitals: LCP and INP not regressed from current state. The reductions in this spec (no entrance, no blur, no Stage) should improve LCP, not degrade it.
- **V14:** Each surface has ≤ 1 `!` moment, hand-tuned, documented in TASKS.md.

---

## Risks

**The dual list/gallery toggle is the only net-new component pattern.** If the toggle reads as gimmick rather than craft, the move fails. Mitigation: Geist Sans 10–11px tracked lowercase makes the toggle whisper, not announce. Persistence via `localStorage` removes the cost of re-toggling. The toggle's existence is the home's `!` moment — it earns its place by being hand-tuned and consistent.

**Caption density depends on real content.** A `WorkPlate` with a thin caption (just a title) reads worse than the 2-col grid did. The spec mandates ≥ 4 metadata fields; if a project's data doesn't fill 4 fields, the project isn't ready for the home page yet. Forcing function: this is the same forcing function as the photograph commitment in the prior spec — content has to meet the frame.

**The third retirement of Stage.** This is now the third time Stage/dark/cinematic-entrance has been spec'd and then retired. The risk is that the user re-proposes a cinematic direction in a future session and the cycle repeats. Mitigation: this spec is anchored to the *recorded taste profile*, not to a designer-choice. Future revisits should re-examine the profile, not the spec; if the profile evolves, the spec should evolve. If it hasn't, Stage should not return.

**The `coverAlt` content cost.** Hover image swap depends on each project providing a second usable frame. If only 1 of 4 projects has a `coverAlt`, the hover state is uneven across the home page. Acceptable: the scale-fallback works without `coverAlt`; the swap is a refinement that earns itself when content allows.

**Aspirations vs profile.** The aino direction the user opened with would have produced a beautiful site that is recognizably aspirational. The monograph direction will produce a beautiful site that is recognizably *theirs*. The risk is that "theirs" reads as less impressive than "aspirational" to a recruiter scanning Awwwards-trained eyes. Mitigation: the user's positioning is design-engineer with senior taste, not interactive-studio principal. Senior taste in 2026 reads as *what is reduced*, not *what is added*. The reference set confirms this.

---

## Open questions for user

The spec locks most decisions. These are the genuine open questions left for the user:

1. **Caption metadata for the four current works.** The spec mandates 4 mandatory fields per plate. Drafting below — confirm the data, or rewrite in the user's own voice before Phase 4 ships:
   - **Sift:** `№01 · Sift · 2023 · Tooling, Concept · Browse less, choose better.`
   - **Gyeol:** `№02 · Gyeol · 2024 · Identity, Service Design · A music app for resonant texture.`
   - **Pane:** `№03 · Pane · 2024 · Concept · A reading surface for slow attention.`
   - **Clouds at Sea:** `№04 · Clouds at Sea · 2025 · Photography, Concept · The horizon dissolves into its own data.`

2. **Phase 5 photograph commitment.** Independent of register, are the four long-exposure photographs still planned? If yes, by when? If no, fallback is fewer plates with more prose, per spec §10.

---

## Locked in spec (no longer open)

- Single warm-paper register (no Stage, no dark mode)
- Composition: single-column scrolling plates on home, with dual list/gallery toggle
- **Default home view: `gallery`** (visitors who set `list` get persistence via `localStorage` + the theme-flash mitigation rendering pattern)
- `--paper #FBFAF6` + `--ink*` tokens (no new tokens)
- Geist Sans + Newsreader (no new faces, Newsreader at reading weight only)
- Four-curve easing catalog (no additions)
- **Uniform 300ms view transitions across all paper-internal navigation** — no 420ms case-study extension, no blur, no shared-element morph beyond `work-cover-{slug}` + `work-title-{slug}`
- No cinematic entrance; site loads as itself
- No ASCII→video preloader; no ASCII as decoration anywhere
- No path-blur, long-exposure smear, lateral-drift section reveal
- `WorkPlate`, `WorkList`, `ViewToggle` as the new component primitives
- Caption rigor: 4 mandatory metadata fields per plate (number, title, year+role, description), `meta` optional, glyph discipline (`·`, `—`, `№`, `→`)
- **Home `!` moment = `ViewToggle` itself** (no cursor coordinate readout; no second moment)
- **`/work/clouds-at-sea` `!` = the existing `40°43′N 73°59′W` coord line** (the photograph completes this moment when it ships; it does not introduce a second one)
- Phased rollout (Phases 0–6, each independently shippable)
- All retirements in §3
- All preserved primitives in §3
- The `!` moment practice (one per page)

---
