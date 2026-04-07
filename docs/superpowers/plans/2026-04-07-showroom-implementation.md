# The Showroom — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the portfolio from poster-composition layout into a minimalist editorial showroom — 3D object as hero (65% viewport), text as precise annotation (30% viewport), studio lighting, microtypographic precision.

**Architecture:** Restyle existing view components to the 30/65 split showroom layout. Update 3D scene with studio lighting, contact shadows, and refined camera. Update store with detail panel tabs. Remove particle system. All typography follows the 8-token type system exactly.

**Tech Stack:** Next.js App Router, Tailwind CSS, Framer Motion, React Three Fiber, @react-three/drei (ContactShadows), Zustand

**Spec:** `docs/superpowers/specs/2026-04-07-showroom-redesign.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/store/useTheaterStore.ts` | Modify | Add `activeDetailPanel` + setter |
| `src/app/globals.css` | Modify | Remove particle CSS, add `.text-column` utility |
| `src/app/layout.tsx` | Modify | Remove ParticleCanvas import |
| `src/components/ParticleCanvas.tsx` | Delete | No particles in showroom |
| `src/components/TopBar.tsx` | Rewrite | Spec typography tokens, 52px height |
| `src/components/BottomBar.tsx` | Rewrite | Spec typography tokens, 40px height |
| `src/components/TheaterStage.tsx` | Rewrite | 30/65 grid split, consistent across all tabs |
| `src/components/CDCase.tsx` | Modify | 0.12 thickness, slower rotation, heavier tilt |
| `src/components/Scene3D.tsx` | Modify | 3-point lighting, ContactShadows, camera [0,0,5] fov 40 |
| `src/components/views/IndexView.tsx` | Rewrite | Text-column selector + metadata grid |
| `src/components/views/ArchiveView.tsx` | Rewrite | Same structure as Index, experiments |
| `src/components/views/AboutView.tsx` | Rewrite | Structured bio with stats/experience |
| `src/components/views/DetailView.tsx` | Rewrite | Panel tabs (overview/process/engineering) |
| `src/components/Cursor.tsx` | Modify | 5px dot, 0.4 opacity refinements |
| `src/components/Preloader.tsx` | Modify | 64px progress line |

---

## Chunk 1: Foundation — Store, CSS, Layout, Remove Particles

### Task 1: Update store + remove particles + update layout

**Files:**
- Modify: `src/store/useTheaterStore.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Delete: `src/components/ParticleCanvas.tsx`

- [ ] **Step 1: Add `activeDetailPanel` to store**

Add to the `TheaterState` interface:
```ts
activeDetailPanel: "overview" | "process" | "engineering";
setActiveDetailPanel: (panel: "overview" | "process" | "engineering") => void;
```

Add to the store initializer:
```ts
activeDetailPanel: "overview",
setActiveDetailPanel: (panel) => set({ activeDetailPanel: panel }),
```

Also update `collapseDetail` to reset the panel:
```ts
collapseDetail: () => set({ isDetailExpanded: false, activeDetailPanel: "overview" }),
```

- [ ] **Step 2: Remove particle CSS from globals.css**

Remove the `.particle-canvas` rule. Keep everything else.

- [ ] **Step 3: Remove ParticleCanvas from layout.tsx**

Remove the `import ParticleCanvas` line and the `<ParticleCanvas ... />` element from the body.

- [ ] **Step 4: Delete ParticleCanvas.tsx**

```bash
rm src/components/ParticleCanvas.tsx
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add detail panel tabs to store, remove particle system"
```

---

## Chunk 2: 3D Scene — Studio Lighting, Contact Shadows, Camera

### Task 2: Update CDCase geometry and behavior

**Files:**
- Modify: `src/components/CDCase.tsx`

- [ ] **Step 1: Update geometry and behavior constants**

Change these values in CDCase.tsx:
- Box geometry: `args={[2, 2, 0.12]}` (was 0.15)
- `IDLE_SPEED`: `0.08` (was 0.1)
- `MAX_TILT`: `0.1` (was 0.14)
- `LERP_FACTOR`: `0.04` (was 0.05)
- Hover scale target: `1.03` (was 1.05)
- In `useCDCaseRotation`, change drag velocity decay from `0.95` to `0.93`

These are all constant changes — no structural code changes needed.

- [ ] **Step 2: Commit**

```bash
git add src/components/CDCase.tsx && git commit -m "refine: CDCase thinner geometry, heavier tilt, slower rotation"
```

### Task 3: Update Scene3D — studio lighting + contact shadows + camera

**Files:**
- Modify: `src/components/Scene3D.tsx`

- [ ] **Step 1: Rewrite Scene3D.tsx**

The key changes:
- Camera: `position={[0, 0, 5]}`, `fov={40}` (was [0,0,4.5], fov 45)
- Add `dpr={[1, 2]}` to Canvas
- Replace the two directional lights with the 3-point setup from spec:
  - Key: `position={[3, 4, 5]}`, intensity 0.8, color "#f0eee8"
  - Fill: `position={[-3, 0, 3]}`, intensity 0.25, color "#e0ddd5"
  - Rim: `position={[0, -2, -4]}`, intensity 0.15, color "#ffffff"
  - Ambient: intensity 0.1
- Add `ContactShadows` from drei below the object:
  ```tsx
  <ContactShadows
    position={[0, -1.1, 0]}
    opacity={0.3}
    blur={2}
    far={4}
    color="#000000"
  />
  ```
- Keep the DragController and CDCase as-is

Full rewrite:

```tsx
"use client";

