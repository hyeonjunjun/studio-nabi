"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import { useStudioStore } from "@/lib/store";
import { MENU_LINKS, type NavLink } from "@/constants/navigation";
import { CONTACT_EMAIL } from "@/constants/contact";
import { PROJECTS } from "@/constants/projects";

/**
 * MobileMenu — Two-Column Overlay with Image Previews
 *
 * Design DNA: Felix Nieto's full-screen overlay with section image previews
 *
 * Structure:
 *   Left (60%): Numbered serif italic links — 01 works, 02 about, 03 contact, 04 lab
 *   Right (40%): Project image preview that changes on link hover
 *   Top bar: "hkj" wordmark + "close" button
 *   Footer: email + availability status
 *
 * Animation: Framer Motion clipPath entrance + staggered links + image crossfade
 */

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Preview images for each menu item
const MENU_IMAGES = [
  PROJECTS[0]?.image || "/placeholder.jpg", // works → first project
  PROJECTS[1]?.mood || "/placeholder.jpg",  // about → mood image
  PROJECTS[2]?.image || "/placeholder.jpg", // contact → project image
  PROJECTS[3]?.mood || "/placeholder.jpg",  // lab → mood image
];

const panelEase = [0.76, 0, 0.24, 1] as [number, number, number, number];
const contentEase = [0.16, 1, 0.3, 1] as [number, number, number, number];

const overlayVariants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.55, ease: panelEase },
  },
  exit: {
    clipPath: "inset(0 0 100% 0)",
    transition: { duration: 0.4, ease: panelEase },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 + i * 0.08,
      duration: 0.65,
      ease: contentEase,
    },
  }),
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.12 },
  },
};

const footerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.5, duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const router = useRouter();
  const lenis = useLenis();
  const setActiveOverlay = useStudioStore((s) => s.setActiveOverlay);
  const setActiveView = useStudioStore((s) => s.setActiveView);

  const handleNavigate = useCallback(
    (link: NavLink) => {
      if (link.view) {
        onClose();
        setTimeout(() => setActiveView(link.view!), 300);
        return;
      }
      if (link.overlay) {
        onClose();
        setTimeout(() => setActiveOverlay(link.overlay!), 300);
        return;
      }
      if (link.href) {
        onClose();
        if (link.href === "/" && window.location.pathname === "/") {
          lenis?.scrollTo(0, { duration: 1.2 });
        } else {
          router.push(link.href);
        }
      }
    },
    [onClose, setActiveOverlay, setActiveView, router, lenis]
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
          className="fixed inset-0 z-[60] flex flex-col overflow-hidden"
          style={{ backgroundColor: "var(--color-bg)" }}
        >
          {/* Top bar */}
          <div
            className="relative z-10 flex items-center justify-between"
            style={{ padding: "clamp(1rem, 2.5vh, 1.75rem) var(--page-px)" }}
          >
            <span
              className="font-sans font-medium"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text)",
                letterSpacing: "-0.01em",
              }}
            >
              hkj
            </span>
            <button
              onClick={onClose}
              data-cursor="close"
              className="font-sans"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-secondary)",
                letterSpacing: "0.02em",
              }}
              aria-label="Close menu"
            >
              close
            </button>
          </div>

          {/* Two-column content */}
          <div
            className="relative z-10 flex-1 flex"
            style={{ padding: "0 var(--page-px)" }}
          >
            {/* Left: Navigation links */}
            <nav className="flex-1 flex flex-col justify-center gap-0">
              {MENU_LINKS.map((link, i) => (
                <motion.button
                  key={link.label}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={() => handleNavigate(link)}
                  onMouseEnter={() => setHoveredIndex(i)}
                  className="text-left py-4 sm:py-5 border-b group flex items-baseline gap-4"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "var(--text-micro)",
                      color: "var(--color-text-ghost)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="font-serif italic group-hover:text-[var(--color-accent)] transition-colors duration-300"
                    style={{
                      fontSize: "clamp(2rem, 8vw, 3.5rem)",
                      color: "var(--color-text)",
                      lineHeight: 1.1,
                    }}
                  >
                    {link.label}
                  </span>
                </motion.button>
              ))}
            </nav>

            {/* Right: Image preview (hidden on small mobile) */}
            <div className="hidden sm:flex w-[40%] items-center justify-center pl-8">
              <div
                className="relative w-full overflow-hidden"
                style={{
                  aspectRatio: "3 / 4",
                  maxHeight: "60vh",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={hoveredIndex}
                    src={MENU_IMAGES[hoveredIndex]}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{ filter: "grayscale(30%)" }}
                  />
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Footer */}
          <motion.div
            variants={footerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 flex items-center justify-between"
            style={{ padding: "1.5rem var(--page-px)" }}
          >
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-mono hover:text-[var(--color-accent)] transition-colors duration-300"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-secondary)",
              }}
            >
              {CONTACT_EMAIL}
            </a>

            <div className="flex items-center gap-2">
              <span
                className="rounded-full"
                style={{
                  width: 5,
                  height: 5,
                  backgroundColor: "var(--color-accent)",
                  flexShrink: 0,
                }}
              />
              <span
                className="font-mono"
                style={{
                  fontSize: "var(--text-micro)",
                  letterSpacing: "0.1em",
                  color: "var(--color-text-ghost)",
                }}
              >
                available
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
