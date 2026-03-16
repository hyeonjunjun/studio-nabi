"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useStudioStore } from "@/lib/store";
import { PROJECTS } from "@/constants/projects";

type ViewMode = "list" | "slider";

/* ── Easing curves ── */
const ease = [0.16, 1, 0.3, 1] as const; // expo out
const easeIn = [0.4, 0, 1, 1] as const;

/* ── Variants ── */
const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease },
  },
};

const clipReveal = {
  hidden: { clipPath: "inset(100% 0 0 0)" },
  show: {
    clipPath: "inset(0% 0 0 0)",
    transition: { duration: 1, ease },
  },
};

const viewTransition = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.3, ease: easeIn },
  },
};

/**
 * Hero — Cathydolle-style dual view with Framer Motion
 *
 * LIST:   Two columns of project names, clip-revealed images in center
 * SLIDER: Horizontal draggable full-height image gallery
 */
export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const isLoaded = useStudioStore((s) => s.isLoaded);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  return (
    <motion.section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--color-bg)" }}
      variants={staggerContainer}
      initial="hidden"
      animate={isLoaded ? "show" : "hidden"}
    >
      {/* ── Header bar ── */}
      <motion.div
        className="section-padding flex items-center gap-8"
        style={{
          paddingTop: "clamp(1.2rem, 2.5vh, 1.8rem)",
          paddingBottom: "clamp(1.2rem, 2.5vh, 1.8rem)",
        }}
        variants={fadeUp}
      >
        <a href="/" className="shrink-0">
          <span
            className="font-display uppercase"
            style={{
              fontSize: "clamp(11px, 1vw, 13px)",
              color: "var(--color-text)",
              letterSpacing: "0.08em",
            }}
          >
            HKJ
          </span>
        </a>

        {/* View toggle */}
        <div className="flex gap-3 ml-4 relative">
          {(["list", "slider"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className="font-mono uppercase relative"
              style={{
                fontSize: "11px",
                letterSpacing: "0.1em",
                color:
                  viewMode === mode
                    ? "var(--color-text)"
                    : "var(--color-text-ghost)",
                transition: "color 0.3s ease",
              }}
            >
              {mode}
              {viewMode === mode && (
                <motion.div
                  layoutId="viewIndicator"
                  className="absolute -bottom-1 left-0 right-0 h-[1px]"
                  style={{ backgroundColor: "var(--color-text)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Content ── */}
      <div id="work" className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === "list" ? (
            <motion.div
              key="list"
              variants={viewTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              className="h-full"
            >
              <ListView />
            </motion.div>
          ) : (
            <motion.div
              key="slider"
              variants={viewTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              className="h-full"
            >
              <SliderView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom contact ── */}
      <motion.div
        className="section-padding flex justify-end"
        style={{ paddingBottom: "clamp(1rem, 2vh, 1.5rem)" }}
        variants={fadeUp}
      >
        <a
          href="#contact"
          className="font-mono uppercase transition-colors duration-300 hover:text-[var(--color-text)]"
          style={{
            fontSize: "11px",
            letterSpacing: "0.1em",
            color: "var(--color-text-ghost)",
          }}
        >
          Contact
        </a>
      </motion.div>
    </motion.section>
  );
}

/* ═══════════════════════════════════════════
   LIST VIEW — Two-column names + clip-revealed images
   ═══════════════════════════════════════════ */

function ListView() {
  const router = useRouter();
  const midpoint = Math.ceil(PROJECTS.length / 2);
  const leftProjects = PROJECTS.slice(0, midpoint);
  const rightProjects = PROJECTS.slice(midpoint);
  const activeProjects = PROJECTS.filter((p) => !p.wip);

  return (
    <div className="relative h-[calc(100vh-8rem)]">
      {/* Two-column project names */}
      <div className="absolute inset-0 grid grid-cols-2 section-padding pointer-events-none z-10">
        {/* Left column */}
        <motion.div
          className="flex flex-col justify-around py-8"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {leftProjects.map((project, i) => (
            <ProjectRow
              key={project.id}
              num={String(i + 1).padStart(2, "0")}
              title={project.title}
              wip={project.wip}
              align="left"
              onClick={() => !project.wip && router.push(`/work/${project.id}`)}
            />
          ))}
        </motion.div>

        {/* Right column */}
        <motion.div
          className="flex flex-col justify-around py-8"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {rightProjects.map((project, i) => (
            <ProjectRow
              key={project.id}
              num={String(midpoint + i + 1).padStart(2, "0")}
              title={project.title}
              wip={project.wip}
              align="right"
              onClick={() => !project.wip && router.push(`/work/${project.id}`)}
            />
          ))}
        </motion.div>
      </div>

      {/* Centered stacked images — clip-path reveal */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {activeProjects.map((project) => (
          <motion.div
            key={project.id}
            variants={clipReveal}
            className="relative overflow-hidden pointer-events-auto cursor-pointer"
            style={{
              width: "clamp(280px, 30vw, 480px)",
              aspectRatio: "4/5",
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={() => router.push(`/work/${project.id}`)}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 80vw, 30vw"
              quality={90}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SLIDER VIEW — Horizontal draggable gallery
   ═══════════════════════════════════════════ */

function SliderView() {
  const router = useRouter();
  const activeProjects = PROJECTS.filter((p) => !p.wip);
  const dragX = useMotionValue(0);
  const dragXSmooth = useSpring(dragX, { stiffness: 200, damping: 30 });
  const wasDragged = useRef(false);

  return (
    <div className="h-[calc(100vh-8rem)] overflow-hidden section-padding">
      <motion.div
        className="flex h-full gap-3"
        drag="x"
        dragConstraints={{ left: -600, right: 0 }}
        dragElastic={0.15}
        style={{ x: dragXSmooth }}
        onDragStart={() => {
          wasDragged.current = false;
        }}
        onDrag={() => {
          wasDragged.current = true;
        }}
      >
        {activeProjects.map((project, i) => {
          // Parallax: each image shifts slightly based on drag
          const imgX = useTransform(dragXSmooth, (v) => v * 0.05 * (i + 1));

          return (
            <motion.div
              key={project.id}
              className="relative shrink-0 h-full overflow-hidden cursor-grab active:cursor-grabbing"
              style={{ width: "clamp(300px, 33vw, 500px)" }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ scale: 1.015 }}
              onClick={() => {
                if (!wasDragged.current) router.push(`/work/${project.id}`);
              }}
            >
              <motion.div className="relative w-full h-full" style={{ x: imgX }}>
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 80vw, 33vw"
                  quality={90}
                  draggable={false}
                />
              </motion.div>

              {/* Project label overlay */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    color: "#fff",
                    textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                  }}
                >
                  {project.title}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PROJECT ROW — Animated name entry
   ═══════════════════════════════════════════ */

function ProjectRow({
  num,
  title,
  wip,
  align,
  onClick,
}: {
  num: string;
  title: string;
  wip?: boolean;
  align: "left" | "right";
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={wip}
      variants={fadeUp}
      className="group pointer-events-auto flex items-baseline gap-4"
      style={{
        justifyContent: align === "right" ? "flex-end" : "flex-start",
        textAlign: align,
      }}
      whileHover={!wip ? { x: align === "left" ? 6 : -6 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <span
        className="font-mono italic"
        style={{
          fontSize: "11px",
          color: "var(--color-text-ghost)",
          order: align === "right" ? 1 : 0,
        }}
      >
        {num}/
      </span>
      <span
        className="font-mono uppercase"
        style={{
          fontSize: "11px",
          letterSpacing: "0.08em",
          color: wip ? "var(--color-text-ghost)" : "var(--color-text-dim)",
          transition: "color 0.3s ease",
        }}
      >
        <span className="group-hover:text-[var(--color-text)]">
          {title}
        </span>
        {wip && <span style={{ opacity: 0.4, marginLeft: 8 }}>WIP</span>}
      </span>
    </motion.button>
  );
}
