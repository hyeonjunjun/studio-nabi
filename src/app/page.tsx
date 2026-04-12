"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { PIECES, type Piece } from "@/constants/pieces";
import { CONTACT_EMAIL } from "@/constants/contact";
import { useStore } from "@/store/useStore";
import BloomNode from "@/components/BloomNode";

const allPieces = [...PIECES].sort((a, b) => a.order - b.order);

/* ════════════════════════════════════════════════════════════
   Hotspot positions within the panoramic scene
   (normalized 0-1 coordinates — they move WITH the pan)
   ════════════════════════════════════════════════════════════ */

type LabelSide = "left" | "right" | "top" | "bottom";

interface Hotspot {
  slug: string;
  x: number;
  y: number;
  labelSide: LabelSide;
}

const HOTSPOTS: Hotspot[] = [
  { slug: "gyeol", x: 0.72, y: 0.34, labelSide: "left" },
  { slug: "sift", x: 0.26, y: 0.54, labelSide: "right" },
  { slug: "promptineer", x: 0.62, y: 0.68, labelSide: "right" },
  { slug: "clouds-at-sea", x: 0.40, y: 0.24, labelSide: "bottom" },
];

/* ════════════════════════════════════════════════════════════
   Cursor-follow label offset state per hotspot wrapper
   ════════════════════════════════════════════════════════════ */
interface LabelOffset {
  x: number;
  y: number;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export default function Home() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [labelOffsets, setLabelOffsets] = useState<Record<string, LabelOffset>>({});

  const sceneRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const panRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const frameCountRef = useRef(0);

  // T2.4 drag state
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const setPan = useStore((s) => s.setPan);
  const pan = useStore((s) => s.pan);

  // T2.2 transition origin
  const setTransitionOrigin = useStore((s) => s.setTransitionOrigin);

