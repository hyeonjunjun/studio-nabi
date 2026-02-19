"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import Image from "next/image";

/**
 * IntroStatement
 * ──────────────
 * Large editorial text block inspired by hugoferradas' intro paragraph.
 * Instrument Serif italic, scroll-triggered line-by-line reveal.
 */

const LINES = [
    { text: "Hi — I'm Ryan,", highlight: false },
    { text: "Design Engineer.", highlight: true },
    { text: "NYC-based, crafting digital", highlight: false },
    { text: "experiences that live at the", highlight: false },
    { text: "intersection of design systems,", highlight: false },
    { text: "interaction, and engineering.", highlight: true },
    // { text: "— Studio Nabi", highlight: true }, // Removed signature
];

export default function IntroStatement() {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

    return (
        <section
            id="about"
            ref={ref}
            className="relative py-24 sm:py-32 lg:py-40 px-6 sm:px-12 lg:px-20 overflow-hidden"
        >
            {/* ─── Ethereal Butterfly Watermark ─── */}
            <motion.div
                className="absolute right-[-10%] top-0 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] lg:w-[800px] lg:h-[800px] pointer-events-none select-none z-0"
                initial={{ opacity: 0, rotate: 5 }}
                animate={inView ? { opacity: 0.3, rotate: 0 } : {}} // Low opacity for watermark
                transition={{ duration: 2, ease: "easeOut" }}
            >
                <div className="relative w-full h-full mix-blend-multiply opacity-60">
                    <Image
                        src="/images/ethereal_butterfly.jpeg"
                        alt=""
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
            </motion.div>

            <motion.div
                className="max-w-4xl relative z-10"
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={{
                    hidden: {},
                    visible: {
                        transition: { staggerChildren: 0.1, delayChildren: 0.1 },
                    },
                }}
            >
                {/* Korean Label */}
                <motion.div
                    className="font-dot text-[10px] text-accent mb-8"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { duration: 0.6 } },
                    }}
                >
                    ﹁소개﹂
                </motion.div>

                {/* Statement Lines */}
                {LINES.map((line, i) => (
                    <div key={i} className="overflow-hidden">
                        <motion.p
                            className={`font-display italic text-[clamp(1.8rem,4.5vw,3.5rem)] leading-[1.15] tracking-[-0.02em] ${line.highlight ? "text-ink" : "text-ink-muted"
                                }`}
                            variants={{
                                hidden: { y: "100%", opacity: 0 },
                                visible: {
                                    y: "0%",
                                    opacity: 1,
                                    transition: {
                                        duration: 0.8,
                                        ease: [0.16, 1, 0.3, 1] as const,
                                    },
                                },
                            }}
                        >
                            {line.text}
                        </motion.p>
                    </div>
                ))}
            </motion.div>
        </section>
    );
}
