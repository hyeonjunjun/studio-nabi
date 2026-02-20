"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import TextScramble from "@/components/TextScramble";
import RollingLink from "@/components/RollingLink";


/**
 * HeroSanctuary
 * ─────────────
 * Fullscreen spatial hero with two tactile layers:
 *   1. Cursor-reactive radial gradient "light spot"
 *   2. Parallax depth on the stacked headline
 *
 *   [top-left]      studio nabi
 *   [top-right]     01 Works / 02 About / 03 Contact
 *   [center]        Ryan Jun / Design / Engineer —
 *   [bottom-left]   Brief descriptor
 *   [bottom-right]  NYC, NY  2026
 */

const NAV_ITEMS = [
    { num: "01", label: "Works", href: "#work" },
    { num: "02", label: "About", href: "#about" },
    { num: "03", label: "Contact", href: "#contact" },
];

/* ─── Stagger animation variants ─── */
const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.12, delayChildren: 0.6 },
    },
};

const lineReveal = {
    hidden: { y: "110%", opacity: 0 },
    visible: {
        y: "0%",
        opacity: 1,
        transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
    },
};

/* ─── Parallax multipliers per headline line (deeper = more movement) ─── */
const PARALLAX = [0.015, 0.025, 0.035];

export default function HeroSanctuary() {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const contentY = useTransform(scrollYProgress, [0, 0.6], [0, -100]);

    /* ─── Cursor tracking for light spot ─── */
    const rawX = useMotionValue(0.5);
    const rawY = useMotionValue(0.5);
    const spotX = useSpring(rawX, { damping: 40, stiffness: 120, mass: 0.8 });
    const spotY = useSpring(rawY, { damping: 40, stiffness: 120, mass: 0.8 });

    /* ─── Parallax offset per line ─── */
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const section = ref.current;
        if (!section) return;

        const handleMove = (e: MouseEvent) => {
            const rect = section.getBoundingClientRect();
            const nx = (e.clientX - rect.left) / rect.width;
            const ny = (e.clientY - rect.top) / rect.height;
            rawX.set(nx);
            rawY.set(ny);
            // Center-relative offset (-0.5 to 0.5)
            setMouseOffset({ x: nx - 0.5, y: ny - 0.5 });
        };

        section.addEventListener("mousemove", handleMove, { passive: true });
        return () => section.removeEventListener("mousemove", handleMove);
    }, [rawX, rawY]);

    return (
        <section
            id="hero"
            ref={ref}
            className="relative h-screen overflow-hidden bg-canvas"
        >
            {/* ─── Cinematic Atmosphere (Video) ─── */}
            <motion.div
                className="absolute inset-0 z-0 select-none pointer-events-none"
                style={{
                    scale: 1.05, // Prevent edge bleeding
                    x: useTransform(spotX, [0, 1], [-20, 20]),
                    y: useTransform(spotY, [0, 1], [-20, 20]),
                }}
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-50 mix-blend-multiply contrast-110"
                    style={{ filter: "grayscale(10%) contrast(1.1)" }}
                    ref={(el) => {
                        if (el) el.playbackRate = 0.75;
                    }}
                >
                    <source src="/assets/Add_soft_gentle_1080p_202602191457.mp4" type="video/mp4" />
                </video>
                {/* Vignette mask to soften edges */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-canvas)_120%)]" />
            </motion.div>

            {/* ─── Subtle Grid Substrate ─── */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.025] z-0"
                style={{
                    backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
                    backgroundSize: '120px 120px'
                }}
            />

            {/* ─── Cursor Light Spot ─── */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-[1]"
                style={{
                    background: useTransform(
                        [spotX, spotY],
                        ([x, y]: number[]) =>
                            `radial-gradient(600px circle at ${(x as number) * 100}% ${(y as number) * 100}%, rgba(139,158,107,0.07) 0%, rgba(139,158,107,0.02) 40%, transparent 70%)`
                    ),
                }}
            />

            {/* ─── Content Layer ─── */}
            <motion.div
                className="absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-10 lg:p-16"
                style={{ opacity: contentOpacity, y: contentY }}
            >
                {/* ══ TOP BAR ══ */}
                <div className="flex justify-between items-start">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <RollingLink
                            href="#hero"
                            label="Studio Nabi"
                        />
                    </motion.div>

                    {/* Numbered Navigation */}
                    <motion.nav
                        className="flex flex-col items-end gap-3"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.5 } },
                        }}
                    >
                        {NAV_ITEMS.map((item) => (
                            <motion.div
                                key={item.num}
                                variants={{
                                    hidden: { opacity: 0, x: 20 },
                                    visible: {
                                        opacity: 1,
                                        x: 0,
                                        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                                    },
                                }}
                                className="flex items-center gap-3 py-1"
                            >
                                <span className="font-pixel text-[10px] tracking-[0.2em] text-ink-faint">
                                    {item.num}
                                </span>
                                <RollingLink
                                    href={item.href}
                                    label={item.label}
                                />
                            </motion.div>
                        ))}
                    </motion.nav>
                </div>

                {/* ══ CENTER: Massive Stacked Headline with Parallax ══ */}
                <motion.div
                    className="flex-1 flex items-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <h1 className="w-full max-w-[90vw] lg:max-w-[80vw]">
                        {/* Line 1: Ryan Jun — shallowest parallax */}
                        <div className="overflow-hidden pb-4">
                            <motion.span
                                className="block font-display italic text-[clamp(2.5rem,6vw,6rem)] leading-[1.1] tracking-[-0.02em] text-ink will-change-transform"
                                variants={lineReveal}
                                style={{
                                    transform: `translate(${mouseOffset.x * PARALLAX[0] * 100}px, ${mouseOffset.y * PARALLAX[0] * 100}px)`,
                                    transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                                }}
                            >
                                <TextScramble>Ryan Jun</TextScramble>
                            </motion.span>
                        </div>

                        {/* Line 2: Design — medium parallax */}
                        <div className="overflow-hidden mt-1 pb-4">
                            <motion.span
                                className="block font-display italic text-[clamp(2.5rem,6vw,6rem)] leading-[1.1] tracking-[-0.02em] text-ink will-change-transform"
                                variants={lineReveal}
                                style={{
                                    transform: `translate(${mouseOffset.x * PARALLAX[1] * 100}px, ${mouseOffset.y * PARALLAX[1] * 100}px)`,
                                    transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                                }}
                            >
                                <TextScramble>Design</TextScramble>
                            </motion.span>
                        </div>

                        {/* Line 3: Engineer — deepest parallax */}
                        <div className="overflow-hidden mt-1 pb-4 flex items-baseline gap-4">
                            <motion.span
                                className="block font-display italic text-[clamp(2.5rem,6vw,6rem)] leading-[1.1] tracking-[-0.02em] text-ink will-change-transform"
                                variants={lineReveal}
                                style={{
                                    transform: `translate(${mouseOffset.x * PARALLAX[2] * 100}px, ${mouseOffset.y * PARALLAX[2] * 100}px)`,
                                    transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                                }}
                            >
                                <TextScramble>Engineer</TextScramble>
                            </motion.span>
                            <motion.span
                                className="font-display italic text-[clamp(2rem,4vw,4rem)] text-ink-faint will-change-transform"
                                variants={lineReveal}
                                style={{
                                    transform: `translate(${mouseOffset.x * PARALLAX[2] * 100}px, ${mouseOffset.y * PARALLAX[2] * 100}px)`,
                                    transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                                }}
                            >
                                —
                            </motion.span>
                        </div>
                    </h1>
                </motion.div>

                {/* ══ BOTTOM BAR ══ */}
                <div className="flex justify-between items-end">
                    {/* Descriptor */}
                    <motion.div
                        className="max-w-[50vw] lg:max-w-xs"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <p className="font-pixel text-[9px] sm:text-[10px] tracking-[0.15em] uppercase text-ink-muted leading-relaxed">
                            Building digital experiences at the
                            <br />
                            intersection of craft and code.
                        </p>
                    </motion.div>

                    {/* Location + Year */}
                    <motion.div
                        className="text-right"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.0, duration: 0.8 }}
                    >
                        <p className="font-pixel text-[8px] tracking-[0.3em] uppercase text-ink-faint mb-1">
                            Station
                        </p>
                        <span className="font-mono text-[10px] tracking-[0.1em] text-ink-muted tabular-nums">
                            NYC, NY · 2026
                        </span>
                    </motion.div>
                </div>

                {/* ─── Scroll Indicator ─── */}
                <motion.div
                    className="absolute bottom-6 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.4, duration: 0.6 }}
                >
                    <motion.div
                        className="w-[1px] h-8 bg-ink-faint/40 origin-top"
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
