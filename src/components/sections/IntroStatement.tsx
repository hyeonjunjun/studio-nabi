"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import Image from "next/image";

/**
 * IntroStatement — "The Manifesto" (v2)
 * ────────────────────────────────────
 * Character-level staggered opacity reveals for maximum precision.
 * Anchored to a rigid 12-column architectural grid.
 * Zero movement on text to eliminate blur.
 */

const LINES = [
    { text: "Studio Nabi — Ryan Jun.", highlight: true },
    { text: "Crafting digital nature", highlight: false },
    { text: "at the intersection of", highlight: false },
    { text: "taste, technical stories,", highlight: false },
    { text: "and precise craftsmanship.", highlight: true },
];

export default function IntroStatement() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Subdued butterfly parallax in background
    const butterflyX = useTransform(smoothProgress, [0, 1], ["2%", "8%"]);
    const butterflyOpacity = useTransform(smoothProgress, [0.2, 0.4, 0.7, 0.9], [0, 0.12, 0.12, 0]);
    // Curtain reveal — clipPath driven by section entering viewport
    const clipProgress = useTransform(scrollYProgress, [0, 0.15], [100, 0]);
    const clipPath = useTransform(clipProgress, (v) => `inset(${v}% 0 0 0)`);

    return (
        <motion.section
            id="about"
            ref={containerRef}
            className="relative py-32 sm:py-48 lg:py-64 px-6 sm:px-12 lg:px-20 overflow-hidden bg-canvas"
            style={{ clipPath }}
        >
            {/* ─── Background Layer: Continuity Line ─── */}
            <div className="absolute left-6 sm:left-12 lg:left-20 top-0 bottom-0 w-px bg-ink/[0.06] z-0" />

            {/* ─── Background Layer: Subtle Parallax Image ─── */}
            <motion.div
                className="absolute top-1/4 right-0 w-[500px] h-[500px] lg:w-[900px] lg:h-[900px] pointer-events-none select-none z-0"
                style={{
                    x: butterflyX,
                    opacity: butterflyOpacity,
                }}
            >
                <div className="relative w-full h-full mix-blend-multiply transition-opacity duration-1000 grayscale opacity-40">
                    <Image
                        src="/images/ethereal_butterfly.jpeg"
                        alt=""
                        fill
                        className="object-contain"
                        sizes="900px"
                    />
                </div>
            </motion.div>

            {/* ─── 12-Column Grid Layout ─── */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-20">

                {/* Left Column (cols 1-4): Metadata & Anchors */}
                <div className="lg:col-span-4 flex flex-col gap-12 lg:pl-8">
                    <div>
                        <div className="font-dot text-[10px] text-accent mb-4">﹂소개﹂</div>
                        <h2 className="font-pixel text-[9px] tracking-[0.3em] uppercase text-ink-faint">
                            01 / Manifesto
                        </h2>
                    </div>

                    <div className="hidden lg:block space-y-8">
                        <div className="h-[240px] w-px bg-ink/[0.06] ml-1" />
                        <div className="flex flex-col gap-4">
                            <span className="font-pixel text-[8px] text-ink-faint tracking-widest uppercase flex items-center gap-3">
                                <span className="w-1 h-1 rounded-full bg-accent" />
                                Narrative Craft
                            </span>
                            <span className="font-pixel text-[8px] text-ink-faint tracking-widest uppercase flex items-center gap-3">
                                <span className="w-1 h-1 rounded-full bg-ink/[0.2]" />
                                Spatial Design
                            </span>
                            <span className="font-pixel text-[8px] text-ink-faint tracking-widest uppercase flex items-center gap-3">
                                <span className="w-1 h-1 rounded-full bg-ink/[0.2]" />
                                Systems Engineering
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Column (cols 5-12): The Statement */}
                <div className="lg:col-span-8">
                    <div className="flex flex-col gap-2">
                        {LINES.map((line, i) => (
                            <ParagraphReveal
                                key={i}
                                text={line.text}
                                highlight={line.highlight}
                                index={i}
                                scroll={scrollYProgress}
                            />
                        ))}
                    </div>

                    {/* Narrative Bridge to Work */}
                    <motion.div
                        className="mt-24 sm:mt-32 flex flex-col gap-6"
                        style={{
                            opacity: useTransform(scrollYProgress, [0.8, 0.95], [0, 1]),
                        }}
                    >
                        <div className="h-px w-full bg-ink/[0.08]" />
                        <div className="flex justify-between items-center px-1">
                            <p className="font-pixel text-[9px] tracking-[0.25em] text-ink-muted uppercase">
                                <span className="text-accent mr-3">◧</span>
                                Exploring Sequence 02 — Work Index
                            </p>
                            <span className="font-pixel text-[9px] text-ink-faint tracking-widest">
                                (EST. 2026)
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}

/**
 * ParagraphReveal — Character-level staggered opacity reveal.
 * Eliminates all blur and jitter by avoiding motion in the primary reveal path.
 */
function ParagraphReveal({ text, highlight, index, scroll }: {
    text: string;
    highlight: boolean;
    index: number;
    scroll: MotionValue<number>;
}) {
    // Each line has a specific scroll range where it "activates"
    const start = 0.2 + (index * 0.08);
    const end = start + 0.2;

    // Split text into words and then characters to maintain layout stability
    const words = text.split(" ");

    return (
        <p className={`font-display italic text-[clamp(1.6rem,3.5vw,3rem)] leading-[1.1] tracking-[-0.02em] ${highlight ? "text-ink" : "text-ink-muted"
            }`}>
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block mr-[0.25em] last:mr-0">
                    {word.split("").map((char, charIndex) => {
                        // Total index for the stagger (across the whole line)
                        const charPos = text.indexOf(word) + charIndex;
                        const charRevealStart = start + (charPos * 0.002);

                        return (
                            <motion.span
                                key={charIndex}
                                style={{
                                    opacity: useTransform(
                                        scroll,
                                        [charRevealStart, charRevealStart + 0.05, end, end + 0.05],
                                        [0, 1, 1, 0.6]
                                    ),
                                }}
                            >
                                {char}
                            </motion.span>
                        );
                    })}
                </span>
            ))}
        </p>
    );
}
