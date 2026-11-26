import { after, NextRequest, NextResponse } from "next/server";
import { searchEventsByCountry } from "@/lib/ticketmaster";
import { mergeConcertSources } from "@/lib/concert-catalog";
import { filterUpcoming } from "@/lib/dates";
import { getFeaturedCached } from "@/lib/featured-concerts";
import { clientIp, rateLimit } from "@/lib/security";
import { getSupplementalConcerts } from "@/lib/promoter-concerts";
import { matchesArtist } from "@/data/topArtists";
import { normalizeText } from "@/lib/slug";
import type { Concert } from "@/types";

export const maxDuration = 180;

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

  if (!process.env.TICKETMASTER_API_KEY) return catalogResponse(await extra);

  if (country) {
    try {
      const [page, supplemental] = await Promise.all([
        searchEventsByCountry(country, { keyword: keyword ?? undefined }),
        extra,
      ]);
      return NextResponse.json(filterUpcoming(mergeConcertSources(page.concerts, supplemental)));
    } catch {
      return catalogResponse(await extra);
    }
  }

  const live = getFeaturedCached().catch(() => null);
  const supplemental = await extra;
  // При пустом кэше отдаём доступную афишу, продолжая прогрев в фоне.
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const ticketmaster = await Promise.race([
      live,
      new Promise<null>((resolve) => { timer = setTimeout(resolve, 1_500, null); }),
    ]);
    if (ticketmaster !== null) {
      return NextResponse.json(filterUpcoming(mergeConcertSources(ticketmaster, supplemental)));
    }
  } finally {
    clearTimeout(timer);
  }

  after(async () => { await live; });
  return catalogResponse(supplemental);
}

function catalogResponse(concerts: Concert[]) {
  if (concerts.length > 0) return NextResponse.json(concerts);
  return NextResponse.json({ error: "catalog_unavailable" }, { status: 503 });
}
