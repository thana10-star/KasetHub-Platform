/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_ENABLE_SUPABASE?: string;
  readonly VITE_ENABLE_AUTH?: string;
  readonly VITE_ENABLE_CLOUD_SYNC?: string;
  readonly VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK?: string;
  readonly VITE_AI_PROXY_MODE?: string;
  readonly VITE_ENABLE_AI_BACKEND_PROXY?: string;
  readonly VITE_ENABLE_LOCAL_AI_PROXY_HANDLER?: string;
  readonly VITE_CALCULATOR_AI_MODE?: string;
  readonly VITE_ENABLE_CALCULATOR_AI_BACKEND?: string;
  readonly VITE_ENABLE_CALCULATOR_AI_NETWORK?: string;
  readonly VITE_GUEST_SYNC_MODE?: string;
  readonly VITE_ENABLE_GUEST_SYNC_BACKEND?: string;
  readonly VITE_ENABLE_GUEST_SYNC_EDGE?: string;
  readonly VITE_GUEST_SYNC_EDGE_MODE?: string;
  readonly VITE_ENABLE_LOCAL_GUEST_SYNC_HANDLER?: string;
  readonly VITE_PHONE_AUTH_MODE?: string;
  readonly VITE_ENABLE_PHONE_AUTH?: string;
  readonly VITE_ENABLE_PHONE_AUTH_LOCAL_MOCK?: string;
  readonly VITE_SUPABASE_AUTH_REDIRECT_URL?: string;
  readonly VITE_AUTH_STAGING_LABEL?: string;
  readonly VITE_LINE_AUTH_MODE?: string;
  readonly VITE_ENABLE_LINE_AUTH?: string;
  readonly VITE_ENABLE_LINE_AUTH_LOCAL_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
