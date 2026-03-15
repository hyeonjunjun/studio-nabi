"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SOCIALS, CONTACT_EMAIL } from "@/constants/contact";

/**
 * Contact — Editorial contact with generous whitespace
 *
 * Clean hierarchy: label → email (display serif) → meta → socials.
 * Subtle fade-in reveals. Accent line for depth.
 * Maximum whitespace — the quietest section.
 */
export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;

    // Content reveals — gentle opacity + rise
    const els = section.querySelectorAll("[data-contact-reveal]");
    gsap.fromTo(
      els,
      { opacity: 0.15, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 70%" },
      }
    );

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
            scrub: 0.3,
          },
        }
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section-padding relative overflow-hidden"
      style={{
        paddingTop: "clamp(14rem, 24vh, 20rem)",
        paddingBottom: "clamp(10rem, 18vh, 16rem)",
      }}
    >
      {/* Accent line */}
      <div
        ref={accentRef}
        className="absolute pointer-events-none"
        style={{
          bottom: "30%",
          right: "var(--page-px)",
          width: "60px",
          height: "1px",
          backgroundColor: "var(--color-accent)",
          opacity: 0.2,
          transformOrigin: "right center",
          transform: "scaleX(0)",
        }}
      />

      <div className="max-w-[900px] mx-auto relative z-10">
        {/* Section label */}
        <div className="mb-16" data-contact-reveal>
          <span
            className="font-mono uppercase"
            style={{
              fontSize: "var(--text-micro)",
              letterSpacing: "0.15em",
              color: "var(--color-text-ghost)",
            }}
          >
            Get in touch
          </span>
        </div>

        {/* Email — display serif focal point */}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-display block group"
          style={{
            fontSize: "var(--text-display)",
            color: "var(--color-text)",
            lineHeight: 1.2,
          }}
          data-contact-reveal
        >
          <span className="relative inline-block">
            {CONTACT_EMAIL}
            <span
              className="absolute -bottom-2 left-0 right-0 h-[1px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"
              style={{
                backgroundColor: "var(--color-accent)",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </span>
        </a>

        {/* Meta — city, availability */}
        <p
          className="font-sans mt-6"
          style={{
            fontSize: "var(--text-small)",
            color: "var(--color-text-dim)",
            lineHeight: 1.6,
          }}
          data-contact-reveal
        >
          New York / Seoul &middot; Available for select projects
        </p>

        {/* Aside — personal note */}
        <p
          className="font-mono mt-8"
          style={{
            fontSize: "var(--text-micro)",
            color: "var(--color-text-ghost)",
            lineHeight: 1.7,
            letterSpacing: "0.04em",
            maxWidth: "52ch",
          }}
          data-contact-reveal
        >
          I&rsquo;m always interested in thoughtful collaborations &mdash;
          whether it&rsquo;s a product that needs design engineering,
          a brand that needs a digital home, or something entirely new.
        </p>

        {/* Social links */}
        <div
          className="mt-10 flex items-center flex-wrap"
          data-contact-reveal
        >
          {SOCIALS.map((social, i) => (
            <span key={social.label} className="flex items-center">
              {i > 0 && (
                <span
                  className="mx-3"
                  style={{
                    color: "var(--color-text-ghost)",
                    fontSize: "var(--text-micro)",
                  }}
                >
                  &middot;
                </span>
              )}
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono relative group/social"
                style={{
                  fontSize: "var(--text-micro)",
                  letterSpacing: "0.1em",
                  color: "var(--color-text-dim)",
                  textTransform: "uppercase",
                }}
              >
                <span className="transition-colors duration-300 group-hover/social:text-[var(--color-text)]">
                  {social.label}
                </span>
                <span
                  className="absolute -bottom-0.5 left-0 right-0 h-[1px] origin-left scale-x-0 group-hover/social:scale-x-100 transition-transform duration-400"
                  style={{
                    backgroundColor: "var(--color-text-dim)",
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              </a>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
