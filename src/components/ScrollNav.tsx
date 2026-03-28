"use client";

import { useEffect, useRef, useState } from "react";
import { useStudioStore } from "@/lib/store";

const SECTIONS = [
  { id: "section-hero",     label: "Hero" },
  { id: "section-work",     label: "Work" },
  { id: "section-approach", label: "Approach" },
  { id: "section-about",    label: "About" },
  { id: "section-contact",  label: "Contact" },
];

export default function ScrollNav() {
  const currentSection = useStudioStore((s) => s.currentSection);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <nav
      ref={containerRef}
      aria-label="Section navigation"
      style={{
        position: "fixed",
        right: "clamp(16px, 3vw, 40px)",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 400,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 16,
      }}
    >
      {SECTIONS.map((section, i) => {
        const isActive = currentSection === section.label;
        const isHovered = hoveredIdx === i;

        return (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            aria-label={`Go to ${section.label}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {/* Label — appears on hover */}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-label)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--ink-muted)",
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? "translateX(0)" : "translateX(8px)",
                transition: "opacity 200ms var(--ease-out), transform 200ms var(--ease-out)",
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              {section.label}
            </span>

            {/* Dot */}
            <span
              style={{
                display: "block",
                width: isActive ? 8 : 5,
                height: isActive ? 8 : 5,
                borderRadius: "50%",
                backgroundColor: isActive
                  ? "var(--accent)"
                  : isHovered
                  ? "var(--ink-secondary)"
                  : "var(--ink-faint)",
                transition:
                  "width 200ms var(--ease-out), height 200ms var(--ease-out), background-color 200ms var(--ease-out)",
                flexShrink: 0,
              }}
            />
          </button>
        );
      })}
    </nav>
  );
}
