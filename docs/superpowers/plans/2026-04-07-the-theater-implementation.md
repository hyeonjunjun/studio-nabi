# The Theater — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild HKJ Studio as a cinematic single-viewport portfolio with FLIP animations, a 3D CD case object, editorial metadata, frequency cursor, and a preloader — all driven by a Zustand store with no page navigations.

**Architecture:** One persistent viewport renders all states (Index, Archive, About, Detail). A Zustand store drives which content is visible. Framer Motion `layoutId` powers all FLIP transitions. React Three Fiber renders a persistent 3D canvas. URLs update via `history.pushState` without triggering Next.js route changes.

**Tech Stack:** Next.js App Router, Tailwind CSS, Framer Motion, React Three Fiber, @react-three/drei, Zustand, Canvas API (particles)

**Spec:** `docs/superpowers/specs/2026-04-07-the-theater-redesign.md`

---

## Chunk 1: Foundation — Cleanup, Dependencies, Store, Layout

### Task 1: Install dependencies and clean up old files

**Files:**
- Delete: `src/components/TransitionProvider.tsx`, `src/components/GameLink.tsx`, `src/components/Nav.tsx`, `src/components/SmoothScroll.tsx`, `src/components/GeometricFrame.tsx`, `src/components/HeroSection.tsx`, `src/components/ProjectSection.tsx`, `src/components/DetailView.tsx`, `src/components/DetailContent.tsx`, `src/components/Footer.tsx`
- Delete: `src/app/index/page.tsx`, `src/app/archive/page.tsx`, `src/app/about/page.tsx`
- Keep: `src/app/index/[slug]/page.tsx`, `src/app/archive/[slug]/page.tsx` (will be rewritten later as SSR fallbacks)

- [ ] **Step 1: Install R3F dependencies**

```bash
npm install @react-three/fiber @react-three/drei
```

- [ ] **Step 2: Delete old components**

```bash
rm src/components/TransitionProvider.tsx src/components/GameLink.tsx src/components/Nav.tsx src/components/SmoothScroll.tsx src/components/GeometricFrame.tsx src/components/HeroSection.tsx src/components/ProjectSection.tsx src/components/DetailView.tsx src/components/DetailContent.tsx src/components/Footer.tsx
rm src/app/index/page.tsx src/app/archive/page.tsx src/app/about/page.tsx
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "chore: install R3F, remove old components for Theater rebuild"
```

### Task 2: Add `coverArt` field to pieces data model

**Files:**
- Modify: `src/constants/pieces.ts`

- [ ] **Step 1: Add optional `coverArt` field to `Piece` interface**

Add `coverArt?: string;` to the Piece interface after `video`. This is a dedicated texture URL for the 3D object, distinct from the hero `image`.

For now, no pieces have a `coverArt` value — the 3D scene will fall back to `image`, then to `cover.bg`.

- [ ] **Step 2: Commit**

```bash
git add src/constants/pieces.ts && git commit -m "feat: add coverArt field to Piece data model"
```

### Task 3: Create Zustand store

**Files:**
- Create: `src/store/useTheaterStore.ts`

- [ ] **Step 1: Write the store**

```ts
import { create } from "zustand";
import { PIECES } from "@/constants/pieces";

type Tab = "index" | "archive" | "about";

interface TheaterState {
  // Preloader
  preloaderDone: boolean;
  setPreloaderDone: () => void;

  // Tabs
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;

  // Project selection
  selectedSlug: string;
  setSelectedSlug: (slug: string) => void;

  // Detail expansion
  isDetailExpanded: boolean;
  expandDetail: () => void;
  collapseDetail: () => void;
}

const firstProject = PIECES.filter((p) => p.type === "project").sort((a, b) => a.order - b.order)[0];

export const useTheaterStore = create<TheaterState>((set) => ({
  preloaderDone: false,
  setPreloaderDone: () => set({ preloaderDone: true }),

  activeTab: "index",
  setActiveTab: (tab) => set({ activeTab: tab, isDetailExpanded: false }),

  selectedSlug: firstProject?.slug ?? "",
  setSelectedSlug: (slug) => set({ selectedSlug: slug }),

  isDetailExpanded: false,
  expandDetail: () => set({ isDetailExpanded: true }),
  collapseDetail: () => set({ isDetailExpanded: false }),
}));
```

- [ ] **Step 2: Commit**

```bash
git add src/store/useTheaterStore.ts && git commit -m "feat: Zustand store for Theater state management"
```

### Task 4: Rebuild globals.css — strip to essentials

**Files:**
- Rewrite: `src/app/globals.css`

Remove all `ui-panel`, `game-screen`, `scrollable-screen`, `geo-frame-wrap`, `foot` styles. Keep only: Tailwind import, color tokens (simplified — no accent colors), resets, body (overflow hidden, 100dvh), skip-to-content, particle canvas, cursor overlay, native cursor hiding, reduced motion.

- [ ] **Step 1: Rewrite globals.css**

