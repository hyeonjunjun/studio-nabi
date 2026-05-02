# Portfolio — Tasks & Updates

Working document. Captures the current design direction, what's shipped,
and what's next. Updated 2026-04-30.

## Direction

**Stage & Paper — dual-register portfolio.** Locked in
[2026-04-24-stage-and-paper-design.md](docs/superpowers/specs/2026-04-24-stage-and-paper-design.md)
(reconciled 2026-04-30). The portfolio splits into two registers:

- **Stage** (`/`, `/work/[slug]`) — dark, luminous, generative-adjacent.
  The work as objects on warm dark paper.
- **Paper** (`/studio`, `/bookmarks`, `/notes`, `/notes/[slug]`) —
  editorial, sans-first, Hara-lineage. Studio writing.

Two registers, never mixed within a page. Crossing is the tell.
Positioning: A/V-inspired *design engineer*, not A/V studio.

**Reference lineage** (from [/bookmarks](src/app/bookmarks/page.tsx)):

- Kenya Hara — *Designing Design* — emptiness as active material
- Morrison & Fukasawa — *Super Normal* — documentary equality
- Dieter Rams / Vitsœ — restraint as the hardest design move
- Rauno Freiberg — craft in 40×40px details
- Emil Kowalski — shipped components over packaging
- Cathy Dolle — mirrored numbered index (the home mechanic)
- Muji / Teenage Engineering — manual-design discipline
- Craig Mod — scholarly-journal cadence on a personal site

**Principle**: every animation is triggered by a user action or a
first-paint event, never on idle. 120–400ms windows. Respect
`prefers-reduced-motion`.

**Voice**: simple, minimalist, confident. The shelf title sets the
register — *"A list of resources I refer to."* Same grammar across
pages: an article, a noun, a first-person verb. Not poetic, not
performative. No adjectives where a noun will do.

---

## Shipped — 2026-04-22 session

### Direction shift
- Metadata descriptions and OG card register swapped from
  "Observation log" → "Work from the studio" in
  [layout.tsx](src/app/layout.tsx) and
  [opengraph-image.tsx](src/app/opengraph-image.tsx).

### Paper and motion
- Deleted `AmbientAscii.tsx` (full-viewport flow field) and
  `CornerStamp.tsx` (reticle). No ambient motion anywhere.
- Deleted `AmbientGarden.tsx` (five box-drawing pictograms).
- Added [PaperGrain.tsx](src/components/PaperGrain.tsx) — single static
  SVG turbulence filter, 0.055 opacity, mix-blend-multiply. Mounted
  globally. Zero rAF cost.

### Microinteractions
- Added [CopyEmailLink.tsx](src/components/CopyEmailLink.tsx) — click
  to copy, 1.2s "copied" micro-state, falls back to mailto on
  unsupported browsers. Wired into homepage foot and contact card.
