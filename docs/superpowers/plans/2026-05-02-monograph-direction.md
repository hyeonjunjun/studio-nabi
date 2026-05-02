# Monograph Direction Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the monograph-direction spec ([2026-05-02-monograph-direction-design.md](../specs/2026-05-02-monograph-direction-design.md)) — single warm-paper register, single-column scrolling plates with a dual gallery/list view toggle, retiring the Stage register and cinematic entrance grammar.

**Architecture:** Three new presentation components (`WorkPlate`, `WorkList`, `ViewToggle`) plus a small `useHomeView` hook and a head-scoped init script for hydration-safe view persistence. The current home page (`src/app/page.tsx`) is rewritten to compose them; case studies (`src/components/CaseStudy.tsx`) get an optional photograph plate slot. No new tokens, no new typefaces, no new easing curves.

**Tech Stack:** Next.js 15 (app router), React 19, TypeScript strict, Tailwind CSS v4 (postcss), vanilla CSS-in-JSX `<style>` blocks for component-scoped styles, View Transitions API for route changes. No GSAP, no Framer Motion, no Three.js — those were retired in the prior subtraction pass.

**Verification posture:** This project has no existing test setup in the main tree (vitest + @testing-library installed but unconfigured). Verification per task is: `npx tsc --noEmit` + `npm run lint` + `npm run dev` smoke. We add a minimal vitest config + one focused unit test in Chunk 3 for `useHomeView` (the only logic with real branching). Visual components rely on type check + manual verification; this matches the project's existing posture without adding scaffolding the team won't maintain.

**Reference the spec for ALL design decisions.** When in doubt, the spec governs. This plan ships the spec; it does not redesign.

---

## File Structure

### Files to create

| Path | Responsibility |
|---|---|
| `src/components/WorkPlate.tsx` | Single full-width image+caption plate. Used on home (gallery view) and inside case studies for embedded photographs. Replaces the `Tile` inline component that currently lives inside `page.tsx`. |
| `src/components/WorkList.tsx` | Typeset row index of the same data as the gallery view. No images. |
| `src/components/ViewToggle.tsx` | `gallery / list` toggle, fixed top-right. Reads/writes `useHomeView`. |
| `src/components/HomeViewInit.tsx` | Inline blocking `<script>` for `<head>` that reads `localStorage('hkj.home.view')` and sets `document.documentElement.dataset.homeView` before paint. Theme-flash mitigation pattern. |
| `src/hooks/useHomeView.ts` | Hook returning current view + setter. Wraps `localStorage` and the `data-home-view` attribute. |
| `vitest.config.ts` | Minimal vitest config so we can run the one logic test. |
| `src/hooks/__tests__/useHomeView.test.ts` | Unit test for the persistence + DOM-attribute behavior. |

### Files to modify

| Path | Change |
|---|---|
| `src/constants/pieces.ts` | Extend `Piece` with `coverAlt?: string` and `meta?: string`. Optional fields, additive. |
| `src/constants/case-studies.ts` | Extend `CaseStudy` with `photographs?: Array<{src; alt; meta?}>`. Optional, additive (Phase 5). |
| `src/app/page.tsx` | Rewrite home composition: replace inline `Tile` + 2-col grid with `<HomeViewInit>` mount + `<ViewToggle>` + `<WorkPlate>` × N (gallery) + `<WorkList>` (list). |
| `src/app/layout.tsx` | Mount `<HomeViewInit>` only on the home route. (Could be page-scoped via `next/script` with `strategy="beforeInteractive"`, or head-scoped via Next.js metadata. Plan picks page-scoped — simpler, route-local.) |
| `src/components/CaseStudy.tsx` | Phase 5: render `case-studies.ts` `photographs` array as embedded `WorkPlate` blocks between editorial sections. |
| `src/app/globals.css` | Verify no leaked Stage tokens (Phase 1 audit). No new global CSS in any phase — component styles stay in `<style>` blocks. |
| `src/app/studio/page.tsx` | Phase 6: render `process.env.NEXT_PUBLIC_BUILD_SHA?.slice(0, 7)` in colophon. |
| `TASKS.md` | Phase 0: retire Stage entries, point to new spec. Phase 6: document `!` moment placement. |

### Files to verify untouched

| Path | Why |
|---|---|
| `src/components/Folio.tsx`, `NavCoordinates.tsx`, `PaperGrain.tsx`, `CopyEmailLink.tsx`, `RouteAnnouncer.tsx` | Preserved primitives per spec §3 / §12 |
| `src/hooks/useReducedMotion.ts`, `useSectionReveal.ts` | Preserved hooks |
| `src/app/bookmarks/page.tsx`, `notes/page.tsx`, `notes/[slug]/page.tsx`, `studio/page.tsx` (until Phase 6) | All paper routes render unchanged per spec V11 |
| `src/app/work/[slug]/page.tsx` | Slug router unchanged; `CaseStudy.tsx` is what gains the photograph slot in Phase 5 |

---

## Chunk 0: Spec retirements (Phase 0)

Repo-side housekeeping. No code changes. Updates `TASKS.md` to retire Stage entries and point to the new spec.

### Task 0.1: Update TASKS.md to retire Stage and point to monograph spec

**Files:**
- Modify: `TASKS.md`

- [ ] **Step 1: Read current TASKS.md to understand the current narrative**

Run: `cat TASKS.md | head -50`

Expected: see the current "Direction" section pointing at `2026-04-24-stage-and-paper-design.md`.

- [ ] **Step 2: Replace the "Direction" section to point at the monograph spec**

Edit `TASKS.md` — replace the "Direction" section (and any subsections that detail Stage and Paper) with a single short Direction section:

```markdown
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
```

- [ ] **Step 3: Replace the "Roadmap" section with the new phases from the spec**

Find the existing "Roadmap" section in `TASKS.md` and replace its phase list with:

```markdown
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
```

- [ ] **Step 4: Update `!` Moments section to reflect monograph register**

In the "`!` Moments" section, replace the `/` (home) entry with:

```markdown
- `/` — **planned (Phase 4).** The `ViewToggle` itself is the home `!`
  moment. Geist Sans 10–11px lowercased `gallery / list`, fixed
  top-right, persisted via `localStorage`. Discoverable but unannounced.
  Specific to the home page; no other surface gets a toggle.
  ([src/components/ViewToggle.tsx](src/components/ViewToggle.tsx))
```

Confirm the `/work/clouds-at-sea` entry stays as the existing coord line. Confirm the `/studio` entry is updated to "Build SHA goes live in colophon (Phase 6)" and no longer references the drop-cap.

- [ ] **Step 5: Stage and commit**

Run:
```bash
git add TASKS.md
git commit -m "$(cat <<'EOF'
docs(tasks): retire stage entries — point to monograph direction

Phase 0 of the monograph rollout. Updates the working doc to retire
the Stage register references and point at the new direction spec.
No code changes.
EOF
)"
```

