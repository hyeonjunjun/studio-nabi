"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

/**
 * CursorDot — Pixel Butterfly Edition
 * ─────────────────────────────────────
 * A Nothing-inspired pixel art butterfly that follows the cursor.
 * Rendered via CSS box-shadow (each "pixel" = a 2px shadow offset).
 * Two-frame wing flap animation toggles every 400ms.
 * Spring-physics follow + directional rotation.
 * Hidden on touch devices.
 */

/* ─── Pixel Art Frames (16×16 grid, each unit = 2px) ─── */
/* Coordinates are [col, row] from top-left. Color: currentColor */

const FRAME_A: [number, number][] = [
    // Left antenna
    [5, 2], [4, 1],
    // Right antenna
    [10, 2], [11, 1],
    // Head
    [7, 3], [8, 3],
    // Body (vertical center line)
    [7, 4], [8, 4],
    [7, 5], [8, 5],
    [7, 6], [8, 6],
    [7, 7], [8, 7],
    [7, 8], [8, 8],
    [7, 9], [8, 9],
    // Left upper wing (spread)
    [6, 4], [5, 3], [4, 3], [3, 3],
    [6, 5], [5, 4], [4, 4], [3, 4], [2, 4],
    [6, 6], [5, 5], [4, 5], [3, 5], [2, 5],
    [5, 6], [4, 6], [3, 6],
    // Left lower wing
    [6, 7], [5, 7], [4, 7],
    [6, 8], [5, 8], [4, 8], [3, 8],
    [5, 9], [4, 9],
    // Right upper wing (spread)
    [9, 4], [10, 3], [11, 3], [12, 3],
    [9, 5], [10, 4], [11, 4], [12, 4], [13, 4],
    [9, 6], [10, 5], [11, 5], [12, 5], [13, 5],
    [10, 6], [11, 6], [12, 6],
    // Right lower wing
    [9, 7], [10, 7], [11, 7],
    [9, 8], [10, 8], [11, 8], [12, 8],
    [10, 9], [11, 9],
];

const FRAME_B: [number, number][] = [
    // Antennae (same)
    [5, 2], [4, 1],
    [10, 2], [11, 1],
    // Head
    [7, 3], [8, 3],
    // Body
    [7, 4], [8, 4],
    [7, 5], [8, 5],
    [7, 6], [8, 6],
    [7, 7], [8, 7],
    [7, 8], [8, 8],
    [7, 9], [8, 9],
    // Left upper wing (folded — narrower)
    [6, 4], [5, 4], [4, 4],
    [6, 5], [5, 5], [4, 5],
    [6, 6], [5, 6],
    // Left lower wing (folded)
    [6, 7], [5, 7],
    [6, 8], [5, 8],
    // Right upper wing (folded)
    [9, 4], [10, 4], [11, 4],
    [9, 5], [10, 5], [11, 5],
    [9, 6], [10, 6],
    // Right lower wing (folded)
    [9, 7], [10, 7],
    [9, 8], [10, 8],
];

const PIXELS_A = FRAME_A;
const PIXELS_B = FRAME_B;

function pixelsToBoxShadow(pixels: [number, number][], pixelSize: number, color: string): string {
    return pixels
        .map(([col, row]) => `${col * pixelSize}px ${row * pixelSize}px 0 0 ${color}`)
        .join(", ");
}

interface Particle {
    id: number;
    x: number;
    y: number;
}

export default function CursorDot() {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [frame, setFrame] = useState(0);
    const [rotation, setRotation] = useState(0);
    const [particles, setParticles] = useState<Particle[]>([]);
    const particleIdCounter = useRef(0);
    const lastParticlePos = useRef({ x: 0, y: 0 });
    const prevPos = useRef({ x: 0, y: 0 });
    const velocity = useRef(0);

    const springConfig = { damping: 22, stiffness: 180, mass: 0.6 };
    const x = useSpring(cursorX, springConfig);
    const y = useSpring(cursorY, springConfig);

    // Wing flap animation — modified by velocity
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        const flap = () => {
            setFrame((f) => (f === 0 ? 1 : 0));
            // Base speed 400ms, decreases to 150ms based on velocity
            const delay = Math.max(150, 400 - velocity.current * 10);
            timeoutId = setTimeout(flap, isHovering ? 2000 : delay); // "Land" when hovering (slow flap)
        };
        flap();
        return () => clearTimeout(timeoutId);
    }, [isHovering]);

    // Particle Cleanup
    useEffect(() => {
        const interval = setInterval(() => {
            setParticles((prev) => prev.slice(-20)); // Keep last 20
        }, 100);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;

        setIsVisible(true);

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            const dx = e.clientX - prevPos.current.x;
            const dy = e.clientY - prevPos.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            velocity.current = dist;

            if (dist > 4) {
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                setRotation(angle + 90);

                // Spawn particle/trail if moved enough
                const distSinceLastParticle = Math.sqrt(
                    Math.pow(e.clientX - lastParticlePos.current.x, 2) +
                    Math.pow(e.clientY - lastParticlePos.current.y, 2)
                );

                if (distSinceLastParticle > 15 && !isHovering) {
                    const newParticle = {
                        id: particleIdCounter.current++,
                        x: e.clientX,
                        y: e.clientY
                    };
                    setParticles(prev => [...prev.slice(-15), newParticle]);
                    lastParticlePos.current = { x: e.clientX, y: e.clientY };
                }
            }

            prevPos.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const interactive = target.closest(
                "a, button, [role='button'], input, textarea, select, [data-cursor-grow]"
            );
            setIsHovering(!!interactive);
        };

        window.addEventListener("mousemove", moveCursor, { passive: true });
        document.addEventListener("mouseover", handleMouseOver, { passive: true });

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            document.removeEventListener("mouseover", handleMouseOver);
        };
    }, [cursorX, cursorY, isHovering]);

    if (!isVisible) return null;

    const PIXEL_SIZE = isHovering ? 3 : 2;
    const pixels = frame === 0 ? PIXELS_A : PIXELS_B;
    const shadow = pixelsToBoxShadow(pixels, PIXEL_SIZE, "currentColor");

    return (
        <>
            {/* Particles (Pollination) */}
            <AnimatePresence>
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0.6, scale: 1 }}
                        animate={{ opacity: 0, scale: 0.5, y: p.y + 10 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="fixed top-0 left-0 pointer-events-none z-[9998] bg-accent"
                        style={{
                            x: p.x,
                            y: p.y,
                            width: 2,
                            height: 2,
                            translateX: "-50%",
                            translateY: "-50%",
                        }}
                    />
                ))}
            </AnimatePresence>

            {/* Pixel butterfly */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] text-ink/50"
                style={{
                    x,
                    y,
                    translateX: `${-8 * PIXEL_SIZE}px`,
                    translateY: `${-5 * PIXEL_SIZE}px`,
                    rotate: rotation,
                }}
            >
                <div
                    style={{
                        width: `${PIXEL_SIZE}px`,
                        height: `${PIXEL_SIZE}px`,
                        boxShadow: shadow,
                        imageRendering: "pixelated",
                        transition: "box-shadow 0.1s ease-out",
                    }}
                />
            </motion.div>

            {/* Small dot at exact cursor position */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999]"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
            >
                <motion.div
                    className="rounded-none bg-ink/40"
                    animate={{
                        width: isHovering ? 0 : 2,
                        height: isHovering ? 0 : 2,
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                />
            </motion.div>

            {/* Global cursor hide */}
            <style jsx global>{`
                * {
                    cursor: none !important;
                }
            `}</style>
        </>
    );
}
