"use client";

import { useRouter } from "next/navigation";
import { PROJECTS } from "@/constants/projects";
import { useStudioStore } from "@/lib/store";
import { useTransitionStore } from "@/store/useTransitionStore";
import HeroBlock from "@/components/HeroBlock";
import ProjectRow from "@/components/ProjectRow";
import GhostRow from "@/components/GhostRow";

const GHOSTS = [
  { year: "2026", tagline: "in development" },
  { year: "20??", tagline: "maybe the idea will come soon" },
];

export default function ProjectIndex() {
  const router = useRouter();
  const activeProject = useStudioStore((s) => s.activeProject);
  const setActiveProject = useStudioStore((s) => s.setActiveProject);
  const isPanelOpen = useStudioStore((s) => s.isPanelOpen);
  const setIsPanelOpen = useStudioStore((s) => s.setIsPanelOpen);
  const playerVisible = useStudioStore((s) => s.playerVisible);
  const setPlayerVisible = useStudioStore((s) => s.setPlayerVisible);
  const startTransition = useTransitionStore((s) => s.start);

  const handleRowClick = (id: string) => {
    if (window.innerWidth < 768) {
      const row = document.querySelector(`[data-project-row="${id}"]`);
      const rect = row?.getBoundingClientRect();
      startTransition(`/work/${id}`, {
        x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
        y: rect ? rect.top + rect.height / 2 : window.innerHeight / 2,
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

  const totalProjects = PROJECTS.length;

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
          Selected Work ({totalProjects})
        </span>
      </div>

      {/* Project rows */}
      <div className="subtractive-group">
        {PROJECTS.map((project, i) => (
          <ProjectRow
            key={project.id}
            project={project}
            index={i}
            isActive={activeProject === project.id}
            onClick={handleRowClick}
          />
        ))}
      </div>

      {/* Ghost rows */}
      {GHOSTS.map((ghost, i) => (
        <GhostRow
          key={`ghost-${i}`}
          index={totalProjects + i}
          year={ghost.year}
          tagline={ghost.tagline}
        />
      ))}
    </div>
  );
}
