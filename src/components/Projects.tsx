"use client";

import MaskReveal from "./MaskReveal";
import { useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const projects = [
    {
        title: "Ethereal Landscapes",
        category: "Generative Art",
        year: "2025",
        description: "Procedural skyboxes and organic particle systems.",
        tags: ["GLSL", "React Three Fiber"]
    },
    {
        title: "Minimalist Commerce",
        category: "Product Design",
        year: "2024",
        description: "High-performance luxury shopping experience.",
        tags: ["Next.js", "Framer Motion"]
    },
    {
        title: "Sift Mobile",
        category: "Mobile App",
        year: "2024",
        description: "Curation platform for aesthetic serenity.",
        tags: ["React Native", "Expo"]
    },
];

export default function Projects() {
    return (
        <section id="projects" className="border-b border-foreground/10 pb-32">
            <MaskReveal delay={0.1}>
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-accent mb-12 block font-heading">
                    02. Selected Works
                </span>
            </MaskReveal>

            <div className="flex flex-col">
                {projects.map((project, index) => (
                    <ProjectRow key={index} project={project} index={index} />
                ))}
            </div>
        </section>
    );
}

function ProjectRow({ project, index }: { project: any, index: number }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="group py-12 border-t border-foreground/10 flex flex-col md:flex-row gap-8 md:items-baseline transition-colors hover:bg-foreground/5 -mx-6 px-6 md:-mx-12 md:px-12"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="w-24 shrink-0 text-xs font-bold opacity-40 font-heading">
                0{index + 1}
            </div>

            <div className="flex-1">
                <h3 className="text-3xl md:text-5xl font-bold uppercase font-heading mb-2 group-hover:translate-x-2 transition-transform duration-300">
                    {project.title}
                </h3>
                <p className="text-sm font-serif opacity-60">
                    {project.description}
                </p>
            </div>

            <div className="w-32 shrink-0 text-right text-xs font-bold uppercase tracking-widest opacity-60">
                {project.category}
            </div>
        </div>
    );
}
