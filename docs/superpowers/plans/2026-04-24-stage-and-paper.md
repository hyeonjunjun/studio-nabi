# Stage & Paper Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the dual-register Stage/Paper system defined in [2026-04-24-stage-and-paper-design.md](../specs/2026-04-24-stage-and-paper-design.md) in five verifiable phases — preserving every Paper behavior while extending the portfolio into a cinematic Stage register, adding data annotations, path-blur motion, a once-per-session cinematic entrance, and one hand-tuned `!` moment per page.

**Architecture:** `html[data-register]` scopes every new CSS rule; existing Paper styling is untouched. A small client `RegisterController` writes the attribute on each route change. Stage-only components layer on top of the existing token system without remapping any Paper token. No new libraries.

**Tech Stack:**
- Next.js 16 App Router (existing, `experimental.viewTransition: true` already set)
- React 19 client components (existing)
- Fragment Mono + Gambetta variable (300–800, already loaded via `next/font/local`)
- View Transitions API (existing wiring, extended)

**Reference spec:** [docs/superpowers/specs/2026-04-24-stage-and-paper-design.md](../specs/2026-04-24-stage-and-paper-design.md)

---

## Decisions locked before planning

| Decision | Choice | Rationale |
|---|---|---|
| Signature dialect | Stage skin works with existing media; long-exposure photographs slot in later as content | Prevents blocking on photo-production; Phase 3 ships without needing new photos |
| `--glow` accent | `#F8F5EC` (warm moonlight) | Spec recommendation; monochrome-warmth discipline |
| Cinematic entrance wordmark | `HKJ` in Gambetta weight 700, centered | Monogram over full name — nendo restraint; matches folio vocabulary |
| Entrance on Paper first-hits | Option 1 (always runs, register crossfade at tail) | Brand move, not register move |
| Entrance budget | 1.1s total | Tightened from 1.4s per spec review; every 100ms is LCP won back |
| Path-blur direction-awareness | Orientation-agnostic blur-arrival (no cursor-direction JS) | Direction-aware cursor-blur is over-engineered for this iteration; simplified form preserves the aesthetic without client math |

---

## File Structure

### Created
- `src/components/RegisterController.tsx` — writes `html[data-register]` on route change
- `src/components/CinematicEntrance.tsx` — once-per-session overlay
- `src/components/EntranceClickGate.tsx` — document-level captured click handler, queues navigation during entrance

### Modified
- `src/app/globals.css` — Stage tokens, register-scoped rules, `--palette-overlay`, view-transition register rules
- `src/app/layout.tsx` — mount RegisterController, CinematicEntrance, EntranceClickGate
- `src/app/page.tsx` — Stage palette swap, path-blur hover on `.cd__name`
- `src/components/GutterStrip.tsx` — halation on strip media (Stage-only)
- `src/components/CaseStudy.tsx` — Stage palette, Gambetta 700 title, data-annotation layer, long-exposure smear, section reveal CSS rewrite
- `src/components/NavCoordinates.tsx` — register-aware colors
- `src/components/Folio.tsx` — register-aware color
- `src/components/CommandPalette.tsx` — `var(--palette-overlay)` replaces hardcoded overlay
- `TASKS.md` — document each `!` moment placed in Phase 5

### Deleted
None. Fully additive plan.

---

## Chunk 1: Phase 1 — Foundation (no visual change)

**Output of this chunk:** Stage tokens exist in `globals.css`, `RegisterController` writes `html[data-register]` on every route change, shared components (Nav, Folio, CommandPalette) are register-aware in their CSS. All routes still render paper — nothing is Stage yet. Zero visible diff.

**Estimated:** ~2 hours across 3 tasks.

---

### Task 1: Add Stage tokens and register-scope rules to globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Append Stage tokens after the existing `:root` block**

Open `src/app/globals.css`. After the existing `:root { … }` block (lines 3–42), append:

```css
/* ─── Stage register tokens ──────────────────────────────────────────────── */
:root {
  --stage:     #0E0D09;
  --stage-2:   #16150F;
  --stage-3:   #24221A;
  --glow:      #F8F5EC;
  --glow-2:    rgba(248, 245, 236, 0.55);
  --glow-hair: rgba(248, 245, 236, 0.10);
  --palette-overlay: rgba(17, 17, 16, 0.18); /* Paper default */
}

html[data-register="stage"] {
  --palette-overlay: rgba(248, 245, 236, 0.12); /* register-aware veil */
}
```

- [ ] **Step 2: Add view-transition register rules**

After the existing `::view-transition-old(root) / new(root)` block near the bottom of `globals.css`, append:

```css
/* Stage register: longer root crossfade for cinematic beat */
html[data-register="stage"] ::view-transition-old(root),
html[data-register="stage"] ::view-transition-new(root) {
  animation-duration: 420ms;
}

/* Cross-register: the register shift IS the transition — 420ms, no blur */
html[data-prev-register]:not([data-prev-register=""]) ::view-transition-old(root),
html[data-prev-register]:not([data-prev-register=""]) ::view-transition-new(root) {
  animation-duration: 420ms;
}
```

- [ ] **Step 3: Verify no paper-token regression**

Run:
```bash
npx tsc --noEmit
```
Expected: exit code 0.

Run the dev server and load `/`, `/about`, `/shelf`. Confirm: everything renders exactly as before. No visible change.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(stage): add stage register tokens and view-transition scoping

- new --stage, --stage-2, --stage-3, --glow, --glow-2, --glow-hair tokens
- --palette-overlay (paper default; stage override via html[data-register])
- view-transition root: 420ms on stage routes and on cross-register nav
- zero visible change — nothing reads these yet

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: RegisterController — write html[data-register] on route change

**Files:**
- Create: `src/components/RegisterController.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create RegisterController**

Create `src/components/RegisterController.tsx`:

```tsx
"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

/**
 * RegisterController — writes the active visual register to the <html>
 * element. Running on the html element (not body or main) means the
 * attribute survives view-transitions intact; body/main re-render during
 * the transition and would otherwise flash the wrong register mid-morph.
 *
 * Also writes the previous register to data-prev-register during a change
 * so cross-register CSS can pick up the transition duration.
 */
