"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

/**
 * Colophon
 * ────────
 * Three-column footer with live local time clock,
 * breathing availability indicator, and technical colophon.
 */
export default function Colophon() {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
    const [eggCount, setEggCount] = useState(0);
    const eggTriggered = eggCount >= 5;

    return (
        <footer
            ref={ref}
            className="px-6 sm:px-12 lg:px-20 py-32 sm:py-40 border-t border-ink/[0.06]"
        >
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8"
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* Contact */}
                <div>
                    <h4 className="font-pixel text-[9px] tracking-[0.2em] uppercase text-ink-faint mb-4">
                        Contact
                    </h4>
                    <a
                        href="mailto:hello@studionabi.com"
                        className="font-pixel text-sm text-ink-muted hover:text-ink transition-colors duration-300"
                    >
                        hello@studionabi.com
                    </a>
                </div>

                {/* Availability + Live Clock */}
                <div>
                    <h4 className="font-pixel text-[9px] tracking-[0.2em] uppercase text-ink-faint mb-4">
                        Availability
                    </h4>
                    <div className="flex items-center gap-2 mb-3">
                        {/* Breathing pulse */}
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span className="font-pixel text-sm text-ink-muted">
                            Open to projects
                        </span>
                    </div>

                    {/* Live Local Time */}
                    <LiveClock />
                </div>

                {/* Colophon */}
                <div>
                    <h4 className="font-pixel text-[9px] tracking-[0.2em] uppercase text-ink-faint mb-4">
                        Colophon
                    </h4>
                    <p className="font-pixel text-[11px] text-ink-faint leading-relaxed">
                        Built with Next.js, Three.js &amp; Framer Motion.
                        <br />
                        Set in Silkscreen &amp; Geist.
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
                        <>© 2024—{new Date().getFullYear()} Studio Nabi. All rights reserved.</>
                    )}
                </p>
            </div>
        </footer>
    );
}

/**
 * LiveClock — Ticks every second. Makes the studio feel alive.
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
                    timeZone: "Asia/Seoul",
                })
            );
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="font-pixel text-[10px] tracking-[0.15em] text-ink-faint tabular-nums">
            Seoul Local — {time || "--:--:--"}
        </div>
    );
}
