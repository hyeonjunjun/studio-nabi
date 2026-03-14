"use client";

interface GhostRowProps {
  index: number;
  year: string;
  tagline: string;
}

const BLOCK_CHARS = "█";

function randomBlocks(): string {
  const len = 8 + Math.floor(Math.random() * 10);
  return BLOCK_CHARS.repeat(len);
}

// Generate once at module level so they don't change on re-render
const GHOST_TITLES = [randomBlocks(), randomBlocks()];

export default function GhostRow({
  index,
  year,
  tagline,
}: GhostRowProps) {
  const num = String(index + 1).padStart(2, "0");
  const ghostIndex = index - 4; // Ghosts start at position 5 (index 4)
  const title = GHOST_TITLES[ghostIndex] || GHOST_TITLES[0];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2.5rem 1fr auto auto",
        alignItems: "baseline",
        gap: "clamp(1rem, 2vw, 2rem)",
        padding: "clamp(1.25rem, 2.5vh, 2rem) var(--page-px)",
        borderBottom: "1px solid var(--color-border)",
        opacity: 0.35,
      }}
    >
      {/* Col 1: Number */}
      <span
        className="font-mono"
        style={{
          fontSize: "var(--text-micro)",
          letterSpacing: "0.1em",
          color: "var(--color-text-ghost)",
        }}
      >
        {num}
      </span>

      {/* Col 2: Title + tagline */}
      <div className="min-w-0">
        <span
          className="font-sans font-medium uppercase"
          style={{
            fontSize: "var(--text-lg)",
            letterSpacing: "0.02em",
            color: "var(--color-text-ghost)",
            lineHeight: 1.2,
          }}
        >
          {title}
        </span>
        <div
          className="font-serif italic mt-1"
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-ghost)",
          }}
        >
          {tagline}
        </div>
      </div>

      {/* Col 3: Sector */}
      <span
        className="font-mono hidden md:block"
        style={{
          fontSize: "var(--text-micro)",
          letterSpacing: "0.1em",
          color: "var(--color-text-ghost)",
          textAlign: "right",
        }}
      >
        ???
      </span>

      {/* Col 4: Year */}
      <span
        className="font-mono"
        style={{
          fontSize: "var(--text-micro)",
          letterSpacing: "0.1em",
          color: "var(--color-text-ghost)",
          textAlign: "right",
        }}
      >
        {year}
      </span>
    </div>
  );
}
