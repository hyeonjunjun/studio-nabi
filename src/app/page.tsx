"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap, SplitText } from "@/lib/gsap";
import { PIECES } from "@/constants/pieces";
import PageTransition from "@/components/PageTransition";

const pieces = [...PIECES].sort((a, b) => a.order - b.order);

/*
 * HKJ Brand Lookbook
 *
 * Structure:
 * ┌──────────────────────────────────────────────┐
 * │ HKJ  Design & Engineering  Seoul  About      │  ← brand bar
 * │                                               │
 * │              H  K  J                          │  ← logotype (massive)
 * │            Studio ®                           │
 * │                                               │
 * │ ┌───┐ ┌─────┐ ┌──┐ ┌────┐ ┌───┐ ┌─────┐    │  ← lookbook gallery
 * │ │   │ │     │ │  │ │    │ │   │ │     │    │     (horizontal scroll)
 * │ └───┘ └─────┘ └──┘ └────┘ └───┘ └─────┘    │
 * │ Gyeol  Sift          Spring  Rain  Clouds   │  ← titles
 * │                                               │
 * │ 01/06          Lookbook 2024—2026     brand  │  ← status bar
 * └──────────────────────────────────────────────┘
 */

// Gallery layout — varied widths and heights
const GALLERY_LAYOUT: Array<{
  w: string;
  h: string;
  align: "flex-start" | "flex-end" | "center";
}> = [
  { w: "clamp(220px, 26vw, 400px)", h: "52vh", align: "flex-end" },
  { w: "clamp(320px, 38vw, 540px)", h: "68vh", align: "flex-start" },
  { w: "clamp(160px, 18vw, 260px)", h: "38vh", align: "center" },
  { w: "clamp(260px, 30vw, 440px)", h: "60vh", align: "flex-end" },
  { w: "clamp(180px, 22vw, 320px)", h: "44vh", align: "flex-start" },
  { w: "clamp(340px, 40vw, 560px)", h: "72vh", align: "center" },
];

function isDarkBg(hex: string): boolean {
  const c = hex.replace("#", "");
  if (c.length < 6) return false;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}

