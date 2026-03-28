"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const CAPABILITIES = [
  "Branding & Identity",
  "Design Engineering",
  "Product Design",
  "Web & Interactive",
  "Design Systems",
];

const STATUS_ROWS = [
  { label: "Based", value: "Seoul / Remote" },
  { label: "Focus", value: "Design Engineering" },
  { label: "Status", value: "Available" },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (contentRef.current) contentRef.current.style.opacity = "1";
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            contentRef.current,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" }
          );
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="editorial-section"
      style={{ padding: "var(--space-3xl) var(--grid-margin)" }}
    >
      <div
        ref={contentRef}
        style={{
          maxWidth: "var(--grid-max)",
          marginInline: "auto",
          opacity: 0,
        }}
      >
        {/* Divider */}
        <hr className="editorial-divider" style={{ marginBottom: "var(--space-xl)" }} />

        {/* Two-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-xl)",
          }}
        >
          {/* Left: bio */}
          <div style={{ maxWidth: 480 }}>
            <p
              className="font-display"
              style={{
                fontSize: "var(--text-heading)",
                fontWeight: 400,
                fontStyle: "italic",
                lineHeight: "var(--leading-heading)",
                color: "var(--ink-full)",
                marginBottom: "var(--space-lg)",
              }}
            >
              Building at the intersection of brand, craft, and code.
            </p>
            <p
              style={{
                fontSize: "var(--text-body)",
                color: "var(--ink-primary)",
                lineHeight: "var(--leading-body)",
              }}
            >
              Design engineer working across high-fidelity craft and deep systems
              thinking. Focused on material typography, generative interfaces, and
              software that feels inevitable.
            </p>
          </div>

          {/* Right: capabilities + status */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
            {/* Capabilities */}
            <div>
              <span
                className="font-mono"
                style={{
                  fontSize: "var(--text-label)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--ink-secondary)",
                  display: "block",
                  marginBottom: "var(--space-md)",
                }}
              >
                Capabilities
              </span>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                {CAPABILITIES.map((cap) => (
                  <li
                    key={cap}
                    className="font-mono"
                    style={{
                      fontSize: "var(--text-label)",
                      letterSpacing: "0.04em",
                      color: "var(--ink-primary)",
                    }}
                  >
                    {cap}
                  </li>
                ))}
              </ul>
            </div>

            {/* Status table */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {STATUS_ROWS.map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    paddingBlock: 10,
                    borderBottom: "1px solid rgba(var(--ink-rgb), 0.06)",
                  }}
                >
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "var(--text-meta)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--ink-secondary)",
                    }}
                  >
                    {row.label}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "var(--text-meta)",
                      letterSpacing: "0.04em",
                      color: "var(--ink-primary)",
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
