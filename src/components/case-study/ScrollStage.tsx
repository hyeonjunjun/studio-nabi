"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { Project } from "@/constants/projects";
import { PROJECTS } from "@/constants/projects";
import Link from "next/link";
import Image from "next/image";

/**
 * ScrollStage — Image-First Case Study
 * ─────────────────────────────────────
 * Clean scrollable layout inspired by baothiento.com / hugoferradas.com:
 *   1. Back link + project number
 *   2. Hero: large title + one-line pitch
 *   3. Metadata strip: Client / Year / Sector / Stack
 *   4. Image stream (full-width, scroll-reveal)
 *   5. Technical details section
 *   6. Next project link
 */

interface ScrollStageProps {
    project: Project;
}

/* ─── Animation Variants ─── */
const reveal = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
    }),
};

function MetaItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="font-pixel text-[9px] tracking-[0.25em] uppercase text-accent">
                {label}
            </span>
            <span className="font-sans text-sm text-ink">
                {value}
            </span>
        </div>
    );
}

function ImageBlock({ src, index }: { src: string; index: number }) {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

    return (
        <motion.div
            ref={ref}
            className="relative w-full aspect-[16/10] overflow-hidden rounded-sm"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
                duration: 0.8,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
            }}
        >
            <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 85vw"
                priority={index === 0}
            />
        </motion.div>
    );
}

export default function ScrollStage({ project }: ScrollStageProps) {
    const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.2 });
    const [metaRef, metaInView] = useInView({ triggerOnce: true, threshold: 0.3 });
    const [techRef, techInView] = useInView({ triggerOnce: true, threshold: 0.3 });

    // Find next project
    const currentIndex = PROJECTS.findIndex((p) => p.id === project.id);
    const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

    // Combine all images
    const allImages = [
        project.image,
        ...project.editorial.images.filter((img) => img !== project.image),
    ];

    return (
        <div className="min-h-screen bg-canvas">
            {/* ─── Top Bar ─── */}
            <motion.div
                className="flex items-center justify-between px-6 sm:px-12 lg:px-20 pt-8 pb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <Link
                    href="/"
                    className="font-pixel text-[10px] tracking-[0.2em] uppercase text-ink-faint hover:text-ink transition-colors duration-300 py-3 -my-2 pr-4"
                >
                    ← Index
                </Link>
                <span className="font-pixel text-[10px] tracking-[0.3em] uppercase text-ink-faint">
                    Nᵒ {project.id}
                </span>
            </motion.div>

            {/* ─── Hero: Title + Pitch ─── */}
            <div
                ref={heroRef}
                className="px-6 sm:px-12 lg:px-20 pt-16 sm:pt-24 pb-16 sm:pb-20"
            >
                <div className="max-w-4xl">
                    <motion.p
                        className="font-pixel text-[9px] tracking-[0.3em] uppercase text-ink-faint mb-4"
                        custom={0}
                        initial="hidden"
                        animate={heroInView ? "visible" : "hidden"}
                        variants={reveal}
                    >
                        ({project.client})
                    </motion.p>

                    <div className="overflow-hidden">
                        <motion.h1
                            className="font-display italic text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] tracking-[-0.02em] text-ink"
                            custom={0.1}
                            initial="hidden"
                            animate={heroInView ? "visible" : "hidden"}
                            variants={reveal}
                        >
                            {project.editorial.headline}
                        </motion.h1>
                    </div>

                    <motion.p
                        className="font-display italic text-[clamp(1.2rem,2.5vw,2rem)] text-ink-muted mt-2 leading-[1.3]"
                        custom={0.2}
                        initial="hidden"
                        animate={heroInView ? "visible" : "hidden"}
                        variants={reveal}
                    >
                        {project.pitch}
                    </motion.p>
                </div>
            </div>

            {/* ─── Metadata Strip ─── */}
            <motion.div
                ref={metaRef}
                className="px-6 sm:px-12 lg:px-20 py-8 border-y border-ink/[0.06]"
                initial={{ opacity: 0, y: 16 }}
                animate={metaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                    <MetaItem label="Client" value={project.client} />
                    <MetaItem label="Year" value={project.year} />
                    <MetaItem label="Type" value={project.sector} />
                    <MetaItem
                        label="Stack"
                        value={project.schematic.stack.slice(0, 3).join(", ")}
                    />
                </div>
            </motion.div>

            {/* ─── Description ─── */}
            <div className="px-6 sm:px-12 lg:px-20 py-16 sm:py-20">
                <motion.div
                    className="max-w-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                    <p className="font-pixel text-[9px] tracking-[0.25em] uppercase text-ink-faint mb-6">
                        Overview
                    </p>
                    <p className="font-sans text-[15px] leading-[1.8] text-ink-muted">
                        {project.editorial.copy}
                    </p>
                </motion.div>
            </div>

            {/* ─── Image Stream ─── */}
            <div className="px-6 sm:px-12 lg:px-20 space-y-4 sm:space-y-6">
                {allImages.map((src, i) => (
                    <ImageBlock key={`${src}-${i}`} src={src} index={i} />
                ))}
            </div>

            {/* ─── Technical Details ─── */}
            <motion.div
                ref={techRef}
                className="px-6 sm:px-12 lg:px-20 py-20 sm:py-28"
                initial={{ opacity: 0 }}
                animate={techInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6 }}
            >
                <p className="font-pixel text-[9px] tracking-[0.25em] uppercase text-ink-faint mb-10">
                    Details
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8 border-t border-ink/[0.06] pt-10">
                    {/* Stack */}
                    <div>
                        <span className="font-pixel text-[9px] tracking-[0.25em] uppercase text-accent mb-4 block">
                            Stack
                        </span>
                        <div className="flex flex-col gap-2">
                            {project.schematic.stack.map((tech) => (
                                <span key={tech} className="font-sans text-sm text-ink">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* System */}
                    <div>
                        <span className="font-pixel text-[9px] tracking-[0.25em] uppercase text-accent mb-4 block">
                            System
                        </span>
                        <div className="flex flex-col gap-2">
                            <span className="font-sans text-sm text-ink">{project.schematic.grid}</span>
                            <span className="font-sans text-sm text-ink">{project.schematic.typography}</span>
                        </div>
                    </div>

                    {/* Colors */}
                    <div>
                        <span className="font-pixel text-[9px] tracking-[0.25em] uppercase text-accent mb-4 block">
                            Palette
                        </span>
                        <div className="flex items-center gap-3">
                            {project.schematic.colors.map((color) => (
                                <div key={color} className="flex items-center gap-2">
                                    <div
                                        className="w-5 h-5 rounded-full border border-ink/[0.08]"
                                        style={{ backgroundColor: color }}
                                    />
                                    <span className="font-pixel text-[8px] tracking-[0.15em] text-ink-faint uppercase">
                                        {color}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ─── Next Project ─── */}
            <div className="border-t border-ink/[0.06]">
                <Link
                    href={`/work/${nextProject.id}`}
                    className="group block px-6 sm:px-12 lg:px-20 py-16 sm:py-24"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <p className="font-pixel text-[9px] tracking-[0.3em] uppercase text-ink-faint mb-4">
                            Next Project
                        </p>
                        <h3 className="font-display italic text-[clamp(2rem,5vw,4rem)] leading-[1.05] text-ink group-hover:text-accent transition-colors duration-500">
                            {nextProject.title}
                        </h3>
                        <p className="font-sans text-sm text-ink-muted mt-2 group-hover:text-ink transition-colors duration-500">
                            {nextProject.pitch}
                        </p>
                    </motion.div>
                </Link>
            </div>
        </div>
    );
}
