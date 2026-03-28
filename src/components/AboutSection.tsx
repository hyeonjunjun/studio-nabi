"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const STATUS_ROWS = [
  { label: "Based", value: "Seoul / Remote" },
  { label: "Focus", value: "Design Engineering" },
  { label: "Status", value: "Available for work" },
  { label: "Stack", value: "Next.js · GSAP · Figma · Three.js" },
];

interface ArrowLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}

function ArrowLink({ href, children, external }: ArrowLinkProps) {
  const arrowRef = useRef<HTMLSpanElement>(null);

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="font-mono"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: "var(--text-label)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--ink-muted)",
        textDecoration: "none",
        transition: "color 300ms var(--ease-out)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--ink-full)";
        gsap.to(arrowRef.current, { x: 4, duration: 0.25, ease: "expo.out" });
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--ink-muted)";
        gsap.to(arrowRef.current, { x: 0, duration: 0.25, ease: "expo.out" });
      }}
    >
      {children}
      <span ref={arrowRef} style={{ display: "inline-block" }}>→</span>
    </a>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const tableRowsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      [markerRef, quoteRef, bioRef].forEach((r) => {
        if (r.current) r.current.style.opacity = "1";
      });
      tableRowsRef.current.forEach((r) => {
        if (r) { r.style.opacity = "1"; r.style.transform = ""; }
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

          tl.fromTo(
            markerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.5 },
            0
          )
            .fromTo(
              quoteRef.current,
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 0.8 },
              0.1
            )
            .fromTo(
              bioRef.current,
              { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 0.7 },
              0.2
            )
            .fromTo(
              tableRowsRef.current.filter(Boolean),
              { opacity: 0, x: 16 },
              { opacity: 1, x: 0, duration: 0.6, stagger: 0.08 },
              0.35
            );
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="section-about"
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
            04
          </span>
        </div>

        {/* Col 3-6: pull quote + bio */}
        <div
          style={{
            gridColumn: "3 / 7",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(20px, 3vh, 32px)",
          }}
        >
          <p
            ref={quoteRef}
            className="font-display"
            style={{
              fontSize: "var(--text-display-md)",
              fontWeight: 400,
              fontStyle: "italic",
              lineHeight: "var(--leading-display-md)",
              color: "var(--ink-full)",
              opacity: 0,
            }}
          >
            Building at the intersection of brand, craft, and code.
          </p>
          <p
            ref={bioRef}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-body)",
              color: "var(--ink-secondary)",
              lineHeight: "var(--leading-body)",
              opacity: 0,
            }}
          >
            I&apos;m a design engineer working at the intersection of high-fidelity
            craft and deep systems thinking. Previously building design systems,
            currently focused on material typography, generative interfaces, and
            software that feels inevitable once you use it. Based in Seoul.
          </p>
        </div>

        {/* Col 7: gap — implicit */}

        {/* Col 8-12: status table + links */}
        <div
          style={{
            gridColumn: "8 / 13",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(24px, 3vh, 40px)",
          }}
        >
          {/* Status table */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {STATUS_ROWS.map((row, i) => (
              <div
                key={row.label}
                ref={(el) => { if (el) tableRowsRef.current[i] = el; }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: "var(--space-standard)",
                  paddingBlock: "var(--space-compact)",
                  borderBottom: "var(--border-light)",
                  opacity: 0,
                }}
              >
                <span
                  className="font-mono"
                  style={{
                    fontSize: "var(--text-meta)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--ink-muted)",
                    flexShrink: 0,
                  }}
                >
                  {row.label}
                </span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: "var(--text-meta)",
                    letterSpacing: "0.06em",
                    color: "var(--ink-primary)",
                    textAlign: "right",
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-standard)" }}>
            <ArrowLink href="/writing">Read the journal</ArrowLink>
            <ArrowLink href="https://linkedin.com/in/hyeonjunjun" external>View LinkedIn</ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}
