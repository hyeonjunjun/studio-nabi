"use client";

import { motion } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";
import { PIECES } from "@/constants/pieces";

const TABS = ["index", "archive", "about"] as const;

export default function TopBar() {
  const activeTab = useTheaterStore((s) => s.activeTab);
  const setActiveTab = useTheaterStore((s) => s.setActiveTab);
  const isDetailExpanded = useTheaterStore((s) => s.isDetailExpanded);
  const collapseDetail = useTheaterStore((s) => s.collapseDetail);
  const selectedSlug = useTheaterStore((s) => s.selectedSlug);

  const selectedPiece = PIECES.find((p) => p.slug === selectedSlug);

  return (
    <div
      className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between"
      style={{
        height: 48,
        paddingInline: "clamp(24px, 5vw, 64px)",
      }}
    >
      {isDetailExpanded ? (
        <button
          onClick={collapseDetail}
          data-cursor-label="Back"
          className="font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.06em",
            color: "var(--fg-3)",
          }}
        >
          Back
        </button>
      ) : (
        <span
          className="font-body"
          style={{
            fontSize: 13,
            letterSpacing: "-0.01em",
            color: "var(--fg)",
            fontWeight: 400,
          }}
        >
          HKJ
        </span>
      )}

      {isDetailExpanded ? (
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "0.06em",
            color: "var(--fg-3)",
          }}
        >
          {selectedPiece?.title ?? ""}
        </span>
      ) : (
        <div className="flex items-center" style={{ gap: 24 }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative font-mono uppercase"
              style={{
                fontSize: 10,
                letterSpacing: "0.06em",
                color: activeTab === tab ? "var(--fg)" : "var(--fg-3)",
                transition: "color 0.3s ease",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
