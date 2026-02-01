"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function CustomCursor() {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const [isHovering, setIsHovering] = useState(false);

    const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
    const springX = useSpring(cursorX, springConfig);
    const springY = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleHover = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            setIsHovering(!!target.closest('a, button, [role="button"]'));
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseover", handleHover);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", handleHover);
        };
    }, [cursorX, cursorY]);

    return (
        <motion.div
            style={{
                translateX: springX,
                translateY: springY,
                x: "-50%",
                y: "-50%",
            }}
            animate={{
                scale: isHovering ? 2.5 : 1,
            }}
            className="fixed top-0 left-0 w-8 h-8 rounded-full border border-accent mix-blend-difference pointer-events-none z-[9999] hidden md:block"
        >
            <div className="absolute inset-0 m-3 bg-accent rounded-full opacity-20" />
        </motion.div>
    );
}
