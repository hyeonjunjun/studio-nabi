"use client";

import { useEffect, useRef, useMemo } from "react";
import { useSpring, useMotionValue } from "framer-motion";
import { useDesignStore } from "@/store/useDesignStore";

/**
 * NaturalGradient — Adaptive Biomes Edition
 * ───────────────────────────────────────
 * Abstracted natural landscape as soft radial gradients.
 * Layered biomes that react to the active project's "mood" color.
 * Uses canvas for performance with smooth spring-based mouse drift.
 */

interface Band {
    y: number;       // Base vertical position (0 to 1)
    color: string;   // RGB string "r, g, b"
    size: number;    // Size multiplier
    drift: number;   // Parallax speed
    opacity: number; // Base opacity
}

const BANDS: Band[] = [
    { y: 0.1, color: "226, 232, 240", size: 0.6, drift: 0.02, opacity: 0.4 }, // Sky
    { y: 0.4, color: "203, 213, 225", size: 0.5, drift: 0.015, opacity: 0.3 }, // Horizon
    { y: 0.65, color: "139, 158, 107", size: 0.45, drift: 0.01, opacity: 0.35 }, // Ground (Sage)
    { y: 0.85, color: "148, 163, 184", size: 0.4, drift: 0.012, opacity: 0.25 }, // Shadow
    { y: 0.5, color: "255, 255, 255", size: 0.7, drift: 0.005, opacity: 0.5 }, // Mist
];

export default function NaturalGradient() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);
    const activeMood = useDesignStore((state) => state.activeMood);
    const isFocussed = useDesignStore((state) => state.isFocussed);
    const timeRef = useRef(0);

    const smoothX = useSpring(mouseX, { damping: 40, stiffness: 80 });
    const smoothY = useSpring(mouseY, { damping: 40, stiffness: 80 });
    const blur = useSpring(isFocussed ? 1 : 0, { damping: 40, stiffness: 100 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX / window.innerWidth);
            mouseY.set(e.clientY / window.innerHeight);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", resize);

        const render = () => {
            ctx.clearRect(0, 0, w, h);

            // Focal Blur Effect
            ctx.filter = `blur(${blur.get() * 8}px)`;

            const time = timeRef.current;

            BANDS.forEach((band) => {
                const drawY = h * band.y + Math.sin(time * band.drift) * 30 + (smoothY.get() - 0.5) * 50;
                const radius = h * band.size;

                const grad = ctx.createRadialGradient(
                    w * 0.5 + (smoothX.get() - 0.5) * 100,
                    drawY,
                    0,
                    w * 0.5,
                    drawY,
                    radius
                );

                let color = `rgb(${band.color})`;
                ctx.globalAlpha = band.opacity;

                grad.addColorStop(0, color);
                grad.addColorStop(1, "transparent");

                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, w, h);
            });

            // Noise Integration (Baked into Canvas)
            if (Math.random() > 0.5) {
                ctx.fillStyle = "rgba(0,0,0,0.02)";
                for (let i = 0; i < 1000; i++) {
                    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
                }
            }

            timeRef.current += 0.01;
            requestAnimationFrame(render);
        };

        const animId = requestAnimationFrame(render);
        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animId);
        };
    }, [activeMood, isFocussed, smoothX, smoothY, blur]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
            aria-hidden
        />
    );
}
