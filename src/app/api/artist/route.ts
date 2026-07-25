import { NextRequest, NextResponse } from "next/server";
import { searchEventsByArtist } from "@/lib/ticketmaster";
import { searchCisConcerts, getCisConcertsByArtistSlug } from "@/data/cis-artists";
import { filterUpcoming } from "@/lib/dates";
import { slugify } from "@/lib/slug";
import { rateLimit, clientIp } from "@/lib/security";

export async function GET(request: NextRequest) {
  // Мягкий лимит: защита TM-квоты от автоматического перебора (человеку хватает)
  if (!rateLimit(`art:${clientIp(request)}`, 40, 60_000)) {
    return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
  }

  const name = request.nextUrl.searchParams.get("name");

  if (!name || name.length > 200) {
    return NextResponse.json({ error: "name parameter required" }, { status: 400 });
  }

  try {
    const requestedSlug = slugify(name);

    // Ищем в Ticketmaster
    const tmConcerts = await searchEventsByArtist(name);

    // CIS-данные: сначала по slug (URL вида /artist/little-big), затем по имени
    let cisConcerts = getCisConcertsByArtistSlug(requestedSlug);
    if (cisConcerts.length === 0) {
      cisConcerts = searchCisConcerts(name);
    }

    const merged = [...tmConcerts, ...cisConcerts];

    // TM по ключевому слову может вернуть фестивали, где артист лишь в лайнапе
    // (напр. "Little Big" → "Down the Rabbit Hole"). Если есть точные совпадения
    // по slug артиста — оставляем только их, чтобы не было чужих событий.
    const exact = merged.filter((c) => c.artist.slug === requestedSlug);
    const chosen = exact.length > 0 ? exact : merged;

    // Дедупликация: убираем концерты с одинаковым городом и датой
    const dedupMap = new Map<string, typeof chosen[0]>();
    for (const c of chosen) {
      const key = `${c.city}|${c.date}`;
      if (!dedupMap.has(key)) {
        dedupMap.set(key, c);
      }
    }
    // Скрываем прошедшие концерты и сортируем по дате
    const concerts = filterUpcoming(Array.from(dedupMap.values()))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Идентификация артиста: предпочитаем концерт с точным совпадением slug
    const identity = concerts.find((c) => c.artist.slug === requestedSlug) ?? concerts[0];

    return NextResponse.json({
      artist: identity
        ? {
            name: identity.artist.name,
            imageUrl: identity.artist.imageUrl,
            genre: identity.artist.genre,
          }
        : null,
      concerts,
    });
  } catch {
    return NextResponse.json({ artist: null, concerts: [] });
  }
}
