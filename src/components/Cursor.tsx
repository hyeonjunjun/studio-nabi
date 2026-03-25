"use client";

import { useRef, useEffect, useCallback, useState } from "react";

type CursorState = "default" | "magnetic" | "label" | "hidden";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(0);
  const [state, setState] = useState<CursorState>("default");
  const [label, setLabel] = useState("");
  const [isTouch, setIsTouch] = useState(false);

  // Detect touch device
  useEffect(() => {
    const hasTouch = window.matchMedia("(hover: none)").matches;
    setIsTouch(hasTouch);
    if (!hasTouch) {
      document.documentElement.dataset.cursorActive = "";
    }
    return () => {
      delete document.documentElement.dataset.cursorActive;
    };
  }, []);

  // Mouse tracking
  const handleMouseMove = useCallback((e: MouseEvent) => {
    targetRef.current = { x: e.clientX, y: e.clientY };

    // Check what we're hovering
    const target = e.target as HTMLElement;
    const cover = target.closest("[data-cover]");
    const link = target.closest("[data-link]") || target.closest("a") || target.closest("button");
    const vinyl = target.closest("[aria-label*='vinyl']") || target.closest("canvas");
    const textArea = target.closest("p") || target.closest("h1") || target.closest("h2");

    if (vinyl) {
      setState("hidden");
      setLabel("");
    } else if (cover) {
      setState("label");
      setLabel("View");
    } else if (link) {
      setState("magnetic");
      setLabel("");
      // Magnetic snap — move target toward link center
      const rect = (link as HTMLElement).getBoundingClientRect();
      const linkCx = rect.left + rect.width / 2;
      const linkCy = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - linkCx, e.clientY - linkCy);
      if (dist < 40) {
        targetRef.current = {
          x: targetRef.current.x + (linkCx - targetRef.current.x) * 0.3,
          y: targetRef.current.y + (linkCy - targetRef.current.y) * 0.3,
        };
      }
    } else {
      setState("default");
      setLabel("");
    }
  }, []);

  // RAF loop for smooth following
  useEffect(() => {
    if (isTouch) return;

    const lerp = 0.15;

    const tick = () => {
      posRef.current.x += (targetRef.current.x - posRef.current.x) * lerp;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * lerp;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${posRef.current.x - dotRef.current.offsetWidth / 2}px, ${posRef.current.y - dotRef.current.offsetHeight / 2}px)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isTouch, handleMouseMove]);

  if (isTouch) return null;

  return (
    <div
      ref={dotRef}
      className="cursor-dot font-mono"
      data-state={state}
      style={{
        fontSize: state === "label" ? "var(--text-meta)" : undefined,
        letterSpacing: state === "label" ? "var(--tracking-label)" : undefined,
        textTransform: state === "label" ? "uppercase" : undefined,
        color: state === "label" ? "var(--ink-secondary)" : undefined,
      }}
    >
      {state === "label" && label}
    </div>
  );
}
