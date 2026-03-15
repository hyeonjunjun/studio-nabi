"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import WobblyRule from "@/components/ui/WobblyRule";

/**
 * Colophon — Quiet footer with hand-drawn rule
 *
 * WobblyRule above with parallax drift, then single line of credits.
 * Deep bottom padding for breathing room at page end.
 */
export default function Colophon() {
  const ruleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // WobblyRule drifts at its own speed
    if (ruleRef.current) {
      gsap.fromTo(
        ruleRef.current,
        { yPercent: 0 },
        {
          yPercent: -30,
          ease: "none",
          scrollTrigger: {
            trigger: ruleRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.2,
          },
        }
      );
    }

    // Credits text fades in
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0.15 },
        {
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 90%",
          },
        }
      );
    }
  }, []);

  return (
    <footer className="overflow-hidden">
      <div ref={ruleRef}>
        <WobblyRule className="section-padding" />
      </div>

      <div
        className="section-padding"
        style={{
          paddingTop: "clamp(2.5rem, 4vh, 3.5rem)",
          paddingBottom: "clamp(3rem, 5vh, 4rem)",
        }}
      >
        <p
          ref={textRef}
          className="font-mono"
          style={{
            fontSize: "var(--text-micro)",
            color: "var(--color-text-ghost)",
            letterSpacing: "0.08em",
            lineHeight: 1.6,
          }}
        >
          Designed & built by HKJ · Set in GT Alpina & Söhne · © 2026
        </p>
      </div>
    </footer>
  );
}
