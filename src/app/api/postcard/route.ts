import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

/* ── Helpers ── */

async function hashVisitor(req: NextRequest): Promise<string> {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const ua = req.headers.get("user-agent") ?? "unknown";
  const data = new TextEncoder().encode(`${ip}:${ua}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const ALLOWED_STICKER_IDS = new Set([
  "star",
  "heart",
  "cloud",
  "flower",
  "spiral",
  "wave",
]);

/* ── GET: fetch active postcard items ── */

export async function GET() {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("postcard_items")
    .select("*")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=5, stale-while-revalidate=10",
    },
  });
}

/* ── POST: create a new postcard item ── */

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { kind, x, y, content, stroke_data, sticker_id, sticker_url } = body;

  /* Validate kind */
  if (!["drawing", "text", "sticker"].includes(kind as string)) {
    return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
  }

  /* Validate position */
  if (
    typeof x !== "number" ||
    typeof y !== "number" ||
    x < 0 || x > 1 ||
    y < 0 || y > 1
  ) {
    return NextResponse.json({ error: "Invalid position" }, { status: 400 });
  }

  /* Kind-specific validation */
  if (kind === "text") {
    if (typeof content !== "string" || content.length === 0 || content.length > 80) {
      return NextResponse.json(
        { error: "Content must be 1-80 characters" },
        { status: 400 },
      );
    }
  }

  if (kind === "drawing") {
    if (!Array.isArray(stroke_data) || stroke_data.length < 2 || stroke_data.length > 500) {
      return NextResponse.json(
        { error: "Stroke must have 2-500 points" },
        { status: 400 },
      );
    }
    // Validate each point is [number, number]
    for (const point of stroke_data as unknown[]) {
      if (
        !Array.isArray(point) ||
        point.length !== 2 ||
        typeof point[0] !== "number" ||
        typeof point[1] !== "number"
      ) {
        return NextResponse.json(
          { error: "Invalid stroke point" },
          { status: 400 },
        );
      }
    }
  }

  if (kind === "sticker") {
    const hasBuiltin = typeof sticker_id === "string" && ALLOWED_STICKER_IDS.has(sticker_id);
    const hasUpload = typeof sticker_url === "string" && sticker_url.length > 0;
    if (!hasBuiltin && !hasUpload) {
      return NextResponse.json(
        { error: "Sticker requires sticker_id or sticker_url" },
        { status: 400 },
      );
    }
  }

  /* Rate limit */
  const visitorHash = await hashVisitor(req);
  const supabase = getSupabaseAdmin();

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error: countError } = await supabase
    .from("postcard_items")
    .select("id", { count: "exact", head: true })
    .eq("visitor_hash", visitorHash)
    .gt("created_at", oneHourAgo);

  if (countError) {
    return NextResponse.json({ error: "Rate limit check failed" }, { status: 500 });
  }

  if ((count ?? 0) >= 3) {
    return NextResponse.json(
      { error: "Rate limited — try again later" },
      { status: 429 },
    );
  }

  /* Insert */
  // Sanitize text content — strip any HTML tags
  const sanitizedContent =
    kind === "text" && typeof content === "string"
      ? content.replace(/<[^>]*>/g, "").trim()
      : null;

  const { data, error } = await supabase
    .from("postcard_items")
    .insert({
      kind,
      x,
      y,
      content: sanitizedContent,
      stroke_data: kind === "drawing" ? stroke_data : null,
      sticker_id: kind === "sticker" && typeof sticker_id === "string" ? sticker_id : null,
      sticker_url: kind === "sticker" && typeof sticker_url === "string" ? sticker_url : null,
      visitor_hash: visitorHash,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
