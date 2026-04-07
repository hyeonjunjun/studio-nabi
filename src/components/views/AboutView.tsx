import { Fragment } from "react";
import { motion } from "framer-motion";
import { SOCIALS, CONTACT_EMAIL } from "@/constants/contact";

const anim = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
  transition: { duration: 0.3 },
};

const stats = [
  ["Location", "New York"],
  ["Focus", "Design Engineering"],
  ["Experience", "3+ years"],
  ["Status", "Available"],
];

const experience = [
  {
    period: "2024 — Now",
    role: "Freelance Design Engineer",
    desc: "Building digital products and brand experiences for select clients.",
  },
  {
    period: "2023 — 24",
    role: "Design Technologist",
    desc: "Bridging design and engineering on product teams.",
  },
  {
    period: "2021 — 23",
    role: "Frontend Developer",
    desc: "Building interfaces and design systems at scale.",
  },
];

function Divider() {
  return (
    <div className="h-px w-8 my-5" style={{ background: "var(--fg-4)" }} />
  );
}

export default function AboutView() {
  return (
    <motion.div className="w-full" {...anim}>
      {/* Profile label */}
      <span
        className="font-mono text-[9px] uppercase tracking-[0.14em] block mb-4"
        style={{ color: "var(--fg-3)" }}
      >
        Profile
      </span>

      {/* Lead paragraph */}
      <p
        className="font-display tracking-[-0.02em]"
        style={{
          fontSize: "clamp(24px, 3vw, 32px)",
          color: "var(--fg)",
          lineHeight: 1.2,
        }}
      >
        Design engineer building at the intersection of craft and systems
        thinking.
      </p>

      {/* Body */}
      <p
        className="mt-4 text-[13px] max-w-[340px]"
        style={{ color: "var(--fg-2)", lineHeight: 1.7 }}
      >
        I care about type, motion, and the invisible details that make digital
        products feel considered. Currently based in New York, open to
        collaboration.
      </p>

      <Divider />

      {/* Stats grid */}
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 font-mono text-[9px] uppercase tracking-[0.06em]">
        {stats.map(([key, value]) => (
          <Fragment key={key}>
            <span style={{ color: "var(--fg-3)" }}>{key}</span>
            <span style={{ color: "var(--fg-2)" }}>{value}</span>
          </Fragment>
        ))}
      </div>

      <Divider />

      {/* Experience list */}
      <div className="flex flex-col gap-3">
        {experience.map((entry) => (
          <div key={entry.period} className="flex gap-3">
            <span
              className="font-mono text-[9px] tabular-nums shrink-0"
              style={{ width: 72, color: "var(--fg-3)" }}
            >
              {entry.period}
            </span>
            <div>
              <div className="text-[13px]" style={{ color: "var(--fg)" }}>
                {entry.role}
              </div>
              <div className="text-[12px]" style={{ color: "var(--fg-3)" }}>
                {entry.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Divider />

      {/* Contact email */}
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="font-mono text-[10px] block"
        style={{ color: "var(--fg-2)" }}
      >
        {CONTACT_EMAIL}
      </a>

      {/* Social links */}
      <div className="flex gap-4 mt-3">
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[8px] uppercase"
            style={{ color: "var(--fg-3)" }}
          >
            {s.label}
          </a>
        ))}
      </div>
    </motion.div>
  );
}
