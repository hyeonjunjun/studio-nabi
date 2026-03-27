"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { SheetItemData } from "@/constants/sheet-items";

interface SheetItemProps {
  item: SheetItemData;
  index: number;
  isFirst?: boolean;
}

export function SheetItem({ item, index, isFirst }: SheetItemProps) {
  const [hovered, setHovered] = useState(false);
  const [captionVisible, setCaptionVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (hovered) {
      timerRef.current = setTimeout(() => setCaptionVisible(true), 300);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      setCaptionVisible(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [hovered]);

  const thumbnail = (
    <motion.div
      layoutId={item.href ? `sheet-item-${item.id}` : undefined}
      style={{
        aspectRatio: "1",
        borderRadius: 6,
        overflow: "hidden",
        position: "relative",
        cursor: item.href ? "pointer" : "default",
        width: "100%",
      }}
    >
      {item.image ? (
        <Image
          src={item.image}
          alt={item.description}
          fill
          sizes="20vw"
          className="object-cover"
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: item.color ?? "#c8c2bb",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeBlend in='SourceGraphic' mode='overlay' result='blend'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* WIP badge */}
      {item.wip && (
        <div
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            background: "rgba(0,0,0,0.5)",
            color: "#fff",
            padding: "2px 5px",
            borderRadius: 2,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          In Progress
        </div>
      )}

      {/* Type tag — visible on hover */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        style={{
          position: "absolute",
          bottom: 6,
          right: 6,
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "var(--ink-muted)",
          background: "rgba(247, 246, 243, 0.85)",
          padding: "2px 5px",
          borderRadius: 2,
          pointerEvents: "none",
        }}
      >
        {item.type}
      </motion.div>
    </motion.div>
  );

  const wrappedThumbnail = item.href ? (
    <Link href={item.href} style={{ display: "block", textDecoration: "none" }}>
      {thumbnail}
    </Link>
  ) : (
    thumbnail
  );

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        whileHover={{ scale: 1.05, zIndex: 10 }}
        style={{
          boxShadow: hovered ? "0 8px 32px rgba(35, 32, 28, 0.08)" : "none",
          borderRadius: 6,
          position: "relative",
          transition: "box-shadow 200ms ease",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {wrappedThumbnail}
      </motion.div>

      {/* Caption panel */}
      <AnimatePresence>
        {captionVisible && (
          <motion.div
            key="caption"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18 }}
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              right: 0,
              zIndex: 20,
              pointerEvents: "none",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: 18,
                color: "var(--ink-full)",
                lineHeight: 1.2,
                margin: "0 0 4px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item.id.replace(/-/g, " ")}
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--ink-secondary)",
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item.description}
            </p>
            {item.href && (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--ink-muted)",
                  display: "block",
                  marginTop: 4,
                  pointerEvents: "auto",
                }}
              >
                View →
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SheetItem;
