"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { SOCIALS, CONTACT_EMAIL } from "@/constants/contact";

const anim = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.4 },
};

const stats: [string, string][] = [
  ["Location", "New York"],
  ["Focus", "Design Engineering"],
  ["Experience", "3+ years"],
  ["Status", "Available"],
];

const experience = [
  { period: "2024 —", role: "Freelance Design Engineer" },
  { period: "2023 — 24", role: "Design Technologist" },
  { period: "2021 — 23", role: "Frontend Developer" },
];

export default function AboutView() {
  return (
    <motion.div className="w-full h-full relative" {...anim}>
      {/* ═══ Large statement — poster scale ═══ */}
      <div
        className="absolute font-display"
        style={{
          bottom: 80,
          left: 0,
          right: -40,
          fontSize: "clamp(36px, 5vw, 56px)",
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          color: "var(--fg)",
          fontWeight: 500,
          zIndex: 2,
        }}
      >
        Design
        <br />
        engineering
        <br />
        <span style={{ color: "var(--fg-2)" }}>at the intersection</span>
      </div>

      {/* ═══ Info block — top left ═══ */}
      <div className="absolute" style={{ top: 0, left: 0, zIndex: 3 }}>
        <span
          className="font-mono uppercase block"
          style={{
            fontSize: 9,
            letterSpacing: "0.1em",
            color: "var(--fg-3)",
            marginBottom: 20,
          }}
        >
          Profile
        </span>

        {/* Stats */}
        <div
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "0.06em",
            lineHeight: 2.2,
          }}
        >
          {stats.map(([key, value]) => (
            <div key={key}>
              <span style={{ color: "var(--fg-3)" }}>{key}</span>
              {"  "}
              <span style={{ color: "var(--fg-2)" }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            width: 24,
            background: "var(--fg-4)",
            marginTop: 20,
            marginBottom: 16,
          }}
        />

        {/* Experience — compact */}
        <div
          className="font-mono"
          style={{
            fontSize: 9,
            letterSpacing: "0.04em",
            lineHeight: 2,
          }}
        >
          {experience.map((e) => (
            <div key={e.period}>
              <span style={{ color: "var(--fg-3)", fontVariantNumeric: "tabular-nums" }}>
                {e.period}
              </span>
              {"  "}
              <span style={{ color: "var(--fg-2)" }}>{e.role}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            width: 24,
            background: "var(--fg-4)",
            marginTop: 20,
            marginBottom: 16,
          }}
        />

        {/* Contact */}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-mono block"
          style={{ fontSize: 9, color: "var(--fg-2)", letterSpacing: "0.02em" }}
        >
          {CONTACT_EMAIL}
        </a>

        <div className="flex" style={{ gap: 12, marginTop: 8 }}>
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono uppercase"
              style={{ fontSize: 8, letterSpacing: "0.06em", color: "var(--fg-3)" }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
