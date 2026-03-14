"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { PROJECTS } from "@/constants/projects";
import { useStudioStore } from "@/lib/store";
import { useTransitionStore } from "@/store/useTransitionStore";
import HeroBlock from "@/components/HeroBlock";

const GHOSTS = [
  { year: "2026", tagline: "in development" },
  { year: "20??", tagline: "maybe the idea will come soon" },
];

const BLOCK_CHARS = "█";
function randomBlocks(): string {
  const len = 8 + Math.floor(Math.random() * 10);
  return BLOCK_CHARS.repeat(len);
}
const GHOST_TITLES = [randomBlocks(), randomBlocks()];

export default function ProjectSelects() {
  const router = useRouter();
  const activeProject = useStudioStore((s) => s.activeProject);
  const setActiveProject = useStudioStore((s) => s.setActiveProject);
  const isPanelOpen = useStudioStore((s) => s.isPanelOpen);
  const setIsPanelOpen = useStudioStore((s) => s.setIsPanelOpen);
  const playerVisible = useStudioStore((s) => s.playerVisible);
  const setPlayerVisible = useStudioStore((s) => s.setPlayerVisible);
  const startTransition = useTransitionStore((s) => s.start);

  const handleCardClick = (id: string) => {
    if (window.innerWidth < 768) {
      startTransition(`/work/${id}`, {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
      setTimeout(() => router.push(`/work/${id}`), 100);
      return;
    }

    if (!playerVisible) setPlayerVisible(true);

    if (activeProject === id && isPanelOpen) {
      setIsPanelOpen(false);
    } else {
      setActiveProject(id);
      setIsPanelOpen(true);
    }
  };

  return (
    <div>
      <HeroBlock />

      {/* Section label */}
      <div
        style={{
          padding: "0.75rem var(--page-px)",
          borderTop: "1px solid var(--color-border-strong)",
        }}
      >
        <span
          className="font-mono uppercase tracking-[0.15em]"
          style={{
            fontSize: "var(--text-micro)",
            color: "var(--color-text-ghost)",
          }}
        >
          Selected Work ({PROJECTS.length})
        </span>
      </div>

      {/* Image gallery grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2"
        style={{
          borderTop: "1px solid var(--color-border)",
          gap: 0,
        }}
      >
        {PROJECTS.map((project, i) => (
          <SelectCard
            key={project.id}
            project={project}
            index={i}
            isActive={activeProject === project.id}
            onClick={handleCardClick}
          />
        ))}

        {/* Ghost cards */}
        {GHOSTS.map((ghost, i) => (
          <div
            key={`ghost-${i}`}
            style={{
              borderBottom: "1px solid var(--color-border)",
              borderRight: "1px solid var(--color-border)",
              padding: "var(--page-px)",
              opacity: 0.35,
            }}
          >
            <div
              className="relative overflow-hidden"
              style={{
                aspectRatio: "3 / 2",
                borderRadius: 2,
                backgroundColor: "var(--color-surface)",
                marginBottom: "1rem",
              }}
            />
            <div className="flex items-baseline justify-between">
              <span
                className="font-sans font-medium uppercase"
                style={{
                  fontSize: "var(--text-sm)",
                  letterSpacing: "0.04em",
                  color: "var(--color-text-ghost)",
                }}
              >
                {GHOST_TITLES[i]}
              </span>
              <span
                className="font-mono"
                style={{
                  fontSize: "var(--text-micro)",
                  color: "var(--color-text-ghost)",
                }}
              >
                {ghost.year}
              </span>
            </div>
            <div
              className="font-serif italic mt-1"
              style={{
                fontSize: "var(--text-micro)",
                color: "var(--color-text-ghost)",
              }}
            >
              {ghost.tagline}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Select Card ── */

interface SelectCardProps {
  project: (typeof PROJECTS)[number];
  index: number;
  isActive: boolean;
  onClick: (id: string) => void;
}

function SelectCard({ project, index, isActive, onClick }: SelectCardProps) {
  const num = String(index + 1).padStart(2, "0");
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasVideo = project.videos && project.videos.length > 0;

  // Video focus: play when near viewport center
  useEffect(() => {
    if (!hasVideo) return;
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "-30% 0px -30% 0px" }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [hasVideo]);

  return (
    <motion.button
      data-project-row={project.id}
      data-cursor="project"
      onClick={() => onClick(project.id)}
      className="project-card group text-left w-full"
      style={{
        borderBottom: "1px solid var(--color-border)",
        borderRight: "1px solid var(--color-border)",
        padding: "var(--page-px)",
        backgroundColor: isActive ? "rgba(0,0,0,0.02)" : "transparent",
      }}
      whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "3 / 2",
          borderRadius: 2,
          marginBottom: "1rem",
        }}
      >
        {hasVideo ? (
          <video
            ref={videoRef}
            src={project.videos![0].src}
            poster={project.image}
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover project-card-img"
          />
        ) : (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover project-card-img"
          />
        )}
      </div>

      {/* Meta */}
      <div className="flex items-baseline justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-3">
            <span
              className="font-mono flex-shrink-0"
              style={{
                fontSize: "var(--text-micro)",
                letterSpacing: "0.1em",
                color: "var(--color-text-ghost)",
              }}
            >
              {num}
            </span>
            <span
              className="font-sans font-medium uppercase truncate"
              style={{
                fontSize: "var(--text-sm)",
                letterSpacing: "0.04em",
                color: "var(--color-text)",
              }}
            >
              {project.title}
            </span>
          </div>
          <div
            className="font-mono mt-1"
            style={{
              fontSize: "var(--text-micro)",
              letterSpacing: "0.1em",
              color: "var(--color-text-secondary)",
            }}
          >
            {project.sector}
          </div>
        </div>

        <span
          className="font-mono flex-shrink-0"
          style={{
            fontSize: "var(--text-micro)",
            letterSpacing: "0.1em",
            color: "var(--color-text-ghost)",
          }}
        >
          {project.year}
        </span>
      </div>
    </motion.button>
  );
}
