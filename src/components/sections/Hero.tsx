"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useStudioStore } from "@/lib/store";
import { CONTACT_EMAIL } from "@/constants/contact";
import ListView from "@/components/hero/ListView";
import SliderView from "@/components/hero/SliderView";

type ViewMode = "list" | "slider";

const ease = [0.16, 1, 0.3, 1] as const;
const easeIn = [0.4, 0, 1, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease },
  },
};

const viewTransition = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.3, ease: easeIn },
  },
};

export default function Hero() {
  const isLoaded = useStudioStore((s) => s.isLoaded);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  return (
    <motion.section
      id="hero"
      className="relative flex flex-col"
      style={{
        height: "100svh",
        overflow: "hidden",
        backgroundColor: "var(--color-bg)",
      }}
      initial="hidden"
      animate={isLoaded ? "show" : "hidden"}
    >
      {/* ── Header ── */}
      <motion.div
        className="flex items-center padding-x-1"
        style={{
          paddingTop: "clamp(1.2rem, 2.5vh, 1.8rem)",
          paddingBottom: "clamp(1.2rem, 2.5vh, 1.8rem)",
        }}
        variants={fadeUp}
      >
        {/* Logo */}
        <span
          className="font-mono uppercase shrink-0"
          style={{
            fontSize: "11px",
            color: "var(--color-text)",
            letterSpacing: "0.08em",
          }}
        >
          HKJ
        </span>

        {/* View toggle */}
        <div className="flex gap-3 ml-4 relative">
          {(["list", "slider"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className="font-mono uppercase relative"
              style={{
                fontSize: "11px",
                letterSpacing: "0.1em",
                color:
                  viewMode === mode
                    ? "var(--color-text)"
                    : "var(--color-text-ghost)",
                transition: "color 0.3s ease",
              }}
            >
              {mode}
              {viewMode === mode && (
                <motion.div
                  layoutId="viewIndicator"
                  className="absolute -bottom-1 left-0 right-0 h-[1px]"
                  style={{ backgroundColor: "var(--color-text)" }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Nav links — pushed right */}
        <div className="flex gap-4 ml-auto">
          {(
            [
              { label: "Explore", href: "/explore" },
              { label: "About", href: "/about" },
            ] as const
          ).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "0.1em",
                color: "var(--color-text-ghost)",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "var(--color-text)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color =
                  "var(--color-text-ghost)")
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      </motion.div>

      {/* ── Content ── */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === "list" ? (
            <motion.div
              key="list"
              variants={viewTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              className="h-full"
            >
              <ListView />
            </motion.div>
          ) : (
            <motion.div
              key="slider"
              variants={viewTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              className="h-full"
            >
              <SliderView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      <motion.div
        className="padding-x-1 flex justify-end"
        style={{ paddingBottom: "clamp(1rem, 2vh, 1.5rem)" }}
        variants={fadeUp}
      >
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-mono uppercase"
          style={{
            fontSize: "11px",
            letterSpacing: "0.08em",
            color: "var(--color-text-ghost)",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLElement).style.color = "var(--color-text-dim)")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLElement).style.color = "var(--color-text-ghost)")
          }
        >
          {CONTACT_EMAIL}
        </a>
      </motion.div>
    </motion.section>
  );
}
