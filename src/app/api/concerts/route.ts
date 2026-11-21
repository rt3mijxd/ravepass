import { NextRequest, NextResponse } from "next/server";
import { searchEventsByCountry } from "@/lib/ticketmaster";
import { cisConcerts } from "@/data/cis-artists";
import { mergeConcertSources } from "@/lib/concert-catalog";
import { filterUpcoming } from "@/lib/dates";
import { getFeaturedCached } from "@/lib/featured-concerts";
import { clientIp, rateLimit } from "@/lib/security";

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

  const matchingCurated = filterUpcoming(cisConcerts).filter(
    (concert) => !country || concert.countryCode === country,
  );

  if (!process.env.TICKETMASTER_API_KEY) return curatedResponse(matchingCurated);

  try {
    const ticketmaster = country
      ? (await searchEventsByCountry(country, { keyword: keyword ?? undefined })).concerts
      : await getFeaturedCached();
    return NextResponse.json(filterUpcoming(mergeConcertSources(ticketmaster, matchingCurated)));
  } catch {
    return curatedResponse(matchingCurated);
  }
}

function curatedResponse(concerts: typeof cisConcerts) {
  if (concerts.length > 0) return NextResponse.json(concerts);
  return NextResponse.json({ error: "catalog_unavailable" }, { status: 503 });
}