const STAGE_ROUTES = [/^\/$/, /^\/work\//];

function registerFor(pathname: string): "stage" | "paper" {
  return STAGE_ROUTES.some((re) => re.test(pathname)) ? "stage" : "paper";
}

export default function RegisterController() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const next = registerFor(pathname ?? "/");
    const html = document.documentElement;
    const prev = html.dataset.register;
    if (prev && prev !== next) {
      html.dataset.prevRegister = prev;
      // clear prev-register after the view-transition resolves
      window.setTimeout(() => {
        if (html.dataset.prevRegister === prev) delete html.dataset.prevRegister;
      }, 600);
    }
    html.dataset.register = next;
  }, [pathname]);

  return null;
}
```

- [ ] **Step 2: Mount in layout.tsx**

Open `src/app/layout.tsx`. Add to imports:

```tsx
import RegisterController from "@/components/RegisterController";
```

Inside `<body>`, mount before `NavCoordinates`:

```tsx
<RegisterController />
<PaperGrain />
<RouteAnnouncer />
<NavCoordinates />
<CommandPalette />
```

- [ ] **Step 3: Type check**

```bash
npx tsc --noEmit
```
Expected: exit code 0.

- [ ] **Step 4: Smoke test**

Start dev server. Load `/`. In DevTools console, inspect `<html>` — should have `data-register="stage"`. Navigate to `/about` — attribute flips to `data-register="paper"` and `data-prev-register="stage"` appears for ~600ms before clearing. Nothing visually changed yet.

- [ ] **Step 5: Commit**

```bash
git add src/components/RegisterController.tsx src/app/layout.tsx
git commit -m "feat(stage): register controller writes html[data-register]

