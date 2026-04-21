"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type CatalogCover =
  | { kind: "video"; src: string; poster?: string }
  | { kind: "image"; src: string };

export type CatalogFrameProps = {
  slug: string;
  title: string;
  sector: string;
  year: number;
  cover?: CatalogCover;
  coverFit?: "cover" | "center";
};

export default function CatalogFrame({
  slug,
  title,
  sector,
  year,
  cover,
  coverFit = "cover",
}: CatalogFrameProps) {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.35, rootMargin: "-10% 0px" }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <Link href={`/work/${slug}`} className="catalog-frame">
      <div className="catalog-frame__plate">
        {cover?.kind === "video" ? (
          <video
            ref={videoRef}
            src={cover.src}
            poster={cover.poster}
            muted
            loop
            playsInline
            preload="metadata"
            autoPlay={!reduced}
            className="catalog-frame__media"
            data-fit={coverFit}
          />
        ) : cover?.kind === "image" ? (
          <Image
            src={cover.src}
            alt={title}
            fill
            sizes="(max-width: 900px) 100vw, 1100px"
            className="catalog-frame__media"
            data-fit={coverFit}
            priority={false}
          />
        ) : (
          <span className="catalog-frame__placeholder" aria-hidden>
            In development &nbsp;—&nbsp; {year}
          </span>
        )}
      </div>

      <p className="catalog-frame__caption">
        <span>{title.toLowerCase()}</span>
        <span className="catalog-frame__sep" aria-hidden>·</span>
        <span>{sector.toLowerCase()}</span>
        <span className="catalog-frame__sep" aria-hidden>·</span>
        <span className="tabular">{year}</span>
        <span className="catalog-frame__chev" aria-hidden>→</span>
      </p>

      <style>{`
        .catalog-frame {
          display: block;
          color: var(--ink);
          text-decoration: none;
        }

        .catalog-frame__plate {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: color-mix(in oklab, var(--paper) 94%, var(--ink) 6%);
          overflow: hidden;
        }

        .catalog-frame__media {
          object-fit: cover;
        }
        video.catalog-frame__media {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
        }
        .catalog-frame__media[data-fit="center"] {
          object-fit: contain;
          object-position: center;
          padding: 4% 0;
          background: transparent;
        }

        .catalog-frame__placeholder {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--ink-4);
          white-space: nowrap;
        }

        .catalog-frame__caption {
          margin: 14px 0 0;
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-3);
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 10px;
          transition: color 180ms var(--ease);
        }
        .catalog-frame__sep { color: var(--ink-4); }
        .catalog-frame__chev {
          margin-left: auto;
          color: var(--ink-4);
          transition: transform 180ms var(--ease), color 180ms var(--ease);
        }
        .catalog-frame:hover .catalog-frame__caption { color: var(--ink-2); }
        .catalog-frame:hover .catalog-frame__chev {
          color: var(--ink-2);
          transform: translateX(3px);
        }

        @media (max-width: 640px) {
          .catalog-frame__caption { font-size: 9px; letter-spacing: 0.16em; gap: 8px; }
        }
      `}</style>
    </Link>
  );
}
