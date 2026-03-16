"use client";

import { useParams, useRouter } from "next/navigation";
import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { PROJECTS } from "@/constants/projects";
import GutPunchCloser from "@/components/case-study/GutPunchCloser";
import VideoShowcase from "@/components/case-study/VideoShowcase";
import Colophon from "@/components/sections/Colophon";

/* ─── Helpers ─── */

function MediaBlock({
  src,
  placeholder,
  aspect = "16/10",
}: {
  src: string;
  placeholder?: string;
  aspect?: string;
}) {
  if (src.startsWith("/placeholder")) {
    return (
      <div
        className="w-full flex items-center justify-center"
        style={{
          aspectRatio: aspect,
          backgroundColor: "var(--color-surface)",
        }}
      >
        <span className="micro">{placeholder || "Media Pending"}</span>
      </div>
    );
  }
  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: aspect }}>
      <Image
        src={src}
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 60vw"
        quality={90}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════
   ProjectDetail — Magazine-spread layout
   ═══════════════════════════════════════════ */

export default function ProjectDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const project = PROJECTS.find((p) => p.id === slug);
  const currentIndex = project ? PROJECTS.findIndex((p) => p.id === project.id) : -1;
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];
  const prevProject = PROJECTS[(currentIndex - 1 + PROJECTS.length) % PROJECTS.length];
  const hasVideos = !!(project?.videos && project.videos.length > 0);

  // GSAP scroll reveals
  useEffect(() => {
    if (!containerRef.current) return;

    const reveals = containerRef.current.querySelectorAll("[data-reveal]");
    reveals.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0.15, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
        }
      );
    });
  }, [project]);

  if (!project) {
    return (
      <div
        className="w-full h-screen flex items-center justify-center font-mono uppercase"
        style={{
          fontSize: "var(--text-micro)",
          letterSpacing: "0.2em",
          color: "var(--color-text-dim)",
        }}
      >
        project not found
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* ══════════════════════════════════════
          HERO — Full-bleed image
          ══════════════════════════════════════ */}
      <section className="relative w-full min-h-[85vh] flex flex-col justify-end">
        <div className="absolute inset-0">
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ filter: "brightness(0.65)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, var(--color-bg) 0%, transparent 50%)",
            }}
          />
        </div>

        <div className="relative z-10 section-padding pb-20">
          <span
            className="font-mono uppercase block mb-6"
            style={{
              fontSize: "var(--text-micro)",
              letterSpacing: "0.2em",
              color: "var(--color-text-dim)",
            }}
          >
            {project.sector} · {project.year}
          </span>
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
              color: "var(--color-text)",
              lineHeight: 1.05,
              maxWidth: "14ch",
            }}
          >
            {project.title}
          </h1>
          <div className="flex gap-8 mt-8">
            <div>
              <span className="micro block mb-1" style={{ color: "var(--color-text-ghost)" }}>Client</span>
              <span
                className="font-mono"
                style={{ fontSize: "var(--text-small)", color: "var(--color-text-dim)" }}
              >
                {project.client}
              </span>
            </div>
            <div>
              <span className="micro block mb-1" style={{ color: "var(--color-text-ghost)" }}>Role</span>
              <span
                className="font-mono"
                style={{ fontSize: "var(--text-small)", color: "var(--color-text-dim)" }}
              >
                {project.role}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BACK BUTTON
          ══════════════════════════════════════ */}
      <div className="section-padding pt-8 pb-4">
        <button
          onClick={() => router.back()}
          className="font-mono transition-colors duration-300 hover:text-[var(--color-accent)]"
          style={{
            fontSize: "var(--text-micro)",
            color: "var(--color-text-dim)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          ← Back
        </button>
      </div>

      {/* ══════════════════════════════════════
          PARADOX — Narrow column, offset right
          ══════════════════════════════════════ */}
      {project.paradox && (
        <section
          className="section-padding grid grid-cols-1 md:grid-cols-12 gap-8 pt-24 pb-20"
          data-reveal
        >
          <div className="md:col-span-7 md:col-start-1">
            <h2
              className="font-display italic"
              style={{
                fontSize: "var(--text-h2)",
                color: "var(--color-text)",
                lineHeight: 1.3,
              }}
            >
              {project.paradox}
            </h2>
          </div>
          {project.stakes && (
            <div className="md:col-span-4 md:col-start-9 flex items-end">
              <p
                className="font-sans"
                style={{
                  fontSize: "var(--text-body)",
                  color: "var(--color-text-dim)",
                  lineHeight: 1.7,
                }}
              >
                {project.stakes}
              </p>
            </div>
          )}
        </section>
      )}

      {/* ══════════════════════════════════════
          EDITORIAL — Text left, image right
          ══════════════════════════════════════ */}
      <div className="hairline mx-[var(--page-padding)]" />

      <section
        className="section-padding grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 py-24"
        data-reveal
      >
        <div className="md:col-span-5">
          <span className="micro block mb-6" style={{ color: "var(--color-text-ghost)" }}>
            Overview
          </span>
          <h2
            className="font-display italic mb-6"
            style={{
              fontSize: "var(--text-h2)",
              color: "var(--color-text)",
              lineHeight: 1.2,
            }}
          >
            {project.editorial.headline}
          </h2>
          <p
            className="font-sans"
            style={{
              fontSize: "var(--text-body)",
              color: "var(--color-text-dim)",
              lineHeight: 1.7,
            }}
          >
            {project.editorial.copy}
          </p>
        </div>

        {project.editorial.images?.length > 0 && (
          <div className="md:col-span-6 md:col-start-7">
            <MediaBlock src={project.editorial.images[0]} placeholder="Editorial Media" />
          </div>
        )}
      </section>

      {/* ── Editorial image grid — full-bleed ── */}
      {project.editorial.images?.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-4" data-reveal>
          {project.editorial.images.slice(1).map((img, i) => (
            <MediaBlock key={i} src={img} placeholder="Editorial Media" />
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════
          PROCESS — Side-by-side steps
          ══════════════════════════════════════ */}
      <div className="hairline mx-[var(--page-padding)]" />

      <section className="section-padding py-24" data-reveal>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-4">
            <span className="micro block mb-6" style={{ color: "var(--color-text-ghost)" }}>
              Process
            </span>
            <p
              className="font-sans"
              style={{
                fontSize: "var(--text-body)",
                color: "var(--color-text-dim)",
                lineHeight: 1.7,
              }}
            >
              {project.process.copy}
            </p>
          </div>

          {project.processSteps && project.processSteps.length > 0 && (
            <div className="md:col-span-7 md:col-start-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {project.processSteps.map((step, i) => (
                <div key={i} data-reveal>
                  <span
                    className="font-mono block mb-3"
                    style={{
                      fontSize: "var(--text-micro)",
                      color: "var(--color-accent)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4
                    className="font-sans mb-2"
                    style={{ fontSize: "var(--text-small)", color: "var(--color-text)" }}
                  >
                    {step.title}
                  </h4>
                  <p
                    className="font-sans"
                    style={{
                      fontSize: "var(--text-body)",
                      color: "var(--color-text-dim)",
                      lineHeight: 1.7,
                    }}
                  >
                    {step.copy}
                  </p>
                  {step.image && (
                    <div className="mt-4">
                      <MediaBlock src={step.image} aspect="4/3" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          B-ROLL — Full-bleed video showcase
          ══════════════════════════════════════ */}
      {hasVideos && (
        <>
          <div className="hairline mx-[var(--page-padding)]" />
          <section className="section-padding py-24" data-reveal>
            <span className="micro block mb-8" style={{ color: "var(--color-text-ghost)" }}>
              B-Roll
            </span>
            <VideoShowcase videos={project.videos!} />
          </section>
        </>
      )}

      {/* ══════════════════════════════════════
          ENGINEERING — Narrow text + signal tags
          ══════════════════════════════════════ */}
      <div className="hairline mx-[var(--page-padding)]" />

      <section className="section-padding py-24" data-reveal>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-5">
            <span className="micro block mb-6" style={{ color: "var(--color-text-ghost)" }}>
              Engineering
            </span>
            <p
              className="font-sans"
              style={{
                fontSize: "var(--text-body)",
                color: "var(--color-text-dim)",
                lineHeight: 1.7,
              }}
            >
              {project.engineering.copy}
            </p>
          </div>
          <div className="md:col-span-6 md:col-start-7 flex flex-wrap gap-2 content-start">
            {project.engineering.signals?.map((signal) => (
              <span
                key={signal}
                className="font-mono uppercase"
                style={{
                  fontSize: "var(--text-micro)",
                  letterSpacing: "0.12em",
                  color: "var(--color-text-dim)",
                  padding: "6px 14px",
                  border: "1px solid var(--color-border)",
                }}
              >
                {signal}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS — Full-width bar
          ══════════════════════════════════════ */}
      {project.statistics?.length > 0 && (
        <section
          className="py-16 section-padding"
          style={{
            backgroundColor: "var(--color-surface)",
            borderTop: "1px solid var(--color-border)",
            borderBottom: "1px solid var(--color-border)",
          }}
          data-reveal
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {project.statistics.map((stat) => (
              <div key={stat.label}>
                <span className="micro block mb-2">{stat.label}</span>
                <span
                  className="font-display"
                  style={{
                    fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                    color: "var(--color-text)",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          GUT PUNCH — Full-width, massive whitespace
          ══════════════════════════════════════ */}
      <GutPunchCloser text={project.gutPunch} />

      {/* ══════════════════════════════════════
          SCHEMATIC — Technical specs bar
          ══════════════════════════════════════ */}
      <div
        className="section-padding grid grid-cols-2 sm:grid-cols-4 gap-6 py-10"
        style={{
          backgroundColor: "var(--color-surface)",
          borderTop: "1px solid var(--color-border)",
        }}
        data-reveal
      >
        <div className="flex flex-col gap-1">
          <span className="micro">Typography</span>
          <span className="font-mono" style={{ fontSize: "var(--text-micro)", color: "var(--color-text)" }}>
            {project.schematic.typography}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="micro">Grid</span>
          <span className="font-mono" style={{ fontSize: "var(--text-micro)", color: "var(--color-text)" }}>
            {project.schematic.grid}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="micro">Stack</span>
          <span className="font-mono" style={{ fontSize: "var(--text-micro)", color: "var(--color-text)" }}>
            {project.schematic.stack.join(", ")}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="micro">Palette</span>
          <div className="flex gap-1 mt-1">
            {project.schematic.colors?.map((c) => (
              <div
                key={c}
                style={{
                  width: 14,
                  height: 14,
                  backgroundColor: c,
                  border: "1px solid var(--color-border)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          PREV / NEXT NAV
          ══════════════════════════════════════ */}
      <div
        className="grid grid-cols-2"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <Link
          href={`/work/${prevProject.id}`}
          className="block px-6 sm:px-12 py-16 transition-colors duration-500 hover:bg-[var(--color-surface)]"
          style={{ borderRight: "1px solid var(--color-border)" }}
        >
          <span className="micro block mb-3">← Previous</span>
          <h3
            className="font-display"
            style={{ fontSize: "var(--text-h3)", color: "var(--color-text)", lineHeight: 1.3 }}
          >
            {prevProject.title}
          </h3>
        </Link>
        <Link
          href={`/work/${nextProject.id}`}
          className="block px-6 sm:px-12 py-16 text-right transition-colors duration-500 hover:bg-[var(--color-surface)]"
        >
          <span className="micro block mb-3">Next →</span>
          <h3
            className="font-display"
            style={{ fontSize: "var(--text-h3)", color: "var(--color-text)", lineHeight: 1.3 }}
          >
            {nextProject.title}
          </h3>
        </Link>
      </div>

      {/* ── Footer ── */}
      <Colophon />
    </div>
  );
}
