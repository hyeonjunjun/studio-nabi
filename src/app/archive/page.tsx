"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import GameLink from "@/components/GameLink";
import { PIECES } from "@/constants/pieces";

const experiments = PIECES.filter((p) => p.type === "experiment").sort(
  (a, b) => a.order - b.order
);

export default function ArchivePage() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const selected = experiments.find((e) => e.slug === selectedSlug);

  return (
    <main id="main" className="game-screen">
      {/* Background — subtle, not competing */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(74,138,140,0.03), transparent 60%)",
          }}
        />
      </div>

      {/* Top bar */}
      <div
        className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between h-14"
        style={{ paddingInline: "clamp(32px, 8vw, 96px)" }}
      >
        <GameLink
          href="/"
          className="font-mono text-[11px] tracking-[0.04em] hover:opacity-60 transition-opacity"
          style={{ color: "var(--fg-2)" }}
          data-cursor="link"
        >
          ← Back
        </GameLink>
        <span
          className="font-mono text-[10px] tracking-[0.12em] uppercase"
          style={{ color: "var(--fg-3)" }}
        >
          Archive — Experiments
        </span>
      </div>

      {/* Inventory grid — center of screen */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center"
        style={{ paddingInline: "clamp(32px, 8vw, 96px)" }}
      >
        <motion.div
          className="w-full max-w-[800px] ui-panel ui-panel--cool"
          style={{ padding: 0 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Panel header */}
          <div className="ui-panel-header">
            <span>Collection</span>
            <span>{experiments.length} {experiments.length === 1 ? "item" : "items"}</span>
          </div>

          {/* Grid of items */}
          <div className="grid grid-cols-4 gap-px max-md:grid-cols-2" style={{ padding: 1 }}>
            {experiments.map((piece, i) => {
              const isSelected = piece.slug === selectedSlug;
              return (
                <motion.button
                  key={piece.slug}
                  onClick={() =>
                    setSelectedSlug(isSelected ? null : piece.slug)
                  }
                  className="relative aspect-square overflow-hidden text-left transition-all duration-500 group"
                  style={{
                    border: isSelected
                      ? "1px solid var(--accent-cool-1)"
                      : "1px solid var(--fg-4)",
                    background: "var(--bg-elevated)",
                  }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.4 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  data-cursor="link"
                >
                  {/* Media */}
                  {piece.video ? (
                    <video
                      src={piece.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                    />
                  ) : piece.image ? (
                    <Image
                      src={piece.image}
                      alt={piece.title}
                      fill
                      sizes="25vw"
                      className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                    />
                  ) : (
                    <div
                      className="w-full h-full opacity-40"
                      style={{ background: piece.cover.bg }}
                    />
                  )}

                  {/* Bottom label */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                    <span
                      className="block font-mono text-[9px] uppercase tracking-[0.1em]"
                      style={{ color: "var(--fg-2)" }}
                    >
                      {piece.title}
                    </span>
                  </div>

                  {/* Selection corner accents */}
                  {isSelected && (
                    <>
                      <motion.div
                        className="absolute top-0 left-0 w-3 h-px"
                        style={{ background: "var(--accent-cool-1)" }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                      <motion.div
                        className="absolute top-0 left-0 h-3 w-px"
                        style={{ background: "var(--accent-cool-1)" }}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.2, delay: 0.05 }}
                      />
                      <motion.div
                        className="absolute bottom-0 right-0 w-3 h-px"
                        style={{ background: "var(--accent-cool-1)" }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                      />
                      <motion.div
                        className="absolute bottom-0 right-0 h-3 w-px"
                        style={{ background: "var(--accent-cool-1)" }}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.2, delay: 0.15 }}
                      />
                    </>
                  )}
                </motion.button>
              );
            })}

            {/* Empty inventory slots */}
            {Array.from({ length: Math.max(0, 8 - experiments.length) }).map(
              (_, i) => (
                <motion.div
                  key={`empty-${i}`}
                  className="aspect-square flex items-center justify-center"
                  style={{
                    border: "1px solid var(--fg-4)",
                    background: "var(--bg-elevated)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 + i * 0.05 }}
                >
                  {/* Empty slot cross mark */}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" opacity="0.15">
                    <line x1="4" y1="4" x2="12" y2="12" stroke="var(--fg)" strokeWidth="0.5" />
                    <line x1="12" y1="4" x2="4" y2="12" stroke="var(--fg)" strokeWidth="0.5" />
                  </svg>
                </motion.div>
              )
            )}
          </div>

        </motion.div>

          {/* Detail panel — appears below the grid panel */}
          <AnimatePresence>
            {selected && (
              <motion.div
                className="mt-4 ui-panel ui-panel--cool flex items-start gap-6"
                style={{ padding: "20px 24px" }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="w-px self-stretch"
                  style={{ background: "var(--accent-cool-1)", opacity: 0.3 }}
                />
                <div>
                  <h2
                    className="font-display text-[clamp(20px,2.5vw,28px)] font-normal tracking-[-0.02em] mb-2"
                    style={{ color: "var(--fg)" }}
                  >
                    {selected.title}
                  </h2>
                  <p className="text-[13px] leading-[1.7] mb-4 max-w-[400px]" style={{ color: "var(--fg-2)" }}>
                    {selected.description}
                  </p>
                  <div className="flex items-center gap-4">
                    {selected.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 border rounded-sm"
                        style={{ color: "var(--fg-3)", borderColor: "var(--fg-4)" }}
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="font-mono text-[10px] tabular-nums" style={{ color: "var(--fg-3)" }}>
                      {selected.status === "wip" ? "WIP" : selected.year}
                    </span>
                  </div>
                  <GameLink
                    href={`/archive/${selected.slug}`}
                    className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.1em] mt-4 group"
                    style={{ color: "var(--fg-2)" }}
                    data-cursor="link"
                  >
                    <span className="group-hover:text-[var(--fg)] transition-colors duration-300">
                      View details
                    </span>
                    <div
                      className="w-5 group-hover:w-8 h-px transition-all duration-500"
                      style={{ background: "linear-gradient(90deg, var(--accent-cool-1), transparent)" }}
                    />
                  </GameLink>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
      </div>

      {/* Bottom bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between h-10"
        style={{
          paddingInline: "clamp(32px, 8vw, 96px)",
          borderTop: "1px solid rgba(240,238,232,0.06)",
        }}
      >
        <span className="font-mono text-[9px] tracking-[0.06em]" style={{ color: "var(--fg-3)" }}>
          {experiments.length} collected
        </span>
        <span className="font-mono text-[9px] tracking-[0.06em]" style={{ color: "var(--fg-3)" }}>
          Archive
        </span>
      </div>
    </main>
  );
}
