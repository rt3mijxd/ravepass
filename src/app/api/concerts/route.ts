import { NextRequest, NextResponse } from "next/server";
import { fetchFeaturedConcerts, searchEventsByCountry } from "@/lib/ticketmaster";
import { mockConcerts } from "@/data/concerts";

export const revalidate = 3600; // кэш на 1 час

export async function GET(request: NextRequest) {
  const country = request.nextUrl.searchParams.get("country");
  const keyword = request.nextUrl.searchParams.get("keyword");

  try {
    let concerts;

    if (country) {
      const result = await searchEventsByCountry(country, { keyword: keyword ?? undefined });
      concerts = result.concerts;
    } else {
      concerts = await fetchFeaturedConcerts();
    }

    // Фолбэк на моковые данные если API недоступен или нет ключа
    if (concerts.length === 0) {
      return NextResponse.json(mockConcerts);
    }

    return NextResponse.json(concerts);
  } catch {
    return NextResponse.json(mockConcerts);
  }
}
