"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useStudioStore } from "@/lib/store";

const SECTION_IDS = [
  { id: "section-hero",     label: "Hero" },
  { id: "section-work",     label: "Work" },
  { id: "section-approach", label: "Approach" },
  { id: "section-about",    label: "About" },
  { id: "section-contact",  label: "Contact" },
];

interface Props {
  children: React.ReactNode;
}

export default function ScrollSections({ children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const setCurrentSection = useStudioStore((s) => s.setCurrentSection);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const triggers: ScrollTrigger[] = [];

    SECTION_IDS.forEach(({ id, label }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 55%",
        onEnter: () => setCurrentSection(label),
        onEnterBack: () => setCurrentSection(label),
      });

      triggers.push(trigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [setCurrentSection]);

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      {children}
    </div>
  );
}
