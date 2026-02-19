"use client";

import { useRef, useEffect, useCallback } from "react";

/**
 * NaturalGradient
 * ───────────────
 * Abstracted natural landscape as soft horizontal bands.
 * Layered: sky (pale blue) → horizon (warm amber haze) → ground (sage).
 * Each band drifts at a slightly different rate for depth parallax.
 * Mouse influence adds gentle position offset.
 */

interface Band {
    y: number;       // position as fraction of viewport (0 = top)
    height: number;  // height as fraction
    color: string;   // CSS color
    speed: number;   // parallax speed multiplier (lower = slower)
    opacity: number;
}

const BANDS: Band[] = [
    // Sky — pale, high
    { y: 0, height: 0.35, color: "200, 215, 230", speed: 0.15, opacity: 0.12 },
    // Mid-sky — warmer
    { y: 0.25, height: 0.25, color: "215, 205, 185", speed: 0.25, opacity: 0.10 },
    // Horizon — warm amber haze
    { y: 0.40, height: 0.20, color: "195, 175, 145", speed: 0.35, opacity: 0.14 },
    // Near ground — sage
    { y: 0.55, height: 0.25, color: "155, 175, 145", speed: 0.45, opacity: 0.08 },
    // Ground — deep warm
    { y: 0.75, height: 0.30, color: "180, 165, 140", speed: 0.20, opacity: 0.06 },
];

export default function NaturalGradient() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0.5, y: 0.5 });
    const animRef = useRef(0);
    const timeRef = useRef(0);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        const t = timeRef.current;
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;

        for (const band of BANDS) {
            // Organic drift
            const driftX = Math.sin(t * band.speed * 0.5) * w * 0.02;
            const driftY = Math.cos(t * band.speed * 0.3) * h * 0.01;

            // Mouse influence (very subtle)
            const mouseOffsetX = (mx - 0.5) * w * 0.03 * band.speed;
            const mouseOffsetY = (my - 0.5) * h * 0.02 * band.speed;

            const bx = driftX + mouseOffsetX;
            const by = band.y * h + driftY + mouseOffsetY;
            const bh = band.height * h * 1.5;

            // Breathing opacity
            const breathe = 1 + Math.sin(t * 0.15 + band.y * 3) * 0.15;
            const alpha = band.opacity * breathe;

            // Radial gradient for soft edges
            const gradient = ctx.createRadialGradient(
                w * 0.5 + bx, by + bh * 0.5, 0,
                w * 0.5 + bx, by + bh * 0.5, Math.max(w, h) * 0.7
            );
            gradient.addColorStop(0, `rgba(${band.color}, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(${band.color}, ${alpha * 0.5})`);
            gradient.addColorStop(1, `rgba(${band.color}, 0)`);

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);
        }

        timeRef.current += 0.016;
        animRef.current = requestAnimationFrame(draw);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const handleMouse = (e: MouseEvent) => {
            mouseRef.current = {
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight,
            };
        };
        window.addEventListener("mousemove", handleMouse, { passive: true });

        animRef.current = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouse);
            cancelAnimationFrame(animRef.current);
        };
    }, [draw]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
            aria-hidden
        />
    );
}
