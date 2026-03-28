"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { CONTACT_EMAIL } from "@/constants/contact";

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const footerRef = useRef<HTMLParagraphElement>(null);
  const emailUnderlineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      [markerRef, headlineRef, subRef, footerRef].forEach((r) => {
        if (r.current) r.current.style.opacity = "1";
      });
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

          tl.fromTo(markerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0);

          if (headlineRef.current) {
            // Line-level reveal — no char split to avoid mid-word breaks at display-xl
            const lines = headlineRef.current.querySelectorAll(".contact-line");
            tl.fromTo(
              lines,
              { opacity: 0, y: 48, skewY: 3 },
              { opacity: 1, y: 0, skewY: 0, duration: 0.85, stagger: 0.12, ease: "expo.out" },
              0.1
            );
          }

          tl.fromTo(
            subRef.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.6 },
            0.5
          ).fromTo(
            footerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.5 },
            0.7
          );
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  function onEmailEnter() {
    gsap.to(emailUnderlineRef.current, { scaleX: 1, duration: 0.3, ease: "expo.out" });
  }

  function onEmailLeave() {
    gsap.to(emailUnderlineRef.current, { scaleX: 0, duration: 0.2, ease: "expo.out" });
  }

  return (
    <section
      ref={sectionRef}
      id="section-contact"
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
            05
          </span>
        </div>

        {/* Col 3-12: content */}
        <div
          className="col-span-10 hero-headline-col"
          style={{ display: "flex", flexDirection: "column", gap: "clamp(32px, 5vh, 56px)" }}
        >
          {/* Big headline */}
          <h2
            ref={headlineRef}
            className="font-display"
            style={{
              fontSize: "var(--text-display-xl)",
              fontWeight: 700,
              lineHeight: "var(--leading-display-xl)",
              color: "var(--ink-full)",
              hyphens: "none",
            }}
          >
            <span style={{ display: "block", overflow: "hidden" }}>
              <span className="contact-line" style={{ display: "block" }}>
                {"Let's build"}
              </span>
            </span>
            <span style={{ display: "block", overflow: "hidden" }}>
              <span className="contact-line" style={{ display: "block" }}>
                {"something "}
                <span style={{ color: "var(--accent)" }}>→</span>
              </span>
            </span>
          </h2>

          {/* Sub-line: email + handles */}
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(16px, 2vh, 24px)" }}>
            {/* Email with animated underline */}
            <p
              ref={subRef}
              className="font-mono"
              style={{
                fontSize: "var(--text-label)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--ink-muted)",
                opacity: 0,
              }}
            >
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                style={{
                  position: "relative",
                  display: "inline-block",
                  color: "inherit",
                  textDecoration: "none",
                }}
                onMouseEnter={onEmailEnter}
                onMouseLeave={onEmailLeave}
              >
                {CONTACT_EMAIL}
                {/* Animated underline */}
                <span
                  ref={emailUnderlineRef}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    bottom: -2,
                    left: 0,
                    right: 0,
                    height: 2,
                    backgroundColor: "var(--accent)",
                    transformOrigin: "left center",
                    transform: "scaleX(0)",
                    display: "block",
                  }}
                />
              </a>
              {" · @hyeonjunjun · Available for projects"}
            </p>
          </div>

          {/* Footer text */}
          <p
            ref={footerRef}
            className="font-mono"
            style={{
              fontSize: "var(--text-meta)",
              letterSpacing: "0.06em",
              color: "var(--ink-muted)",
              opacity: 0,
              marginTop: "auto",
              paddingTop: "clamp(24px, 4vh, 48px)",
            }}
          >
            HKJ Studio · 2026 · Design Engineering
          </p>
        </div>
      </div>
    </section>
  );
}
