"use client";

import { useState } from "react";
import Image from "next/image";
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
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ═══ Background image — revealed behind type ═══ */}
      <AnimatePresence mode="wait">
        {selected.image && (
          <motion.div
            key={`bg-${selected.slug}`}
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src={selected.image}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dark overlay to keep text readable */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to right, rgba(10,10,11,0.92) 0%, rgba(10,10,11,0.7) 50%, rgba(10,10,11,0.85) 100%)",
        }}
      />

      {/* ═══ Corner metadata — Aristide Benoist style ═══ */}
      <div className="absolute inset-0 z-[3] pointer-events-none" style={{ padding: "clamp(32px,8vw,96px)" }}>
        {/* Top-left: section + count */}
        <span
          className="font-mono uppercase absolute"
          style={{
            top: 20,
            left: "clamp(32px,8vw,96px)",
            fontSize: 9,
            letterSpacing: "0.1em",
            color: "var(--fg-3)",
          }}
        >
          Index — {projects.length} Projects
        </span>

        {/* Top-right: coordinates */}
        <span
          className="font-mono absolute"
          style={{
            top: 20,
            right: "clamp(32px,8vw,96px)",
            fontSize: 9,
            letterSpacing: "0.06em",
            color: "var(--fg-3)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          40.7128° N, 74.0060° W
        </span>

        {/* Bottom-left: selected metadata */}
        <div
          className="absolute font-mono uppercase"
          style={{
            bottom: 16,
            left: "clamp(32px,8vw,96px)",
            fontSize: 9,
            letterSpacing: "0.06em",
            color: "var(--fg-3)",
          }}
        >
          <span style={{ color: "var(--fg-2)" }}>
            {selected.status === "wip" ? "WIP" : selected.year}
          </span>
          {" — "}
          {selected.tags.join(" / ")}
        </div>

        {/* Bottom-right: CTA */}
        <button
          onClick={expandDetail}
          data-cursor-label="View"
          className="font-mono uppercase absolute pointer-events-auto"
          style={{
            bottom: 16,
            right: "clamp(32px,8vw,96px)",
            fontSize: 9,
            letterSpacing: "0.08em",
            color: "var(--fg)",
          }}
        >
          View project →
        </button>
      </div>

      {/* ═══ Title stack — the composition ═══ */}
      <div
        className="absolute inset-0 z-[2] flex flex-col justify-center"
        style={{
          paddingLeft: "clamp(32px,8vw,96px)",
          paddingRight: "clamp(32px,8vw,96px)",
          gap: 0,
        }}
      >
        {projects.map((p) => {
          const isActive = p.slug === selected.slug;
          return (
            <button
              key={p.slug}
              onClick={() => setSelectedSlug(p.slug)}
              className="text-left flex items-baseline w-full transition-all duration-500 group"
              style={{
                padding: "clamp(8px,1vh,16px) 0",
                borderBottom: "1px solid var(--fg-4)",
              }}
            >
              {/* Number */}
              <span
                className="font-mono shrink-0"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.06em",
                  fontVariantNumeric: "tabular-nums",
                  width: 40,
                  color: isActive ? "var(--fg-2)" : "var(--fg-3)",
                  transition: "color 0.3s",
                }}
              >
                {String(p.order).padStart(2, "0")}
              </span>

              {/* Title — massive */}
              <span
                className="font-display block"
                style={{
                  fontSize: "clamp(48px, 8vw, 120px)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  fontWeight: 500,
                  color: isActive ? "var(--fg)" : "var(--fg-3)",
                  transition: "color 0.4s, opacity 0.4s",
                  opacity: isActive ? 1 : 0.3,
                }}
              >
                {p.title}
              </span>

              {/* Year — appears on active */}
              <span
                className="font-mono ml-auto shrink-0 self-end"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.06em",
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--fg-3)",
                  opacity: isActive ? 1 : 0,
                  transition: "opacity 0.3s",
                  paddingBottom: "clamp(12px,1.5vh,20px)",
                }}
              >
                {p.status === "wip" ? "WIP" : p.year}
              </span>
            </button>
          );
        })}

        {/* Description — below the stack */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`desc-${selected.slug}`}
            className="font-body"
            style={{
              fontSize: 12,
              lineHeight: 1.7,
              color: "var(--fg-3)",
              maxWidth: 320,
              marginTop: 24,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {selected.description}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
