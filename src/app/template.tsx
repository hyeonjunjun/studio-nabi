"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * Global Route Template
 * ─────────────────────
 * Wraps every page route in the App Router.
 * Masks the native Next.js hard route flash with a brutalist hardware shutter.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      {/* The Shutter Mask */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[9990] flex items-end p-6 md:p-12 pointer-events-none"
        style={{ 
          backgroundColor: "var(--color-text)",
          borderBottom: "1px solid var(--color-border)"
        }}
        initial={{ height: "100svh" }}
        animate={{ height: "0svh" }}
        exit={{ height: "100svh" }}
        transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1], delay: 0.1 }}
      >
        <motion.div 
          className="font-mono uppercase tracking-[0.2em]"
          style={{ fontSize: "10px", color: "var(--color-bg)" }}
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          [ MOUNTING MODULE ]
          <br/>
          TARGET: {pathname || "/"}
          <br/>
          STATUS: SYS.OK
        </motion.div>
      </motion.div>

      {/* The Page Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      >
        {children}
      </motion.div>
    </>
  );
}
