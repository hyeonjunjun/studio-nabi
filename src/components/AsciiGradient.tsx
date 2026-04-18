import React from "react";

type AsciiGradientProps = {
  direction?: "horizontal" | "vertical";
  ramp?: string;
  stops?: number;
  height?: number | string;
  width?: number | string;
  charSize?: number;
  opacity?: number;
  reverse?: boolean;
  color?: string;
  accent?: boolean;
  style?: React.CSSProperties;
  className?: string;
};

export default function AsciiGradient({
  direction = "horizontal",
  ramp = " \u00b7-:=+*\u2592\u2593\u2588",
  stops = 40,
  height,
  width,
  charSize = 12,
  opacity = 1,
  reverse = false,
  color = "var(--ink-muted)",
  accent = false,
  style,
  className,
}: AsciiGradientProps) {
  const isHorizontal = direction === "horizontal";
  const resolvedHeight = height ?? (isHorizontal ? 24 : "100%");
  const resolvedWidth = width ?? (isHorizontal ? "100%" : undefined);
  const rampLen = ramp.length;
  const lastIdx = rampLen - 1;
  const totalStops = Math.max(2, stops);

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: isHorizontal ? "row" : "column",
    alignItems: isHorizontal ? "center" : undefined,
    justifyContent: isHorizontal ? undefined : "center",
    width: resolvedWidth,
    height: resolvedHeight,
    overflow: "hidden",
    opacity,
    ...style,
  };

  const spans = [];
  for (let i = 0; i < totalStops; i++) {
    const t = i / (totalStops - 1);
    const rampT = reverse ? 1 - t : t;
    const charIndex = Math.round(rampT * lastIdx);
    const ch = ramp[charIndex];
    const isMid = accent && Math.abs(t - 0.5) < 1 / (totalStops - 1) / 2 + 1e-6;
    const spanStyle: React.CSSProperties = {
      fontFamily: "var(--font-stack-mono)",
      fontSize: charSize,
      lineHeight: 1,
      color: isMid ? "var(--accent)" : color,
      flex: 1,
      textAlign: "center",
      userSelect: "none",
    };
    spans.push(
      <span key={i} style={spanStyle} aria-hidden="true">
        {ch}
      </span>
    );
  }

  return (
    <div
      className={className}
      style={containerStyle}
      role="presentation"
      aria-hidden="true"
    >
      {spans}
    </div>
  );
}
