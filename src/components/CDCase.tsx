import { useRef, Suspense } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface CDCaseProps {
  textureUrl?: string;
  coverColor?: string;
}

const MAX_TILT = 0.14; // ~8 degrees
const LERP_FACTOR = 0.05;

function CDCaseWithTexture({
  textureUrl,
  coverColor = "#1a1a1a",
}: {
  textureUrl: string;
  coverColor?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(textureUrl);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.1;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      pointer.y * MAX_TILT,
      LERP_FACTOR,
    );
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      -pointer.x * MAX_TILT,
      LERP_FACTOR,
    );
  });

  const edgeMaterial = (
    <meshStandardMaterial color="#0d0d0d" roughness={0.85} metalness={0.05} />
  );

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 0.15]} />
      {/* +X */ edgeMaterial}
      {/* -X */ edgeMaterial}
      {/* +Y */ edgeMaterial}
      {/* -Y */ edgeMaterial}
      {/* +Z (front) */}
      <meshStandardMaterial
        map={texture}
        color={coverColor}
        roughness={0.85}
        metalness={0.05}
      />
      {/* -Z (back) */ edgeMaterial}
    </mesh>
  );
}

function CDCaseWithColor({ coverColor = "#1a1a1a" }: { coverColor?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.1;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      pointer.y * MAX_TILT,
      LERP_FACTOR,
    );
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      -pointer.x * MAX_TILT,
      LERP_FACTOR,
    );
  });

  const edgeMaterial = (
    <meshStandardMaterial color="#0d0d0d" roughness={0.85} metalness={0.05} />
  );

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 0.15]} />
      {/* +X */ edgeMaterial}
      {/* -X */ edgeMaterial}
      {/* +Y */ edgeMaterial}
      {/* -Y */ edgeMaterial}
      {/* +Z (front) */}
      <meshStandardMaterial
        color={coverColor}
        roughness={0.85}
        metalness={0.05}
      />
      {/* -Z (back) */ edgeMaterial}
    </mesh>
  );
}

export default function CDCase({ textureUrl, coverColor = "#1a1a1a" }: CDCaseProps) {
  if (textureUrl) {
    return (
      <Suspense fallback={null}>
        <CDCaseWithTexture textureUrl={textureUrl} coverColor={coverColor} />
      </Suspense>
    );
  }
  return <CDCaseWithColor coverColor={coverColor} />;
}