- new RegisterController component, mounted in layout
- useLayoutEffect sets html.dataset.register to 'stage' | 'paper'
  based on pathname (/, /work/* = stage; rest = paper)
- data-prev-register attribute flips on register change, cleared 600ms
  later — allows cross-register view-transition CSS to scope duration
- no visual change yet — CSS scoping lands in subsequent phases

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Make shared components register-aware (Nav, Folio, CommandPalette)

**Files:**
- Modify: `src/components/NavCoordinates.tsx`
- Modify: `src/components/Folio.tsx`
- Modify: `src/components/CommandPalette.tsx`

- [ ] **Step 1: NavCoordinates — register-aware colors**

Open `src/components/NavCoordinates.tsx`. Inside the inline `<style>` block, after the existing `.nav__link.is-active { color: var(--ink); }` rule, append:

```css
html[data-register="stage"] .nav__mark { color: var(--glow); }
html[data-register="stage"] .nav__mark-sep { color: var(--glow-hair); }
html[data-register="stage"] .nav__mark-role { color: var(--glow-2); }
html[data-register="stage"] .nav__link { color: var(--glow-2); }
html[data-register="stage"] .nav__link:hover,
html[data-register="stage"] .nav__link.is-active { color: var(--glow); }
```

- [ ] **Step 2: Folio — register-aware color**

Open `src/components/Folio.tsx`. Inside the `<style>` block, after `.folio { … color: var(--ink-4); … }`, append:

```css
html[data-register="stage"] .folio { color: var(--glow-hair); }
```

(Note: `--glow-hair` not `--glow-2` — the folio is meant to be nearly subliminal microtype. Hairline visibility is correct.)

- [ ] **Step 3: CommandPalette — token-ize the overlay**

Open `src/components/CommandPalette.tsx`. Find:

```css
.palette__overlay {
  position: absolute;
  inset: 0;
  background: rgba(17, 17, 16, 0.18);
  animation: palette-overlay-in 150ms var(--ease) both;
}
```

Replace the `background` line:

```css
  background: var(--palette-overlay);
```

The dialog content itself (`[cmdk-root].palette__root`, inputs, items) stays untouched — it keeps its Paper identity across both registers.

- [ ] **Step 4: Type check**

```bash
npx tsc --noEmit
```
Expected: exit code 0.

- [ ] **Step 5: Smoke test**

Dev server. Open palette on `/` — overlay renders the same (paper tokens still active until Phase 2 lands). Navigate to `/about` — palette overlay identical. Zero visible change on any Paper route.

- [ ] **Step 6: Commit**

```bash
git add src/components/NavCoordinates.tsx src/components/Folio.tsx src/components/CommandPalette.tsx
git commit -m "feat(stage): register-aware colors on nav, folio, palette overlay

- nav link/mark/role colors swap to --glow tiers on stage
- folio uses --glow-hair on stage (nearly subliminal, matches paper intent)
- palette overlay uses var(--palette-overlay) token (paper/stage aware)
- no visual change yet — stage scoping kicks in when routes adopt it

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

**End of Chunk 1.** Foundation complete. Every Paper route still renders pixel-identical. Pause for chunk 1 review before Chunk 2.

---

## Chunk 2: Phase 2 — Home as Stage

**Output of this chunk:** `/` renders on dark stage with luminous typography, the GutterStrip media glows with subtle halation, active-row hover carries a path-blur arrival. Work titles still shared-element morph to case studies with path-blur in transit.

**Estimated:** ~3 hours across 4 tasks.

---

### Task 4: Home page — stage palette swap

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Append Stage overrides to home inline style**

Open `src/app/page.tsx`. Inside the inline `<style>` block, at the very end (before the closing backtick), append:

```css
/* ─── Stage register: home ───────────────────────────────────────── */
html[data-register="stage"] .home { background: var(--stage); color: var(--glow); }

html[data-register="stage"] .cd__link { color: var(--glow-2); opacity: 0.5; }
html[data-register="stage"] .cd__link.is-active { opacity: 1; color: var(--glow); }
html[data-register="stage"] .cd__link:hover { opacity: 1; color: var(--glow); }
html[data-register="stage"] .cd__stage:has(.cd__link:hover) .cd__link:not(:hover) { opacity: 0.5; }

html[data-register="stage"] .cd__num { color: var(--glow-hair); }
html[data-register="stage"] .cd__slash { color: var(--glow-hair); }
html[data-register="stage"] .cd__name { color: var(--glow); }

html[data-register="stage"] .cd__foot { border-top-color: var(--glow-hair); }
html[data-register="stage"] .cd__foot-role { color: var(--glow-2); }
html[data-register="stage"] .cd__loc { color: var(--glow-2); }
html[data-register="stage"] .cd__kbd { color: var(--glow-hair); }

/* Stage mail treatment: swap underline for --glow, not --ink */
html[data-register="stage"] .cd__mail {
  color: var(--glow);
  text-decoration-color: transparent;
}
html[data-register="stage"] .cd__mail:hover { text-decoration-color: var(--glow); }
html[data-register="stage"] .cd__mail[data-copied] { color: var(--glow-2); }
```

Note: opacity goes from `0.3` (Paper) to `0.5` (Stage) because glow-2 at 0.3 opacity disappears against stage ground. Taste call — adjust if too strong in preview.

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```
Expected: exit code 0.

- [ ] **Step 3: Visual verification**

Load `/`. The page should now render with:
- Near-black warm background (#0E0D09)
- Luminous warm-white text
- Dimmed non-active rows at 50% opacity
- Active row + hover at full glow
- Footer border hairline glows faintly
- ⌘K hint nearly invisible (correct — hair tier)

The GutterStrip media still renders as-is (no halation yet — Task 5). The layout is identical to Paper — only colors changed.

Navigate to `/about`. Confirm: instantly switches to paper ground, everything looks as before.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(stage): home page palette swap to stage tokens

- --stage ground, --glow text tiers, --glow-hair hairlines
- non-active cd__link opacity 0.3 → 0.5 on stage (tier visibility)
- cd__mail uses --glow decoration-color instead of --ink
- layout, mechanics, and GutterStrip unchanged

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: GutterStrip — halation on media tiles

**Files:**
- Modify: `src/components/GutterStrip.tsx`

- [ ] **Step 1: Add halation to strip plates on Stage**

Open `src/components/GutterStrip.tsx`. Find the strip's inline `<style>` block. At the end (before closing backtick), append:

```css
/* Stage halation — media plates glow faintly against the stage ground */
html[data-register="stage"] .strip__plate {
  background: var(--stage-2);
  box-shadow:
    0 0 0 1px var(--glow-hair),
    0 32px 80px -40px rgba(248, 245, 236, 0.25),
    0 4px 16px -6px rgba(248, 245, 236, 0.08);
}
html[data-register="stage"] .strip__plate::after {
  /* subtle vignette to lift the edges into the stage */
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse at center,
    transparent 55%,
    rgba(14, 13, 9, 0.4) 100%
  );
}
```

If `.strip__plate` doesn't have `position: relative`, verify — `::after` needs it.

- [ ] **Step 2: Verify the selector exists**

```bash
grep -n "strip__plate" src/components/GutterStrip.tsx
```
Expected: matches on the `<li className="strip__plate …">` elements. If the class name differs, substitute accordingly.

- [ ] **Step 3: Type check + visual**

```bash
npx tsc --noEmit
```

Load `/`. Strip plates should carry a subtle warm glow — dark ground, hairline edge, soft outer glow above. Videos still autoplay as-is; images render normally; the treatment is purely a CSS shell around each tile. Paper routes (navigate to `/shelf`) unaffected.

- [ ] **Step 4: Commit**

```bash
git add src/components/GutterStrip.tsx
git commit -m "feat(stage): halation on GutterStrip plates

- --stage-2 plate background, --glow-hair outline
- dual-layer box-shadow: wide soft glow + near edge lift
- radial vignette via ::after for edge falloff into stage
- stage-only (html[data-register='stage'] scoped)
- mechanics and media unchanged

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Path-blur hover on `.cd__name`

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Append path-blur hover on the active title**

Open `src/app/page.tsx`. In the inline `<style>` block, append:

```css
/* Path-blur arrival on the active title — desktop only, blur capped 2px */
@media (hover: hover) and (pointer: fine) {
  html[data-register="stage"] .cd__link .cd__name {
    transition:
      filter 280ms cubic-bezier(0.22, 1, 0.36, 1),
      transform 280ms cubic-bezier(0.22, 1, 0.36, 1),
      color 280ms var(--ease);
    will-change: auto;
  }
  html[data-register="stage"] .cd__link:hover .cd__name {
    filter: blur(1.2px);
    transform: translateX(2px);
    animation: cd-name-settle 320ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  @keyframes cd-name-settle {
    0%   { filter: blur(1.2px); transform: translateX(2px); }
    100% { filter: blur(0);     transform: translateX(0);   }
  }
}

/* Reduced-motion + reduced-data: no filter, no transform */
@media (prefers-reduced-motion: reduce), (prefers-reduced-data: reduce) {
  html[data-register="stage"] .cd__link:hover .cd__name {
    filter: none;
    transform: none;
    animation: none;
  }
}
```

The effect: hovering the active row's title triggers a ~320ms blur-settle. It's orientation-agnostic (no cursor-direction JS) but still reads as a path-blur arrival — the title "lands into focus."

- [ ] **Step 2: Type check + visual**

```bash
npx tsc --noEmit
```

Load `/`. Hover the active row's title (e.g., "clouds at sea"). Brief (~320ms) blur that resolves cleanly. Touch devices: no blur (gated by `hover: hover`). On `/about`: no effect (gated by stage register).

Simulate `prefers-reduced-motion: reduce`. Confirm: no blur, no transform.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(stage): path-blur arrival on active title hover

- 1.2px blur + 2px translateX settling to 0 over 320ms
- @media (hover: hover) and (pointer: fine) — desktop only
- reduced-motion + reduced-data opt-outs
- preserves the 'path-blur as atmosphere' grammar from the spec

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Stage view-transition blur-in-transit on title morph

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add motion-blur-in-transit to work-title morph on Stage**

Open `src/app/globals.css`. Find the existing `::view-transition-old(work-title) / new(work-title)` block. Append *after* it:

```css
/* Stage view-transitions: blur-in-transit on shared title morph.
   The title softens at midpoint and resolves clean — reads as a
   camera push, not a crossfade. Reduced-motion overrides below. */
@keyframes work-title-blur-out {
  0% { filter: blur(0); }
  50% { filter: blur(2px); }
  100% { filter: blur(0); }
}

html[data-register="stage"] ::view-transition-old(work-title),
html[data-register="stage"] ::view-transition-new(work-title) {
  animation-name: -ua-view-transition-fade-out, work-title-blur-out;
  animation-duration: 480ms, 480ms;
}

@media (prefers-reduced-motion: reduce) {
  html[data-register="stage"] ::view-transition-old(work-title),
  html[data-register="stage"] ::view-transition-new(work-title) {
    animation: none;
  }
}
```

Note: The `-ua-view-transition-fade-out` is the browser default. If the vendor-prefixed name doesn't work in Chromium 130+, drop back to just `work-title-blur-out` alone — the opacity fade is less important than the blur.

- [ ] **Step 2: Visual**

Navigate `/` → click an active work row → `/work/[slug]`. The title morph between positions should carry a brief blur at midpoint that resolves. Paper-internal navigation (`/about` → `/shelf`) unchanged.

Fallback check: if blur-in-transit doesn't fire on your Chromium version, the morph falls back to the pre-existing `cubic-bezier(.22,1,.36,1)` crossfade. Still good.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(stage): blur-in-transit on work-title view-transition

- keyframe blurs 0 → 2px → 0 at midpoint, 480ms
- stage-only; paper-internal unchanged
- reduced-motion: animation: none
- reads as a camera push, not a crossfade

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

**End of Chunk 2.** Home is stage. Review before Chunk 3.

---

## Chunk 3: Phase 3 — Case study as Stage

**Output of this chunk:** `/work/[slug]` renders on stage — Gambetta 700 cinematic title, data-annotation scaffold in the eyebrow, long-exposure smear on hero arrival, section reveal uses lateral drift. Cross-register navigation handled cleanly.

**Estimated:** ~4 hours across 5 tasks.

---

### Task 8: CaseStudy — stage palette swap

**Files:**
- Modify: `src/components/CaseStudy.tsx`

- [ ] **Step 1: Append stage palette overrides**

Open `src/components/CaseStudy.tsx`. In the inline `<style>` block, append at the end:

```css
/* ─── Stage register: case study ─────────────────────────────────── */
html[data-register="stage"] .case { background: var(--stage); color: var(--glow); }
html[data-register="stage"] .case__title { color: var(--glow); }
html[data-register="stage"] .case__sub { color: var(--glow-2); }
html[data-register="stage"] .eyebrow,
html[data-register="stage"] .eyebrow span { color: var(--glow-2); }
html[data-register="stage"] .eyebrow__sep { color: var(--glow-hair); }

html[data-register="stage"] .case__ledger-row { border-bottom-color: var(--glow-hair); }
html[data-register="stage"] .case__ledger-row dt { color: var(--glow-hair); }
html[data-register="stage"] .case__ledger-row dd { color: var(--glow-2); }

html[data-register="stage"] .case__section-label { color: var(--glow); }
html[data-register="stage"] .case__section-head { border-bottom-color: var(--glow); }
html[data-register="stage"] .case__section-count { color: var(--glow-2); }

/* Prose on stage: Gambetta is preserved, color shifts to --glow-2 */
html[data-register="stage"] .case__prose,
html[data-register="stage"] .case__prose--lead,
html[data-register="stage"] .case__prose--step { color: var(--glow-2); }
html[data-register="stage"] .case__prose a { color: var(--glow); }
html[data-register="stage"] .case__prose a:hover { text-decoration-color: var(--glow); }

/* Figures/plates get --glow-hair hairline */
html[data-register="stage"] .case__plate,
html[data-register="stage"] .case__fig {
  background: var(--stage-2);
  border-color: var(--glow-hair);
}
```

- [ ] **Step 2: Verify selectors exist**

```bash
grep -nE "class(Name)?=\"(case__title|case__sub|case__ledger-row|case__section|case__prose|case__plate|case__fig)" src/components/CaseStudy.tsx
```
Expected: matches on the corresponding elements. If any class name differs in your actual component, adjust the CSS selector to match the real class.

- [ ] **Step 3: Type check + visual**

```bash
npx tsc --noEmit
```

Load `/work/gyeol`. The page renders on dark stage:
- Ink-black → warm-dark ground
- Gambetta prose in warm glow-2 (dimmed parchment rather than bleached white — intentional)
- Ledger rows with hairline separators at glow-hair
- Plates/figures slightly lifted off the stage

Navigate back to `/`. Instant register flip. Navigate to `/about`. Paper register, no changes.

- [ ] **Step 4: Commit**

```bash
git add src/components/CaseStudy.tsx
git commit -m "feat(stage): case study palette swap to stage tokens

- --stage ground, --glow title, --glow-2 prose + ledger, --glow-hair
  hairlines + labels
- prose links use --glow decoration-color
- plates and figures lift with --stage-2 bg and --glow-hair border
- paper routes unaffected

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Gambetta 700 on case study hero title

**Files:**
- Modify: `src/components/CaseStudy.tsx`

- [ ] **Step 1: Verify Gambetta axis range**

Confirm `src/app/layout.tsx` loads Gambetta with `weight: "300 800"`. If confirmed, proceed. If the weight prop is narrower, widen it to `"300 800"` before proceeding (Gambetta is already loaded as the variable file, so this just expands the exposed axis).

- [ ] **Step 2: Apply weight 700 to stage title**

In `CaseStudy.tsx`, inside the inline `<style>` block, after the existing `.case__title { … }` rule, append:

```css
html[data-register="stage"] .case__title {
  font-weight: 700;
  letter-spacing: -0.018em;
  /* slightly tighter on dark — high weights need the tracking */
}
```

- [ ] **Step 3: Visual check**

Load `/work/gyeol`. The title now renders in Gambetta at weight 700 — cinematic rather than editorial. Tighter tracking keeps it legible at weight.

- [ ] **Step 4: Commit**

```bash
git add src/components/CaseStudy.tsx
git commit -m "feat(stage): gambetta 700 on case study hero title

- weight 700 + -0.018em letter-spacing for cinematic presentation
- stays inside the 2-face discipline (gambetta variable, 300-800 loaded)
- paper rendering unchanged

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: Data-annotation layer on case study

**Files:**
- Modify: `src/components/CaseStudy.tsx`

- [ ] **Step 1: Add annotation primitives near the eyebrow**

In `CaseStudy.tsx`, locate the existing `<p className="eyebrow">…</p>` above the `<h1>`. Immediately after it (before `<h1>`), add a new annotation row:

```tsx
<p className="case__annot" aria-hidden>
  <span className="case__annot-key">FIELD</span>
  <span className="case__annot-val">{piece.sector.toUpperCase()}</span>
  <span className="case__annot-sep">·</span>
  <span className="case__annot-key">№</span>
  <span className="case__annot-val tabular">
    {String(piece.order).padStart(3, "0")}
  </span>
  <span className="case__annot-sep">·</span>
  <span className="case__annot-key">YR</span>
  <span className="case__annot-val tabular">{piece.year}</span>
</p>
```

- [ ] **Step 2: Style the annotations**

In the same file, in the inline `<style>` block, append:

```css
.case__annot {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
  margin: 0 0 8px;
  font-family: var(--font-stack-mono);
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-4);
}
.case__annot-key { color: var(--ink-4); }
.case__annot-val { color: var(--ink-3); }
.case__annot-sep { color: var(--ink-4); }

html[data-register="stage"] .case__annot-key { color: var(--glow-hair); }
html[data-register="stage"] .case__annot-val { color: var(--glow-2); }
html[data-register="stage"] .case__annot-sep { color: var(--glow-hair); }
```

- [ ] **Step 3: Verify every annotation is real**

Check: `piece.sector`, `piece.order`, `piece.year` are all real fields on the Piece type. They are. No lorem.

- [ ] **Step 4: Type check + visual**

```bash
npx tsc --noEmit
```

Load `/work/gyeol`. Above the title, a new row reads `FIELD MATERIAL SCIENCE · № 002 · YR 2026` in Fragment Mono microtype. On dark, it's glow-hair on glow-2. On paper (shouldn't be visible yet since case study is stage) — it would render as ink-4 on ink-3.

- [ ] **Step 5: Commit**

```bash
git add src/components/CaseStudy.tsx
git commit -m "feat(stage): data-annotation layer above case study title

- FIELD / № / YR annotation row in fragment mono at 9px
- all three values are real piece fields (sector, order, year)
- register-aware color (glow tiers on stage, ink tiers on paper)
- continues the TouchDesigner-workshop data-scaffold vocabulary

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: Long-exposure smear on hero arrival

**Files:**
- Modify: `src/components/CaseStudy.tsx`

- [ ] **Step 1: Append hero-arrival smear CSS**

In `CaseStudy.tsx`, inside the inline `<style>` block, append:

```css
/* Long-exposure smear on hero arrival — stage only, first paint only.
   Uses an on-mount CSS animation; no IntersectionObserver needed since
   the hero is always in view on page load. */
@media (min-width: 768px) {
  html[data-register="stage"] .case__hero,
  html[data-register="stage"] .case__title {
    animation: case-hero-smear 640ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  @keyframes case-hero-smear {
    0%   { filter: blur(2px); transform: translateX(6px); opacity: 0; }
    30%  {                                                  opacity: 0.5; }
    100% { filter: blur(0);   transform: translateX(0);    opacity: 1; }
  }
}

/* Stage title + hero stagger: hero arrives 80ms before title */
html[data-register="stage"] .case__title { animation-delay: 80ms; }

@media (prefers-reduced-motion: reduce), (prefers-reduced-data: reduce) {
  html[data-register="stage"] .case__hero,
  html[data-register="stage"] .case__title {
    animation: none;
    filter: none;
    transform: none;
    opacity: 1;
  }
}
```

Note: the `.case__hero` selector assumes a top-level hero image/video wrapper with that class. If the actual class name differs, adjust. Inspect the existing JSX for the hero element and use its class.

- [ ] **Step 2: Visual**

Load `/work/gyeol`. Page paints: the hero image and title arrive with a brief lateral blur-smear (~640ms) that resolves cleanly. Title stagger is subtle — 80ms behind hero.

Mobile (sub-768px): instant, no smear. Tablet/desktop: full treatment.

- [ ] **Step 3: Commit**

```bash
git add src/components/CaseStudy.tsx
git commit -m "feat(stage): long-exposure smear on case study hero arrival

- 640ms blur (2px → 0) + translateX (6px → 0) + opacity (0 → 1)
- cubic-bezier(.22, 1, .36, 1) — approved ease-out-quart
- title staggered 80ms behind hero
- sub-768px disables the smear (opacity only, implicit via animation skip)
- reduced-motion + reduced-data opt-outs

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 12: Section reveal CSS rewrite — lateral drift alternating by index

**Files:**
- Modify: `src/components/CaseStudy.tsx`

- [ ] **Step 1: Rewrite the reveal CSS**

Open `src/components/CaseStudy.tsx`. Find the existing `.case__section { … opacity: 0; transform: translateY(8px); … }` block (added in taste-polish Task 9). Replace it with:

```css
/* Section reveal on scroll — IntersectionObserver-driven (useSectionReveal).
   Paper: vertical rise (original behavior).
   Stage: lateral drift alternating direction by index — breathing cadence. */
.case__section {
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 280ms var(--ease),
    transform 280ms var(--ease);
}
.case__section[data-revealed] {
  opacity: 1;
  transform: none;
}
.case__section:nth-child(2) { transition-delay: 50ms; }
.case__section:nth-child(3) { transition-delay: 100ms; }
.case__section:nth-child(4) { transition-delay: 150ms; }
.case__section:nth-child(5) { transition-delay: 200ms; }

html[data-register="stage"] .case__section {
  transform: translateX(-4px);
  transition:
    opacity 360ms var(--ease),
    transform 360ms var(--ease);
}
html[data-register="stage"] .case__section:nth-child(2n) {
  transform: translateX(4px);
}
html[data-register="stage"] .case__section[data-revealed] {
  transform: none;
}
html[data-register="stage"] .case__section:nth-child(2) { transition-delay: 60ms; }
html[data-register="stage"] .case__section:nth-child(3) { transition-delay: 120ms; }
html[data-register="stage"] .case__section:nth-child(4) { transition-delay: 180ms; }
html[data-register="stage"] .case__section:nth-child(5) { transition-delay: 240ms; }

@media (prefers-reduced-motion: reduce) {
  .case__section,
  .case__section[data-revealed] {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

- [ ] **Step 2: Visual**

Load `/work/gyeol`. Scroll slowly through the sections. First one drifts in from the left (-4px), second from the right (+4px), third from the left again, alternating. 360ms each, 60ms stagger.

Paper route with sections (none currently, but if the hook were used on Paper, the vertical-rise fallback still holds).

- [ ] **Step 3: Commit**

```bash
git add src/components/CaseStudy.tsx
git commit -m "feat(stage): section reveal uses lateral drift alternating by index

- stage: translateX(-4px) / +4px on even children, 360ms, 60ms stagger
- paper: unchanged (vertical rise 8px, 280ms)
- reduced-motion: sections visible from mount, no transitions
- the useSectionReveal hook itself is unchanged; only the CSS shifted

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

**End of Chunk 3.** Case study is stage. Pause for chunk 3 review.

---

## Chunk 4: Phase 4 — Cinematic entrance

**Output of this chunk:** First hit per session runs a 1.1s overlay over the destination route. Navigation during the entrance is queued until the flag flips. Destination-register crossfade at the tail so Paper deep-links don't flash dark-to-light.

**Estimated:** ~3 hours across 3 tasks.

---

### Task 13: CinematicEntrance — core timing + sessionStorage

**Files:**
- Create: `src/components/CinematicEntrance.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css` (keyframes)

- [ ] **Step 1: Create the component**

Create `src/components/CinematicEntrance.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Phase = "in" | "settling" | "out" | "done";

/**
 * CinematicEntrance — once-per-session overlay that establishes the
 * studio register before the destination route is revealed.
 *
 * Mechanics:
 * - Renders as a transparent-fading overlay above the destination route
 *   (content paints behind, LCP fires on real content, not on the overlay)
 * - sessionStorage gate: 'hkj.entered' = '1' after completion
 * - Sets window.__hkjEntranceComplete = true at the end so the navigation
 *   gate (EntranceClickGate) releases queued clicks
 * - Reduced-motion: skip entirely on first paint
 */
export default function CinematicEntrance() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("done");

  useEffect(() => {
    // Skip on SSR / re-mounts after the flag is already set
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("hkj.entered") === "1") {
      window.__hkjEntranceComplete = true;
      return;
    }

    // Reduced motion: skip entirely
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (rm) {
      sessionStorage.setItem("hkj.entered", "1");
      window.__hkjEntranceComplete = true;
      return;
    }

    // Destination register informs the tail crossfade. Default paper.
    const destIsStage = pathname === "/" || pathname.startsWith("/work/");
    document.documentElement.dataset.entranceDest = destIsStage ? "stage" : "paper";

    setPhase("in");
    const t1 = window.setTimeout(() => setPhase("settling"), 150);
    const t2 = window.setTimeout(() => setPhase("out"), 730);
    const t3 = window.setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem("hkj.entered", "1");
      window.__hkjEntranceComplete = true;
      delete document.documentElement.dataset.entranceDest;
      // dispatch a custom event so the click gate can flush queued nav
      window.dispatchEvent(new CustomEvent("hkj:entranceComplete"));
    }, 1100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // Only run once on mount — pathname is only read to determine dest register
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className="entrance"
      data-phase={phase}
      aria-hidden
      role="presentation"
    >
      <span className="entrance__mark">HKJ</span>
      <style>{`
        .entrance {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: grid;
          place-items: center;
          background: var(--stage);
          pointer-events: none;
          will-change: opacity, background;
          transition:
            background 260ms var(--ease),
            opacity 260ms var(--ease);
        }
        .entrance[data-phase="in"] {
          opacity: 1;
        }
        .entrance[data-phase="settling"] {
          opacity: 1;
        }
        .entrance[data-phase="out"] {
          opacity: 0;
        }
        html[data-entrance-dest="paper"] .entrance[data-phase="out"] {
          background: var(--paper);
        }

        .entrance__mark {
          font-family: var(--font-stack-serif);
          font-weight: 700;
          font-size: clamp(56px, 10vw, 112px);
          letter-spacing: 0.02em;
          color: var(--glow);
          opacity: 0;
          transform: translateY(8px) scale(0.98);
          transition:
            opacity 420ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 420ms cubic-bezier(0.22, 1, 0.36, 1);
          filter: blur(1.5px);
        }
        .entrance[data-phase="settling"] .entrance__mark,
        .entrance[data-phase="out"] .entrance__mark {
          opacity: 1;
          transform: none;
          filter: blur(0);
        }
        .entrance[data-phase="out"] .entrance__mark {
          opacity: 0;
          transform: translateY(-4px) scale(1.02);
          transition-duration: 260ms;
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Add the global type declaration**

Create or append to a shared types file. Simplest path: extend global in `src/components/CinematicEntrance.tsx` at the top, just below `"use client"`:

```tsx
declare global {
  interface Window {
    __hkjEntranceComplete?: boolean;
  }
}
```

- [ ] **Step 3: Mount in layout**

Open `src/app/layout.tsx`. Import:

```tsx
import CinematicEntrance from "@/components/CinematicEntrance";
```

Add inside `<body>`, before `RegisterController`:

```tsx
<CinematicEntrance />
<RegisterController />
```

- [ ] **Step 4: Type check + visual**

```bash
npx tsc --noEmit
```

Clear sessionStorage (DevTools → Application → Session Storage → clear). Load `/`. Expected:
- Dark stage fills viewport at t=0
- HKJ wordmark fades in, slight upward settle, by t=330ms
- Wordmark sustained through t=730ms
- Fades out with slight upward drift by t=1100ms
- Overlay dissolves to transparent; underlying home content visible

Reload `/` without clearing storage: no entrance. Content visible immediately.

Clear storage. Load `/about` directly. Expected: same entrance mechanism, but at t=850–1100ms the background color of the overlay crossfades from `--stage` to `--paper` before going transparent. No dark-to-light flash.

Simulate reduced-motion: load with sessionStorage cleared + `prefers-reduced-motion: reduce`. Entrance skipped.

- [ ] **Step 5: Commit**

```bash
git add src/components/CinematicEntrance.tsx src/app/layout.tsx
git commit -m "feat(entrance): cinematic entrance — 1.1s once-per-session overlay

- fixed-position overlay at z-index 200 over destination route
- 4 phases: in (0-150) → settling (150-730) → out (730-1100) → done
- HKJ wordmark in gambetta 700, --glow, with blur-settle entrance
- sessionStorage.getItem('hkj.entered') gate — skips on subsequent hits
- data-entrance-dest attribute steers tail crossfade to paper vs stage
- window.__hkjEntranceComplete flag + hkj:entranceComplete event for
  downstream click gate
- reduced-motion: skip entirely, set flag immediately

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 14: Verify LCP remains sane with entrance

**Files:**
- None (verification only)

- [ ] **Step 1: Measure LCP on first hit**

Clear sessionStorage. Open DevTools → Performance → record a fresh load of `/`. Look for the LCP marker.

Expected: LCP fires on the home page's real content (a cd__name or the GutterStrip media) — NOT on the HKJ wordmark. The overlay is non-blocking; content paints behind it.

If LCP fires on the entrance instead, the overlay is blocking. Confirm:
- `.entrance` has `pointer-events: none` (it does)
- `.entrance` has no `contain: strict` or `content-visibility` that would delay backdrop paint
- The overlay is semantically above but transparent-to-render — yes, because `background` is opaque but the element is z-indexed over the rendered page rather than replacing it

If LCP still misreports, add `element-timing="none"` to `.entrance__mark` or set `content-visibility: hidden` on the wordmark — the overlay itself should never be counted as the LCP element.

- [ ] **Step 2: Document the measurement**

Append a note to `TASKS.md` under a "Measurements" section:

```md
### LCP with cinematic entrance — measured 2026-04-24
- Cleared sessionStorage, loaded /, DevTools Performance recording
- LCP element: [record the actual element selector]
- LCP time: [record ms]
- Confirmed: LCP does not fire on the entrance overlay
```

- [ ] **Step 3: No commit required unless a fix was needed**

If Step 1 required a mitigation (element-timing or content-visibility), commit the fix with the LCP measurement note.

---

### Task 15: EntranceClickGate — queue navigation during entrance

**Files:**
- Create: `src/components/EntranceClickGate.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create the click gate**

Create `src/components/EntranceClickGate.tsx`:

```tsx
"use client";

import { useEffect } from "react";

/**
 * EntranceClickGate — prevents navigation-firing clicks from arming
 * view-transitions while the cinematic entrance is still running.
 *
 * Attaches a single capturing-phase click handler on document. If the
 * click target is an internal <a> or the CommandPalette's programmatic
 * nav hasn't fired yet, swallow it during the entrance window and
 * dispatch a replay click after the entrance completes.
 */
export default function EntranceClickGate() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let queuedAnchor: HTMLAnchorElement | null = null;

    const onClick = (e: MouseEvent) => {
      if (window.__hkjEntranceComplete) return; // entrance done, pass through

      const target = (e.target as HTMLElement | null)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("mailto")) return;
      if (target.target === "_blank") return;

      // Suppress this click; remember the anchor to replay after entrance
      e.preventDefault();
      e.stopPropagation();
      queuedAnchor = target;
    };

    const onEntranceComplete = () => {
      const a = queuedAnchor;
      if (!a) return;
      queuedAnchor = null;
      // Replay the click after a brief delay so view-transitions have a
      // moment to finish setup from the entrance completion.
      window.setTimeout(() => a.click(), 60);
    };

    document.addEventListener("click", onClick, { capture: true });
    window.addEventListener("hkj:entranceComplete", onEntranceComplete);

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("hkj:entranceComplete", onEntranceComplete);
    };
  }, []);

  return null;
}
```

- [ ] **Step 2: Mount in layout**

Open `src/app/layout.tsx`. Import:

```tsx
import EntranceClickGate from "@/components/EntranceClickGate";
```

Mount before `CinematicEntrance`:

```tsx
<EntranceClickGate />
<CinematicEntrance />
<RegisterController />
```

- [ ] **Step 3: Also guard the CommandPalette nav**

Open `src/components/CommandPalette.tsx`. Find the `go` function:

```tsx
const go = (path: string) => {
  setOpen(false);
  router.push(path);
};
```

Replace with:

```tsx
const go = (path: string) => {
  setOpen(false);
  if (typeof window !== "undefined" && !window.__hkjEntranceComplete) {
    // queue the navigation until the entrance finishes
    const run = () => router.push(path);
    window.addEventListener("hkj:entranceComplete", run, { once: true });
    return;
  }
  router.push(path);
};
```

- [ ] **Step 4: Type check + smoke test**

```bash
npx tsc --noEmit
```

Clear sessionStorage. Load `/`. Immediately (within the 1.1s entrance window) click a work row. Expected: the click is swallowed — no navigation fires during the overlay. At t=1100ms, the entrance completes and the queued navigation fires, with the view-transition playing cleanly into `/work/[slug]`.

Also test: clear storage, load `/`, immediately open the palette with ⌘K and enter a command. Same behavior — navigation waits until entrance completes.

- [ ] **Step 5: Commit**

```bash
git add src/components/EntranceClickGate.tsx src/app/layout.tsx src/components/CommandPalette.tsx
git commit -m "feat(entrance): click gate queues navigation during entrance

