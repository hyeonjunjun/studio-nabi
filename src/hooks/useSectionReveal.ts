"use client";

import { useEffect, useRef } from "react";

export function useSectionReveal<T extends HTMLElement = HTMLElement>() {
  const containerRef = useRef<T | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      container
        .querySelectorAll<HTMLElement>(".case__section")
        .forEach((el) => el.setAttribute("data-revealed", ""));
      return;
    }

    const targets = Array.from(
      container.querySelectorAll<HTMLElement>(".case__section")
    );
    let revealed = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.hasAttribute("data-revealed")) {
            entry.target.setAttribute("data-revealed", "");
            observer.unobserve(entry.target);
            revealed += 1;
            if (revealed >= targets.length) observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    targets.forEach((t) => observer.observe(t));

    return () => observer.disconnect();
  }, []);

  return containerRef;
}
