"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

interface Props {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  aspectRatio?: string;
}

/**
 * BeforeAfterSlider
 * ─────────────────
 * Interactive product documentation tool allowing users to drag horizontally
 * to compare Wireframe/Final or V1/V2 states.
 */
export default function BeforeAfterSlider({ 
  beforeImage, 
  afterImage, 
  beforeLabel = "WIREFRAME", 
  afterLabel = "FINAL BUILD",
  aspectRatio = "16/10" 
}: Props) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!containerRef.current) return;
    let clientX = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as MouseEvent).clientX;
    }
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  }, []);

  const handleEnd = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (!isDragging) return;

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  return (
    <div 
      className="relative w-full overflow-hidden select-none"
      style={{ aspectRatio, border: "1px solid var(--color-border)" }}
      ref={containerRef}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
      data-cursor="explore" // Show the open/explore cursor when hovering this area
    >
      {/* Background (After) */}
      <div className="absolute inset-0">
        <Image src={afterImage} alt="After" fill className="object-cover pointer-events-none" />
        <span className="absolute bottom-4 right-4 font-mono text-[10px] tracking-widest text-white mix-blend-difference drop-shadow-md">
           {afterLabel}
        </span>
      </div>

      {/* Foreground Clipped (Before) */}
      <div 
        className="absolute inset-0 bg-[var(--color-surface)]"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image src={beforeImage} alt="Before" fill className="object-cover pointer-events-none opacity-80 mix-blend-luminosity" />
        <span className="absolute bottom-4 left-4 font-mono text-[10px] tracking-widest text-[var(--color-text)] drop-shadow-md pb-1 border-b border-[var(--color-text)]">
           {beforeLabel}
        </span>
      </div>

      {/* Slider Hardware Handle */}
      <div 
        className="absolute top-0 bottom-0 w-[1px] bg-[var(--color-accent)] pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-12 bg-[var(--color-accent)] flex items-center justify-center rounded-sm"
        >
          <div className="w-[1px] h-6 bg-[var(--color-bg)] mx-[1px]" />
          <div className="w-[1px] h-6 bg-[var(--color-bg)] mx-[1px]" />
        </div>
      </div>
    </div>
  );
}
