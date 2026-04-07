"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[60vh] flex items-end"
      style={{
        paddingInline: "clamp(24px, 6vw, 48px)",
        paddingBottom: "clamp(24px, 4vw, 48px)",
      }}
    >
      {/* Radial glow */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: "33%",
          left: "33%",
          width: 600,
          height: 400,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(ellipse at center, var(--accent-warm-1), transparent 70%)",
          opacity: 0.04,
        }}
      />

      <motion.h1
        className="font-display font-normal"
        style={{
          fontSize: "clamp(28px, 4vw, 36px)",
          letterSpacing: "-0.01em",
          color: "var(--fg)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Design engineering
      </motion.h1>
    </section>
  );
}
