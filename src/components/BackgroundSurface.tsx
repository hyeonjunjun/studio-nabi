"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useLenis } from "lenis/react";

/**
 * BackgroundSurface
 * ───────────
 * Global WebGL fluid substrate.
 * Reacts to scroll velocity (Lenis) to simulate physical drag across the portfolio.
 */

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uVelocity;
  varying vec2 vUv;

  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ; m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 a0 = x - floor(x + 0.5);
    vec3 m1 = 1.0 - 1.5 * (a0*a0 + h*h);
    vec3 g = a0 * m1 + h * (1.0 - m1);
    return 130.0 * dot(m, g);
  }

  // Cinematic high-frequency grain
  float grain(vec2 uv, float time) {
    return fract(sin(dot(uv, vec2(12.9898, 78.233) + time)) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    float time = uTime * 0.12;

    // Distort UV based on scroll velocity (simulating drag/friction)
    // uVelocity comes in as pixels per frame, scale it down.
    float scrollTear = uVelocity * 0.003;
    uv.y += snoise(uv * 10.0 + vec2(0.0, time)) * scrollTear;
    
    // Multi-octave fluid motion (Liquid Obsidian)
    float n = snoise(uv * 1.5 + time);
    n += 0.5 * snoise(uv * 3.0 - time * 0.5 + n * 0.3);
    n += 0.25 * snoise(uv * 6.0 + time * 0.2);
    
    // Add velocity-based turbulence
    n += abs(scrollTear) * 0.5 * snoise(uv * 20.0 - time * 2.0);
    
    // Deep premium background palette
    vec3 base = vec3(0.015, 0.015, 0.018); // Deeper Obsidian
    vec3 flow = vec3(0.035, 0.035, 0.045); // Graphite Flow
    vec3 finalColor = mix(base, flow, n * 0.5 + 0.5);
    
    // Solar Aura (High-Interaction Light)
    vec2 mouse = uMouse;
    float dist = distance(uv, mouse);
    
    // Atmospheric Falloff
    float glow = smoothstep(0.6, 0.0, dist);
    vec3 auraColor = vec3(0.77, 0.64, 0.40); // Gold Glow (#C4A265)
    
    // Chromatic weight and subtle flicker (intensify on scroll)
    float interactionIntensity = glow * 0.16 * (1.0 + n * 0.15);
    interactionIntensity += smoothstep(0.4, 0.0, dist) * abs(scrollTear) * 0.2;
    
    finalColor = mix(finalColor, auraColor, interactionIntensity);

    // Inject high-end grain
    float g = grain(uv, uTime) * 0.035;
    finalColor += g;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function ShaderMaterial() {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const lenis = useLenis();

  useFrame((state) => {
    const mat = matRef.current;
    if (!mat) return;

    mat.uniforms.uTime.value = state.clock.getElapsedTime();
    // Correctly map mouse from [-1, 1] to [0, 1] for the shader
    mat.uniforms.uMouse.value.lerp(new THREE.Vector2(state.mouse.x * 0.5 + 0.5, state.mouse.y * 0.5 + 0.5), 0.05);

    // Map Lenis velocity
    const targetVelocity = lenis?.velocity || 0;
    // Smooth the velocity value so the tear effect degrades smoothly rather than snapping back
    mat.uniforms.uVelocity.value = THREE.MathUtils.lerp(mat.uniforms.uVelocity.value, targetVelocity, 0.05);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uVelocity: { value: 0 },
        }}
        transparent
      />
    </mesh>
  );
}

export default function BackgroundSurface() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <Canvas
        orthographic
        camera={{ left: -1, right: 1, top: 1, bottom: -1, near: 0, far: 1 }}
        gl={{ antialias: false, stencil: false, depth: false }}
        dpr={[1, 2]}
      >
        <ShaderMaterial />
      </Canvas>
    </div>
  );
}
