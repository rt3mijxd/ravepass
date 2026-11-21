import type { NextRequest } from "next/server";
import { isIP } from "node:net";

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
let pruneAfter = 0;
const hits = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  if (now > pruneAfter) {
    for (const [entry, value] of hits) {
      if (now > value.reset) hits.delete(entry);
    }
    pruneAfter = now + 60_000;
  }
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
  const forwarded = process.env.VERCEL ? req.headers.get("x-vercel-forwarded-for") : req.headers.get("x-forwarded-for");
  const ip = (forwarded ?? req.headers.get("x-real-ip"))?.split(",")[0].trim();
  return ip && isIP(ip) ? ip : "unknown";
}

export const uuidPattern = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

export function siteOrigin(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://ravepass.site";
}

export function httpsUrl(value: string | undefined): string {
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : "";
  } catch {
    return "";
  }
}

export class RequestBodyError extends Error {
  constructor(readonly status: 400 | 413) {
    super("Invalid request body");
  }
}

export async function readJsonObject(request: Request): Promise<Record<string, unknown>> {
  const limit = 16_384;
  if (Number(request.headers.get("content-length")) > limit) throw new RequestBodyError(413);
  const reader = request.body?.getReader();
  if (!reader) throw new RequestBodyError(400);
  const decoder = new TextDecoder();
  let body = "";
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      throw new RequestBodyError(413);
    }
    body += decoder.decode(value, { stream: true });
  }
  try {
    const value: unknown = JSON.parse(body + decoder.decode());
    if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  } catch {
    throw new RequestBodyError(400);
  }
  throw new RequestBodyError(400);
}
