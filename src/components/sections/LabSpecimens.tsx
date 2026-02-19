"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { PROJECTS } from "@/constants/projects";
import SpecimenCard from "@/components/SpecimenCard";

/**
 * LabSpecimens
 * ────────────
 * Asymmetric 2-column project grid. First project spans full width,
 * remaining alternate between columns for visual rhythm.
 */
export default function LabSpecimens() {
    const [headerRef, headerInView] = useInView({
        triggerOnce: true,
        threshold: 0.3,
    });

    return (
        <section className="px-6 sm:px-12 lg:px-20 py-32 sm:py-48">
            {/* ─── Korean Cultural Label ─── */}
            <div className="font-dot text-[10px] text-accent/60 mb-4">﹁작품﹂</div>

            {/* ─── Section Header ─── */}
            <motion.div
                ref={headerRef}
                className="flex items-baseline justify-between mb-16 border-b border-ink/[0.06] pb-4"
                initial={{ opacity: 0, y: 12 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
                <h2 className="font-pixel text-[11px] tracking-[0.2em] uppercase text-ink-muted">
                    Selected Specimens
                </h2>
                <span className="font-pixel text-[10px] text-ink-faint tabular-nums">
                    {String(PROJECTS.length).padStart(2, "0")} entries
                </span>
            </motion.div>

            {/* ─── Specimen Grid ─── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">
                {PROJECTS.map((project, index) => (
                    <div
                        key={project.id}
                        className={index === 0 ? "md:col-span-2" : ""}
                    >
                        <SpecimenCard project={project} index={index} />
                    </div>
                ))}
            </div>
        </section>
    );
}
