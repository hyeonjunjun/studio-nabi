"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";
import { PIECES } from "@/constants/pieces";

const projects = PIECES.filter((p) => p.type === "project").sort(
  (a, b) => a.order - b.order
);

const anim = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
  transition: { duration: 0.3 },
};

export default function IndexView() {
  const selectedSlug = useTheaterStore((s) => s.selectedSlug);
  const setSelectedSlug = useTheaterStore((s) => s.setSelectedSlug);
  const expandDetail = useTheaterStore((s) => s.expandDetail);

  const selected = projects.find((p) => p.slug === selectedSlug) ?? projects[0];

  return (
    <motion.div className="w-full" {...anim}>
      {/* ── Section label ── */}
      <span
        className="font-mono uppercase block"
        style={{
          fontSize: 10,
          letterSpacing: "0.1em",
          color: "var(--fg-3)",
          marginBottom: 32,
        }}
      >
        Projects
      </span>

      {/* ── Selector ── */}
      <div className="flex flex-col" style={{ gap: 2 }}>
        {projects.map((p) => {
          const isActive = p.slug === selected.slug;
          return (
            <button
              key={p.slug}
              onClick={() => setSelectedSlug(p.slug)}
              className="flex items-baseline text-left transition-all duration-200"
              style={{
                gap: 14,
                padding: "8px 0",
                color: isActive ? "var(--fg)" : "var(--fg-3)",
                borderBottom: "1px solid var(--fg-4)",
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.06em",
                  fontVariantNumeric: "tabular-nums",
                  width: 24,
                  flexShrink: 0,
                }}
              >
                {String(p.order).padStart(2, "0")}
              </span>
              <span
                className="font-body"
                style={{
                  fontSize: 14,
                  letterSpacing: "-0.01em",
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                {p.title}
              </span>
              {isActive && (
                <span
                  className="font-mono ml-auto"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.06em",
                    color: "var(--fg-3)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {p.status === "wip" ? "WIP" : p.year}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Selected project detail ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected.slug}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          style={{ marginTop: 32 }}
        >
          {/* Title — large display */}
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(28px, 3.5vw, 40px)",
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              color: "var(--fg)",
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            {selected.title}
          </h2>

          {/* Metadata row */}
          <div
            className="flex font-mono uppercase"
            style={{
              gap: 20,
              fontSize: 9,
              letterSpacing: "0.06em",
              color: "var(--fg-3)",
              marginBottom: 20,
              paddingBottom: 16,
              borderBottom: "1px solid var(--fg-4)",
            }}
          >
            <span>{selected.status === "wip" ? "In progress" : `${selected.year}`}</span>
            <span>{selected.tags.join(" / ")}</span>
            <span>{selected.status === "wip" ? "WIP" : "Shipped"}</span>
          </div>

          {/* Description */}
          <p
            className="font-body"
            style={{
              fontSize: 13,
              lineHeight: 1.75,
              letterSpacing: "-0.005em",
              color: "var(--fg-2)",
              maxWidth: 360,
            }}
          >
            {selected.description}
          </p>

          {/* View project */}
          <button
            onClick={expandDetail}
            data-cursor-label="View"
            className="font-mono uppercase"
            style={{
              fontSize: 9,
              letterSpacing: "0.08em",
              color: "var(--fg)",
              marginTop: 24,
              display: "block",
            }}
          >
            View project →
          </button>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