- document capturing-phase click handler swallows internal anchor clicks
  while window.__hkjEntranceComplete is false
- queued click replays 60ms after hkj:entranceComplete event
- CommandPalette.go also defers router.push until completion
- external links, target=_blank, mailto: all pass through
- prevents view-transitions firing against a page still mid-reveal

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

**End of Chunk 4.** Cinematic entrance live. Pause for chunk 4 review.

---

## Chunk 5: Phase 5 — `!` moment audit

**Output of this chunk:** Every page has exactly one hand-tuned detail that rewards careful reading. Documented in `TASKS.md` so future refactors don't silently remove them.

**Estimated:** ~2 hours, one task.

---

### Task 16: Walk every page, place one `!` moment

**Files:**
- Modify: various page files
- Modify: `TASKS.md`

For each route, place one specific, hand-tuned detail. The spec's candidates (§10) are suggestions; pick the one that feels right on actually viewing the page. If you substitute a different `!` moment, document the substitution and reason.

- [ ] **Step 1: Home (`/`) — active title baseline nudge**

Open `src/app/page.tsx`. Append to the inline `<style>`:

```css
/* ! moment: the active row's title sits 1px proud of its siblings — a
   baseline nudge invisible systematically but felt on a careful read. */
html[data-register="stage"] .cd__link.is-active .cd__name {
  transform: translateY(-1px);
}
```

