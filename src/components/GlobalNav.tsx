"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { useStudioStore } from "@/lib/store";
import { NAV_LINKS, type NavLink } from "@/constants/navigation";
import MobileMenu from "@/components/MobileMenu";

/**
 * GlobalNav — Lowercase Voice Navigation
 *
 * Design DNA: Felix Nieto lowercase confidence + Prototype Studio contextual color
 *
 * Structure:
 *   Left: "hkj" wordmark (font-sans, medium)
 *   Right (desktop): works / about / contact
 *   Right (mobile): "menu" text button
 *
 * - mix-blend-difference for universal readability
 * - Framer Motion spring underline on link hover
 * - GSAP stagger entrance after preloader
 * - Shared NAV_LINKS constant (no duplication)
 */

const underlineTransition = {
  type: "spring" as const,
  stiffness: 500,
  damping: 30,
};

export default function GlobalNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const isLoaded = useStudioStore((s) => s.isLoaded);
  const setActiveOverlay = useStudioStore((s) => s.setActiveOverlay);
  const activeView = useStudioStore((s) => s.activeView);
  const setActiveView = useStudioStore((s) => s.setActiveView);
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent, link: NavLink) => {
      e.preventDefault();
      if (link.view) {
        setActiveView(link.view);
      } else if (link.overlay) {
        setActiveOverlay(link.overlay);
      } else if (link.href) {
        router.push(link.href);
      }
    },
    [setActiveOverlay, setActiveView, router]
  );

  // GSAP stagger entrance after preloader
  useEffect(() => {
    if (!isLoaded || !navRef.current) return;

    const wordmark = navRef.current.querySelector("[data-wordmark]");
    const links = navRef.current.querySelectorAll("[data-nav-link]");
    const menuBtn = navRef.current.querySelector("[data-menu-btn]");

    const targets = [wordmark, ...Array.from(links), menuBtn].filter(Boolean);

    gsap.fromTo(
      targets,
      { opacity: 0, y: 8 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.06,
        delay: 0.15,
      }
    );
  }, [isLoaded]);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between mix-blend-difference"
        style={{
          padding: "clamp(1rem, 2.5vh, 1.75rem) var(--page-px)",
        }}
      >
        {/* Wordmark */}
        <a href="/" data-wordmark style={{ opacity: 0 }}>
          <span
            className="font-sans font-medium"
            style={{
              fontSize: "var(--text-sm)",
              color: "#ffffff",
              lineHeight: 1,
              letterSpacing: "-0.01em",
            }}
          >
            hkj
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href || "#"}
              onClick={(e) => handleClick(e, link)}
              data-nav-link
              className="relative cursor-pointer"
              style={{
                opacity: 0,
                fontSize: "var(--text-xs)",
                letterSpacing: "0.02em",
                color: "#ffffff",
                fontFamily: "var(--font-sans)",
              }}
              onMouseEnter={() => setHoveredLink(link.label)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <motion.span
                className="inline-block"
                animate={{ y: hoveredLink === link.label ? -2 : 0 }}
                transition={underlineTransition}
              >
                {link.label}
              </motion.span>

              {/* Underline */}
              <motion.span
                className="absolute -bottom-[2px] left-0 right-0 h-[1px] bg-white origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: link.view === activeView || hoveredLink === link.label ? 1 : 0 }}
                transition={{
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </a>
          ))}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          data-menu-btn
          className="md:hidden font-sans font-medium"
          style={{
            opacity: 0,
            fontSize: "var(--text-xs)",
            letterSpacing: "0.02em",
            color: "#ffffff",
          }}
          aria-label="Open menu"
        >
          menu
        </button>
      </nav>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
