"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

/**
 * PhilosophyStrip
 * ───────────────
 * Horizontal marquee ticker with hover-pause.
 * Pauses on hover (Lightweight-inspired), resumes on leave.
 */

const PHRASES = [
    "Digital Naturalism",
    "Design Engineering",
    "Interfaces as Habitats",
    "NYC · Worldwide",
    "Est. 2024",
    "나비 = Butterfly",
    "Nothing is Unnecessary",
];

function MarqueeContent() {
    return (
        <>
            {PHRASES.map((phrase, i) => (
                <span key={i} className="flex items-center gap-8 shrink-0">
                    <span className="font-pixel text-[clamp(1rem,2vw,1.4rem)] text-ink-muted whitespace-nowrap">
                        {phrase}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-ink-faint/30 shrink-0" />
                </span>
            ))}
        </>
    );
}

export default function PhilosophyStrip() {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.5,
    });
    const [isPaused, setIsPaused] = useState(false);

    return (
        <section
            ref={ref}
            className="relative py-10 sm:py-14 border-y border-ink/[0.06] overflow-hidden select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <motion.div
                className="flex"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 1 }}
            >
                {/* Two copies for seamless loop */}
                <div className={`flex items-center gap-8 animate-marquee ${isPaused ? "animate-marquee-paused" : ""}`}>
                    <MarqueeContent />
                </div>
                <div className={`flex items-center gap-8 animate-marquee ${isPaused ? "animate-marquee-paused" : ""}`} aria-hidden>
                    <MarqueeContent />
                </div>
            </motion.div>
        </section>
    );
}
