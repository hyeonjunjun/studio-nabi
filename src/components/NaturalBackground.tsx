"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function NaturalBackground() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20,
            });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-40">
            <motion.div
                animate={{
                    x: mousePos.x,
                    y: mousePos.y,
                }}
                transition={{ type: "spring", damping: 30, stiffness: 50 }}
                className="absolute top-[-25%] left-[-25%] w-[150%] h-[150%]"
            >
                {/* Soft Organic Light Leaks */}
                <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-accent opacity-20 blur-[120px]" />
                <div className="absolute top-[60%] right-[10%] w-[600px] h-[600px] rounded-full bg-neutral-300 opacity-10 blur-[150px]" />
                <div className="absolute bottom-[10%] left-[30%] w-[500px] h-[500px] rounded-full bg-neutral-200 opacity-20 blur-[130px]" />
            </motion.div>

            {/* SVG Filter for Organic Texture */}
            <svg className="hidden">
                <filter id="natural-noise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
                </filter>
            </svg>
        </div>
    );
}
