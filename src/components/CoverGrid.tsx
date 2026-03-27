"use client";

import { useState } from "react";
import { Piece } from "@/constants/pieces";
import { Cover } from "@/components/Cover";

interface CoverGridProps {
  pieces: Piece[];
}

function getColCount(count: number): number {
  if (count <= 6) return 3;
  if (count <= 12) return 4;
  if (count <= 20) return 5;
  return 6;
}

export function CoverGrid({ pieces }: CoverGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const cols = getColCount(pieces.length);

  return (
    <div
      style={{
        height: "calc(100vh - 56px)",
        display: "grid",
        alignContent: "center",
        padding: "16px 24px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: 10,
        }}
      >
        {pieces.map((piece, i) => (
          <Cover
            key={piece.slug}
            piece={piece}
            index={i}
            onHover={setHoveredIndex}
            isHovered={hoveredIndex === i}
            isDimmed={hoveredIndex !== null && hoveredIndex !== i}
          />
        ))}
      </div>
    </div>
  );
}

export default CoverGrid;
