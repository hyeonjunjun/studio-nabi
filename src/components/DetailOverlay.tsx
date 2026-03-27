"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useStudioStore } from "@/lib/store";
import { SHEET_ITEMS } from "@/constants/sheet-items";

export function DetailOverlay() {
  const activeItemId = useStudioStore((s) => s.activeItemId);
  const setActiveItemId = useStudioStore((s) => s.setActiveItemId);

  const item = activeItemId ? SHEET_ITEMS.find((i) => i.id === activeItemId) : null;

  // Escape key
  useEffect(() => {
    if (!activeItemId) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveItemId(null);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [activeItemId, setActiveItemId]);

  return (
    <AnimatePresence>
      {item && (
        <>
          {/* Backdrop */}
          <motion.div
            key="overlay-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setActiveItemId(null)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: `rgba(var(--ink-rgb), 0.4)`,
              zIndex: 8000,
            }}
          />

          {/* Content panel */}
          <motion.div
            key="overlay-content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 1, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 8001,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                maxWidth: 800,
                width: "100%",
                backgroundColor: "var(--paper)",
                borderRadius: 8,
                overflow: "hidden",
                pointerEvents: "all",
                position: "relative",
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setActiveItemId(null)}
                aria-label="Close detail"
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 20,
                  color: "var(--ink-muted)",
                  lineHeight: 1,
                  zIndex: 2,
                  padding: 4,
                }}
              >
                ×
              </button>

              {/* Main image */}
              {item.image ? (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "4/3",
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 800px) 100vw, 800px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "4/3",
                    backgroundColor: item.color ?? "#888",
                  }}
                />
              )}

              {/* Text content */}
              <div style={{ padding: "24px" }}>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-mono)",
                    fontSize: 24,
                    color: "var(--ink-muted)",
                    marginBottom: 8,
                    lineHeight: 1,
                  }}
                >
                  {item.number}
                </span>

                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: "clamp(24px, 3vw, 36px)",
                    color: "var(--ink-full)",
                    fontWeight: 400,
                    margin: 0,
                    marginBottom: 12,
                    lineHeight: 1.2,
                  }}
                >
                  {item.title}
                </h2>

                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 15,
                    color: "var(--ink-secondary)",
                    margin: 0,
                    marginBottom: 16,
                    lineHeight: 1.6,
                  }}
                >
                  {item.description}
                </p>

                {/* Tags */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      textTransform: "uppercase",
                      color: "var(--ink-muted)",
                      letterSpacing: "0.06em",
                      padding: "2px 6px",
                      backgroundColor: `rgba(var(--ink-rgb), 0.05)`,
                      borderRadius: 2,
                    }}
                  >
                    {item.type}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      textTransform: "uppercase",
                      color: "var(--ink-muted)",
                      letterSpacing: "0.06em",
                      padding: "2px 6px",
                      backgroundColor: `rgba(var(--ink-rgb), 0.05)`,
                      borderRadius: 2,
                    }}
                  >
                    {item.year}
                  </span>
                  {item.wip && (
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        textTransform: "uppercase",
                        color: "var(--ink-muted)",
                        letterSpacing: "0.06em",
                        padding: "2px 6px",
                        backgroundColor: `rgba(var(--ink-rgb), 0.05)`,
                        borderRadius: 2,
                      }}
                    >
                      In Progress
                    </span>
                  )}
                </div>

                {/* Gallery */}
                {item.gallery && item.gallery.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      overflowX: "auto",
                      marginBottom: 16,
                      scrollbarWidth: "none",
                    }}
                  >
                    {item.gallery.map((src, i) => (
                      <div
                        key={i}
                        style={{
                          position: "relative",
                          width: 100,
                          height: 75,
                          flexShrink: 0,
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={src}
                          alt={`${item.title} gallery ${i + 1}`}
                          fill
                          sizes="100px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* External link */}
                {item.href && (
                  <Link
                    href={item.href}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "var(--ink-secondary)",
                      textDecoration: "none",
                      borderBottom: "1px solid var(--ink-muted)",
                      paddingBottom: 1,
                    }}
                  >
                    View Project →
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default DetailOverlay;