- [ ] **Step 2: `/work/gyeol` — Korean character as eyebrow separator**

Open `src/app/work/[slug]/page.tsx` (or wherever the eyebrow dots render for Gyeol). For the Gyeol case specifically, swap the middle `·` in the eyebrow with the character `結`. Conditional on `piece.slug === "gyeol"`.

A clean place: `CaseStudy.tsx` where the eyebrow renders. Use:

```tsx
<span className="eyebrow__sep">{piece.slug === "gyeol" ? "結" : "·"}</span>
```

The character should appear at one — and only one — of the separators, not all of them. Use the second `·` for the swap.

- [ ] **Step 3: `/work/clouds-at-sea` — coordinate annotation**

In `CaseStudy.tsx`, below the eyebrow/annotation row, conditionally render a coordinate line for Clouds at Sea:

```tsx
{piece.slug === "clouds-at-sea" && (
  <p className="case__coord tabular" aria-hidden>
    40°43′N 73°59′W · horizon dissolve
  </p>
)}
```

Style (append to the inline `<style>` block):

```css
.case__coord {
  font-family: var(--font-stack-mono);
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-4);
  margin: 0 0 8px;
}
html[data-register="stage"] .case__coord { color: var(--glow-hair); }
```

- [ ] **Step 4: `/about` — drop cap on one paragraph**

