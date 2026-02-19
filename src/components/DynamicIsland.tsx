"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const NAV_LINKS = [
    { label: "Work", href: "/work" },
    { label: "Lab", href: "/lab" },
    { label: "About", href: "/about" },
];

const SCROLL_THRESHOLD = 100;

/**
 * DynamicIsland
 * ─────────────
 * Fixed bottom-center navigation that morphs between:
 *   • Expanded Pill (idle / top of page)  — w-64 h-14, shows links
 *   • Collapsed Dot (scrolled)            — w-3 h-3
 *   • Re-expands on hover when collapsed
 */
export default function DynamicIsland() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleScroll = useCallback(() => {
        setIsScrolled(window.scrollY > window.innerHeight);
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    const isExpanded = !isScrolled || isHovered;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
            <motion.nav
                layout
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative overflow-hidden bg-ink text-canvas rounded-full flex items-center justify-center cursor-pointer"
                animate={{
                    width: isExpanded ? 256 : 12,
                    height: isExpanded ? 56 : 12,
                    borderRadius: 9999,
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                    mass: 0.8,
                }}
            >
                {/* Links — only visible when expanded */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            className="flex items-center gap-8"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2, delay: 0.05 }}
                        >
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm font-pixel tracking-wider uppercase text-canvas/80 hover:text-canvas transition-colors duration-200"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </div>
    );
}