```css
@import "tailwindcss";

/* ═══ COLOR SYSTEM — Pure Monochrome ═══ */

:root {
  --bg: #0a0a0b;
  --fg: rgba(240, 238, 232, 0.88);
  --fg-2: rgba(240, 238, 232, 0.50);
  --fg-3: rgba(240, 238, 232, 0.20);
  --fg-4: rgba(240, 238, 232, 0.08);

  --font-body: var(--font-sans), system-ui, sans-serif;
  --font-mono: var(--font-fragment), "SF Mono", monospace;
  --font-display: var(--font-serif), Georgia, serif;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
}

/* ═══ RESETS ═══ */

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-text-size-adjust: 100%; }
*::-webkit-scrollbar { display: none; }
* { scrollbar-width: none; }

body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
  height: 100dvh;
}

::selection { background: var(--fg-4); }
:focus-visible { outline: 1px solid var(--fg-3); outline-offset: 3px; }
a { color: inherit; text-decoration: none; }

/* ═══ SKIP TO CONTENT ═══ */

.skip-to-content {
  position: absolute; top: -100px; left: 24px;
  z-index: 999; padding: 8px 16px;
  background: var(--fg); color: var(--bg);
  font: 500 10px/1 var(--font-mono);
  letter-spacing: 0.04em;
  text-decoration: none;
  transition: top 0.3s var(--ease);
}
.skip-to-content:focus { top: 8px; }

/* ═══ PARTICLE CANVAS ═══ */

.particle-canvas {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

/* ═══ CURSOR ═══ */

.cursor-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  pointer-events: none;
}

@media (hover: hover) and (pointer: fine) {
  html { cursor: none; }
  a, button, [role="button"] { cursor: none; }
}

/* ═══ REDUCED MOTION ═══ */

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    animation-delay: 0ms !important;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css && git commit -m "style: strip globals.css to pure monochrome essentials"
```

### Task 5: Rebuild layout.tsx — minimal shell

**Files:**
- Rewrite: `src/app/layout.tsx`

The layout now only provides: fonts, metadata, RouteAnnouncer, ParticleCanvas (simplified), Cursor, skip-to-content. No Nav, no SmoothScroll, no TransitionProvider. The main `page.tsx` renders the entire Theater.

- [ ] **Step 1: Update layout.tsx**

Keep the existing font declarations and metadata. Remove all old imports (SmoothScroll, Nav, etc). Import only RouteAnnouncer, ParticleCanvas, and the new Cursor (will be created in Task 8). For now, comment out Cursor import until it's built.

```tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { DM_Serif_Display } from "next/font/google";
import "./globals.css";
import RouteAnnouncer from "@/components/RouteAnnouncer";
import ParticleCanvas from "@/components/ParticleCanvas";

// Font declarations stay the same...
// Metadata stays the same...

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{if(localStorage.getItem("theme")==="light"){document.documentElement.classList.add("light")}}catch(e){}})()`,
        }} />
      </head>
      <body className={`${generalSans.variable} ${fragmentMono.variable} ${dmSerif.variable}`}>
        <RouteAnnouncer />
        <ParticleCanvas density="normal" cursorResponsive />
        <a href="#main" className="skip-to-content">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/layout.tsx && git commit -m "feat: minimal layout shell for Theater architecture"
```

---

## Chunk 2: Core Components — Cursor, Preloader, 3D Scene

### Task 6: Rebuild Cursor as Frequency Cursor

**Files:**
- Rewrite: `src/components/Cursor.tsx`
- Rewrite: `src/hooks/useCursorState.ts`

- [ ] **Step 1: Rewrite useCursorState.ts**

Simplified hook. Tracks velocity and context (what's under the cursor). Returns `{ velocity, label, isIdle, isTouch }`.

```ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useCursorState() {
  const [isTouch, setIsTouch] = useState(true);
  const [velocity, setVelocity] = useState(0);
  const [label, setLabel] = useState<string | null>(null);
  const [isIdle, setIsIdle] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const idleTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (isTouch) return;

    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      setVelocity(Math.sqrt(dx * dx + dy * dy));
      lastPos.current = { x: e.clientX, y: e.clientY };

      setIsIdle(false);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setIsIdle(true), 2000);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const labelEl = target.closest("[data-cursor-label]");
      if (labelEl) {
        setLabel(labelEl.getAttribute("data-cursor-label"));
      } else if (target.closest("a") || target.closest("button")) {
        setLabel("Select");
      } else {
        setLabel(null);
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [isTouch]);

  return { velocity, label, isIdle, isTouch };
}
```

- [ ] **Step 2: Rewrite Cursor.tsx**

```tsx
"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCursorState } from "@/hooks/useCursorState";

const SPRING = { stiffness: 500, damping: 35, mass: 0.3 };