Open `src/app/about/page.tsx`. In the prose, find the paragraph that most warrants emphasis (likely the one describing the treat-AI-as-collaborator principle). Add `className="about__prose-drop"` to that `<p>`.

Append CSS:

```css
.about__prose-drop::first-letter {
  font-family: var(--font-stack-serif);
  font-weight: 500;
  font-size: 1.6em;
  line-height: 1;
  float: left;
  margin-right: 0.08em;
  margin-top: 0.06em;
  color: var(--ink);
}
```

- [ ] **Step 5: `/shelf` — open-ended year on Butterfly Stool**

Open `src/constants/shelf.ts`. Find the Butterfly Stool entry. Change `year: "1954"` to `year: "1954 –"` (with the en-dash and trailing space). The open-ended range reads as "still present."

- [ ] **Step 6: `/colophon` — live build SHA**

Already designed in the colophon spec. Confirm `NEXT_PUBLIC_BUILD_SHA` is wired. If running locally it shows "dev"; on Vercel it auto-populates. If the env var isn't yet set on Vercel, add:

```bash
vercel env add NEXT_PUBLIC_BUILD_SHA
# Value: $VERCEL_GIT_COMMIT_SHA (system env)
```

- [ ] **Step 7: `/notes/[slug]` — running-head keyword**

