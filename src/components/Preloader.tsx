"use client";

import { useEffect, useState } from "react";
import { useStudioStore } from "@/lib/store";

export default function Preloader() {
  const isLoaded = useStudioStore((s) => s.isLoaded);
  const setIsLoaded = useStudioStore((s) => s.setIsLoaded);
  const [phase, setPhase] = useState<"visible" | "fading" | "done">(
    isLoaded ? "done" : "visible"
  );

  // Respect prefers-reduced-motion: skip preloader entirely
  useEffect(() => {
    if (isLoaded) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setPhase("done");
      setIsLoaded(true);
      return;
    }
    // Hold for 0.8s, then fade out
    const holdTimer = setTimeout(() => setPhase("fading"), 800);
    return () => clearTimeout(holdTimer);
  }, [isLoaded, setIsLoaded]);

  useEffect(() => {
    if (phase === "fading") {
      const fadeTimer = setTimeout(() => {
        setPhase("done");
        setIsLoaded(true);
      }, 700);
      return () => clearTimeout(fadeTimer);
    }
  }, [phase, setIsLoaded]);

  if (phase === "done") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "var(--color-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: phase === "fading" ? 0 : 1,
        transition: "opacity 700ms cubic-bezier(0.86, 0, 0.07, 1)",
        pointerEvents: phase === "fading" ? "none" : "all",
      }}
    >
      <span
        className="font-mono uppercase tracking-[0.1em]"
        style={{
          fontSize: "var(--text-micro)",
          color: "var(--color-text-dim)",
          animation: "fadeIn 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        hkj
      </span>
    </div>
  );
}
