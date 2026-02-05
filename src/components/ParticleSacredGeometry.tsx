import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

export default function ParticleSacredGeometry() {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene>(null);
    const rendererRef = useRef<THREE.WebGLRenderer>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const animationIdRef = useRef<number>(null);
    const composerRef = useRef<EffectComposer>(null);
    const [isRotating, setIsRotating] = useState(true);

    // Custom shader for film grain + vignette
    const filmGrainShader = {
        uniforms: {
            tDiffuse: { value: null },
            time: { value: 0 },
            grainIntensity: { value: 0.12 },
            vignetteStrength: { value: 0.6 }
        },
        vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
        fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float time;
      uniform float grainIntensity;
      uniform float vignetteStrength;
      varying vec2 vUv;
      
      float random(vec2 co) {
        return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      void main() {
        vec4 color = texture2D(tDiffuse, vUv);
        
        // Film grain
        float grain = random(vUv * time) * grainIntensity;
        color.rgb += grain;
        
        // Vignette
        vec2 center = vUv - 0.5;
        float vignette = 1.0 - dot(center, center) * vignetteStrength;
        color.rgb *= vignette;
        
        gl_FragColor = color;
      }
    `
    };

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        scene.fog = new THREE.Fog(0x000000, 5, 15);
        sceneRef.current = scene;

        // Camera setup - closer and more focused
        const camera = new THREE.PerspectiveCamera(
            50,
            containerRef.current.clientWidth / containerRef.current.clientHeight,
            0.1,
            100
        );
        camera.position.set(0, 3, 12);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ReinhardToneMapping;
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Post-processing setup
        const composer = new EffectComposer(renderer);
        composerRef.current = composer;

        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        // Strong bloom for particle glow
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            2.0,  // strength
            0.6,  // radius
            0.3   // threshold
        );
        composer.addPass(bloomPass);

        // Film grain + vignette
        const filmPass = new ShaderPass(filmGrainShader);
        composer.addPass(filmPass);

        // PARTICLE SYSTEM CREATION

        // Create nested torus particles
        const createTorusParticles = (count: number, radius: number, tube: number, color: THREE.Color) => {
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            const sizes = new Float32Array(count);

            const c = new THREE.Color(color);

            for (let i = 0; i < count; i++) {
                const u = (i / count) * Math.PI * 2;
                const v = Math.random() * Math.PI * 2;

                const x = (radius + tube * Math.cos(v)) * Math.cos(u);
                const y = (radius + tube * Math.cos(v)) * Math.sin(u);
                const z = tube * Math.sin(v);

                positions[i * 3] = x;
                positions[i * 3 + 1] = y;
                positions[i * 3 + 2] = z;

                colors[i * 3] = c.r;
                colors[i * 3 + 1] = c.g;
                colors[i * 3 + 2] = c.b;

                sizes[i] = 0.03 + Math.random() * 0.02;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

            const material = new THREE.PointsMaterial({
                size: 0.05,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
                sizeAttenuation: true
            });

            return new THREE.Points(geometry, material);
        };

        // Create multiple nested torus rings
        const torusParticles: THREE.Points[] = [];
        for (let i = 0; i < 8; i++) {
            const radius = 1.5 + i * 0.4;
            const tube = 0.15;
            const hue = i / 8;
            const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
            const torus = createTorusParticles(2000, radius, tube, color);
            torus.rotation.x = Math.PI / 2 + i * 0.1;
            torus.rotation.z = i * 0.15;
            torusParticles.push(torus);
            scene.add(torus);
        }

        // Create Fibonacci spiral particles
        const createSpiralParticles = (count: number, turns: number, scale: number, color: THREE.Color) => {
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            const sizes = new Float32Array(count);

            const c = new THREE.Color(color);
            const phi = (1 + Math.sqrt(5)) / 2;

            for (let i = 0; i < count; i++) {
                const t = (i / count) * turns * Math.PI * 2;
                const r = Math.pow(phi, t / (Math.PI * 2)) * scale;
                const x = r * Math.cos(t);
                const y = r * Math.sin(t);
                const z = t * 0.15 - 2;

                positions[i * 3] = x;
                positions[i * 3 + 1] = y;
                positions[i * 3 + 2] = z;

                const intensity = 0.6 + (i / count) * 0.4;
                colors[i * 3] = c.r * intensity;
                colors[i * 3 + 1] = c.g * intensity;
                colors[i * 3 + 2] = c.b * intensity;

                sizes[i] = 0.04 + (i / count) * 0.03;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

            const material = new THREE.PointsMaterial({
                size: 0.06,
                vertexColors: true,
                transparent: true,
                opacity: 0.9,
                blending: THREE.AdditiveBlending,
                sizeAttenuation: true
            });

            return new THREE.Points(geometry, material);
        };

        // Multiple spirals
        const spirals: THREE.Points[] = [];
        for (let i = 0; i < 6; i++) {
            const color = new THREE.Color().setHSL(0.5 + i * 0.1, 1, 0.6);
            const spiral = createSpiralParticles(1500, 4, 1.2, color);
            spiral.rotation.x = Math.PI / 2;
            spiral.rotation.z = (i / 6) * Math.PI * 2;
            spirals.push(spiral);
            scene.add(spiral);
        }

        // Concentric circle particles
        const createCircleParticles = (radius: number, count: number, color: THREE.Color) => {
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            const sizes = new Float32Array(count);

            const c = new THREE.Color(color);

            for (let i = 0; i < count; i++) {
                const angle = (i / count) * Math.PI * 2;
                positions[i * 3] = Math.cos(angle) * radius;
                positions[i * 3 + 1] = 0;
                positions[i * 3 + 2] = Math.sin(angle) * radius;

                colors[i * 3] = c.r;
                colors[i * 3 + 1] = c.g;
                colors[i * 3 + 2] = c.b;

                sizes[i] = 0.02 + Math.random() * 0.015;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

            const material = new THREE.PointsMaterial({
                size: 0.04,
                vertexColors: true,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending,
                sizeAttenuation: true
            });

            return new THREE.Points(geometry, material);
        };

        // Multiple concentric circles
        const circles: THREE.Points[] = [];
        for (let i = 1; i <= 20; i++) {
            const radius = i * 0.3;
            const hue = 0.6 - i * 0.02;
            const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
            const circle = createCircleParticles(radius, Math.floor(radius * 80), color);
            circle.rotation.x = -Math.PI / 2;
            circles.push(circle);
            scene.add(circle);
        }

        // Central dense particle sphere
        const createCentralSphere = (count: number) => {
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            const sizes = new Float32Array(count);

            for (let i = 0; i < count; i++) {
                const phi = Math.acos(2 * Math.random() - 1);
                const theta = Math.random() * Math.PI * 2;
                const r = 0.5 + Math.random() * 0.3;

                positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
                positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                positions[i * 3 + 2] = r * Math.cos(phi);

                const hue = 0.5 + Math.random() * 0.2;
                const c = new THREE.Color().setHSL(hue, 1, 0.7);
                colors[i * 3] = c.r;
                colors[i * 3 + 1] = c.g;
                colors[i * 3 + 2] = c.b;

                sizes[i] = 0.05 + Math.random() * 0.03;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

            const material = new THREE.PointsMaterial({
                size: 0.08,
                vertexColors: true,
                transparent: true,
                opacity: 1,
                blending: THREE.AdditiveBlending,
                sizeAttenuation: true
            });

            return new THREE.Points(geometry, material);
        };

        const centralSphere = createCentralSphere(3000);
        scene.add(centralSphere);

        // Radial particle lines
        const createRadialParticles = () => {
            const group: THREE.Points[] = [];
            for (let i = 0; i < 36; i++) {
                const angle = (i / 36) * Math.PI * 2;
                const count = 100;
                const positions = new Float32Array(count * 3);
                const colors = new Float32Array(count * 3);
                const sizes = new Float32Array(count);

                const c = new THREE.Color().setHSL(0.55 + i * 0.01, 0.7, 0.5);

                for (let j = 0; j < count; j++) {
                    const r = (j / count) * 6;
                    positions[j * 3] = Math.cos(angle) * r;
                    positions[j * 3 + 1] = 0;
                    positions[j * 3 + 2] = Math.sin(angle) * r;

                    const alpha = 1 - (j / count);
                    colors[j * 3] = c.r * alpha;
                    colors[j * 3 + 1] = c.g * alpha;
                    colors[j * 3 + 2] = c.b * alpha;

                    sizes[j] = 0.02 * alpha;
                }

                const geometry = new THREE.BufferGeometry();
                geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
                geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

                const material = new THREE.PointsMaterial({
                    size: 0.03,
                    vertexColors: true,
                    transparent: true,
                    opacity: 0.4,
                    blending: THREE.AdditiveBlending,
                    sizeAttenuation: true
                });

                const line = new THREE.Points(geometry, material);
                group.push(line);
                scene.add(line);
            }
            return group;
        };

        const radialLines = createRadialParticles();

        // Ambient particle field
        const createAmbientParticles = (count: number) => {
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            const sizes = new Float32Array(count);

            for (let i = 0; i < count; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 15;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

                const c = new THREE.Color().setHSL(0.5 + Math.random() * 0.2, 0.8, 0.5);
                colors[i * 3] = c.r;
                colors[i * 3 + 1] = c.g;
                colors[i * 3 + 2] = c.b;

                sizes[i] = 0.015 + Math.random() * 0.02;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

            const material = new THREE.PointsMaterial({
                size: 0.03,
                vertexColors: true,
                transparent: true,
                opacity: 0.3,
                blending: THREE.AdditiveBlending,
                sizeAttenuation: true
            });

            return new THREE.Points(geometry, material);
        };

        const ambientParticles = createAmbientParticles(2000);
        scene.add(ambientParticles);

        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;
        let targetRotationX = 0;
        let targetRotationY = 0;

        const onMouseMove = (event: MouseEvent) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            targetRotationY = mouseX * 0.2;
            targetRotationX = mouseY * 0.15;
        };

        window.addEventListener('mousemove', onMouseMove);

        // Animation
        let time = 0;
        const animate = () => {
            animationIdRef.current = requestAnimationFrame(animate);
            time += 0.003;

            if (isRotating) {
                // Rotate torus particles
                torusParticles.forEach((torus, i) => {
                    torus.rotation.y += 0.001 + i * 0.0001;
                    torus.rotation.z += 0.0005;
                });

                // Rotate spirals
                spirals.forEach((spiral, i) => {
                    spiral.rotation.z += 0.002 - i * 0.0002;
                });

                // Gentle circle rotation
                circles.forEach((circle, i) => {
                    circle.rotation.z += 0.0003 + i * 0.00005;
                });

                // Radial lines pulse
                radialLines.forEach((line, i) => {
                    line.rotation.y += 0.0002;
                });

                // Central sphere pulse
                const scale = 1 + Math.sin(time * 2) * 0.1;
                centralSphere.scale.set(scale, scale, scale);

                // Ambient drift
                ambientParticles.rotation.y += 0.0001;
            }

            // Update particle opacities for pulsing effect
            torusParticles.forEach((torus, i) => {
                // @ts-ignore
                torus.material.opacity = 0.6 + Math.sin(time * 2 + i) * 0.2;
            });

            // Update central sphere colors
            const colors = centralSphere.geometry.attributes.color.array as Float32Array;
            for (let i = 0; i < colors.length; i += 3) {
                const hue = (0.5 + Math.sin(time + i * 0.01) * 0.1) % 1;
                const c = new THREE.Color().setHSL(hue, 1, 0.7);
                colors[i] = c.r;
                colors[i + 1] = c.g;
                colors[i + 2] = c.b;
            }
            centralSphere.geometry.attributes.color.needsUpdate = true;

            // Update post-processing
            if (composerRef.current) {
                const passes = composerRef.current.passes;
                passes.forEach((pass: any) => {
                    if (pass.uniforms && pass.uniforms.time) {
                        pass.uniforms.time.value = time;
                    }
                });
            }

            // Smooth camera orbit
            camera.position.x += (targetRotationY * 5 - camera.position.x) * 0.05;
            camera.position.y += (3 + targetRotationX * 2 - camera.position.y) * 0.05;
            camera.lookAt(0, 0, 0);

            // Render
            if (composerRef.current) {
                composerRef.current.render();
            } else {
                renderer.render(scene, camera);
            }
        };

        animate();

        // Handle window resize
        const handleResize = () => {
            if (!containerRef.current) return;
            camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
            if (composerRef.current) {
                composerRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
            }
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', handleResize);
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [isRotating]);

    return (
        <div className="w-full h-screen bg-black relative">
            <div ref={containerRef} className="w-full h-full" />

            <div className="absolute top-4 left-4 text-white font-mono text-sm space-y-2 bg-black bg-opacity-50 p-4 rounded backdrop-blur-sm pointer-events-none">
                <div className="text-lg font-bold mb-2">Particle Sacred Geometry</div>
                <div className="text-xs opacity-75">Pure particle system</div>
                <div className="text-xs opacity-75 mt-1">
                    <div>• Centralized focus</div>
                    <div>• 15K+ particles</div>
                    <div>• Bloom & grain</div>
                </div>
                <button
                    onClick={() => setIsRotating(!isRotating)}
                    className="mt-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-all pointer-events-auto"
                >
                    {isRotating ? 'Pause' : 'Resume'}
                </button>
            </div>

            <div className="absolute bottom-4 right-4 text-white font-mono text-xs text-right bg-black bg-opacity-50 p-3 rounded backdrop-blur-sm pointer-events-none">
                <div className="opacity-75">100% Particle Based</div>
                <div className="mt-1">Torus • Spiral • Sphere</div>
                <div className="mt-2 opacity-75">Additive Blending</div>
                <div>Dynamic Color Shifting</div>
            </div>
        </div>
    );
}
