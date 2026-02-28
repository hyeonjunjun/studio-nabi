"use client";

import { motion } from "framer-motion";
import { PROJECTS } from "@/constants/projects";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";

function ProjectCard({ project, index }: { project: any; index: number }) {
    if (!project) return null;

    const imageUrl = project.image || '/placeholder.jpg';
    const displayId = (index + 1).toString().padStart(2, '0');

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
            className="group break-inside-avoid mb-6 lg:mb-8"
        >
            <Link
                href={`/work/${project.id}`}
                className="block bg-ink/[0.02] hover:bg-ink/[0.04] transition-all duration-500 rounded-sm p-2 group"
            >
                {/* Image Container */}
                <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden bg-ink/[0.05]">
                    {/* ID Badge - Nothing OS Style */}
                    <div className="absolute top-3 left-3 z-10 px-2 py-1 glass rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="font-pixel text-[8px] text-ink/60 tracking-widest uppercase">
                            INDEX.S / {displayId}
                        </span>
                    </div>

                    <Image
                        src={imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-[1.2s] ease-[0.16,1,0.3,1] group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
                        quality={90}
                    />

                    {/* Dot Matrix Overlay on Hover */}
                    <div className="absolute inset-0 dot-matrix opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none" />
                </div>

                {/* Content Container */}
                <div className="px-3 py-5 flex items-start justify-between">
                    <div className="flex flex-col gap-1 pr-6">
                        <h3 className="font-display italic text-2xl text-ink">
                            {project.title}
                        </h3>
                        <p className="font-sans text-sm text-ink-muted leading-snug">
                            {project.pitch || "Exploration & Systems Design"}
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="font-dot text-[10px] text-ink/20 transform rotate-90 origin-right translate-x-1 -translate-y-2 uppercase tracking-tighter">
                            Metadata.sys
                        </span>
                        <div className="flex gap-2">
                            {project.tags?.slice(0, 1).map((tag: string, i: number) => (
                                <span
                                    key={i}
                                    className="px-2 py-0.5 rounded-full border border-ink/[0.08] font-pixel text-[8px] uppercase tracking-[0.2em] text-ink/40 bg-canvas"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default function WorkOverview() {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const leftColVariants: any = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
    };

    return (
        <section id="work" className="py-24 sm:py-32 lg:py-48 px-4 sm:px-6 lg:px-12 bg-canvas relative z-10">
            <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                {/* ─── Left Column: Sticky Manifesto (Cols 1-4) ─── */}
                <motion.div
                    ref={ref}
                    variants={leftColVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    className="lg:col-span-4"
                >
                    <div className="sticky top-32 lg:top-48 flex flex-col gap-12 lg:pr-8">

                        {/* Status Bar - Nothing OS Style */}
                        <div className="flex items-center gap-4">
                            <div className="px-2.5 py-1 glass rounded-full flex items-center gap-2">
                                <motion.div
                                    animate={{ opacity: [1, 0.4, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(139,158,107,0.5)]"
                                />
                                <span className="font-pixel text-[8px] uppercase tracking-[0.2em] text-ink/60">
                                    Status: Active
                                </span>
                            </div>
                            <span className="font-pixel text-[8px] text-ink/20 tracking-tighter">
                                [ NYC // 40.71° N ]
                            </span>
                        </div>

                        {/* Title & Identity */}
                        <div>
                            <h2 className="font-sans text-xl sm:text-2xl font-medium tracking-tight text-ink mb-1 flex items-center gap-2">
                                RYAN JUN <span className="font-display italic text-ink-faint">☻</span>
                            </h2>
                            <p className="font-sans text-sm text-ink-muted">Design Engineer</p>
                        </div>

                        {/* Statement & List */}
                        <div className="space-y-8">
                            <p className="font-sans text-base sm:text-lg text-ink-muted leading-relaxed max-w-sm">
                                I build & scale intentional <span className="text-accent font-medium">interfaces</span>, <span className="text-[#e26d5c] font-medium">workflows</span>, and <span className="text-[#6b8b9e] font-medium">systems</span>.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-ink/40">
                                    <div className="w-1 h-1 bg-ink/20" />
                                    <p className="font-pixel text-[9px] uppercase tracking-[0.15em]">Activity.log</p>
                                </div>
                                <ul className="space-y-3 font-sans text-sm text-ink-muted">
                                    <li className="flex items-start gap-4">
                                        <span className="font-dot text-[10px] text-ink/20 py-1">01</span>
                                        <span>Solving multimedia workflows and <span className="border-b border-ink/20 border-dotted pb-[1px]">digital sketchbooking</span>.</span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <span className="font-dot text-[10px] text-ink/20 py-1">02</span>
                                        <span>Learning content processing w/ <span className="border-b border-ink/20 border-dotted pb-[1px]">ffmpeg</span> & <span className="border-b border-ink/20 border-dotted pb-[1px]">diffing algos</span>.</span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <span className="font-dot text-[10px] text-ink/20 py-1">03</span>
                                        <span>Designing from first-principles.</span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <span className="font-dot text-[10px] text-ink/20 py-1">04</span>
                                        <span>Crafting high-precision spatial tools.</span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <span className="font-dot text-[10px] text-ink/20 py-1">05</span>
                                        <span>Making digital gardens in NYC.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Links */}
                        <div className="pt-8 border-t border-ink/[0.08] flex items-center gap-6">
                            <Link href="#work" className="font-sans text-sm text-ink hover:text-accent transition-colors">Work</Link>
                            <Link href="#about" className="font-sans text-sm text-ink hover:text-accent transition-colors">Writings</Link>
                            <Link href="#contact" className="font-sans text-sm text-ink hover:text-accent transition-colors">About</Link>
                            <a href="https://linkedin.com" target="_blank" className="font-sans text-sm text-ink-muted hover:text-ink transition-colors ml-auto">LI</a>
                            <a href="https://twitter.com" target="_blank" className="font-sans text-sm text-ink-muted hover:text-ink transition-colors">𝕏</a>
                            <a href="mailto:hello@example.com" className="font-sans text-sm text-ink-muted hover:text-ink transition-colors">E</a>
                        </div>

                    </div>
                </motion.div>

                {/* ─── Right Columns: Masonry Grid (Cols 5-12) ─── */}
                <div className="lg:col-span-8">
                    {/* CSS Multi-column layout for authentic masonry look */}
                    <div className="columns-1 md:columns-2 gap-6 lg:gap-8">
                        {PROJECTS.map((project, idx) => (
                            <ProjectCard key={project.id} project={project} index={idx} />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
