"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

/**
 * Cursor — precise white instrument dot.
 *
 * States:
 *   default  → 6px white dot
 *   link     → 4px white dot
 *   image    → 50px thin ring + "View"
 *   explore  → 60px thin ring + "Explore"
 *   play     → 50px thin ring + play triangle
 */

type CursorState = "default" | "link" | "image" | "explore" | "play";

export default function Cursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 35, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) return;

    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const playTarget = target.closest("[data-cursor='play']");
      if (playTarget) {
        setCursorState("play");
        return;
      }

      const exploreTarget = target.closest("[data-cursor='explore']");
      if (exploreTarget) {
        setCursorState("explore");
        return;
      }

      const imageTarget = target.closest(
        "[data-cursor='view'], img, video:not([data-cursor='explore'])"
      );
      if (imageTarget) {
        setCursorState("image");
        return;
      }

      const interactive = target.closest(
        "a, button, [role='button'], [role='link'], input, textarea, select"
      );
      if (interactive) {
        setCursorState("link");
        return;
      }

      setCursorState("default");
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", moveCursor, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  const isRing = cursorState === "image" || cursorState === "explore" || cursorState === "play";

  const sizeMap: Record<CursorState, number> = {
    default: 6,
    link: 4,
    image: 50,
    explore: 60,
    play: 50,
  };

  return (
    <>
      {/* Click Ripple */}
      <AnimatePresence>
        {isClicking && (
          <motion.div
            key="ripple"
            className="fixed top-0 left-0 pointer-events-none z-[9997] rounded-full"
            initial={{ width: 10, height: 10, opacity: 0.5 }}
            animate={{ width: 40, height: 40, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              x: cursorX,
              y: cursorY,
              translateX: "-50%",
              translateY: "-50%",
              border: "1px solid rgba(38, 38, 38, 0.2)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Main Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: sizeMap[cursorState],
          height: sizeMap[cursorState],
          opacity: 1,
        }}
        transition={{
          width: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
          height: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
        }}
      >
        <div
          className="absolute inset-0 rounded-full transition-all duration-200"
          style={{
            background: isRing ? "transparent" : "rgba(38, 38, 38, 0.9)",
            border: isRing ? "1px solid rgba(38, 38, 38, 0.5)" : "none",
            opacity: cursorState === "link" ? 0.8 : 1,
          }}
        />

        {cursorState === "image" && (
          <motion.span
            className="absolute inset-0 flex items-center justify-center font-mono uppercase tracking-[0.2em]"
            style={{ fontSize: "8px", color: "var(--color-text-dim)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            View
          </motion.span>
        )}

        {cursorState === "explore" && (
          <motion.span
            className="absolute inset-0 flex items-center justify-center font-mono uppercase tracking-[0.15em]"
            style={{ fontSize: "8px", color: "var(--color-text-dim)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            Explore
          </motion.span>
        )}

        {cursorState === "play" && (
          <motion.span
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
              <path d="M1 1L9 6L1 11V1Z" fill="rgba(38,38,38,0.7)" />
            </svg>
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
