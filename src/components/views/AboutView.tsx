"use client";

import { motion } from "framer-motion";
import { SOCIALS, CONTACT_EMAIL } from "@/constants/contact";

export default function AboutView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Bio — serif, warm, intimate */}
      <p
        className="font-display"
        style={{
          fontSize: 15,
          lineHeight: 1.7,
          letterSpacing: "-0.01em",
          color: "var(--fg)",
          fontWeight: 400,
        }}
      >
        Design engineer building at the intersection of craft and systems thinking.
      </p>

      <p
        className="font-display"
        style={{
          fontSize: 14,
          lineHeight: 1.7,
          letterSpacing: "-0.01em",
          color: "var(--fg-2)",
          fontWeight: 400,
          marginTop: 16,
        }}
      >
        I care about type, motion, and the invisible details that make digital products feel considered.
      </p>

      {/* Experience — just lines of text */}
      <div style={{ marginTop: 48 }}>
        {[
          ["2024 —", "Independent"],
          ["2023 — 24", "Design Technologist"],
          ["2021 — 23", "Frontend Developer"],
        ].map(([period, role]) => (
          <div
            key={period}
            style={{
              display: "flex",
              gap: 16,
              padding: "8px 0",
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: 9,
                letterSpacing: "0.04em",
                fontVariantNumeric: "tabular-nums",
                color: "var(--fg-3)",
                width: 72,
                flexShrink: 0,
              }}
            >
              {period}
            </span>
            <span
              className="font-body"
              style={{
                fontSize: 11,
                color: "var(--fg-2)",
              }}
            >
              {role}
            </span>
          </div>
        ))}
      </div>

      {/* Contact — minimal */}
      <div style={{ marginTop: 48 }}>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-mono block"
          style={{
            fontSize: 9,
            letterSpacing: "0.04em",
            color: "var(--fg-2)",
          }}
        >
          {CONTACT_EMAIL}
        </a>
        <div className="flex" style={{ gap: 16, marginTop: 12 }}>
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono uppercase"
              style={{
                fontSize: 8,
                letterSpacing: "0.06em",
                color: "var(--fg-3)",
              }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