import { Suspense, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { motion } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";
import { PIECES } from "@/constants/pieces";
import CDCase from "./CDCase";
import * as THREE from "three";

function DragController({
  dragRef,
}: {
  dragRef: React.MutableRefObject<{
    isDragging: boolean;
    velocityX: number;
    velocityY: number;
  }>;
}) {
  const lastPointer = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  return (
    <mesh
      visible={false}
      onPointerDown={(e) => {
        const ne = (e as any).nativeEvent as PointerEvent;
        if (!ne) return;
        dragRef.current.isDragging = true;
        lastPointer.current = { x: ne.clientX, y: ne.clientY };
        dragRef.current.velocityX = 0;
        dragRef.current.velocityY = 0;
      }}
      onPointerUp={() => { dragRef.current.isDragging = false; }}
      onPointerLeave={() => { dragRef.current.isDragging = false; }}
      onPointerMove={(e) => {
        if (!dragRef.current.isDragging) return;
        const ne = (e as any).nativeEvent as PointerEvent;
        if (!ne) return;
        const dx = (ne.clientX - lastPointer.current.x) / size.width;
        const dy = (ne.clientY - lastPointer.current.y) / size.height;
        dragRef.current.velocityX = dx * 4;
        dragRef.current.velocityY = dy * 4;
        lastPointer.current = { x: ne.clientX, y: ne.clientY };
      }}
    >
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

export default function Scene3D() {
  const selectedSlug = useTheaterStore((s) => s.selectedSlug);
  const piece = PIECES.find((p) => p.slug === selectedSlug);
  const textureUrl = piece?.coverArt ?? piece?.image;
  const coverColor = piece?.cover.bg ?? "#1a1a1a";

  const dragRef = useRef({
    isDragging: false,
    velocityX: 0,
    velocityY: 0,
  });

  return (
    <motion.div
      layoutId="scene3d"
      className="w-full h-full"
      transition={{ type: "spring" as const, stiffness: 200, damping: 28 }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        style={{ background: "transparent", cursor: "grab" }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        frameloop="always"
      >
        {/* Studio lighting — 3-point */}
        <ambientLight intensity={0.1} />
        <directionalLight position={[3, 4, 5]} intensity={0.8} color="#f0eee8" />
        <directionalLight position={[-3, 0, 3]} intensity={0.25} color="#e0ddd5" />
        <directionalLight position={[0, -2, -4]} intensity={0.15} color="#ffffff" />

        {/* Contact shadow */}
        <ContactShadows
          position={[0, -1.1, 0]}
          opacity={0.3}
          blur={2}
          far={4}
          color="#000000"
        />

        <DragController dragRef={dragRef} />

        <Suspense fallback={null}>
          <CDCase
            key={selectedSlug}
            textureUrl={textureUrl}
            coverColor={coverColor}
            dragRef={dragRef}
          />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Scene3D.tsx && git commit -m "feat: 3-point studio lighting, contact shadows, telephoto camera"
```

---

## Chunk 3: Chrome — TopBar, BottomBar, TheaterStage

### Task 4: Rewrite TopBar to spec

**Files:**
- Rewrite: `src/components/TopBar.tsx`

Must match spec exactly:
- Height: 52px
- Left: "HKJ" in Gambetta 20px weight 500 tracking -0.01em (`mark` token). In detail: "← BACK" in Fragment Mono 10px uppercase tracking 0.08em (`label` token), `--fg-2` color.
- Right: tabs in Fragment Mono 10px uppercase tracking 0.08em (`label` token). Active: `--fg`, inactive: `--fg-3`. Sliding 1px underline via `layoutId`. In detail: project title in Fragment Mono 9px uppercase tracking 0.06em (`meta` token), `--fg-3`.
- Bottom border: 1px `--fg-4`.

- [ ] **Step 1: Write TopBar.tsx matching spec typography tokens exactly**

Every font-size, letter-spacing, font-weight, and color must match the type system table. No approximations.

- [ ] **Step 2: Commit**

```bash
git add src/components/TopBar.tsx && git commit -m "style: TopBar with exact spec typography tokens"
```

### Task 5: Rewrite BottomBar to spec

**Files:**
- Rewrite: `src/components/BottomBar.tsx`

- Height: 40px
- Left: contextual text in Fragment Mono 9px uppercase tracking 0.06em (`meta` token), `--fg-3`
- Right: "v1.0" in same `meta` style
- Top border: 1px `--fg-4`

- [ ] **Step 1: Write BottomBar.tsx**
- [ ] **Step 2: Commit**

```bash
git add src/components/BottomBar.tsx && git commit -m "style: BottomBar with exact spec typography tokens"
```

### Task 6: Rewrite TheaterStage — 30/65 split

**Files:**
- Rewrite: `src/components/TheaterStage.tsx`

The stage must use a consistent 30/65 split for ALL tabs (no more full-viewport Index mode). Layout:

```
TopBar (52px)
├── Text column: left 0, width 35%, paddingLeft clamp(32px,6vw,80px), paddingRight 24px
│   Vertically centered content, max-width 320px
└── 3D canvas: right 0, width 65%
BottomBar (40px)
```

The text column area has `z-index: 10` (above canvas at `z-index: 5`). The canvas has no left padding — it starts from its left edge and the object is centered within it.

Content switching: `AnimatePresence mode="wait"` wrapping the active view based on `isDetailExpanded` and `activeTab`.

Import `useURLSync` hook and call it.

For the About tab, the 3D object should scale down. Pass a `scale` prop or use a CSS transform on the canvas wrapper. Simplest: in the 3D zone div, add `style={{ transform: activeTab === "about" ? "scale(0.7)" : "scale(1)", transition: "transform 0.5s ease" }}`.

- [ ] **Step 1: Write TheaterStage.tsx**
- [ ] **Step 2: Commit**

```bash
git add src/components/TheaterStage.tsx && git commit -m "feat: showroom 30/65 split layout for all tabs"
```

---

## Chunk 4: Views — Index, Archive, About, Detail

### Task 7: Rewrite IndexView — text-column selector + metadata grid

**Files:**
- Rewrite: `src/components/views/IndexView.tsx`

Must follow the spec screen layout EXACTLY. Reference Section 7.1 of the spec.

Key requirements:
- `motion.div` with enter/exit fade (300ms)
- "PROJECTS" label: Fragment Mono 10px uppercase tracking 0.08em, `--fg-3`, mb 24px
- Selector: each row is a button with number (Fragment Mono 9px tabular-nums, width 24px, `--fg-3` or `--fg-2`) + title (Switzer 13px, weight 400 or 500 for active, `--fg` or `--fg-3`). No borders between items — just gap 2px and padding 8px 0.
- Divider: 1px `--fg-4`, mt 24px mb 24px
- Metadata grid: CSS grid `grid-template-columns: 64px 1fr`, gap `8px 16px`. Keys in Fragment Mono 9px uppercase tracking 0.06em `--fg-3`. Values in same font `--fg-2`. Fields: N, TITLE, YEAR, TYPE, STATUS.
- Description: Switzer 13px, `--fg-2`, max-width 280px, mt 16px
- CTA: Fragment Mono 10px uppercase tracking 0.08em, `--fg`, mt 24px. "VIEW PROJECT →"

The selected project's metadata and description animate via `AnimatePresence mode="wait"` keyed on `selected.slug`.

- [ ] **Step 1: Write IndexView.tsx with exact spec tokens**
- [ ] **Step 2: Commit**

```bash
git add src/components/views/IndexView.tsx && git commit -m "feat: IndexView showroom text-column with metadata grid"
```

### Task 8: Rewrite ArchiveView

**Files:**
- Rewrite: `src/components/views/ArchiveView.tsx`

Identical structure to IndexView but:
- Label: "ARCHIVE"
- Filters `PIECES` for `type === "experiment"`
- CTA: "VIEW DETAILS →"
- On mount: if `selectedSlug` is not an experiment, set it to the first experiment via `useEffect`

- [ ] **Step 1: Write ArchiveView.tsx**
- [ ] **Step 2: Commit**

```bash
git add src/components/views/ArchiveView.tsx && git commit -m "feat: ArchiveView showroom layout matching Index"
```

### Task 9: Rewrite AboutView

**Files:**
- Rewrite: `src/components/views/AboutView.tsx`

Must follow spec Section 7.3 EXACTLY:
- "PROFILE" label: `label` token, `--fg-3`, mb 16px
- Lead paragraph: Gambetta 26px weight 500 tracking -0.02em line-height 1.2, `--fg`, max-width 320px
- Body: Switzer 13px, `--fg-2`, max-width 280px, mt 16px
- Divider (mt 24px, mb 24px)
- Stats grid: same format as Index metadata (64px / 1fr, meta token)
- Divider
- Experience: Fragment Mono 9px dates (tabular-nums, width 80px, `--fg-3`) + Switzer 11px roles (`--fg`) + Switzer 11px desc (`--fg-3`)
- Divider
- Email: Switzer 11px, `--fg-2`
- Socials: Fragment Mono 8px uppercase tracking 0.06em, `--fg-3`, gap 12px

- [ ] **Step 1: Write AboutView.tsx**
- [ ] **Step 2: Commit**

```bash
git add src/components/views/AboutView.tsx && git commit -m "feat: AboutView showroom layout with structured stats"
```

### Task 10: Rewrite DetailView — panel tabs

**Files:**
- Rewrite: `src/components/views/DetailView.tsx`

Must follow spec Section 7.4:
- Project label: `meta` token, `--fg-3`, mb 16px. Format: "01 — PROJECT"
- Title: Gambetta 26px weight 500 tracking -0.02em, `--fg`
- Divider (mt 16px, mb 16px)
- Panel tabs: three buttons (OVERVIEW / PROCESS / ENGINEERING) in `label` token. Active: `--fg`, inactive: `--fg-3`. Sliding 1px underline via `layoutId="detail-panel-indicator"`. Read `activeDetailPanel` and `setActiveDetailPanel` from store.
- Divider (mt 16px, mb 16px)
- Panel content area: scrollable (`overflow-y: auto`, `scrollbar-width: none`) within the text column bounds.

Panel content:
- **OVERVIEW**: description (body 13px `--fg-2`), divider, tags (micro 8px with 1px `--fg-4` border), year + status (meta)
- **PROCESS**: if `caseStudy.process` exists — subheading (Gambetta 18px weight 400 tracking -0.01em) + body copy. Otherwise "No process documented." in body-sm `--fg-3`.
- **ENGINEERING**: if `caseStudy.engineering` exists — subheading + body copy + signal badges (micro with border). Otherwise same fallback.

Import `CASE_STUDIES` from `@/constants/case-studies`. Look up by `piece.slug`.

- [ ] **Step 1: Write DetailView.tsx**
- [ ] **Step 2: Commit**

```bash
git add src/components/views/DetailView.tsx && git commit -m "feat: DetailView with panel tabs (overview/process/engineering)"
```

---

## Chunk 5: Refinements — Cursor, Preloader, Build Verification

### Task 11: Refine Cursor

**Files:**
- Modify: `src/components/Cursor.tsx`

Changes from current:
- Dot base size: 5px (was 6px)
- Dot opacity: 0.4 (was 0.5)
- Dot idle opacity: 0.1 (was 0.15)
- Hz text opacity: 0.15 (was 0.2)
- Hz idle opacity: 0.05 (was 0.08)
- Hz text positioned 12px right (was 14px via gap)

These are numeric constant changes only.

- [ ] **Step 1: Update constants in Cursor.tsx**
- [ ] **Step 2: Commit**

```bash
git add src/components/Cursor.tsx && git commit -m "refine: cursor dot 5px, reduced opacity values"
```

### Task 12: Refine Preloader

**Files:**
- Modify: `src/components/Preloader.tsx`

Changes:
- Progress line width: 64px (was 80px)

Single constant change.

- [ ] **Step 1: Update width in Preloader.tsx**
- [ ] **Step 2: Commit**

```bash
git add src/components/Preloader.tsx && git commit -m "refine: preloader progress line 64px"
```

### Task 13: Build verification

- [ ] **Step 1: Run build**

```bash
npx next build
```

Fix ALL type errors until clean.

- [ ] **Step 2: Commit any fixes**

```bash
git add -A && git commit -m "fix: resolve build errors for showroom implementation"
```

---

## Implementer Notes

1. **Typography is the spec.** Every text element MUST use exact values from the type system table (Section 3 of spec). If a component has `fontSize: 14` and the spec says `body` is `13px`, change it to 13. No rounding, no approximations.

2. **Spacing is the spec.** Use the 8px-based spacing tokens. If the spec says `mb 24px`, it means `marginBottom: 24`. Not 20, not 28.

3. **Colors use CSS variables only.** Never hardcode colors. Always `var(--fg)`, `var(--fg-2)`, `var(--fg-3)`, `var(--fg-4)`.

4. **Font classes:** `font-display` = Gambetta, `font-body` = Switzer, `font-mono` = Fragment Mono. These are set via CSS variables in globals.css and Tailwind config.

5. **The 3D canvas has NO containers or frames.** It fills its zone edge-to-edge. The object floats in dark space. No backgrounds, no borders, no panels around it.

6. **ContactShadows import:** `import { ContactShadows } from "@react-three/drei"`. This is already installed.

## Deferred

- Mobile responsive layout (spec Section 12)
- Keyboard navigation (spec Section 13)  
- WebGL error boundary
- `prefers-reduced-motion` for 3D scene
