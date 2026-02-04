"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS, Project } from "../constants/projects"; // Relative import fix
import RadialTextFade from "./RadialTextFade";

interface ImmersiveSliderProps {
    onProjectClick: (project: Project) => void;
    isPaused: boolean;
    className?: string;
    activeIndex?: number; // Controlled Mode
}

export default function ImmersiveSlider({ onProjectClick, isPaused, className = "", activeIndex = 0 }: ImmersiveSliderProps) {
    // Controlled Mode: Index comes from parent scroll
    const index = activeIndex;

    // Direction calculation (derived from index change)
    const [prevIndex, setPrevIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        if (index > prevIndex) setDirection(1);
        else if (index < prevIndex) setDirection(-1);
        else setDirection(0);

        setPrevIndex(index);
    }, [index]);

    const activeProject = PROJECTS[index] || PROJECTS[0];

    return (
        <section className={`relative w-full h-screen overflow-hidden bg-[#0C0A0A] text-white ${className}`}>

            {/* FULL BLEED BACKGROUND - DELAYED TRANSITION */}
            <div
                className="absolute inset-0 z-0 cursor-pointer"
                onClick={() => !isPaused && onProjectClick(activeProject)}
                data-cursor-label="( View )"
            >
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                        key={activeProject.id}
                        initial={{
                            opacity: 0,
                            scale: 1.1,
                            filter: "blur(40px) brightness(1.5)",
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            filter: isPaused ? "blur(30px) brightness(1)" : "blur(0px) brightness(1)"
                        }}
                        exit={{
                            opacity: 0,
                            scale: 1.05,
                            filter: "blur(60px) brightness(0.8)",
                        }}
                        transition={{
                            duration: 1.2,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <img
                            src={activeProject.media}
                            className="w-full h-full object-cover opacity-60"
                            alt={activeProject.title}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* OVERLAY CONTENT - INSTANT TRANSITION */}
            <motion.div
                animate={{ opacity: isPaused ? 0 : 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 z-30 pointer-events-none px-8 flex items-center"
            >
                <div className="w-full flex items-center">
                    {/* TITLE */}
                    <div className="w-1/2">
                        <AnimatePresence mode="wait">
                            <RadialTextFade
                                key={activeProject.title}
                                text={activeProject.title}
                                className="text-[1.2vw] font-serif tracking-widest leading-none text-white uppercase"
                            />
                        </AnimatePresence>
                    </div>

                    {/* SUBTITLE */}
                    <div className="w-1/2 flex justify-end">
                        <div className="max-w-xs overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={activeProject.subtitle}
                                    initial={{ y: "100%", opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: "-100%", opacity: 0 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                    className="text-base font-serif italic mb-2 text-right opacity-100 leading-relaxed text-white tracking-wider"
                                >
                                    {activeProject.subtitle}
                                </motion.p>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* METADATA (Bottom) - INSTANT */}
            <motion.div
                animate={{ opacity: isPaused ? 0 : 0.4 }}
                className="absolute bottom-12 left-8 z-40 flex gap-24 font-serif text-[13px] uppercase tracking-[0.2em] text-white"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeProject.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex gap-24"
                    >
                        <div className="flex flex-col gap-2">
                            <span className="opacity-50">(Credits)</span>
                            <span>{activeProject.credits}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="opacity-50">(Role)</span>
                            <span>{activeProject.role}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="opacity-50">(Year)</span>
                            <span>{activeProject.year}</span>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* THUMBNAIL NAV */}
            <motion.div
                animate={{ opacity: isPaused ? 0 : 1 }}
                className="absolute bottom-12 right-8 z-40 flex gap-3"
            >
                {PROJECTS.map((p: Project, i: number) => (
                    <div
                        key={p.id}
                        className={`w-10 h-7 border border-white/10 overflow-hidden transition-all ${i === index ? "w-20 opacity-100" : "opacity-20"}`}
                        data-cursor-label="( Switch )"
                    >
                        <img src={p.media} className="w-full h-full object-cover" alt="" />
                    </div>
                ))}
            </motion.div>

        </section>
    );
}
