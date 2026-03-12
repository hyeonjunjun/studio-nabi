"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ProjectHighlight } from "@/constants/projects";
import NothingEqLoader from "@/components/ui/NothingEqLoader";

interface HighlightAccordionProps {
  highlights: ProjectHighlight[];
}

/**
 * HighlightAccordion — Tracklist-style expandable rows for project highlights.
 * Mimics a playlist where each "track" expands to reveal challenge + recipe.
 */
export default function HighlightAccordion({
  highlights,
}: HighlightAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full">
      {highlights.map((h, i) => {
        const isOpen = openIndex === i;
        const num = String(i + 1).padStart(2, "0");

        return (
          <div
            key={h.id}
            style={{ borderBottom: "1px solid var(--color-border)" }}
          >
            {/* Row header — clickable */}
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full text-left group"
              style={{ padding: "1rem 0" }}
            >
              <div
                className="grid items-center gap-4"
                style={{
                  gridTemplateColumns: "40px 1fr 40px",
                }}
              >
                {/* Index */}
                <span
                  className="font-mono"
                  style={{
                    fontSize: "var(--text-xs)",
                    color: isOpen
                      ? "var(--color-accent)"
                      : "var(--color-text-dim)",
                    letterSpacing: "0.05em",
                    transition: "color 0.3s",
                  }}
                >
                  {num}
                </span>

                {/* Title */}
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: "var(--text-sm)",
                    letterSpacing: "0.1em",
                    color: isOpen
                      ? "var(--color-text)"
                      : "var(--color-text-dim)",
                    transition: "color 0.3s",
                  }}
                >
                  {h.title}
                </span>

                {/* EQ indicator */}
                <div
                  className="flex justify-end"
                  style={{
                    opacity: isOpen ? 1 : 0,
                    transition: "opacity 0.3s",
                  }}
                >
                  <NothingEqLoader
                    bars={3}
                    segmentsPerBar={3}
                    size={3}
                    gap={1}
                  />
                </div>
              </div>
            </button>

            {/* Expanded content */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div
                    className="pb-6 grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8"
                    style={{ paddingLeft: "40px" }}
                  >
                    <div className="space-y-4">
                      <p
                        className="font-sans leading-relaxed"
                        style={{
                          fontSize: "var(--text-base)",
                          color: "var(--color-text-dim)",
                        }}
                      >
                        {h.description}
                      </p>
                    </div>

                    {/* Challenge + Recipe card */}
                    <div
                      className="p-4"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      <span
                        className="micro block mb-2"
                        style={{ color: "var(--color-text-ghost)" }}
                      >
                        Challenge
                      </span>
                      <p
                        className="font-sans leading-relaxed mb-4"
                        style={{
                          fontSize: "var(--text-sm)",
                          color: "var(--color-text-dim)",
                        }}
                      >
                        {h.challenge}
                      </p>
                      {h.recipe && (
                        <>
                          <span
                            className="micro block mb-2"
                            style={{ color: "var(--color-text-ghost)" }}
                          >
                            Recipe
                          </span>
                          <p
                            className="font-mono uppercase"
                            style={{
                              fontSize: "var(--text-xs)",
                              letterSpacing: "0.1em",
                              color: "var(--color-accent-warm)",
                            }}
                          >
                            {h.recipe}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
