"use client";
import { useState, useCallback } from "react";
import type { ToyProps } from "./index";

const NOTES = [
  { freq: 261.63, color: "#c47d5e" }, // C4 - terracotta
  { freq: 293.66, color: "#c9a96e" }, // D4 - warm gold
  { freq: 329.63, color: "#8b9b7b" }, // E4 - sage
  { freq: 349.23, color: "#7ba3b8" }, // F4 - slate blue
  { freq: 392.0, color: "#b87b7b" },  // G4 - dusty rose
  { freq: 440.0, color: "#6b5b7b" },  // A4 - dusty purple
  { freq: 493.88, color: "#d4b84d" }, // B4 - yellow gold
  { freq: 523.25, color: "#8b8b8b" }, // C5 - warm gray
];

export default function TinyPiano({ audio, reducedMotion }: ToyProps) {
  const [activeKey, setActiveKey] = useState<number | null>(null);

  const playKey = useCallback((index: number) => {
    audio.playNote(NOTES[index].freq);
    setActiveKey(index);
    setTimeout(() => setActiveKey(null), 200);
  }, [audio]);

  return (
    <div
      style={{
        width: 120,
        height: 80,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      {/* Piano body */}
      <div
        style={{
          width: 116,
          padding: "8px 4px 4px",
          borderRadius: 6,
          background: "linear-gradient(180deg, #4a3a2a 0%, #3a2a1a 100%)",
          boxShadow: "0 3px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        {/* Keys row */}
        <div style={{ display: "flex", gap: 2 }}>
          {NOTES.map((note, i) => {
            const pressed = activeKey === i;
            return (
              <button
                key={i}
                onPointerDown={() => playKey(i)}
                style={{
                  width: 12,
                  height: 40,
                  borderRadius: "0 0 3px 3px",
                  border: "none",
                  cursor: "pointer",
                  background: pressed
                    ? note.color
                    : `linear-gradient(180deg, #f5f0e8 0%, #e8e0d4 100%)`,
                  boxShadow: pressed
                    ? "inset 0 2px 4px rgba(0,0,0,0.2)"
                    : "0 2px 3px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
                  transform: pressed ? "translateY(1px)" : "none",
                  transition: reducedMotion ? "none" : "all 80ms ease-out",
                  flexShrink: 0,
                }}
                aria-label={`Piano key ${i + 1}`}
              />
            );
          })}
        </div>
      </div>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 7,
          color: "var(--ink-muted, rgba(35,32,28,0.35))",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        tap to play
      </span>
    </div>
  );
}
