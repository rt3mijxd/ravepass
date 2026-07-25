import { NextRequest } from "next/server";

/**
 * Экранирование HTML — для безопасной вставки пользовательских данных
 * в HTML-письма (защита от HTML/скрипт-инъекций).
 */
export function escapeHtml(input: string): string {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Простой in-memory rate-limit по ключу (напр. IP).
 * ВАЖНО: на serverless (Vercel) состояние не разделяется между инстансами,
 * поэтому это «первый рубеж» против наивных флудов, а не полная защита.
 * Для продакшн-уровня — Vercel WAF / Upstash Ratelimit.
 */
const hits = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const rec = hits.get(key);
  if (!rec || now > rec.reset) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return true; // разрешено
  }
  if (rec.count >= max) return false; // превышен лимит
  rec.count++;
  return true;
}

// Достаём IP клиента из заголовков (Vercel прокидывает x-forwarded-for)
export function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}
