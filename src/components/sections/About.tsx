"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * About — Editorial single-column with offset image
 *
 * Clean typography-first layout. Subtle parallax on text column
 * and image. No heavy ghost effects — just depth through whitespace
 * and restrained motion.
 */
export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;

    // Text reveals — gentle opacity fade with subtle rise
    const textEls = section.querySelectorAll("[data-about-text]");
    gsap.fromTo(
      textEls,
      { opacity: 0.15, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 72%" },
      }
    );

    // Text column — subtle lag
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { yPercent: 0 },
        {
          yPercent: -4,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.3,
          },
        }
      );
    }

    // Image — opacity reveal + slight float
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { yPercent: 12, opacity: 0.15, rotation: 2 },
        {
          yPercent: -15,
          opacity: 1,
          rotation: -0.5,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        }
      );
    }

    // Section label — drifts
    if (labelRef.current) {
      gsap.fromTo(
        labelRef.current,
        { yPercent: 0 },
        {
          yPercent: -40,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.2,
          },
        }
      );
    }

    // Accent line — scales in
    if (accentRef.current) {
      gsap.fromTo(
        accentRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom top",
            scrub: 0.4,
          },
        }
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden"
      style={{
        paddingTop: "clamp(10rem, 18vh, 14rem)",
        paddingBottom: "clamp(8rem, 14vh, 12rem)",
      }}
    >
      {/* Accent line — parallax layer */}
      <div
        ref={accentRef}
        className="absolute pointer-events-none"
        style={{
          top: "28%",
          left: "var(--page-px)",
          width: "60px",
          height: "1px",
          backgroundColor: "var(--color-accent)",
          opacity: 0.25,
          transformOrigin: "left center",
          transform: "scaleX(0)",
        }}
      />

      <div className="relative z-10 section-padding">
        {/* Section label */}
        <div ref={labelRef} className="max-w-[900px] mx-auto mb-16" data-about-text>
          <span
            className="font-mono uppercase"
            style={{
              fontSize: "var(--text-micro)",
              letterSpacing: "0.15em",
              color: "var(--color-text-ghost)",
            }}
          >
            About
          </span>
        </div>

        <div className="max-w-[1100px] mx-auto relative">
          {/* Text column */}
          <div ref={textRef} className="max-w-[900px]">
            <p
              className="font-sans"
              style={{
                fontSize: "var(--text-body)",
                lineHeight: 1.8,
                color: "var(--color-text)",
                marginBottom: "clamp(1.5rem, 3vh, 2.5rem)",
              }}
              data-about-text
            >
              HKJ is a one-person design engineering practice based between
              New York and Seoul. I build products that feel considered &mdash; from
              system design to pixel-level detail.
            </p>

            <p
              className="font-sans"
              style={{
                fontSize: "var(--text-body)",
                lineHeight: 1.8,
                color: "var(--color-text-secondary)",
                marginBottom: "clamp(1.5rem, 3vh, 2.5rem)",
                maxWidth: "58ch",
              }}
              data-about-text
            >
              My work sits at the intersection of design craft and deep technical
              execution. I care about type, motion, and the invisible details that
              make software feel intentional. Every project is a chance to close
              the gap between what designers envision and what engineers ship.
            </p>

            <p
              className="font-sans"
              style={{
                fontSize: "var(--text-body)",
                lineHeight: 1.8,
                color: "var(--color-text-secondary)",
                maxWidth: "58ch",
              }}
              data-about-text
            >
              Previously, I worked on products across mobile, AI, and design systems.
              I believe the best digital work borrows from the rigor of print and the
              warmth of physical objects.
            </p>

            {/* Personal aside — footnote style */}
            <p
              className="font-mono mt-10"
              style={{
                fontSize: "var(--text-micro)",
                lineHeight: 1.7,
                color: "var(--color-text-ghost)",
                letterSpacing: "0.04em",
                maxWidth: "48ch",
              }}
              data-about-text
            >
              When I&rsquo;m not pushing pixels, I&rsquo;m probably hunting for good
              light to photograph, reading about material science, or making
              pour-overs that take too long.
            </p>
          </div>

          {/* FIG. 1 — offset image */}
          <div
            ref={imageRef}
            className="hidden lg:block absolute"
            style={{
              right: "-2rem",
              top: "-2rem",
              width: "260px",
            }}
          >
            <div
              className="w-full overflow-hidden"
              style={{
                aspectRatio: "3/4",
                backgroundColor: "var(--color-surface)",
                clipPath: `polygon(
                  0% 2%, 3% 0%, 8% 1%, 15% 0%, 22% 2%, 28% 0%, 35% 1%,
                  42% 0%, 50% 2%, 58% 0%, 65% 1%, 72% 0%, 78% 2%, 85% 0%,
                  92% 1%, 97% 0%, 100% 2%, 99% 8%, 100% 15%, 99% 22%,
                  100% 28%, 99% 35%, 100% 42%, 99% 50%, 100% 58%, 99% 65%,
                  100% 72%, 99% 78%, 100% 85%, 99% 92%, 100% 97%, 98% 100%,
                  92% 99%, 85% 100%, 78% 99%, 72% 100%, 65% 99%, 58% 100%,
                  50% 99%, 42% 100%, 35% 99%, 28% 100%, 22% 99%, 15% 100%,
                  8% 99%, 3% 100%, 0% 98%, 1% 92%, 0% 85%, 1% 78%,
                  0% 72%, 1% 65%, 0% 58%, 1% 50%, 0% 42%, 1% 35%,
                  0% 28%, 1% 22%, 0% 15%, 1% 8%
                )`,
              }}
            />
            <span
              className="font-mono block mt-3 text-center"
              style={{
                fontSize: "var(--text-micro)",
                color: "var(--color-text-ghost)",
                letterSpacing: "0.1em",
              }}
            >
              FIG. 1
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
