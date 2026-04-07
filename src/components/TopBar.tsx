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
      className="absolute top-0 left-0 right-0 z-20 h-12 flex items-center justify-between"
      style={{
        paddingInline: "clamp(32px, 8vw, 96px)",
        borderBottom: "1px solid var(--fg-4)",
      }}
    >
      {/* Left side */}
      <div>
        {isDetailExpanded ? (
          <button
            onClick={collapseDetail}
            data-cursor-label="Back"
            className="font-mono text-[11px] uppercase tracking-[0.08em]"
            style={{ color: "var(--fg)" }}
          >
            &larr; Back
          </button>
        ) : (
          <span
            className="font-mono text-[11px] uppercase tracking-[0.08em]"
            style={{ color: "var(--fg)" }}
          >
            HKJ
          </span>
        )}
      </div>

      {/* Right side */}
      <div>
        {isDetailExpanded ? (
          <span
            className="font-mono text-[9px] uppercase tracking-[0.08em]"
            style={{ color: "var(--fg-3)" }}
          >
            {selectedPiece?.title ?? ""}
          </span>
        ) : (
          <div className="flex items-center gap-4">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative font-mono text-[10px] uppercase tracking-[0.08em] pb-1"
                style={{
                  color:
                    activeTab === tab ? "var(--fg)" : "var(--fg-3)",
                }}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-px"
                    style={{ background: "var(--fg)" }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
