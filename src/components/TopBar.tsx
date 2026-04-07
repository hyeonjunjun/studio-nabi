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
        height: 52,
        paddingInline: "clamp(32px, 6vw, 80px)",
        borderBottom: "1px solid var(--fg-4)",
      }}
    >
      {/* Left: mark or back */}
      {isDetailExpanded ? (
        <button
          onClick={collapseDetail}
          data-cursor-label="Back"
          className="font-mono uppercase"
          style={{
            fontSize: 10,
            fontWeight: 400,
            letterSpacing: "0.08em",
            color: "var(--fg-2)",
          }}
        >
          ← BACK
        </button>
      ) : (
        <span
          className="font-display"
          style={{
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            lineHeight: 1,
            color: "var(--fg)",
          }}
        >
          HKJ
        </span>
      )}

      {/* Right: tabs or title */}
      {isDetailExpanded ? (
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
          {selectedPiece?.title ?? ""}
        </span>
      ) : (
        <div className="flex items-center gap-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative font-mono uppercase"
              style={{
                fontSize: 10,
                fontWeight: 400,
                letterSpacing: "0.08em",
                lineHeight: 1,
                paddingBottom: 4,
                color: activeTab === tab ? "var(--fg)" : "var(--fg-3)",
                transition: "color 0.2s ease",
              }}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0"
                  style={{ height: 1, background: "var(--fg)" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
