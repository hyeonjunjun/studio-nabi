"use client";

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS, type Project } from "@/constants/projects";

const ease = [0.16, 1, 0.3, 1] as const;

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

export default function ListView() {
  const router = useRouter();
  const needsScroll = PROJECTS.length > 8;
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const hasMedia = (project: Project) =>
    project.cardVideo || (project.cardVideos && project.cardVideos.length > 0) || project.image;

  return (
    <motion.div
      ref={containerRef}
      className="flex flex-col justify-center h-full relative"
      style={{
        padding: "10vh var(--page-px)",
        overflowY: needsScroll ? "auto" : "hidden",
        scrollbarWidth: "none",
      }}
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      onMouseMove={handleMouseMove}
    >
      {PROJECTS.map((project, i) => (
        <motion.button
          key={project.id}
          onClick={() => !project.wip && router.push(`/work/${project.id}`)}
          disabled={project.wip}
          variants={fadeUp}
          className="flex items-center gutter-gap"
          style={{
            height: `clamp(4vh, ${60 / PROJECTS.length}vh, 10vh)`,
            cursor: project.wip ? "default" : "pointer",
          }}
          onMouseEnter={() => {
            if (!project.wip && hasMedia(project)) setHoveredProject(project);
          }}
          onMouseLeave={() => setHoveredProject(null)}
          aria-label={`View project: ${project.title}${project.wip ? " (work in progress)" : ""}`}
        >
          {/* Number */}
          <span
            className="font-mono uppercase italic"
            style={{
              fontSize: "11px",
              color: "var(--color-text-ghost)",
            }}
          >
            {String(i + 1).padStart(2, "0")}/
          </span>

          {/* Title */}
          <span
            className="font-mono uppercase"
            style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: project.wip
                ? "var(--color-text-ghost)"
                : "var(--color-text-dim)",
              transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <span
              style={{
                transition: "color 200ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                if (!project.wip)
                  (e.target as HTMLElement).style.color = "var(--color-text)";
              }}
              onMouseLeave={(e) => {
                if (!project.wip)
                  (e.target as HTMLElement).style.color = "var(--color-text-dim)";
              }}
            >
              {project.title}
            </span>
            {project.wip && (
              <span style={{ opacity: 0.4, marginLeft: 8 }}>(WIP)</span>
            )}
          </span>
        </motion.button>
      ))}

      {/* Floating hover preview */}
      <AnimatePresence>
        {hoveredProject && (
          <motion.div
            key={hoveredProject.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease }}
            className="pointer-events-none fixed z-50 overflow-hidden"
            style={{
              left: mousePos.x + 20,
              top: mousePos.y - 120,
              width: "clamp(240px, 20vw, 360px)",
              aspectRatio: "4/3",
            }}
          >
            {hoveredProject.cardVideo ? (
              <video
                src={hoveredProject.cardVideo}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={hoveredProject.image}
                alt={hoveredProject.title}
                fill
                className="object-cover"
                sizes="20vw"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
