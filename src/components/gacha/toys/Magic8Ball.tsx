"use client";
import { useState, useRef } from "react";
import { gsap } from "@/lib/gsap";
import type { ToyProps } from "./index";

const ANSWERS = [
  "Yes", "No", "Ask again", "Definitely", "Doubtful",
  "Most likely", "My reply is no", "Signs point to yes",
  "Better not tell you now", "Without a doubt",
  "Cannot predict now", "Yes, in due time",
  "Don't count on it", "Concentrate and ask again",
  "Reply hazy, try again",
];

export default function Magic8Ball({ reducedMotion }: ToyProps) {
  const [answer, setAnswer] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const ballRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const shake = () => {
    if (shaking) return;
    setShaking(true);
    setAnswer(null);

    if (!reducedMotion && ballRef.current) {
      gsap.to(ballRef.current, {
        x: "random(-4, 4)",
        y: "random(-4, 4)",
        rotation: "random(-5, 5)",
        duration: 0.08,
        repeat: 8,
        yoyo: true,
        ease: "none",
        onComplete: () => {
          gsap.set(ballRef.current, { x: 0, y: 0, rotation: 0 });
          reveal();
        },
      });
    } else {
      setTimeout(reveal, 100);
    }

    function reveal() {
      const next = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
      setAnswer(next);
      setShaking(false);
      if (!reducedMotion && windowRef.current) {
        gsap.fromTo(windowRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" });
      }
    }
  };

  return (
    <div
      ref={ballRef}
      onClick={shake}
      style={{
        width: 110,
        height: 110,
        borderRadius: "50%",
        background: "radial-gradient(circle at 35% 30%, #3a3a3a 0%, #1a1a1a 60%, #0a0a0a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
        userSelect: "none",
        position: "relative",
      }}
    >
      {/* Blue triangle window */}
      <div
        ref={windowRef}
        style={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          background: "radial-gradient(circle, #1a3a6a 0%, #0d1f3c 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 6,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 9,
            color: "rgba(255,255,255,0.9)",
            lineHeight: 1.2,
          }}
        >
          {answer ?? (shaking ? "..." : "Shake me")}
        </span>
      </div>
      {/* Subtle "8" */}
      <span
        style={{
          position: "absolute",
          bottom: 14,
          fontFamily: "var(--font-display)",
          fontSize: 18,
          fontWeight: 700,
          color: "rgba(255,255,255,0.08)",
        }}
      >
        8
      </span>
    </div>
  );
}
