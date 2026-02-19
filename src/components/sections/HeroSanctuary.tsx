"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";

/**
 * HeroSanctuary
 * ─────────────
 * Full-viewport editorial hero with specific layout:
 *
 *   [top-left]      studio nabi
 *   [top-right]     animated dropdown menu / contact
 *   [bottom-left]   designing to change
 *   [center]        Folio Nᵒ01
 *   [right-center]  20 / 26  (split year)
 *   [bottom-right]  37.5°N, 127.0°E
 *
 * Cinematic mesh gradient background.
 */

/* ─── Animated Dropdown Menu ─── */
function DropdownMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { label: "Work", href: "/work" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "mailto:hello@studionabi.com" },
    ];

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <motion.button
                className="font-pixel text-[10px] tracking-[0.2em] uppercase text-ink-muted hover:text-ink transition-colors duration-300 flex items-center gap-2"
                whileHover={{ x: -2 }}
            >
                <span>Menu</span>
                <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="text-[8px]"
                >
                    +
                </motion.span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="absolute top-full right-0 mt-4 flex flex-col items-end gap-3"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {menuItems.map((item, i) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{
                                    duration: 0.3,
                                    delay: i * 0.06,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                            >
                                <Link
                                    href={item.href}
                                    className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted hover:text-ink transition-colors duration-300"
                                >
                                    {item.label}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ─── Physics Letters ─── */
interface LetterState {
    char: string;
    offsetY: number;
    rotation: number;
    targetY: number;
    targetR: number;
    velocityY: number;
    velocityR: number;
}

function usePhysicsLetters(text: string) {
    const lettersRef = useRef<LetterState[]>(
        text.split("").map((char) => ({
            char,
            offsetY: 0,
            rotation: 0,
            targetY: 0,
            targetR: 0,
            velocityY: 0,
            velocityR: 0,
        }))
    );

    const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const animRef = useRef<number>(0);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
    }, []);

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove, { passive: true });

        const SPRING = 0.06;
        const DAMPING = 0.82;
        const INFLUENCE_RADIUS = 180;

        const tick = () => {
            const letters = lettersRef.current;
            const { x: mx, y: my } = mouseRef.current;

            for (let i = 0; i < letters.length; i++) {
                const span = spanRefs.current[i];
                if (!span) continue;

                const rect = span.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;

                const dx = mx - cx;
                const dy = my - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < INFLUENCE_RADIUS) {
                    const strength = (1 - dist / INFLUENCE_RADIUS) * 18;
                    letters[i].targetY = -strength * (dy < 0 ? 1 : -0.5);
                    letters[i].targetR = (dx / INFLUENCE_RADIUS) * 4;
                } else {
                    letters[i].targetY = 0;
                    letters[i].targetR = 0;
                }

                letters[i].velocityY += (letters[i].targetY - letters[i].offsetY) * SPRING;
                letters[i].velocityY *= DAMPING;
                letters[i].offsetY += letters[i].velocityY;

                letters[i].velocityR += (letters[i].targetR - letters[i].rotation) * SPRING;
                letters[i].velocityR *= DAMPING;
                letters[i].rotation += letters[i].velocityR;

                span.style.transform = `translateY(${letters[i].offsetY}px) rotate(${letters[i].rotation}deg)`;
            }

            animRef.current = requestAnimationFrame(tick);
        };

        tick();

        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [handleMouseMove]);

    return { letters: lettersRef.current, spanRefs };
}

/* ─── Hero Section ─── */
export default function HeroSanctuary() {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);

    const { letters: folioLetters, spanRefs: folioRefs } = usePhysicsLetters("Folio");

    return (
        <section
            ref={ref}
            className="relative h-screen overflow-hidden"
        >
            {/* Background is now global via NaturalGradient in layout */}

            {/* ─── Content Layer ─── */}
            <motion.div
                className="absolute inset-0 z-10"
                style={{ opacity: contentOpacity, y: contentY }}
            >
                {/* ══ TOP-LEFT: Studio Nabi ══ */}
                <motion.div
                    className="absolute top-8 left-8 sm:left-12 lg:left-20"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Link href="/" className="font-pixel text-[10px] tracking-[0.2em] uppercase text-ink-muted hover:text-ink transition-colors duration-300">
                        Studio Nabi
                    </Link>
                </motion.div>

                {/* ══ TOP-RIGHT: Animated Dropdown Menu ══ */}
                <motion.div
                    className="absolute top-8 right-8 sm:right-12 lg:right-20"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <DropdownMenu />
                </motion.div>

                {/* ══ CENTER: Folio Nᵒ01 ══ */}
                <div className="absolute inset-0 flex items-center justify-center select-none">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.4, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* "Folio" in display italic — physics-enabled */}
                        <div className="font-display italic text-[clamp(3rem,8vw,7rem)] leading-[0.85] tracking-[-0.02em] text-ink/90">
                            {folioLetters.map((letter, i) => (
                                <span
                                    key={`f-${i}`}
                                    ref={(el) => { folioRefs.current[i] = el; }}
                                    className="inline-block will-change-transform cursor-default"
                                >
                                    {letter.char}
                                </span>
                            ))}
                        </div>

                        {/* "Nᵒ01" — monospace, smaller, tracking wide */}
                        <motion.p
                            className="font-pixel text-[clamp(0.7rem,1.5vw,1.1rem)] tracking-[0.3em] uppercase text-ink-muted mt-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                            Nᵒ01
                        </motion.p>
                    </motion.div>
                </div>

                {/* ══ LEFT-CENTER: "20" ══ */}
                <motion.div
                    className="absolute left-8 sm:left-12 lg:left-20 top-1/2 -translate-y-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6, duration: 0.8 }}
                >
                    <span className="font-pixel text-[10px] tracking-[0.2em] uppercase text-ink-muted">
                        20
                    </span>
                </motion.div>

                {/* ══ RIGHT-CENTER: "26" ══ */}
                <motion.div
                    className="absolute right-8 sm:right-12 lg:right-20 top-1/2 -translate-y-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6, duration: 0.8 }}
                >
                    <span className="font-pixel text-[10px] tracking-[0.2em] uppercase text-ink-muted">
                        26
                    </span>
                </motion.div>

                {/* ══ BOTTOM-LEFT: Thesis "designing to change" ══ */}
                <motion.div
                    className="absolute bottom-8 sm:bottom-12 left-8 sm:left-12 lg:left-20"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <p className="font-display italic text-[clamp(1.4rem,3vw,2.4rem)] leading-[1.2] text-ink/70">
                        designing to change
                    </p>
                </motion.div>

                {/* ══ BOTTOM-RIGHT: Coordinates ══ */}
                <motion.div
                    className="absolute bottom-8 sm:bottom-12 right-8 sm:right-12 lg:right-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.0, duration: 0.6 }}
                >
                    <span className="font-pixel text-[9px] tracking-[0.15em] text-ink-faint tabular-nums">
                        37.5°N, 127.0°E
                    </span>
                </motion.div>

                {/* ─── Scroll Indicator — Bottom Center ─── */}
                <motion.div
                    className="absolute bottom-6 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.4, duration: 0.6 }}
                >
                    <motion.div
                        className="w-[1px] h-10 bg-ink-faint/40 origin-top"
                        animate={{ scaleY: [0, 1, 0] }}
                        transition={{
                            duration: 2.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}