export default function Cursor() {
  const { velocity, label, isIdle, isTouch } = useCursorState();
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springX = useSpring(mouseX, SPRING);
  const springY = useSpring(mouseY, SPRING);
  const smoothHz = useSpring(0, { stiffness: 100, damping: 20 });

  useEffect(() => {
    smoothHz.set(Math.min(120, velocity * 0.8));
  }, [velocity, smoothHz]);

  useEffect(() => {
    if (isTouch) return;
    const onMove = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [isTouch, mouseX, mouseY]);

  if (isTouch) return null;

  const dotSize = 6 + Math.min(4, velocity * 0.05);
  const opacity = isIdle ? 0.15 : 0.5;

  return (
    <motion.div
      className="cursor-overlay"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
    >
      {/* Dot */}
      <motion.div
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          background: "var(--fg)",
          opacity,
        }}
        animate={{ width: dotSize, height: dotSize, opacity }}
        transition={{ type: "spring" as const, ...SPRING }}
      />

      {/* Hz or label */}
      <motion.span
        style={{
          position: "absolute",
          left: 14,
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: "var(--font-mono)",
          fontSize: 8,
          letterSpacing: "0.06em",
          color: "var(--fg)",
          opacity: isIdle ? 0.08 : 0.2,
          whiteSpace: "nowrap",
        }}
        animate={{ opacity: isIdle ? 0.08 : 0.2 }}
      >
        {label ?? <motion.span>{smoothHz.get().toFixed(2)} Hz</motion.span>}
      </motion.span>
    </motion.div>
  );
}
```

Note: The Hz display needs to read from `smoothHz` reactively. Use `useMotionValueEvent` or `useTransform` to render the value. The implementer should use `motion.span` with `style={{ "--hz": smoothHz }}` or a `useMotionTemplate` approach, OR simply read `smoothHz` in a `useAnimationFrame` callback and update a ref. The exact reactive rendering approach should be determined during implementation.

- [ ] **Step 3: Add Cursor import to layout.tsx**

Uncomment/add `import Cursor from "@/components/Cursor"` and add `<Cursor />` to body.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useCursorState.ts src/components/Cursor.tsx src/app/layout.tsx && git commit -m "feat: frequency cursor with Hz display and contextual labels"
```

### Task 7: Build Preloader component

**Files:**
- Create: `src/components/Preloader.tsx`

- [ ] **Step 1: Write Preloader.tsx**

A full-screen black overlay with a numeric counter that animates 000 → 100, then wipes away.

```tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";

export default function Preloader() {
  const { preloaderDone, setPreloaderDone } = useTheaterStore();
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(true);
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (preloaderDone) {
      setVisible(false);
      return;
    }

    const duration = 2200; // ms to reach 100
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      const progress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setCount(progress);

      if (progress >= 100) {
        clearInterval(interval);
        // Hold at 100 briefly, then dismiss
        setTimeout(() => {
          setVisible(false);
          setTimeout(() => setPreloaderDone(), 400); // After exit animation
        }, 400);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [preloaderDone, setPreloaderDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: "var(--bg)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Counter */}
          <span
            className="font-mono text-[11px] tracking-[0.2em] tabular-nums"
            style={{ color: "var(--fg)" }}
          >
            {String(count).padStart(3, "0")}
          </span>

          {/* Detail text */}
          <span
            className="font-mono text-[8px] tracking-[0.1em] uppercase mt-3"
            style={{ color: "var(--fg-3)" }}
          >
            40.7128° N — Loading
          </span>

          {/* Thin progress line */}
          <div
            className="mt-4 h-px overflow-hidden"
            style={{ width: 80 }}
          >
            <motion.div
              className="h-full"
              style={{ background: "var(--fg-3)", width: `${count}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Preloader.tsx && git commit -m "feat: Preloader with numeric counter and clip-path reveal"
```

### Task 8: Build 3D CD Case scene

**Files:**
- Create: `src/components/CDCase.tsx` — the 3D object
- Create: `src/components/Scene3D.tsx` — the R3F Canvas wrapper

- [ ] **Step 1: Write CDCase.tsx**

The actual Three.js mesh — a box with rounded edges, textured front face, matte material. Accepts `textureUrl` and `coverColor` props. Rotates slowly, responds to cursor.

```tsx
"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

interface CDCaseProps {
  textureUrl?: string;
  coverColor?: string;
}

export default function CDCase({ textureUrl, coverColor = "#1a1a1a" }: CDCaseProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  // Load texture if URL provided
  const texture = textureUrl ? useTexture(textureUrl) : null;

  // Create color material for back/sides
  const darkMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#0d0d0d", roughness: 0.9, metalness: 0 }),
    []
  );

  // Front face material
  const frontMaterial = useMemo(() => {
    if (texture) {
      return new THREE.MeshStandardMaterial({ map: texture, roughness: 0.85, metalness: 0.05 });
    }
    return new THREE.MeshStandardMaterial({ color: coverColor, roughness: 0.85, metalness: 0.05 });
  }, [texture, coverColor]);

  // 6 faces: right, left, top, bottom, front, back
  const materials = useMemo(
    () => [darkMaterial, darkMaterial, darkMaterial, darkMaterial, frontMaterial, darkMaterial],
    [darkMaterial, frontMaterial]
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    // Slow Y rotation
    meshRef.current.rotation.y += delta * 0.1;
    // Cursor-responsive tilt (max ~8 degrees)
    const targetX = pointer.y * 0.14;
    const targetZ = -pointer.x * 0.14;
    meshRef.current.rotation.x += (targetX - meshRef.current.rotation.x) * 0.05;
    meshRef.current.rotation.z += (targetZ - meshRef.current.rotation.z) * 0.05;
  });

  return (
    <mesh ref={meshRef} material={materials}>
      <boxGeometry args={[2, 2, 0.15]} />
    </mesh>
  );
}
```

Note: `useTexture` must be called unconditionally (React hooks rule). The implementer should handle the conditional texture loading with a Suspense boundary or by always loading a fallback texture. Adjust as needed during implementation.

- [ ] **Step 2: Write Scene3D.tsx**

The Canvas wrapper. Persists across all states. Lives inside a `motion.div` with a `layoutId` for FLIP transitions.

```tsx
"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import CDCase from "./CDCase";
import { useTheaterStore } from "@/store/useTheaterStore";
import { PIECES } from "@/constants/pieces";

