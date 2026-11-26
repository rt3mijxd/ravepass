import { NextRequest, NextResponse } from "next/server";
import { searchEventsByCountry } from "@/lib/ticketmaster";
import { mergeConcertSources } from "@/lib/concert-catalog";
import { filterUpcoming } from "@/lib/dates";
import { getFeaturedCached } from "@/lib/featured-concerts";
import { clientIp, rateLimit } from "@/lib/security";
import { getSupplementalConcerts } from "@/lib/promoter-concerts";
import { matchesArtist } from "@/data/topArtists";
import { normalizeText } from "@/lib/slug";
import type { Concert } from "@/types";

export const maxDuration = 120;

export async function GET(request: NextRequest) {
  const country = request.nextUrl.searchParams.get("country");
  const keyword = request.nextUrl.searchParams.get("keyword");
  if ((country && !/^[A-Z]{2}$/.test(country)) || (keyword && (!country || keyword.length > 120))) {
    return NextResponse.json({ error: "invalid_query" }, { status: 400 });
  }
  if (country && !rateLimit(`country:${clientIp(request)}`, 20, 60_000)) {
    return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
  }

  const query = normalizeText(keyword ?? "");
  const extra = getSupplementalConcerts().then((concerts) => concerts.filter(
    ({ countryCode, artist }) => (!country || countryCode === country)
      && (!query || matchesArtist(artist.name, artist.slug, query)),
  ));

  try {
    const live = process.env.TICKETMASTER_API_KEY
      ? country
        ? searchEventsByCountry(country, { keyword: keyword ?? undefined }).then((page) => page.concerts)
        : getFeaturedCached()
      : Promise.resolve([]);
    const [ticketmaster, supplemental] = await Promise.all([live, extra]);
    const concerts = filterUpcoming(mergeConcertSources(ticketmaster, supplemental));
    return process.env.TICKETMASTER_API_KEY ? NextResponse.json(concerts) : catalogResponse(concerts);
  } catch {
    return catalogResponse(await extra);
  }
}

function catalogResponse(concerts: Concert[]) {
  if (concerts.length > 0) return NextResponse.json(concerts);
  return NextResponse.json({ error: "catalog_unavailable" }, { status: 503 });
}
