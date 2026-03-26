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

    // Repeat visit — skip entirely, content visible immediately
    const alreadyVisited = sessionStorage.getItem("hkj-visited");

    if (alreadyVisited) {
      setLoaded();
      if (overlayRef.current) overlayRef.current.style.display = "none";
      return;
    }

    // First visit — paper overlay fades out gently
    sessionStorage.setItem("hkj-visited", "1");

    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 1.5,
      ease: "power3.out",
      delay: 0.1,
      onComplete: () => {
        setLoaded();
        if (overlayRef.current) overlayRef.current.style.display = "none";
      },
    });
  }, [setLoaded]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        backgroundColor: "#f7f6f3",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
