"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { useTheaterStore } from "@/store/useTheaterStore";
import { PIECES, type PieceType } from "@/constants/pieces";
import CDCase from "./CDCase";
import Receipt from "./Receipt";
import * as THREE from "three";

interface CarouselProps {
  type: PieceType;
}

export default function ProjectCarousel({ type }: CarouselProps) {
  const items = PIECES.filter((p) => p.type === type).sort(
    (a, b) => a.order - b.order
  );

  const selectedSlug = useTheaterStore((s) => s.selectedSlug);
  const setSelectedSlug = useTheaterStore((s) => s.setSelectedSlug);
  const expandDetail = useTheaterStore((s) => s.expandDetail);

  // Find active index
  const activeIndex = Math.max(
    0,
    items.findIndex((p) => p.slug === selectedSlug)
  );

  // Ensure slug is valid for this type
  useEffect(() => {
    if (!items.find((p) => p.slug === selectedSlug) && items.length > 0) {
      setSelectedSlug(items[0].slug);
    }
  }, [items, selectedSlug, setSelectedSlug]);

  const navigate = useCallback(
    (direction: number) => {
      const newIndex = Math.max(0, Math.min(items.length - 1, activeIndex + direction));
      setSelectedSlug(items[newIndex].slug);
    },
    [activeIndex, items, setSelectedSlug]
  );

  // Scroll to navigate
  const lastScroll = useRef(0);
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastScroll.current < 400) return; // debounce
      lastScroll.current = now;
      if (e.deltaY > 20) navigate(1);
      else if (e.deltaY < -20) navigate(-1);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [navigate]);

  // Keyboard to navigate
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") navigate(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") navigate(-1);
      if (e.key === "Enter") expandDetail();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, expandDetail]);

  const active = items[activeIndex];

  return (
    <motion.div
      className="relative w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 3D Carousel — items positioned horizontally */}
      <div
        className="absolute"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 160, // leave room for receipt below
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="relative"
          style={{
            width: "100%",
            height: "100%",
            maxHeight: 400,
          }}
        >
          {items.map((piece, i) => {
            const offset = i - activeIndex;
            const absOffset = Math.abs(offset);
            const scale = Math.max(0.4, 1 - absOffset * 0.2);
            const opacity = Math.max(0.15, 1 - absOffset * 0.35);
            const x = offset * 220; // horizontal spacing
            const z = -absOffset * 50; // depth

            return (
              <motion.div
                key={piece.slug}
                className="absolute"
                style={{
                  left: "50%",
                  top: "50%",
                  width: 200,
                  height: 200,
                  cursor: offset === 0 ? "grab" : "pointer",
                }}
                animate={{
                  x: x - 100,
                  y: -100,
                  scale,
                  opacity,
                  zIndex: 10 - absOffset,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                onClick={() => {
                  if (offset !== 0) setSelectedSlug(piece.slug);
                }}
              >
                <Canvas
                  camera={{ position: [0, 0, 4], fov: 40 }}
                  style={{ background: "transparent" }}
                  gl={{ antialias: true, alpha: true }}
                  dpr={[1, offset === 0 ? 2 : 1]}
                  frameloop={absOffset <= 1 ? "always" : "demand"}
                >
                  <ambientLight intensity={0.6} />
                  <directionalLight
                    position={[3, 4, 5]}
                    intensity={1.2}
                    color="#fff8f0"
                  />
                  <directionalLight
                    position={[-3, 0, 3]}
                    intensity={0.4}
                    color="#f0ebe0"
                  />
                  {offset === 0 && (
                    <ContactShadows
                      position={[0, -1.1, 0]}
                      opacity={0.1}
                      blur={3}
                      far={4}
                      color="#8a8070"
                    />
                  )}
                  <CDCase piece={piece} dragRef={{ current: { isDragging: false, velocityX: 0, velocityY: 0 } }} />
                </Canvas>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Hover zones for navigation */}
      <div
        className="absolute z-20"
        style={{
          left: 0,
          top: 0,
          width: "15%",
          bottom: 160,
          cursor: activeIndex > 0 ? "w-resize" : "default",
        }}
        onClick={() => navigate(-1)}
      />
      <div
        className="absolute z-20"
        style={{
          right: 0,
          top: 0,
          width: "15%",
          bottom: 160,
          cursor: activeIndex < items.length - 1 ? "e-resize" : "default",
        }}
        onClick={() => navigate(1)}
      />

      {/* Receipt — centered below the carousel */}
      <div
        className="absolute flex justify-center"
        style={{
          left: 0,
          right: 0,
          bottom: 0,
          height: 160,
          paddingBottom: 16,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active?.slug}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
          >
            {active && <Receipt piece={active} onView={expandDetail} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
