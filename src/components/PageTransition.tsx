"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DUR, EASE } from "@/lib/motion";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const transitionOrigin = useStore((s) => s.transitionOrigin);
  const setTransitionOrigin = useStore((s) => s.setTransitionOrigin);
  const reducedMotion = useReducedMotion();
  const prevPath = useRef(pathname);

  // Clear transition origin after animation completes
  useEffect(() => {
    if (prevPath.current !== pathname && transitionOrigin) {
      const t = setTimeout(() => setTransitionOrigin(null), 1200);
      prevPath.current = pathname;
      return () => clearTimeout(t);
    }
    prevPath.current = pathname;
  }, [pathname, transitionOrigin, setTransitionOrigin]);

  const showCircleExpand =
    transitionOrigin !== null && pathname.startsWith("/work/");

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Circle expansion overlay — only visible during work/* transitions from a known origin */}
      <AnimatePresence>
        {showCircleExpand && transitionOrigin && (
          <motion.div
            key={`${transitionOrigin.slug}-${transitionOrigin.x}-${transitionOrigin.y}`}
            initial={{
              opacity: 1,
              clipPath: `circle(7px at ${transitionOrigin.x}px ${transitionOrigin.y}px)`,
            }}
            animate={{
              clipPath: `circle(180vmax at ${transitionOrigin.x}px ${transitionOrigin.y}px)`,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.page, ease: EASE.inOut }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background:
                "radial-gradient(circle at center, rgba(196,162,101,0.95) 0%, rgba(196,162,101,0.8) 30%, rgba(10,10,12,0.9) 70%, rgba(10,10,12,1) 100%)",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      {/* Page content with standard fade for non-origin transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(2px)" }}
          transition={{ duration: DUR.reveal, ease: EASE.out }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
