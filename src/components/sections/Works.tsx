"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { PROJECTS } from "@/constants/projects";

// Lazy load R3F gallery — skip on mobile for performance
const WorksGallery = dynamic(() => import("@/components/WorksGallery"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <span className="micro">Loading...</span>
    </div>
  ),
});

/**
 * Works — R3F 3D album cover gallery
 *
 * Desktop: 3D scene with floating album covers
 * Mobile: flat image grid fallback
 * Below: minimal text index for accessibility/SEO
 */
export default function Works() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      id="work"
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
      }}
    >
      {/* 3D Gallery or Mobile Grid */}
      <div style={{ height: "80vh" }}>
        {isMobile ? (
          <MobileGrid />
        ) : (
          <WorksGallery />
        )}
      </div>

      {/* Text index — accessibility + SEO */}
      <div
        className="section-padding"
        style={{
          paddingTop: "clamp(2rem, 4vh, 3rem)",
          paddingBottom: "clamp(4rem, 8vh, 6rem)",
        }}
      >
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          {PROJECTS.map((project, i) => {
            const isWip = project.wip;
            const num = String(i + 1).padStart(2, "0");

            const label = (
              <span
                className="font-mono inline-flex items-center gap-2 transition-colors duration-300"
                style={{
                  fontSize: "var(--text-micro)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-text-dim)",
                }}
              >
                <span style={{ color: "var(--color-text-ghost)" }}>{num}</span>
                {project.title}
                {isWip && (
                  <span style={{ color: "var(--color-accent)", opacity: 0.5 }}>
                    WIP
                  </span>
                )}
              </span>
            );

            if (isWip) {
              return <span key={project.id}>{label}</span>;
            }

            return (
              <Link
                key={project.id}
                href={`/work/${project.id}`}
                className="hover:text-[var(--color-text)] transition-colors duration-300"
                data-cursor="project"
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * MobileGrid — flat image grid fallback for mobile devices
 */
function MobileGrid() {
  return (
    <div
      className="grid grid-cols-2 gap-3 h-full section-padding overflow-y-auto"
      style={{ paddingTop: "clamp(2rem, 4vh, 3rem)" }}
    >
      {PROJECTS.map((project) => {
        const isWip = project.wip;

        const card = (
          <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
            {isWip ? (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: "var(--color-surface)" }}
              >
                <span className="micro" style={{ opacity: 0.3 }}>WIP</span>
              </div>
            ) : (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            )}
            <div
              className="absolute bottom-0 left-0 right-0 p-3"
              style={{
                background: "linear-gradient(to top, rgba(var(--color-bg-rgb), 0.8), transparent)",
              }}
            >
              <span
                className="font-mono uppercase block"
                style={{
                  fontSize: "var(--text-micro)",
                  letterSpacing: "0.1em",
                  color: "var(--color-text)",
                }}
              >
                {project.title}
              </span>
            </div>
          </div>
        );

        if (isWip) {
          return <div key={project.id}>{card}</div>;
        }

        return (
          <Link key={project.id} href={`/work/${project.id}`} data-cursor="project">
            {card}
          </Link>
        );
      })}
    </div>
  );
}
