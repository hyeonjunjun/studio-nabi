"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useAnimationFrame,
} from "framer-motion";
import { useCursorState } from "@/hooks/useCursorState";

const POS_SPRING = { stiffness: 500, damping: 35, mass: 0.3 };
const HZ_SPRING = { stiffness: 100, damping: 20 };

export default function Cursor() {
  const { velocity, label, isIdle, isTouch } = useCursorState();

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springX = useSpring(mouseX, POS_SPRING);
  const springY = useSpring(mouseY, POS_SPRING);

  // Hz spring: maps velocity to frequency display
  const rawHz = useMotionValue(0);
  const smoothHz = useSpring(rawHz, HZ_SPRING);

  // Bridge spring value to React for rendering
  const hzRef = useRef("0.00");
  const [, forceRender] = useState(0);

  // Update rawHz when velocity changes
  useEffect(() => {
    rawHz.set(Math.min(120, velocity * 0.8));
  }, [velocity, rawHz]);

  // Read smoothHz every frame and update ref
  useAnimationFrame(() => {
    const val = smoothHz.get();
    const formatted = val.toFixed(2);
    if (hzRef.current !== formatted) {
      hzRef.current = formatted;
      forceRender((n) => n + 1);
    }
  });

  // Track pointer position
  useEffect(() => {
    if (isTouch) return;
    const onMove = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [isTouch, mouseX, mouseY]);

  if (isTouch) return null;

  // Dot scales with velocity: 6px base, up to ~10px
  const dotSize = Math.min(10, 6 + velocity * 0.04);
  const dotOpacity = isIdle ? 0.15 : 0.5;
  const textOpacity = isIdle ? 0.08 : 0.2;
  const displayText = label ?? `${hzRef.current} Hz`;

  return (
    <motion.div
      className="cursor-overlay"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          whiteSpace: "nowrap",
        }}
      >
        {/* Dot */}
        <div
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: "50%",
            backgroundColor: "var(--fg)",
            opacity: dotOpacity,
            transition: "opacity 0.3s ease, width 0.15s ease, height 0.15s ease",
            flexShrink: 0,
          }}
        />
        {/* Hz / Label */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 8,
            color: "var(--fg)",
            opacity: textOpacity,
            transition: "opacity 0.3s ease",
            lineHeight: 1,
            userSelect: "none",
            position: "relative",
            left: -1, // fine-tune: 14px from center = gap(8) + dot(6)/2 - 1 ≈ 14
          }}
        >
          {displayText}
        </span>
      </div>
    </motion.div>
  );
}
