"use client";

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { usePageTransition } from "@/lib/transition-context";

export default function PageTransition({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { registerPage } = usePageTransition();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Register with context so exit animation can find this element
    registerPage(el as HTMLElement);

    // Enter animation — new page slides up from slightly below
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      gsap.set(el, { opacity: 1, y: 0 });
    } else {
      gsap.fromTo(
        el,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "expo.out",
          clearProps: "transform,opacity",
        }
      );
    }

    return () => registerPage(null);
  }, [registerPage]);

  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
