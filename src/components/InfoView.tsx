"use client";

import { motion } from "framer-motion";
import { useStudioStore } from "@/lib/store";
import { SOCIALS, CONTACT_EMAIL } from "@/constants/contact";

const CAPABILITIES = [
  "Design Systems",
  "React / Next.js",
  "React Native",
  "Motion Design",
  "Prototyping",
  "Visual Design",
  "WebGL / 3D",
  "AI Integration",
];

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function InfoView() {
  const setActiveOverlay = useStudioStore((s) => s.setActiveOverlay);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease }}
      className="section-padding"
      style={{ paddingTop: "clamp(4rem, 10vh, 8rem)", paddingBottom: "clamp(6rem, 12vh, 10rem)" }}
    >
      <div className="max-w-[900px] mx-auto">
        {/* Editorial intro */}
        <h2
          className="editorial-display mb-8"
          style={{ fontSize: "var(--text-2xl)", color: "var(--color-text)" }}
        >
          <em>Design engineer</em> building at the intersection of craft and code.
        </h2>

        <p
          className="font-sans mb-16"
          style={{
            fontSize: "var(--text-base)",
            lineHeight: 1.7,
            color: "var(--color-text-secondary)",
            maxWidth: "56ch",
          }}
        >
          HKJ Studio is a one-person design engineering practice based between
          New York and Seoul. We build products that feel considered — from
          system design to pixel-level detail.
        </p>

        {/* Capabilities */}
        <div className="mb-16">
          <span
            className="micro block mb-6"
            style={{ color: "var(--color-text-ghost)" }}
          >
            capabilities
          </span>
          <div>
            {CAPABILITIES.map((cap, i) => (
              <div
                key={cap}
                className="py-3"
                style={{
                  borderBottom: i < CAPABILITIES.length - 1
                    ? "1px solid var(--color-border)"
                    : "none",
                }}
              >
                <span
                  className="font-sans"
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text)",
                  }}
                >
                  {cap}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mb-16">
          <span
            className="micro block mb-6"
            style={{ color: "var(--color-text-ghost)" }}
          >
            contact
          </span>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-mono block mb-4 hover:text-[var(--color-accent)] transition-colors"
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text)",
            }}
          >
            {CONTACT_EMAIL}
          </a>

          <div className="flex gap-6">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono hover:text-[var(--color-accent)] transition-colors"
                style={{
                  fontSize: "var(--text-micro)",
                  letterSpacing: "0.1em",
                  color: "var(--color-text-secondary)",
                }}
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>

        {/* Full contact overlay trigger */}
        <button
          onClick={() => setActiveOverlay("contact")}
          data-cursor="project"
          className="group headline-mixed"
        >
          <span
            className="font-sans font-medium uppercase"
            style={{
              fontSize: "var(--text-xl)",
              color: "var(--color-text)",
            }}
          >
            let&apos;s{" "}
          </span>
          <em
            className="group-hover:text-[var(--color-accent)] transition-colors duration-400"
            style={{
              fontSize: "var(--text-xl)",
              color: "var(--color-text)",
            }}
          >
            work together.
          </em>
        </button>
      </div>
    </motion.div>
  );
}