Expected: clean commit, no other files staged.

---

## Chunk 1: Token + type + CSS audit (Phase 1)

Verify the codebase is already clean of Stage-era artifacts. The prior subtraction passes already removed most of these; this phase is a guardrail check, not a fresh removal.

### Task 1.1: Verify no Stage CSS tokens leaked into globals.css

**Files:**
- Read-only: `src/app/globals.css`

- [ ] **Step 1: Search for Stage tokens**

Run:
```bash
grep -nE -- "--(stage|glow|palette-overlay)" src/app/globals.css || echo "CLEAN"
```

Expected: `CLEAN` (no matches).

If any matches appear, remove the matching lines and any rules that reference them. Re-run the search until clean.

- [ ] **Step 2: Search for blur filters**

Run:
```bash
grep -nE "filter:\s*blur" src/app/globals.css || echo "CLEAN"
```

Expected: `CLEAN`. The only `filter:` declaration that should exist is on `PaperGrain` (which uses `feTurbulence` SVG, not CSS `filter: blur()`).

- [ ] **Step 3: Search for cross-blend modes**

Run:
```bash
grep -nE "mix-blend-mode" src/app/globals.css
```

Expected: a single match on `PaperGrain` using `multiply`. No `screen`, no `overlay`, no Stage-grain variants.

### Task 1.2: Verify no RegisterController / data-register code

**Files:**
- Read-only across `src/`

- [ ] **Step 1: Search for `RegisterController`**

Run:
```bash
grep -rn "RegisterController" src/ || echo "CLEAN"
```

Expected: `CLEAN`.

- [ ] **Step 2: Search for `data-register` writes**

Run:
```bash
grep -rnE "data-register|dataset\.register" src/ || echo "CLEAN"
```

Expected: `CLEAN`.

### Task 1.3: Verify no Newsreader-600 hero face

**Files:**
- Read-only across `src/` and `src/app/globals.css`

The spec retires Newsreader 600 specifically as a *display / hero face* (§3, §10). It does **not** retire the existing `::first-letter` drop-cap on `/notes/[slug]` body prose, which uses `font-weight: 600` for its single ornamental character — that surface is on the V11 "render unchanged" list and the drop-cap is a typographic ornament, not a hero register.

- [ ] **Step 1: Search for weight 600**

Run:
```bash
grep -rnE "font-weight:\s*600" src/ || echo "CLEAN"
```

Expected outcome:
- **Acceptable:** exactly one match — `src/app/notes/[slug]/page.tsx` inside the `.note__body p:first-child::first-letter` rule. Leave this match alone.
- **Not acceptable:** any match in `page.tsx` (home), `WorkPlate.tsx` (when it ships), `WorkList.tsx`, `CaseStudy.tsx`, or anywhere outside a `::first-letter` rule. Those would be a leaked Stage hero face — remove them.

- [ ] **Step 2: Confirm the one match is the drop-cap**

If Step 1 found a single match, verify it's the drop-cap by running:
```bash
grep -B 2 "font-weight:\s*600" src/app/notes/\[slug\]/page.tsx
```

Expected: the `::first-letter` selector appears in the preceding lines.

- [ ] **Step 3: Search for serif tokens used at weight 600**

Run:
```bash
grep -rnE "(Newsreader|var\(--font-stack-serif\)).*\b600\b|\b600\b.*(Newsreader|var\(--font-stack-serif\))" src/ || echo "CLEAN"
```

Note the token name is `--font-stack-serif` (not `--font-serif`). Expected: `CLEAN`. The drop-cap rule does not co-locate the weight and the family on the same line, so it won't match this stricter regex.

### Task 1.4: Type-check and lint clean

- [ ] **Step 1: Type check**

Run: `npx tsc --noEmit`

Expected: no errors.

- [ ] **Step 2: Lint**

Run: `npm run lint`

Expected: no errors. Warnings acceptable if pre-existing.

- [ ] **Step 3: Build**

Run: `npm run build`

Expected: clean build, all routes generate.

### Task 1.5: Commit the audit (no-op commit if everything was already clean)

- [ ] **Step 1: Confirm working tree is clean**

Run: `git status`

Expected: clean (all checks were read-only). If anything was staged, review and either commit or revert per spec.

- [ ] **Step 2: If audit changes were needed, commit them**

If any Stage tokens were removed:
```bash
git add src/app/globals.css
git commit -m "$(cat <<'EOF'
chore(audit): remove leaked stage tokens — phase 1 guardrail

Confirms the monograph spec's V1/V4/V5 verification: no --stage*,
no --glow*, no --palette-overlay, no filter: blur(), no
data-register writes, no Newsreader-600. The codebase was already
clean from the prior subtraction pass; this commit captures any
residuals found by the Phase 1 audit grep.
EOF
)"
```

If the audit passed without changes, no commit needed; proceed to Chunk 2.

---

## Chunk 2: Build `WorkPlate.tsx` (Phase 2)

Extract the existing `Tile` inline component from `src/app/page.tsx` into a standalone `WorkPlate.tsx`. Add caption block per spec §6. Add hover image swap with `coverAlt`; scale fallback. Preserve per-slug `viewTransitionName` wiring.

### Task 2.1: Extend `Piece` type with optional `coverAlt` and `meta`

**Files:**
- Modify: `src/constants/pieces.ts`

**Spec-vs-code mapping (worth reading before editing):**

The spec §6 describes a prescriptive `WorkPlate` TypeScript shape with fields `role: string`, `medium?: string`, and `coverAlt?: string`. The actual `Piece` type in this codebase has `sector: string` (no separate `role` / `medium`), and `cover?: CatalogCover` (a discriminated union for video/image). The plan **does not** churn the existing data model. Instead:

- **`piece.sector` fills the spec's "Role" slot.** Existing data is good — `sector: "Material Science"` for Gyeol, `"WebGL / Generative"` for Clouds at Sea, etc. The 4-mandatory-field rule still holds (number · title · year · sector · description).
- **No `medium` slot is added.** The spec's `medium?` was an optional fifth slot; we already cover the 4 mandatory fields without it. If a real future need surfaces, add then.
- **`coverAlt` is typed as a `CatalogCover`-shaped union, not a plain `string`.** Symmetry with `cover` (video or image), and lets `coverAlt` reuse the existing render branch in `WorkPlate`. This is a deliberate enrichment over the spec's `string`.
- **`meta` is a plain `string`** — exactly as the spec specifies for the optional 5th caption line (EXIF, coordinate, source).

Document this mapping inline so the executor doesn't try to "fix" the divergence.

- [ ] **Step 1: Read current `Piece` interface**

Read `src/constants/pieces.ts` lines 1–28.

- [ ] **Step 2: Add the two optional fields**

In the `Piece` interface, add (above the closing brace):

