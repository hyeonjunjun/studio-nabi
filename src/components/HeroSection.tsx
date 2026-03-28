"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      [titleRef, subtitleRef, taglineRef, yearRef].forEach((r) => {
        if (r.current) r.current.style.opacity = "1";
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        delay: 0.3,
      });

      // Title chars
      if (titleRef.current) {
        const split = new SplitText(titleRef.current, { type: "chars" });
        tl.fromTo(
          split.chars,
          { opacity: 0, y: 80, rotation: 6 },
          { opacity: 1, y: 0, rotation: 0, duration: 1.2, stagger: 0.04 },
          0
        );
      }

      // Subtitle
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.5
      );

      // Tagline
      tl.fromTo(
        taglineRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        0.7
      );

      // Year
      tl.fromTo(
        yearRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        0.9
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "var(--space-3xl) var(--grid-margin)",
        position: "relative",
      }}
    >
      {/* Title block */}
      <div style={{ maxWidth: 900 }}>
        <h1
          ref={titleRef}
          className="font-display"
          style={{
            fontSize: "var(--text-display)",
            fontWeight: 600,
            lineHeight: "var(--leading-display)",
            color: "var(--ink-full)",
            letterSpacing: "-0.02em",
            opacity: 0,
          }}
        >
          HKJ Studio
        </h1>
        <span
          ref={subtitleRef}
          className="font-display"
          style={{
            display: "block",
            fontSize: "var(--text-display)",
            fontWeight: 300,
            fontStyle: "italic",
            lineHeight: "var(--leading-display)",
            color: "var(--ink-secondary)",
            letterSpacing: "-0.02em",
            opacity: 0,
            marginTop: "-0.05em",
          }}
        >
          Archive
        </span>
      </div>

      {/* Bottom metadata */}
      <div
        style={{
          position: "absolute",
          bottom: "var(--space-xl)",
          left: "var(--grid-margin)",
          right: "var(--grid-margin)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <p
          ref={taglineRef}
          className="font-mono"
          style={{
            fontSize: "var(--text-label)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--ink-secondary)",
            opacity: 0,
            maxWidth: 320,
            lineHeight: 1.5,
          }}
        >
          Brand, product, and design engineering — Seoul
        </p>
        <span
          ref={yearRef}
          className="font-mono"
          style={{
            fontSize: "var(--text-label)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--ink-secondary)",
            opacity: 0,
          }}
        >
          Est. 2024
        </span>
      </div>
    </section>
  );
}
