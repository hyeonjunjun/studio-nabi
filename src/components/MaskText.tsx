"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// --- ANIMATION VARIANTS ---
const animation: any = {
    initial: { y: "100%" },
    enter: (i: number) => ({
        y: "0",
        transition: {
            duration: 0.75,
            ease: [0.33, 1, 0.68, 1], // "Quart Out" - Snappy but smooth 
            delay: 0.075 * i
        }
    })
};

export default function MaskText({ phrases, className = "" }: { phrases: string[], className?: string }) {
    const { ref, inView, entry } = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    return (
        <div ref={ref} className={`${className}`}>
            {phrases.map((phrase, index) => {
                return (
                    <div key={index} className="overflow-hidden">
                        <motion.p
                            custom={index}
                            variants={animation}
                            initial="initial"
                            animate={inView ? "enter" : ""}
                            className="m-0"
                        >
                            {phrase}
                        </motion.p>
                    </div>
                )
            })}
        </div>
    )
}