- Plate press on `GutterStrip` — `scale(0.988)` over 240ms on hover,
  honors reduced-motion. [GutterStrip.tsx:294-306](src/components/GutterStrip.tsx#L294-L306).

### Cleanup
- Homepage footer reworked from `flex` + spacer to
  `grid-template-columns: 1fr auto 1fr` with a centered
  `design engineer` tagline between email and location.
- `AmbientGarden` homepage-only scoping became moot after deletion.
- Dead `SOCIALS` alias removed from [contact.ts](src/constants/contact.ts).
- `EXPERIENCE` moved out of [about/page.tsx](src/app/about/page.tsx) into
  [constants/experience.ts](src/constants/experience.ts). Unattributed
  roles drop the `org` field entirely rather than carrying empty strings.
- Softened cathydolle note on [shelf.ts](src/constants/shelf.ts) from
  "the mechanic this site borrows" to a less self-footnoting line.

---

## Retired this session (do not re-propose)

Multiple ambient-motion directions were attempted and rejected. The
eventual direction — static paper grain only, no idle animation — is
load-bearing. Past attempts:

- **AmbientAscii** — full-viewport canvas of drifting dot glyphs
  (`·⋅∙∶∷∴`) rendered via sine field. Tried at opacities 0.07 → 0.11
  → 0.22 → 0.32 with various densities, thresholds, blend modes, and
  a radial center-mask. Always read as either invisible or too busy
  depending on the dial. Cut for [PaperGrain.tsx](src/components/PaperGrain.tsx).
- **Density-mapped ASCII landscape** — same canvas, but with a
  character ramp (`.,:;!lrLYU0@`) zoned into sky / horizon / ground
  bands. Rendered as real image-to-ASCII atmosphere but still felt
  like decoration on top of content.
- **AmbientGarden** — five finely-detailed natural elements anchored
  at viewport corners (hanging branch, thin twig, flower on stem,
  grass tuft, diagonally drifting leaf), each with its own CSS
  keyframe sway on `transform-origin: top` or `bottom`. Genuinely
  pretty; cut because it made the site feel like a botanical print,
  not a studio catalog.
- **MarqueeStrip** — thin (`14px`) fixed band at `bottom: 4px`
  drifting an ASCII pattern sideways over 96s via CSS translate.
  Read as a "live status ticker" which contradicted the studio
  register.
- **CornerStamp** — 120×120 canvas at home top-right, radial sine
  field morphing box-drawing glyphs like a stamp being pressed.
  Interesting; cut because the stamp read as signature gimmick.
- **Running head** proposed but not built (still in backlog).

Principle solidified: **no ambient motion.** Anything that moves on
idle is cut. Motion is reserved for user-triggered micro-states
(plate press, copy-email toast, wheel-snap on GutterStrip).

---

## Roadmap — Stage & Paper Phases

Spec: [2026-04-24-stage-and-paper-design.md](docs/superpowers/specs/2026-04-24-stage-and-paper-design.md)
(reconciled 2026-04-30).

- [ ] **Phase 1 — Stage tokens + register attribute.** Add `--stage`,
  `--stage-2`, `--stage-3`, `--glow`, `--glow-2`, `--glow-hair`,
  `--palette-overlay` to [globals.css](src/app/globals.css). Build
  `RegisterController` that writes `data-register` to `<html>` based on
  pathname. Add `html[data-register="stage" | "paper"]` scope rules.
  Zero visual change — foundation only.
- [ ] **Phase 2 — Home goes Stage.** Skin the existing 2-column 1:1
  grid for Stage: `--stage` ground, `--glow` microtype, halation on
  `.home__tile-frame`, direction-aware path-blur on tile hover
  (desktop-only, 320ms decay, 2px cap). `viewTransitionName` wiring
  preserved. Decide on `--stage-grain` if PaperGrain reads wrong on
  dark.
- [ ] **Phase 3 — Case study goes Stage.** `CaseStudy.tsx` gets dark
  theme, Newsreader at 600 for h1, halation + long-exposure smear on
  hero arrival (480ms, sub-768px disabled). Section reveal CSS
  rewritten for lateral drift. Add `.case__param`, `.case__signal`,
  `.case__module`, `.case__timecode` annotation primitives.
- [ ] **Phase 4 — Cinematic entrance.** New `CinematicEntrance.tsx` per
  spec §10: 1.1s timeline, transparent overlay above destination
  (LCP-safe), `sessionStorage` gate, register crossfade at tail for
  Paper destinations, navigation queueing during the entrance window.
- [ ] **Phase 5 — Signature dialect commitment.** Decide:
  long-exposure photographs (lock C, 4 photos in 8 weeks) vs.
  real-data ASCII fallback (B). Affects every case-study hero.
- [ ] **Phase 6 — `!` moment audit.** Walk every page once Stage has
  landed. Confirm one and only one `!` per surface. Update §
  [`!` Moments](#-moments--one-per-page-do-not-remove-casually).

### Open questions surfaced by the spec

- **Grain over Stage.** PaperGrain at 0.055 opacity multiply works on
  paper. On `#0E0D09` it likely needs a separate `--stage-grain` with
  `mix-blend-mode: screen` or a damped glow value. Validate in Phase 2.
- **`--glow` accent confirmation.** Spec locks warm moonlight `#F8F5EC`.
  Confirm before Phase 1.
- **Cinematic entrance philosophy.** Confirm: 1.1s budget; entrance
  always runs vs. skipped on Paper first-hits; wordmark identity
  (`HKJ` vs. `Hyeonjoon Jun · design engineer` vs. third option).
- **Photograph-production commitment.** Real call to make before
  Phase 5 starts.

### Content

- [ ] Fill or remove `pane` in [case-studies.ts](src/constants/case-studies.ts).
- [ ] Fill or remove `clouds-at-sea` in [case-studies.ts](src/constants/case-studies.ts).
- [ ] Sift in [case-studies.ts](src/constants/case-studies.ts) is
  partially populated — bring to Gyeol parity or trim.
- [ ] Rewrite Gyeol + Sift editorial copy in the new voice. Current
  prose is a hold-over from the observation-log era and reads
  performative ("Sift elevates your digital consumption…"). Should
  match the bookmarks register: *"A list of resources I refer to."*
- [ ] `/studio` body — review the bio paragraphs for final voice.
- [ ] Bookmarks: KEEP / WATCH / VISIT verticals are present in
  [shelf.ts](src/constants/shelf.ts) but suppressed in the page filter.
  Return them when each has volume.

### Already shipped (struck from prior backlog)

- ~~Hairline underline slide on external links~~ — shipped in
  [globals.css:192-210](src/app/globals.css#L192-L210).
- ~~View transitions on route change~~ — shipped in
  [globals.css:220-269](src/app/globals.css#L220-L269) with per-slug
  `work-cover-{slug}` and `work-title-{slug}` morphs.
- ~~Case study section reveal~~ — shipped via
  [useSectionReveal.ts](src/hooks/useSectionReveal.ts).
- ~~Folio (running head)~~ — shipped as
  [Folio.tsx](src/components/Folio.tsx); used on every route.
- ~~CatalogFrame dead code~~ — already deleted.

---

## Principles to hold against

1. **No ambient motion.** Anything that moves on idle gets cut.
2. **Two faces, both proportional.** Geist Sans is the chrome face
   (9–15px, all UI). Newsreader is the body serif (long-form prose only;
   weight 600 reserved for Stage hero titles). Mono retired entirely;
   tabular figures via Geist's OpenType `tnum`.
3. **Documentary equality.** Every piece treated with the same editorial
   weight — no hero project, no demoted projects.
4. **Tactility through paper, hairlines, and microtype** — not through
   decoration or generated effects.
5. **Trust the type system.** `.eyebrow`, `.plate-mark`, `.prose`, and
   `.meta` primitives in [globals.css](src/app/globals.css) do the
   compositional work; new pages should compose from these, not invent.
6. **Two registers, never mixed within a page.** Stage (dark, luminous)
   vs. Paper (editorial). Crossing is the tell. See
   [2026-04-24-stage-and-paper-design.md](docs/superpowers/specs/2026-04-24-stage-and-paper-design.md).
7. **AI commoditizes technique; taste is the moat.** Every decision is
   a taste decision, not a technical one. Restraint amplifies the work,
   decoration diminishes it.

---

## `!` Moments — one per page, do not remove casually

Each hand-placed per
[stage-and-paper spec §9](docs/superpowers/specs/2026-04-24-stage-and-paper-design.md).
Discoverable to a careful reader, invisible to a scroller. Documenting
here so refactors don't silently drop them.

- `/` — **pending Phase 2 audit.** The current grid is intentionally
  uniform — documentary equality. The `!` will be placed once the
  Stage skin lands; the prior `.cd__name` baseline nudge does not
  carry to the new home mechanic.
  ([src/app/page.tsx](src/app/page.tsx))
- `/work/gyeol` — **shipped.** Second eyebrow separator `·` becomes
  `結`. Project's namesake character (Korean *gyeol* — texture/grain)
  used as one grain of punctuation.
  ([src/components/CaseStudy.tsx](src/components/CaseStudy.tsx))
- `/work/clouds-at-sea` — **partial.** `.case__coord` line reads
  `40°43′N 73°59′W · horizon dissolve`. Real coordinate; the
  long-exposure locus of the horizon. The pairing photograph arrives
  in Phase 5.
  ([src/components/CaseStudy.tsx](src/components/CaseStudy.tsx))
- `/studio` — **pending.** One paragraph (the AI-as-collaborator
  line) receives a Newsreader `::first-letter` drop cap. The argument
  paragraph.
  ([src/app/studio/page.tsx](src/app/studio/page.tsx))
- `/bookmarks` — **shipped.** Butterfly Stool year reads `"1954 –"`
  (open-ended range). "Still present in my life."
  ([src/constants/shelf.ts](src/constants/shelf.ts))
- `/notes/[slug]` — **shipped.** Running-head band shows a hand-picked
  essay keyword at full ink alongside the title at ink-3. The word
  that carries the essay. N-001 → *restraint*.
  ([src/app/notes/[slug]/page.tsx](src/app/notes/[slug]/page.tsx),
  [src/constants/notes.ts](src/constants/notes.ts))
- `/notes` (index) — no `!` planned. Index pages are scaffolds, not
  surfaces; the `!` lives in the entries.
- Colophon (foot of `/studio`) — **pending.** Build SHA set live
  (`NEXT_PUBLIC_BUILD_SHA` from Vercel). Rare piece of genuinely live
  typography.
- Contact cluster (inside `/studio`) — **deferred.** Intentionally
  unplaced until a specific, non-forced detail is identified.
  Candidates: a hand-drawn SVG tick for the availability cluster, a
  micro-state change on email copy, a shift in the cluster grammar.
  Left honest rather than filled with ceremony.
