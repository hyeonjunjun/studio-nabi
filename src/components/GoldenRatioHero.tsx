"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// --- CONFIGURATION ---
const THEME = {
    lineColor: "#ffffff", // Pure White
    gridColor: "#333333", // Charcoal for the grid
    backgroundColor: "#050505", // Deep Black
};

// --- GEOMETRY ---
function GoldenMesh() {
    const spiralRef = useRef<THREE.Line>(null);

    const { spiralGeo } = useMemo(() => {
        // Points for Spiral
        const sPoints: THREE.Vector3[] = [];
        const growthFactor = 0.3063489;
        const totalRotations = 8 * Math.PI; // 4 full turns
        const res = 800; // Smoother

        for (let i = 0; i < res; i++) {
            const angle = 0.1 + (i / res) * totalRotations;
            const radius = 0.5 * Math.exp(growthFactor * angle);

            // 3D Spiral: Slight Z-rise to give volume
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            const pz = -i * 0.01; // Spirals into the screen slightly

            sPoints.push(new THREE.Vector3(px, py, pz));
        }

        return {
            spiralGeo: new THREE.BufferGeometry().setFromPoints(sPoints),
        };
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const scrollY = window.scrollY;
        const height = window.innerHeight;
        const progress = Math.min(scrollY / height, 1);

        // Mouse Paralax (Subtle)
        const mx = (state.pointer.x * Math.PI) / 10;
        const my = (state.pointer.y * Math.PI) / 10;

        if (spiralRef.current) {
            // "Visualizer" Rotation
            spiralRef.current.rotation.z = (time * 0.05) - (progress * 2); // Constant spin + Scroll unwind
            spiralRef.current.rotation.x = my * 0.5; // Look up/down
            spiralRef.current.rotation.y = mx * 0.5; // Look left/right

            // Scale pulse?
            // const pulse = 1 + Math.sin(time) * 0.05;
            // spiralRef.current.scale.setScalar(pulse);

            // Fade out
            if (!Array.isArray(spiralRef.current.material)) {
                (spiralRef.current.material as THREE.LineBasicMaterial).opacity = Math.max(0, 1 - progress * 1.5);
            }
        }


    });

    return (
        <group position={[0, 0, 0]}>
            {/* @ts-ignore */}
            <line ref={spiralRef as any} geometry={spiralGeo}>
                <lineBasicMaterial
                    color={THEME.lineColor}
                    linewidth={2}
                    transparent
                    opacity={0.8}
                    depthTest={false} // Draw on top
                />
            </line>

            {/* Perspective Grid Background */}

        </group>
    );
}

export default function GoldenRatioHero() {
    return (
        <div className="fixed inset-0 z-0 w-full h-full pointer-events-none bg-[#050505]">
            <Canvas
                camera={{ fov: 45, position: [0, 0, 15] }} // Perspective for 3D feel
                gl={{ antialias: true, alpha: true }}
            >
                <ambientLight intensity={1} />
                <GoldenMesh />
            </Canvas>

            {/* Noise Texture */}
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Gradient Vignette */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#050505] pointer-events-none opacity-80" />
        </div>
    );
}
