"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MaskRevealProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    direction?: "up" | "down" | "left" | "right";
    className?: string;
}

export default function MaskReveal({
    children,
    delay = 0,
    duration = 1.2,
    direction = "up",
    className = ""
}: MaskRevealProps) {
    const variants: import("framer-motion").Variants = {
        hidden: {
            clipPath: direction === "up" ? "inset(100% 0% 0% 0%)" :
                direction === "down" ? "inset(0% 0% 100% 0%)" :
                    direction === "left" ? "inset(0% 0% 0% 100%)" :
                        "inset(0% 100% 0% 0%)",
            y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
            x: direction === "left" ? 50 : direction === "right" ? -50 : 0,
            opacity: 0,
        },
        visible: {
            clipPath: "inset(0% 0% 0% 0%)",
            y: 0,
            x: 0,
            opacity: 1,
            transition: {
                duration,
                ease: [0.33, 1, 0.68, 1], // Custom cubic-bezier for biological motion
                delay,
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={variants}
            className={`relative overflow-hidden ${className}`}
        >
            {children}
        </motion.div>
    );
}
