"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { PROJECTS } from "@/constants/projects";
import Link from "next/link";
import Image from "next/image";

/**
 * WorkIndex
 * ─────────
 * Editorial project list with cursor-following image reveals on hover.
 * Inspired by hugoferradas.com — title rows with a floating preview image
 * that tracks the cursor, creating spatial depth.
 */

function WorkRow({ project, index, onHover, onLeave }: {
    project: (typeof PROJECTS)[0];
    index: number;
    onHover: (img: string) => void;
    onLeave: () => void;
}) {
    return (
        <motion.div
            className="border-b border-ink/[0.08] last:border-b-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
            }}
        >
            <Link
                href={`/work/${project.id}`}
                className="group block"
                onMouseEnter={() => onHover(project.image)}
                onMouseLeave={onLeave}
            >
                <div className="flex items-center justify-between py-6 sm:py-10 px-1">
                    <div className="flex items-center gap-4 sm:gap-6 w-full">
                        {/* Mobile Thumbnail (Hidden on Desktop) */}
                        <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-sm overflow-hidden shrink-0 lg:hidden bg-ink/5">
                            <Image
                                src={project.image}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </div>

                        {/* Title + Pitch */}
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6 min-w-0">
                            <h3 className="font-display italic text-[clamp(1.2rem,5vw,2.5rem)] tracking-[-0.02em] text-ink group-hover:text-accent transition-colors duration-500 truncate">
                                {project.title}
                            </h3>
                            <span className="font-sans text-sm text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-w-md hidden sm:inline truncate">
                                {project.pitch}
                            </span>
                        </div>
                    </div>

                    {/* Right: Meta */}
                    <div className="flex items-center gap-3 sm:gap-6 shrink-0 ml-4">
                        <span className="font-pixel text-[9px] tracking-[0.2em] uppercase text-ink-faint hidden sm:inline">
                            {project.sector}
                        </span>
                        <span className="font-pixel text-[10px] tracking-[0.15em] text-ink-faint tabular-nums">
                            {project.year}
                        </span>
                        <motion.span
                            className="font-display italic text-lg text-ink-faint group-hover:text-ink transition-colors duration-300"
                            whileHover={{ x: 4 }}
                        >
                            →
                        </motion.span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default function WorkIndex() {
    const [headerRef, headerInView] = useInView({
        triggerOnce: true,
        threshold: 0.3,
    });

    const [hoveredImage, setHoveredImage] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Cursor-following image position
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const imgX = useSpring(mouseX, { damping: 25, stiffness: 200, mass: 0.5 });
    const imgY = useSpring(mouseY, { damping: 25, stiffness: 200, mass: 0.5 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            mouseX.set(e.clientX - rect.left);
            mouseY.set(e.clientY - rect.top);
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("mousemove", handleMouseMove, { passive: true });
        }
        return () => {
            if (container) {
                container.removeEventListener("mousemove", handleMouseMove);
            }
        };
    }, [mouseX, mouseY]);

    return (
        <section id="work" className="py-24 sm:py-32 lg:py-40">
            <div className="px-6 sm:px-12 lg:px-20">
                {/* Section Header */}
                <motion.div
                    ref={headerRef}
                    className="mb-12 sm:mb-16"
                    initial={{ opacity: 0, y: 16 }}
                    animate={headerInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="flex items-baseline justify-between border-b border-ink/[0.08] pb-4">
                        <h2 className="font-display italic text-[clamp(1.8rem,4vw,3rem)] tracking-[-0.02em] text-ink">
                            Selected Work
                        </h2>
                        <span className="font-pixel text-[10px] tracking-[0.2em] uppercase text-ink-faint">
                            {PROJECTS.length} Projects
                        </span>
                    </div>
                </motion.div>

                {/* Project List with floating image */}
                <div ref={containerRef} className="relative">
                    {PROJECTS.map((project, index) => (
                        <WorkRow
                            key={project.id}
                            project={project}
                            index={index}
                            onHover={(img) => setHoveredImage(img)}
                            onLeave={() => setHoveredImage(null)}
                        />
                    ))}

                    {/* Floating cursor-following image */}
                    <motion.div
                        className="absolute top-0 left-0 pointer-events-none z-30 hidden lg:block"
                        style={{
                            x: imgX,
                            y: imgY,
                            translateX: "-50%",
                            translateY: "-60%",
                        }}
                        animate={{
                            opacity: hoveredImage ? 1 : 0,
                            scale: hoveredImage ? 1 : 0.85,
                        }}
                        transition={{
                            opacity: { duration: 0.25 },
                            scale: { type: "spring", stiffness: 300, damping: 25 },
                        }}
                    >
                        <div className="w-[280px] h-[180px] rounded-lg overflow-hidden shadow-2xl shadow-ink/10 ring-1 ring-ink/[0.04]">
                            {hoveredImage && (
                                <Image
                                    src={hoveredImage}
                                    alt=""
                                    fill
                                    className="object-cover"
                                    sizes="280px"
                                />
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
