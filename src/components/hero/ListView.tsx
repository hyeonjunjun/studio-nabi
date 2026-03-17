"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PROJECTS } from "@/constants/projects";

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

  return (
    <motion.div
      className="flex flex-col justify-center h-full"
      style={{
        padding: "10vh var(--page-px)",
        overflowY: needsScroll ? "auto" : "hidden",
        scrollbarWidth: "none",
      }}
      variants={staggerContainer}
      initial="hidden"
      animate="show"
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
    </motion.div>
  );
}
