"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Global smooth scroll via Lenis. Activated on all routes.
 * Does nothing on routes without overflow (e.g. homepage).
 * Tuned to "slight" — lerp 0.12 gives subtle smoothing, not heavy lag.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    let rafId: number;
    const frame = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
