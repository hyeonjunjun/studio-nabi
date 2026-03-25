"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getSupabase } from "@/lib/supabase";

/* ── Types ── */

export type PostcardItemKind = "drawing" | "text" | "sticker";

export interface PostcardItem {
  id: string;
  kind: PostcardItemKind;
  x: number;
  y: number;
  content: string | null;
  stroke_data: number[][] | null;
  sticker_id: string | null;
  sticker_url: string | null;
  created_at: string;
  expires_at: string;
}

type Mode = "view" | "draw" | "text" | "sticker";

/* ── Built-in Stickers (hand-drawn SVG paths) ── */

const BUILTIN_STICKERS: Record<string, { viewBox: string; path: string }> = {
  star: {
    viewBox: "0 0 32 32",
    path: "M16 2 L19.5 11.5 L30 12 L22 19.5 L24.5 30 L16 24 L7.5 30 L10 19.5 L2 12 L12.5 11.5 Z",
  },
  heart: {
    viewBox: "0 0 32 32",
    path: "M16 28 C12 24 3 18 3 11 C3 6 7 3 11 3 C13.5 3 15.5 4.5 16 6 C16.5 4.5 18.5 3 21 3 C25 3 29 6 29 11 C29 18 20 24 16 28Z",
  },
  cloud: {
    viewBox: "0 0 36 24",
    path: "M8 20 C4 20 2 17 2 14 C2 11 4.5 9 7 9 C7 5 10 2 15 2 C19 2 22 4.5 23 8 C24.5 7 27 7 29 9 C31 11 31 14 29 16 C31 17 32 19 31 21 C30 23 27 23 25 22 L8 20Z",
  },
  flower: {
    viewBox: "0 0 32 32",
    path: "M16 10 C18 6 22 5 22 8 C22 5 26 6 24 10 C28 10 29 14 26 14 C29 14 28 18 24 18 C26 22 22 23 22 20 C22 23 18 22 20 18 C16 18 15 14 18 14 C15 14 16 10 20 10 C18 6 16 6 16 10Z M16 13 A3 3 0 1 0 16 19 A3 3 0 1 0 16 13Z",
  },
  spiral: {
    viewBox: "0 0 32 32",
    path: "M16 16 C16 14 18 12 20 12 C23 12 25 14 25 17 C25 21 22 24 18 24 C13 24 9 20 9 15 C9 9 14 5 20 5 C27 5 31 10 31 17",
  },
  wave: {
    viewBox: "0 0 40 20",
    path: "M2 10 C6 4 10 4 14 10 C18 16 22 16 26 10 C30 4 34 4 38 10",
  },
};

const STICKER_IDS = Object.keys(BUILTIN_STICKERS);

/* ── Helpers ── */

function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function getItemOpacity(createdAt: string): number {
  const age =
    (Date.now() - new Date(createdAt).getTime()) / (24 * 60 * 60 * 1000);
  return Math.max(0.15, 1 - age * 0.85);
}

/** Add slight jitter to a coordinate for hand-drawn feel */
function jitter(v: number, amount: number, reduced: boolean): number {
  if (reduced) return v;
  return v + (Math.random() - 0.5) * amount;
}

/* ── Drawing Renderer ── */

