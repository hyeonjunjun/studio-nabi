"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudioStore } from "@/lib/store";

/**
 * CurtainPreloader — Bone & Charcoal Instrument
 *
 * Full bone background.
 * Corner mono label: HKJ STUDIO — LOADING 37%
 * Thin charcoal line draws across screen to 100%.
 * Line "snaps" — fast, feels like a breath.
 */

export default function CurtainPreloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const setLoaded = useStudioStore((s) => s.setLoaded);
  const isLoaded = useStudioStore((s) => s.isLoaded);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Skip on revisit
    if (sessionStorage.getItem("hkj-loaded-v3")) {
      setLoaded(true);
      setVisible(false);
      return;
    }

    const start = performance.now();
    const duration = 1800; // 1.8s — a breath, not a gate

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // Ease-out curve for natural deceleration
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem("hkj-loaded-v3", "1");
        setLoaded(true);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [setLoaded]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col justify-between"
          style={{ backgroundColor: "var(--color-bg)" }}
          initial={{ opacity: 1 }}
          animate={isLoaded ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: isLoaded ? 0.15 : 0 }}
          onAnimationComplete={() => {
            if (isLoaded) setVisible(false);
          }}
        >
          {/* Corner label */}
          <div
            className="flex items-center justify-between w-full"
            style={{ padding: "var(--page-px)" }}
          >
            <span
              className="font-mono uppercase"
              style={{
                fontSize: "var(--text-xs)",
                letterSpacing: "0.15em",
                color: "var(--color-text-ghost)",
              }}
            >
              HKJ Studio
            </span>
            <span
              className="font-mono uppercase tabular-nums"
              style={{
                fontSize: "var(--text-xs)",
                letterSpacing: "0.15em",
                color: "var(--color-text-ghost)",
              }}
            >
              Loading {progress}%
            </span>
          </div>

          {/* Center — thin charcoal line */}
          <div className="flex-1 flex items-center" style={{ padding: "0 var(--page-px)" }}>
            <div className="w-full h-px" style={{ backgroundColor: "var(--color-border)" }}>
              <motion.div
                className="h-full origin-left"
                style={{
                  backgroundColor: "var(--color-text)",
                  width: `${progress}%`,
                  transition: "width 60ms linear",
                }}
              />
            </div>
          </div>

          {/* Bottom spacer for symmetry */}
          <div style={{ padding: "var(--page-px)" }}>
            <span
              className="font-mono uppercase"
              style={{
                fontSize: "var(--text-micro)",
                letterSpacing: "0.2em",
                color: "var(--color-text-ghost)",
              }}
            >
              Design Engineering
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
