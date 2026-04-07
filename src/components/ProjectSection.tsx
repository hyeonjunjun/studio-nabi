"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import GeometricFrame from "./GeometricFrame";
import type { Piece } from "@/constants/pieces";

interface ProjectSectionProps {
  piece: Piece;
  index: number;
}

const spring = { type: "spring" as const, stiffness: 120, damping: 20, mass: 0.8 };

export default function ProjectSection({ piece, index }: ProjectSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const isEven = index % 2 === 1;
  const detailPath =
    piece.type === "project"
      ? `/index/${piece.slug}`
      : `/archive/${piece.slug}`;
  const accentGradient = piece.type === "project" ? "warm" : "cool";

  return (
    <section
      ref={ref}
      style={{ padding: `0 clamp(24px,6vw,48px)`, minHeight: "60vh" }}
      className={`flex items-center gap-12 ${
        isEven ? "flex-row-reverse" : "flex-row"
      } max-md:flex-col max-md:gap-8`}
    >
      {/* Media side */}
      <div className="w-[60%] max-md:w-full">
        <Link href={detailPath} data-cursor="media">
          <GeometricFrame
            layoutId={`frame-${piece.slug}`}
            accentGradient={accentGradient}
          >
            {piece.video ? (
              <motion.video
                autoPlay
                muted
                loop
                playsInline
                className="aspect-[16/10] w-full object-cover"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 }}
              >
                <source src={piece.video} />
              </motion.video>
            ) : piece.image ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 }}
              >
                <Image
                  src={piece.image}
                  alt={piece.title}
                  width={1600}
                  height={1000}
                  sizes="60vw"
                  priority={index === 0}
                  className="aspect-[16/10] w-full object-cover"
                />
              </motion.div>
            ) : (
              <motion.div
                className="aspect-[16/10] flex items-center justify-center"
                style={{ background: piece.cover.bg, color: piece.cover.text }}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 }}
              >
                <span className="font-mono text-[10px] uppercase tracking-widest">
                  In progress
                </span>
              </motion.div>
            )}
          </GeometricFrame>
        </Link>
      </div>

      {/* Text side */}
      <div className="w-[40%] max-md:w-full">
        {/* Thin line that draws */}
        <motion.div
          className="h-px w-full mb-4"
          style={{ transformOrigin: isEven ? "right" : "left", background: "var(--fg-4)" }}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ ...spring, delay: 0.5 }}
        />

        {/* Title */}
        <Link href={detailPath}>
          <motion.h2
            className="font-display mb-2"
            style={{ fontSize: "clamp(22px,3vw,32px)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...spring, delay: 0.6 }}
          >
            {piece.title}
          </motion.h2>
        </Link>

        {/* Description */}
        <motion.p
          className="mb-3"
          style={{ fontSize: "13px", color: "var(--fg-2)" }}
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.7 }}
        >
          {piece.description}
        </motion.p>

        {/* Meta */}
        <motion.div
          className="font-mono uppercase tracking-widest"
          style={{ fontSize: "10px", color: "var(--fg-3)" }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ ...spring, delay: 0.8 }}
        >
          {piece.year} — {piece.tags.slice(0, 2).join(" / ")}
        </motion.div>
      </div>
    </section>
  );
}
