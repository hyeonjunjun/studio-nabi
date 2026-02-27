"use client";

import { motion } from "framer-motion";
import { PROJECTS, Project } from "@/constants/projects";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

function BentoCard({ project, className }: { project: any; className?: string }) {
    if (!project) return null;

    const imageUrl = project.image || '/placeholder.jpg';

    return (
        <Link
            href={`/work/${project.id}`}
            className={`block relative group overflow-hidden bg-ink/[0.02] border border-ink/[0.06] ${className}`}
        >
            {/* Image Background */}
            <div className="absolute inset-0 z-0 bg-black">
                <Image
                    src={imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-[1.2s] ease-[0.16,1,0.3,1] group-hover:scale-[1.03] opacity-80 group-hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>

            {/* Gradient Overlay for Readability */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 opacity-60 group-hover:opacity-80" />

            {/* Content Container */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-8">
                {/* Meta details revealed on hover */}
                <div className="flex gap-2 mb-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[600ms] ease-[0.16,1,0.3,1] delay-100">
                    <span className="px-2.5 py-1 border border-white/20 rounded-full font-pixel text-[8px] tracking-[0.1em] text-white uppercase backdrop-blur-md">
                        {project.year}
                    </span>
                    <span className="px-2.5 py-1 bg-white/10 rounded-full font-pixel text-[8px] tracking-[0.1em] text-white uppercase backdrop-blur-md">
                        {project.sector}
                    </span>
                </div>

                <div className="overflow-hidden">
                    <h3 className="font-display italic text-3xl sm:text-4xl text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-[600ms] ease-[0.16,1,0.3,1]">
                        {project.title}
                    </h3>
                </div>
            </div>

            {/* Subtle Number Indicator */}
            <div className="absolute top-6 right-6 z-20 overflow-hidden">
                <span className="block font-display italic text-lg text-white/50 translate-y-8 group-hover:translate-y-0 transition-transform duration-[600ms] ease-[0.16,1,0.3,1]">
                    {project.id}
                </span>
            </div>
        </Link>
    );
}

export default function BentoGrid() {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [time, setTime] = useState<string>("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false, hour: '2-digit', minute: '2-digit' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    const containerVariants: any = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <section id="work" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 border-t border-ink/[0.06] bg-canvas relative z-10">

            {/* Header */}
            <div className="max-w-[1600px] mx-auto mb-16 px-2 sm:px-0">
                <p className="font-pixel text-[9px] tracking-[0.3em] uppercase text-accent mb-4">
                    Selected Works
                </p>
                <h2 className="font-display italic text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.1] text-ink">
                    Archive & Explorations
                </h2>
            </div>

            {/* Grid Container */}
            <motion.div
                ref={ref}
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 auto-rows-[350px] md:auto-rows-[450px] gap-2 lg:gap-4"
            >
                {/* 1. Large Feature Card (2x2) */}
                <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-2">
                    <BentoCard project={PROJECTS[0]} className="w-full h-full" />
                </motion.div>

                {/* 2. Standard Card (1x1) */}
                <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
                    <BentoCard project={PROJECTS[1]} className="w-full h-full" />
                </motion.div>

                {/* 3. Tall Feature Card (1x2) */}
                <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-2">
                    <BentoCard project={PROJECTS[2]} className="w-full h-full" />
                </motion.div>

                {/* 4. Integrated About / Persona Card (2x1) */}
                <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-1 bg-ink text-canvas p-8 sm:p-12 flex flex-col justify-between group overflow-hidden relative">
                    <div className="relative z-10 max-w-md">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                            </span>
                            <p className="font-pixel text-[8px] tracking-[0.2em] text-accent uppercase">
                                Status: Prototyping
                            </p>
                        </div>
                        <p className="font-display italic text-2xl sm:text-[clamp(1.5rem,2.5vw,2rem)] leading-tight opacity-90">
                            Based in New York City, designing interfaces that feel alive, structural, and inherently human.
                        </p>
                    </div>

                    <div className="relative z-10 flex justify-between items-end mt-12 border-t border-white/10 pt-6">
                        <div className="flex flex-col gap-1">
                            <span className="font-pixel text-[8px] uppercase tracking-[0.2em] text-white/40">Local Time</span>
                            <span className="font-sans text-xs text-white/80">{time || "19:45"} EST</span>
                        </div>
                        <div className="flex flex-col gap-1 text-right">
                            <span className="font-pixel text-[8px] uppercase tracking-[0.2em] text-white/40">Availability</span>
                            <span className="font-sans text-xs text-accent">Select Projects Q3 2026</span>
                        </div>
                    </div>

                    {/* Atmospheric Graphic */}
                    <div className="absolute right-[-10%] bottom-[-20%] opacity-[0.03] text-[280px] font-display italic pointer-events-none group-hover:scale-110 transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] select-none leading-none">
                        Nᵒ
                    </div>
                </motion.div>

                {/* 5. Standard Card (1x1) */}
                {PROJECTS[3] && (
                    <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
                        <BentoCard project={PROJECTS[3]} className="w-full h-full" />
                    </motion.div>
                )}

                {/* 6. Standard Card (1x1) */}
                {PROJECTS[4] && (
                    <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
                        <BentoCard project={PROJECTS[4]} className="w-full h-full" />
                    </motion.div>
                )}

                {/* 7. Wide Feature Card (2x1) */}
                {PROJECTS[5] && (
                    <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-1">
                        <BentoCard project={PROJECTS[5]} className="w-full h-full" />
                    </motion.div>
                )}

                {/* Render remaining projects in 1x1 slots */}
                {PROJECTS.slice(6).map((project) => (
                    <motion.div key={project.id} variants={itemVariants} className="md:col-span-1 md:row-span-1">
                        <BentoCard project={project} className="w-full h-full" />
                    </motion.div>
                ))}

            </motion.div>
        </section>
    );
}
