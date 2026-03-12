"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useLenis } from "lenis/react";
import MagneticButton from "@/components/ui/MagneticButton";
import MobileMenu from "@/components/MobileMenu";

/* ─────────────────────────────────────────────
   GlobalNav — always-visible editorial nav
   Transparent over hero, frosted bone on scroll.
   Desktop: brand · serif italic links · role/location
   Mobile:  brand · hamburger → MobileMenu
   ───────────────────────────────────────────── */

interface NavLink {
  label: string;
  target: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Work", target: "[data-section='work']" },
  { label: "About", target: "[data-section='about']" },
  { label: "Contact", target: "[data-section='contact']" },
];

export default function GlobalNav() {
  const [scrollRatio, setScrollRatio] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lenis = useLenis();

  /* ── Scroll-based background opacity (0 → 1 over first 50vh) ── */
  useEffect(() => {
    if (!lenis) return;

    const handleScroll = () => {
      const threshold = window.innerHeight * 0.5;
      setScrollRatio(Math.min(lenis.scroll / threshold, 1));
    };

    lenis.on("scroll", handleScroll);
    handleScroll();

    return () => {
      lenis.off("scroll", handleScroll);
    };
  }, [lenis]);

  /* ── Scroll-to helper ── */
  const scrollTo = useCallback(
    (target: string) => {
      const el = document.querySelector(target) as HTMLElement | null;
      if (el && lenis) {
        lenis.scrollTo(el, { offset: -60, duration: 1.5 });
      }
    },
    [lenis],
  );

  const scrollToTop = useCallback(() => {
    lenis?.scrollTo(0, { duration: 1.5 });
  }, [lenis]);

  /* ── Lock body scroll when mobile menu is open ── */
  useEffect(() => {
    if (mobileMenuOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [mobileMenuOpen, lenis]);

  const bgOpacity = scrollRatio * 0.92;
  const borderOpacity = scrollRatio;

  return (
    <>
      <motion.nav
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          height: 48,
          backgroundColor: `rgba(243, 238, 230, ${bgOpacity})`,
          backdropFilter: scrollRatio > 0.05 ? "blur(8px)" : "none",
          WebkitBackdropFilter: scrollRatio > 0.05 ? "blur(8px)" : "none",
          borderBottom: `1px solid rgba(38, 38, 38, ${borderOpacity * 0.12})`,
        }}
      >
        <div
          className="flex items-center justify-between h-full"
          style={{ padding: "0 var(--page-px)" }}
        >
          {/* ── Brand ── */}
          <button
            onClick={scrollToTop}
            className="font-mono uppercase tracking-[0.15em] transition-colors duration-300"
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-text)",
            }}
          >
            HKJ Studio
          </button>

          {/* ── Desktop center links — serif italic ── */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <MagneticButton key={link.label} strength={0.15} radius={60}>
                <button
                  onClick={() => scrollTo(link.target)}
                  className="font-display italic transition-colors duration-300"
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
                  {link.label}
                </button>
              </MagneticButton>
            ))}
          </div>

          {/* ── Right: role + location ── */}
          <div className="hidden md:flex items-center gap-4">
            <span
              className="font-mono uppercase tracking-[0.08em]"
              style={{
                fontSize: "var(--text-micro)",
                color: "var(--color-text-ghost)",
              }}
            >
              Design Engineering
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: "var(--text-micro)",
                color: "var(--color-text-ghost)",
                opacity: 0.4,
              }}
            >
              /
            </span>
            <span
              className="font-mono uppercase tracking-[0.08em]"
              style={{
                fontSize: "var(--text-micro)",
                color: "var(--color-text-ghost)",
              }}
            >
              NYC
            </span>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="flex md:hidden flex-col items-center justify-center"
            style={{ gap: 4, width: 24, height: 24 }}
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <div
              className="transition-colors duration-200"
              style={{
                width: 16,
                height: 1,
                backgroundColor: "var(--color-text)",
              }}
            />
            <div
              className="transition-colors duration-200"
              style={{
                width: 16,
                height: 1,
                backgroundColor: "var(--color-text)",
              }}
            />
            <div
              className="transition-colors duration-200"
              style={{
                width: 16,
                height: 1,
                backgroundColor: "var(--color-text)",
              }}
            />
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile Menu Overlay ── */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
