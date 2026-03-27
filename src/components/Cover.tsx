"use client";

import Link from "next/link";
import { Piece } from "@/constants/pieces";

interface CoverProps {
  piece: Piece;
  index: number;
  onHover?: (index: number | null) => void;
  isHovered?: boolean;
  isDimmed?: boolean;
}

function hexLuminance(hex: string): number {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function Cover({ piece, index, onHover, isHovered, isDimmed }: CoverProps) {
  const href = piece.type === "project" ? `/work/${piece.slug}` : `/lab/${piece.slug}`;
  const num = String(index + 1).padStart(2, "0");
  const isLight = hexLuminance(piece.cover.bg) > 0.35;
  const grainBlend = isLight ? "multiply" : "soft-light";

  return (
    <Link
      href={href}
      style={{ textDecoration: "none", display: "block" }}
      onMouseEnter={() => onHover?.(index)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div
        data-flip-id={piece.slug}
        style={{
          position: "relative",
          aspectRatio: "1",
          borderRadius: 6,
          overflow: "hidden",
          backgroundColor: piece.cover.bg,
          color: piece.cover.text,
          cursor: "pointer",
          transform: isHovered ? "translateY(-3px) scale(1.03)" : "translateY(0) scale(1)",
          boxShadow: isHovered
            ? "0 8px 24px rgba(35,32,28, 0.08)"
            : "0 0 0 rgba(35,32,28, 0)",
          opacity: isDimmed ? 0.85 : 1,
          transition:
            "transform 350ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 350ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease",
        }}
        onMouseDown={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = "scale(0.97)";
          el.style.transitionDuration = "80ms";
        }}
        onMouseUp={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = "";
          el.style.transitionDuration = "";
        }}
      >
        {/* Grain overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            filter: "url(#grain)",
            opacity: 0.25,
            mixBlendMode: grainBlend as React.CSSProperties["mixBlendMode"],
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Number */}
        <span
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            padding: 12,
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(10px, 1.2vw, 14px)",
            opacity: 0.3,
            zIndex: 2,
            lineHeight: 1,
          }}
        >
          {num}
        </span>

        {/* Title */}
        <span
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            padding: 12,
            fontFamily: "var(--font-display)",
            fontSize: "clamp(12px, 1.5vw, 18px)",
            fontWeight: 400,
            lineHeight: 1.2,
            zIndex: 2,
            letterSpacing: "0.01em",
          }}
        >
          {piece.title}
        </span>
      </div>
    </Link>
  );
}

export default Cover;
