"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useStudioStore } from "@/lib/store";

export default function Preloader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const setLoaded = useStudioStore((s) => s.setLoaded);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLoaded();
      if (overlayRef.current) overlayRef.current.style.display = "none";
      return;
    }

    // Check if already loaded this session
    const alreadyVisited = sessionStorage.getItem("hkj-visited");

    if (alreadyVisited) {
      // Repeat visit — quick fade
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            setLoaded();
            if (overlayRef.current) overlayRef.current.style.display = "none";
          },
        });
      }
      return;
    }

    // First visit — full sequence
    sessionStorage.setItem("hkj-visited", "1");

    const tl = gsap.timeline({
      onComplete: () => {
        setLoaded();
        if (overlayRef.current) overlayRef.current.style.display = "none";
      },
    });

    // Phase 1: Hold dark for a moment (0-0.5s)
    tl.to(overlayRef.current, { opacity: 1, duration: 0 });

    // Phase 2: Slowly fade the dark overlay (0.5-2.0s)
    // This reveals the WallLight shader underneath + page content
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 2.0,
      ease: "power2.inOut",
      delay: 0.5,
    });
  }, [setLoaded]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#0a0908",
        opacity: 1,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
