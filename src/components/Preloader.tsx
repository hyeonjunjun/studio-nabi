"use client";

import { useEffect } from "react";
import { useStudioStore } from "@/lib/store";

interface PreloaderProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function Preloader({ containerRef }: PreloaderProps) {
  const setPreloaderDone = useStudioStore((s) => s.setPreloaderDone);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Reduced motion — skip all animations
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      setPreloaderDone(true);
      return;
    }

    const isRepeatVisit = sessionStorage.getItem("hkj-visited") === "1";

    async function runAnimation() {
      const { gsap } = await import("@/lib/gsap");
      const items = document.querySelectorAll("[data-flip-id]");
      const navElements = document.querySelectorAll("header > *");
      const brandMark = document.querySelector(".brand-mark");

      if (isRepeatVisit) {
        // Quick stagger in
        gsap.from("[data-flip-id]", {
          opacity: 0,
          y: 30,
          stagger: 0.02,
          duration: 0.5,
          ease: "power3.out",
          onComplete: () => {
            setPreloaderDone(true);
          },
        });
      } else {
        // First visit: full choreography
        // 1. Hide items
        gsap.set(items, { opacity: 0, scale: 0.8 });

        // 2. After 500ms: fade in nav elements
        setTimeout(() => {
          if (navElements.length) {
            gsap.from(navElements, {
              opacity: 0,
              y: -8,
              stagger: 0.05,
              duration: 0.4,
              ease: "power2.out",
            });
          }
        }, 500);

        // 3. After 1200ms: stagger grid items in
        setTimeout(() => {
          if (items.length) {
            gsap.from(items, {
              opacity: 0,
              scale: 0.8,
              y: gsap.utils.random(-100, 100) as number,
              x: gsap.utils.random(-100, 100) as number,
              rotation: gsap.utils.random(-8, 8) as number,
              stagger: 0.04,
              duration: 0.8,
              ease: "back.out(1.2)",
              onComplete: () => {
                setPreloaderDone(true);
                sessionStorage.setItem("hkj-visited", "1");
              },
            });
          } else {
            setPreloaderDone(true);
            sessionStorage.setItem("hkj-visited", "1");
          }
        }, 1200);
      }
    }

    runAnimation();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Renders nothing visible
  return null;
}

export default Preloader;
