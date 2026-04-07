"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";

export default function Preloader() {
  const preloaderDone = useTheaterStore((s) => s.preloaderDone);
  const setPreloaderDone = useTheaterStore((s) => s.setPreloaderDone);

  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(true);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const DURATION = 2200; // ms to roll 0 → 100
  const HOLD = 400; // ms to hold at 100 before dismiss

  useEffect(() => {
    if (preloaderDone) {
      setVisible(false);
      return;
    }

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / DURATION, 1);
      const value = Math.round(progress * 100);
      setCount(value);

      if (value < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Hold at 100, then dismiss
        setTimeout(() => setVisible(false), HOLD);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [preloaderDone]);

  // Don't render at all if already done
  if (preloaderDone) return null;

  const padded = String(count).padStart(3, "0");
  const fillWidth = `${count}%`;

  return (
    <AnimatePresence
      onExitComplete={() => {
        setPreloaderDone();
      }}
    >
      {visible && (
        <motion.div
          key="preloader"
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "#000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          {/* Counter */}
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.2em",
              fontVariantNumeric: "tabular-nums",
              color: "#fff",
            }}
          >
            {padded}
          </span>

          {/* Detail text */}
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 8,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--fg-3)",
            }}
          >
            40.7128&deg; N &mdash; Loading
          </span>

          {/* Progress line */}
          <div
            style={{
              width: 80,
              height: 1,
              background: "rgba(255,255,255,0.08)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: fillWidth,
                background: "rgba(255,255,255,0.4)",
                transition: "width 60ms linear",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
