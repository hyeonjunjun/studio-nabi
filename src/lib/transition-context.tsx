"use client";

import { createContext, useContext, useRef, useCallback, useState, ReactNode } from "react";
import { gsap } from "@/lib/gsap";

interface TransitionContextValue {
  isTransitioning: boolean;
  triggerTransition: (onMidpoint: () => void) => void;
  registerPage: (el: HTMLElement | null) => void;
}

const TransitionContext = createContext<TransitionContextValue>({
  isTransitioning: false,
  triggerTransition: () => {},
  registerPage: () => {},
});

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pageRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const isTransitioningRef = useRef(false);

  const registerPage = useCallback((el: HTMLElement | null) => {
    pageRef.current = el;
  }, []);

  const triggerTransition = useCallback((onMidpoint: () => void) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIsTransitioning(true);

    const tl = gsap.timeline({
      onComplete: () => {
        isTransitioningRef.current = false;
        setIsTransitioning(false);
      },
    });

    // Progress bar draws across top
    if (progressRef.current) {
      tl.fromTo(
        progressRef.current,
        { scaleX: 0, opacity: 1 },
        { scaleX: 1, duration: 0.5, ease: "power2.inOut" },
        0
      );
    }

    // Page exit — content slides up and fades
    if (pageRef.current) {
      tl.to(
        pageRef.current,
        { opacity: 0, y: -24, duration: 0.35, ease: "power2.in" },
        0
      );
    }

    // Fire router.push() at 220ms — page starts loading while exit plays
    tl.call(onMidpoint, [], 0.22);

    // Fade out progress bar after navigation
    if (progressRef.current) {
      tl.to(progressRef.current, { opacity: 0, duration: 0.3 }, 0.55);
    }
  }, []);

  return (
    <TransitionContext.Provider value={{ isTransitioning, triggerTransition, registerPage }}>
      {/* 2px accent progress bar fixed to top of viewport */}
      <div
        ref={progressRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "var(--accent, #0047FF)",
          transformOrigin: "left center",
          transform: "scaleX(0)",
          opacity: 0,
          zIndex: 9999,
          pointerEvents: "none",
        }}
      />
      {children}
    </TransitionContext.Provider>
  );
}

export function usePageTransition() {
  return useContext(TransitionContext);
}
