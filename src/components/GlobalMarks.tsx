"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Global Registration Marks
 * ─────────────────────────
 * An absolute SVG overlay providing millimeter-grid and hardware registration
 * marks to complete the "Technical Manual" aesthetic.
 */
export default function GlobalMarks() {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[40]">
       {/* High-frequency faint grid */}
       <div 
         className="absolute inset-0 opacity-[0.02] mix-blend-difference"
         style={{
           backgroundImage: "linear-gradient(to right, var(--color-text) 1px, transparent 1px), linear-gradient(to bottom, var(--color-text) 1px, transparent 1px)",
           backgroundSize: "24px 24px"
         }}
       />

       {/* Crosshairs & Registration logic */}
       <svg className="absolute inset-0 w-full h-full opacity-20 mix-blend-difference" xmlns="http://www.w3.org/2000/svg">
         {/* Top Left Registration Mark */}
         <g transform="translate(48, 48)">
           <circle cx="0" cy="0" r="12" fill="none" stroke="currentColor" strokeWidth="1" />
           <line x1="-20" y1="0" x2="20" y2="0" stroke="currentColor" strokeWidth="1" />
           <line x1="0" y1="-20" x2="0" y2="20" stroke="currentColor" strokeWidth="1" />
         </g>
         {/* Top Right Registration Mark */}
         <g transform="translate(calc(100vw - 48px), 48)">
           <circle cx="0" cy="0" r="12" fill="none" stroke="currentColor" strokeWidth="1" />
           <line x1="-20" y1="0" x2="20" y2="0" stroke="currentColor" strokeWidth="1" />
           <line x1="0" y1="-20" x2="0" y2="20" stroke="currentColor" strokeWidth="1" />
         </g>
         {/* Bottom Left Registration Mark */}
         <g transform="translate(48, calc(100vh - 48px))">
           <circle cx="0" cy="0" r="12" fill="none" stroke="currentColor" strokeWidth="1" />
           <line x1="-20" y1="0" x2="20" y2="0" stroke="currentColor" strokeWidth="1" />
           <line x1="0" y1="-20" x2="0" y2="20" stroke="currentColor" strokeWidth="1" />
         </g>
         {/* Bottom Right Registration Mark */}
         <g transform="translate(calc(100vw - 48px), calc(100vh - 48px))">
           <circle cx="0" cy="0" r="12" fill="none" stroke="currentColor" strokeWidth="1" />
           <line x1="-20" y1="0" x2="20" y2="0" stroke="currentColor" strokeWidth="1" />
           <line x1="0" y1="-20" x2="0" y2="20" stroke="currentColor" strokeWidth="1" />
         </g>
       </svg>
    </div>
  );
}
