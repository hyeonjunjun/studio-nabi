"use client";

import Image from "next/image";
import { NOW_PLAYING } from "@/constants/now-playing";

export default function NowPlaying() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        maxWidth: 200,
        overflow: "hidden",
      }}
    >
      {/* Album art */}
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 4,
          overflow: "hidden",
          flexShrink: 0,
          backgroundColor: "var(--ink-ghost)",
          position: "relative",
        }}
      >
        {NOW_PLAYING.art && (
          <Image
            src={NOW_PLAYING.art}
            alt={`${NOW_PLAYING.album} album art`}
            width={24}
            height={24}
            style={{ objectFit: "cover" }}
          />
        )}
      </div>

      {/* Track info */}
      <span
        className="font-mono"
        style={{
          fontSize: "var(--text-meta)",
          letterSpacing: "var(--tracking-label)",
          color: "var(--ink-muted)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {NOW_PLAYING.title} — {NOW_PLAYING.artist}
      </span>

      {/* Animated EQ bars */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 1.5,
          height: 12,
          flexShrink: 0,
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="eq-bar"
            style={{
              width: 2,
              backgroundColor: "var(--ink-muted)",
              borderRadius: 1,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
