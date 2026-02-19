"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import type { Project } from "@/constants/projects";

interface SpecimenCardProps {
    project: Project;
    index: number;
}

/**
 * SpecimenCard
 * ────────────
 * Biological specimen entry with cursor-following image preview on hover.
 * Hover reveals editorial headline + floating preview with glass distortion.
 */
export default function SpecimenCard({ project, index }: SpecimenCardProps) {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });
    const [isHovered, setIsHovered] = useState(false);
    const cursorPos = useRef({ x: 0, y: 0 });
    const previewRef = useRef<HTMLDivElement>(null);
    const animRef = useRef<number>(0);
    const smoothPos = useRef({ x: 0, y: 0 });

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        cursorPos.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }, []);

    const startTracking = useCallback(() => {
        setIsHovered(true);

        const track = () => {
            smoothPos.current.x += (cursorPos.current.x - smoothPos.current.x) * 0.12;
            smoothPos.current.y += (cursorPos.current.y - smoothPos.current.y) * 0.12;

            if (previewRef.current) {
                previewRef.current.style.transform = `translate(${smoothPos.current.x + 20}px, ${smoothPos.current.y - 60}px)`;
            }
            animRef.current = requestAnimationFrame(track);
        };
        track();
    }, []);

    const stopTracking = useCallback(() => {
        setIsHovered(false);
        cancelAnimationFrame(animRef.current);
    }, []);

    // Accent color from project mood
    const accentColor = project.mood;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: index * 0.08,
            }}
        >
            <Link href={`/work/${project.id}`} className="group block">
                <div
                    className="relative py-8 sm:py-10 border-b border-ink/[0.06]"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={startTracking}
                    onMouseLeave={stopTracking}
                >
                    {/* Clipped inner — contains the sweep bg */}
                    <div className="relative overflow-hidden">
                        {/* ─── Top Row: Index + Sector ─── */}
                        <div className="flex items-center justify-between mb-4">
                            <motion.span layoutId={`project-index-${project.id}`} className="font-pixel text-[10px] tracking-[0.15em] text-ink-faint">
                                Nᵒ {project.id}
                            </motion.span>
                            <span className="font-pixel text-[9px] tracking-[0.15em] uppercase text-ink-faint border border-ink/[0.08] rounded-none px-3 py-1">
                                {project.sector}
                            </span>
                        </div>

                        {/* ─── Title — transitions to accent color on hover ─── */}
                        <motion.h3
                            layoutId={`project-title-${project.id}`}
                            className="font-display text-[clamp(1.6rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em] transition-colors duration-700 ease-out"
                            style={{ color: isHovered ? accentColor : undefined }}
                        >
                            {project.title}
                        </motion.h3>

                        {/* ─── Meta Row ─── */}
                        <div className="flex items-baseline justify-between mt-4">
                            <span className="font-pixel text-[10px] text-ink-muted">
                                {project.client}
                            </span>
                            <span className="font-pixel text-[10px] text-ink-faint tabular-nums">
                                {project.year}
                            </span>
                        </div>

                        {/* ─── Field Note (hover reveal) ─── */}
                        <div className="overflow-hidden h-0 group-hover:h-8 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                            <p className="font-display italic text-sm text-ink-muted pt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                &ldquo;{project.editorial.headline}&rdquo;
                            </p>
                        </div>

                        {/* ─── Hover Background Sweep (inside clipped container) ─── */}
                        <div
                            className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none"
                            style={{ backgroundColor: `${accentColor}08` }}
                        />
                    </div>

                    {/* ─── Cursor-Following Preview (outside clip to float freely) ─── */}
                    <div
                        ref={previewRef}
                        className="absolute top-0 left-0 pointer-events-none z-30"
                        style={{
                            opacity: isHovered ? 1 : 0,
                            transition: "opacity 0.3s ease",
                        }}
                    >
                        <div className="relative w-48 h-32 rounded-lg overflow-hidden shadow-2xl">
                            <div
                                className="absolute inset-0 z-10"
                                style={{
                                    background: `linear-gradient(135deg, ${accentColor}30 0%, transparent 50%, ${accentColor}15 100%)`,
                                    backdropFilter: "blur(0.5px) saturate(1.4)",
                                }}
                            />
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: `linear-gradient(145deg, ${accentColor}20, ${accentColor}40, ${accentColor}15)`,
                                }}
                            />
                            <div className="absolute bottom-2 left-3 z-20">
                                <span className="font-pixel text-[8px] tracking-[0.2em] uppercase text-white/70">
                                    Specimen {project.id}
                                </span>
                            </div>
                            <div
                                className="absolute top-0 right-0 w-12 h-full z-10"
                                style={{
                                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15))",
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
