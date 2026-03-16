"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Capabilities — Minimal type list with layered parallax
 */

const CAPABILITIES = [
  { title: "Design Systems", tools: "Figma, Storybook, Tokens" },
  { title: "React / Next.js", tools: "App Router, RSC, Turbopack" },
  { title: "React Native", tools: "Expo, Reanimated, NativeWind" },
  { title: "Motion Design", tools: "GSAP, Lenis, ScrollTrigger" },
  { title: "Prototyping", tools: "Framer, Principle, Code" },
  { title: "Visual Design", tools: "Typography, Layout, Color" },
  { title: "WebGL / 3D", tools: "Three.js, R3F, GLSL" },
  { title: "AI Integration", tools: "LLMs, Embeddings, RAG" },
];

export default function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;

    const items = section.querySelectorAll("[data-cap-item]");
    gsap.fromTo(
      items,
      { opacity: 0.15 },
      {
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 75%" },
      }
    );

    if (gridRef.current) {
      const allItems = gridRef.current.querySelectorAll("[data-cap-item]");
      allItems.forEach((item, i) => {
        const isLeftCol = i % 2 === 0;
        gsap.fromTo(
          item,
          { yPercent: isLeftCol ? 8 : 4 },
          {
            yPercent: isLeftCol ? -8 : -4,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.3,
            },
          }
        );
      });
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="relative overflow-hidden"
      style={{
        paddingTop: "clamp(6rem, 10vh, 8rem)",
        paddingBottom: "clamp(6rem, 10vh, 8rem)",
      }}
    >
      {/* Top border */}
      <div className="section-padding">
        <div className="hairline" />
      </div>

      {/* Content */}
      <div
        className="section-padding"
        style={{
          paddingTop: "clamp(3rem, 5vh, 4rem)",
          paddingBottom: "clamp(3rem, 5vh, 4rem)",
        }}
      >
        <div className="max-w-[900px] mx-auto mb-10" data-cap-item>
          <span
            className="font-mono uppercase"
            style={{
              fontSize: "var(--text-micro)",
              letterSpacing: "0.15em",
              color: "var(--color-text-ghost)",
            }}
          >
            Capabilities
          </span>
        </div>

        <div className="max-w-[900px] mx-auto">
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-8">
            {CAPABILITIES.map((cap) => (
              <div key={cap.title} data-cap-item>
                <span
                  className="font-sans block"
                  style={{
                    fontSize: "var(--text-small)",
                    color: "var(--color-text)",
                    lineHeight: 1.4,
                  }}
                >
                  {cap.title}
                </span>
                <span
                  className="font-mono block mt-1"
                  style={{
                    fontSize: "var(--text-micro)",
                    color: "var(--color-text-dim)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {cap.tools}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div className="section-padding">
        <div className="hairline" />
      </div>
    </section>
  );
}
