"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "@/lib/gsap";

interface KineticTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function KineticText({ text, className, style }: KineticTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef(0);
  const reducedMotion = useRef(false);

  // Split text into characters, preserving spaces as &nbsp; spans
  const chars = text.split("").map((char, i) => ({
    char: char === " " ? "\u00A0" : char,
    key: i,
  }));

  // Entrance animation
  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion.current) return;

    // Check sessionStorage to determine if this is a repeat visit (shorter preloader)
    const isRepeatVisit = typeof sessionStorage !== "undefined" && sessionStorage.getItem("hkj_visited") === "1";
    const entranceDelay = isRepeatVisit ? 0.4 : 1.8;

    // Mark as visited
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem("hkj_visited", "1");
    }

    const spans = charsRef.current.filter(Boolean);
    // Set initial state
    gsap.set(spans, { opacity: 0, y: 12, filter: "blur(2px)" });

    // Animate in with spring-like settling
    gsap.to(spans, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.6,
      stagger: 0.015,
      ease: "back.out(1.2)", // micro-bounce
      delay: entranceDelay,
    });
  }, []);

  // Cursor proximity displacement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    window.addEventListener("mousemove", handleMouseMove);

    const RADIUS = 80; // proximity radius in px
    const STRENGTH = 2; // max displacement in px

    const tick = () => {
      const spans = charsRef.current.filter(Boolean);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      spans.forEach((span) => {
        const rect = span.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - mx;
        const dy = cy - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < RADIUS) {
          const force = (1 - dist / RADIUS) * STRENGTH;
          const angle = Math.atan2(dy, dx);
          const offsetX = Math.cos(angle) * force;
          const offsetY = Math.sin(angle) * force;
          span.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
          span.style.transition = "transform 0.1s ease-out";
        } else {
          span.style.transform = "translate(0, 0)";
          span.style.transition = "transform 0.3s ease-out";
        }
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <div ref={containerRef} className={className} style={style} aria-label={text}>
      {chars.map(({ char, key }) => (
        <span
          key={key}
          ref={(el) => { if (el) charsRef.current[key] = el; }}
          style={{
            display: "inline-block",
            willChange: "transform",
          }}
          aria-hidden="true"
        >
          {char}
        </span>
      ))}
    </div>
  );
}
