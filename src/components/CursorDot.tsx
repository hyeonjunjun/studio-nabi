"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

/**
 * CursorDot — Bio-Digital Combo + Contextual States
 * ──────────────────────────────────────────────────
 * A dual-cursor system with contextual morphing:
 * 1. Flower: Tightly follows hardware cursor (the "target").
 * 2. Butterfly: Trails behind with spring physics + rotation (the "pollinator").
 *
 * States:
 *   - "default"  → Standard flower + butterfly
 *   - "link"     → Flower scales up (No ring)
 *   - "view"     → Flower morphs into a "View" text pill
 */

type CursorState = "default" | "link" | "view";

/* ─── Flower Frames (9x9) ─── */
const FLOWER_FRAME: [number, number][] = [
    [4, 4], // Center
    [4, 2], [5, 3], [6, 4], [5, 5], [4, 6], [3, 5], [2, 4], [3, 3], // Ring
    [4, 1], [5, 2], [6, 3], [7, 4], [6, 5], [5, 6], [4, 7], [3, 6], [2, 5], [1, 4], [2, 3], [3, 2] // Petals
];

/* ─── Butterfly Frames (16x16) ─── */
const BUTTERFLY_A: [number, number][] = [
    // Antennae
    [5, 2], [4, 1], [10, 2], [11, 1],
    // Head & Body
    [7, 3], [8, 3], [7, 4], [8, 4], [7, 5], [8, 5], [7, 6], [8, 6], [7, 7], [8, 7], [7, 8], [8, 8], [7, 9], [8, 9],
    // Left Wing (Spread)
    [6, 4], [5, 3], [4, 3], [3, 3],
    [6, 5], [5, 4], [4, 4], [3, 4], [2, 4],
    [6, 6], [5, 5], [4, 5], [3, 5], [2, 5], [5, 6], [4, 6], [3, 6],
    [6, 7], [5, 7], [4, 7], [6, 8], [5, 8], [4, 8], [3, 8], [5, 9], [4, 9],
    // Right Wing (Spread)
    [9, 4], [10, 3], [11, 3], [12, 3],
    [9, 5], [10, 4], [11, 4], [12, 4], [13, 4],
    [9, 6], [10, 5], [11, 5], [12, 5], [13, 5], [10, 6], [11, 6], [12, 6],
    [9, 7], [10, 7], [11, 7], [9, 8], [10, 8], [11, 8], [12, 8], [10, 9], [11, 9],
];

