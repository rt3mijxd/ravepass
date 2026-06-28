import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { sendEmail, isEmailConfigured } from "@/lib/resend";
import { newConcertsEmail } from "@/lib/email-templates";
import { searchEventsByArtist } from "@/lib/ticketmaster";
import { getCisConcertsByArtistSlug } from "@/data/cis-artists";
import { filterUpcoming } from "@/lib/dates";
import type { Concert } from "@/types";

export const maxDuration = 60; // секунд (Vercel)

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false; // не настроено — не запускаем
  const header = req.headers.get("authorization");
  const query = req.nextUrl.searchParams.get("secret");
  return header === `Bearer ${secret}` || query === secret;
}

function siteUrl(req: NextRequest): string {
  return process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = getServiceClient();
  if (!supabase || !isEmailConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  // 1. Уникальные артисты среди подтверждённых подписок
  const { data: subs, error } = await supabase
    .from("subscriptions")
    .select("email, artist_slug, artist_name, confirm_token")
    .eq("confirmed", true);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!subs || subs.length === 0) {
    return NextResponse.json({ ok: true, message: "no subscribers" });
  }

  const artists = new Map<string, { name: string; subs: typeof subs }>();
  for (const s of subs) {
    let a = artists.get(s.artist_slug);
    if (!a) { a = { name: s.artist_name ?? s.artist_slug, subs: [] }; artists.set(s.artist_slug, a); }
    a.subs.push(s);
  }

  const base = siteUrl(request);
  let emailsSent = 0;
  let newConcertsTotal = 0;

  for (const [slug, info] of artists) {
    // 2. Текущие предстоящие концерты артиста (TM + CIS)
    let concerts: Concert[] = [];
    try {
      const tm = await searchEventsByArtist(info.name);
      const cis = getCisConcertsByArtistSlug(slug);
      const merged = [...tm, ...cis].filter((c) => c.artist.slug === slug || cis.includes(c));
      concerts = filterUpcoming(merged);
    } catch {
      continue;
    }

    // 3. Какие из них новые (нет в seen_concerts)
    const { data: seenRows } = await supabase
      .from("seen_concerts")
      .select("concert_id")
      .eq("artist_slug", slug);
    const seen = new Set((seenRows ?? []).map((r) => r.concert_id));
    const firstRun = (seenRows?.length ?? 0) === 0;

    const fresh = concerts.filter((c) => !seen.has(c.id));
    if (fresh.length === 0) continue;

    // 4. Помечаем как увиденные (всегда), чтобы не дублировать в будущем
    await supabase.from("seen_concerts").upsert(
      fresh.map((c) => ({ artist_slug: slug, concert_id: c.id })),
      { onConflict: "concert_id" },
    );

    // 5. Первый прогон по артисту — только засеваем, не спамим существующими
    if (firstRun) continue;

    newConcertsTotal += fresh.length;

    // 6. Рассылаем подтверждённым подписчикам
    for (const sub of info.subs) {
      const unsubUrl = `${base}/api/unsubscribe?token=${sub.confirm_token}`;
      const { subject, html } = newConcertsEmail(info.name, fresh.slice(0, 8), unsubUrl);
      const ok = await sendEmail(sub.email, subject, html);
      if (ok) emailsSent++;
    }
  }

  return NextResponse.json({ ok: true, artists: artists.size, newConcerts: newConcertsTotal, emailsSent });
}
