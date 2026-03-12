"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import StatusBadge from "@/components/ui/StatusBadge";

/* ═══════════════════════════════════════════
   StudioSection — 01 STUDIO
   Telha Clarke-inspired numbered section:
   image left + body text right
   ═══════════════════════════════════════════ */

export default function StudioSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !sectionRef.current) return;

      gsap.from(".studio-label", {
        opacity: 0,
        y: 12,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      gsap.from(".studio-image", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });

      gsap.from(".studio-text", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-section="about"
      className="relative"
      style={{
        padding: "8rem var(--page-px)",
        backgroundColor: "var(--color-bg)",
      }}
    >
      {/* Section label — numbered */}
      <div className="studio-label mb-16 md:mb-24">
        <span
          className="font-mono block"
          style={{
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            color: "var(--color-text-ghost)",
            lineHeight: 1,
            opacity: 0.35,
          }}
        >
          01
        </span>
        <span
          className="font-mono uppercase block mt-2"
          style={{
            fontSize: "var(--text-xs)",
            letterSpacing: "0.2em",
            color: "var(--color-text-dim)",
          }}
        >
          Studio
        </span>
      </div>

      {/* Two-column: image left + text right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Image */}
        <div
          className="studio-image relative overflow-hidden"
          style={{ aspectRatio: "3 / 4" }}
        >
          <Image
            src="/images/ethereal_butterfly.jpeg"
            alt="Studio"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Text */}
        <div className="studio-text flex flex-col justify-center gap-8">
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              color: "var(--color-text)",
              lineHeight: 1.15,
            }}
          >
            We design and build tactile
            <br />
            products for the AI era.
          </h2>

          <p
            className="font-sans"
            style={{
              fontSize: "var(--text-base)",
              lineHeight: 1.8,
              color: "var(--color-text-dim)",
              maxWidth: 500,
            }}
          >
            A one-person studio at the intersection of high-fidelity craft and
            deep systems thinking. Specializing in React Native, Next.js, and
            design systems that feel like instruments&mdash;precise, purposeful,
            built to last.
          </p>

          <div className="flex items-center gap-6 mt-2">
            <StatusBadge status="Available for freelance" />
            <span
              className="font-mono uppercase"
              style={{
                fontSize: "var(--text-micro)",
                letterSpacing: "0.15em",
                color: "var(--color-text-ghost)",
              }}
            >
              NYC / Seoul
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