const BUTTERFLY_B: [number, number][] = [
    // Antennae
    [5, 2], [4, 1], [10, 2], [11, 1],
    // Head & Body
    [7, 3], [8, 3], [7, 4], [8, 4], [7, 5], [8, 5], [7, 6], [8, 6], [7, 7], [8, 7], [7, 8], [8, 8], [7, 9], [8, 9],
    // Left Wing (Folded)
    [6, 4], [5, 4], [4, 4], [6, 5], [5, 5], [4, 5], [6, 6], [5, 6],
    [6, 7], [5, 7], [6, 8], [5, 8],
    // Right Wing (Folded)
    [9, 4], [10, 4], [11, 4], [9, 5], [10, 5], [11, 5], [9, 6], [10, 6],
    [9, 7], [10, 7], [9, 8], [10, 8],
];

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

    // Spring for Butterfly (Trailing)
    const springConfig = { damping: 20, stiffness: 150, mass: 0.8 }; // Loose & floaty
    const butterflyX = useSpring(cursorX, springConfig);
    const butterflyY = useSpring(cursorY, springConfig);

    const [cursorState, setCursorState] = useState<CursorState>("default");
    const [isVisible, setIsVisible] = useState(false);
    const [frame, setFrame] = useState(0);
    const [rotation, setRotation] = useState(0);
    const [particles, setParticles] = useState<Particle[]>([]);

    const particleIdCounter = useRef(0);
    const lastParticlePos = useRef({ x: 0, y: 0 });
    const prevButterflyPos = useRef({ x: 0, y: 0 });
    const velocity = useRef(0);

    const isHovering = cursorState !== "default";

    // Butterfly Flap Animation
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        const flap = () => {
            setFrame((f) => (f === 0 ? 1 : 0));
            const delay = Math.max(100, 300 - velocity.current * 10); // Flap faster when moving
            timeoutId = setTimeout(flap, isHovering ? 600 : delay);
        };
        flap();
        return () => clearTimeout(timeoutId);
    }, [isHovering]);

    // Cleanup Particles
    useEffect(() => {
        const interval = setInterval(() => {
            setParticles((prev) => prev.slice(-15));
        }, 100);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Robust check for mouse/trackpad
        const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
        if (!hasFinePointer) return;

        setIsVisible(true);

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Check for "view" state first (work rows)
            const viewTarget = target.closest("[data-cursor='view']");
            if (viewTarget) {
                setCursorState("view");
                return;
            }

            // Check for standard interactive elements (links, buttons)
            const interactive = target.closest(
                "a, button, [role='button'], input, textarea, select, [data-cursor-grow]"
            );
            if (interactive) {
                setCursorState("link");
                return;
            }

            setCursorState("default");
        };

        window.addEventListener("mousemove", moveCursor, { passive: true });
        document.addEventListener("mouseover", handleMouseOver, { passive: true });

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            document.removeEventListener("mouseover", handleMouseOver);
        };
    }, [cursorX, cursorY]);

    // Calculate rotation and particles based on SPRING position (Butterfly)
    useEffect(() => {
        const unsubscribeX = butterflyX.on("change", (latestX) => {
            const latestY = butterflyY.get();
            const dx = latestX - prevButterflyPos.current.x;
            const dy = latestY - prevButterflyPos.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            velocity.current = dist;

            if (dist > 1) {
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                setRotation(angle + 90);

                // Particles trail from butterfly
                const distSinceLastParticle = Math.sqrt(
                    Math.pow(latestX - lastParticlePos.current.x, 2) +
                    Math.pow(latestY - lastParticlePos.current.y, 2)
                );

                if (distSinceLastParticle > 20 && !isHovering) {
                    const newParticle = {
                        id: particleIdCounter.current++,
                        x: latestX,
                        y: latestY
                    };
                    setParticles(prev => [...prev.slice(-15), newParticle]);
                    lastParticlePos.current = { x: latestX, y: latestY };
                }
            }
            prevButterflyPos.current = { x: latestX, y: latestY };
        });

        return () => unsubscribeX();
    }, [butterflyX, butterflyY, isHovering]);

    if (!isVisible) return null;

    const PIXEL_SIZE = 2; // Fixed size
    const butterflyPixels = frame === 0 ? BUTTERFLY_A : BUTTERFLY_B;
    const butterflyShadow = pixelsToBoxShadow(butterflyPixels, PIXEL_SIZE, "currentColor");
    const flowerShadow = pixelsToBoxShadow(FLOWER_FRAME, PIXEL_SIZE, cursorState === "link" ? "var(--color-accent)" : "currentColor");

    return (
        <>
            {/* Particles (Pollination Trail) */}
            <AnimatePresence>
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0.6, scale: 1 }}
                        animate={{ opacity: 0, scale: 0.5, y: p.y + 15 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="fixed top-0 left-0 pointer-events-none z-[9997] bg-accent"
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

            {/* Butterfly (Trails behind) */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9998] text-ink/40"
                style={{
                    x: butterflyX,
                    y: butterflyY,
                    translateX: `${-8 * PIXEL_SIZE}px`, // Center 16x16
                    translateY: `${-5 * PIXEL_SIZE}px`,
                    rotate: rotation,
                }}
                animate={{
                    opacity: cursorState === "view" ? 0.15 : 1,
                    scale: cursorState === "view" ? 0.6 : 1,
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
                <div
                    style={{
                        width: `${PIXEL_SIZE}px`,
                        height: `${PIXEL_SIZE}px`,
                        boxShadow: butterflyShadow,
                        imageRendering: "pixelated",
                    }}
                />
            </motion.div>

            {/* ─── Leader Cursor: Contextual States ─── */}
            <AnimatePresence mode="wait">
                {cursorState === "view" ? (
                    /* "View" Pill — replaces the flower on work rows */
                    <motion.div
                        key="view-pill"
                        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
                        style={{
                            x: cursorX,
                            y: cursorY,
                            translateX: "-50%",
                            translateY: "-50%",
                        }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="bg-ink text-canvas px-4 py-1.5 rounded-full shadow-lg">
                            <span className="font-pixel text-[9px] tracking-[0.2em] uppercase">
                                View
                            </span>
                        </div>
                    </motion.div>
                ) : (
                    /* Default Flower / Link Flower (No Ring) */
                    <motion.div
                        key="flower-state"
                        className="fixed top-0 left-0 pointer-events-none z-[9999] text-ink"
                        style={{
                            x: cursorX,
                            y: cursorY,
                            translateX: `${-4.5 * PIXEL_SIZE}px`,
                            translateY: `${-4.5 * PIXEL_SIZE}px`,
                        }}
                        animate={{
                            scale: cursorState === "link" ? 1.4 : 1,
                            opacity: 1,
                        }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div
                            style={{
                                width: `${PIXEL_SIZE}px`,
                                height: `${PIXEL_SIZE}px`,
                                boxShadow: flowerShadow,
                                imageRendering: "pixelated",
                                transition: "color 0.2s",
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
