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

const FRAG_SRC = `
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec2 u_wind;
uniform vec3 u_ripples[8];
uniform float u_ripple_count;

/* Warm ink-on-paper palette — from design tokens */
const vec3 PAPER      = vec3(0.969, 0.965, 0.953);   /* #f7f6f3 */
const vec3 INK_WARM   = vec3(0.545, 0.435, 0.333);   /* warm sepia wash */
const vec3 INK_COOL   = vec3(0.380, 0.400, 0.420);   /* cool blue-grey */
const vec3 INK_DEEP   = vec3(0.220, 0.200, 0.180);   /* concentrated ink */
const vec3 INK_BLUSH  = vec3(0.620, 0.460, 0.400);   /* warm blush undertone */

/* ── Noise primitives ── */

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

/* FBM — 6 octaves for richer detail */
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p = rot * p * 2.0;
    a *= 0.5;
  }
  return v;
}

/* Domain warping — gives ink its organic, flowing character */
float warpedFbm(vec2 p, float t) {
  vec2 q = vec2(
    fbm(p + vec2(0.0, 0.0) + t * 0.012),
    fbm(p + vec2(5.2, 1.3) + t * 0.009)
  );
  vec2 r = vec2(
    fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.006),
    fbm(p + 4.0 * q + vec2(8.3, 2.8) + t * 0.008)
  );
  return fbm(p + 3.5 * r);
}

/* Ripple — ink disturbance from click */
float ripple(vec2 uv, vec2 center, float age) {
  if (age > 4.0 || age < 0.0) return 0.0;
  float dist = length(uv - center);
  float radius = age * 0.18;
  float ring = exp(-pow(dist - radius, 2.0) * 60.0);
  float decay = exp(-age * 1.4);
  return ring * decay * 0.25;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  float t = u_time;

  /* Wind displacement — ink pushed by cursor movement */
  vec2 windOffset = u_wind * 0.04;

  /* Cursor proximity — gentle ink displacement */
  vec2 mousePos = vec2(u_mouse.x * aspect, u_mouse.y);
  float mouseDist = length(p - mousePos);
  vec2 mouseDisplace = (p - mousePos) * 0.02 / (mouseDist * mouseDist + 0.2);

  /* Primary ink wash — slow, organic drift */
  vec2 inkUV = p * 2.2;
  inkUV += windOffset;
  inkUV += mouseDisplace;

  float ink1 = warpedFbm(inkUV, t);

  /* Secondary wash — different scale for depth */
  vec2 inkUV2 = p * 3.5 + vec2(3.1, 7.4);
  inkUV2 += windOffset * 0.7;
  inkUV2 += mouseDisplace * 0.5;
  float ink2 = warpedFbm(inkUV2, t * 0.7);

  /* Tertiary — fine detail wash */
  vec2 inkUV3 = p * 5.0 + vec2(11.3, 4.7);
  float ink3 = fbm(inkUV3 + t * 0.005 + windOffset * 0.3);

  /* Combine washes with different weights */
  float primary = smoothstep(0.32, 0.68, ink1);
  float secondary = smoothstep(0.35, 0.65, ink2) * 0.6;
  float detail = smoothstep(0.4, 0.7, ink3) * 0.25;

  /* Ink concentration — where washes overlap, ink pools darker */
  float concentration = primary + secondary * 0.5;
  concentration = clamp(concentration, 0.0, 1.0);

  /* Pooling at edges — ink naturally settles at boundaries */
  float edgePool = smoothstep(0.45, 0.55, ink1) * smoothstep(0.55, 0.45, ink1);
  edgePool *= 2.5;

  /* Ripple clearings — click disturbs the ink */
  float totalRipple = 0.0;
  for (int i = 0; i < 8; i++) {
    if (float(i) >= u_ripple_count) break;
    totalRipple += ripple(uv, u_ripples[i].xy, t - u_ripples[i].z);
  }
  concentration = clamp(concentration - totalRipple, 0.0, 1.0);
  primary = clamp(primary - totalRipple * 0.8, 0.0, 1.0);

  /* Warm/cool temperature shift based on wash position */
  float temperature = noise(p * 1.5 + t * 0.003);

  /* Color mapping — layered ink washes on paper */
  vec3 color = PAPER;

  /* First wash — warm sepia, very transparent */
  color = mix(color, INK_WARM, primary * 0.22);

  /* Blush undertone in lighter areas */
  color = mix(color, INK_BLUSH, secondary * 0.12);

  /* Cool ink in overlapping areas */
  color = mix(color, INK_COOL, concentration * 0.18 * (1.0 - temperature * 0.4));

  /* Warm shift where temperature is high */
  color = mix(color, INK_WARM, concentration * 0.1 * temperature);

  /* Deeper ink where washes concentrate */
  float deep = smoothstep(0.5, 0.9, concentration + edgePool * 0.3);
  color = mix(color, INK_DEEP, deep * 0.12);

  /* Fine detail — subtle texture */
  color = mix(color, INK_COOL * 0.9, detail * 0.08);

  /* Edge darkening — ink pools at wash boundaries */
  color = mix(color, INK_DEEP, edgePool * 0.06);

  /* Paper texture — subtle brightness variation */
  float paperTex = noise(p * 12.0) * 0.015;
  color += paperTex;

  /* Vignette — paper bleeds in at edges */
  vec2 vc = uv - 0.5;
  float vig = dot(vc, vc);
  color = mix(color, PAPER, smoothstep(0.15, 0.55, vig) * 0.4);

  gl_FragColor = vec4(color, 1.0);
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

const MAX_RIPPLES = 8;

interface LivingInkProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function LivingInk({ className, style }: LivingInkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const rafRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const windRef = useRef({ x: 0, y: 0 });
  const prevMouseRef = useRef({ x: 0.5, y: 0.5 });
  const ripplesRef = useRef<Array<{ x: number; y: number; t: number }>>([]);
  const startRef = useRef(0);
  const prefersReduced = useReducedMotion();

  /* ── Mouse / touch handlers ── */

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - r.left) / r.width,
      y: 1 - (e.clientY - r.top) / r.height,
    };
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    ripplesRef.current.push({
      x: (e.clientX - r.left) / r.width,
      y: 1 - (e.clientY - r.top) / r.height,
      t: performance.now() / 1000 - startRef.current,
    });
    if (ripplesRef.current.length > MAX_RIPPLES)
      ripplesRef.current.shift();
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const c = canvasRef.current;
    if (!c || !e.touches[0]) return;
    const r = c.getBoundingClientRect();
    const t = e.touches[0];
    mouseRef.current = {
      x: (t.clientX - r.left) / r.width,
      y: 1 - (t.clientY - r.top) / r.height,
    };
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const c = canvasRef.current;
    if (!c || !e.touches[0]) return;
    const r = c.getBoundingClientRect();
    const t = e.touches[0];
    ripplesRef.current.push({
      x: (t.clientX - r.left) / r.width,
      y: 1 - (t.clientY - r.top) / r.height,
      t: performance.now() / 1000 - startRef.current,
    });
    if (ripplesRef.current.length > MAX_RIPPLES)
      ripplesRef.current.shift();
  }, []);

  /* ── WebGL lifecycle ── */

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

    /* Resize */
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

    /* Compile */
    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vs || !fs) return;
    const prog = linkProgram(gl, vs, fs);
    if (!prog) return;

    /* Geometry */
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

    /* Uniform locations */
    gl.useProgram(prog);
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uWind = gl.getUniformLocation(prog, "u_wind");
    const uRippleCount = gl.getUniformLocation(prog, "u_ripple_count");
    const uRipples: (WebGLUniformLocation | null)[] = [];
    for (let i = 0; i < MAX_RIPPLES; i++) {
      uRipples.push(gl.getUniformLocation(prog, `u_ripples[${i}]`));
    }

    startRef.current = performance.now() / 1000;

    /* Render */
    const render = () => {
      const now = performance.now() / 1000;
      const t = now - startRef.current;

      /* Wind decay + accumulate — slower decay for ink-like inertia */
      windRef.current.x *= 0.985;
      windRef.current.y *= 0.985;
      const dx = mouseRef.current.x - prevMouseRef.current.x;
      const dy = mouseRef.current.y - prevMouseRef.current.y;
      windRef.current.x += dx * 1.5;
      windRef.current.y += dy * 1.5;
      prevMouseRef.current = { ...mouseRef.current };

      /* Prune old ripples */
      ripplesRef.current = ripplesRef.current.filter(
        (r) => t - r.t < 5
      );

      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.uniform2f(uWind, windRef.current.x, windRef.current.y);
      gl.uniform1f(uRippleCount, ripplesRef.current.length);

      for (let i = 0; i < MAX_RIPPLES; i++) {
        const r = ripplesRef.current[i];
        if (r && uRipples[i]) {
          gl.uniform3f(uRipples[i], r.x, r.y, r.t);
        } else if (uRipples[i]) {
          gl.uniform3f(uRipples[i], 0, 0, -10);
        }
      }

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

    /* Event listeners */
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchstart", handleTouchStart);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [prefersReduced, handleMouseMove, handleClick, handleTouchMove, handleTouchStart]);

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
      aria-label="Living ink — move cursor to disturb ink washes, click to create ripples"
      role="img"
    />
  );
}
