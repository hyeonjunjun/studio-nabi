"use client";

import { useState, useEffect } from "react";
import { getNYCTime } from "@/lib/timemode";

export default function NYCClock() {
  const [time, setTime] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => setTime(getNYCTime().formatted);
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <span
      className="font-mono nyc-clock"
      style={{
        fontSize: "var(--text-meta)",
        letterSpacing: "var(--tracking-label)",
        color: "var(--ink-muted)",
        whiteSpace: "nowrap",
      }}
    >
      {time}
    </span>
  );
}
