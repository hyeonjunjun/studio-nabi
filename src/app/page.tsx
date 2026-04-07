"use client";

import { motion } from "framer-motion";
import GameLink from "@/components/GameLink";

const MENU_ITEMS = [
  { href: "/index", label: "Index", desc: "Projects", num: "01" },
  { href: "/archive", label: "Archive", desc: "Experiments", num: "02" },
  { href: "/about", label: "About", desc: "Profile", num: "03" },
];

export default function Home() {
  return (
    <main id="main" className="game-screen">
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute"
          style={{
            bottom: 0, left: 0, width: "60vw", height: "50vh",
            background: "radial-gradient(ellipse at center, rgba(200,164,85,0.025), transparent 60%)",
          }}
        />
        <div
          className="absolute"
          style={{
            top: 0, right: 0, width: "45vw", height: "40vh",
            background: "radial-gradient(ellipse at center, rgba(74,138,140,0.018), transparent 60%)",
          }}
        />
      </div>

      {/* ═══ Top bar — thin horizontal chrome ═══ */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between h-12"
        style={{
          paddingInline: "clamp(32px, 8vw, 96px)",
          borderBottom: "1px solid var(--fg-4)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <span className="font-display text-[14px] tracking-[0.02em]" style={{ color: "var(--fg)" }}>
          HKJ
        </span>
        <span className="font-mono text-[9px] tracking-[0.12em] uppercase" style={{ color: "var(--fg-3)" }}>
          New York — 2026
        </span>
      </motion.div>

      {/* ═══ Center: Title panel ═══ */}
      <div className="absolute left-[clamp(32px,8vw,96px)] top-1/2 z-10" style={{ transform: "translateY(-55%)" }}>
        <motion.div
          className="ui-panel"
          style={{ padding: "28px 36px", minWidth: 320 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            className="block font-mono text-[9px] uppercase tracking-[0.18em] mb-4"
            style={{ color: "var(--fg-3)" }}
          >
            Design Engineering
          </span>

          <h1
            className="font-display font-normal leading-[0.9] tracking-[-0.04em] mb-0"
            style={{ fontSize: "clamp(72px, 10vw, 120px)", color: "var(--fg)" }}
          >
            HKJ
          </h1>
        </motion.div>

        {/* Menu — below the panel, aligned */}
        <motion.nav
          className="mt-6 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          {MENU_ITEMS.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <GameLink
                href={item.href}
                data-cursor="link"
                className="group flex items-center gap-4 py-3 pl-1 transition-all duration-300 border-l border-transparent hover:border-[var(--accent-warm-1)]"
                style={{ paddingLeft: 12 }}
              >
                <span className="font-mono text-[9px] tracking-[0.08em] tabular-nums" style={{ color: "var(--fg-3)" }}>
                  {item.num}
                </span>
                <span className="font-body text-[14px] tracking-[0.01em] group-hover:text-[var(--fg)] transition-colors duration-300" style={{ color: "var(--fg-2)" }}>
                  {item.label}
                </span>
                <span
                  className="font-mono text-[9px] tracking-[0.06em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-auto"
                  style={{ color: "var(--fg-3)" }}
                >
                  {item.desc}
                </span>
              </GameLink>
            </motion.div>
          ))}
        </motion.nav>
      </div>

      {/* ═══ Right side: decorative panel with geometric elements ═══ */}
      <motion.div
        className="absolute z-10"
        style={{
          right: "clamp(32px, 8vw, 96px)",
          top: "50%",
          transform: "translateY(-50%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {/* Vertical line with ticks */}
        <div className="flex flex-col items-center gap-0">
          <div className="w-px h-24" style={{ background: "linear-gradient(to bottom, transparent, var(--fg-4))" }} />
          <div className="w-2 h-px" style={{ background: "var(--fg-4)" }} />
          <div className="w-px h-8" style={{ background: "var(--fg-4)" }} />
          <div className="w-2 h-px" style={{ background: "var(--fg-4)" }} />
          <div className="w-px h-8" style={{ background: "var(--fg-4)" }} />
          <div className="w-2 h-px" style={{ background: "var(--fg-4)" }} />
          <div className="w-px h-24" style={{ background: "linear-gradient(to top, transparent, var(--fg-4))" }} />
        </div>
      </motion.div>

      {/* ═══ Bottom bar ═══ */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between h-10"
        style={{
          paddingInline: "clamp(32px, 8vw, 96px)",
          borderTop: "1px solid var(--fg-4)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <span className="font-mono text-[9px] tracking-[0.04em]" style={{ color: "var(--fg-3)" }}>
          Craft and systems thinking
        </span>
        <span className="font-mono text-[9px] tracking-[0.04em]" style={{ color: "var(--fg-3)" }}>
          v1.0
        </span>
      </motion.div>
    </main>
  );
}
