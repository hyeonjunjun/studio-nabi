"use client";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PROJECTS } from "@/constants/projects";
import type { ToyProps } from "./index";

export default function MiniTV({ reducedMotion }: ToyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const [resolved, setResolved] = useState(false);
  const [project] = useState(() => PROJECTS[Math.floor(Math.random() * PROJECTS.length)]);
  const router = useRouter();

  // Static noise effect
  useEffect(() => {
    if (reducedMotion || resolved) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 90;
    const h = 60;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const imageData = ctx.createImageData(w, h);

    const drawNoise = () => {
      for (let i = 0; i < imageData.data.length; i += 4) {
        const v = Math.random() * 255;
        imageData.data[i] = v;
        imageData.data[i + 1] = v;
        imageData.data[i + 2] = v;
        imageData.data[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
      rafRef.current = requestAnimationFrame(drawNoise);
    };

    rafRef.current = requestAnimationFrame(drawNoise);

    // Auto-resolve after 1.2 seconds
    const timeout = setTimeout(() => {
      cancelAnimationFrame(rafRef.current);
      setResolved(true);
    }, 1200);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timeout);
    };
  }, [reducedMotion, resolved]);

  return (
    <div
      onClick={() => {
        if (resolved) router.push(`/work/${project.slug}`);
      }}
      style={{
        width: 120,
        height: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: resolved ? "pointer" : "default",
        userSelect: "none",
      }}
    >
      {/* TV body */}
      <div
        style={{
          position: "relative",
          width: 108,
          height: 78,
          borderRadius: 8,
          background: "linear-gradient(180deg, #4a4a48 0%, #3a3a38 100%)",
          padding: "8px 8px 12px",
          boxShadow: "0 3px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Antenna */}
        <div style={{ position: "absolute", top: -14, left: 30, width: 2, height: 16, background: "#666", transform: "rotate(-20deg)", borderRadius: 1 }} />
        <div style={{ position: "absolute", top: -14, right: 30, width: 2, height: 16, background: "#666", transform: "rotate(20deg)", borderRadius: 1 }} />

        {/* Screen */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 4,
            overflow: "hidden",
            background: resolved ? "#1a2a1a" : "#111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {!resolved && (
            <canvas
              ref={canvasRef}
              style={{ width: 90, height: 60, opacity: 0.7 }}
            />
          )}
          {(resolved || reducedMotion) && (
            <div style={{ textAlign: "center", padding: 4 }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 8,
                  color: "#4aff4a",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  lineHeight: 1.3,
                }}
              >
                {project.title}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 6,
                  color: "#2a8a2a",
                  marginTop: 2,
                  lineHeight: 1.3,
                }}
              >
                {project.description.slice(0, 40)}...
              </div>
            </div>
          )}
          {/* Screen glare */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)",
              pointerEvents: "none",
              borderRadius: 4,
            }}
          />
        </div>
      </div>
      {resolved && (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 7,
            color: "var(--ink-muted, rgba(35,32,28,0.35))",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginTop: 4,
          }}
        >
          tap to visit
        </span>
      )}
    </div>
  );
}