function renderStrokes(
  ctx: CanvasRenderingContext2D,
  items: PostcardItem[],
  width: number,
  height: number,
  reducedMotion: boolean,
) {
  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = "multiply";

  for (const item of items) {
    if (item.kind !== "drawing" || !item.stroke_data) continue;

    const opacity = getItemOpacity(item.created_at);
    ctx.strokeStyle = `rgba(35, 32, 28, ${0.52 * opacity})`;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    for (let i = 0; i < item.stroke_data.length; i++) {
      const [nx, ny] = item.stroke_data[i];
      const x = jitter(nx * width, 0.5, reducedMotion);
      const y = jitter(ny * height, 0.5, reducedMotion);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  ctx.globalCompositeOperation = "source-over";
}

/* ── API helpers ── */

async function fetchItems(): Promise<PostcardItem[]> {
  try {
    const res = await fetch("/api/postcard");
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function postItem(
  item: Omit<PostcardItem, "id" | "created_at" | "expires_at">,
): Promise<PostcardItem | null> {
  try {
    const res = await fetch("/api/postcard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function uploadSticker(file: File): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/postcard/sticker", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.url;
  } catch {
    return null;
  }
}

/* ── Component ── */

interface PostcardCanvasProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function PostcardCanvas({
  className,
  style,
}: PostcardCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  /* ── State ── */
  const [items, setItems] = useState<PostcardItem[]>([]);
  const [mode, setMode] = useState<Mode>("view");
  const [isDrawing, setIsDrawing] = useState(false);
  const currentStrokeRef = useRef<number[][]>([]);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [stickerPickerOpen, setStickerPickerOpen] = useState(false);
  const [textInput, setTextInput] = useState<{
    x: number;
    y: number;
    value: string;
  } | null>(null);
  /* cooldown state — reserved for rate-limit UI feedback */

  /* ── Fetch items on mount + subscribe to realtime ── */
  useEffect(() => {
    let cancelled = false;

    fetchItems().then((data) => {
      if (!cancelled) setItems(data);
    });

    // Supabase realtime subscription
    let channel: ReturnType<ReturnType<typeof getSupabase>["channel"]> | null = null;
    try {
      const supabase = getSupabase();
      channel = supabase
        .channel("postcard_items")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "postcard_items" },
          (payload) => {
            const newItem = payload.new as PostcardItem;
            setItems((prev) => {
              // Avoid duplicates (optimistic items already in list)
              if (prev.some((i) => i.id === newItem.id)) return prev;
              return [...prev, newItem];
            });
          },
        )
        .subscribe();
    } catch {
      // Supabase not configured — local-only mode
    }

    return () => {
      cancelled = true;
      channel?.unsubscribe();
    };
  }, []);

  /* ── Canvas sizing ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
        renderStrokes(ctx, items, w, h, reducedMotion);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    return () => ro.disconnect();
  }, [items, reducedMotion]);

  /* ── Re-render strokes when items change ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    renderStrokes(ctx, items, container.clientWidth, container.clientHeight, reducedMotion);
  }, [items, reducedMotion]);

  /* ── Pointer handlers (draw mode) ── */
  const getNormalizedPos = useCallback(
    (e: React.PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    },
    [],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (mode === "draw") {
        setIsDrawing(true);
        const pos = getNormalizedPos(e);
        currentStrokeRef.current = [[pos.x, pos.y]];
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      } else if (mode === "text" && !textInput) {
        const pos = getNormalizedPos(e);
        setTextInput({ x: pos.x, y: pos.y, value: "" });
      } else if (mode === "sticker" && selectedSticker) {
        const pos = getNormalizedPos(e);
        const optimistic: PostcardItem = {
          id: generateId(),
          kind: "sticker",
          x: pos.x,
          y: pos.y,
          content: null,
          stroke_data: null,
          sticker_id: selectedSticker,
          sticker_url: null,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        };
        setItems((prev) => [...prev, optimistic]);
        setSelectedSticker(null);
        setMode("view");
        setStickerPickerOpen(false);
        // Persist
        postItem({ kind: "sticker", x: pos.x, y: pos.y, content: null, stroke_data: null, sticker_id: selectedSticker, sticker_url: null });
      }
    },
    [mode, getNormalizedPos, textInput, selectedSticker],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDrawing || mode !== "draw") return;
      const pos = getNormalizedPos(e);
      currentStrokeRef.current.push([pos.x, pos.y]);

      // Live preview: draw the current stroke
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const w = container.clientWidth;
      const h = container.clientHeight;

      // Re-render everything + current stroke
      renderStrokes(ctx, items, w, h, reducedMotion);
      ctx.globalCompositeOperation = "multiply";
      ctx.strokeStyle = "rgba(35, 32, 28, 0.52)";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      for (let i = 0; i < currentStrokeRef.current.length; i++) {
        const [nx, ny] = currentStrokeRef.current[i];
        const x = nx * w;
        const y = ny * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalCompositeOperation = "source-over";
    },
    [isDrawing, mode, getNormalizedPos, items, reducedMotion],
  );

  const handlePointerUp = useCallback(() => {
    if (!isDrawing || mode !== "draw") return;
    setIsDrawing(false);

    if (currentStrokeRef.current.length < 2) {
      currentStrokeRef.current = [];
      return;
    }

    const strokeData = [...currentStrokeRef.current];
    const optimistic: PostcardItem = {
      id: generateId(),
      kind: "drawing",
      x: 0,
      y: 0,
      content: null,
      stroke_data: strokeData,
      sticker_id: null,
      sticker_url: null,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
    setItems((prev) => [...prev, optimistic]);
    currentStrokeRef.current = [];
    // Persist
    postItem({ kind: "drawing", x: 0, y: 0, content: null, stroke_data: strokeData, sticker_id: null, sticker_url: null });
  }, [isDrawing, mode]);

  /* ── Text submission ── */
  const submitText = useCallback(() => {
    if (!textInput || !textInput.value.trim()) {
      setTextInput(null);
      return;
    }
    const content = textInput.value.trim().slice(0, 80);
    const optimistic: PostcardItem = {
      id: generateId(),
      kind: "text",
      x: textInput.x,
      y: textInput.y,
      content,
      stroke_data: null,
      sticker_id: null,
      sticker_url: null,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
    setItems((prev) => [...prev, optimistic]);
    setTextInput(null);
    setMode("view");
    // Persist
    postItem({ kind: "text", x: textInput.x, y: textInput.y, content, stroke_data: null, sticker_id: null, sticker_url: null });
  }, [textInput]);

  /* ── Escape to cancel ── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMode("view");
        setTextInput(null);
        setSelectedSticker(null);
        setStickerPickerOpen(false);
        setIsDrawing(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  /* ── Cursor style ── */
  const cursorStyle =
    mode === "draw"
      ? "crosshair"
      : mode === "text"
        ? "text"
        : mode === "sticker" && selectedSticker
          ? "copy"
          : "default";

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "var(--paper)",
        cursor: cursorStyle,
        overflow: "hidden",
        userSelect: mode === "view" ? "auto" : "none",
        ...style,
      }}
      role="img"
      aria-label="Interactive postcard — draw, type, or place stickers. Contributions last 24 hours."
    >
      {/* Drawing canvas layer */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          position: "absolute",
          inset: 0,
          touchAction: mode === "draw" ? "none" : "auto",
        }}
      />

      {/* DOM overlay for text + stickers */}
      <div
        onPointerDown={mode !== "draw" ? handlePointerDown : undefined}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: mode === "draw" ? "none" : "auto",
        }}
      >
        {items
          .filter((item) => item.kind === "text" || item.kind === "sticker")
          .map((item) => {
            const opacity = getItemOpacity(item.created_at);

            if (item.kind === "text" && item.content) {
              return (
                <span
                  key={item.id}
                  style={{
                    position: "absolute",
                    left: `${item.x * 100}%`,
                    top: `${item.y * 100}%`,
                    transform: "translate(-50%, -50%)",
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: "var(--text-body)",
                    color: "var(--ink-primary)",
                    opacity,
                    whiteSpace: "nowrap",
                    maxWidth: "200px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    pointerEvents: "none",
                    transition: "opacity 600ms ease-out",
                  }}
                >
                  {item.content}
                </span>
              );
            }

            if (item.kind === "sticker") {
              // User-uploaded sticker
              if (item.sticker_url) {
                return (
                  <img
                    key={item.id}
                    src={item.sticker_url}
                    alt="visitor sticker"
                    style={{
                      position: "absolute",
                      left: `${item.x * 100}%`,
                      top: `${item.y * 100}%`,
                      transform: "translate(-50%, -50%)",
                      width: 40,
                      height: 40,
                      objectFit: "contain",
                      opacity,
                      pointerEvents: "none",
                      transition: "opacity 600ms ease-out",
                    }}
                  />
                );
              }

              // Built-in SVG sticker
              const sticker =
                item.sticker_id && BUILTIN_STICKERS[item.sticker_id];
              if (!sticker) return null;
              return (
                <svg
                  key={item.id}
                  viewBox={sticker.viewBox}
                  style={{
                    position: "absolute",
                    left: `${item.x * 100}%`,
                    top: `${item.y * 100}%`,
                    transform: "translate(-50%, -50%)",
                    width: 36,
                    height: 36,
                    opacity,
                    pointerEvents: "none",
                    transition: "opacity 600ms ease-out",
                  }}
                  fill="none"
                  stroke="rgba(35, 32, 28, 0.52)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={sticker.path} />
                </svg>
              );
            }

            return null;
          })}

        {/* Active text input */}
        {textInput && (
          <input
            autoFocus
            value={textInput.value}
            onChange={(e) =>
              setTextInput((prev) =>
                prev ? { ...prev, value: e.target.value.slice(0, 80) } : null,
              )
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") submitText();
              if (e.key === "Escape") {
                setTextInput(null);
                setMode("view");
              }
            }}
            onBlur={submitText}
            placeholder="leave a note..."
            style={{
              position: "absolute",
              left: `${textInput.x * 100}%`,
              top: `${textInput.y * 100}%`,
              transform: "translate(-50%, -50%)",
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "var(--text-body)",
              color: "var(--ink-primary)",
              background: "transparent",
              border: "none",
              borderBottom: "1px solid var(--ink-faint)",
              outline: "none",
              width: 180,
              textAlign: "center",
              padding: "2px 4px",
            }}
            maxLength={80}
          />
        )}
      </div>

      {/* ── Toolbar ── */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          right: 12,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 8px",
          borderRadius: 8,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid var(--ink-ghost)",
          zIndex: 10,
        }}
      >
        {/* Draw */}
        <button
          onClick={() => {
            setMode(mode === "draw" ? "view" : "draw");
            setTextInput(null);
            setStickerPickerOpen(false);
            setSelectedSticker(null);
          }}
          aria-label="Draw mode"
          title="Draw"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: mode === "draw" ? "var(--ink-full)" : "var(--ink-muted)",
            backgroundColor:
              mode === "draw" ? "var(--ink-whisper)" : "transparent",
            transition: "color 200ms, background-color 200ms",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.5 13.5 L11 5 L13 7 L4.5 15.5 L1.5 15.5 Z" />
            <path d="M10 6 L12 4 C12.5 3.5 13.5 3.5 14 4 C14.5 4.5 14.5 5.5 14 6 L12 8" />
          </svg>
        </button>

        {/* Text */}
        <button
          onClick={() => {
            setMode(mode === "text" ? "view" : "text");
            setStickerPickerOpen(false);
            setSelectedSticker(null);
          }}
          aria-label="Text mode"
          title="Type a note"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 1,
            color: mode === "text" ? "var(--ink-full)" : "var(--ink-muted)",
            backgroundColor:
              mode === "text" ? "var(--ink-whisper)" : "transparent",
            transition: "color 200ms, background-color 200ms",
            width: 24,
            height: 24,
          }}
        >
          T
        </button>

        {/* Sticker */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => {
              const opening = !stickerPickerOpen;
              setStickerPickerOpen(opening);
              if (opening) {
                setMode("sticker");
                setTextInput(null);
              } else {
                setMode("view");
                setSelectedSticker(null);
              }
            }}
            aria-label="Sticker mode"
            title="Place a sticker"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color:
                mode === "sticker" ? "var(--ink-full)" : "var(--ink-muted)",
              backgroundColor:
                mode === "sticker" ? "var(--ink-whisper)" : "transparent",
              transition: "color 200ms, background-color 200ms",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="8" cy="8" r="6.5" />
              <circle cx="6" cy="6.5" r="0.8" fill="currentColor" />
              <circle cx="10" cy="6.5" r="0.8" fill="currentColor" />
              <path d="M5.5 9.5 C6.5 11 9.5 11 10.5 9.5" />
            </svg>
          </button>

          {/* Sticker picker popover */}
          {stickerPickerOpen && (
            <div
              style={{
                position: "absolute",
                bottom: "calc(100% + 8px)",
                right: 0,
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
                padding: 8,
                borderRadius: 8,
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid var(--ink-ghost)",
                width: 140,
              }}
            >
              {STICKER_IDS.map((id) => {
                const sticker = BUILTIN_STICKERS[id];
                return (
                  <button
                    key={id}
                    onClick={() => setSelectedSticker(id)}
                    aria-label={`${id} sticker`}
                    style={{
                      background:
                        selectedSticker === id
                          ? "var(--ink-whisper)"
                          : "transparent",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                      padding: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background-color 150ms",
                    }}
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox={sticker.viewBox}
                      fill="none"
                      stroke="rgba(35, 32, 28, 0.52)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={sticker.path} />
                    </svg>
                  </button>
                );
              })}

              {/* Upload custom sticker */}
              <button
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/png,image/svg+xml,image/webp,image/gif";
                  input.onchange = async () => {
                    const file = input.files?.[0];
                    if (!file || file.size > 100 * 1024) {
                      alert("File must be under 100KB");
                      return;
                    }
                    setSelectedSticker(null);
                    setStickerPickerOpen(false);
                    setMode("view");

                    // Upload to Supabase Storage (falls back to blob URL)
                    let url = await uploadSticker(file);
                    if (!url) url = URL.createObjectURL(file);

                    // Optimistic add at center
                    const optimistic: PostcardItem = {
                      id: generateId(),
                      kind: "sticker",
                      x: 0.5,
                      y: 0.5,
                      content: null,
                      stroke_data: null,
                      sticker_id: null,
                      sticker_url: url,
                      created_at: new Date().toISOString(),
                      expires_at: new Date(
                        Date.now() + 24 * 60 * 60 * 1000,
                      ).toISOString(),
                    };
                    setItems((prev) => [...prev, optimistic]);
                    // Persist
                    postItem({ kind: "sticker", x: 0.5, y: 0.5, content: null, stroke_data: null, sticker_id: null, sticker_url: url });
                  };
                  input.click();
                }}
                aria-label="Upload custom sticker"
                title="Upload image"
                style={{
                  background: "transparent",
                  border: "1px dashed var(--ink-ghost)",
                  borderRadius: 4,
                  cursor: "pointer",
                  padding: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  color: "var(--ink-muted)",
                  transition: "color 150ms, border-color 150ms",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M8 3 L8 13" />
                  <path d="M3 8 L13 8" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Mode hint */}
        {mode !== "view" && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
              marginLeft: 2,
            }}
          >
            {mode === "draw"
              ? "draw"
              : mode === "text"
                ? "click to type"
                : selectedSticker
                  ? "click to place"
                  : "pick one"}
          </span>
        )}
      </div>

      {/* Subtle paper texture hint */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.03,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
