"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";
import { PIECES } from "@/constants/pieces";

const projects = PIECES.filter((p) => p.type === "project").sort(
  (a, b) => a.order - b.order
);

const anim = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.4 },
};

export default function IndexView() {
  const selectedSlug = useTheaterStore((s) => s.selectedSlug);
  const setSelectedSlug = useTheaterStore((s) => s.setSelectedSlug);
  const expandDetail = useTheaterStore((s) => s.expandDetail);

  const selected = projects.find((p) => p.slug === selectedSlug) ?? projects[0];

  return (
    <motion.div className="w-full h-full relative" {...anim}>
      {/* ═══ Large title — poster scale, positioned low-left ═══ */}
      <AnimatePresence mode="wait">
        <motion.h2
          key={selected.slug}
          className="font-display absolute"
          style={{
            fontSize: "clamp(80px, 12vw, 160px)",
            letterSpacing: "-0.04em",
            lineHeight: 0.85,
            color: "var(--fg)",
            fontWeight: 600,
            bottom: 80,
            left: 0,
            right: -60, // bleeds into the 3D zone
            pointerEvents: "none",
            zIndex: 2,
            mixBlendMode: "exclusion",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {selected.title}
        </motion.h2>
      </AnimatePresence>

      {/* ═══ Selector — minimal, top area ═══ */}
      <div
        className="absolute"
        style={{ top: 0, left: 0, zIndex: 3 }}
      >
        <span
          className="font-mono uppercase block"
          style={{
            fontSize: 9,
            letterSpacing: "0.1em",
            color: "var(--fg-3)",
            marginBottom: 20,
          }}
        >
          Index
        </span>

        <div className="flex flex-col" style={{ gap: 0 }}>
          {projects.map((p) => {
            const isActive = p.slug === selected.slug;
            return (
              <button
                key={p.slug}
                onClick={() => setSelectedSlug(p.slug)}
                className="flex items-baseline text-left transition-all duration-300"
                style={{
                  gap: 10,
                  padding: "6px 0",
                  color: isActive ? "var(--fg)" : "var(--fg-3)",
                }}
              >
                <span
                  className="font-mono"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.06em",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {String(p.order).padStart(2, "0")}
                </span>
                <span
                  className="font-body"
                  style={{
                    fontSize: 12,
                    letterSpacing: "0",
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
                  {p.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ Metadata block — anchored below selector ═══ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`meta-${selected.slug}`}
          className="absolute"
          style={{ top: 160, left: 0, zIndex: 3 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {/* Metadata in structured rows */}
          <div
            className="font-mono uppercase"
            style={{
              fontSize: 9,
              letterSpacing: "0.06em",
              lineHeight: 2,
              color: "var(--fg-3)",
            }}
          >
            <span style={{ color: "var(--fg-2)" }}>
              {selected.status === "wip" ? "In progress" : selected.year}
            </span>
            {" — "}
            {selected.tags.join(" / ")}
            {" — "}
            {selected.status === "wip" ? "WIP" : "Shipped"}
          </div>

          {/* Description */}
          <p
            className="font-body"
            style={{
              fontSize: 12,
              lineHeight: 1.7,
              letterSpacing: "0",
              color: "var(--fg-3)",
              maxWidth: 280,
              marginTop: 12,
            }}
          >
            {selected.description}
          </p>

          {/* CTA */}
          <button
            onClick={expandDetail}
            data-cursor-label="View"
            className="font-mono uppercase"
            style={{
              fontSize: 9,
              letterSpacing: "0.08em",
              color: "var(--fg)",
              marginTop: 20,
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