```ts
  /**
   * Optional alternate cover frame; revealed on hover. Same shape as
   * `cover` (video or image discriminated union) so the renderer can
   * reuse the existing branch. Diverges intentionally from spec §6's
   * `coverAlt?: string` for symmetry with `cover`.
   */
  coverAlt?: CatalogCover;
  /**
   * Optional caption microtype: EXIF, coordinate, location, source.
   * Renders as the 5th caption line per spec §9 (`Geist Sans 11px,
   * 0.08em tracking, var(--ink-4)`). The 4 mandatory fields above
   * (slug → number, title, year, sector → role, description) are
   * always present.
   */
  meta?: string;
```

- [ ] **Step 3: Type check**

Run: `npx tsc --noEmit`

Expected: no errors. Existing `PIECES` literals are still valid (both fields optional).

- [ ] **Step 4: Stage and commit**

Run:
```bash
git add src/constants/pieces.ts
git commit -m "feat(pieces): extend Piece with coverAlt + meta optional fields

Phase 2 prep for WorkPlate caption block. Additive schema change
— no PIECES literal updates required."
```

### Task 2.2: Create `WorkPlate.tsx` skeleton

**Files:**
- Create: `src/components/WorkPlate.tsx`

- [ ] **Step 1: Write the new component file**

Create `src/components/WorkPlate.tsx` with this content:

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { type Piece } from "@/constants/pieces";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  piece: Piece;
  /** Optional href override; defaults to /work/{slug}. */
  href?: string;
};

/**
 * WorkPlate — single full-width image + caption block. Used on the
 * home page (gallery view) and inside case studies for embedded
 * photographs. Caption block carries the four mandatory metadata
 * fields per the monograph spec §6: number · title · year+role ·
 * description, plus optional `meta` line for EXIF / coordinate /
 * source. Hover (desktop only) swaps to coverAlt if present, falls
 * back to a 1.012 scale otherwise. Preserves per-slug
 * viewTransitionName wiring on cover and title.
 */
