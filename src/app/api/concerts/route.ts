import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { fetchFeaturedConcerts, searchEventsByCountry } from "@/lib/ticketmaster";
import { mockConcerts } from "@/data/concerts";
import { cisConcerts } from "@/data/cis-artists";
import { filterUpcoming } from "@/lib/dates";

// Кэшируем готовый список концертов на 1 час.
// Роут динамический (читает searchParams), поэтому route-level revalidate
// не работает — кэшируем саму дорогую агрегацию через unstable_cache.
// После первого прогрева пользователь получает список мгновенно,
// обновление происходит в фоне (stale-while-revalidate).
const getFeaturedCached = unstable_cache(
  async () => fetchFeaturedConcerts(),
  ["featured-concerts"],
  { revalidate: 3600 },
);

export async function GET(request: NextRequest) {
  const country = request.nextUrl.searchParams.get("country");
  const keyword = request.nextUrl.searchParams.get("keyword");

  try {
    let concerts;

    if (country) {
      const result = await searchEventsByCountry(country, { keyword: keyword ?? undefined });
      concerts = result.concerts;
      // Добавляем CIS-концерты по стране
      const cisByCountry = cisConcerts.filter((c) => c.countryCode === country);
      concerts = [...concerts, ...cisByCountry];
    } else {
      concerts = await getFeaturedCached();
      // Добавляем все CIS-концерты к общему списку
      concerts = [...concerts, ...cisConcerts];
    }

    // Скрываем прошедшие концерты
    concerts = filterUpcoming(concerts);

    // Фолбэк на моковые данные + CIS если API недоступен или нет ключа
    if (concerts.length === 0) {
      return NextResponse.json(filterUpcoming([...mockConcerts, ...cisConcerts]));
    }

    return NextResponse.json(concerts);
  } catch {
    return NextResponse.json(filterUpcoming([...mockConcerts, ...cisConcerts]));
  }
}
