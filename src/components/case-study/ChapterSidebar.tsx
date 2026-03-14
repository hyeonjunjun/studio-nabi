"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


interface Chapter {
  id: string;
  num: string;
  label: string;
}

interface ChapterSidebarProps {
  chapters: Chapter[];
}

/**
 * ChapterSidebar — Pinned left sidebar with chapter dots.
 * Each dot lights up as the corresponding chapter enters view.
 * Minimal, precise, mechanical.
 */
export default function ChapterSidebar({ chapters }: ChapterSidebarProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    chapters.forEach((ch) => {
      const el = document.getElementById(ch.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveId(ch.id);
          }
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [chapters]);

  const scrollToChapter = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-start gap-4"
      aria-label="Chapter navigation"
    >
      {chapters.map((ch) => {
        const isActive = activeId === ch.id;

        return (
          <button
            key={ch.id}
            onClick={() => scrollToChapter(ch.id)}
            className="group flex items-center gap-3 transition-all duration-300"
            aria-current={isActive ? "step" : undefined}
          >
            {/* Dot */}
            <div
              className="relative flex items-center justify-center transition-all duration-300"
              style={{
                width: isActive ? 10 : 6,
                height: isActive ? 10 : 6,
                borderRadius: "1px",
                backgroundColor: isActive
                  ? "var(--color-accent)"
                  : "var(--color-border-strong)",
              }}
            />

            {/* Label — visible on active or hover */}
            <AnimatePresence>
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.25 }}
                  className="font-mono uppercase whitespace-nowrap"
                  style={{
                    fontSize: "var(--text-micro)",
                    letterSpacing: "0.2em",
                    color: "var(--color-text-dim)",
                  }}
                >
                  {ch.num} {ch.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        );
      })}

    </nav>
  );
}
