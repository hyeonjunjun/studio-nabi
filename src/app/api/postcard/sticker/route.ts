import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const MAX_SIZE = 100 * 1024; // 100KB
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/svg+xml",
  "image/webp",
  "image/gif",
]);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File must be under 100KB" },
      { status: 400 },
    );
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Only PNG, SVG, WebP, and GIF are allowed" },
      { status: 400 },
    );
  }

  const ext = file.name.split(".").pop() || "png";
  const filename = `${crypto.randomUUID()}.${ext}`;

  const supabase = getSupabaseAdmin();
  const buffer = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from("postcard-stickers")
    .upload(filename, buffer, {
      contentType: file.type,
      cacheControl: "86400", // 24h cache
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage
    .from("postcard-stickers")
    .getPublicUrl(filename);

  return NextResponse.json({ url: urlData.publicUrl }, { status: 201 });
}
