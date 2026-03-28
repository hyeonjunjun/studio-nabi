"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, SplitText } from "@/lib/gsap";

const LivingInk = dynamic(() => import("@/components/LivingInk"), { ssr: false });

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Make everything visible immediately if reduced motion
    if (reduced) {
      [markerRef, eyebrowRef, line1Ref, line2Ref, barRef, subRef, ctaRef].forEach(
        (r) => { if (r.current) r.current.style.opacity = "1"; }
      );
      if (barRef.current) barRef.current.style.transform = "scaleX(1)";
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // 1. Section marker
      tl.fromTo(
        markerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        0
      );

      // 2. Eyebrow
      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.1
      );

      // 3. "HKJ" — character split
      if (line1Ref.current) {
        const split1 = new SplitText(line1Ref.current, { type: "chars" });
        tl.fromTo(
          split1.chars,
          { opacity: 0, y: 60, rotation: 8 },
          {
            opacity: 1,
            y: 0,
            rotation: 0,
            duration: 0.9,
            stagger: 0.025,
          },
          0.2
        );
      }

      // 4. "Studio" — character split
      if (line2Ref.current) {
        const split2 = new SplitText(line2Ref.current, { type: "chars" });
        tl.fromTo(
          split2.chars,
          { opacity: 0, y: 60, rotation: 8 },
          {
            opacity: 1,
            y: 0,
            rotation: 0,
            duration: 0.9,
            stagger: 0.025,
          },
          0.4
        );
      }

      // 5. Accent bar — scaleX from left
      tl.fromTo(
        barRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 0.6 },
        0.65
      );

      // 6. Sub-descriptor
      tl.fromTo(
        subRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.8
      );

      // 7. Scroll CTA
      tl.fromTo(
        ctaRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        1.0
      );

      // Arrow pulse — starts after entrance, pauses on scroll
      const arrowAnim = gsap.to(arrowRef.current, {
        y: 6,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.2,
      });

      // Pause arrow when user scrolls
      const onScroll = () => arrowAnim.pause();
      window.addEventListener("scroll", onScroll, { once: true });

      return () => window.removeEventListener("scroll", onScroll);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="section-hero"
      className="scroll-section"
      style={{ overflow: "hidden" }}
    >
      {/* LivingInk — near-invisible texture layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <LivingInk style={{ width: "100%", height: "100%" }} />
      </div>

      {/* 12-col grid */}
      <div
        className="site-grid"
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
          alignContent: "center",
          paddingTop: "clamp(48px, 8vh, 96px)",
          paddingBottom: "clamp(48px, 8vh, 96px)",
        }}
      >
        {/* Col 1-2: rotated section marker — hidden on mobile */}
        <div
          className="col-span-2 hero-marker"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <span
            ref={markerRef}
            className="font-mono"
            style={{
              fontSize: "var(--text-label)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
              opacity: 0,
              transform: "rotate(-90deg)",
              whiteSpace: "nowrap",
              display: "block",
            }}
            aria-hidden="true"
          >
            01
          </span>
        </div>

        {/* Col 3-12: headline block — full-width on mobile */}
        <div className="col-span-10 hero-headline-col">

          {/* Eyebrow */}
          <p
            ref={eyebrowRef}
            className="font-mono"
            style={{
              fontSize: "var(--text-label)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
              marginBottom: "clamp(20px, 3vh, 32px)",
              opacity: 0,
            }}
          >
            Design Engineer · Creative Founder
          </p>

          {/* Headline — intentionally broken */}
          <div
            style={{
              marginBottom: "clamp(20px, 3vh, 32px)",
              // clip chars during animation
              overflow: "hidden",
            }}
          >
            {/* Line 1: HKJ — heavy */}
            <h1
              ref={line1Ref}
              className="font-display"
              style={{
                fontSize: "var(--text-display-xl)",
                fontWeight: 800,
                lineHeight: "var(--leading-display-xl)",
                color: "var(--ink-full)",
                display: "block",
              }}
            >
              HKJ
            </h1>

            {/* Line 2: Studio — light italic */}
            <span
              ref={line2Ref}
              className="font-display"
              style={{
                fontSize: "var(--text-display-xl)",
                fontWeight: 300,
                fontStyle: "italic",
                lineHeight: "var(--leading-display-xl)",
                color: "var(--ink-secondary)",
                display: "block",
              }}
            >
              Studio
            </span>
          </div>

          {/* Accent bar */}
          <div
            ref={barRef}
            style={{
              height: 2,
              backgroundColor: "var(--accent)",
              marginTop: 24,
              marginBottom: 24,
              transformOrigin: "left center",
              transform: "scaleX(0)",
            }}
          />

          {/* Sub-descriptor */}
          <p
            ref={subRef}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-body-lg)",
              fontWeight: 400,
              color: "var(--ink-secondary)",
              lineHeight: "var(--leading-body)",
              opacity: 0,
            }}
          >
            Branding · Design Engineering · Product Design
          </p>
        </div>
      </div>

      {/* Scroll CTA — pinned bottom-left */}
      <div
        ref={ctaRef}
        style={{
          position: "absolute",
          bottom: "clamp(24px, 4vh, 40px)",
          left: "var(--grid-margin)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          opacity: 0,
          zIndex: 1,
        }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: "var(--text-meta)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
          }}
        >
          Scroll to explore
        </span>
        <span
          ref={arrowRef}
          style={{
            display: "inline-block",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-meta)",
            color: "var(--accent)",
          }}
        >
          ↓
        </span>
      </div>
    </section>
  );
}
