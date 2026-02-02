"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

const FogShader = () => {
    const mesh = useRef<THREE.Mesh>(null);
    const { viewport, mouse } = useThree();

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(1, 1) }, // Updated in useFrame if needed or just use UVs
            uMouse: { value: new THREE.Vector2(0, 0) },
            uColor1: { value: new THREE.Color("#050505") }, // Darkest (Base)
            uColor2: { value: new THREE.Color("#111111") }, // Mid
            uColor3: { value: new THREE.Color("#1A1A1A") }, // Highlight
        }),
        []
    );

    useFrame((state) => {
        if (mesh.current) {
            mesh.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
            // Smooth mouse transition
            const targetMouseX = (state.mouse.x * 0.5) + 0.5; // 0 to 1
            const targetMouseY = (state.mouse.y * 0.5) + 0.5;

            // Simple lerp for mouse interaction in shader
            mesh.current.material.uniforms.uMouse.value.lerp(new THREE.Vector2(targetMouseX, targetMouseY), 0.05);
        }
    });

    return (
        <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                fragmentShader={fragmentShader}
                vertexShader={vertexShader}
                uniforms={uniforms}
            />
        </mesh>
    );
};

export default function AmbientBackground() {
    return (
        <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none">
            {/* CANVAS */}
            <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
                <FogShader />
            </Canvas>

            {/* FILM GRAIN OVERLAY */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* VIGNETTE */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_120%)] opacity-60" />
        </div>
    );
}

// -----------------------------------------------------------------------------
// SHADERS
// -----------------------------------------------------------------------------

const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

// SOPHISTICATED FBM + DOMAIN WARPING SHADER
const fragmentShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    varying vec2 vUv;

    // ----------------------------------------
    // Noise Functions
    // ----------------------------------------
    float random(in vec2 _st) {
        return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    float noise(in vec2 _st) {
        vec2 i = floor(_st);
        vec2 f = fract(_st);

        // Cubic Hermite Curve
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
        // Rotate to reduce axial bias
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
        
        // Correct aspect ratio if needed, but UV is 0-1.
        // We want the noise to drift slowly.
        
        // INTERACTIVITY: Mouse influence warps the coordinate space slightly
        vec2 mouseOffset = (uMouse - 0.5) * 0.2; 
        
        // ----------------------------------------
        // Domain Warping Logic (The "Fluid" look)
        // ----------------------------------------
        vec2 q = vec2(0.);
        q.x = fbm( st + 0.05*uTime );
        q.y = fbm( st + vec2(1.0));

        vec2 r = vec2(0.);
        r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*uTime + mouseOffset );
        r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*uTime );

        float f = fbm(st+r);

        // ----------------------------------------
        // Coloring
        // ----------------------------------------
        // Mix colors based on the final noise value 'f' and the intermediate length of 'q'
        // This gives simulated depth/lighting.
        
        vec3 color = mix(uColor1, uColor2, clamp((f*f)*4.0, 0.0, 1.0));
        
        // Add "Rim Light" or highlights
        color = mix(color, uColor3, clamp(length(q), 0.0, 1.0));
        
        // Final contrast curve to keep it dark and moody
        color = mix(color, uColor1, 1.0 - smoothstep(0.0, 1.0, f*1.8));

        gl_FragColor = vec4(color, 1.0);
    }
`;