  useEffect(() => {
    /* Respect reduced motion preference */
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove);

    const animate = () => {
      const mouse = mouseRef.current;
      /* Map mouse (0-1) to pan (-1 to +1) — center is neutral */
      const targetX = (mouse.x - 0.5) * 2;
      const targetY = (mouse.y - 0.5) * 2;

      /* Critically damped spring — weighted but smooth, no overshoot.
         Stiffness 0.05 + friction 0.78 = responsive but still damped. */
      const stiffness = prefersReduced ? 0 : 0.05;
      const friction = 0.78;

      velocityRef.current.x += (targetX - panRef.current.x) * stiffness;
      velocityRef.current.y += (targetY - panRef.current.y) * stiffness;
      velocityRef.current.x *= friction;
      velocityRef.current.y *= friction;

      panRef.current.x += velocityRef.current.x;
      panRef.current.y += velocityRef.current.y;

      /* Velocity magnitude for instrumentation + blur */
      const speed = Math.hypot(velocityRef.current.x, velocityRef.current.y);

      if (sceneRef.current) {
        /* Scene scaled 1.25 → 12.5% overflow each axis.
           Pan amplitude: ±11% X, ±7% Y so the weight is visible. */
        const tx = -panRef.current.x * 11;
        const ty = -panRef.current.y * 7;
        sceneRef.current.style.transform = `scale(1.25) translate3d(${tx}%, ${ty}%, 0)`;
      }

      /* Velocity-driven atmospheric blur on vignette */
      if (!prefersReduced && vignetteRef.current) {
        const blurPx = Math.min(4, speed * 180);
        vignetteRef.current.style.filter = `blur(${blurPx}px)`;
      }

      /* Throttle store writes to every 2nd frame to reduce churn */
      frameCountRef.current += 1;
      if (frameCountRef.current % 2 === 0) {
        setPan({ x: panRef.current.x, y: panRef.current.y, speed });
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [setPan]);

  const hoveredPiece = hoveredSlug ? allPieces.find((p) => p.slug === hoveredSlug) : null;
  const accentColor = hoveredPiece?.accent && hoveredPiece.accent !== "" ? hoveredPiece.accent : "#C4A265";

  /* Velocity bar for HUD */
  const barChars = ["▏", "▎", "▍", "▌", "▋", "▊", "▉", "█"];
  const barLength = 12;
  const velIntensity = Math.min(1, pan.speed * 40);
  const filledCells = Math.round(velIntensity * barLength);
  const velocityBar = Array.from({ length: barLength }, (_, i) =>
    i < filledCells ? "█" : "▏"
  ).join("");

  const hudTransition = "border-color 0.6s var(--ease-swift), background-color 0.6s var(--ease-swift), box-shadow 0.6s var(--ease-swift)";

  return (
    <main
      id="main"
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
        background: "#0a0a0c",
        "--accent-hover": accentColor,
      } as React.CSSProperties}
      /* T2.4 — Drag-to-pan handlers */
      onPointerDown={(e) => {
        // Don't start drag if clicking a hotspot link
        const target = e.target as HTMLElement;
        if (target.closest("a[data-hotspot]")) return;
        isDraggingRef.current = true;
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        (e.currentTarget as HTMLElement).style.cursor = "grabbing";
      }}
      onPointerMove={(e) => {
        if (!isDraggingRef.current) return;
        const dx = (e.clientX - dragStartRef.current.x) / window.innerWidth * 2;
        const dy = (e.clientY - dragStartRef.current.y) / window.innerHeight * 2;
        panRef.current.x = Math.max(-1, Math.min(1, panRef.current.x - dx * 0.1));
        panRef.current.y = Math.max(-1, Math.min(1, panRef.current.y - dy * 0.1));
        dragStartRef.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={() => {
        isDraggingRef.current = false;
        (document.getElementById("main") as HTMLElement | null)?.style &&
          ((document.getElementById("main") as HTMLElement).style.cursor = "");
      }}
      onPointerLeave={() => { isDraggingRef.current = false; }}
    >
      {/* ════════════════════════════════════════════════════════
          LAYER 0 — The scene
          Full-viewport video, scaled for pan headroom.
          Transform updated via rAF (willChange transform).
          ════════════════════════════════════════════════════════ */}
      <div
        ref={sceneRef}
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: "center center",
          willChange: "transform",
          transform: "scale(1.25)",
        }}
      >
        <video
          src="/assets/cloudsatsea.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.7) saturate(0.85) contrast(1.08)",
          }}
        />

        {/* Warm atmospheric haze — golden hour push, accent-tinted */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 100% 80% at 60% 40%, color-mix(in oklab, var(--accent-hover) 6%, transparent) 0%, transparent 60%)",
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />

        {/* Subtle vignette — edges and bottom darken for HUD readability */}
        <div
          ref={vignetteRef}
          style={{
            position: "absolute",
            inset: 0,
            background: `
              linear-gradient(90deg, rgba(10,10,12,0.4) 0%, rgba(10,10,12,0.1) 20%, transparent 45%, transparent 80%, rgba(10,10,12,0.25) 100%),
              linear-gradient(180deg, rgba(10,10,12,0.25) 0%, transparent 15%, transparent 72%, rgba(10,10,12,0.5) 100%)
            `,
            pointerEvents: "none",
          }}
        />

        {/* ════════════════════════════════════════════════════
            LAYER 1 — Hotspots (children of scene, inherit pan)
            ════════════════════════════════════════════════════ */}
        {HOTSPOTS.map((hotspot) => {
          const piece = allPieces.find((p) => p.slug === hotspot.slug);
          if (!piece) return null;
          const isHovered = hoveredSlug === hotspot.slug;
          const isDimmed = hoveredSlug !== null && !isHovered;
          const offset = labelOffsets[hotspot.slug] ?? { x: 0, y: 0 };

          return (
            <div
              key={hotspot.slug}
              style={{
                position: "absolute",
                left: `${hotspot.x * 100}%`,
                top: `${hotspot.y * 100}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 10,
                pointerEvents: "auto",
              }}
              onMouseEnter={() => setHoveredSlug(hotspot.slug)}
              onMouseLeave={() => {
                setHoveredSlug(null);
                setLabelOffsets((prev) => ({ ...prev, [hotspot.slug]: { x: 0, y: 0 } }));
              }}
              /* T2.3 — Track cursor delta relative to hotspot dot */
              onMouseMove={(e) => {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                setLabelOffsets((prev) => ({
                  ...prev,
                  [hotspot.slug]: { x: e.clientX - cx, y: e.clientY - cy },
                }));
              }}
            >
              {/* The hotspot dot — link to case study */}
              {/* T2.2 — data-hotspot attribute + transition origin capture */}
              <Link
                href={`/work/${piece.slug}`}
                aria-label={`View ${piece.title} case study`}
                data-hotspot
                onClick={(e) => {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  setTransitionOrigin({
                    slug: piece.slug,
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                  });
                  // Don't preventDefault — let Next.js Link navigate
                }}
                style={{
                  position: "relative",
                  display: "block",
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  border: "1px solid rgba(196,162,101,0.7)",
                  background: isHovered ? "rgba(196,162,101,0.5)" : "rgba(196,162,101,0.18)",
                  boxShadow: isHovered
                    ? "0 0 24px 5px rgba(196,162,101,0.4), 0 0 48px 12px rgba(196,162,101,0.2), inset 0 0 8px rgba(255,240,200,0.7)"
                    : "0 0 14px 3px rgba(196,162,101,0.25), inset 0 0 4px rgba(255,240,200,0.4)",
                  opacity: isDimmed ? 0.4 : 1,
                  cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(.23,.88,.26,.92)",
                }}
              >
                {/* Inner pulsing ring */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: -5,
                    borderRadius: "50%",
                    border: "1px solid rgba(196,162,101,0.3)",
                    animation: "hotspot-pulse 1.8s ease-in-out infinite",
                  }}
                />
                {/* Second ring for depth */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: -12,
                    borderRadius: "50%",
                    border: "1px solid rgba(196,162,101,0.12)",
                    animation: "hotspot-pulse 2.0s ease-in-out 0.6s infinite",
                  }}
                />
                {/* Third ring — subtle far pulse */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: -20,
                    borderRadius: "50%",
                    border: "1px solid rgba(196,162,101,0.06)",
                    animation: "hotspot-pulse 2.2s ease-in-out 1.2s infinite",
                  }}
                />
              </Link>

              {/* Editorial label — appears on hover, cursor-aware */}
              {isHovered && (
                <HotspotLabel
                  piece={piece}
                  side={hotspot.labelSide}
                  accentColor={accentColor}
                  cursorOffsetX={offset.x}
                  cursorOffsetY={offset.y}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════════════════
          LAYER 2 — Glass HUD (fixed viewport position)
          ════════════════════════════════════════════════════════ */}

      {/* Top-left: HKJ wordmark — promoted to hero element */}
      <div style={{ position: "fixed", top: "clamp(20px, 3vh, 32px)", left: "clamp(28px, 3.5vw, 52px)", zIndex: 60 }}>
        <div className="font-mono uppercase" style={{
          fontSize: 9,
          letterSpacing: "0.14em",
          color: "rgba(255,255,255,0.35)",
          marginBottom: 4,
        }}>
          [HKJ_01_26 // STUDIO / NY]
        </div>
        <h1 className="font-display italic" style={{
          fontSize: "clamp(28px, 2.6vw, 38px)",
          fontWeight: 400,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: "rgba(255,255,255,0.96)",
          textShadow: "0 0 40px rgba(196,162,101,0.12)",
          margin: 0,
        }}>
          Hyeon Jun
        </h1>
      </div>

      {/* Bottom-left: Identity panel */}
      <div
        style={{
          position: "fixed",
          bottom: "clamp(20px, 3vh, 32px)",
          left: "clamp(28px, 3.5vw, 52px)",
          zIndex: 60,
          padding: "12px 18px",
          background: "rgba(10,10,12,0.28)",
          backdropFilter: "blur(18px) saturate(1.15)",
          WebkitBackdropFilter: "blur(18px) saturate(1.15)",
          border: `1px solid color-mix(in oklab, var(--accent-hover) 8%, rgba(255,255,255,0.05))`,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          transition: hudTransition,
        }}
      >
        {/* Corner registration marks */}
        <HudCorners color="color-mix(in oklab, var(--accent-hover) 40%, transparent)" />

        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "0.14em",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          [DESIGN_ENGINEER // NY]
        </span>
        <span
          className="font-display italic"
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.9)",
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
          }}
        >
          Hyeon Jun
        </span>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.04em",
            color: "rgba(196,162,101,0.65)",
            marginTop: 2,
            transition: "color 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(196,162,101,1)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(196,162,101,0.65)")}
        >
          {CONTACT_EMAIL}
        </a>
      </div>

      {/* Bottom-right: Live instrumentation HUD */}
      <div
        style={{
          position: "fixed",
          bottom: "clamp(20px, 3vh, 32px)",
          right: "clamp(28px, 3.5vw, 60px)",
          zIndex: 60,
          padding: "12px 18px",
          background: "rgba(10,10,12,0.28)",
          backdropFilter: "blur(18px) saturate(1.15)",
          WebkitBackdropFilter: "blur(18px) saturate(1.15)",
          border: `1px solid color-mix(in oklab, var(--accent-hover) 8%, rgba(255,255,255,0.05))`,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 4,
          minWidth: 190,
          transition: hudTransition,
        }}
      >
        <HudCorners color="color-mix(in oklab, var(--accent-hover) 40%, transparent)" />

        {/* Row 1: PAN readout */}
        <div
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.06em",
            fontVariantNumeric: "tabular-nums",
            display: "flex",
            gap: 6,
            alignItems: "baseline",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.35)" }}>[PAN]</span>
          <span style={{ color: "rgba(255,255,255,0.75)" }}>
            {(() => {
              const fx = Math.abs(pan.x) < 0.005 ? "+0.00" : `${pan.x >= 0 ? "+" : ""}${pan.x.toFixed(2)}`;
              const fy = Math.abs(pan.y) < 0.005 ? "+0.00" : `${pan.y >= 0 ? "+" : ""}${pan.y.toFixed(2)}`;
              return `[X ${fx} // Y ${fy}]`;
            })()}
          </span>
        </div>

        {/* Row 2: VEL bar */}
        <div
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.02em",
            fontVariantNumeric: "tabular-nums",
            display: "flex",
            gap: 6,
            alignItems: "baseline",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.35)" }}>[VEL]</span>
          <span style={{ color: "rgba(255,255,255,0.75)" }}>{velocityBar}</span>
        </div>

        {/* Row 3: SIG count — warms to accent on hover */}
        <div
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "0.14em",
            display: "flex",
            gap: 6,
            alignItems: "baseline",
            marginTop: 2,
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.35)" }}>[SIG]</span>
          <span
            style={{
              color: hoveredPiece?.accent && hoveredPiece.accent !== ""
                ? hoveredPiece.accent
                : "rgba(196,162,101,0.5)",
              transition: "color 0.6s",
            }}
          >
            {String(HOTSPOTS.length).padStart(2, "0")} Detected
          </span>
        </div>
      </div>

      {/* T2.1 — Bottom-center: Contextual prompt wrapped in BloomNode */}
      <BloomNode
        active={hoveredSlug !== null}
        accentColor={accentColor}
        cornerSize={10}
        noParticles={false}
        style={{
          position: "fixed",
          bottom: "clamp(20px, 3vh, 32px)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 60,
          padding: "14px 32px",
          background: "rgba(10,10,12,0.35)",
          backdropFilter: "blur(18px) saturate(1.15)",
          WebkitBackdropFilter: "blur(18px) saturate(1.15)",
          minWidth: 280,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          transition: "background 0.6s var(--ease-swift)",
        }}
      >
        <span className="font-mono uppercase" style={{
          fontSize: 10,
          letterSpacing: "0.14em",
          color: hoveredSlug ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.5)",
          transition: "color 0.4s var(--ease-swift)",
          whiteSpace: "nowrap",
        }}>
          {hoveredPiece ? `[→ CLICK TO ENTER ${hoveredPiece.title.toUpperCase()}]` : "[+ MOVE TO EXPLORE]"}
        </span>
      </BloomNode>

      {/* ════════════════════════════════════════════════════════
          Keyframes
          ════════════════════════════════════════════════════════ */}
      <style>{`
        @keyframes hotspot-pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.75; transform: scale(1.5); }
        }
        @keyframes label-emerge {
          0% { opacity: 0; transform: scale(0.90); filter: blur(4px); }
          100% { opacity: 1; transform: scale(1); filter: blur(0); }
        }
      `}</style>
    </main>
  );
}

