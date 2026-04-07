"use client";

import { motion } from "framer-motion";
import GameLink from "@/components/GameLink";

const stagger = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
};

const MENU_ITEMS = [
  { href: "/index", label: "Index", desc: "Projects" },
  { href: "/archive", label: "Archive", desc: "Experiments" },
  { href: "/about", label: "About", desc: "Profile" },
];

export default function Home() {
  return (
    <main id="main" className="game-screen">
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Warm glow — bottom left */}
        <div
          className="absolute"
          style={{
            bottom: "10%",
            left: "5%",
            width: "50vw",
            height: "40vh",
            background:
              "radial-gradient(ellipse at center, rgba(200,164,85,0.03), transparent 60%)",
          }}
        />
        {/* Cool glow — top right */}
        <div
          className="absolute"
          style={{
            top: "10%",
            right: "5%",
            width: "40vw",
            height: "35vh",
            background:
              "radial-gradient(ellipse at center, rgba(74,138,140,0.025), transparent 60%)",
          }}
        />
      </div>

      {/* Top-left: Mark */}
      <motion.div
        className="absolute top-8 left-[clamp(32px,8vw,96px)] z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <span
          className="font-mono text-[11px] tracking-[0.04em]"
          style={{ color: "var(--fg-2)" }}
        >
          HKJ
        </span>
      </motion.div>

      {/* Top-right: Version / year */}
      <motion.div
        className="absolute top-8 right-[clamp(32px,8vw,96px)] z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <span
          className="font-mono text-[10px] tracking-[0.08em] uppercase"
          style={{ color: "var(--fg-3)" }}
        >
          2026
        </span>
      </motion.div>

      {/* Center-left: Main title */}
      <div className="absolute left-[clamp(32px,8vw,96px)] top-1/2 -translate-y-1/2 z-10">
        <motion.span
          className="block font-mono text-[10px] uppercase tracking-[0.14em] mb-5"
          style={{ color: "var(--fg-3)" }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Design Engineering Studio
        </motion.span>

        <motion.h1
          className="font-display font-normal leading-[0.95] tracking-[-0.03em] mb-10"
          style={{ fontSize: "clamp(56px, 8vw, 100px)", color: "var(--fg)" }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          HKJ
        </motion.h1>

        {/* Menu items */}
        <nav className="flex flex-col gap-1">
          {MENU_ITEMS.map((item, i) => (
            <motion.div
              key={item.href}
              variants={stagger}
              initial="initial"
              animate="animate"
              transition={{
                duration: 0.5,
                delay: 0.7 + i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <GameLink
                href={item.href}
                data-cursor="link"
                className="group flex items-center gap-4 py-3 transition-all duration-300"
              >
                {/* Selection indicator line */}
                <div
                  className="w-0 group-hover:w-8 h-px transition-all duration-500"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--accent-warm-1), transparent)",
                  }}
                />

                {/* Label */}
                <span
                  className="font-mono text-[13px] tracking-[0.04em] transition-colors duration-300"
                  style={{ color: "var(--fg-2)" }}
                >
                  <span className="group-hover:text-[var(--fg)] transition-colors duration-300">
                    {item.label}
                  </span>
                </span>

                {/* Desc */}
                <span
                  className="font-mono text-[10px] tracking-[0.06em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ color: "var(--fg-3)" }}
                >
                  {item.desc}
                </span>
              </GameLink>
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Bottom-left: Tagline */}
      <motion.div
        className="absolute bottom-8 left-[clamp(32px,8vw,96px)] z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
      >
        <p
          className="font-mono text-[10px] tracking-[0.04em] leading-[1.8] max-w-[280px]"
          style={{ color: "var(--fg-3)" }}
        >
          Craft, systems thinking, and the invisible
          <br />
          details that make software feel intentional.
        </p>
      </motion.div>

      {/* Bottom-right: Decorative corner mark */}
      <motion.div
        className="absolute bottom-8 right-[clamp(32px,8vw,96px)] z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M24 0L24 8M24 0L16 0"
            stroke="var(--accent-warm-1)"
            strokeWidth="0.75"
            opacity="0.4"
          />
          <path
            d="M0 24L0 16M0 24L8 24"
            stroke="var(--accent-warm-1)"
            strokeWidth="0.75"
            opacity="0.2"
          />
        </svg>
      </motion.div>
    </main>
  );
}
