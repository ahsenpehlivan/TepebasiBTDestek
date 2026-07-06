import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabasePublicEnv } from "./env";

declare global {
  var __tepebasiSupabaseBrowserClient: SupabaseClient | undefined;
}

export function createClient() {
  const { url, publishableKey } = getSupabasePublicEnv();

  if (typeof window === "undefined") {
    return createBrowserClient(url, publishableKey);
  }

  if (!globalThis.__tepebasiSupabaseBrowserClient) {
    globalThis.__tepebasiSupabaseBrowserClient = createBrowserClient(
      url,
      publishableKey,
    );
  }

  return globalThis.__tepebasiSupabaseBrowserClient;
}