/* ════════════════════════════════════════════════════════════
   Corner registration marks for glass HUD panels
   ════════════════════════════════════════════════════════════ */
function HudCorners({ color = "rgba(196,162,101,0.4)" }: { color?: string }) {
  const mark: React.CSSProperties = {
    position: "absolute",
    width: 5,
    height: 5,
    pointerEvents: "none",
  };
  return (
    <>
      <span aria-hidden style={{ ...mark, top: -1, left: -1, borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}` }} />
      <span aria-hidden style={{ ...mark, top: -1, right: -1, borderTop: `1px solid ${color}`, borderRight: `1px solid ${color}` }} />
      <span aria-hidden style={{ ...mark, bottom: -1, left: -1, borderBottom: `1px solid ${color}`, borderLeft: `1px solid ${color}` }} />
      <span aria-hidden style={{ ...mark, bottom: -1, right: -1, borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}` }} />
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   Editorial hotspot label — cursor-aware tilt (T2.3)
   ════════════════════════════════════════════════════════════ */
function HotspotLabel({
  piece,
  side,
  accentColor,
  cursorOffsetX = 0,
  cursorOffsetY = 0,
}: {
  piece: Piece;
  side: LabelSide;
  accentColor: string;
  cursorOffsetX?: number;
  cursorOffsetY?: number;
}) {
  const LINE_LEN = 56;
  const LABEL_OFFSET = 80;

  /* Cursor-follow tilt — Shcherban pattern */
  const tiltX = clamp(cursorOffsetX * 0.15, -14, 14);
  const tiltY = clamp(cursorOffsetY * 0.15, -14, 14);
  const tiltRot = clamp(cursorOffsetX * 0.08, -12, 12);

  /* Wrapper positioning — which side of the dot the label sits on */
  const wrapperStyle: Record<LabelSide, React.CSSProperties> = {
    left: { right: LABEL_OFFSET, top: "50%", transform: `translateY(-50%) translate(${tiltX}px, ${tiltY}px) rotate(${tiltRot}deg)` },
    right: { left: LABEL_OFFSET, top: "50%", transform: `translateY(-50%) translate(${tiltX}px, ${tiltY}px) rotate(${tiltRot}deg)` },
    top: { bottom: LABEL_OFFSET, left: "50%", transform: `translateX(-50%) translate(${tiltX}px, ${tiltY}px) rotate(${tiltRot}deg)` },
    bottom: { top: LABEL_OFFSET, left: "50%", transform: `translateX(-50%) translate(${tiltX}px, ${tiltY}px) rotate(${tiltRot}deg)` },
  };

  /* Connecting line — from edge of panel back toward hotspot dot */
  const lineStyle: Record<LabelSide, React.CSSProperties> = {
    left: {
      position: "absolute",
      right: -LINE_LEN,
      top: "50%",
      width: LINE_LEN,
      height: 1,
      background: "linear-gradient(90deg, rgba(196,162,101,0.7) 0%, rgba(196,162,101,0.15) 100%)",
    },
    right: {
      position: "absolute",
      left: -LINE_LEN,
      top: "50%",
      width: LINE_LEN,
      height: 1,
      background: "linear-gradient(270deg, rgba(196,162,101,0.7) 0%, rgba(196,162,101,0.15) 100%)",
    },
    top: {
      position: "absolute",
      bottom: -LINE_LEN,
      left: "50%",
      width: 1,
      height: LINE_LEN,
      background: "linear-gradient(180deg, rgba(196,162,101,0.7) 0%, rgba(196,162,101,0.15) 100%)",
    },
    bottom: {
      position: "absolute",
      top: -LINE_LEN,
      left: "50%",
      width: 1,
      height: LINE_LEN,
      background: "linear-gradient(0deg, rgba(196,162,101,0.7) 0%, rgba(196,162,101,0.15) 100%)",
    },
  };

  return (
    <div
      style={{
        position: "absolute",
        pointerEvents: "none",
        animation: "label-emerge 0.5s cubic-bezier(.2, .9, .2, 1) forwards",
        transformOrigin: "center",
        /* Cursor-follow transition — slight lag for organic feel */
        transition: "transform 0.25s cubic-bezier(.2,.9,.2,1)",
        ...wrapperStyle[side],
      }}
    >
      {/* Label panel */}
      <div
        style={{
          position: "relative",
          padding: "10px 16px",
          minWidth: 160,
          background: "rgba(10,10,12,0.75)",
          backdropFilter: "blur(14px) saturate(1.1)",
          WebkitBackdropFilter: "blur(14px) saturate(1.1)",
          border: "1px solid rgba(196,162,101,0.35)",
        }}
      >
        {/* Corner marks */}
        <HudCorners color="rgba(196,162,101,0.8)" />

        {/* Top meta row */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
          <span
            className="font-mono"
            style={{
              fontSize: 9,
              letterSpacing: "0.1em",
              color: accentColor,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {piece.number}
          </span>
          <span
            className="font-mono uppercase"
            style={{ fontSize: 9, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)" }}
          >
            · {piece.sector}
          </span>
        </div>

        {/* Title */}
        <div
          className="font-display italic"
          style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.95)",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
          }}
        >
          {piece.title}
        </div>

        {/* Status line */}
        <div
          className="font-mono uppercase"
          style={{
            fontSize: 8,
            letterSpacing: "0.14em",
            color: "rgba(255,255,255,0.35)",
            marginTop: 5,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {piece.status === "wip" ? "WIP · " : ""}
          {piece.year} · [→ CLICK TO ENTER]
        </div>

        {/* Connecting line back to hotspot */}
        <div style={lineStyle[side]} />
      </div>
    </div>
  );
}
