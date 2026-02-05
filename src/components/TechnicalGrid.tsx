"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Project, PROJECTS } from "../constants/projects";
import MaskText from "./MaskText";

// --- PROPS ---
interface TechnicalGridProps {
    onProjectClick: (project: Project) => void;
}

// --- ITEM COMPONENT ---
function GridItem({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) {
    // Pad index for "FIG. 01" look
    const figNum = (index + 1).toString().padStart(2, '0');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={onClick}
            className="group relative w-full aspect-[4/3] bg-[#050505] cursor-pointer overflow-hidden"
        >
            {/* 1. IMAGE LAYER */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={project.media}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 grayscale group-hover:grayscale-0"
                />
            </div>

            {/* 2. OVERLAY LAYER (Technical Lines) */}
            <div className="absolute inset-0 z-10 border border-white/5 pointer-events-none p-4 flex flex-col justify-between transition-colors duration-300 group-hover:border-white/20">

                {/* Top Info */}
                <div className="flex justify-between items-start text-[10px] font-mono tracking-widest text-white/60 bg-black/50 backdrop-blur-sm p-1 inline-block w-fit">
                    <span>[FIG. {figNum}]</span>
                    <span className="ml-4">{project.category.toUpperCase()}</span>
                </div>

                {/* Bottom Info */}
                <div className="bg-black/90 backdrop-blur-md p-3 border-t border-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    <MaskText phrases={[project.title]} className="text-sm font-bold tracking-tight uppercase mb-1 text-white" />
                    <div className="flex justify-between items-center text-[10px] font-mono text-white/60">
                        <span>{project.year}</span>
                        <span>STATUS: ARCHIVED</span>
                    </div>
                </div>
            </div>

            {/* Hover Crosshair (Center) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute w-full h-[1px] bg-white top-1/2 -translate-y-1/2" />
                <div className="absolute h-full w-[1px] bg-white left-1/2 -translate-x-1/2" />
            </div>

        </motion.div>
    );
}

// --- MAIN COMPONENT ---
export default function TechnicalGrid({ onProjectClick }: TechnicalGridProps) {
    return (
        <section className="relative w-full min-h-screen bg-[#050505] border-t border-white/10">
            {/* Header / Legend */}
            <div className="w-full py-12 px-6 md:px-12 border-b border-white/10 flex flex-col md:flex-row justify-between items-baseline">
                <h2 className="text-xs font-mono tracking-[0.2em] uppercase text-white/40">
                    // SELECTED WORKS [00-{PROJECTS.length.toString().padStart(2, '0')}]
                </h2>
                <p className="text-xs font-mono text-white/40 mt-2 md:mt-0">
                    SCROLL TO INSPECT
                </p>
            </div>

            {/* The Grid */}
            {/* gap-px with a background color creates the "Lines" between cells */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 w-full bg-white/10 gap-px border-b border-white/10">
                {PROJECTS.map((project, index) => (
                    <GridItem
                        key={project.id}
                        index={index}
                        project={project}
                        onClick={() => onProjectClick(project)}
                    />
                ))}
            </div>

            {/* Footer Metadata */}
            <div className="w-full py-6 px-6 border-b border-white/10 text-center">
                <span className="text-[10px] font-mono text-white/30">END OF INDEX</span>
            </div>
        </section>
    );
}