Update `src/app/notes/[slug]/page.tsx`. The running head currently shows `N-{number} · {title}`. Add one hand-picked keyword from the essay — a load-bearing word — as a third element. For N-001 ("On restraint as the hardest move"), the keyword is *restraint*.

Extend the `Note` interface in `src/constants/notes.ts` to include `runheadKeyword?: string`:

```ts
export interface Note {
  // ...existing fields...
  runheadKeyword?: string;
}
```

On N-001, set `runheadKeyword: "restraint"`.

Update the running head markup:

```tsx
<div className="note__runhead" aria-hidden>
  <span>N-{note.number}</span>
  <span className="note__runhead-dot">·</span>
  <span>{note.title}</span>
  {note.runheadKeyword && (
    <>
      <span className="note__runhead-dot">·</span>
      <span className="note__runhead-kw">{note.runheadKeyword}</span>
    </>
  )}
</div>
```

CSS:

```css
.note__runhead-kw { color: var(--ink); }
```

The keyword reads at full ink while the title and number sit at ink-3. A tiny hierarchy move that signals "this word is the essay's argument."

- [ ] **Step 8: `/contact` — the single hand-vectored tick**

Spec candidate: one hand-drawn tick on the Availability cluster. If you have a hand-drawn SVG, use it. If not, substitute with a subtler `!` — a minor asymmetry in the card's padding (e.g., the top-right corner has 1px more padding than the other three corners), creating a slight, ineffable lean.

