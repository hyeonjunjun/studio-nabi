"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Colophon — Quiet footer with simple border
 */
export default function Colophon() {
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
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
    <footer>
      <div className="section-padding">
        <div className="hairline" />
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
