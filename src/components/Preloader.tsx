"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const duration = 2000;
        const steps = 100;
        const intervalTime = duration / steps;

        const timer = setInterval(() => {
            setCount((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 500);
                    return 100;
                }
                return prev + 1;
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-50 bg-[#050505] text-[#EDEDED] grid grid-cols-2 overflow-hidden"
            exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
        >
            {/* LEFT COLUMN - DATA */}
            <div className="h-full border-r border-[#262626] p-8 md:p-12 flex flex-col justify-between font-mono text-[10px] uppercase tracking-wider relative">
                {/* TOP */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#FFD700] inline-block" /> {/* Yellow Dot */}
                        <span>[STATUS:ACTIVE]</span>
                    </div>
                </div>

                {/* MIDDLE */}
                <div className="flex flex-col gap-12">
                    <div>
                        <div className="opacity-50 mb-2">©CWM — FW25</div>
                    </div>

                    <div className="flex gap-12">
                        <div>
                            <div className="opacity-50 mb-1">PRJCT BY</div>
                            <div>HKJSTUDIO</div>
                        </div>
                        <div>
                            <div className="opacity-50 mb-1">[L] VN.US</div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM */}
                <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-1">
                        <div>// SITE.LOADING</div>
                        <div className="flex gap-4 opacity-50">
                            <span>[F] SCRIPTS() &#123;</span>
                        </div>
                        <div className="pl-4 opacity-50">INITLENIS();</div>
                        <div className="pl-4 opacity-50">INITNA...</div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN - COUNTER */}
            <div className="h-full p-8 md:p-12 flex items-end justify-start relative">
                <div className="relative">
                    <h1 className="text-[15vw] md:text-[20vw] leading-[0.8] font-bold font-sans tracking-tighter mix-blend-difference">
                        {count}%
                    </h1>
                </div>

                {/* Decorative Grid Lines on Right */}
                <div className="absolute right-0 top-0 h-full w-px bg-[#262626] opacity-30" />
                <div className="absolute right-12 top-0 h-full w-px bg-[#262626] opacity-30 hidden md:block" />
            </div>

        </motion.div>
    );
}