Lightweight substitute: add to the contact page's inline CSS:

```css
.card {
  padding: 40px 40px 40px 41px; /* 1px of asymmetry — only you know */
}
```

- [ ] **Step 9: Document each `!` moment in TASKS.md**

Append to `TASKS.md` under a new section:

```md
## `!` Moments — one per page, do not remove casually

Each hand-placed for `!`-moment practice per
[2026-04-24-stage-and-paper-design.md §10](docs/superpowers/specs/2026-04-24-stage-and-paper-design.md).

- `/` — the active row's `.cd__name` carries `translateY(-1px)` on stage. Baseline nudge. Invisible systematically, felt on careful read.
- `/work/gyeol` — second eyebrow separator `·` becomes `結`. Project's namesake character as a grain of punctuation.
- `/work/clouds-at-sea` — adds `.case__coord` with `40°43′N 73°59′W · horizon dissolve`. Real coordinate for horizon locus.
- `/about` — one paragraph receives `::first-letter` drop-cap treatment in Gambetta serif. The argument-paragraph.
- `/shelf` — Butterfly Stool year reads `"1954 –"` (open-ended range). "Still present in my life."
- `/colophon` — Build SHA is live (`NEXT_PUBLIC_BUILD_SHA`). Rare piece of truly live typography.
- `/notes/[slug]` — running head shows a hand-picked keyword from the essay as a third element at full ink.
- `/contact` — card padding carries 1px asymmetry (left +1). Slight lean, only the designer knows.
```

- [ ] **Step 10: Type check + visual audit**

```bash
npx tsc --noEmit
```

Load each route. Find each `!` moment by sight. Adjust placement if any feels overworked or invisible.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat(polish): ! moment audit — one hand-tuned detail per page

- home: active row .cd__name translateY(-1px), stage only
- /work/gyeol: 結 replaces second eyebrow separator
- /work/clouds-at-sea: .case__coord line with real location
- /about: ::first-letter drop-cap on the argument paragraph
- /shelf: butterfly stool year reads '1954 –' (still present)
- /colophon: live NEXT_PUBLIC_BUILD_SHA (env, Vercel)
- /notes/[slug]: runheadKeyword field, rendered at full ink
- /contact: 1px left-side card padding asymmetry
- all documented in TASKS.md §! Moments

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

**End of Chunk 5.** Phase 5 complete. Final verification follows.

---

## Final Verification

Run the full spec verification checklist from [§16 of the design spec](../specs/2026-04-24-stage-and-paper-design.md#verification-criteria). Each should pass.

- [ ] **V1: No tokens added beyond `--stage-*` and `--glow-*`**

```bash
git diff HEAD~20..HEAD -- src/app/globals.css | grep "^+" | grep -E "^\+\s*--[a-z][a-z0-9-]+:" | grep -vE "\-\-(stage|glow|palette-overlay)"
```
Expected: no output (all new tokens are in the approved families).

- [ ] **V2: No easing curves beyond the approved four**

```bash
git diff HEAD~20..HEAD -- src/ | grep "cubic-bezier(" | grep -vE "cubic-bezier\(\.4,0,\.2,1\)|cubic-bezier\(0\.22,1,0\.36,1\)|cubic-bezier\(\.22,1,\.36,1\)|cubic-bezier\(0\.33,0\.12,0\.15,1\)|cubic-bezier\(\.33,\.12,\.15,1\)|cubic-bezier\(0\.41,0\.1,0\.13,1\)"
```
Expected: no output.

- [ ] **V3: No third typeface loaded**

```bash
grep -n "localFont\|next/font" src/app/layout.tsx
```
Expected: exactly two `localFont` calls (fragmentMono, gambetta). No others.

- [ ] **V4: All Paper routes render identical to before Phase 1**

Manual check. Load `/about`, `/shelf`, `/colophon`, `/contact`, `/notes`, `/notes/n-001`. Compare to a baseline screenshot taken before Phase 1.

- [ ] **V5: Every Stage route sets `data-register="stage"`; Paper routes set `paper` or nothing**

Load `/`, `/work/gyeol` — html has `data-register="stage"`. Load `/about`, `/shelf` — html has `data-register="paper"`.

- [ ] **V6: Cinematic entrance runs ≤ 1× per session**

Clear sessionStorage. Load `/`. Entrance runs. Reload. Entrance does not run. Open a new incognito tab. Entrance runs again (new session).

- [ ] **V7: Reduced-motion disables all motion features**

In DevTools: Rendering → `prefers-reduced-motion: reduce`. Clear sessionStorage. Load `/`. No entrance. Hover on work row: no blur. Navigate `/` → `/work/gyeol`: no title smear, no morph. Scroll case study: sections visible from mount.

- [ ] **V8: Core Web Vitals — no regression on LCP/INP for Paper routes**

DevTools → Lighthouse or Performance on a Paper route. Record LCP and INP. Compare to baseline. No regression.

- [ ] **V9: One `!` moment per page, documented in TASKS.md**

```bash
grep -c "^- " TASKS.md | head -1  # rough count of ! moments
```
Expected: count matches the 8 documented moments.

- [ ] **V10: GutterStrip wheel-snap mechanics unchanged**

Load `/`. Wheel through the strip. Same snap cadence, same loop behavior as before.

- [ ] **V11: CommandPalette, Folio, `⌘K` hint, view-transitions preserved**

Press `⌘K` on `/` — palette opens over stage ground with appropriate overlay veil. Navigate to `/about` via palette — entrance skips (session flag set), view-transition runs. Folio visible top-right on every route in register-appropriate color.

- [ ] **V12: Cross-register navigation works without flash**

Clear sessionStorage, load `/`. Wait for entrance. Navigate `/` → `/about`. Watch the crossfade — no sudden dark-to-light strobe; the transition is 420ms with no shared-element morph.

- [ ] **V13: Click gate queues navigation during entrance**

Clear sessionStorage. Load `/`. Immediately (within ~500ms) click a work row. Navigation is deferred until entrance completes, then fires with view-transition.

- [ ] **V14: Commit history clean**

```bash
git log --oneline a456d38..HEAD | wc -l
```
Expected: 14–18 commits across the five chunks.

---

## Post-implementation TODO (out of scope for this plan)

- Actual long-exposure photographs for case study heroes (content task, per spec §7 contingency).
- Optional: a "signal" color as a secondary accent if the monochrome discipline begins to feel limiting after 6+ months (revisit).
- Optional: an arrival for the CommandPalette dialog itself that matches the cinematic register (currently uses its existing 150ms palette-in keyframe).
- Optional: a `/case-studies-deep` or `/process` route if any case study's write-up grows beyond what the current template holds.
