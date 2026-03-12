"use client";

import { useEffect, useState } from "react";

/**
 * LiveMetricsTicker
 * ─────────────────
 * Simulates real-time system metrics to reinforce the "Engineering" aspect
 * of the portfolio. Adds a layer of technical tactility.
 */
export default function LiveMetricsTicker() {
  const [fps, setFps] = useState(60);
  const [memory, setMemory] = useState(12);
  const [renderTime, setRenderTime] = useState(1.2);

  useEffect(() => {
    const t = setInterval(() => {
       setFps(Math.floor(Math.random() * (60 - 58 + 1) + 58)); // 58-60 FPS
       setMemory(Math.floor(Math.random() * (24 - 16 + 1) + 16)); // 16-24 MB
       setRenderTime(+(Math.random() * (1.8 - 0.8) + 0.8).toFixed(1)); // 0.8-1.8ms
    }, 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full border border-[var(--color-border)] bg-[var(--color-surface)] mt-12 overflow-hidden flex flex-col md:flex-row md:items-center justify-between pointer-events-none">
       <div className="flex items-center gap-3 px-6 py-4 border-b md:border-b-0 md:border-r border-[var(--color-border)]">
         <span className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-pulse" />
         <span className="font-mono text-[10px] tracking-widest text-[var(--color-text)] uppercase">Live Telemetry</span>
       </div>
       <div className="flex items-center gap-6 px-6 py-4 font-mono text-[10px] tracking-widest uppercase">
         <span className="flex gap-2 w-16">
           <span className="text-[var(--color-text-dim)]">FPS:</span> 
           <span className="text-[var(--color-gold)]">{fps}</span>
         </span>
         <span className="flex gap-2 w-20">
           <span className="text-[var(--color-text-dim)]">MEM:</span> 
           <span className="text-[var(--color-text)]">{memory}MB</span>
         </span>
         <span className="flex gap-2 w-20">
           <span className="text-[var(--color-text-dim)]">RND:</span> 
           <span className="text-[var(--color-text)]">{renderTime}ms</span>
         </span>
       </div>
    </div>
  );
}
