"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion } from "framer-motion";
import SplitText from "@/components/ui/SplitText";

/* ─── Animation helpers ─── */

const ease = [0.16, 1, 0.3, 1] as const;

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.8, ease },
  } as const;
}

/* ═══════════════════════════════════════════
   HeroSection — Full-Bleed Statement Hero
   Inspired by Valiente / Telha Clarke
   ═══════════════════════════════════════════ */

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  /* ── Parallax on background image ── */
  useGSAP(
    () => {
      if (reduced || !sectionRef.current || !imageRef.current) return;

      gsap.to(imageRef.current, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-section="hero"
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* ═══ Full-bleed background image ═══ */}
      <div
        ref={imageRef}
        className="absolute inset-0"
        style={{ top: "-10%", bottom: "-10%", height: "120%" }}
      >
        <Image
          src="/images/sift-v2.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ filter: "brightness(0.8)" }}
        />
      </div>

      {/* Gradient overlay — bone from bottom for text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(243,238,230,0.95) 0%, rgba(243,238,230,0.4) 35%, rgba(243,238,230,0.1) 55%, transparent 75%)",
        }}
      />

      {/* ═══ Content overlay ═══ */}
      <div
        className="relative z-10 flex flex-col justify-end h-full w-full"
        style={{ padding: "var(--page-px)", paddingTop: 64 }}
      >
        {/* ── Serif italic statement — positioned lower-left ── */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <SplitText
            text="— Driven by craft, centered on systems."
            tag="h1"
            type="words"
            animation="slide-up"
            stagger={0.06}
            delay={0.9}
            duration={0.8}
            className="font-display italic"
            style={{
              fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
              color: "var(--color-text)",
              lineHeight: 1.2,
            }}
          />
        </div>

        {/* ═══ BOTTOM BAR — 3 columns (Valiente-style) ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-4 md:gap-0 pb-2">
          {/* Left: tagline */}
          <motion.p
            className="font-sans"
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-dim)",
              lineHeight: 1.6,
            }}
            {...fadeUp(1.2)}
          >
            Design engineering for the AI era.
          </motion.p>

          {/* Center: scroll cue */}
          <motion.div
            className="hidden md:flex justify-center items-end"
            {...fadeUp(1.3)}
          >
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex items-center gap-2"
            >
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: "var(--text-micro)",
                  letterSpacing: "0.2em",
                  color: "var(--color-text-ghost)",
                }}
              >
                Scroll
              </span>
              <svg
                width="1"
                height="28"
                viewBox="0 0 1 28"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                style={{ color: "var(--color-text-ghost)" }}
              >
                <line x1="0.5" y1="0" x2="0.5" y2="28" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Right: year + location */}
          <motion.div
            className="md:text-right"
            {...fadeUp(1.4)}
          >
            <span
              className="font-mono uppercase"
              style={{
                fontSize: "var(--text-micro)",
                letterSpacing: "0.15em",
                color: "var(--color-text-ghost)",
              }}
            >
              Est. 2024 / NYC
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
