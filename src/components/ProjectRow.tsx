"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { Project } from "@/constants/projects";

interface ProjectRowProps {
  project: Project;
  index: number;
  isActive: boolean;
  showThumbnail?: boolean;
  onClick: (id: string) => void;
}

export default function ProjectRow({
  project,
  index,
  isActive,
  showThumbnail = false,
  onClick,
}: ProjectRowProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const num = String(index + 1).padStart(2, "0");
  const hasVideo = project.videos && project.videos.length > 0;

  // Video focus: play/pause based on viewport intersection
  useEffect(() => {
    if (!showThumbnail || !hasVideo) return;
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
      { rootMargin: "-40% 0px -40% 0px" }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [showThumbnail, hasVideo]);

  return (
    <motion.button
      data-project-row={project.id}
      data-cursor="project"
      onClick={() => onClick(project.id)}
      className="project-card group w-full text-left flex items-center gap-6 transition-colors duration-200"
      style={{
        padding: showThumbnail ? "20px var(--page-px)" : "24px var(--page-px)",
        borderBottom: "1px solid var(--color-border)",
        backgroundColor: isActive ? "rgba(0,0,0,0.03)" : "transparent",
        borderLeft: isActive
          ? "2px solid var(--color-accent)"
          : "2px solid transparent",
      }}
      whileHover={{ backgroundColor: "rgba(0,0,0,0.03)" }}
    >
      {/* Thumbnail (Selects mode only) */}
      {showThumbnail && (
        <div
          className="relative overflow-hidden flex-shrink-0"
          style={{ width: 160, height: 100, borderRadius: 2 }}
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
              sizes="160px"
              className="object-cover project-card-img"
            />
          )}
        </div>
      )}

      {/* Number */}
      <span
        className="font-mono flex-shrink-0"
        style={{
          fontSize: "var(--text-micro)",
          letterSpacing: "0.1em",
          color: "var(--color-text-ghost)",
          width: "2.5em",
        }}
      >
        [{num}]
      </span>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <div
          className="font-sans font-medium uppercase truncate"
          style={{
            fontSize: "var(--text-base)",
            letterSpacing: "0.04em",
            color: "var(--color-text)",
          }}
        >
          {project.title}
        </div>
        <div
          className="font-mono mt-1"
          style={{
            fontSize: "var(--text-micro)",
            letterSpacing: "0.1em",
            color: "var(--color-text-secondary)",
          }}
        >
          {project.sector} — {project.year}
        </div>
      </div>
    </motion.button>
  );
}
