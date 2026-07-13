/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_CAL_ORIGIN?: string;
  readonly VITE_CAL_EMBED_JS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
