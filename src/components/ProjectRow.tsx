"use client";

import { motion } from "framer-motion";
import type { Project } from "@/constants/projects";

interface ProjectRowProps {
  project: Project;
  index: number;
  isActive: boolean;
  onClick: (id: string) => void;
}

export default function ProjectRow({
  project,
  index,
  isActive,
  onClick,
}: ProjectRowProps) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.button
      data-project-row={project.id}
      data-cursor="project"
      onClick={() => onClick(project.id)}
      className="project-card group w-full text-left relative"
      style={{
        display: "grid",
        gridTemplateColumns: "2.5rem 1fr auto auto",
        alignItems: "baseline",
        gap: "clamp(1rem, 2vw, 2rem)",
        padding: "clamp(1.25rem, 2.5vh, 2rem) var(--page-px)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {/* Active / hover accent bar */}
      <span
        className="absolute left-0 top-0 bottom-0 transition-all duration-300"
        style={{
          width: 2,
          backgroundColor: "var(--color-accent)",
          opacity: isActive ? 1 : 0,
          transform: isActive ? "scaleY(1)" : "scaleY(0)",
          transformOrigin: "top",
        }}
      />

      {/* Col 1: Number */}
      <span
        className="font-mono transition-colors duration-300"
        style={{
          fontSize: "var(--text-micro)",
          letterSpacing: "0.1em",
          color: isActive ? "var(--color-accent)" : "var(--color-text-ghost)",
        }}
      >
        {num}
      </span>

      {/* Col 2: Title */}
      <span
        className="font-sans font-medium uppercase truncate group-hover:translate-x-1 transition-transform duration-300"
        style={{
          fontSize: "var(--text-lg)",
          letterSpacing: "0.02em",
          color: "var(--color-text)",
          lineHeight: 1.2,
        }}
      >
        {project.title}
      </span>

      {/* Col 3: Sector */}
      <span
        className="font-mono hidden md:block"
        style={{
          fontSize: "var(--text-micro)",
          letterSpacing: "0.1em",
          color: "var(--color-text-secondary)",
          textAlign: "right",
        }}
      >
        {project.sector}
      </span>

      {/* Col 4: Year */}
      <span
        className="font-mono"
        style={{
          fontSize: "var(--text-micro)",
          letterSpacing: "0.1em",
          color: "var(--color-text-ghost)",
          textAlign: "right",
        }}
      >
        {project.year}
      </span>
    </motion.button>
  );
}
