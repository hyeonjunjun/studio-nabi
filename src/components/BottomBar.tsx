"use client";

import { useTheaterStore } from "@/store/useTheaterStore";
import { PIECES } from "@/constants/pieces";

export default function BottomBar() {
  const activeTab = useTheaterStore((s) => s.activeTab);
  const selectedSlug = useTheaterStore((s) => s.selectedSlug);

  const selectedPiece = PIECES.find((p) => p.slug === selectedSlug);
  const experimentCount = PIECES.filter((p) => p.type === "experiment").length;

  const contextText = (() => {
    switch (activeTab) {
      case "index":
        return selectedPiece ? String(selectedPiece.year) : "";
      case "archive":
        return `${experimentCount} collected`;
      case "about":
        return "New York";
    }
  })();

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between"
      style={{
        height: 40,
        paddingInline: "clamp(32px, 6vw, 80px)",
        borderTop: "1px solid var(--fg-4)",
      }}
    >
      <span
        className="font-mono uppercase"
        style={{
          fontSize: 9,
          fontWeight: 400,
          letterSpacing: "0.06em",
          lineHeight: 1.8,
          color: "var(--fg-3)",
        }}
      >
        {contextText}
      </span>
      <span
        className="font-mono"
        style={{
          fontSize: 9,
          fontWeight: 400,
          letterSpacing: "0.06em",
          lineHeight: 1.8,
          color: "var(--fg-3)",
        }}
      >
        v1.0
      </span>
    </div>
  );
}
