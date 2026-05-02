# Portfolio — Tasks & Updates

Working document. Captures the current design direction, what's shipped,
and what's next. Updated 2026-04-30.

## Direction

**Monograph — single warm-paper register.** Locked in
[2026-05-02-monograph-direction-design.md](docs/superpowers/specs/2026-05-02-monograph-direction-design.md).
The portfolio is one register, one voice, one composition rule. Single
warm-paper ground throughout. Home composition: single-column scrolling
plates with a dual gallery/list view toggle. Three new components
(`WorkPlate`, `WorkList`, `ViewToggle`) compose the catalog; the rest
of the site is preserved.

**Retired (do not re-propose):** Stage register, dark mode, cinematic
entrance, ASCII→video preloader, path-blur / long-exposure-smear motion
grammar, lateral-drift section reveal, Newsreader-600 hero face, second
register architecture, `RegisterController` / `data-register` system,
shared-element morph blur in transit. See spec §3 for the full list.

**Anchored to:** the user's recorded taste profile (warm restraint,
monograph composition, natural motion, reduction-as-conviction).

**Principle**: every animation is triggered by a user action, scroll,
or first-paint. Never on idle. 120–400ms windows. Respect
`prefers-reduced-motion`.

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

## Roadmap — Monograph Phases

Spec: [2026-05-02-monograph-direction-design.md](docs/superpowers/specs/2026-05-02-monograph-direction-design.md).

- [x] **Phase 0 — Spec retirements.** TASKS.md updated; `MEMORY.md`
  pointer is a separate user-side action (outside planner scope).
- [ ] **Phase 1 — Token + type + CSS audit.** Confirm no `--stage*`,
  `--glow*`, `--palette-overlay` tokens; no `RegisterController` /
  `data-register` writes; no `Newsreader-600` declarations; no
  `filter: blur()` declarations. All routes render unchanged.
- [ ] **Phase 2 — Build `WorkPlate.tsx`.** Extract from current
  inline `Tile` in `page.tsx`. Caption block per spec §6. Hover image
  swap with `coverAlt`; scale fallback. Reduced-motion path. Per-slug
  `viewTransitionName` wiring preserved.
- [ ] **Phase 3 — Build `WorkList.tsx` + `ViewToggle.tsx`.**
  `useHomeView` hook + `HomeViewInit` head-script for hydration-safe
  persistence via `localStorage('hkj.home.view')`. Crossfade between
  views per spec §8.
- [ ] **Phase 4 — Replace home composition.** Rewrite `src/app/page.tsx`:
  remove 2-col grid, mount `<HomeViewInit>` + `<ViewToggle>` +
  `<WorkPlate>` × N + `<WorkList>`. Preserve per-slug
  `viewTransitionName` wiring.
- [ ] **Phase 5 — Case-study photograph integration.**
  `CaseStudy.tsx` gains optional `photographs` array. Each photograph
  rendered as a `WorkPlate`-shaped block between editorial sections.
- [ ] **Phase 6 — `!` moment audit + colophon SHA.** Walk every
  surface, confirm one `!` per page. Wire
  `NEXT_PUBLIC_BUILD_SHA?.slice(0, 7)` into `/studio` colophon.

---

## Principles to hold against

1. **No ambient motion.** Anything that moves on idle gets cut.
2. **One face.** Geist Sans is the primary face (9–15px, all UI,
   lowercased interaction text). Newsreader is reserved for long-form
   prose body only. Mono retired entirely; tabular figures via Geist's
   OpenType `tnum`.
3. **Documentary equality.** Every piece treated with the same editorial
   weight — no hero project, no demoted projects.
4. **Tactility through paper, hairlines, and microtype** — not through
   decoration or generated effects.
5. **Trust the type system.** `.eyebrow`, `.plate-mark`, `.prose`, and
   `.meta` primitives in [globals.css](src/app/globals.css) do the
   compositional work; new pages should compose from these, not invent.
6. **Monograph discipline.** One register, one warm-paper ground, one
   composition rule. See
   [2026-05-02-monograph-direction-design.md](docs/superpowers/specs/2026-05-02-monograph-direction-design.md).
7. **AI commoditizes technique; taste is the moat.** Every decision is
   a taste decision, not a technical one. Restraint amplifies the work,
   decoration diminishes it.

---

## `!` Moments — one per page, do not remove casually

Each hand-placed per
[monograph spec §7](docs/superpowers/specs/2026-05-02-monograph-direction-design.md).
Discoverable to a careful reader, invisible to a scroller. Documenting
here so refactors don't silently drop them.

- `/` — **planned (Phase 4).** The `ViewToggle` itself is the home `!`
  moment. Geist Sans 10–11px lowercased `gallery / list`, fixed
  top-right, persisted via `localStorage`. Discoverable but unannounced.
  Specific to the home page; no other surface gets a toggle.
  ([src/components/ViewToggle.tsx](src/components/ViewToggle.tsx))
- `/work/gyeol` — **shipped.** Second eyebrow separator `·` becomes
  `結`. Project's namesake character (Korean *gyeol* — texture/grain)
  used as one grain of punctuation.
  ([src/components/CaseStudy.tsx](src/components/CaseStudy.tsx))
- `/work/clouds-at-sea` — **partial.** `.case__coord` line reads
  `40°43′N 73°59′W · horizon dissolve`. Real coordinate; the
  long-exposure locus of the horizon. The pairing photograph arrives
  in Phase 5.
  ([src/components/CaseStudy.tsx](src/components/CaseStudy.tsx))
- `/studio` — **Phase 6.** Build SHA goes live in colophon.
  `NEXT_PUBLIC_BUILD_SHA?.slice(0, 7)` wired to the foot.
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
