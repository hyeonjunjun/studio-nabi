"use client";

import { useRef, useCallback } from "react";

interface SequentialVideoProps {
  sources: string[];
  className?: string;
  style?: React.CSSProperties;
}

/**
 * SequentialVideo — Cycles through multiple video sources
 *
 * Plays each clip in order. When one ends, swaps to the next.
 * Loops back to the first clip after the last one finishes.
 */
export default function SequentialVideo({
  sources,
  className,
  style,
}: SequentialVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const indexRef = useRef(0);

  const handleEnded = useCallback(() => {
    if (!videoRef.current || sources.length <= 1) return;
    indexRef.current = (indexRef.current + 1) % sources.length;
    videoRef.current.src = sources[indexRef.current];
    videoRef.current.play();
  }, [sources]);

  return (
    <video
      ref={videoRef}
      src={sources[0]}
      muted
      autoPlay
      loop={sources.length === 1}
      playsInline
      preload="metadata"
      className={className}
      style={style}
      onEnded={sources.length > 1 ? handleEnded : undefined}
    />
  );
}