export default function Scene3D() {
  const selectedSlug = useTheaterStore((s) => s.selectedSlug);
  const piece = PIECES.find((p) => p.slug === selectedSlug);

  const textureUrl = piece?.coverArt ?? piece?.image;
  const coverColor = piece?.cover.bg ?? "#1a1a1a";

  return (
    <motion.div
      layoutId="scene3d"
      className="w-full h-full"
      transition={{ type: "spring", stiffness: 200, damping: 28 }}
    >
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        style={{ background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.15} />
        <directionalLight position={[2, 3, 4]} intensity={0.6} color="#f0eee8" />

        <Suspense fallback={null}>
          <CDCase textureUrl={textureUrl} coverColor={coverColor} />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/CDCase.tsx src/components/Scene3D.tsx && git commit -m "feat: 3D CD case scene with R3F, matte lighting, cursor tilt"
```

---

## Chunk 3: Main Stage — The Unified Viewport

### Task 9: Build the Main Stage shell

**Files:**
- Create: `src/components/TheaterStage.tsx` — the main viewport component
- Create: `src/components/TopBar.tsx` — persistent top bar with mark + tabs
- Create: `src/components/BottomBar.tsx` — persistent bottom bar

- [ ] **Step 1: Write TopBar.tsx**

```tsx
"use client";

import { motion } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";

const TABS = [
  { key: "index" as const, label: "Index" },
  { key: "archive" as const, label: "Archive" },
  { key: "about" as const, label: "About" },
];

export default function TopBar() {
  const { activeTab, setActiveTab, isDetailExpanded, collapseDetail } = useTheaterStore();

  return (
    <div
      className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between h-12"
      style={{
        paddingInline: "clamp(32px, 8vw, 96px)",
        borderBottom: "1px solid var(--fg-4)",
      }}
    >
      {/* Left: mark or back button */}
      {isDetailExpanded ? (
        <button
          onClick={collapseDetail}
          className="font-mono text-[10px] tracking-[0.04em] hover:opacity-60 transition-opacity"
          style={{ color: "var(--fg-2)" }}
          data-cursor-label="Back"
        >
          ← Back
        </button>
      ) : (
        <span className="font-mono text-[11px] tracking-[0.02em]" style={{ color: "var(--fg)" }}>
          HKJ
        </span>
      )}

      {/* Right: tabs (hidden when detail expanded) */}
      {!isDetailExpanded && (
        <div className="flex items-center gap-6">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="relative font-mono text-[10px] uppercase tracking-[0.08em] transition-colors duration-300 pb-1"
                style={{ color: isActive ? "var(--fg)" : "var(--fg-3)" }}
              >
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -bottom-[5px] left-0 right-0 h-px"
                    style={{ background: "var(--fg)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Right: project title when detail expanded */}
      {isDetailExpanded && (
        <span className="font-mono text-[9px] tracking-[0.08em] uppercase" style={{ color: "var(--fg-3)" }}>
          {PIECES_LABEL}
        </span>
      )}
    </div>
  );
}
```

Note: `PIECES_LABEL` should be derived from the store's `selectedSlug`. The implementer should add the lookup. This is a placeholder to indicate intent.

- [ ] **Step 2: Write BottomBar.tsx**

```tsx
"use client";

import { useTheaterStore } from "@/store/useTheaterStore";
import { PIECES } from "@/constants/pieces";

export default function BottomBar() {
  const { activeTab, selectedSlug } = useTheaterStore();
  const piece = PIECES.find((p) => p.slug === selectedSlug);

  const leftText = activeTab === "index"
    ? (piece?.status === "wip" ? "In progress" : String(piece?.year ?? ""))
    : activeTab === "archive"
    ? `${PIECES.filter((p) => p.type === "experiment").length} collected`
    : "New York";

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between h-10"
      style={{
        paddingInline: "clamp(32px, 8vw, 96px)",
        borderTop: "1px solid var(--fg-4)",
      }}
    >
      <span className="font-mono text-[9px] tracking-[0.06em]" style={{ color: "var(--fg-3)" }}>
        {leftText}
      </span>
      <span className="font-mono text-[9px] tracking-[0.06em]" style={{ color: "var(--fg-3)" }}>
        v1.0
      </span>
    </div>
  );
}
```

- [ ] **Step 3: Write TheaterStage.tsx**

The main orchestrator. Renders TopBar, BottomBar, left zone content (based on activeTab), and right zone (Scene3D). Uses `AnimatePresence` for tab content switching.

```tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";
import Scene3D from "./Scene3D";
import IndexView from "./views/IndexView";
import ArchiveView from "./views/ArchiveView";
import AboutView from "./views/AboutView";
import DetailView from "./views/DetailView";

export default function TheaterStage() {
  const { activeTab, isDetailExpanded, preloaderDone } = useTheaterStore();

  if (!preloaderDone) return null;

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden" id="main">
      <TopBar />
      <BottomBar />

      {/* Left zone */}
      <div
        className="absolute z-10"
        style={{
          left: "clamp(32px, 8vw, 96px)",
          top: 48, // below top bar
          bottom: 40, // above bottom bar
          width: "38%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <AnimatePresence mode="wait">
          {isDetailExpanded ? (
            <DetailView key="detail" />
          ) : activeTab === "index" ? (
            <IndexView key="index" />
          ) : activeTab === "archive" ? (
            <ArchiveView key="archive" />
          ) : (
            <AboutView key="about" />
          )}
        </AnimatePresence>
      </div>

      {/* Right zone — 3D scene */}
      <div
        className="absolute z-0"
        style={{
          right: 0,
          top: 48,
          bottom: 40,
          width: "60%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Scene3D />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/TopBar.tsx src/components/BottomBar.tsx src/components/TheaterStage.tsx && git commit -m "feat: Theater stage shell with TopBar, BottomBar, and zone layout"
```

### Task 10: Build tab views — Index, Archive, About

**Files:**
- Create: `src/components/views/IndexView.tsx`
- Create: `src/components/views/ArchiveView.tsx`
- Create: `src/components/views/AboutView.tsx`

- [ ] **Step 1: Write IndexView.tsx**

Project selector list + structured metadata for the selected project.

```tsx
"use client";

import { motion } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";
import { PIECES } from "@/constants/pieces";

const projects = PIECES.filter((p) => p.type === "project").sort((a, b) => a.order - b.order);

export default function IndexView() {
  const { selectedSlug, setSelectedSlug, expandDetail } = useTheaterStore();
  const active = projects.find((p) => p.slug === selectedSlug) ?? projects[0];

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Project selector */}
      <div className="flex flex-col gap-1 mb-8">
        {projects.map((p) => {
          const isActive = p.slug === selectedSlug;
          return (
            <button
              key={p.slug}
              onClick={() => setSelectedSlug(p.slug)}
              className="flex items-center gap-3 py-1.5 text-left transition-colors duration-200"
              style={{ color: isActive ? "var(--fg)" : "var(--fg-3)" }}
            >
              <span className="font-mono text-[9px] tracking-[0.08em] tabular-nums w-5">
                {String(p.order).padStart(2, "0")}
              </span>
              <span className="text-[14px] tracking-[0.01em]">
                {p.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Thin divider */}
      <div className="h-px w-8 mb-6" style={{ background: "var(--fg-4)" }} />

      {/* Structured metadata */}
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 mb-6 font-mono text-[9px] tracking-[0.06em] uppercase">
        <span style={{ color: "var(--fg-3)" }}>N:</span>
        <span style={{ color: "var(--fg-2)" }}>{String(active.order).padStart(2, "0")}</span>
        <span style={{ color: "var(--fg-3)" }}>Title:</span>
        <span style={{ color: "var(--fg-2)" }}>{active.title}</span>
        <span style={{ color: "var(--fg-3)" }}>Year:</span>
        <span style={{ color: "var(--fg-2)" }}>{active.status === "wip" ? "WIP" : active.year}</span>
        <span style={{ color: "var(--fg-3)" }}>Type:</span>
        <span style={{ color: "var(--fg-2)" }}>{active.tags.join(" / ")}</span>
        <span style={{ color: "var(--fg-3)" }}>Status:</span>
        <span style={{ color: "var(--fg-2)" }}>{active.status === "wip" ? "In progress" : "Shipped"}</span>
      </div>

      {/* Description */}
      <p className="text-[13px] leading-[1.7] mb-6 max-w-[320px]" style={{ color: "var(--fg-2)" }}>
        {active.description}
      </p>

      {/* View project link */}
      <button
        onClick={expandDetail}
        className="font-mono text-[9px] uppercase tracking-[0.1em] transition-opacity duration-300 hover:opacity-60"
        style={{ color: "var(--fg)" }}
        data-cursor-label="View"
      >
        View project →
      </button>
    </motion.div>
  );
}
```

- [ ] **Step 2: Write ArchiveView.tsx**

Same structure as IndexView but filtered for experiments.

```tsx
"use client";

import { motion } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";
import { PIECES } from "@/constants/pieces";

const experiments = PIECES.filter((p) => p.type === "experiment").sort((a, b) => a.order - b.order);

export default function ArchiveView() {
  const { selectedSlug, setSelectedSlug, expandDetail } = useTheaterStore();
  // Default to first experiment if current selection isn't an experiment
  const active = experiments.find((p) => p.slug === selectedSlug) ?? experiments[0];

  // Sync selection to first experiment on mount if needed
  // (The store may have a project slug selected when switching to Archive tab)

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Experiment selector */}
      <div className="flex flex-col gap-1 mb-8">
        {experiments.map((p) => {
          const isActive = p.slug === active?.slug;
          return (
            <button
              key={p.slug}
              onClick={() => setSelectedSlug(p.slug)}
              className="flex items-center gap-3 py-1.5 text-left transition-colors duration-200"
              style={{ color: isActive ? "var(--fg)" : "var(--fg-3)" }}
            >
              <span className="font-mono text-[9px] tracking-[0.08em] tabular-nums w-5">
                {String(p.order).padStart(2, "0")}
              </span>
              <span className="text-[14px] tracking-[0.01em]">
                {p.title}
              </span>
            </button>
          );
        })}
      </div>

      <div className="h-px w-8 mb-6" style={{ background: "var(--fg-4)" }} />

      {active && (
        <>
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 mb-6 font-mono text-[9px] tracking-[0.06em] uppercase">
            <span style={{ color: "var(--fg-3)" }}>N:</span>
            <span style={{ color: "var(--fg-2)" }}>{String(active.order).padStart(2, "0")}</span>
            <span style={{ color: "var(--fg-3)" }}>Title:</span>
            <span style={{ color: "var(--fg-2)" }}>{active.title}</span>
            <span style={{ color: "var(--fg-3)" }}>Year:</span>
            <span style={{ color: "var(--fg-2)" }}>{active.status === "wip" ? "WIP" : active.year}</span>
            <span style={{ color: "var(--fg-3)" }}>Type:</span>
            <span style={{ color: "var(--fg-2)" }}>{active.tags.join(" / ")}</span>
          </div>

          <p className="text-[13px] leading-[1.7] mb-6 max-w-[320px]" style={{ color: "var(--fg-2)" }}>
            {active.description}
          </p>

          <button
            onClick={expandDetail}
            className="font-mono text-[9px] uppercase tracking-[0.1em] transition-opacity duration-300 hover:opacity-60"
            style={{ color: "var(--fg)" }}
            data-cursor-label="View"
          >
            View details →
          </button>
        </>
      )}
    </motion.div>
  );
}
```

- [ ] **Step 3: Write AboutView.tsx**

Bio, stats, experience, contact.

```tsx
"use client";

import { motion } from "framer-motion";
import { SOCIALS, CONTACT_EMAIL } from "@/constants/contact";

const STATS = [
  { key: "Location", value: "New York" },
  { key: "Focus", value: "Design Engineering" },
  { key: "Experience", value: "3+ years" },
  { key: "Status", value: "Available" },
];

const EXPERIENCE = [
  { period: "2024 —", role: "HKJ Studio", desc: "Independent practice" },
  { period: "2023 — 24", role: "Product", desc: "Mobile & AI" },
  { period: "2022 — 23", role: "Design Systems", desc: "Components & tokens" },
];

export default function AboutView() {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="block font-mono text-[9px] tracking-[0.14em] uppercase mb-4" style={{ color: "var(--fg-3)" }}>
        Profile
      </span>

      <h2 className="font-display font-normal text-[clamp(24px,3vw,32px)] tracking-[-0.02em] leading-[1.2] mb-4" style={{ color: "var(--fg)" }}>
        Design engineer building at the intersection of craft and systems thinking.
      </h2>

      <p className="text-[13px] leading-[1.7] mb-6 max-w-[340px]" style={{ color: "var(--fg-2)" }}>
        I care about type, motion, and the invisible details that make software feel intentional.
      </p>

      <div className="h-px w-8 mb-6" style={{ background: "var(--fg-4)" }} />

      {/* Stats */}
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 mb-6 font-mono text-[9px] tracking-[0.06em] uppercase">
        {STATS.map((s) => (
          <Fragment key={s.key}>
            <span style={{ color: "var(--fg-3)" }}>{s.key}:</span>
            <span style={{ color: "var(--fg-2)" }}>{s.value}</span>
          </Fragment>
        ))}
      </div>

      <div className="h-px w-8 mb-6" style={{ background: "var(--fg-4)" }} />

      {/* Experience */}
      <div className="flex flex-col gap-2 mb-6">
        {EXPERIENCE.map((e) => (
          <div key={e.period} className="flex items-baseline gap-3">
            <span className="font-mono text-[9px] tracking-[0.04em] tabular-nums shrink-0" style={{ color: "var(--fg-3)", width: 72 }}>
              {e.period}
            </span>
            <span className="text-[13px]" style={{ color: "var(--fg)" }}>{e.role}</span>
            <span className="text-[12px]" style={{ color: "var(--fg-3)" }}>— {e.desc}</span>
          </div>
        ))}
      </div>

      <div className="h-px w-8 mb-6" style={{ background: "var(--fg-4)" }} />

      {/* Contact */}
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="font-mono text-[10px] tracking-[0.02em] block mb-3 hover:opacity-60 transition-opacity"
        style={{ color: "var(--fg-2)" }}
      >
        {CONTACT_EMAIL}
      </a>
      <div className="flex gap-4">
        {SOCIALS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[8px] uppercase tracking-[0.1em] hover:opacity-60 transition-opacity"
            style={{ color: "var(--fg-3)" }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </motion.div>
  );
}
```

Note: `Fragment` needs to be imported from React. The implementer should add `import { Fragment } from "react"`.

- [ ] **Step 4: Commit**

```bash
git add src/components/views/IndexView.tsx src/components/views/ArchiveView.tsx src/components/views/AboutView.tsx && git commit -m "feat: Index, Archive, and About tab views with editorial metadata"
```

---

## Chunk 4: Detail View, Page Assembly, URL Sync

### Task 11: Build Detail View (FLIP expansion)

**Files:**
- Create: `src/components/views/DetailView.tsx`

- [ ] **Step 1: Write DetailView.tsx**

The expanded detail state. Shows project header, case study content. This view renders inside the left zone but may need the container to become scrollable.

```tsx
"use client";

import { motion } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";
import { PIECES } from "@/constants/pieces";
import { CASE_STUDIES } from "@/constants/case-studies";

export default function DetailView() {
  const { selectedSlug } = useTheaterStore();
  const piece = PIECES.find((p) => p.slug === selectedSlug);
  const cs = piece ? CASE_STUDIES[piece.slug] : undefined;

  if (!piece) return null;

  return (
    <motion.div
      className="w-full h-full overflow-y-auto pr-4"
      style={{ scrollbarWidth: "none" }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Project label */}
      <span className="block font-mono text-[9px] tracking-[0.14em] uppercase mb-3" style={{ color: "var(--fg-3)" }}>
        {String(piece.order).padStart(2, "0")} — {piece.type === "project" ? "Project" : "Experiment"}
      </span>

      {/* Title */}
      <h1 className="font-display font-normal text-[clamp(28px,4vw,44px)] tracking-[-0.02em] leading-[1.1] mb-4" style={{ color: "var(--fg)" }}>
        {piece.title}
      </h1>

      {/* Description */}
      <p className="text-[14px] leading-[1.7] mb-6 max-w-[400px]" style={{ color: "var(--fg-2)" }}>
        {piece.description}
      </p>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap mb-6">
        {piece.tags.map((tag) => (
          <span key={tag} className="font-mono text-[8px] uppercase tracking-[0.1em] px-2 py-0.5" style={{ color: "var(--fg-3)", border: "1px solid var(--fg-4)" }}>
            {tag}
          </span>
        ))}
        <span className="font-mono text-[9px] tabular-nums" style={{ color: "var(--fg-3)" }}>
          {piece.status === "wip" ? "WIP" : piece.year}
        </span>
      </div>

      {/* Case study content */}
      {cs && (
        <>
          <div className="h-px w-full my-8" style={{ background: "var(--fg-4)" }} />

          <h2 className="font-display text-[clamp(20px,2.5vw,28px)] tracking-[-0.02em] leading-[1.2] mb-3" style={{ color: "var(--fg)" }}>
            {cs.editorial.heading}
          </h2>
          {cs.editorial.subhead && (
            <p className="font-mono text-[9px] uppercase tracking-[0.08em] mb-3" style={{ color: "var(--fg-3)" }}>
              {cs.editorial.subhead}
            </p>
          )}
          <p className="text-[14px] leading-[1.75] mb-0" style={{ color: "var(--fg-2)" }}>
            {cs.editorial.copy}
          </p>

          {cs.process && (
            <>
              <div className="h-px w-full my-8" style={{ background: "var(--fg-4)" }} />
              <h3 className="font-mono text-[9px] uppercase tracking-[0.08em] mb-3" style={{ color: "var(--fg-3)" }}>
                {cs.process.title}
              </h3>
              <p className="text-[14px] leading-[1.75]" style={{ color: "var(--fg-2)" }}>
                {cs.process.copy}
              </p>
            </>
          )}

          {cs.engineering && (
            <>
              <div className="h-px w-full my-8" style={{ background: "var(--fg-4)" }} />
              <h3 className="font-mono text-[9px] uppercase tracking-[0.08em] mb-3" style={{ color: "var(--fg-3)" }}>
                {cs.engineering.title}
              </h3>
              <p className="text-[14px] leading-[1.75] mb-4" style={{ color: "var(--fg-2)" }}>
                {cs.engineering.copy}
              </p>
              <div className="flex gap-2 flex-wrap">
                {cs.engineering.signals.map((s) => (
                  <span key={s} className="font-mono text-[8px] uppercase tracking-[0.08em] px-2 py-0.5" style={{ color: "var(--fg-3)", border: "1px solid var(--fg-4)" }}>
                    {s}
                  </span>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Bottom padding for scroll */}
      <div className="h-12" />
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/views/DetailView.tsx && git commit -m "feat: Detail view with scrollable case study content"
```

### Task 12: Assemble the page — connect everything

**Files:**
- Rewrite: `src/app/page.tsx`
- Rewrite: `src/app/index/[slug]/page.tsx` (SSR fallback)
- Rewrite: `src/app/archive/[slug]/page.tsx` (SSR fallback)
- Keep: `src/app/not-found.tsx` (already updated)

- [ ] **Step 1: Write the main page.tsx**

This is the only real page. It renders the Preloader and TheaterStage.

```tsx
"use client";

import Preloader from "@/components/Preloader";
import TheaterStage from "@/components/TheaterStage";

export default function Home() {
  return (
    <>
      <Preloader />
      <TheaterStage />
    </>
  );
}
```

- [ ] **Step 2: Write SSR fallback for /index/[slug]**

When someone hits `/index/gyeol` directly, the server needs to render something. This page initializes the store with the correct state and renders the same Theater.

```tsx
"use client";

import { useEffect } from "react";
import { useTheaterStore } from "@/store/useTheaterStore";
import Preloader from "@/components/Preloader";
import TheaterStage from "@/components/TheaterStage";

export default function ProjectDetailFallback({ params }: { params: { slug: string } }) {
  const { setSelectedSlug, expandDetail, setPreloaderDone, setActiveTab } = useTheaterStore();

  useEffect(() => {
    setActiveTab("index");
    setSelectedSlug(params.slug);
    expandDetail();
    setPreloaderDone();
  }, [params.slug, setSelectedSlug, expandDetail, setPreloaderDone, setActiveTab]);

  return (
    <>
      <Preloader />
      <TheaterStage />
    </>
  );
}
```

Note: In Next.js App Router, `params` is a Promise in async server components. Since this is a client component, the implementer should handle this appropriately — either by making it a server component that passes the slug as a prop to a client component, or by using `useParams()` from `next/navigation`.

- [ ] **Step 3: Write SSR fallback for /archive/[slug]**

Same pattern but sets `activeTab: "archive"`.

- [ ] **Step 4: Simplify ParticleCanvas**

Read `src/components/ParticleCanvas.tsx` and reduce default particle count to 15, max opacity to 0.03.

- [ ] **Step 5: Build and verify**

```bash
npx next build
```

Fix any type errors.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: assemble Theater — preloader + stage + SSR fallbacks + reduced particles"
```

### Task 13: URL sync with history.pushState

**Files:**
- Modify: `src/store/useTheaterStore.ts`
- Create: `src/hooks/useURLSync.ts`

- [ ] **Step 1: Create useURLSync hook**

A hook that listens to store changes and updates the URL without triggering navigation. Also reads the initial URL on mount and sets the store accordingly.

```ts
"use client";

import { useEffect } from "react";
import { useTheaterStore } from "@/store/useTheaterStore";

export function useURLSync() {
  const { activeTab, selectedSlug, isDetailExpanded } = useTheaterStore();

  // Update URL when state changes
  useEffect(() => {
    let url = "/";
    if (isDetailExpanded && selectedSlug) {
      const piece = /* look up piece by slug to determine type */;
      url = piece?.type === "experiment"
        ? `/archive/${selectedSlug}`
        : `/index/${selectedSlug}`;
    } else if (activeTab === "archive") {
      url = "/archive";
    } else if (activeTab === "about") {
      url = "/about";
    }
    // Only pushState if URL actually changed
    if (window.location.pathname !== url) {
      window.history.pushState(null, "", url);
    }
  }, [activeTab, selectedSlug, isDetailExpanded]);

  // Handle browser back/forward
  useEffect(() => {
    const onPop = () => {
      const path = window.location.pathname;
      // Parse path and update store accordingly
      // Implementation left to engineer — match against /index/[slug], /archive, /about, /
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
}
```

Note: The implementer should flesh out the PIECES lookup and the popstate handler. This is a skeleton showing the approach.

- [ ] **Step 2: Call useURLSync in TheaterStage**

Add `useURLSync()` call at the top of TheaterStage component.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useURLSync.ts src/components/TheaterStage.tsx && git commit -m "feat: URL sync via history.pushState for browser back/forward"
```

### Task 14: Final cleanup and build verification

- [ ] **Step 1: Remove any remaining unused files**

Check for unused imports, orphaned components. Delete `src/components/ThemeToggle.tsx` if theme toggling is removed from the design (the spec doesn't mention it). Keep `src/hooks/useReducedMotion.ts` — useful for accessibility.

- [ ] **Step 2: Run full build**

```bash
npx next build
```

Fix all errors.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "chore: final cleanup — remove unused files, fix build"
```

---

## Implementer Notes — Known Issues in Code Snippets

These are known problems in the plan's code snippets. Subagents **must** fix these during implementation:

1. **CDCase.tsx (Task 8):** `useTexture` is called conditionally — violates Rules of Hooks. Fix: always call `useTexture` with a fallback URL, or split into two components (`CDCaseWithTexture` / `CDCaseWithColor`) rendered conditionally outside the hook.

2. **TopBar.tsx (Task 9):** References `PIECES_LABEL` which doesn't exist. Fix: import `PIECES` and derive: `const piece = PIECES.find(p => p.slug === selectedSlug); const label = piece?.title ?? "";`

3. **AboutView.tsx (Task 10):** Uses `Fragment` without importing. Fix: add `import { Fragment } from "react"` or use `<>...</>` shorthand.

4. **SSR fallback pages (Task 12):** Use `params` as a direct prop but it's a Promise in Next.js App Router. Fix: use `useParams()` from `next/navigation` since these are client components.

5. **useURLSync.ts (Task 13):** Has placeholder comments instead of real implementation. Fix: implement the PIECES lookup and popstate handler fully.

6. **ArchiveView.tsx (Task 10):** Does not sync `selectedSlug` when Archive tab mounts. Fix: add `useEffect` that calls `setSelectedSlug(experiments[0]?.slug)` if the current slug isn't an experiment.

## Deferred Scope

These spec sections are **not covered** in this plan and should be addressed in a follow-up:

- **Responsive / Mobile (Spec Section 11):** Mobile layout, bottom tab strip, 3D fallback to static image
- **Keyboard navigation (Spec Section 12):** Arrow key navigation in selector, Enter to expand
- **WebGL error boundary (Spec Section 12):** Fallback when Canvas fails
- **`prefers-reduced-motion` for 3D (Spec Section 12):** Stop rotation, instant transitions
