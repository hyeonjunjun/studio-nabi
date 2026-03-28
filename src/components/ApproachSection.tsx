"use client";

import React, { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const CARDS = [
  {
    label: "01 — Branding",
    body: "Identity systems, visual language, and brand strategy built to scale across touchpoints.",
    examples: ["GYEOL 결", "Typographic Systems", "Brand Architecture", "Visual Identity"],
  },
  {
    label: "02 — Design Engineering",
    body: "High-fidelity components, design systems, and interactive prototypes bridging design and production.",
    examples: ["Conductor DS", "GSAP Animation", "Next.js / React", "Design Tokens"],
  },
  {
    label: "03 — Product Design",
    body: "End-to-end product thinking — research, architecture, and execution with engineering constraints in mind.",
    examples: ["Sift", "Mobile / AI", "User Research", "Interaction Design"],
  },
];

export default function ApproachSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptorRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      [markerRef, headingRef, descriptorRef, barRef].forEach((r) => {
        if (r.current) r.current.style.opacity = "1";
      });
      if (barRef.current) barRef.current.style.transform = "scaleX(1)";
      if (cardsRef.current)
        gsap.set(cardsRef.current.children, { autoAlpha: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

          tl.fromTo(
            [markerRef.current, headingRef.current],
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
            0
          )
            .fromTo(
              descriptorRef.current,
              { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 0.6 },
              0.15
            )
            .fromTo(
              barRef.current,
              { scaleX: 0, transformOrigin: "left center" },
              { scaleX: 1, duration: 0.5 },
              0.3
            )
            .fromTo(
              cardsRef.current ? Array.from(cardsRef.current.children) : [],
              { autoAlpha: 0, y: 32 },
              { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.15 },
              0.45
            );
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="section-approach"
      className="scroll-section"
      style={{ justifyContent: "center", borderTop: "var(--border-heavy)" }}
    >
      <div
        className="site-grid"
        style={{ width: "100%", alignContent: "center", paddingBlock: "clamp(48px, 8vh, 96px)" }}
      >
        {/* Col 1-2: rotated marker */}
        <div className="col-span-2 hero-marker" style={{ display: "flex", alignItems: "center" }}>
          <span
            ref={markerRef}
            className="font-mono"
            style={{
              fontSize: "var(--text-label)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
              transform: "rotate(-90deg)",
              whiteSpace: "nowrap",
              display: "block",
              opacity: 0,
            }}
            aria-hidden="true"
          >
            03
          </span>
        </div>

        {/* Col 3-12: content */}
        <div className="col-span-10 hero-headline-col" style={{ display: "flex", flexDirection: "column", gap: "clamp(24px, 4vh, 40px)" }}>

          {/* Heading */}
          <h2
            ref={headingRef}
            className="font-display"
            style={{
              fontSize: "var(--text-display-lg)",
              fontWeight: 700,
              lineHeight: "var(--leading-display-lg)",
              color: "var(--ink-full)",
              opacity: 0,
            }}
          >
            Approach
          </h2>

          {/* Descriptor */}
          <p
            ref={descriptorRef}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-body-lg)",
              color: "var(--ink-secondary)",
              lineHeight: "var(--leading-body)",
              maxWidth: "480px",
              opacity: 0,
            }}
          >
            Designing systems that hold together under real conditions — from first mark to shipped product.
          </p>

          {/* Half-width accent bar */}
          <div
            ref={barRef}
            style={{
              height: 2,
              width: "50%",
              backgroundColor: "var(--accent)",
              transformOrigin: "left center",
              transform: "scaleX(0)",
            }}
          />

          {/* 3 capability cards */}
          <div
            ref={cardsRef}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1px 1fr 1px 1fr",
              gap: 0,
              marginTop: "clamp(8px, 2vh, 16px)",
            }}
          >
            {CARDS.map((card, i) => (
              <React.Fragment key={card.label}>
                {/* Divider before cards 2 & 3 */}
                {i > 0 && (
                  <div
                    style={{ backgroundColor: "rgba(var(--ink-rgb), 0.08)", alignSelf: "stretch" }}
                  />
                )}
                <div
                  style={{
                    paddingInline: i === 0 ? "0 clamp(16px, 3vw, 32px)" : "clamp(16px, 3vw, 32px)",
                    paddingBlock: "clamp(16px, 2vh, 24px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-standard)",
                  }}
                >
                  <p
                    className="font-mono"
                    style={{
                      fontSize: "var(--text-label)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                    }}
                  >
                    {card.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-body)",
                      color: "var(--ink-secondary)",
                      lineHeight: "var(--leading-body)",
                    }}
                  >
                    {card.body}
                  </p>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 4, marginTop: "auto" }}>
                    {card.examples.map((ex) => (
                      <li
                        key={ex}
                        className="font-mono"
                        style={{
                          fontSize: "var(--text-meta)",
                          letterSpacing: "0.06em",
                          color: "var(--ink-muted)",
                        }}
                      >
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
