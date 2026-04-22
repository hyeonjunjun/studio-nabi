"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import type { Piece } from "@/constants/pieces";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  pieces: Piece[];
  /** Called with the logical 0-based project index whenever the active project changes. */
  onActiveChange?: (activeIdx: number) => void;
};

/**
 * GutterStrip — wheel-driven snap carousel of project media.
 *
 * One wheel tick = one project. Each transition animates for ~920ms
 * with a cubic ease-in-out. Parallax is applied per-frame during the
 * animation at factor 0.08 so the media moves in lockstep with the
 * scroll snap. Linear, non-looping — the catalog is finite and
 * honest about its size.
 *
 * Reduced-motion clients see static framing, no parallax, no snap.
 */
const SNAP_DURATION = 920;
const PARALLAX = 0.08;
const WHEEL_LOCK_MS = 280;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function GutterStrip({ pieces, onActiveChange }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const domIdxRef = useRef(0);
  const animIdRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);
  const wheelLockRef = useRef(false);

  const getItems = useCallback(() => {
    const strip = rootRef.current;
    if (!strip) return [] as HTMLElement[];
    return Array.from(strip.querySelectorAll<HTMLElement>(".strip__item"));
  }, []);

  const scrollTopForDomIdx = useCallback(
    (domIdx: number) => {
      const strip = rootRef.current;
      if (!strip) return 0;
      const items = getItems();
      const target = items[domIdx];
      if (!target) return 0;
      return (
        target.offsetTop + target.offsetHeight / 2 - strip.clientHeight / 2
      );
    },
    [getItems]
  );

  const applyParallax = useCallback(() => {
    const strip = rootRef.current;
    if (!strip || reduced) return;
    const stripRect = strip.getBoundingClientRect();
    const stripCenter = stripRect.top + stripRect.height / 2;
    getItems().forEach((item) => {
      const media = item.querySelector<HTMLElement>(".strip__media-wrap");
      if (!media) return;
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      const distance = itemCenter - stripCenter;
      const offset = distance * PARALLAX;
      media.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });
  }, [getItems, reduced]);

  const animateTo = useCallback(
    (newDomIdx: number) => {
      const strip = rootRef.current;
      if (!strip) return;

      const clamped = Math.max(0, Math.min(pieces.length - 1, newDomIdx));

      if (animIdRef.current !== null) {
        cancelAnimationFrame(animIdRef.current);
      }

      const startTop = strip.scrollTop;
      const targetTop = scrollTopForDomIdx(clamped);
      const delta = targetTop - startTop;

      if (Math.abs(delta) < 0.5) {
        domIdxRef.current = clamped;
        return;
      }

      const startTime = performance.now();
      isAnimatingRef.current = true;

      const frame = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / SNAP_DURATION, 1);
        const eased = easeInOutCubic(t);
        strip.scrollTop = startTop + delta * eased;
        applyParallax();

        if (t < 1) {
          animIdRef.current = requestAnimationFrame(frame);
        } else {
          animIdRef.current = null;
          isAnimatingRef.current = false;
          domIdxRef.current = clamped;
        }
      };
      animIdRef.current = requestAnimationFrame(frame);
    },
    [applyParallax, pieces.length, scrollTopForDomIdx]
  );

  // Initial seek + announce
  useEffect(() => {
    const strip = rootRef.current;
    if (!strip) return;

    const init = () => {
      domIdxRef.current = 0;
      strip.scrollTop = scrollTopForDomIdx(0);
      applyParallax();
      onActiveChange?.(0);
    };

    requestAnimationFrame(() => requestAnimationFrame(init));

    const ro = new ResizeObserver(() => {
      if (!isAnimatingRef.current) {
        strip.scrollTop = scrollTopForDomIdx(domIdxRef.current);
        applyParallax();
      }
    });
    ro.observe(strip);

    return () => {
      ro.disconnect();
      if (animIdRef.current !== null) cancelAnimationFrame(animIdRef.current);
    };
  }, [scrollTopForDomIdx, applyParallax, onActiveChange]);

  // Wheel → snap
  useEffect(() => {
    const strip = rootRef.current;
    if (!strip) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (reduced) return;
      if (isAnimatingRef.current || wheelLockRef.current) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      const next = domIdxRef.current + direction;

      // Don't bounce at boundaries — just hold position.
      if (next < 0 || next >= pieces.length) return;

      wheelLockRef.current = true;
      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, WHEEL_LOCK_MS);

      onActiveChange?.(next);
      animateTo(next);
    };

    strip.addEventListener("wheel", handleWheel, { passive: false });
    return () => strip.removeEventListener("wheel", handleWheel);
  }, [animateTo, onActiveChange, pieces.length, reduced]);

  return (
    <div
      ref={rootRef}
      className="strip"
      aria-label="Project media, wheel-to-advance"
      data-lenis-prevent
    >
      <ol className="strip__list">
        {pieces.map((p) => (
          <li
            key={p.slug}
            className="strip__item"
            style={{ width: `${p.coverWidth ?? 100}%` }}
          >
            <Link href={`/work/${p.slug}`} className="strip__link">
              <div
                className="strip__plate"
                style={{ aspectRatio: p.coverAspect ?? "16 / 9" }}
              >
                <div className="strip__media-wrap">
                  {p.cover?.kind === "video" ? (
                    <video
                      src={p.cover.src}
                      poster={p.cover.poster}
                      muted
                      loop
                      playsInline
                      autoPlay={!reduced}
                      preload="metadata"
                      className="strip__media"
                      data-fit={p.coverFit ?? "cover"}
                    />
                  ) : p.cover?.kind === "image" ? (
                    <Image
                      src={p.cover.src}
                      alt={p.title}
                      fill
                      sizes="(max-width: 900px) 100vw, 720px"
                      className="strip__media"
                      data-fit={p.coverFit ?? "cover"}
                    />
                  ) : (
                    <span className="strip__placeholder">
                      In development &nbsp;—&nbsp; {p.year}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ol>

      <style>{`
        .strip {
          height: 100%;
          overflow-y: hidden;
          overflow-x: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-mask-image: linear-gradient(
            to bottom,
            transparent 0,
            black 32px,
            black calc(100% - 32px),
            transparent 100%
          );
          mask-image: linear-gradient(
            to bottom,
            transparent 0,
            black 32px,
            black calc(100% - 32px),
            transparent 100%
          );
        }
        .strip::-webkit-scrollbar { display: none; }

        .strip__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }
        .strip__item { margin: 0; flex: 0 0 auto; }

        .strip__link { display: block; color: var(--ink); }

        .strip__plate {
          position: relative;
          width: 100%;
          background: color-mix(in oklab, var(--paper) 94%, var(--ink) 6%);
          overflow: hidden;
        }

        /* Matched to parallax factor 0.08 — no leak, no waste */
        .strip__media-wrap {
          position: absolute;
          top: -18%;
          left: 0;
          width: 100%;
          height: 136%;
          will-change: transform;
        }

        video.strip__media {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .strip__media { object-fit: cover; }
        .strip__media[data-fit="center"] {
          object-fit: contain;
          object-position: center;
          padding: 4% 0;
        }

        .strip__placeholder {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--ink-4);
          white-space: nowrap;
        }

        @media (prefers-reduced-motion: reduce) {
          .strip__media-wrap { transform: none !important; }
        }
      `}</style>
    </div>
  );
}
