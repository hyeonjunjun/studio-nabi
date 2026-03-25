"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  Suspense,
  type CSSProperties,
} from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useGachaAudio } from "./useGachaAudio";
import { TOY_REGISTRY, TOY_IDS, type ToyProps } from "./toys";

/* ── Types ── */

type Phase = "idle" | "cranking" | "dispensing" | "revealing" | "playing";

/* ── Capsule colors for dome ── */

const DOME_CAPSULES = [
  { x: 25, y: 35, color: "#c47d5e" },
  { x: 55, y: 28, color: "#7ba3b8" },
  { x: 40, y: 55, color: "#c9a96e" },
  { x: 70, y: 48, color: "#b87b7b" },
  { x: 15, y: 58, color: "#8b9b7b" },
  { x: 60, y: 65, color: "#6b5b7b" },
  { x: 35, y: 72, color: "#d4b84d" },
  { x: 80, y: 60, color: "#9b8b6b" },
  { x: 50, y: 45, color: "#8b8b8b" },
  { x: 20, y: 45, color: "#c47d5e" },
];

/* ── Helpers ── */

function readCollection(): string[] {
  try {
    return JSON.parse(localStorage.getItem("gacha-collection") || "[]");
  } catch {
    return [];
  }
}

function writeCollection(ids: string[]) {
  try {
    localStorage.setItem("gacha-collection", JSON.stringify(ids));
  } catch {
    // localStorage unavailable
  }
}

/* ── Main Component ── */

interface GachaMachineProps {
  className?: string;
  style?: CSSProperties;
}

