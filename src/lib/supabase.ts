import "server-only";

import { createClient } from "@supabase/supabase-js";

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!serviceRoleKey) {
    throw new Error("Missing environment variable: SUPABASE_SERVICE_ROLE_KEY");
  }

  return { url, serviceRoleKey };
}

/**
 * Server-side Supabase client for Route Handlers, Server Components, and Server Actions.
 * Uses the service role key — do not import this module in Client Components.
 */
export function createServerSupabaseClient() {
  const { url, serviceRoleKey } = getSupabaseEnv();

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
