"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { useStudioStore } from "@/lib/store";

type Phase = "loading" | "ready" | "exit";

const MIN_DISPLAY_MS = 2000;
const TIMEOUT_MS = 4000;

export default function StudioPreloader() {
  const setLoaded = useStudioStore((s) => s.setLoaded);
  const [phase, setPhase] = useState<Phase>("loading");
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const startTime = useRef(Date.now());
  const fontsReady = useRef(false);

  // Track font loading
  useEffect(() => {
    const handleReady = () => { fontsReady.current = true; };
    document.fonts.ready.then(handleReady);
    const timeout = setTimeout(handleReady, TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, []);

  // Animate progress bar
  useEffect(() => {
    if (phase !== "loading") return;

    const tl = gsap.timeline();

    // Phase 1: Animate to ~65% quickly
    tl.to(
      { val: 0 },
      {
        val: 65,
        duration: 1.2,
        ease: "power2.out",
        onUpdate() {
          const v = Math.round(this.targets()[0].val);
          setProgress(v);
        },
      }
    );

    // Phase 2: Slow crawl to 100% — waits for fonts
    tl.to(
      { val: 65 },
      {
        val: 100,
        duration: 1.5,
        ease: "power1.inOut",
        onUpdate() {
          const v = Math.round(this.targets()[0].val);
          setProgress(v);
        },
        onComplete: () => {
          const elapsed = Date.now() - startTime.current;
          const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

          // Wait for minimum display time, then go to ready
          setTimeout(() => {
            if (fontsReady.current) {
              setPhase("ready");
            } else {
              // Fonts still loading — wait for them
              const check = setInterval(() => {
                if (fontsReady.current) {
                  clearInterval(check);
                  setPhase("ready");
                }
              }, 100);
            }
          }, remaining);
        },
      }
    );

    return () => { tl.kill(); };
  }, [phase]);

  // Ready hold → exit
  useEffect(() => {
    if (phase !== "ready") return;
    const timer = setTimeout(() => setPhase("exit"), 400);
    return () => clearTimeout(timer);
  }, [phase]);

  // Exit animation
  useEffect(() => {
    if (phase !== "exit") return;
    const el = containerRef.current;
    if (!el) return;

    gsap.to(el, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setLoaded(true);
      },
    });
  }, [phase, setLoaded]);

  // Don't render after loaded
  const isLoaded = useStudioStore((s) => s.isLoaded);
  if (isLoaded) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Studio name */}
        <span
          className="font-mono tracking-[0.3em] uppercase"
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text)",
          }}
        >
          hkj
        </span>

        {/* Progress bar */}
        <div className="relative w-48 h-[1px]" style={{ backgroundColor: "var(--color-border)" }}>
          <div
            ref={progressRef}
            className="absolute top-0 left-0 h-full transition-none"
            style={{
              width: `${progress}%`,
              backgroundColor: "var(--color-accent)",
            }}
          />
        </div>

        {/* Status text + percentage */}
        <div className="flex items-center gap-3">
          <span
            className="font-mono lowercase"
            style={{
              fontSize: "var(--text-micro)",
              letterSpacing: "0.15em",
              color: "var(--color-text-secondary)",
            }}
          >
            {phase === "ready" || phase === "exit" ? "ready" : "loading..."}
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: "var(--text-micro)",
              color: "var(--color-text-ghost)",
            }}
          >
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}
