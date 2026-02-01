"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sky, Cloud, Sparkles, Html } from "@react-three/drei";
import { EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { useControls } from "leva";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";

// --- Sub-Components ---

function TheSky() {
    const { sunPosition, turbidity, rayleigh, mieCoefficient, mieDirectionalG } =
        useControls("The Sky", {
            sunPosition: { value: [0, 0.1, -1], label: "Sun Position" }, // Golden hour-ish
            turbidity: { value: 10, min: 0, max: 20, step: 0.1 },
            rayleigh: { value: 3, min: 0, max: 10, step: 0.1 },
            mieCoefficient: { value: 0.005, min: 0, max: 0.1, step: 0.001 },
            mieDirectionalG: { value: 0.7, min: 0, max: 1, step: 0.01 },
        });

    return (
        <Sky
            sunPosition={sunPosition}
            turbidity={turbidity}
            rayleigh={rayleigh}
            mieCoefficient={mieCoefficient}
            mieDirectionalG={mieDirectionalG}
        />
    );
}

function CloudLayer({
    speed = 0.5,
    opacity = 1,
    segments = 20,
    bounds = [10, 2, 10],
    position = [0, 0, 0],
    color = "#fff0f5",
    volume = 10,
    seed = 1,
}: {
    speed?: number;
    opacity?: number;
    segments?: number;
    bounds?: [number, number, number];
    position?: [number, number, number];
    color?: string;
    volume?: number;
    seed?: number;
}) {
    const group = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (group.current) {
            // Gentle drift
            group.current.position.x += delta * speed * 0.1;
            // Wrap around? Or just let them drift. For a "gazing" scene, just drifting is fine.
            // Ideally we reset them, but for this demo, simple drift is okay.
            // Let's add a sine wave bobbing too
            group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.2 * speed) * 0.5;
        }
    });

    return (
        <group ref={group} position={position}>
            <Cloud
                seed={seed}
                segments={segments}
                bounds={bounds}
                volume={volume}
                color={color}
                opacity={opacity}
                fade={10}
                speed={speed * 0.5} // Internal cloud churn
            />
        </group>
    );
}

function CameraRig() {
    const { mouse } = useThree();

    useFrame((state) => {
        // Breathing motion (vertical sine wave)
        const time = state.clock.elapsedTime;
        const breathing = Math.sin(time * 0.5) * 0.2; // Slow gentle breath

        // Parallax (mouse x/y affects rotation slightly)
        const parallaxX = (mouse.x * 0.1); // subtle pan left/right
        const parallaxY = (mouse.y * 0.05); // subtle tilt up/down

        // Base look-up rotation (Euler)
        // Looking up at ~25 degrees. 
        // Camera is naturally at 0,0,0 looking down -Z. 
        // To look up, we rotate X.

        // We can just lerp the position/rotation for smoothness
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 1 + breathing, 0.05);

        // Rotate camera to look up
        // Base X rotation = 0.4 (approx 23 deg). 
        state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, 0.4 - parallaxY, 0.05);
        state.camera.rotation.y = THREE.MathUtils.lerp(state.camera.rotation.y, -parallaxX, 0.05);
    });

    return null;
}

function TheVibe() {
    const { noiseOpacity, vignetteDarkness, particleCount, particleSpeed } = useControls("The Vibe", {
        noiseOpacity: { value: 0.05, min: 0, max: 0.2, step: 0.01 },
        vignetteDarkness: { value: 0.5, min: 0, max: 1, step: 0.05 },
        particleCount: { value: 50, min: 0, max: 200 },
        particleSpeed: { value: 0.5, min: 0, max: 2 },
    });

    return (
        <>
            <Sparkles
                count={particleCount}
                scale={12}
                size={3}
                speed={particleSpeed}
                opacity={0.6}
                color="#fff"
                position={[0, 5, -5]} // In front/above viewer
            />
            <EffectComposer enableNormalPass={false}>
                <Noise opacity={noiseOpacity} />
                <Vignette eskil={false} offset={0.1} darkness={vignetteDarkness} />
            </EffectComposer>
        </>
    );
}

// --- Main Component ---

export default function SkyHero() {
    const {
        cloudColor, cloudOpacity,
        layer1Speed, layer2Speed, layer3Speed
    } = useControls("Clouds", {
        cloudColor: { value: "#fff0f5", label: "Cloud Tint" }, // Lavender tint
        cloudOpacity: { value: 0.8, min: 0, max: 1, step: 0.05 },
        layer1Speed: { value: 0.5, label: "Close Speed" },
        layer2Speed: { value: 0.2, label: "Mid Speed" },
        layer3Speed: { value: 0.05, label: "Far Speed" },
    });

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <Canvas dpr={[1, 2]} camera={{ position: [0, 1, 0], fov: 75 }}>
                <Suspense fallback={<Html center>Loading Nature...</Html>}>
                    <TheSky />

                    {/* Layer 1: Close, fast wisps */}
                    <CloudLayer
                        speed={layer1Speed}
                        opacity={cloudOpacity * 0.8}
                        segments={10}
                        bounds={[5, 1, 5]}
                        position={[0, 8, -5]}
                        color={cloudColor}
                        volume={6}
                        seed={10}
                    />

                    {/* Layer 2: Mid, fluffy massive */}
                    <CloudLayer
                        speed={layer2Speed}
                        opacity={cloudOpacity}
                        segments={30}
                        bounds={[20, 4, 10]}
                        position={[5, 15, -20]}
                        color={cloudColor}
                        volume={15}
                        seed={20}
                    />

                    {/* Layer 3: Far, high cirrus */}
                    <CloudLayer
                        speed={layer3Speed}
                        opacity={cloudOpacity * 0.7}
                        segments={40}
                        bounds={[10, 2, 40]}
                        position={[-10, 30, -50]}
                        color={cloudColor}
                        volume={25}
                        seed={30}
                    />

                    <TheVibe />
                    <CameraRig />
                </Suspense>
            </Canvas>
        </div>
    );
}
