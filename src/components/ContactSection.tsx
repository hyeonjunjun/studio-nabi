"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { CONTACT_EMAIL, SOCIALS } from "@/constants/contact";

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (contentRef.current) contentRef.current.style.opacity = "1";
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            contentRef.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.7, ease: "expo.out" }
          );
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={sectionRef}
      id="contact"
      style={{
        padding: "var(--space-3xl) var(--grid-margin) var(--space-xl)",
      }}
    >
      <div
        ref={contentRef}
        style={{
          maxWidth: "var(--grid-max)",
          marginInline: "auto",
          opacity: 0,
        }}
      >
        {/* Divider */}
        <hr className="editorial-divider" style={{ marginBottom: "var(--space-xl)" }} />

        {/* Three-column footer */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "var(--space-lg)",
            alignItems: "start",
          }}
        >
          {/* Email */}
          <div>
            <span
              className="font-mono"
              style={{
                fontSize: "var(--text-label)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--ink-secondary)",
                display: "block",
                marginBottom: "var(--space-sm)",
              }}
            >
              Inquiries
            </span>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-mono"
              style={{
                fontSize: "var(--text-label)",
                letterSpacing: "0.04em",
                color: "var(--ink-primary)",
                textDecoration: "none",
                transition: "color var(--dur-hover) var(--ease-out)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ink-full)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ink-primary)"; }}
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          {/* Social links */}
          <div>
            <span
              className="font-mono"
              style={{
                fontSize: "var(--text-label)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--ink-secondary)",
                display: "block",
                marginBottom: "var(--space-sm)",
              }}
            >
              Elsewhere
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono"
                  style={{
                    fontSize: "var(--text-label)",
                    letterSpacing: "0.04em",
                    color: "var(--ink-primary)",
                    textDecoration: "none",
                    transition: "color var(--dur-hover) var(--ease-out)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ink-full)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ink-primary)"; }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Colophon */}
          <div style={{ textAlign: "right" }}>
            <span
              className="font-mono"
              style={{
                fontSize: "var(--text-meta)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--ink-secondary)",
              }}
            >
              HKJ Studio &copy; 2026
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
