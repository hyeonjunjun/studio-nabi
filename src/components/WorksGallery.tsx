"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { PROJECTS } from "@/constants/projects";
import ProjectCover from "@/components/ProjectCover";

/**
 * WorksGallery — R3F Canvas scene with asymmetric album covers
 *
 * Covers are staggered in an organic layout (not a grid).
 * Soft lighting, contact shadows, subtle grain via post-processing.
 */

// Asymmetric positions — covers scattered like album covers on a table
function getCoverLayout(count: number) {
  const layouts: Array<{
    position: [number, number, number];
    scale: [number, number];
  }> = [
    { position: [-1.6, 0.3, 0], scale: [1.8, 2.2] },
    { position: [0.5, -0.1, 0.3], scale: [1.5, 1.9] },
    { position: [2.2, 0.5, -0.2], scale: [1.6, 2.0] },
    { position: [-0.3, -0.8, 0.1], scale: [1.4, 1.7] },
    { position: [1.4, -0.6, -0.1], scale: [1.7, 2.1] },
    { position: [-2.0, -0.5, 0.2], scale: [1.5, 1.8] },
  ];

  return layouts.slice(0, count);
}

function Scene() {
  const coverData = useMemo(() => {
    const active = PROJECTS.filter((p) => !p.wip);
    const layout = getCoverLayout(active.length);
    return active.map((project, i) => ({
      ...project,
      layout: layout[i] || layout[0],
    }));
  }, []);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.8}
        color="#FFF5E6"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Covers */}
      {coverData.map((project) => (
        <ProjectCover
          key={project.id}
          id={project.id}
          title={project.title}
          image={project.image}
          position={project.layout.position}
          scale={project.layout.scale}
          wip={project.wip}
        />
      ))}

      {/* Ground shadow */}
      <ContactShadows
        position={[0, -2.2, 0]}
        opacity={0.15}
        scale={12}
        blur={2.5}
        far={4}
        color="#7A756D"
      />

      {/* Environment for PBR reflections */}
      <Environment preset="city" />

      {/* Performance */}
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </>
  );
}

export default function WorksGallery() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
