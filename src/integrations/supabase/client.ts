import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { brokeredPreviewStorage } from "./previewAuthStorage";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

// Don't throw here: this module loads on every page, so a throw would blank the
// whole site. Log loudly instead; only Supabase-backed features will fail.
if (!isSupabaseConfigured) {
  console.error(
    "Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY. Set them in .env (dev) or .env.production / Vercel (prod).",
  );
}

export const supabase = createClient<Database>(
  SUPABASE_URL || "https://not-configured.invalid",
  SUPABASE_PUBLISHABLE_KEY || "not-configured",
  {
    auth: {
      storage: brokeredPreviewStorage(),
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);