export default function WorkPlate({ piece, href }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  const target = href ?? `/work/${piece.slug}`;
  const coverVtName = `work-cover-${piece.slug}`;
  const titleVtName = `work-title-${piece.slug}`;

  // Hover-swap source: prefer coverAlt when present + hovered + not reduced.
  const showAlt = hovered && !reduced && !!piece.coverAlt;
  const activeCover = showAlt ? piece.coverAlt! : piece.cover;

  return (
    <Link
      href={target}
      className="plate"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-has-alt={piece.coverAlt ? "true" : "false"}
    >
      <div
        className="plate__frame"
        style={{
          viewTransitionName: coverVtName,
          aspectRatio: piece.coverAspect ?? "4 / 3",
        } as React.CSSProperties}
      >
        {activeCover?.kind === "video" ? (
          <video
            ref={videoRef}
            className="plate__media"
            src={activeCover.src}
            poster={activeCover.poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          />
        ) : activeCover?.kind === "image" ? (
          <Image
            src={activeCover.src}
            alt={`${piece.title} — cover`}
            fill
            sizes="(max-width: 720px) 100vw, 720px"
            className="plate__media"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="plate__placeholder">
            <span className="plate-mark">In development · {piece.year}</span>
          </div>
        )}
      </div>

      <div className="plate__cap">
        <span className="plate__num tabular">№{piece.number}</span>
        <span
          className="plate__title"
          style={{ viewTransitionName: titleVtName } as React.CSSProperties}
        >
          {piece.title}
        </span>
        <span className="plate__role">
          <span className="tabular">{piece.year}</span>
          {" · "}
          {piece.sector}
        </span>
        <span className="plate__desc">{piece.description}</span>
        {piece.meta && <span className="plate__meta tabular">{piece.meta}</span>}
      </div>

      <style>{`
        .plate {
          display: grid;
          gap: clamp(16px, 2.5vh, 24px);
          color: var(--ink);
          padding-block-end: clamp(56px, 12vh, 120px);
        }
        .plate__frame {
          position: relative;
          width: 100%;
          background: var(--paper-2);
          overflow: hidden;
          isolation: isolate;
        }
        .plate__media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: opacity 320ms var(--ease), transform 280ms var(--ease);
        }
        .plate[data-has-alt="false"]:hover .plate__media {
          transform: scale(1.012);
        }
        .plate__placeholder {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 24px;
        }
        .plate__cap {
          display: grid;
          gap: 6px;
          max-width: 60ch;
        }
        .plate__num {
          font-family: var(--font-stack-sans);
          font-size: 11px;
          letter-spacing: 0.08em;
          color: var(--ink-3);
        }
        .plate__title {
          font-family: var(--font-stack-sans);
          font-size: 15px;
          letter-spacing: 0.005em;
          color: var(--ink);
        }
        .plate__role {
          font-family: var(--font-stack-sans);
          font-size: 13px;
          letter-spacing: 0.06em;
          color: var(--ink-3);
        }
        .plate__desc {
          font-family: var(--font-stack-sans);
          font-size: 15px;
          line-height: 1.5;
          color: var(--ink-2);
        }
        .plate__meta {
          font-family: var(--font-stack-sans);
          font-size: 11px;
          letter-spacing: 0.08em;
          color: var(--ink-4);
        }

        @media (prefers-reduced-motion: reduce) {
          .plate__media { transition: none; }
          .plate[data-has-alt="false"]:hover .plate__media { transform: none; }
        }

        @media (hover: none), (pointer: coarse) {
          .plate[data-has-alt="false"]:hover .plate__media { transform: none; }
        }
      `}</style>
    </Link>
  );
}
```

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`

Expected: no errors.

- [ ] **Step 3: Lint**

Run: `npm run lint`

Expected: no new errors.

- [ ] **Step 4: Stage and commit**

Run:
```bash
git add src/components/WorkPlate.tsx
git commit -m "feat(plate): add WorkPlate component — full-width image + caption

Phase 2 of monograph rollout. Extracts the inline Tile from
src/app/page.tsx into a reusable plate with caption block per
spec §6 (number · title · year+role · description, optional meta).
Hover image swap when coverAlt present; scale fallback otherwise.
Preserves per-slug viewTransitionName wiring on cover and title."
```

### Task 2.3: Sanity-render WorkPlate to confirm it works in isolation

**Files:**
- Read-only: `src/components/WorkPlate.tsx`

This is a smoke test — no automated test, just temporarily mount in a route to verify visually. We do NOT mount it in the home page yet (that's Phase 4).

- [ ] **Step 1: Start dev server**

Run: `npm run dev` (in background)

- [ ] **Step 2: Quick verification**

There's no public dev page yet. Confirm Phase 2 is complete by:
- Type check passes (already done in Task 2.2)
- Component file exists (`ls src/components/WorkPlate.tsx`)
- No imports fail (`grep -rn "WorkPlate" src/`)

The component renders for real when Phase 4 mounts it. No Storybook setup is in scope.

- [ ] **Step 3: Stop dev server**

If you started one with `&`, kill it.

---

## Chunk 3: Build `WorkList`, `ViewToggle`, `useHomeView`, `HomeViewInit` (Phase 3)

The dual-view machinery. Hook + UI toggle + the head-scoped init script.

### Task 3.1: Create `useHomeView` hook

**Files:**
- Create: `src/hooks/useHomeView.ts`

- [ ] **Step 1: Write the hook**

Create `src/hooks/useHomeView.ts`:

```ts
"use client";

import { useCallback, useEffect, useState } from "react";

export type HomeView = "gallery" | "list";

const STORAGE_KEY = "hkj.home.view";
const DOM_KEY = "homeView"; // -> data-home-view

function readStored(): HomeView {
  if (typeof window === "undefined") return "gallery";
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "list" ? "list" : "gallery";
}

/**
 * Reads + writes the home view preference. Persists to localStorage
 * under "hkj.home.view" and mirrors the choice to
 * document.documentElement.dataset.homeView so CSS can govern visibility
 * of the two compositions without re-rendering. Pairs with HomeViewInit
 * which runs the same read in a blocking <head> script before paint.
 */
export function useHomeView(): {
  view: HomeView;
  setView: (next: HomeView) => void;
  toggle: () => void;
} {
  const [view, setViewState] = useState<HomeView>("gallery");

  // After hydration, read the stored value (the head-script already
  // set the DOM attribute; this just syncs React state).
  useEffect(() => {
    setViewState(readStored());
  }, []);

  const setView = useCallback((next: HomeView) => {
    setViewState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.dataset[DOM_KEY] = next;
    }
  }, []);

  const toggle = useCallback(() => {
    setView(view === "gallery" ? "list" : "gallery");
  }, [view, setView]);

  return { view, setView, toggle };
}
```

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`

Expected: no errors.

- [ ] **Step 3: Stage**

Run: `git add src/hooks/useHomeView.ts`

(Defer commit until the test in Task 3.2 lands.)

### Task 3.2: Add minimal vitest config + unit test for `useHomeView`

**Files:**
- Create: `vitest.config.ts`
- Create: `src/hooks/__tests__/useHomeView.test.ts`
- Modify: `package.json` (add `test` script)

- [ ] **Step 1: Write the vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
```

- [ ] **Step 2: Add `test` script to package.json**

Edit `package.json`'s `scripts` section to add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Write the failing test**

Create `src/hooks/__tests__/useHomeView.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useHomeView } from "../useHomeView";

describe("useHomeView", () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset.homeView;
  });

  it("defaults to gallery when storage is empty", async () => {
    const { result } = renderHook(() => useHomeView());
    await waitFor(() => expect(result.current.view).toBe("gallery"));
  });

  it("reads list from localStorage on mount", async () => {
    window.localStorage.setItem("hkj.home.view", "list");
    const { result } = renderHook(() => useHomeView());
    // The hook returns "gallery" synchronously on first render and
    // syncs to stored value inside a useEffect. waitFor flushes
    // effects deterministically across React versions.
    await waitFor(() => expect(result.current.view).toBe("list"));
  });

  it("setView writes to localStorage and the data attribute", () => {
    const { result } = renderHook(() => useHomeView());
    act(() => result.current.setView("list"));
    expect(window.localStorage.getItem("hkj.home.view")).toBe("list");
    expect(document.documentElement.dataset.homeView).toBe("list");
  });

  it("toggle flips between gallery and list", async () => {
    const { result } = renderHook(() => useHomeView());
    await waitFor(() => expect(result.current.view).toBe("gallery"));
    act(() => result.current.toggle());
    expect(result.current.view).toBe("list");
    act(() => result.current.toggle());
    expect(result.current.view).toBe("gallery");
  });

  it("ignores invalid storage values, defaults to gallery", async () => {
    window.localStorage.setItem("hkj.home.view", "garbage");
    const { result } = renderHook(() => useHomeView());
    await waitFor(() => expect(result.current.view).toBe("gallery"));
  });
});
```

- [ ] **Step 4: Run the test**

Run: `npm run test`

Expected: all 5 tests PASS. (We wrote the implementation in Task 3.1 first because the hook is mostly mechanical and a true red-green-refactor cycle would have meant six tiny test commits — pragmatic call to write hook + test in adjacent steps.)

If a test fails, fix the hook (or the test) until clean.

- [ ] **Step 5: Stage and commit**

Run:
```bash
git add src/hooks/useHomeView.ts src/hooks/__tests__/useHomeView.test.ts vitest.config.ts package.json
git commit -m "feat(home-view): add useHomeView hook + minimal vitest config

Phase 3 prep. The hook persists 'gallery' | 'list' to
localStorage and mirrors to document.documentElement.dataset.homeView
so CSS can govern visibility without re-rendering. Tests cover
default, persistence, toggle, and invalid-storage handling."
```

### Task 3.3: Create `HomeViewInit.tsx` head-scoped init script

**Files:**
- Create: `src/components/HomeViewInit.tsx`

**Why a plain `<script>` element instead of `next/script`:** `next/script` with `strategy="beforeInteractive"` is only valid in `app/layout.tsx`. Since `HomeViewInit` is page-scoped (rendered from `src/app/page.tsx`, the home route only), `next/script` is the wrong tool here. A plain `<script dangerouslySetInnerHTML>` rendered by a server component is the canonical theme-flash mitigation pattern — Next.js renders it inline in the HTML output during SSR, so the script executes before client hydration.

- [ ] **Step 1: Write the component**

Create `src/components/HomeViewInit.tsx`:

```tsx
/**
 * Inline blocking script that runs before paint and reads
 * localStorage('hkj.home.view'), then sets
 * document.documentElement.dataset.homeView so CSS can render the
 * correct composition (gallery vs list) without a hydration flash.
 *
 * Pairs with useHomeView. Mounted only on the home route — its
 * behavior is page-local, not app-global. Renders as a plain
 * <script> element with dangerouslySetInnerHTML; this is a server
 * component (no "use client" directive) so the script appears in the
 * SSR HTML output and runs before hydration.
 *
 * Pattern: theme-flash mitigation (same shape used widely for
 * dark-mode persistence). The script is tiny, synchronous, and runs
 * once before first paint.
 */
export default function HomeViewInit() {
  const code = `(function(){try{var v=localStorage.getItem('hkj.home.view');document.documentElement.dataset.homeView=(v==='list')?'list':'gallery';}catch(e){document.documentElement.dataset.homeView='gallery';}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
```

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`

Expected: no errors.

- [ ] **Step 3: Stage**

`git add src/components/HomeViewInit.tsx`

(Defer commit until Task 3.4 lands so the toggle component lands together.)

### Task 3.4: Create `ViewToggle.tsx`

**Files:**
- Create: `src/components/ViewToggle.tsx`

- [ ] **Step 1: Write the component**

Create `src/components/ViewToggle.tsx`:

```tsx
"use client";

import { useHomeView, type HomeView } from "@/hooks/useHomeView";

/**
 * ViewToggle — fixed top-right gallery/list switch. Geist Sans 10–11px
 * tracked lowercase. The home page's only persistent UI primitive
 * beyond Folio + nav. Per spec §8, this *is* the home `!` moment —
 * discoverable but unannounced.
 */
export default function ViewToggle() {
  const { view, setView } = useHomeView();

  function pick(target: HomeView) {
    if (target !== view) setView(target);
  }

  return (
    <div className="view-toggle" role="group" aria-label="Home view">
      <button
        type="button"
        className="view-toggle__btn"
        data-active={view === "gallery"}
        aria-pressed={view === "gallery"}
        onClick={() => pick("gallery")}
      >
        gallery
      </button>
      <span className="view-toggle__sep" aria-hidden> / </span>
      <button
        type="button"
        className="view-toggle__btn"
        data-active={view === "list"}
        aria-pressed={view === "list"}
        onClick={() => pick("list")}
      >
        list
      </button>

      <style>{`
        .view-toggle {
          position: fixed;
          top: clamp(20px, 3vh, 36px);
          right: clamp(20px, 4vw, 56px);
          display: inline-flex;
          align-items: baseline;
          gap: 0;
          font-family: var(--font-stack-sans);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: lowercase;
          color: var(--ink-3);
          z-index: 5;
          background: transparent;
        }
        .view-toggle__btn {
          background: transparent;
          border: 0;
          padding: 0;
          margin: 0;
          font: inherit;
          color: var(--ink-3);
          cursor: pointer;
          letter-spacing: inherit;
          text-transform: inherit;
          transition: color 200ms var(--ease);
        }
        .view-toggle__btn[data-active="true"] {
          color: var(--ink);
        }
        .view-toggle__btn:hover { color: var(--ink); }
        .view-toggle__sep {
          color: var(--ink-4);
          padding-inline: 0.4em;
        }

        @media (prefers-reduced-motion: reduce) {
          .view-toggle__btn { transition: none; }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Type check + lint**

Run: `npx tsc --noEmit && npm run lint`

Expected: no errors.

- [ ] **Step 3: Stage and commit (HomeViewInit + ViewToggle together)**

Run:
```bash
git add src/components/HomeViewInit.tsx src/components/ViewToggle.tsx
git commit -m "feat(view-toggle): add ViewToggle + HomeViewInit head-script

Phase 3. The toggle is the home '!' moment — Geist Sans 11px
lowercased gallery / list, fixed top-right, persisted via
useHomeView. HomeViewInit runs a blocking head-script before paint
to set data-home-view on <html>, eliminating the hydration flash
for returning visitors who prefer the list view."
```

### Task 3.5: Create `WorkList.tsx`

**Files:**
- Create: `src/components/WorkList.tsx`

- [ ] **Step 1: Write the component**

Create `src/components/WorkList.tsx`:

```tsx
"use client";

import Link from "next/link";
import { type Piece } from "@/constants/pieces";

type Props = {
  pieces: Piece[];
};

/**
 * WorkList — typeset row index of the catalog. No images. One <a>
 * per piece with full keyboard support. Tabular `tnum` numerals for
 * the number column. Per spec §7 (Anatomy).
 */
export default function WorkList({ pieces }: Props) {
  return (
    <ol className="worklist" aria-label="Studio catalog index">
      {pieces.map((piece) => (
        <li key={piece.slug} className="worklist__row">
          <Link href={`/work/${piece.slug}`} className="worklist__link">
            <span className="worklist__num tabular">№{piece.number}</span>
            <span className="worklist__title">{piece.title}</span>
            <span className="worklist__year tabular">{piece.year}</span>
            <span className="worklist__role">{piece.sector}</span>
            <span className="worklist__desc">{piece.description}</span>
            <span className="worklist__arrow" aria-hidden>→</span>
          </Link>
        </li>
      ))}

      <style>{`
        .worklist {
          list-style: none;
          padding: 0;
          margin: 0;
          width: 100%;
          max-width: 920px;
          margin-inline: auto;
          display: grid;
          gap: 0;
        }
        .worklist__row {
          border-top: 1px solid var(--ink-hair);
        }
        .worklist__row:last-child {
          border-bottom: 1px solid var(--ink-hair);
        }
        .worklist__link {
          display: grid;
          grid-template-columns: 56px minmax(120px, 0.9fr) 56px 1fr 1.6fr 24px;
          gap: clamp(12px, 2vw, 24px);
          align-items: baseline;
          padding-block: 0.95rem;
          padding-inline: clamp(8px, 1.2vw, 16px);
          color: var(--ink);
          transition: background 200ms var(--ease);
        }
        .worklist__link:hover {
          background: var(--ink-hair);
        }
        .worklist__num {
          font-family: var(--font-stack-sans);
          font-size: 11px;
          letter-spacing: 0.08em;
          color: var(--ink-3);
        }
        .worklist__title {
          font-family: var(--font-stack-sans);
          font-size: 15px;
          letter-spacing: 0.005em;
          color: var(--ink);
        }
        .worklist__year {
          font-family: var(--font-stack-sans);
          font-size: 13px;
          color: var(--ink-3);
        }
        .worklist__role {
          font-family: var(--font-stack-sans);
          font-size: 13px;
          letter-spacing: 0.06em;
          color: var(--ink-3);
        }
        .worklist__desc {
          font-family: var(--font-stack-sans);
          font-size: 14px;
          line-height: 1.5;
          color: var(--ink-2);
        }
        .worklist__arrow {
          font-family: var(--font-stack-sans);
          font-size: 13px;
          color: var(--ink-3);
          opacity: 0;
          transition: opacity 200ms var(--ease);
          justify-self: end;
        }
        .worklist__link:hover .worklist__arrow,
        .worklist__link:focus-visible .worklist__arrow {
          opacity: 1;
        }

        @media (max-width: 720px) {
          .worklist__link {
            grid-template-columns: 40px 1fr auto;
            grid-template-areas:
              "num title year"
              "num role role"
              "num desc desc";
            row-gap: 4px;
          }
          .worklist__num { grid-area: num; }
          .worklist__title { grid-area: title; }
          .worklist__year { grid-area: year; justify-self: end; }
          .worklist__role { grid-area: role; }
          .worklist__desc { grid-area: desc; }
          .worklist__arrow { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .worklist__link,
          .worklist__arrow { transition: none; }
        }
      `}</style>
    </ol>
  );
}
```

- [ ] **Step 2: Type check + lint**

Run: `npx tsc --noEmit && npm run lint`

Expected: no errors.

- [ ] **Step 3: Stage and commit**

Run:
```bash
git add src/components/WorkList.tsx
git commit -m "feat(worklist): add WorkList — typeset row index

Phase 3. No images; one <a> per piece with five microtype columns
(№ · title · year · role · description) and a hover-revealed →.
Mobile collapses to a 3-row layout per row."
```

---

## Chunk 4: Replace home composition (Phase 4)

Mount the new components on `/`. Remove the inline `Tile` + 2-col grid composition. Verify view transitions still work into `/work/[slug]`.

### Task 4.1: Rewrite `src/app/page.tsx` to compose the new primitives

**Files:**
- Modify: `src/app/page.tsx` (full replacement)

- [ ] **Step 1: Read the current `page.tsx` for context**

Run: `cat src/app/page.tsx | head -110`

Expected: see the current `Tile` + grid composition.

- [ ] **Step 2: Rewrite the file**

Replace the entire contents of `src/app/page.tsx` with:

```tsx
import CopyEmailLink from "@/components/CopyEmailLink";
import Folio from "@/components/Folio";
import HomeViewInit from "@/components/HomeViewInit";
import ViewToggle from "@/components/ViewToggle";
import WorkPlate from "@/components/WorkPlate";
import WorkList from "@/components/WorkList";
import { PIECES } from "@/constants/pieces";

/**
 * Home — monograph register. Single warm-paper ground. The catalog
 * is one composition with two views: a vertical sequence of
 * full-width plates (gallery, default) or a typeset row index
 * (list). The toggle is the home `!` moment per the monograph spec
 * §11 — discoverable, unannounced. View persistence is governed by
 * data-home-view on <html>, set before paint by HomeViewInit.
 */
export default function Home() {
  // PIECES is sorted by `order` already; no client-side sort needed.
  const pieces = [...PIECES].sort((a, b) => a.order - b.order);

  return (
    <>
      <HomeViewInit />
      <main id="main" className="home">
        <Folio token="§01" />
        <ViewToggle />

        <section className="home__gallery" aria-label="Studio catalog (gallery)">
          {pieces.map((piece) => (
            <WorkPlate key={piece.slug} piece={piece} />
          ))}
        </section>

        <section className="home__list" aria-label="Studio catalog (list)">
          <WorkList pieces={pieces} />
        </section>

        <footer className="home__foot">
          <CopyEmailLink className="home__mail" />
          <span className="home__loc tabular">2026 · new york</span>
        </footer>

        <style>{`
          .home {
            min-height: 100svh;
            background: var(--paper);
            color: var(--ink);
            padding: clamp(140px, 26vh, 240px) clamp(20px, 4vw, 56px) clamp(56px, 9vh, 88px);
            display: grid;
            gap: clamp(40px, 6vh, 72px);
          }

          /* Gallery widens from the previous 600px (which was sized
             for two ~290px tile columns) to 720px for single-column
             plates — single column wants more breathing room before
             the caption block reaches its 60ch internal cap. */
          .home__gallery {
            max-width: 720px;
            margin-inline: auto;
            width: 100%;
            display: grid;
            gap: 0;
          }

          .home__list {
            display: grid;
            width: 100%;
          }

          /* Visibility governed by data-home-view on <html>, set by
             HomeViewInit before paint. */
          html[data-home-view="gallery"] .home__list { display: none; }
          html[data-home-view="list"] .home__gallery { display: none; }
          /* Fallback when the attribute hasn't been set yet (script
             blocked, JS off): show gallery only. */
          html:not([data-home-view]) .home__list { display: none; }

          .home__foot {
            max-width: 720px;
            margin-inline: auto;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            padding-top: clamp(16px, 2.5vh, 24px);
            border-top: 1px solid var(--ink-hair);
            font-family: var(--font-stack-sans);
            font-size: 10px;
            letter-spacing: 0.06em;
            text-transform: uppercase;
          }
          .home__mail { color: var(--ink); }
          .home__mail[data-copied] { color: var(--ink-3); }
          .home__loc { color: var(--ink-3); }
        `}</style>
      </main>
    </>
  );
}
```

Note: this file is **not** marked `"use client"` because the page itself is a server component. The client components inside (`ViewToggle`, `WorkPlate`, `CopyEmailLink`) carry their own `"use client"` directives. `HomeViewInit` is a server component that renders a plain `<script>` tag with `dangerouslySetInnerHTML`; Next.js inlines it in the SSR HTML so it executes before client hydration.

- [ ] **Step 3: Type check + lint**

Run: `npx tsc --noEmit && npm run lint`

Expected: no errors. If TypeScript complains about `Folio`, `CopyEmailLink`, or any other server/client boundary, leave the page as a server component and confirm the imported components have correct directives.

- [ ] **Step 4: Build**

Run: `npm run build`

Expected: clean build, `/` route generates without errors.

- [ ] **Step 5: Stage and commit**

Run:
```bash
git add src/app/page.tsx
git commit -m "feat(home): replace 2-col grid with WorkPlate stack + WorkList

Phase 4 of monograph rollout. Home composition now reads as one
sequence of full-width plates (gallery, default) or a typeset row
index (list) — switched by ViewToggle and persisted via
data-home-view on <html>. Per-slug viewTransitionName wiring
preserved across both views (only gallery shows covers; list
falls through to /work/[slug] on click)."
```

### Task 4.2: Manual smoke verification

**Files:**
- Read-only: browser

- [ ] **Step 1: Start dev server**

Run: `npm run dev` (in background — note the port, usually 3000).

- [ ] **Step 2: Open the home page**

In a browser, open `http://localhost:3000/`.

Verify:
- The home page loads with warm paper ground.
- A vertical sequence of plates renders (one per piece in `PIECES`).
- Each plate shows: image/video at top, then №NN, title, year+sector, description beneath.
- Folio reads `§01` at the corner.
- `gallery / list` toggle is in the top-right.

- [ ] **Step 3: Test the toggle**

Click `list` in the toggle. Verify:
- The plate stack disappears.
- A typeset row index appears in its place.
- Each row shows: №NN · title · year · sector · description.
- Hovering a row reveals a `→` glyph at the right.
- Clicking a row navigates to `/work/<slug>`.

Click `gallery`. Verify:
- The list disappears, the plate stack returns.

- [ ] **Step 4: Test persistence**

While in `list` view, reload the page. Verify:
- The page loads in `list` view directly — no flash of the gallery.

While in `gallery` view, reload. Verify:
- Loads as `gallery`.

- [ ] **Step 5: Test view transitions to /work/[slug]**

From the **gallery** view, click a piece's plate. Verify:
- The cover and title morph into the case-study page (existing per-slug viewTransitionName wiring).
- Navigate back. Cover/title morph back.

From the **list** view, click a row. Verify:
- Plain 300ms crossfade — no shared-element morph. *This is intentional, not a regression.* The list has no images, so there's no cover element to share with the destination. The case-study cover crossfades in normally.

- [ ] **Step 6: Test reduced motion**

In browser devtools, enable `prefers-reduced-motion: reduce` (Rendering panel). Reload. Verify:
- Toggle still works but the crossfade is instant.
- Hover image swap on plates is absent.
- Section reveals are instant.

- [ ] **Step 7: Stop dev server**

Kill the background process.

- [ ] **Step 8: Note any visual issues**

If anything reads wrong (caption rhythm, plate sizing, list column proportions, etc.), open a follow-up commit with adjustments. Do NOT mix design-tweak commits with the Phase 4 mount commit; keep history clean.

---

## Chunk 5: Case-study photograph integration (Phase 5)

`CaseStudy.tsx` gains an optional `photographs` array on the `CaseStudy` shape. Each entry renders as a `WorkPlate`-shaped block embedded between editorial sections.

### Task 5.1: Extend `CaseStudy` type with `photographs` field

**Files:**
- Modify: `src/constants/case-studies.ts`

- [ ] **Step 1: Add the field to the interface**

In `src/constants/case-studies.ts`, locate the `CaseStudy` interface (lines 30–79). Add this field above the closing brace:

```ts
    photographs?: Array<{
        src: string;
        alt: string;
        meta?: string;
        /** Optional aspect ratio override; defaults to "3 / 2". */
        aspect?: string;
    }>;
```

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`

Expected: no errors. All existing `CASE_STUDIES` literals remain valid (additive change).

- [ ] **Step 3: Stage**

`git add src/constants/case-studies.ts`

(Defer commit until Task 5.2 lands so the type and the renderer ship together.)

### Task 5.2: Render `photographs` in CaseStudy.tsx

**Files:**
- Modify: `src/components/CaseStudy.tsx`

- [ ] **Step 1: Locate the editorial section in CaseStudy.tsx**

Read `src/components/CaseStudy.tsx`. Find the editorial section (look for `data?.editorial` or the section after the ledger). The photographs block sits after the editorial copy and before any process/highlights blocks.

- [ ] **Step 2: Add the photographs renderer**

Inside `CaseStudy.tsx`'s JSX, after the editorial section and before any subsequent section, add:

```tsx
{data?.photographs && data.photographs.length > 0 && (
  <section className="case__photographs" aria-label="Photographs">
    {data.photographs.map((photo, i) => (
      <figure
        key={i}
        className="case__photograph"
        style={{ aspectRatio: photo.aspect ?? "3 / 2" } as React.CSSProperties}
      >
        <img src={photo.src} alt={photo.alt} />
        {photo.meta && (
          <figcaption className="case__photograph-meta tabular">
            {photo.meta}
          </figcaption>
        )}
      </figure>
    ))}
  </section>
)}
```

Note: this uses a plain `<img>` (not `next/image`) for simplicity inside an editorial flow where exact dimensions vary per shot. If LCP becomes a concern, swap to `next/image` with explicit `width`/`height` per photograph.

- [ ] **Step 3: Add CSS for the photographs section**

In the same file's `<style>` block (or a sibling `<style>` block), add:

```css
.case__photographs {
  display: grid;
  gap: clamp(40px, 8vh, 96px);
  width: 100%;
  max-width: 920px;
  margin-inline: auto;
  padding-block: clamp(40px, 8vh, 96px);
}
.case__photograph {
  margin: 0;
  display: grid;
  gap: 12px;
}
.case__photograph img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  aspect-ratio: inherit;
}
.case__photograph-meta {
  font-family: var(--font-stack-sans);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--ink-4);
}
```

- [ ] **Step 4: Type check + build**

Run: `npx tsc --noEmit && npm run build`

Expected: no errors. The `/work/[slug]` route renders without issue (no `photographs` in current data → no embedded plates rendered).

- [ ] **Step 5: Stage and commit**

Run:
```bash
git add src/constants/case-studies.ts src/components/CaseStudy.tsx
git commit -m "feat(case-study): embed photographs as plates between sections

Phase 5 of monograph rollout. CaseStudy gains an optional
photographs array — { src, alt, meta?, aspect? } — that renders
as a sequence of figures between the editorial copy and any
subsequent process/highlights blocks. Caption microtype carries
EXIF / coordinate / source data when present.

No data populated in this commit; the slot is ready for content
when long-exposure photographs are produced."
```

### Task 5.3: Add a placeholder photograph entry for `clouds-at-sea` (optional)

**Files:**
- Modify: `src/constants/case-studies.ts`

This task is optional — only complete if the user confirms a placeholder is wanted before real photography ships. Skip if leaving the slot empty is preferred.

- [ ] **Step 1: Decide whether to add a placeholder**

Ask: does the user want Clouds at Sea to render an empty photograph slot reference (placeholder image), or to leave the section absent until a real long-exposure ships?

If **leave absent**: skip to next chunk. The Phase 5 commit already ships the slot mechanism.

If **add placeholder**: continue.

- [ ] **Step 2: Add a placeholder entry**

In the `clouds-at-sea` block in `case-studies.ts`, add:

```ts
photographs: [
  {
    src: "/images/clouds-at-sea-placeholder.webp",
    alt: "Long-exposure horizon — placeholder",
    meta: "ƒ/8 · 30s · ISO 64 · 40°43′N 73°59′W · pending",
    aspect: "3 / 2",
  },
],
```

This requires `/public/images/clouds-at-sea-placeholder.webp` to exist. If it doesn't, either drop a 1×1 transparent placeholder there or skip this task.

- [ ] **Step 3: Verify**

Run: `npm run build && npm run dev`

Open `http://localhost:3000/work/clouds-at-sea`. Verify the photograph block renders (or the placeholder appears as broken image — that's the slot wiring working, not a regression).

- [ ] **Step 4: Stage and commit**

Run:
```bash
git add src/constants/case-studies.ts
git commit -m "content(clouds-at-sea): placeholder photograph slot

Pending real long-exposure capture per the photograph commitment
in spec §10. Holds the slot honestly rather than rendering an
empty case study; the meta line ('pending') makes the placeholder
status legible."
```

---

## Chunk 6: `!` moment audit + colophon SHA (Phase 6)

Walk every surface; confirm `!` moments. Wire `NEXT_PUBLIC_BUILD_SHA` into the `/studio` colophon.

### Task 6.1: Wire build SHA into `/studio` colophon

**Files:**
- Modify: `src/app/studio/page.tsx`

- [ ] **Step 1: Read current `/studio` page**

Run: `cat src/app/studio/page.tsx | head -80`

Expected: see the studio page composition. Locate the colophon footer (or note where one needs to be added).

- [ ] **Step 2: Add or update the colophon to render the SHA**

In the colophon section, add or update the build line to:

```tsx
<span className="colophon__build tabular">
  Build {process.env.NEXT_PUBLIC_BUILD_SHA?.slice(0, 7) ?? "local"}
</span>
```

If the colophon doesn't yet exist on the studio page, add it as a footer element at the bottom of the main content:

```tsx
<footer className="colophon">
  <span className="colophon__year tabular">© 2026 HKJ</span>
  <span className="colophon__build tabular">
    Build {process.env.NEXT_PUBLIC_BUILD_SHA?.slice(0, 7) ?? "local"}
  </span>
</footer>
```

With CSS:

```css
.colophon {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-top: clamp(24px, 4vh, 48px);
  margin-top: clamp(48px, 8vh, 96px);
  border-top: 1px solid var(--ink-hair);
  font-family: var(--font-stack-sans);
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-3);
}
```

- [ ] **Step 3: Configure the env var on Vercel (manual / user-action note)**

Add a note in the commit message: the user needs to set `NEXT_PUBLIC_BUILD_SHA` in Vercel project settings to `$VERCEL_GIT_COMMIT_SHA` (Vercel supplies this automatically — the user just needs to alias it). Local dev shows `local`.

- [ ] **Step 4: Type check + build**

Run: `npx tsc --noEmit && npm run build`

Expected: no errors. Locally, the colophon renders `Build local`.

- [ ] **Step 5: Stage and commit**

Run:
```bash
git add src/app/studio/page.tsx
git commit -m "feat(colophon): render NEXT_PUBLIC_BUILD_SHA in /studio

Phase 6 of monograph rollout. The studio colophon shows the live
build SHA — the genuinely live piece of typography that
distinguishes the site as a built object (the studio page's '!'
moment per spec §11). Local dev falls back to 'local'.

Vercel: set NEXT_PUBLIC_BUILD_SHA = \$VERCEL_GIT_COMMIT_SHA in
project settings to surface the per-deploy SHA in production."
```

### Task 6.2: Document `!` moments in TASKS.md

**Files:**
- Modify: `TASKS.md`

- [ ] **Step 1: Read the current `!` moments section**

Run: `grep -n -A 50 "\`!\` Moments" TASKS.md | head -60`

- [ ] **Step 2: Update each entry to current state**

Update the section so each surface's `!` matches the spec §11 + the implementation:

```markdown
## `!` Moments — one per page, do not remove casually

Each hand-placed per [monograph-direction spec §11](docs/superpowers/specs/2026-05-02-monograph-direction-design.md).

- `/` — **shipped (Phase 4).** The `ViewToggle` itself. Geist Sans
  11px lowercased `gallery / list`, fixed top-right, persisted via
  `localStorage('hkj.home.view')` + `data-home-view` on `<html>`.
  Discoverable but unannounced.
  ([src/components/ViewToggle.tsx](src/components/ViewToggle.tsx))
- `/work/gyeol` — **shipped.** Eyebrow separator `·` becomes `結`.
  ([src/components/CaseStudy.tsx](src/components/CaseStudy.tsx))
- `/work/clouds-at-sea` — **shipped (coord) / partial (photograph).**
  `.case__coord` reads `40°43′N 73°59′W · horizon dissolve`. Pairing
  long-exposure photograph completes the moment when shot; the page
  does not introduce a second `!`.
  ([src/components/CaseStudy.tsx](src/components/CaseStudy.tsx))
- `/work/pane`, `/work/sift` — **pending content.** Each `!`
  requires substantive prose first; deferred until the case study
  has body.
- `/studio` — **shipped (Phase 6).** Live build SHA in colophon
  via `NEXT_PUBLIC_BUILD_SHA`.
  ([src/app/studio/page.tsx](src/app/studio/page.tsx))
- `/bookmarks` — **shipped.** Butterfly Stool year `1954 –`.
  ([src/constants/shelf.ts](src/constants/shelf.ts))
- `/notes/[slug]` — **shipped.** Running-head keyword reveal.
  ([src/app/notes/[slug]/page.tsx](src/app/notes/[slug]/page.tsx),
  [src/constants/notes.ts](src/constants/notes.ts))
- `/notes` (index) — **no `!` planned.** Index pages are scaffolds.
- Contact cluster (inside `/studio`) — **deferred.** Held honest
  until a specific, non-forced detail is identified.
```

- [ ] **Step 3: Stage and commit**

Run:
```bash
git add TASKS.md
git commit -m "docs(tasks): document ! moments for monograph rollout

Phase 6 close-out. Each surface's '!' is logged in TASKS.md so
future refactors don't silently drop them. ViewToggle is the new
home '!'; build SHA is the new studio '!'. The Clouds at Sea
coord line stays as the only '!' for that page."
```

### Task 6.3: Final smoke verification

- [ ] **Step 1: Run the full suite**

```bash
npm run test && npx tsc --noEmit && npm run lint && npm run build
```

Expected: all green.

- [ ] **Step 2: Start dev server, walk every route**

Run: `npm run dev`

Visit each route in a browser:
- `/` (gallery)
- `/` (toggle to list, reload, confirm persistence)
- `/work/gyeol` (verify `結` in eyebrow)
- `/work/clouds-at-sea` (verify coord line; photographs section absent or placeholder)
- `/work/pane`
- `/work/sift`
- `/studio` (verify colophon shows `Build local`)
- `/bookmarks`
- `/notes`
- `/notes/<a-slug>`

For each, confirm:
- Warm paper ground throughout. No dark register.
- No cinematic entrance. The page loads as itself.
- View transitions on route change crossfade cleanly (300ms).
- No scroll-jacking, no parallax, no idle animation.

- [ ] **Step 3: Stop dev server**

Kill the background process.

- [ ] **Step 4: Final commit (if any leftover)**

If any visual nits surfaced during the walk, fix and commit. Otherwise this chunk is closed.

---

## Done

The monograph direction is shipped:

- Single warm-paper register throughout — Stage retired.
- Home composition: `WorkPlate` × N (gallery) + `WorkList` (list), toggled and persisted via `useHomeView` + `HomeViewInit`.
- Caption rigor: ≥ 4 mandatory metadata fields per plate, plus optional `meta` for EXIF / coordinate.
- View transitions on route change preserve per-slug `work-cover-{slug}` + `work-title-{slug}` morph at 300ms, without blur.
- Case-study pages gain an optional `photographs` slot for embedded long-exposure plates.
- Build SHA goes live on `/studio` colophon.
- `!` moments documented in TASKS.md.

Open content tasks for the user (independent of this plan):
- Confirm or rewrite the four caption descriptions in `pieces.ts`.
- Decide on the photograph commitment timing (4 long-exposures vs. fallback to fewer plates with more prose).
- Replace placeholder asset references with real images when ready.
- Set `NEXT_PUBLIC_BUILD_SHA = $VERCEL_GIT_COMMIT_SHA` on Vercel project settings.

---