export default function Home() {
  const logoRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const statusRef = useRef<HTMLElement>(null);

  const scrollX = useRef(0);
  const targetX = useRef(0);
  const maxScroll = useRef(0);
  const activeRef = useRef(0);
  const [centerIndex, setCenterIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // ── Entrance choreography ──
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      [barRef, statusRef].forEach((r) => {
        if (r.current) r.current.style.opacity = "1";
      });
      if (logoRef.current) logoRef.current.style.opacity = "1";
      if (subRef.current) subRef.current.style.opacity = "1";
      itemRefs.current.forEach((el) => {
        if (el) el.style.clipPath = "none";
      });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    // Phase 1: Logotype chars
    if (logoRef.current) {
      logoRef.current.style.opacity = "1";
      const split = new SplitText(logoRef.current, { type: "chars" });
      tl.fromTo(
        split.chars,
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.04 },
        0.3
      );
    }

    // Phase 2: Subtitle
    tl.fromTo(
      subRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.6 },
      0.8
    );

    // Phase 3: Brand bar + status bar
    tl.fromTo(
      barRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      1.0
    );
    tl.fromTo(
      statusRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      1.1
    );

    // Phase 4: Gallery items — clip-path reveal
    tl.fromTo(
      itemRefs.current.filter(Boolean),
      { clipPath: "inset(100% 0% 0% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.9,
        stagger: 0.06,
        ease: "circ.inOut",
      },
      1.0
    );
  }, []);

  // ── Horizontal scroll (wheel → translateX) ──
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const updateBounds = () => {
      maxScroll.current = Math.max(0, track.scrollWidth - container.clientWidth);
    };
    updateBounds();
    window.addEventListener("resize", updateBounds);

    let raf: number;
    const tick = () => {
      const prev = scrollX.current;
      scrollX.current += (targetX.current - scrollX.current) * 0.08;
      const velocity = scrollX.current - prev;
      const skew = gsap.utils.clamp(-1.5, 1.5, velocity * 0.2);
      track.style.transform = `translateX(${-scrollX.current}px) skewX(${skew}deg)`;

      // Center detection
      const center = container.clientWidth / 2 + scrollX.current;
      let closest = 0;
      let minDist = Infinity;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const mid = el.offsetLeft + el.offsetWidth / 2;
        const dist = Math.abs(mid - center);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      if (closest !== activeRef.current) {
        activeRef.current = closest;
        setCenterIndex(closest);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetX.current = gsap.utils.clamp(0, maxScroll.current, targetX.current + (e.deltaY || e.deltaX));
    };

    let tx0 = 0, ts0 = 0;
    const onTS = (e: TouchEvent) => { tx0 = e.touches[0].clientX; ts0 = targetX.current; };
    const onTM = (e: TouchEvent) => {
      e.preventDefault();
      targetX.current = gsap.utils.clamp(0, maxScroll.current, ts0 + (tx0 - e.touches[0].clientX));
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTS, { passive: true });
    container.addEventListener("touchmove", onTM, { passive: false });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateBounds);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTS);
      container.removeEventListener("touchmove", onTM);
    };
  }, []);

  const activePiece = pieces[centerIndex];

  return (
    <PageTransition>
      <div
        style={{
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--paper)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* ── Brand Bar (top) ── */}
        <header
          ref={barRef}
          style={{
            height: 40,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 var(--grid-margin)",
            opacity: 0,
          }}
        >
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <span className="font-mono" style={{ fontSize: "var(--text-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--ink-full)" }}>
              HKJ
            </span>
            <span className="font-mono" style={{ fontSize: "var(--text-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--ink-muted)" }}>
              Design & Engineering
            </span>
            <span className="font-mono" style={{ fontSize: "var(--text-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--ink-muted)" }}>
              Seoul
            </span>
          </div>
          <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {["Work", "Lab", "About"].map((label) => (
              <Link
                key={label}
                href={`/${label.toLowerCase()}`}
                className="font-mono"
                style={{
                  fontSize: "var(--text-label)",
                  letterSpacing: "var(--tracking-label)",
                  textTransform: "uppercase",
                  color: "var(--ink-secondary)",
                  textDecoration: "none",
                  transition: "color var(--dur-hover) var(--ease-out)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ink-full)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ink-secondary)"; }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </header>

        {/* ── Logotype (center, massive) ── */}
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(12px, 2vh, 32px) var(--grid-margin)",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <h1
            ref={logoRef}
            className="font-display"
            style={{
              fontSize: "var(--text-logotype)",
              fontWeight: 400,
              lineHeight: "var(--leading-logotype)",
              letterSpacing: "var(--tracking-logotype)",
              color: "var(--ink-full)",
              textAlign: "center",
              overflow: "hidden",
              opacity: 0,
            }}
          >
            HKJ
          </h1>
          <span
            ref={subRef}
            className="font-mono"
            style={{
              fontSize: "var(--text-label)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
              marginTop: 8,
              opacity: 0,
            }}
          >
            Studio ®
          </span>
        </div>

        {/* ── Lookbook Gallery ── */}
        <div
          ref={containerRef}
          id="main"
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            cursor: "grab",
            userSelect: "none",
          }}
        >
          <div
            ref={trackRef}
            style={{
              display: "flex",
              gap: 16,
              height: "100%",
              padding: "0 var(--grid-margin)",
              alignItems: "center",
              willChange: "transform",
            }}
          >
            {pieces.map((piece, i) => {
              const layout = GALLERY_LAYOUT[i % GALLERY_LAYOUT.length];
              const href = piece.type === "project" ? `/work/${piece.slug}` : `/lab/${piece.slug}`;
              const isHovered = hoveredIndex === i;
              const isDimmed = hoveredIndex !== null && hoveredIndex !== i;
              const num = String(i + 1).padStart(2, "0");
              const isDark = isDarkBg(piece.cover.bg);
              const mutedOnCover = isDark ? "rgba(255,252,245,0.40)" : "rgba(42,37,32,0.28)";

              return (
                <div
                  key={piece.slug}
                  ref={(el) => { itemRefs.current[i] = el; }}
                  style={{
                    flexShrink: 0,
                    width: layout.w,
                    alignSelf: layout.align,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    clipPath: "inset(100% 0% 0% 0%)",
                    opacity: isDimmed ? 0.4 : 1,
                    transition: "opacity 300ms var(--ease-out)",
                  }}
                >
                  {/* Image */}
                  <Link
                    href={href}
                    style={{
                      display: "block",
                      width: "100%",
                      height: layout.h,
                      position: "relative",
                      backgroundColor: piece.cover.bg,
                      overflow: "hidden",
                      textDecoration: "none",
                    }}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    aria-label={`View ${piece.title}`}
                  >
                    {piece.image && (
                      <Image
                        src={piece.image}
                        alt={piece.title}
                        fill
                        sizes="(max-width: 768px) 60vw, 30vw"
                        style={{
                          objectFit: "cover",
                          transition: "transform 600ms var(--ease-out)",
                          transform: isHovered ? "scale(1.05)" : "scale(1)",
                        }}
                        priority={i < 3}
                      />
                    )}
                    {/* Grain */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0.05,
                        filter: "url(#grain)",
                        background: piece.cover.bg,
                        mixBlendMode: "multiply",
                        pointerEvents: "none",
                      }}
                    />
                    {/* Number */}
                    <span
                      className="font-mono"
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 12,
                        fontSize: "var(--text-label)",
                        letterSpacing: "var(--tracking-label)",
                        color: mutedOnCover,
                        zIndex: 2,
                      }}
                    >
                      {num}
                    </span>
                  </Link>

                  {/* Caption — always visible */}
                  <div
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <span
                      className="font-body"
                      style={{ fontSize: "var(--text-body)", color: "var(--ink-90)" }}
                    >
                      {piece.title}
                    </span>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: "var(--text-label)",
                        letterSpacing: "var(--tracking-label)",
                        textTransform: "uppercase",
                        color: "var(--ink-muted)",
                      }}
                    >
                      {piece.tags[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Status Bar (bottom) ── */}
        <footer
          ref={statusRef}
          style={{
            height: 36,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 var(--grid-margin)",
            borderTop: "1px solid var(--ink-ghost)",
            opacity: 0,
          }}
        >
          <span className="font-mono" style={{ fontSize: "var(--text-label)", letterSpacing: "var(--tracking-label)", fontVariantNumeric: "tabular-nums", color: "var(--ink-secondary)" }}>
            {String(centerIndex + 1).padStart(2, "0")} / {String(pieces.length).padStart(2, "0")}
          </span>
          <span className="font-mono" style={{ fontSize: "var(--text-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--ink-muted)" }}>
            Lookbook 2024—2026
          </span>
          <span className="font-mono" style={{ fontSize: "var(--text-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--ink-muted)" }}>
            {activePiece?.tags[0]}
          </span>
        </footer>

        {/* Grain overlay */}
        <div className="grain-overlay" />
      </div>
    </PageTransition>
  );
}
