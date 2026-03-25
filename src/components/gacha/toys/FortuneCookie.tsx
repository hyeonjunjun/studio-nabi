"use client";
import { useState, useRef } from "react";
import { gsap } from "@/lib/gsap";
import type { ToyProps } from "./index";

const MESSAGES = [
  "You will ship something beautiful this year.",
  "The best interfaces feel like nothing at all.",
  "Seoul at 3am has the best ideas.",
  "Good taste is the enemy of done.",
  "The pixel you agonize over — nobody notices. Ship it.",
  "Your next project will surprise even you.",
  "Craft is care made visible.",
  "Sometimes the best design is the one you delete.",
];

export default function FortuneCookie({ reducedMotion }: ToyProps) {
  const [cracked, setCracked] = useState(false);
  const [message] = useState(() => MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  const crack = () => {
    if (cracked) return;
    setCracked(true);

    if (!reducedMotion) {
      const tl = gsap.timeline();
      tl.to(leftRef.current, { x: -20, rotation: -15, opacity: 0.6, duration: 0.4, ease: "power2.out" }, 0);
      tl.to(rightRef.current, { x: 20, rotation: 15, opacity: 0.6, duration: 0.4, ease: "power2.out" }, 0);
      tl.fromTo(stripRef.current, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.5, ease: "power2.out" }, 0.2);
    }
  };

  return (
    <div
      onClick={crack}
      style={{
        width: 120,
        height: 110,
        position: "relative",
        cursor: cracked ? "default" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
      }}
    >
      {/* Left half */}
      <div
        ref={leftRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-100%, -50%)",
          width: 45,
          height: 32,
          borderRadius: "50% 0 0 50%",
          background: "linear-gradient(135deg, #e8c97a 0%, #c9a44e 50%, #b8933d 100%)",
          boxShadow: "inset -2px 0 4px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)",
        }}
      />
      {/* Right half */}
      <div
        ref={rightRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(0, -50%)",
          width: 45,
          height: 32,
          borderRadius: "0 50% 50% 0",
          background: "linear-gradient(225deg, #e8c97a 0%, #c9a44e 50%, #b8933d 100%)",
          boxShadow: "inset 2px 0 4px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)",
        }}
      />
      {/* Paper strip */}
      <div
        ref={stripRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%) rotate(-2deg)",
          width: 100,
          padding: "6px 8px",
          background: "var(--paper, #f7f6f3)",
          borderRadius: 2,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          opacity: cracked && reducedMotion ? 1 : cracked ? undefined : 0,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 8,
            lineHeight: 1.4,
            color: "var(--ink-primary, rgba(35,32,28,0.82))",
          }}
        >
          {message}
        </span>
      </div>
      {/* Hint */}
      {!cracked && (
        <span
          style={{
            position: "absolute",
            bottom: 4,
            fontFamily: "var(--font-mono)",
            fontSize: 7,
            color: "var(--ink-muted, rgba(35,32,28,0.35))",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          tap to crack
        </span>
      )}
    </div>
  );
}
