"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface CursorStateData {
  velocity: number;
  label: string | null;
  isIdle: boolean;
  isTouch: boolean;
}

function resolveLabel(target: EventTarget | null): string | null {
  if (!(target instanceof HTMLElement)) return null;

  // Check for explicit data-cursor-label
  const labeled = target.closest("[data-cursor-label]");
  if (labeled) return (labeled as HTMLElement).dataset.cursorLabel || null;

  // Check for link / button
  if (
    target.closest("a") ||
    target.closest("button") ||
    target.closest("[role='button']")
  )
    return "Select";

  return null;
}

export function useCursorState(): CursorStateData {
  const [velocity, setVelocity] = useState(0);
  const [label, setLabel] = useState<string | null>(null);
  const [isIdle, setIsIdle] = useState(false);
  const [isTouch, setIsTouch] = useState(true); // SSR-safe default

  const lastPos = useRef({ x: 0, y: 0 });
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetIdle = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    setIsIdle(false);
    idleTimer.current = setTimeout(() => {
      setIsIdle(true);
    }, 2000);
  }, []);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (isTouch) return;

    const handlePointerOver = (e: PointerEvent) => {
      setLabel(resolveLabel(e.target));
    };

    const handlePointerMove = (e: PointerEvent) => {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      setVelocity(dist);
      lastPos.current = { x: e.clientX, y: e.clientY };
      resetIdle();
    };

    window.addEventListener("pointerover", handlePointerOver);
    window.addEventListener("pointermove", handlePointerMove);
    resetIdle();

    return () => {
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("pointermove", handlePointerMove);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [isTouch, resetIdle]);

  return { velocity, label, isIdle, isTouch };
}
