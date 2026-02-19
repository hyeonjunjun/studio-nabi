"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PROJECTS } from "@/constants/projects";
import { useTextScramble } from "@/hooks/useTextScramble";
import Link from "next/link";

/**
 * ProjectShowcase
 * ───────────────
 * A high-fidelity horizontal showcase that transforms vertical scroll 
 * into horizontal motion. Includes parallax depth and cinematic reveals.
 */
export default function ProjectShowcase() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Map scroll progress to horizontal translation
    // (Total width = 100% * number of projects)
    const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(PROJECTS.length - 1) * 100}%`]);

    return (
        <section ref={containerRef} className="relative h-[400vh]">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
                <motion.div style={{ x }} className="flex">
                    {PROJECTS.map((project, index) => (
                        <ShowcaseSlide key={project.id} project={project} index={index} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

function ShowcaseSlide({ project, index }: { project: any, index: number }) {
    const { displayText: scrambledTitle, scramble } = useTextScramble(project.title);

    return (
        <div className="w-screen h-screen flex-shrink-0 flex items-center justify-center p-8 sm:p-20 relative overflow-hidden group">
            {/* ─── Background Parallax Image ─── */}
            <motion.div
                className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                initial={{ scale: 1.2 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            >
                <img
                    src={project.image}
                    alt=""
                    className="w-full h-full object-cover grayscale brightness-50"
                />
            </motion.div>

            {/* ─── Specimen Card ─── */}
            <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                {/* 1. Large Visual Specimen */}
                <div className="lg:col-span-12 flex justify-center mb-12">
                    <Link href={`/work/${project.id}`}>
                        <motion.div
                            className="relative w-[300px] sm:w-[500px] aspect-[4/5] bg-ink/5 rounded-sm overflow-hidden shadow-2xl"
                            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                            whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                            viewport={{ once: false, amount: 0.5 }}
                            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                        >
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                            />
                        </motion.div>
                    </Link>
                </div>

                {/* 2. Floating Metadata (Cinematic Disclosure) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col items-center text-center">
                    <motion.div
                        className="mb-6 overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="font-pixel text-[8px] tracking-[0.4em] uppercase text-ink-muted/50">Specimen Nᵒ0{index + 1}</span>
                    </motion.div>

                    <motion.h2
                        className="font-display italic text-[clamp(4.5rem,14vw,11rem)] leading-[0.85] text-ink drop-shadow-xl mix-blend-difference"
                        onMouseEnter={scramble}
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                    >
                        {scrambledTitle}
                    </motion.h2>

                    <motion.div
                        className="mt-8 flex gap-6 font-pixel text-[9px] tracking-[0.25em] uppercase text-ink-muted bg-base/40 backdrop-blur-xl border border-ink/5 px-6 py-3 rounded-full pointer-events-auto cursor-help"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span>{project.sector}</span>
                        <span className="opacity-30">/</span>
                        <span>{project.year}</span>
                    </motion.div>
                </div>
            </div>

            {/* ─── Progress Counter ─── */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-baseline gap-2 font-pixel text-[10px] text-ink-muted">
                <span className="text-accent">{String(index + 1).padStart(2, '0')}</span>
                <span className="opacity-20 text-[8px]">/</span>
                <span>{String(PROJECTS.length).padStart(2, '0')}</span>
            </div>
        </div>
    );
}
