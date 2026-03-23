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

/* Warm palette — matches portfolio design tokens */
const vec3 COL_BG       = vec3(0.961, 0.949, 0.929);
const vec3 COL_SURFACE  = vec3(0.933, 0.918, 0.894);
const vec3 COL_ELEVATED = vec3(0.910, 0.890, 0.859);
const vec3 COL_WARM     = vec3(0.722, 0.604, 0.471);

/* Hash — fast, decorrelation */
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

/* Value noise, quintic Hermite for C2 continuity */
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

/* FBM — 5 octaves with per-octave rotation */
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.0;
    a *= 0.5;
  }
  return v;
}

/* Ripple — Gaussian ring with exponential decay */
float ripple(vec2 uv, vec2 center, float age) {
  if (age > 3.5 || age < 0.0) return 0.0;
  float dist = length(uv - center);
  float radius = age * 0.25;
  float ring = exp(-pow(dist - radius, 2.0) * 50.0);
  float decay = exp(-age * 1.8);
  return ring * decay * 0.2;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  /* Wind displacement from accumulated cursor velocity */
  vec2 windOffset = u_wind * 0.06;

  /* Cursor proximity — gentle push */
  vec2 mousePos = vec2(u_mouse.x * aspect, u_mouse.y);
  float mouseDist = length(p - mousePos);
  vec2 mouseDisplace = (p - mousePos) * 0.025 / (mouseDist * mouseDist + 0.15);

  /* Cloud sampling coordinates */
  vec2 cloudUV = p * 3.0;
  cloudUV += vec2(u_time * 0.018, u_time * 0.007);
  cloudUV += windOffset;
  cloudUV += mouseDisplace;

  /* Two FBM passes for depth */
  float c1 = fbm(cloudUV);
  float c2 = fbm(cloudUV * 1.4 + vec2(5.2, 1.3) + u_time * 0.008);
  float shape = c1 * 0.6 + c2 * 0.4;

  /* Contrast curve */
  shape = smoothstep(0.28, 0.72, shape);

  /* Ripple clearings */
  float totalRipple = 0.0;
  for (int i = 0; i < 8; i++) {
    if (float(i) >= u_ripple_count) break;
    totalRipple += ripple(uv, u_ripples[i].xy, u_time - u_ripples[i].z);
  }
  shape = clamp(shape - totalRipple, 0.0, 1.0);

  /* Color mapping — warm palette */
  vec3 color = mix(COL_BG, COL_SURFACE, smoothstep(0.0, 0.4, shape));
  color = mix(color, COL_ELEVATED, smoothstep(0.3, 0.7, shape));
  color = mix(color, COL_WARM * 0.92, smoothstep(0.55, 0.85, shape) * 0.3);

  /* Subtle vignette */
  float vig = 1.0 - length(uv - 0.5) * 0.25;
  color *= vig;

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

interface CloudCanvasProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function CloudCanvas({ className, style }: CloudCanvasProps) {
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

      /* Wind decay + accumulate */
      windRef.current.x *= 0.97;
      windRef.current.y *= 0.97;
      const dx = mouseRef.current.x - prevMouseRef.current.x;
      const dy = mouseRef.current.y - prevMouseRef.current.y;
      windRef.current.x += dx * 2;
      windRef.current.y += dy * 2;
      prevMouseRef.current = { ...mouseRef.current };

      /* Prune old ripples */
      ripplesRef.current = ripplesRef.current.filter(
        (r) => t - (r.t) < 4
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
      aria-label="Interactive cloud formation — move cursor to create wind, click to clear"
      role="img"
    />
  );
}
