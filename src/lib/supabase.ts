import { createClient, SupabaseClient } from "@supabase/supabase-js";

/* ── Types ── */

export type PostcardItem = {
  id: string;
  kind: "drawing" | "text" | "sticker";
  x: number;
  y: number;
  content: string | null;
  stroke_data: number[][] | null;
  sticker_id: string | null;
  sticker_url: string | null;
  visitor_hash: string;
  created_at: string;
  expires_at: string;
};

/* ── Browser client (singleton, lazy) ── */

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  client = createClient(url, key);
  return client;
}

/* ── Server client (for API routes, uses service role) ── */

export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  return createClient(url, key);
}
