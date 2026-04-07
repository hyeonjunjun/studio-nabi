"use client";

import { motion } from "framer-motion";
import { SOCIALS, CONTACT_EMAIL } from "@/constants/contact";
import Footer from "@/components/Footer";

const reveal = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { type: "spring" as const, stiffness: 120, damping: 20, mass: 0.8 },
};

function DiamondDivider() {
  return (
    <motion.div {...reveal} className="relative mt-10 mb-8">
      <div className="h-px bg-fg-4" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[6px] h-[6px] bg-fg-4 rotate-45" />
    </motion.div>
  );
}

const DETAILS = [
  { label: "Location", value: "New York" },
  { label: "Focus", value: "Design Engineering" },
  { label: "Status", value: "Available for select projects" },
];

const EXPERIENCE = [
  { period: "2024\u2013", role: "HKJ Studio", desc: "Independent design engineering" },
  { period: "2023\u201324", role: "Product", desc: "Mobile & AI products" },
  { period: "2022\u201323", role: "Design Systems", desc: "Component architecture & tokens" },
];

export default function AboutPage() {
  return (
    <main id="main" className="min-h-screen">
      <section
        className="pb-20"
        style={{
          paddingTop: "clamp(80px, 12vh, 140px)",
          paddingLeft: "var(--pad)",
          paddingRight: "var(--pad)",
          maxWidth: 680,
        }}
      >
        {/* ── Label ── */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="block mb-8 font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3"
        >
          About
        </motion.span>

        {/* ── Lead paragraph ── */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 120, damping: 20, mass: 0.8 }}
          className="mb-5 font-display text-fg max-w-[58ch]"
          style={{
            fontSize: "clamp(22px, 3vw, 32px)",
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
          }}
        >
          HKJ is a one-person design engineering practice based in New York. I
          care about type, motion, and the invisible details that make software
          feel intentional.
        </motion.p>

        {/* ── Second paragraph ── */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120, damping: 20, mass: 0.8 }}
          className="text-[15px] leading-[1.7] text-fg-2 max-w-[54ch]"
          style={{ letterSpacing: "-0.01em" }}
        >
          Previously, I worked on products across mobile, AI, and design
          systems. I believe the best digital work borrows from the rigor of
          print and the warmth of physical objects.
        </motion.p>

        {/* ── Personal note ── */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 120, damping: 20, mass: 0.8 }}
          className="mt-8 font-mono text-[10px] text-fg-3"
          style={{ lineHeight: 1.7, letterSpacing: "0.04em" }}
        >
          When I&rsquo;m not pushing pixels, I&rsquo;m probably hunting for good
          light to photograph, reading about material science, or making
          pour-overs that take too long.
        </motion.p>

        {/* ── Diamond divider ── */}
        <DiamondDivider />

        {/* ── Details block (character-sheet stats) ── */}
        <motion.div
          {...reveal}
          className="grid grid-cols-2 gap-x-8 gap-y-3"
        >
          {DETAILS.map((d) => (
            <div key={d.label}>
              <span className="block font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3">
                {d.label}
              </span>
              <span className="block text-[13px] text-fg">{d.value}</span>
            </div>
          ))}
        </motion.div>

        {/* ── Experience ── */}
        <motion.div {...reveal} className="mt-10">
          <span className="block mb-4 font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3">
            Experience
          </span>
          <div className="flex flex-col gap-3">
            {EXPERIENCE.map((exp) => (
              <div key={exp.period} className="flex flex-col gap-1">
                <span
                  className="font-mono text-[10px] text-fg-3"
                  style={{ letterSpacing: "0.04em" }}
                >
                  {exp.period}
                </span>
                <span
                  className="text-[15px] text-fg-2 leading-[1.5]"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  <span className="text-fg">{exp.role}</span> &mdash;{" "}
                  {exp.desc}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Diamond divider ── */}
        <DiamondDivider />

        {/* ── Contact ── */}
        <motion.div {...reveal}>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            data-cursor="link"
            className="text-[15px] text-fg no-underline"
            style={{ letterSpacing: "-0.01em" }}
          >
            {CONTACT_EMAIL}
          </a>
        </motion.div>

        {/* ── Socials ── */}
        <motion.div {...reveal} className="mt-4">
          {SOCIALS.map((link, i) => (
            <span key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3 no-underline transition-colors duration-300 hover:text-fg"
              >
                {link.label}
              </a>
              {i < SOCIALS.length - 1 && (
                <span className="font-mono text-[10px] text-fg-3 mx-2">
                  &middot;
                </span>
              )}
            </span>
          ))}
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
