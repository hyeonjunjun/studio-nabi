"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useRouter } from "next/navigation";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useStudioStore } from "@/lib/store";

interface ProjectCoverProps {
  id: string;
  title: string;
  image: string;
  position: [number, number, number];
  scale: [number, number];
  wip?: boolean;
}

/**
 * ProjectCover — A single 3D album cover in the R3F scene
 *
 * Thin box with project image texture. Tilts on hover,
 * navigates to case study on click.
 */
export default function ProjectCover({
  id,
  title,
  image,
  position,
  scale,
  wip = false,
}: ProjectCoverProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const router = useRouter();
  const setHoveredProject = useStudioStore((s) => s.setHoveredProject);

  const [hovered, setHovered] = useState(false);

  // Target rotation for smooth tilt
  const targetRotation = useRef({ x: 0, y: 0 });

  // Load texture
  const texture = useTexture(image);
  texture.colorSpace = THREE.SRGBColorSpace;

  // Create materials for the thin box
  const materials = useMemo(() => {
    const front = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.4,
      metalness: 0.05,
    });
    const side = new THREE.MeshStandardMaterial({
      color: "#E5E0D8",
      roughness: 0.6,
    });
    // Box has 6 faces: +x, -x, +y, -y, +z (front), -z (back)
    return [side, side, side, side, front, side];
  }, [texture]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Smooth tilt toward target
    const mesh = meshRef.current;
    const speed = 4;
    mesh.rotation.x += (targetRotation.current.x - mesh.rotation.x) * speed * delta;
    mesh.rotation.y += (targetRotation.current.y - mesh.rotation.y) * speed * delta;

    // Subtle float
    mesh.position.y = position[1] + Math.sin(Date.now() * 0.001 + position[0]) * 0.02;
  });

  const onPointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    setHoveredProject(id);
    targetRotation.current = { x: -0.05, y: 0.08 };
    document.body.style.cursor = wip ? "default" : "pointer";
  };

  const onPointerOut = () => {
    setHovered(false);
    setHoveredProject(null);
    targetRotation.current = { x: 0, y: 0 };
    document.body.style.cursor = "auto";
  };

  const onClick = () => {
    if (!wip) {
      router.push(`/work/${id}`);
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      material={materials}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
      castShadow
    >
      <boxGeometry args={[scale[0], scale[1], 0.02]} />
    </mesh>
  );
}
