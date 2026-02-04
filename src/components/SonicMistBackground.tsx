"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

const FogShader = () => {
    const mesh = useRef<THREE.Mesh>(null);
    const { viewport } = useThree();

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(1, 1) },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uAudioPulse: { value: 0 },
            uColor1: { value: new THREE.Color("#050505") }, // Darkest (Base)
            uColor2: { value: new THREE.Color("#1a1a1a") }, // Mid
            uColor3: { value: new THREE.Color("#2a2a2a") }, // Highlight
        }),
        []
    );

    useFrame((state) => {
        if (mesh.current) {
            const material = mesh.current.material as THREE.ShaderMaterial;
            const time = state.clock.getElapsedTime();
            material.uniforms.uTime.value = time;

            // Heartbeat pulse simulation (rhythmic)
            // Double peak for realism: lub-dub
            const pulse = (Math.sin(time * 2.0) * 0.5 + 0.5) * 0.3 +
                (Math.sin(time * 4.0 + 1.2) * 0.5 + 0.5) * 0.1;
            material.uniforms.uAudioPulse.value = pulse;

            // Smooth mouse transition
            const targetMouseX = (state.mouse.x * 0.5) + 0.5;
            const targetMouseY = (state.mouse.y * 0.5) + 0.5;
            material.uniforms.uMouse.value.lerp(new THREE.Vector2(targetMouseX, targetMouseY), 0.05);
        }
    });

    return (
        <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                fragmentShader={fragmentShader}
                vertexShader={vertexShader}
                uniforms={uniforms}
                transparent={true}
            />
        </mesh>
    );
};

export default function SonicMistBackground() {
    return (
        <div className="absolute inset-0 z-0 w-full h-full pointer-events-none bg-[#050505]">
            <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
                <FogShader />
            </Canvas>

            {/* SONIC SYMBOLISM: FREQUENCY LINES */}
            <div className="absolute inset-0 flex items-center justify-center opacity-40 overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="sonicGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="white" stopOpacity="0" />
                            <stop offset="50%" stopColor="white" stopOpacity="1" />
                            <stop offset="100%" stopColor="white" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {[...Array(5)].map((_, i) => (
                        <SonicLine key={i} index={i} />
                    ))}
                </svg>
            </div>

            {/* FILM GRAIN OVERLAY */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* VIGNETTE */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_120%)] opacity-80" />
        </div>
    );
}

function SonicLine({ index }: { index: number }) {
    return (
        <line
            x1="0" y1={200 + index * 150}
            x2="1000" y2={200 + index * 150}
            stroke="url(#sonicGradient)"
            strokeWidth="0.5"
            className="animate-pulse"
            style={{
                animationDuration: `${2 + index * 0.5}s`,
                animationDelay: `${index * 0.2}s`
            }}
        />
    );
}

const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform float uTime;
    uniform float uAudioPulse;
    uniform vec2 uMouse;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    varying vec2 vUv;

    // Noise functions
    float random(in vec2 _st) {
        return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    float noise(in vec2 _st) {
        vec2 i = floor(_st);
        vec2 f = fract(_st);
        f = f * f * (3.0 - 2.0 * f);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    #define NUM_OCTAVES 5
    float fbm(in vec2 _st) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
        for (int i = 0; i < NUM_OCTAVES; ++i) {
            v += a * noise(_st);
            _st = rot * _st * 2.0 + shift;
            a *= 0.5;
        }
        return v;
    }

    void main() {
        vec2 st = vUv;
        
        // INTERACTIVITY + PULSE
        vec2 mouseOffset = (uMouse - 0.5) * 0.1;
        float strength = 1.0 + uAudioPulse * 0.5;
        
        // Domain Warping (The "Fluid" look)
        vec2 q = vec2(0.);
        q.x = fbm( st + 0.05*uTime );
        q.y = fbm( st + vec2(1.0));

        vec2 r = vec2(0.);
        r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ (0.15 + uAudioPulse * 0.02)*uTime + mouseOffset );
        r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*uTime );

        float f = fbm(st+r);

        // Coloring
        vec3 color = mix(uColor1, uColor2, clamp((f*f)*4.0, 0.0, 1.0));
        color = mix(color, uColor3, clamp(length(q), 0.0, 1.0));
        
        // Final pulse influence on luminance
        color += uAudioPulse * 0.05 * f;
        
        // Contrast
        color = mix(color, uColor1, 1.0 - smoothstep(0.0, 1.0, f*1.5));

        gl_FragColor = vec4(color, 1.0);
    }
`;
