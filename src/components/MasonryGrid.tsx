"use client";

import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";
import { GrainTexture } from "@/components/GrainTexture";
import type { GridItem } from "@/constants/grid-items";

function GridCard({ item }: { item: GridItem }) {
  const isColorField = !item.image && !item.video && item.bg;
  const aspectRatio =
    item.size === "large" ? "16 / 9" :
    item.size === "tall" ? "3 / 4" :
    item.size === "small" ? "1 / 1" :
    "16 / 9"; /* medium */

  const typeLabel = item.type === "work" ? "Work" :
                    item.type === "brand" ? "Brand" :
                    "Exploration";

  return (
    <TransitionLink
      href={item.href}
      flipId={item.type === "work" ? `project-${item.id}` : undefined}
      className="masonry-item"
      data-size={item.size}
      style={{ textDecoration: "none", display: "block" }}
    >
      {/* Visual */}
      <div
        data-cover-image
        style={{
          position: "relative",
          aspectRatio,
          borderRadius: "6px",
          overflow: "hidden",
          backgroundColor: item.bg || "var(--ink-whisper)",
        }}
      >
        {item.video ? (
          <video
            src={item.video}
            autoPlay
            muted
            loop
            playsInline
            className="cover-image"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="cover-image"
            style={{ objectFit: "cover" }}
            sizes={item.size === "large" ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
            placeholder={item.imageBlur ? "blur" : undefined}
            blurDataURL={item.imageBlur}
          />
        ) : isColorField ? (
          <>
            <GrainTexture dark={true} />
            <span
              className="font-display"
              style={{
                position: "absolute",
                bottom: "var(--space-comfortable)",
                left: "var(--space-comfortable)",
                fontSize: "clamp(16px, 2vw, 20px)",
                fontStyle: "italic",
                color: item.text || "rgba(255,252,245,0.8)",
                zIndex: 3,
              }}
            >
              {item.title}
            </span>
          </>
        ) : null}

        {/* WIP badge */}
        {item.status === "wip" && (
          <span
            className="font-mono"
            style={{
              position: "absolute",
              top: "var(--space-compact)",
              right: "var(--space-compact)",
              fontSize: "9px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: item.text || "var(--ink-muted)",
              backgroundColor: "rgba(0,0,0,0.15)",
              padding: "3px 8px",
              borderRadius: "100px",
              zIndex: 3,
            }}
          >
            In progress
          </span>
        )}
      </div>

      {/* Meta — below the image (not on color-field cards, they have inline title) */}
      {!isColorField && (
        <div style={{ paddingTop: "var(--space-small)" }}>
          <p
            className="font-display"
            style={{
              fontSize: "clamp(14px, 1.8vw, 18px)",
              fontStyle: "italic",
              lineHeight: 1.3,
              color: "var(--ink-primary)",
            }}
          >
            {item.title}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-small)",
              marginTop: "4px",
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: "var(--text-meta)",
                letterSpacing: "var(--tracking-label)",
                textTransform: "uppercase",
                color: "var(--ink-muted)",
              }}
            >
              {typeLabel}
            </span>
            <span style={{ width: 2, height: 2, borderRadius: "50%", backgroundColor: "var(--ink-faint)" }} />
            <span
              className="font-mono"
              style={{
                fontSize: "var(--text-meta)",
                letterSpacing: "var(--tracking-label)",
                color: "var(--ink-muted)",
              }}
            >
              {item.year}
            </span>
          </div>
        </div>
      )}
    </TransitionLink>
  );
}

export default function MasonryGrid({ items }: { items: GridItem[] }) {
  return (
    <div className="masonry-grid">
      {items.map((item) => (
        <GridCard key={item.id} item={item} />
      ))}
    </div>
  );
}
