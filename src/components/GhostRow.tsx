"use client";

interface GhostRowProps {
  index: number;
  year: string;
  tagline: string;
  showThumbnail?: boolean;
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
  showThumbnail = false,
}: GhostRowProps) {
  const num = String(index + 1).padStart(2, "0");
  const ghostIndex = index - 4; // Ghosts start at position 5 (index 4)
  const title = GHOST_TITLES[ghostIndex] || GHOST_TITLES[0];

  return (
    <div
      className="flex items-center gap-6"
      style={{
        padding: showThumbnail ? "20px var(--page-px)" : "24px var(--page-px)",
        borderBottom: "1px solid var(--color-border)",
        borderLeft: "2px solid transparent",
        opacity: 0.4,
      }}
    >
      {/* Ghost thumbnail placeholder */}
      {showThumbnail && (
        <div
          className="flex-shrink-0"
          style={{
            width: 160,
            height: 100,
            borderRadius: 2,
            backgroundColor: "var(--color-surface)",
          }}
        />
      )}

      {/* Number */}
      <span
        className="font-mono flex-shrink-0"
        style={{
          fontSize: "var(--text-micro)",
          letterSpacing: "0.1em",
          color: "var(--color-text-ghost)",
          width: "2.5em",
        }}
      >
        [{num}]
      </span>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div
          className="font-sans font-medium uppercase"
          style={{
            fontSize: "var(--text-base)",
            letterSpacing: "0.04em",
            color: "var(--color-text-ghost)",
          }}
        >
          {title}
        </div>
        <div
          className="font-mono mt-1"
          style={{
            fontSize: "var(--text-micro)",
            letterSpacing: "0.1em",
            color: "var(--color-text-ghost)",
          }}
        >
          ??? — {year}
        </div>
        <div
          className="font-serif italic mt-0.5"
          style={{
            fontSize: "var(--text-micro)",
            color: "var(--color-text-ghost)",
          }}
        >
          {tagline}
        </div>
      </div>
    </div>
  );
}
