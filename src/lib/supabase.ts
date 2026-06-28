import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Серверный клиент Supabase с service_role-ключом.
 * Используется ТОЛЬКО в API-роутах (на сервере), никогда на клиенте —
 * service_role обходит RLS и даёт полный доступ к данным.
 */
let cached: SupabaseClient | null = null;

export function getServiceClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null; // не настроено — вызывающий код обработает
  if (!cached) {
    cached = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}

// Настроена ли интеграция (есть ли ключи)
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
