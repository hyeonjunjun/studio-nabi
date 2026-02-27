"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

/**
 * Colophon
 * ────────
 * Clean minimal footer. Two-column layout with contact + availability.
 * Live clock, breathing availability indicator, easter egg preserved.
 */
export default function Colophon() {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
    const [eggCount, setEggCount] = useState(0);
    const eggTriggered = eggCount >= 5;

    return (
        <footer
            id="contact"
            ref={ref}
            className="px-6 sm:px-12 lg:px-20 py-24 sm:py-32 border-t border-ink/[0.06]"
        >
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-16 sm:gap-8"
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* Left: Contact + Links */}
                <div>
                    <h4 className="font-pixel text-[9px] tracking-[0.25em] uppercase text-ink-faint mb-6">
                        Contact
                    </h4>
                    <EmailLink />
                    <div className="flex gap-6 mt-6">
                        {[
                            { label: "LinkedIn", href: "https://www.linkedin.com/in/ryan-jun-" },
                            { label: "GitHub", href: "https://github.com/studionabi" },
                            { label: "Twitter", href: "https://twitter.com/studionabi" },
                        ].map(({ label, href }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-pixel text-[9px] tracking-[0.2em] uppercase text-ink-faint hover:text-ink transition-colors duration-300 p-2 -m-2"
                            >
                                {label}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Right: Availability + Clock + Colophon */}
                <div className="sm:text-right">
                    <h4 className="font-pixel text-[9px] tracking-[0.25em] uppercase text-ink-faint mb-6">
                        Availability
                    </h4>
                    <div className="flex items-center gap-2 sm:justify-end mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span className="font-pixel text-[11px] text-ink-muted">
                            Open to projects
                        </span>
                    </div>

                    <LiveClock />

                    <p className="font-pixel text-[10px] text-ink-faint leading-relaxed mt-8">
                        Built with late-night coffee in NYC.
                        <br />
                        Powered by Next.js, Three.js &amp; Framer Motion.
                        <br />
                        Set in Instrument Serif, Silkscreen &amp; Geist.
                    </p>
                </div>
            </motion.div>

            {/* Copyright + Easter Egg */}
            <div className="mt-20 pt-6 border-t border-ink/[0.04]">
                <p
                    className="font-pixel text-[10px] tracking-[0.1em] text-ink-faint text-center select-none"
                    onClick={() => setEggCount((c) => c + 1)}
                >
                    {eggTriggered ? (
                        <motion.span
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-ink-muted"
                        >
                            나비가 날아갑니다 🦋
                        </motion.span>
                    ) : (
                        <>© 2026—{new Date().getFullYear()} Studio Nabi. All rights reserved.</>
                    )}
                </p>
            </div>
        </footer>
    );
}

/**
 * EmailLink — Per-letter 3D rotateX flip on hover, staggered cascade.
 */
function EmailLink() {
    const [isHovered, setIsHovered] = useState(false);
    const email = "stuuudionabi@gmail.com";
    const chars = email.split("");
    const STAGGER = 0.02; // seconds between each letter

    return (
        <a
            href={`mailto:${email}`}
            className="block mb-4 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ perspective: "800px" }}
        >
            <span className="flex flex-wrap">
                {chars.map((char, i) => (
                    <motion.span
                        key={`${char}-${i}`}
                        className="font-display italic text-[clamp(1.2rem,2.5vw,1.8rem)] text-ink inline-block"
                        style={{
                            transformStyle: "preserve-3d",
                            whiteSpace: "pre",
                        }}
                        animate={{
                            rotateX: isHovered ? 360 : 0,
                            color: isHovered
                                ? "var(--color-accent, #8b9e6b)"
                                : "var(--color-ink, #1a1a1a)",
                        }}
                        transition={{
                            rotateX: {
                                duration: 0.6,
                                delay: i * STAGGER,
                                ease: [0.16, 1, 0.3, 1],
                            },
                            color: {
                                duration: 0.3,
                                delay: i * STAGGER,
                                ease: "easeOut",
                            },
                        }}
                    >
                        {char}
                    </motion.span>
                ))}
            </span>
        </a>
    );
}

/**
 * LiveClock — Ticks every second. NYC local time.
 */
function LiveClock() {
    const [time, setTime] = useState<string>("");

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(
                now.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                    timeZone: "America/New_York",
                })
            );
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="font-pixel text-[10px] tracking-[0.15em] text-ink-faint tabular-nums">
            NYC Local — {time || "--:--:--"}
        </div>
    );
}
