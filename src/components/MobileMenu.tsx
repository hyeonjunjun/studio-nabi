"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import NothingEqLoader from "@/components/ui/NothingEqLoader";
import LiveClock from "@/components/ui/LiveClock";

/* ─────────────────────────────────────────────
   MobileMenu — full-screen navigation overlay
   Staggered link entrance, decorative EQ loader,
   contact info and live clock at the bottom.
   ───────────────────────────────────────────── */

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuLink {
  label: string;
  target: string;
}

const MENU_LINKS: MenuLink[] = [
  { label: "Work", target: "[data-section='work']" },
  { label: "About", target: "[data-section='about']" },
  { label: "Contact", target: "[data-section='contact']" },
];

/* ── Animation variants ── */

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const linkVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 + i * 0.08,
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
};

const footerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delay: 0.45, duration: 0.4 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const lenis = useLenis();

  const handleNavigate = useCallback(
    (target: string) => {
      const el = document.querySelector(target) as HTMLElement | null;
      if (el && lenis) {
        lenis.scrollTo(el, { offset: -50, duration: 1.5 });
      }
      onClose();
    },
    [lenis, onClose]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-menu"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-[60] flex flex-col"
          style={{ backgroundColor: "var(--color-bg)" }}
        >
          {/* ── Close button ── */}
          <div
            className="flex justify-end"
            style={{ padding: "0.5rem var(--page-px)" }}
          >
            <button
              onClick={onClose}
              className="font-mono transition-colors duration-200"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-dim)",
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-text-dim)")
              }
              aria-label="Close navigation menu"
            >
              &#x2715;
            </button>
          </div>

          {/* ── Navigation links ── */}
          <nav
            className="flex-1 flex flex-col justify-center"
            style={{ padding: "0 var(--page-px)", gap: 24 }}
          >
            {MENU_LINKS.map((link, i) => (
              <motion.button
                key={link.label}
                custom={i}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => handleNavigate(link.target)}
                className="font-mono uppercase tracking-[0.15em] text-left transition-colors duration-300"
                style={{
                  fontSize: "var(--text-2xl)",
                  color: "var(--color-text)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-accent)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-text)")
                }
              >
                {link.label}
              </motion.button>
            ))}
          </nav>

          {/* ── Footer: EQ loader, email, clock ── */}
          <motion.div
            variants={footerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-start"
            style={{
              padding: "0 var(--page-px)",
              paddingBottom: "2.5rem",
              gap: 16,
            }}
          >
            {/* Decorative equalizer */}
            <NothingEqLoader
              bars={4}
              segmentsPerBar={3}
              size={4}
              gap={2}
              intervalMs={140}
            />

            {/* Email */}
            <a
              href="mailto:hello@hkjstudio.com"
              className="font-mono transition-colors duration-300"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-dim)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-text-dim)")
              }
            >
              hello@hkjstudio.com
            </a>

            {/* Location + Clock */}
            <div
              className="flex items-center font-mono uppercase tracking-[0.08em]"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-dim)",
                gap: 8,
              }}
            >
              <span>NYC</span>
              <span style={{ color: "var(--color-text-ghost)" }}>&mdash;</span>
              <LiveClock showTimezone />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
