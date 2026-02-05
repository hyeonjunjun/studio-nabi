"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";
import { Environment, ContactShadows, SoftShadows } from "@react-three/drei";

// --- CONFIGURATION ---
// Easily tweakable values for "open design"
const PHYSICS = {
    gravity: -9.8,
    damping: 0.99, // Air resistance
    wireLength: 3.5,
    sphereRadius: 0.8,
    mass: 5,
    stiffness: 0.1, // Mouse drag interaction spring
};

const COLORS = {
    background: "#e8e6e1", // Warm Beige
    sphere: "#ffffff", // Chrome
    wire: "#2a2a2a", // Dark Grey
};

// --- PENDULUM COMPONENT ---
function Pendulum() {
    const { size, viewport, mouse } = useThree();
    const sphereRef = useRef<THREE.Mesh>(null);
    const lineRef = useRef<THREE.Mesh>(null);

    // Physics State (Verlet Integration)
    // We store these in refs to avoid React re-renders on every frame
    const pos = useRef(new THREE.Vector3(0, -PHYSICS.wireLength, 0));
    const oldPos = useRef(new THREE.Vector3(0, -PHYSICS.wireLength, 0));
    const acc = useRef(new THREE.Vector3(0, 0, 0));
    const isDragging = useRef(false);

    // Mouse Interaction Handlers
    const handlePointerDown = (e: any) => {
        e.stopPropagation();
        isDragging.current = true;
        document.body.style.cursor = "grabbing";
    };

    const handlePointerUp = () => {
        isDragging.current = false;
        document.body.style.cursor = "default";
    };

    const handlePointerOver = () => {
        document.body.style.cursor = "grab";
    };

    const handlePointerOut = () => {
        if (!isDragging.current) document.body.style.cursor = "default";
    };

    // Global pointer up listener
    useEffect(() => {
        window.addEventListener("pointerup", handlePointerUp);
        return () => window.removeEventListener("pointerup", handlePointerUp);
    }, []);

    useFrame((state, delta) => {
        // Clamp delta to avoid explosion on tab switch
        const dt = Math.min(delta, 0.05);

        // 1. ACCUMULATE FORCES
        // Gravity
        acc.current.set(0, PHYSICS.gravity, 0);

        // Dragging Force (Mouse Spring)
        if (isDragging.current) {
            // Convert mouse (screen space) to 3D space at the sphere's depth
            // Simple approximation: Mouse X/Y maps to Viewport X/Y
            const targetX = (state.mouse.x * viewport.width) / 2;
            const targetY = (state.mouse.y * viewport.height) / 2;
            const targetZ = 0; // Pull towards screen plane

            const dragForce = new THREE.Vector3(targetX, targetY, targetZ).sub(pos.current);
            // Strong pull to follow mouse
            acc.current.add(dragForce.multiplyScalar(300));

            // Add some damping so it doesn't oscillate wildly while holding
            oldPos.current.lerp(pos.current, 0.1);
        }

        // 2. VERLET INTEGRATION (Pos = 2*Pos - OldPos + Acc*dt^2)
        const velocity = pos.current.clone().sub(oldPos.current);

        // Apply Damping (Friction)
        velocity.multiplyScalar(PHYSICS.damping);

        const newPos = pos.current.clone().add(velocity).add(acc.current.multiplyScalar(dt * dt));

        oldPos.current.copy(pos.current);
        pos.current.copy(newPos);

        // 3. CONSTRAINTS (The Wire)
        // Pivot point at top of screen
        const pivot = new THREE.Vector3(0, 3, 0);
        const dist = pos.current.distanceTo(pivot);

        // Rigid constraint: Pull back to wire length
        if (dist > PHYSICS.wireLength) {
            const correction = pos.current.clone().sub(pivot).normalize().multiplyScalar(PHYSICS.wireLength);
            pos.current.copy(pivot.clone().add(correction));
        }

        // 4. UPDATE VISUALS
        if (sphereRef.current) {
            sphereRef.current.position.copy(pos.current);
            sphereRef.current.rotation.x -= velocity.z * 5;
            sphereRef.current.rotation.z += velocity.x * 5;
        }

        // Update Wire (Cylinder)
        if (lineRef.current) {
            const pivot = new THREE.Vector3(0, 3, 0);
            const spherePos = pos.current.clone();

            // 1. Position: Midpoint
            const mid = new THREE.Vector3().addVectors(pivot, spherePos).multiplyScalar(0.5);
            lineRef.current.position.copy(mid);

            // 2. Orientation: LookAt Sphere
            lineRef.current.lookAt(spherePos);
            // Cylinder stands on Y by default, so we rotate 90 deg on X to point it? 
            // Actually, lookAt points Z towards target. Cylinder is Y-up.
            // We need to rotate X by 90deg to align Y-axis with Z-axis?
            // Easier: Standard lookAt points +Z.
            lineRef.current.rotateX(Math.PI / 2);

            // 3. Height (Length)
            const len = pivot.distanceTo(spherePos);
            lineRef.current.scale.y = len;
        }
    });

    return (
        <group>
            {/* The Wire (Cylinder) */}
            <mesh ref={lineRef as any} castShadow receiveShadow>
                <cylinderGeometry args={[0.015, 0.015, 1, 8]} />
                <meshStandardMaterial color={COLORS.wire} metalness={0.5} roughness={0.5} />
            </mesh>

            {/* The Heavy Sphere */}
            <mesh
                ref={sphereRef}
                position={[0, -PHYSICS.wireLength, 0]}
                castShadow
                receiveShadow
                onPointerDown={handlePointerDown}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
            >
                <sphereGeometry args={[PHYSICS.sphereRadius, 64, 64]} />
                <meshStandardMaterial
                    color={COLORS.sphere}
                    metalness={0.9}
                    roughness={0.1}
                    envMapIntensity={1.5}
                />
            </mesh>

            {/* Shadow catcher */}
            <ContactShadows
                position={[0, -4.5, 0]}
                opacity={0.4}
                scale={20}
                blur={2.5}
                far={10}
                resolution={512}
                color="#000000"
            />
        </group>
    );
}

export default function SonicMistBackground() {
    return (
        <div className="fixed inset-0 z-0 w-full h-full bg-[#e8e6e1]">
            <Canvas
                shadows
                dpr={[1, 2]}
                camera={{ position: [0, 0, 10], fov: 45 }}
                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
            >
                {/* --- LIGHTING (The Sunset Room) --- */}
                <ambientLight intensity={0.5} />
                <directionalLight
                    position={[5, 5, 5]}
                    intensity={2}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                    color="#ffdcb4" // Warm sunset
                />
                <Environment preset="sunset" />

                {/* --- PHYSICS OBJECT --- */}
                <Pendulum />

                {/* --- POST FX (Optional, keeping it clean for now) --- */}
            </Canvas>

            {/* Vignette Overlay for "Room" feel */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.1)_100%)]" />
        </div>
    );
}
