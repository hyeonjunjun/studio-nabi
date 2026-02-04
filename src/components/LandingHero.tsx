"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SonicMistBackground from "./SonicMistBackground";

export default function LandingHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={containerRef} className="relative w-full h-screen overflow-hidden bg-transparent text-white">
            {/* 3D Background - Parallax */}
            <motion.div style={{ y }} className="absolute inset-0 z-0">
                <SonicMistBackground />
            </motion.div>

            {/* Content Contentier */}
            <motion.div
                style={{ opacity }}
                className="relative z-10 w-full h-full flex flex-col justify-between p-8 md:p-12 pointer-events-none"
            >
                {/* Header */}
                <div className="flex justify-between items-start">
                    <h1 className="absolute top-1/2 -translate-y-1/2 font-serif text-[7.5vw] leading-[0.8] tracking-tighter mix-blend-overlay opacity-90">
                        Hyeonjun<br />Jun
                    </h1>
                    <div className="text-right font-serif text-sm tracking-widest uppercase opacity-60 hidden md:block">

                    </div>
                </div>

                {/* Footer Metadata */}
                <div className="flex justify-between items-end">
                    <div className="font-mono text-[10px] tracking-widest uppercase opacity-40">
                        [EST. 2026]
                    </div>
                    <div className="font-serif text-xl md:text-2xl max-w-md text-right leading-tight">
                        We curate digital noise for the<br />
                        <span className="italic opacity-60">next generation of discovery.</span>
                    </div>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                style={{ opacity }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 mix-blend-difference"
            >
                <span className="font-mono text-[9px] uppercase tracking-widest opacity-60">Scroll</span>
                <div className="w-[1px] h-12 bg-white/20 overflow-hidden">
                    <motion.div
                        animate={{ y: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="w-full h-1/2 bg-white"
                    />
                </div>
            </motion.div>
        </section>
    );
}
