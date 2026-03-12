"use client";

import { useState, useCallback } from "react";
import LiveClock from "@/components/ui/LiveClock";
import InfiniteMarquee from "@/components/ui/InfiniteMarquee";
import SplitText from "@/components/ui/SplitText";

const PORTS = [
  { label: "Client", description: "Product & brand work" },
  { label: "Collab", description: "Joint ventures & open source" },
  { label: "Speaking", description: "Talks, panels, mentorship" },
];

const SOCIALS = [
  { label: "GitHub", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Twitter", href: "#" },
];

const MARQUEE_ITEMS = [
  "Craft",
  "Systems",
  "AI",
  "Design",
  "Engineering",
  "Restraint",
];

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const email = "hello@hkjstudio.com";

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const input = document.createElement("input");
      input.value = email;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [email]);

  return (
    <>
      {/* ═══ Marquee divider ═══ */}
      <InfiniteMarquee
        items={MARQUEE_ITEMS}
        separator="—"
        speed={40}
      />

      <section
        data-section="contact"
        className="relative"
        style={{
          padding: "8rem var(--page-px) 0",
          backgroundColor: "var(--color-bg)",
        }}
      >
        {/* ═══ Full-width CTA — no card wrapper ═══ */}
        <div className="max-w-4xl mx-auto text-center mb-20 md:mb-28">
          <SplitText
            text="Let's build something extraordinary."
            tag="h2"
            type="words"
            animation="slide-up"
            stagger={0.05}
            delay={0.1}
            duration={0.7}
            className="font-display italic"
            style={{
              fontSize: "clamp(2rem, 6vw, 5rem)",
              lineHeight: 1.1,
              color: "var(--color-text)",
            }}
          />

          {/* Email CTA */}
          <button
            onClick={copyEmail}
            className="font-mono tracking-[0.02em] transition-colors duration-300 mt-10 md:mt-14 block mx-auto"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              color: copied
                ? "var(--color-accent-warm)"
                : "var(--color-text)",
              lineHeight: 1.1,
            }}
          >
            {copied ? "Copied to clipboard" : email}
          </button>

          <p
            className="mt-2 transition-opacity duration-300 micro"
            style={{ opacity: copied ? 0 : 1 }}
          >
            Click to copy
          </p>
        </div>

        {/* ═══ Port diagram — simplified horizontal ═══ */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto mb-20"
          style={{
            borderTop: "1px solid var(--color-border)",
            paddingTop: "2rem",
          }}
        >
          {PORTS.map((port) => (
            <div
              key={port.label}
              className="flex flex-col items-center sm:items-center gap-1"
            >
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.12em",
                  color: "var(--color-text)",
                }}
              >
                {port.label}
              </span>
              <span
                className="font-sans"
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-dim)",
                }}
              >
                {port.description}
              </span>
            </div>
          ))}
        </div>

        {/* ═══ Footer bar ═══ */}
        <div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          style={{
            borderTop: "1px solid var(--color-border)",
            padding: "1rem 0 2rem",
          }}
        >
          {/* Social links */}
          <div className="flex gap-6">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="font-mono uppercase tracking-[0.1em] transition-colors duration-300"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-dim)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-text)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-text-dim)")
                }
              >
                {s.label}
              </a>
            ))}
          </div>

          {/* Clock + Copyright */}
          <div className="flex items-center gap-6">
            <LiveClock showTimezone className="font-mono" />
            <span
              className="font-mono"
              style={{
                color: "var(--color-text-ghost)",
                fontSize: "var(--text-xs)",
              }}
            >
              &copy; {new Date().getFullYear()} HKJ Studio
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
