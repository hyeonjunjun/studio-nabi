"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Piece } from "@/constants/pieces";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = { pieces: Piece[] };

/**
 * GutterStrip — a vertical column of 16:9 paper-tone frames living in the
 * blank center of the index. Scrolls freely with the wheel; no snap, no
 * arrows, no dots. Videos play only when their frame is fully in view
 * (threshold 0.8 on the strip container). Reduced-motion clients see
 * poster frames only.
 */
export default function GutterStrip({ pieces }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const videos = Array.from(
      root.querySelectorAll<HTMLVideoElement>("video[data-strip-video]")
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        });
      },
      { root, threshold: 0.8 }
    );

    videos.forEach((v) => observer.observe(v));
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <div ref={rootRef} className="strip" aria-label="Project media, scrollable">
      <ol className="strip__list">
        {pieces.map((p, i) => (
          <li key={p.slug} className="strip__item">
            <Link
              href={`/work/${p.slug}`}
              className="strip__link"
              data-cursor-label="OPEN PROJECT"
            >
              <div className="strip__plate">
                {p.cover?.kind === "video" ? (
                  <video
                    data-strip-video
                    src={p.cover.src}
                    poster={p.cover.poster}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="strip__media"
                    data-fit={p.coverFit ?? "cover"}
                  />
                ) : p.cover?.kind === "image" ? (
                  <Image
                    src={p.cover.src}
                    alt={p.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 420px"
                    className="strip__media"
                    data-fit={p.coverFit ?? "cover"}
                  />
                ) : (
                  <span className="strip__placeholder">
                    In development &nbsp;—&nbsp; {p.year}
                  </span>
                )}
              </div>
              <p className="strip__caption">
                <span className="tabular">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="strip__slash" aria-hidden>/</span>
                <span>
                  {p.title
                    .replace(/:\s*[\u4E00-\u9FFF\uAC00-\uD7AF]+/, "")
                    .toLowerCase()}
                </span>
              </p>
            </Link>
          </li>
        ))}
      </ol>

      <style>{`
        .strip {
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 0 clamp(4px, 1vw, 16px);
        }
        .strip::-webkit-scrollbar { display: none; }

        /* Soft vertical fade top/bottom so scroll-hidden edges don't feel cut */
        .strip {
          -webkit-mask-image: linear-gradient(
            to bottom,
            transparent 0,
            black 24px,
            black calc(100% - 24px),
            transparent 100%
          );
          mask-image: linear-gradient(
            to bottom,
            transparent 0,
            black 24px,
            black calc(100% - 24px),
            transparent 100%
          );
        }

        .strip__list {
          list-style: none;
          margin: 0;
          padding: 12px 0;
          display: grid;
          gap: clamp(18px, 2.6vh, 32px);
        }
        .strip__item { margin: 0; }

        .strip__link { display: block; color: var(--ink); }

        .strip__plate {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: color-mix(in oklab, var(--paper) 94%, var(--ink) 6%);
          overflow: hidden;
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

        .strip__caption {
          margin: 8px 0 0;
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-3);
          transition: color 180ms var(--ease);
        }
        .strip__link:hover .strip__caption { color: var(--ink); }
        .strip__slash { color: var(--ink-4); }
      `}</style>
    </div>
  );
}
