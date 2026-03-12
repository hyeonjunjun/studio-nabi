"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
import type { Project } from "@/constants/projects";

/** Hero rows get the massive preview panel on hover */
const HERO_IDS = new Set(["sift", "gyeol"]);

interface TrackRowProps {
  project: Project;
  index: number;
}

export default function TrackRow({ project, index }: TrackRowProps) {
  const router = useRouter();
  const expandRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const num = String(index + 1).padStart(2, "0");
  const isHero = HERO_IDS.has(project.id);

  const handleEnter = () => {
    setHovered(true);
    if (isHero && expandRef.current) {
      gsap.to(expandRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.35,
        ease: "power2.inOut",
      });
    }
  };

  const handleLeave = () => {
    setHovered(false);
    if (isHero && expandRef.current) {
      gsap.to(expandRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.25,
        ease: "power2.inOut",
      });
    }
  };

  const navigate = () => {
    router.push(`/work/${project.id}`);
  };

  return (
    <div
      className="cursor-pointer group"
      data-cursor="explore"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={navigate}
      onKeyDown={(e) => {
        if (e.key === "Enter") navigate();
      }}
      role="link"
      tabIndex={0}
    >
      {/* Main row */}
      <div
        className="grid items-center transition-colors duration-200"
        style={{
          gridTemplateColumns: "48px 1fr 200px 80px",
          borderBottom: "1px solid var(--color-border)",
          borderLeft: hovered ? "2px solid var(--color-text)" : "1px solid transparent",
          padding: "0.875rem 0.5rem",
          backgroundColor: hovered ? "var(--color-surface-raised)" : "transparent",
        }}
      >
        {/* # */}
        <span
          className="font-mono"
          style={{
            fontSize: "var(--text-micro)",
            color: "var(--color-text-ghost)",
            letterSpacing: "0.05em",
          }}
        >
          {num}
        </span>

        {/* Title — serif */}
        <span
          className="font-display truncate"
          style={{
            fontSize: "var(--text-lg)",
            color: "var(--color-text)",
          }}
        >
          {project.title}
        </span>

        {/* Role */}
        <span
          className="font-mono uppercase truncate hidden md:block"
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-dim)",
            letterSpacing: "0.08em",
          }}
        >
          {project.role}
        </span>

        {/* Year */}
        <span
          className="font-mono hidden sm:block"
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-ghost)",
            letterSpacing: "0.05em",
          }}
        >
          {project.year}
        </span>
      </div>

      {/* Hero row: expanded preview panel */}
      {isHero && (
        <div
          ref={expandRef}
          className="overflow-hidden"
          style={{ height: 0, opacity: 0 }}
        >
          <div
            className="grid gap-6 py-6 px-2"
            style={{
              gridTemplateColumns: "1fr 1fr",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            {/* Full-color image */}
            <div
              className="relative overflow-hidden"
              style={{
                aspectRatio: "16 / 10",
                border: "1px solid var(--color-border)",
              }}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Pitch + CTA */}
            <div className="flex flex-col justify-between py-1">
              <p
                className="font-sans leading-relaxed"
                style={{
                  fontSize: "var(--text-base)",
                  color: "var(--color-text-dim)",
                }}
              >
                {project.pitch}
              </p>

              <div className="flex items-center gap-2 mt-4">
                <span
                  className="font-mono uppercase tracking-[0.12em] px-3 py-1.5 transition-colors duration-200"
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text)",
                    border: "1px solid var(--color-border-strong)",
                  }}
                >
                  View Case Study
                </span>
                <svg
                  width="16"
                  height="8"
                  viewBox="0 0 16 8"
                  fill="none"
                  style={{ color: "var(--color-text-dim)" }}
                >
                  <path
                    d="M0 4H14M14 4L10 0.5M14 4L10 7.5"
                    stroke="currentColor"
                    strokeWidth="0.75"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
