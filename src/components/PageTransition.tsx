"use client";

import { useRef, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import { useStudioStore } from "@/lib/store";

export function usePageTransition() {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const setTransitioning = useStudioStore((s) => s.setTransitioning);

  const triggerExit = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      setTransitioning(true);
      if (!overlayRef.current) { resolve(); return; }

      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.4,
          ease: "power2.in",
          onComplete: resolve,
        }
      );
    });
  }, [setTransitioning]);

  const triggerEnter = useCallback(() => {
    if (!overlayRef.current) return;

    gsap.fromTo(
      overlayRef.current,
      { opacity: 1 },
      {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.1,
        onComplete: () => {
          setTransitioning(false);
        },
      }
    );
  }, [setTransitioning]);

  return { overlayRef, triggerExit, triggerEnter };
}

export function TransitionOverlay({ overlayRef }: { overlayRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        backgroundColor: "var(--paper)",
        opacity: 0,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
