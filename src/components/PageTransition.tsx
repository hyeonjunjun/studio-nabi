"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, animate, useMotionValue } from "framer-motion";

/**
 * PageTransition — Smooth grain overlay on route change
 *
 * Uses Framer Motion's imperative animate for precise
 * opacity control: fade in → hold → fade out.
 */
export default function PageTransition() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const opacity = useMotionValue(0);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Sequence: fade in → brief hold → fade out
    const sequence = async () => {
      await animate(opacity, 1, {
        duration: 0.3,
        ease: [0.4, 0, 1, 1],
      });
      await animate(opacity, 0, {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.05,
      });
    };

    sequence();
  }, [pathname, opacity]);

  return (
    <motion.div
      className="fixed inset-0 z-[999] pointer-events-none"
      style={{
        opacity,
        backgroundColor: "var(--color-bg)",
        backgroundImage: "url('/assets/grain-200x200.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "200px 200px",
      }}
    />
  );
}
