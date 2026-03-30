"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { gsap } from "@/lib/gsap";
import { PIECES } from "@/constants/pieces";
import PageTransition from "@/components/PageTransition";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
  loading: () => null,
});

const pieces = [...PIECES].sort((a, b) => a.order - b.order);
const ITEM_COUNT = pieces.length;

// ── Carousel constants ──
const ITEM_WIDTH = 320;  // base width in px (will be responsive via clamp)
const ITEM_GAP = 40;
const TRACK = ITEM_COUNT * (ITEM_WIDTH + ITEM_GAP);
const FRICTION = 0.92;
const WHEEL_SENS = 0.8;
const DRAG_SENS = 1.2;
const MAX_ROTATION = 35;  // degrees
const MAX_DEPTH = 160;    // translateZ px
const MIN_SCALE = 0.65;
const SCALE_RANGE = 0.35; // 0.65 + 0.35 = 1.0 at center
const MIN_OPACITY = 0.3;
const OPACITY_RANGE = 0.7;

// Modulo that handles negatives
function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function isDark(hex: string): boolean {
  const c = hex.replace("#", "");
  if (c.length < 6) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}

export default function Home() {
  const stageRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navRef = useRef<HTMLElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  const scrollXRef = useRef(0);
  const velocityRef = useRef(0);
  const centerIdxRef = useRef(0);
  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const lastTime = useRef(0);

  const [centerIdx, setCenterIdx] = useState(0);

  const piece = pieces[centerIdx];
  const dark = isDark(piece.cover.bg);
  const textColor = dark ? "rgba(255,252,245,0.92)" : "var(--fg)";
  const mutedColor = dark ? "rgba(255,252,245,0.45)" : "var(--fg-3)";

  // ── Main animation loop ──
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let vw = window.innerWidth;
    let vwHalf = vw / 2;
    let raf: number;

    const onResize = () => { vw = window.innerWidth; vwHalf = vw / 2; };
    window.addEventListener("resize", onResize);

    const loop = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime.current) / 1000, 0.1) || 0.016;
      lastTime.current = now;

      // Apply friction
      velocityRef.current *= Math.pow(FRICTION, dt * 60);
      if (Math.abs(velocityRef.current) < 0.1) velocityRef.current = 0;

      // Advance scroll position
      scrollXRef.current = mod(scrollXRef.current + velocityRef.current * dt * 60, TRACK);

      // Update each item's transform
      let closestDist = Infinity;
      let closestIdx = 0;

      for (let i = 0; i < ITEM_COUNT; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;

        // Base position of this item in the track
        const baseX = i * (ITEM_WIDTH + ITEM_GAP);

        // Screen-space X (with wrapping)
        let screenX = baseX - scrollXRef.current;
        // Wrap to keep items centered
        if (screenX > TRACK / 2) screenX -= TRACK;
        if (screenX < -TRACK / 2) screenX += TRACK;

        // Normalize to -1...1 based on viewport
        const norm = Math.max(-1, Math.min(1, screenX / (vwHalf * 1.2)));
        const absNorm = Math.abs(norm);
        const invNorm = 1 - absNorm;

        // Calculate transforms
        const z = invNorm * MAX_DEPTH;
        const rotY = -norm * MAX_ROTATION;
        const scale = MIN_SCALE + invNorm * SCALE_RANGE;
        const opacity = MIN_OPACITY + invNorm * OPACITY_RANGE;

        el.style.transform = `translate(-50%, -50%) translateX(${screenX}px) translateZ(${z}px) rotateY(${rotY}deg) scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.zIndex = String(Math.round(invNorm * 100));

        // Track center item
        const dist = Math.abs(screenX);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = i;
        }
      }

      // Update center index
      if (closestIdx !== centerIdxRef.current) {
        centerIdxRef.current = closestIdx;
        setCenterIdx(closestIdx);

        // Animate progress bar
        if (progressRef.current) {
          const pct = ((closestIdx + 1) / ITEM_COUNT) * 100;
          gsap.to(progressRef.current, { width: `${pct}%`, duration: 0.3, ease: "power2.out" });
        }
      }

      raf = requestAnimationFrame(loop);
    };

    lastTime.current = performance.now();
    raf = requestAnimationFrame(loop);

    // ── Input handlers ──
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      velocityRef.current += (e.deltaY || e.deltaX) * WHEEL_SENS;
    };

    const onPointerDown = (e: PointerEvent) => {
      dragging.current = true;
      dragStartX.current = e.clientX;
      stage.setPointerCapture(e.pointerId);
      stage.style.cursor = "grabbing";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = dragStartX.current - e.clientX;
      dragStartX.current = e.clientX;
      velocityRef.current += dx * DRAG_SENS;
    };
    const onPointerUp = (e: PointerEvent) => {
      dragging.current = false;
      stage.releasePointerCapture(e.pointerId);
      stage.style.cursor = "grab";
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        velocityRef.current += 300;
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        velocityRef.current -= 300;
      }
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", onPointerUp);
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // ── Info crossfade on center change ──
  useEffect(() => {
    if (!infoRef.current) return;
    const tl = gsap.timeline();
    tl.to(infoRef.current, { opacity: 0, y: 6, duration: 0.15, ease: "power2.in" });
    tl.to(infoRef.current, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" });
  }, [centerIdx]);

  // ── Entrance ──
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      [navRef, footerRef].forEach(r => { if (r.current) r.current.style.opacity = "1"; });
      if (infoRef.current) infoRef.current.style.opacity = "1";
      return;
    }

    const tl = gsap.timeline();
    tl.fromTo([navRef.current, footerRef.current],
      { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.1 }, 0.1);
    tl.fromTo(infoRef.current,
      { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.6);
  }, []);

  const href = piece.type === "project" ? `/work/${piece.slug}` : `/lab/${piece.slug}`;

  return (
    <PageTransition>
      <div style={{
        height: "100dvh",
        overflow: "hidden",
        display: "grid",
        gridTemplateRows: "48px 1fr auto auto",
        backgroundColor: piece.cover.bg,
        transition: "background-color 700ms cubic-bezier(0.22, 1, 0.36, 1)",
        position: "relative",
      }}>

        {/* ═══ NAV ═══ */}
        <header ref={navRef} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 var(--margin)", opacity: 0, position: "relative", zIndex: 20,
        }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 11,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: textColor, transition: "color 500ms ease",
          }}>HKJ</span>
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 11,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: mutedColor, transition: "color 500ms ease",
            }}>Brand & Product Studio</span>
            <Link href="/about" style={{
              fontFamily: "var(--font-mono)", fontSize: 11,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: mutedColor, textDecoration: "none",
              transition: "color 200ms ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = textColor; }}
            onMouseLeave={e => { e.currentTarget.style.color = mutedColor; }}
            >About</Link>
          </div>
        </header>

        {/* ═══ 3D CAROUSEL ═══ */}
        <div ref={stageRef} className="carousel-stage" style={{ cursor: "grab" }}>
          {pieces.map((p, i) => {
            const hasDarkBg = isDark(p.cover.bg);
            const coverMuted = hasDarkBg ? "rgba(255,252,245,0.30)" : "rgba(26,25,23,0.20)";

            return (
              <div
                key={p.slug}
                ref={el => { itemRefs.current[i] = el; }}
                className="carousel-item"
                style={{
                  width: "clamp(220px, 28vw, 420px)",
                  aspectRatio: "3/4",
                  opacity: 0,
                }}
              >
                <Link
                  href={p.type === "project" ? `/work/${p.slug}` : `/lab/${p.slug}`}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    backgroundColor: p.cover.bg,
                    overflow: "hidden",
                    textDecoration: "none",
                  }}
                >
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 70vw, 28vw"
                      style={{ objectFit: "cover" }}
                      priority={i < 3}
                    />
                  )}
                  {/* Grain */}
                  <div aria-hidden="true" style={{
                    position: "absolute", inset: 0, opacity: 0.04,
                    filter: "url(#grain)", background: "var(--bg)",
                    mixBlendMode: "multiply", pointerEvents: "none", zIndex: 1,
                  }} />
                  {/* Number */}
                  <span style={{
                    position: "absolute", top: 10, left: 12, zIndex: 2,
                    fontFamily: "var(--font-mono)", fontSize: 10,
                    letterSpacing: "0.08em", color: coverMuted,
                  }}>{String(i + 1).padStart(2, "0")}</span>
                </Link>
              </div>
            );
          })}
        </div>

        {/* ═══ PROJECT INFO ═══ */}
        <div ref={infoRef} style={{
          padding: "0 var(--margin)",
          paddingTop: 12,
          paddingBottom: 8,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
          opacity: 0,
          position: "relative",
          zIndex: 20,
        }}>
          <Link href={href} style={{
            display: "flex", alignItems: "baseline", gap: 16,
            textDecoration: "none",
          }}>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(20px, 2.5vw, 36px)",
              fontWeight: 400, letterSpacing: "-0.02em",
              color: textColor, transition: "color 500ms ease",
            }}>{piece.title}</span>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 10,
              letterSpacing: "0.08em", textTransform: "uppercase",
              color: mutedColor, transition: "color 500ms ease",
            }}>{piece.tags[0]}</span>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 10,
              letterSpacing: "0.08em",
              color: mutedColor, transition: "color 500ms ease",
            }}>{piece.year}</span>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 11,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: textColor, transition: "color 500ms ease",
              marginLeft: 8,
            }}>→</span>
          </Link>
        </div>

        {/* ═══ FOOTER + PROGRESS ═══ */}
        <footer ref={footerRef} style={{
          padding: "0 var(--margin)", paddingBottom: 14,
          opacity: 0, position: "relative", zIndex: 20,
        }}>
          {/* Progress bar */}
          <div style={{
            height: 1, marginBottom: 10,
            backgroundColor: dark ? "rgba(255,252,245,0.10)" : "rgba(26,25,23,0.06)",
            position: "relative", transition: "background-color 500ms ease",
          }}>
            <div ref={progressRef} style={{
              position: "absolute", top: 0, left: 0, height: "100%",
              width: `${((centerIdx + 1) / ITEM_COUNT) * 100}%`,
              backgroundColor: textColor,
              transition: "background-color 500ms ease",
            }} />
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 10,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: mutedColor, transition: "color 500ms ease",
            }}>Brand & Product Design</span>
            <span ref={counterRef} style={{
              fontFamily: "var(--font-mono)", fontSize: 11,
              letterSpacing: "0.08em", fontVariantNumeric: "tabular-nums",
              color: textColor, transition: "color 500ms ease",
            }}>
              {String(centerIdx + 1).padStart(2, "0")}/{String(ITEM_COUNT).padStart(2, "0")}
            </span>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 10,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: mutedColor, transition: "color 500ms ease",
            }}>© 2026 HKJ</span>
          </div>
        </footer>

        {/* Grain + Cursor */}
        <div className="grain" />
        <CustomCursor />
      </div>
    </PageTransition>
  );
}
