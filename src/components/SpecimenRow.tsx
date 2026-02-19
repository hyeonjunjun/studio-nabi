"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import type { Project } from "@/constants/projects";
import { useDesignStore } from "@/store/useDesignStore";
import { useTextScramble } from "@/hooks/useTextScramble";

interface SpecimenRowProps {
    project: Project;
    index: number;
}

/**
 * SpecimenRow — Awwwards-style List Entry
 * ───────────────────────────────────────
 * - Minimal text-only row.
 * - On hover:
 *   1. Row expands in height to reveal editorial tagline.
 *   2. Large cinematic preview follows cursor.
 *   3. Accent color floods the line.
 */
export default function SpecimenRow({ project, index }: SpecimenRowProps) {
    const [isHovered, setIsHovered] = useState(false);
    const setActiveMood = useDesignStore((state) => state.setActiveMood);
    const setIsFocussed = useDesignStore((state) => state.setIsFocussed);

    const { displayText: scrambledTitle, scramble: scrambleTitle } = useTextScramble(project.title);
    const { displayText: scrambledClient, scramble: scrambleClient } = useTextScramble(project.client);

    // Cursor Tracking (Relative to viewport for global follow)
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Ref for the title element to get its position for magnetic effect
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [titleCenter, setTitleCenter] = useState({ x: 0, y: 0 });

    // Spring physics for the image follow
    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
    }, [mouseX, mouseY]);

    useEffect(() => {
        const updateTitlePosition = () => {
            if (titleRef.current) {
                const rect = titleRef.current.getBoundingClientRect();
                setTitleCenter({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                });
            }
        };

        updateTitlePosition(); // Set initial position
        window.addEventListener('resize', updateTitlePosition); // Update on resize
        return () => window.removeEventListener('resize', updateTitlePosition);
    }, []);

    useEffect(() => {
        if (isHovered) {
            scrambleTitle();
            scrambleClient();
        }
    }, [isHovered, scrambleTitle, scrambleClient, project.title, project.client]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
        >
            <Link
                href={`/work/${project.id}`}
                className="group block relative border-b border-ink/[0.06] overflow-visible"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => {
                    setIsHovered(true);
                    setIsFocussed(true);
                }}
                onMouseLeave={() => {
                    setIsHovered(false);
                    setIsFocussed(false);
                }}
            >
                {/* ─── Main Row ─── */}
                <motion.div
                    className="flex items-center justify-between py-6 sm:py-8 transition-colors duration-500"
                    animate={{
                        height: isHovered ? "110px" : "80px",
                        paddingBottom: isHovered ? "40px" : "0px"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <div className="flex items-center gap-12 sm:gap-16">
                        {/* Index */}
                        <motion.span
                            layoutId={`project-index-${project.id}`}
                            className="font-pixel text-[10px] text-ink-faint shrink-0"
                            animate={{
                                letterSpacing: ["0.1em", "0.2em", "0.1em"]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            {project.id}
                        </motion.span>

                        {/* Title — Magnetic Effect */}
                        <motion.h3
                            layoutId={`project-title-${project.id}`}
                            ref={titleRef}
                            className="font-display text-[clamp(1.4rem,3vw,2.4rem)] leading-none tracking-tight text-ink group-hover:text-accent transition-colors duration-500 whitespace-nowrap"
                            animate={{
                                x: isHovered ? (springX.get() - mouseX.get()) * 0.1 : 0,
                                y: isHovered ? (springY.get() - mouseY.get()) * 0.1 : 0,
                            }}
                        >
                            {isHovered ? scrambledTitle : project.title}
                        </motion.h3>
                    </div>

                    {/* Meta Detail (Hidden on mobile) */}
                    <div className="hidden md:flex items-center gap-16 text-right">
                        <div className="flex flex-col items-end">
                            <motion.span
                                className="font-pixel text-[9px] text-ink-faint uppercase tracking-wider mb-1"
                                animate={{ opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                Client
                            </motion.span>
                            <span className="font-pixel text-[10px] text-ink-muted uppercase">
                                {isHovered ? scrambledClient : project.client}
                            </span>
                        </div>
                        <div className="flex flex-col items-end">
                            <motion.span
                                className="font-pixel text-[9px] text-ink-faint uppercase tracking-wider mb-1"
                                animate={{ opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                            >
                                Field
                            </motion.span>
                            <span className="font-pixel text-[10px] text-ink-muted uppercase">{project.sector}</span>
                        </div>
                    </div>
                </motion.div>

                {/* ─── Editorial Reveal (Inside expanded space) ─── */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute left-[70px] sm:left-[96px] bottom-6"
                        >
                            <p className="font-display italic text-sm sm:text-base text-ink-muted/80">
                                &mdash; {project.editorial.headline}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ─── Cinema Reveal Image (Liquid Mask) ─── */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                clipPath: "inset(100% 0% 0% 0%)",
                                scale: 1.1
                            }}
                            animate={{
                                opacity: 1,
                                clipPath: "inset(0% 0% 0% 0%)",
                                scale: 1
                            }}
                            exit={{
                                opacity: 0,
                                clipPath: "inset(0% 0% 100% 0%)",
                                scale: 0.9
                            }}
                            transition={{
                                duration: 0.8,
                                ease: [0.76, 0, 0.24, 1]
                            }}
                            className="fixed top-0 left-0 pointer-events-none z-[100]"
                            style={{
                                x: springX,
                                y: springY,
                                translateX: "40px",
                                translateY: "-50%",
                            }}
                        >
                            <div className="relative w-[320px] h-[420px] rounded-sm overflow-hidden shadow-2xl bg-ink/5">
                                {/* Gradient Fallback if image fails */}
                                <div
                                    className="absolute inset-0 opacity-20"
                                    style={{ background: `linear-gradient(135deg, ${project.mood}, transparent)` }}
                                />
                                {/* Actual Image */}
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                                {/* Scanline overlay */}
                                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-10 bg-[length:100%_2px,3px_100%]" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Hover Line Sweep */}
                <motion.div
                    className="absolute left-0 bottom-0 h-[1px] bg-accent z-10"
                    initial={{ width: 0 }}
                    animate={{ width: isHovered ? "100%" : 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
            </Link>
        </motion.div>
    );
}
