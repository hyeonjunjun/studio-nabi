"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * HeroSurface
 * ───────────
 * A high-performance GLSL fluid shader background inspired by Paolo Vendramini.
 * Offloads environmental rendering to the GPU for zero main-thread impact.
 */

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Simple simplex noise implementation
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 a0 = x - floor(x + 0.5);
    vec3 m1 = 1.0 - 1.5 * (a0*a0 + h*h);
    vec3 g = a0 * m1 + h * (1.0 - m1);
    float n = 130.0 * dot(m, g);
    return n;
  }

  void main() {
    vec2 uv = vUv;
    float time = uTime * 0.2;
    
    // Create organic liquid motion
    float n = snoise(uv * 3.0 + time);
    n += 0.5 * snoise(uv * 6.0 - time * 0.5);
    
    // Smooth obsidian gradient base
    vec3 col1 = vec3(0.02, 0.02, 0.02); // Deep Obsidian
    vec3 col2 = vec3(0.05, 0.05, 0.06); // Graphite
    vec3 finalColor = mix(col1, col2, n * 0.5 + 0.5);
    
    // Solar Aura (Interactive Light)
    float dist = distance(uv, uMouse);
    float glow = smoothstep(0.4, 0.0, dist);
    vec3 auraColor = vec3(0.54, 0.62, 0.42); // Sage Glow (#8b9e6b)
    finalColor = mix(finalColor, auraColor, glow * 0.15);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function ShaderMaterial() {
    const meshRef = useRef<THREE.Mesh>(null!);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: { value: new THREE.Vector2(0, 0) }
    }), []);

    useFrame((state) => {
        uniforms.uTime.value = state.clock.getElapsedTime();
        uniforms.uMouse.value.lerp(new THREE.Vector2(state.mouse.x * 0.5 + 0.5, state.mouse.y * 0.5 + 0.5), 0.05);
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
}

export default function HeroSurface() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <ShaderMaterial />
            </Canvas>
        </div>
    );
}
