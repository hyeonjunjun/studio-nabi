"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Project } from "@/constants/projects";
import Link from "next/link";
import { PROJECTS } from "@/constants/projects";

/**
 * ScrollStage
 * ───────────
 * A continuous scroll-locked case study experience.
 * Uses CSS sticky positioning + Framer Motion scroll transforms
 * to reveal 6 stages as the user scrolls through 600vh of content.
 *
 * Inspired by AVATR Vision + Lightweight.
 */

interface ScrollStageProps {
    project: Project;
}

export default function ScrollStage({ project }: ScrollStageProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Stage progress transforms (each stage is ~16.7% of total)
    const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.15], [2, 1]);

    const briefOpacity = useTransform(scrollYProgress, [0.12, 0.18, 0.28, 0.32], [0, 1, 1, 0]);
    const briefY = useTransform(scrollYProgress, [0.12, 0.20], [60, 0]);

    const processOpacity = useTransform(scrollYProgress, [0.28, 0.35, 0.48, 0.52], [0, 1, 1, 0]);
    const processY = useTransform(scrollYProgress, [0.28, 0.38], [40, 0]);

    const systemOpacity = useTransform(scrollYProgress, [0.48, 0.55, 0.68, 0.72], [0, 1, 1, 0]);
    const systemY = useTransform(scrollYProgress, [0.48, 0.58], [40, 0]);

    const paletteOpacity = useTransform(scrollYProgress, [0.68, 0.75, 0.83, 0.87], [0, 1, 1, 0]);

    const closeOpacity = useTransform(scrollYProgress, [0.85, 0.92], [0, 1]);
    const closeY = useTransform(scrollYProgress, [0.85, 0.95], [40, 0]);

    // Background color morph for process stage
    const bgOpacity = useTransform(scrollYProgress, [0.30, 0.45, 0.50], [0, 0.06, 0]);

    // Find next project
    const currentIndex = PROJECTS.findIndex((p) => p.id === project.id);
    const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

    return (
        <div ref={containerRef} className="relative" style={{ height: "600vh" }}>
            {/* Sticky viewport */}
            <div className="sticky top-0 h-screen overflow-hidden">
                {/* Background mood color */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundColor: project.mood,
                        opacity: bgOpacity,
                    }}
                />

                {/* ─── Stage 1: Hero ─── */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ opacity: heroOpacity }}
                >
                    <motion.div
                        className="text-center"
                        style={{ scale: heroScale }}
                    >
                        <motion.p
                            layoutId={`project-index-${project.id}`}
                            className="font-pixel text-[10px] tracking-[0.3em] uppercase text-ink-faint mb-4"
                        >
                            Nᵒ {project.id}
                        </motion.p>
                        <motion.h1
                            layoutId={`project-title-${project.id}`}
                            className="font-display text-[clamp(2rem,6vw,5rem)] leading-[0.95] tracking-[-0.02em] text-ink"
                        >
                            {project.title}
                        </motion.h1>
                        <div className="flex items-center justify-center gap-8 mt-6">
                            <span className="font-pixel text-[10px] tracking-[0.2em] text-ink-muted">
                                {project.client}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-ink-faint" />
                            <span className="font-pixel text-[10px] tracking-[0.2em] text-ink-muted tabular-nums">
                                {project.year}
                            </span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* ─── Stage 2: Brief ─── */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center px-8"
                    style={{ opacity: briefOpacity, y: briefY }}
                >
                    <div className="max-w-2xl text-center">
                        <p className="font-pixel text-[9px] tracking-[0.3em] uppercase text-ink-faint mb-6">
                            {project.editorial.subhead}
                        </p>
                        <h2 className="font-display italic text-[clamp(1.8rem,4vw,3.5rem)] leading-[1.1] text-ink mb-8">
                            &ldquo;{project.editorial.headline}&rdquo;
                        </h2>
                        <p className="font-sans text-[15px] leading-[1.8] text-ink-muted max-w-lg mx-auto">
                            {project.editorial.copy}
                        </p>
                    </div>
                </motion.div>

                {/* ─── Stage 3: Process ─── */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center px-8"
                    style={{ opacity: processOpacity, y: processY }}
                >
                    <div className="max-w-xl text-center">
                        <p className="font-pixel text-[9px] tracking-[0.3em] uppercase text-ink-faint mb-8">
                            Design Decisions
                        </p>
                        <div className="flex flex-col gap-6">
                            <div className="border border-ink/[0.06] rounded-lg p-6">
                                <span className="font-pixel text-[9px] tracking-[0.2em] uppercase text-ink-faint">Grid System</span>
                                <p className="font-sans text-lg text-ink mt-2">{project.schematic.grid}</p>
                            </div>
                            <div className="border border-ink/[0.06] rounded-lg p-6">
                                <span className="font-pixel text-[9px] tracking-[0.2em] uppercase text-ink-faint">Typography</span>
                                <p className="font-sans text-lg text-ink mt-2">{project.schematic.typography}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ─── Stage 4: System / Tech Stack ─── */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center px-8"
                    style={{ opacity: systemOpacity, y: systemY }}
                >
                    <div className="max-w-md">
                        <p className="font-pixel text-[9px] tracking-[0.3em] uppercase text-ink-faint mb-8 text-center">
                            Technical Specification
                        </p>
                        <div className="grid grid-cols-1 gap-3">
                            {project.schematic.stack.map((tech, i) => (
                                <motion.div
                                    key={tech}
                                    className="flex items-center justify-between border-b border-ink/[0.06] pb-3"
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <span className="font-pixel text-[10px] tracking-[0.15em] text-ink-faint">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <span className="font-sans text-[15px] text-ink">
                                        {tech}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* ─── Stage 5: Palette ─── */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center px-8"
                    style={{ opacity: paletteOpacity }}
                >
                    <div className="text-center">
                        <p className="font-pixel text-[9px] tracking-[0.3em] uppercase text-ink-faint mb-10">
                            Color System
                        </p>
                        <div className="flex items-center gap-4 justify-center">
                            {project.schematic.colors.map((color, i) => (
                                <motion.div
                                    key={color}
                                    className="flex flex-col items-center gap-3"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.12, type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    <div
                                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-ink/[0.06] shadow-sm"
                                        style={{ backgroundColor: color }}
                                    />
                                    <span className="font-pixel text-[8px] tracking-[0.2em] text-ink-faint uppercase">
                                        {color}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* ─── Stage 6: Close / Next Specimen ─── */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ opacity: closeOpacity, y: closeY }}
                >
                    <div className="text-center">
                        <p className="font-pixel text-[9px] tracking-[0.3em] uppercase text-ink-faint mb-6">
                            Next Specimen
                        </p>
                        <Link
                            href={`/work/${nextProject.id}`}
                            className="group inline-block"
                        >
                            <h3 className="font-display text-[clamp(1.5rem,4vw,3rem)] leading-[1.05] text-ink group-hover:text-ink-muted transition-colors duration-500">
                                {nextProject.title}
                            </h3>
                            <p className="font-pixel text-[10px] tracking-[0.2em] text-ink-muted mt-3">
                                {nextProject.client} · {nextProject.year}
                            </p>
                        </Link>
                        <div className="mt-10">
                            <Link
                                href="/"
                                className="font-pixel text-[9px] tracking-[0.3em] uppercase text-ink-faint hover:text-ink transition-colors duration-300"
                            >
                                ← Return to Index
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
