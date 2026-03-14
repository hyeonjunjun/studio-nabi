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

export default function ProjectSelects() {
  const router = useRouter();
  const activeProject = useStudioStore((s) => s.activeProject);
  const setActiveProject = useStudioStore((s) => s.setActiveProject);
  const isPanelOpen = useStudioStore((s) => s.isPanelOpen);
  const setIsPanelOpen = useStudioStore((s) => s.setIsPanelOpen);
  const playerVisible = useStudioStore((s) => s.playerVisible);
  const setPlayerVisible = useStudioStore((s) => s.setPlayerVisible);
  const startTransition = useTransitionStore((s) => s.start);

  const handleRowClick = (id: string) => {
    // Mobile: navigate directly to case study (no panel)
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

      <div style={{ borderTop: "1px solid var(--color-border)" }}>
        {PROJECTS.map((project, i) => (
          <ProjectRow
            key={project.id}
            project={project}
            index={i}
            isActive={activeProject === project.id}
            showThumbnail
            onClick={handleRowClick}
          />
        ))}
        {GHOSTS.map((ghost, i) => (
          <GhostRow
            key={`ghost-${i}`}
            index={totalProjects + i}
            year={ghost.year}
            tagline={ghost.tagline}
            showThumbnail
          />
        ))}
      </div>
    </div>
  );
}
