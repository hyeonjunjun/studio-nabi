"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";
import { PIECES } from "@/constants/pieces";

const projects = PIECES.filter((p) => p.type === "project").sort(
  (a, b) => a.order - b.order
);

export default function IndexView() {
  const selectedSlug = useTheaterStore((s) => s.selectedSlug);
  const setSelectedSlug = useTheaterStore((s) => s.setSelectedSlug);
  const expandDetail = useTheaterStore((s) => s.expandDetail);

  const selected = projects.find((p) => p.slug === selectedSlug) ?? projects[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Selector — just numbered text, nothing else */}
      <div className="flex flex-col" style={{ gap: 0 }}>
        {projects.map((p) => {
          const isActive = p.slug === selected.slug;
          return (
            <button
              key={p.slug}
              onClick={() => setSelectedSlug(p.slug)}
              className="text-left font-body"
              style={{
                padding: "12px 0",
                display: "flex",
                alignItems: "baseline",
                gap: 16,
                color: isActive ? "var(--fg)" : "var(--fg-3)",
                transition: "color 0.3s ease",
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.04em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {String(p.order).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontSize: 13,
                  letterSpacing: "-0.005em",
                }}
              >
                {p.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected project info — appears below with space */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected.slug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{ marginTop: 48 }}
        >
          {/* Type line */}
          <span
            className="font-mono uppercase block"
            style={{
              fontSize: 9,
              letterSpacing: "0.06em",
              color: "var(--fg-3)",
              marginBottom: 12,
            }}
          >
            {selected.tags.join(" / ")}
          </span>

          {/* Description */}
          <p
            className="font-display"
            style={{
              fontSize: 14,
              lineHeight: 1.65,
              letterSpacing: "-0.01em",
              color: "var(--fg-2)",
              fontWeight: 400,
            }}
          >
            {selected.description}
          </p>

          {/* View — just text, no arrow */}
          <button
            onClick={expandDetail}
            data-cursor-label="View"
            className="font-mono uppercase"
            style={{
              fontSize: 9,
              letterSpacing: "0.06em",
              color: "var(--fg-3)",
              marginTop: 32,
              display: "block",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-3)")}
          >
            View
          </button>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
