"use client";

import { useRef, useEffect, useCallback } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ── Shader sources ── */

const VERT_SRC = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

/*
 * Watercolor city skyline — multi-technique fragment shader
 *
 * Key techniques for realistic watercolor:
 * 1. Domain warping (fbm of fbm) for organic shapes
 * 2. Translucent pigment layers — paper shows through
 * 3. Edge darkening — pigment pools at wet boundaries (cauliflower effect)
 * 4. Paper grain interaction — pigment fills valleys, skips peaks
 * 5. Horizontal brush stroke texture
 * 6. Atmospheric perspective — far layers desaturated + lightened
 * 7. Wet-on-wet color bleeding at layer boundaries
 */
const FRAG_SRC = `
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

/* ── Warm watercolor palette ── */
const vec3 PAPER     = vec3(0.965, 0.957, 0.940);
const vec3 SKY_TOP   = vec3(0.58, 0.68, 0.82);
const vec3 SKY_MID   = vec3(0.76, 0.70, 0.74);
const vec3 HORIZON   = vec3(0.94, 0.82, 0.72);
const vec3 SUN_GLOW  = vec3(0.98, 0.88, 0.70);
const vec3 FAR_WASH  = vec3(0.65, 0.68, 0.76);
const vec3 MID_WASH  = vec3(0.42, 0.44, 0.55);
const vec3 NEAR_WASH = vec3(0.22, 0.22, 0.30);
const vec3 WARM_ACC  = vec3(0.72, 0.48, 0.35);
const vec3 COOL_ACC  = vec3(0.45, 0.52, 0.65);
const vec3 WIN_GLOW  = vec3(1.0, 0.88, 0.55);
const vec3 REFLECT   = vec3(0.30, 0.35, 0.50);

/* ── Hash (fast, well-distributed) ── */
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

/* ── Value noise — quintic Hermite interpolation ── */
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(
    mix(hash(i), hash(i + vec2(1, 0)), u.x),
    mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x),
    u.y
  );
}

/* ── FBM — 5 octaves with rotation ── */
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.0;
    a *= 0.5;
  }
  return v;
}

/* ── Domain-warped FBM — organic, painterly shapes ── */
float warpedFbm(vec2 p) {
  vec2 q = vec2(fbm(p), fbm(p + vec2(5.2, 1.3)));
  return fbm(p + q * 1.5);
}

/* ── Paper grain — two frequencies for realistic texture ── */
float paperGrain(vec2 p) {
  float coarse = noise(p * 45.0);
  float fine = noise(p * 120.0);
  /* Paper fibers are slightly directional */
  float fiber = noise(p * vec2(30.0, 80.0));
  return coarse * 0.5 + fine * 0.3 + fiber * 0.2;
}

/* ── Building skyline profile ── */
float skyline(float x, float scale, float seed, float base, float range) {
  float bx = floor(x * scale);
  float h = hash(vec2(bx, seed));

  /* Wide building overlay */
  float bx2 = floor(x * scale * 0.3);
  float h2 = hash(vec2(bx2, seed + 17.0));
  h = max(h, h2 * 0.85);

  /* Tall towers (sparse) */
  float tower = step(0.88, hash(vec2(bx + 0.5, seed + 7.0)));
  h = h + tower * 0.35;

  /* Antenna/spire on some towers */
  float spire = step(0.92, hash(vec2(bx, seed + 11.0)));
  float inSpire = step(abs(fract(x * scale) - 0.5), 0.03);
  h = h + spire * inSpire * 0.15;

  return base + clamp(h, 0.0, 1.2) * range;
}

/* ── Watercolor wash — the core rendering technique ──
   Returns (pigment_density, edge_darkening) for a building layer.
   Pigment is TRANSLUCENT — paper shows through. */
vec2 watercolorWash(float y, float edge, vec2 p, float brushScale) {
  /* Domain-warped edge for organic paint boundary */
  float warp = (warpedFbm(p * 8.0 + 3.0) - 0.5) * 0.06;
  float warpedEdge = edge + warp;

  /* Soft feathered boundary (wide transition = wet paint spreading) */
  float featherW = 0.015 + fbm(p * 15.0) * 0.02;
  float mask = smoothstep(warpedEdge + featherW, warpedEdge - featherW * 0.5, y);

  /* Horizontal brush stroke texture */
  float brush = noise(p * vec2(brushScale * 0.6, brushScale * 3.0));
  mask *= 0.7 + brush * 0.35;

  /* Pigment density variation within the wash (lighter in middle, pools at edges) */
  float distFromEdge = max(warpedEdge - y, 0.0);
  float innerLightness = smoothstep(0.0, 0.12, distFromEdge) * 0.2;
  float density = mask * (1.0 - innerLightness);

  /* Edge darkening — pigment accumulates at the boundary of the wet area */
  float edgeDist = abs(y - warpedEdge);
  float edgeDark = exp(-edgeDist * edgeDist * 3000.0) * mask;
  /* Cauliflower edge irregularity */
  edgeDark *= 0.6 + noise(p * 40.0) * 0.8;

  return vec2(density, edgeDark);
}

/* ── Apply translucent pigment over existing color ── */
vec3 applyPigment(vec3 base, vec3 pigment, float density, float edgeDark, float grain) {
  /* Paper grain resists pigment — lighter on raised fibers */
  float grainResist = 1.0 - grain * 0.35;
  float finalDensity = density * grainResist;

  /* Translucent blend — paper luminosity shows through */
  vec3 result = mix(base, pigment, finalDensity * 0.85);

  /* Edge darkening (darker pigment at boundary) */
  result -= edgeDark * 0.15;

  return result;
}

/* ── Window lights ── */
float windowGrid(vec2 uv, float top, float bot, float seed, float t) {
  float cw = 0.014;
  float ch = 0.020;
  vec2 wid = vec2(floor(uv.x / cw), floor((uv.y - bot) / ch));
  vec2 cell = vec2(mod(uv.x, cw) / cw, mod(uv.y - bot, ch) / ch);

  /* Window shape — tall rectangles */
  float inWin = step(0.22, cell.x) * step(cell.x, 0.78)
              * step(0.15, cell.y) * step(cell.y, 0.85);

  float inBounds = step(bot + 0.012, uv.y) * step(uv.y, top - 0.008);

  /* ~30% lit with warm/cool variation */
  float lit = step(0.70, hash(wid + seed));

  /* Staggered reveal */
  float delay = hash(wid * 0.7 + seed + 50.0) * 4.0;
  float on = smoothstep(3.0 + delay, 3.8 + delay, t);

  /* Glow falloff */
  vec2 c = vec2(0.5, 0.5);
  float glow = exp(-dot(cell - c, cell - c) * 6.0) * 0.5;

  return (inWin * 0.6 + glow) * inBounds * lit * on;
}

/* ── Paint-in reveal ── */
float reveal(float x, float t, float start, float dur) {
  float p = clamp((t - start) / dur, 0.0, 1.0);
  p = p * p * (3.0 - 2.0 * p);
  float edge = p * 1.35 - 0.15;
  return smoothstep(edge - 0.06, edge + 0.01, x);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = u_time;

  /* Paper grain (computed once, used everywhere) */
  float grain = paperGrain(p);

  /* ────────────────── SKY ────────────────── */
  float skyIn = smoothstep(0.0, 2.0, t);

  /* Rich multi-stop sky gradient */
  vec3 sky = HORIZON;
  sky = mix(sky, SKY_MID, smoothstep(0.15, 0.5, uv.y));
  sky = mix(sky, SKY_TOP, smoothstep(0.45, 0.95, uv.y));

  /* Sun glow near horizon (slightly off-center) */
  float sunX = 0.6;
  float sunDist = length(vec2((uv.x - sunX) * aspect, uv.y - 0.25));
  sky = mix(sky, SUN_GLOW, exp(-sunDist * sunDist * 4.0) * 0.4);

  /* Large watercolor washes in sky (domain-warped for organic shapes) */
  float skyWash1 = warpedFbm(p * 2.5 + vec2(0.0, t * 0.002));
  float skyWash2 = warpedFbm(p * 1.8 + vec2(10.0, t * 0.003));
  sky += (skyWash1 - 0.5) * 0.10;
  sky = mix(sky, COOL_ACC, smoothstep(0.55, 0.7, skyWash2) * 0.08);

  /* Warm accent streaks near horizon */
  float warmStreak = fbm(vec2(p.x * 4.0, p.y * 0.5 + 3.0));
  sky = mix(sky, WARM_ACC * 1.1, smoothstep(0.35, 0.12, uv.y) * warmStreak * 0.12);

  /* Paper grain shows through sky wash */
  sky = mix(sky, PAPER, grain * 0.15);

  vec3 color = mix(PAPER, sky, skyIn);

  /* ────────────────── BUILDINGS ────────────────── */

  /* ── Layer 1: Far (misty, desaturated) ── */
  float farTop = skyline(p.x, 12.0, 1.0, 0.30, 0.30);
  vec2 farWC = watercolorWash(uv.y, farTop, p + 1.0, 25.0);
  farWC.x *= reveal(uv.x, t, 0.6, 2.2);

  vec3 farPig = FAR_WASH;
  /* Temperature variation per building */
  float farTemp = hash(vec2(floor(p.x * 12.0), 1.0));
  farPig = mix(farPig, COOL_ACC, (farTemp - 0.5) * 0.15);
  farPig = mix(farPig, WARM_ACC, fbm(p * 5.0 + 8.0) * 0.06);

  color = applyPigment(color, farPig, farWC.x * 0.55, farWC.y * 0.5, grain);

  float farWin = windowGrid(uv, farTop, 0.18, 10.0, t);
  color += farWin * farWC.x * WIN_GLOW * 0.2;

  /* ── Layer 2: Mid ── */
  float midTop = skyline(p.x, 16.0, 5.0, 0.18, 0.38);
  vec2 midWC = watercolorWash(uv.y, midTop, p + 4.0, 30.0);
  midWC.x *= reveal(uv.x, t, 1.3, 2.2);

  vec3 midPig = MID_WASH;
  float midTemp = hash(vec2(floor(p.x * 16.0), 5.0));
  midPig = mix(midPig, COOL_ACC * 0.8, (midTemp - 0.3) * 0.12);
  midPig = mix(midPig, WARM_ACC, fbm(p * 4.0 + 15.0) * 0.08);

  color = applyPigment(color, midPig, midWC.x * 0.7, midWC.y * 0.7, grain);

  float midWin = windowGrid(uv, midTop, 0.06, 20.0, t);
  color += midWin * midWC.x * WIN_GLOW * 0.4;

  /* ── Layer 3: Near (dark, saturated) ── */
  float nearTop = skyline(p.x, 8.0, 9.0, 0.06, 0.30);
  vec2 nearWC = watercolorWash(uv.y, nearTop, p + 8.0, 20.0);
  nearWC.x *= reveal(uv.x, t, 2.0, 2.2);

  vec3 nearPig = NEAR_WASH;
  float nearTemp = hash(vec2(floor(p.x * 8.0), 9.0));
  nearPig = mix(nearPig, vec3(0.18, 0.15, 0.25), (nearTemp - 0.5) * 0.15);

  color = applyPigment(color, nearPig, nearWC.x * 0.88, nearWC.y, grain);

  float nearWin = windowGrid(uv, nearTop, 0.01, 30.0, t);
  color += nearWin * nearWC.x * WIN_GLOW * 0.6;

  /* ────────────────── WATER REFLECTION ────────────────── */
  /* Thin strip at bottom — blurred, inverted skyline reflection */
  float refZone = smoothstep(0.06, 0.0, uv.y);
  float refY = 0.06 - uv.y; /* mirror coordinate */
  float refNoise = fbm(vec2(p.x * 3.0, refY * 8.0 + t * 0.02));

  /* Reflected skyline (blurry, color-shifted) */
  float refLine = skyline(p.x + refNoise * 0.05, 8.0, 9.0, 0.0, 0.30);
  float refMask = step(refY, refLine * 0.4) * refZone;
  vec3 refCol = mix(REFLECT, MID_WASH, 0.3);
  refCol += refNoise * 0.1;

  color = mix(color, refCol, refMask * 0.3);

  /* Ripple highlights in water */
  float ripple = noise(vec2(p.x * 30.0, uv.y * 5.0 + t * 0.3));
  color += ripple * refZone * 0.04;

  /* ────────────────── ATMOSPHERIC GLOW ────────────────── */
  /* City light glow above skyline */
  float glowZone = smoothstep(0.10, 0.30, uv.y) * smoothstep(0.60, 0.25, uv.y);
  float cityGlow = smoothstep(5.0, 8.0, t) * glowZone;
  float glowPattern = fbm(vec2(p.x * 2.0, uv.y * 4.0));
  color += WIN_GLOW * cityGlow * glowPattern * 0.03;

  /* ────────────────── CURSOR INTERACTION ────────────────── */
  vec2 mp = vec2(u_mouse.x * aspect, u_mouse.y);
  float md = length(p - mp);
  /* Organic watercolor bloom shape */
  float bloom = exp(-md * md * 6.0) * 0.20;
  bloom *= 0.7 + warpedFbm(p * 8.0 + mp) * 0.6;
  /* Paper grain resists bloom too */
  bloom *= 1.0 - grain * 0.3;
  vec3 bloomCol = mix(WARM_ACC, SUN_GLOW, 0.4);
  color = mix(color, bloomCol, bloom);

  /* ────────────────── FINAL COMPOSITING ────────────────── */

  /* Paper texture overlay — paint sits IN the paper grain */
  float paperTex = paperGrain(p * 1.1 + 0.5);
  color *= 0.94 + paperTex * 0.12;

  /* Subtle color fringing at high-contrast edges (chromatic separation) */
  float edgeDetect = abs(nearWC.y) + abs(midWC.y) * 0.5;
  color.r += edgeDetect * 0.015;
  color.b -= edgeDetect * 0.01;

  /* Vignette — warm-tinted, oval */
  float vig = 1.0 - length((uv - vec2(0.5, 0.45)) * vec2(1.1, 0.9)) * 0.3;
  color *= vig;

  /* Gentle living movement after paint-in */
  float alive = smoothstep(5.0, 9.0, t);
  float drift = fbm(p * 6.0 + vec2(t * 0.008, t * 0.005)) - 0.5;
  color += drift * 0.006 * alive;

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

/* ── WebGL helpers ── */

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function linkProgram(
  gl: WebGLRenderingContext,
  vs: WebGLShader,
  fs: WebGLShader
): WebGLProgram | null {
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("Program link:", gl.getProgramInfoLog(prog));
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

/* ── Component ── */

interface WatercolorSkylineProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function WatercolorSkyline({
  className,
  style,
}: WatercolorSkylineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const rafRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const startRef = useRef(0);
  const prefersReduced = useReducedMotion();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - r.left) / r.width,
      y: 1 - (e.clientY - r.top) / r.height,
    };
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const c = canvasRef.current;
    if (!c || !e.touches[0]) return;
    const r = c.getBoundingClientRect();
    const touch = e.touches[0];
    mouseRef.current = {
      x: (touch.clientX - r.left) / r.width,
      y: 1 - (touch.clientY - r.top) / r.height,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) return;
    glRef.current = gl;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vs || !fs) return;
    const prog = linkProgram(gl, vs, fs);
    if (!prog) return;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(prog);
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    startRef.current = performance.now() / 1000;

    const render = () => {
      const now = performance.now() / 1000;
      const t = prefersReduced ? 20.0 : now - startRef.current;

      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!prefersReduced) {
        rafRef.current = requestAnimationFrame(render);
      }
    };

    if (prefersReduced) {
      render();
    } else {
      rafRef.current = requestAnimationFrame(render);
    }

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [prefersReduced, handleMouseMove, handleTouchMove]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        cursor: "crosshair",
        ...style,
      }}
      aria-label="Watercolor city skyline — move cursor to paint"
      role="img"
    />
  );
}