export default function GachaMachine({ className, style }: GachaMachineProps) {
  const reducedMotion = useReducedMotion();
  const audio = useGachaAudio(reducedMotion);

  const [phase, setPhase] = useState<Phase>("idle");
  const [currentToyId, setCurrentToyId] = useState<string | null>(null);
  const [collectedToys, setCollectedToys] = useState<string[]>(() => readCollection());
  const [replayToyId, setReplayToyId] = useState<string | null>(null);

  const dialRef = useRef<HTMLDivElement>(null);
  const capsuleRef = useRef<HTMLDivElement>(null);
  const toyAreaRef = useRef<HTMLDivElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);

  // Persist collection
  useEffect(() => {
    writeCollection(collectedToys);
  }, [collectedToys]);

  /* ── Pick a random toy ── */
  const pickToy = useCallback(() => {
    const uncollected = TOY_IDS.filter((id) => !collectedToys.includes(id));
    const pool = uncollected.length > 0 ? uncollected : TOY_IDS;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [collectedToys]);

  /* ── Crank handler ── */
  const handleCrank = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("cranking");
    setReplayToyId(null);

    const toyId = pickToy();
    const capsuleColor = TOY_REGISTRY[toyId]?.color || "#999";

    // Animate crank
    if (!reducedMotion && dialRef.current) {
      gsap.to(dialRef.current, {
        rotation: "+=360",
        duration: 0.7,
        ease: "power2.inOut",
        onUpdate: function () {
          const progress = this.progress();
          if (progress > 0.2 && progress < 0.25) audio.playRatchet();
          if (progress > 0.45 && progress < 0.5) audio.playRatchet();
          if (progress > 0.7 && progress < 0.75) audio.playRatchet();
        },
        onComplete: () => {
          setPhase("dispensing");
          setCurrentToyId(toyId);

          // Dispense animation
          setTimeout(() => {
            audio.playThunk();
            if (!reducedMotion && capsuleRef.current) {
              gsap.fromTo(
                capsuleRef.current,
                { y: -60, opacity: 0, scale: 0.8 },
                {
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  duration: 0.5,
                  ease: "bounce.out",
                  onComplete: () => setPhase("revealing"),
                },
              );
            } else {
              setPhase("revealing");
            }
          }, 200);
        },
      });
    } else {
      // No animation path
      setCurrentToyId(toyId);
      setPhase("revealing");
    }
  }, [phase, pickToy, reducedMotion, audio]);

  /* ── Open capsule ── */
  const handleOpenCapsule = useCallback(() => {
    if (phase !== "revealing" || !currentToyId) return;
    audio.playCrack();

    if (!reducedMotion && capsuleRef.current && toyAreaRef.current) {
      const tl = gsap.timeline();
      // Capsule shakes then disappears
      tl.to(capsuleRef.current, {
        x: "random(-3, 3)",
        rotation: "random(-8, 8)",
        duration: 0.06,
        repeat: 5,
        yoyo: true,
        ease: "none",
      });
      tl.to(capsuleRef.current, {
        scale: 1.2,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      });
      tl.fromTo(
        toyAreaRef.current,
        { scale: 0.5, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(2)",
          onComplete: () => {
            setPhase("playing");
            setCollectedToys((prev) =>
              prev.includes(currentToyId) ? prev : [...prev, currentToyId],
            );
          },
        },
      );
    } else {
      setPhase("playing");
      setCollectedToys((prev) =>
        prev.includes(currentToyId) ? prev : [...prev, currentToyId],
      );
    }
  }, [phase, currentToyId, reducedMotion, audio]);

  /* ── Reset to idle ── */
  const handleReset = useCallback(() => {
    setPhase("idle");
    setCurrentToyId(null);
    setReplayToyId(null);
    if (dialRef.current) gsap.set(dialRef.current, { rotation: 0 });
  }, []);

  /* ── Replay from collection ── */
  const handleReplay = useCallback((toyId: string) => {
    setReplayToyId(toyId);
    setCurrentToyId(null);
    setPhase("idle");
  }, []);

  /* ── Determine active toy ── */
  const activeToyId = phase === "playing" ? currentToyId : replayToyId;
  const ActiveToy = activeToyId ? TOY_REGISTRY[activeToyId]?.component : null;
  const activeCapsuleColor = currentToyId
    ? TOY_REGISTRY[currentToyId]?.color || "#999"
    : "#999";

  const toyProps: ToyProps = {
    audio: { playNote: audio.playNote, playSqueak: audio.playSqueak },
    reducedMotion,
  };

  return (
    <div
      ref={machineRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--paper)",
        position: "relative",
        overflow: "hidden",
        gap: 8,
        ...style,
      }}
      role="application"
      aria-label="Gacha capsule toy machine. Turn the crank to collect interactive toys."
    >
      {/* ── Machine ── */}
      <div
        style={{
          position: "relative",
          width: "clamp(220px, 35%, 280px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* ── Dome ── */}
        <div
          style={{
            width: "80%",
            aspectRatio: "1 / 0.85",
            borderRadius: "50% 50% 12% 12%",
            background:
              "radial-gradient(circle at 40% 35%, rgba(220, 230, 240, 0.5) 0%, rgba(180, 195, 210, 0.25) 50%, rgba(150, 170, 190, 0.15) 100%)",
            border: "2px solid rgba(180, 190, 200, 0.4)",
            position: "relative",
            overflow: "hidden",
            boxShadow:
              "inset 0 -12px 24px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          {/* Capsules inside dome */}
          {DOME_CAPSULES.map((c, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${c.x}%`,
                top: `${c.y}%`,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: `radial-gradient(circle at 35% 30%, ${c.color}cc, ${c.color})`,
                boxShadow: `inset 0 -2px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1)`,
                animation:
                  reducedMotion
                    ? "none"
                    : `gacha-jiggle 2s ease-in-out ${i * 0.2}s infinite alternate`,
              }}
            />
          ))}
          {/* Glass highlight */}
          <div
            style={{
              position: "absolute",
              top: "12%",
              left: "18%",
              width: "35%",
              height: "15%",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.3)",
              transform: "rotate(-20deg)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* ── Machine Body ── */}
        <div
          style={{
            width: "100%",
            padding: "12px 16px 16px",
            borderRadius: "4px 4px 12px 12px",
            background:
              "linear-gradient(180deg, #c4b8a8 0%, #b8ac9c 30%, #a89c8c 100%)",
            backgroundImage: `
              linear-gradient(180deg, #c4b8a8 0%, #b8ac9c 30%, #a89c8c 100%),
              repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px)
            `,
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 16px rgba(0,0,0,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            marginTop: -2,
          }}
        >
          {/* Left side: coin slot + label */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            {/* Coin slot */}
            <div
              style={{
                width: 24,
                height: 4,
                borderRadius: 2,
                background: "#5a5040",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.4)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 7,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "rgba(60, 50, 40, 0.5)",
              }}
            >
              {phase === "idle" ? "Turn to play" : phase === "revealing" ? "Tap capsule" : phase === "playing" ? "Spin again?" : "..."}
            </span>
          </div>

          {/* Center: chute / capsule / toy area */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 60,
              position: "relative",
            }}
          >
            {/* Dispensed capsule */}
            {(phase === "dispensing" || phase === "revealing") && (
              <div
                ref={capsuleRef}
                onClick={handleOpenCapsule}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 35% 30%, ${activeCapsuleColor}dd, ${activeCapsuleColor})`,
                  boxShadow: `0 3px 8px rgba(0,0,0,0.2), inset 0 -2px 4px rgba(0,0,0,0.2)`,
                  cursor: phase === "revealing" ? "pointer" : "default",
                  position: "relative",
                }}
                role="button"
                aria-label="Open capsule"
                tabIndex={phase === "revealing" ? 0 : -1}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleOpenCapsule(); }}
              >
                {/* Seam line */}
                <div
                  style={{
                    position: "absolute",
                    left: "10%",
                    right: "10%",
                    top: "48%",
                    height: 2,
                    background: "rgba(0,0,0,0.15)",
                    borderRadius: 1,
                  }}
                />
              </div>
            )}

            {/* Toy display area */}
            {(phase === "playing" || replayToyId) && ActiveToy && (
              <div ref={toyAreaRef}>
                <Suspense
                  fallback={
                    <div
                      style={{
                        width: 120,
                        height: 100,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        color: "var(--ink-muted)",
                      }}
                    >
                      ...
                    </div>
                  }
                >
                  <ActiveToy {...toyProps} />
                </Suspense>
              </div>
            )}

            {/* Chute slot (idle state) */}
            {phase === "idle" && !replayToyId && (
              <div
                style={{
                  width: 40,
                  height: 20,
                  borderRadius: "0 0 8px 8px",
                  background: "#3a3028",
                  boxShadow: "inset 0 2px 6px rgba(0,0,0,0.4)",
                }}
              />
            )}
          </div>

          {/* Right side: dial/crank */}
          <div
            ref={dialRef}
            onClick={phase === "idle" ? handleCrank : phase === "playing" || replayToyId ? handleReset : undefined}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 40% 35%, #d4c8b8 0%, #a89888 60%, #8a7a6a 100%)",
              border: "3px solid #7a6a5a",
              boxShadow:
                "0 2px 6px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)",
              cursor: phase === "idle" || phase === "playing" || replayToyId ? "pointer" : "default",
              position: "relative",
              flexShrink: 0,
            }}
            role="button"
            aria-label={phase === "idle" ? "Turn crank to dispense a toy" : "Spin again"}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                if (phase === "idle") handleCrank();
                else if (phase === "playing" || replayToyId) handleReset();
              }
            }}
          >
            {/* Knob handle */}
            <div
              style={{
                position: "absolute",
                top: 2,
                left: "50%",
                transform: "translateX(-50%)",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 40% 35%, #e8d8c8 0%, #b8a898 100%)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
              }}
            />
          </div>
        </div>

        {/* ── Machine base ── */}
        <div
          style={{
            width: "106%",
            height: 8,
            borderRadius: "0 0 6px 6px",
            background:
              "linear-gradient(180deg, #8a7a6a 0%, #6a5a4a 100%)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
          }}
        />
      </div>

      {/* ── Collection Tray ── */}
      {collectedToys.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            borderRadius: 20,
            background: "rgba(35, 32, 28, 0.04)",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: "90%",
          }}
        >
          {collectedToys.map((toyId) => {
            const toy = TOY_REGISTRY[toyId];
            if (!toy) return null;
            const isActive = activeToyId === toyId;
            return (
              <button
                key={toyId}
                onClick={() => handleReplay(toyId)}
                title={toy.name}
                aria-label={`Play with ${toy.name}`}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  border: isActive
                    ? "2px solid var(--ink-primary)"
                    : "1.5px solid var(--ink-ghost)",
                  background: `radial-gradient(circle at 35% 30%, ${toy.color}cc, ${toy.color})`,
                  cursor: "pointer",
                  padding: 0,
                  transition: "transform 150ms, border-color 150ms",
                  transform: isActive ? "scale(1.15)" : "scale(1)",
                }}
              />
            );
          })}
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 7,
              color: "var(--ink-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {collectedToys.length}/{TOY_IDS.length}
          </span>
        </div>
      )}

      {/* ── Jiggle keyframes ── */}
      <style>{`
        @keyframes gacha-jiggle {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(1px, -1px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
}
