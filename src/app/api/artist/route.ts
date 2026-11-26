import { NextRequest, NextResponse } from "next/server";
import { searchEventsByArtist } from "@/lib/ticketmaster";
import { canonicalArtistSlug } from "@/data/topArtists";
import { getSupplementalConcerts } from "@/lib/promoter-concerts";
import { mergeConcertSources } from "@/lib/concert-catalog";
import { filterUpcoming } from "@/lib/dates";
import { rateLimit, clientIp } from "@/lib/security";
import type { Concert } from "@/types";

export async function GET(request: NextRequest) {
  // Мягкий лимит: защита TM-квоты от автоматического перебора (человеку хватает)
  if (!rateLimit(`art:${clientIp(request)}`, 40, 60_000)) {
    return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
  }

  const name = request.nextUrl.searchParams.get("name");

  if (!name || name.length > 200) {
    return NextResponse.json({ error: "name parameter required" }, { status: 400 });
  }

  const slug = canonicalArtistSlug(name);
  const extra = getSupplementalConcerts().then((concerts) =>
    concerts.filter((concert) => canonicalArtistSlug(concert.artist.slug) === slug),
  );

  let liveConcerts: Concert[];
  try {
    liveConcerts = await searchEventsByArtist(name);
  } catch {
    if ((await extra).length === 0) {
      return NextResponse.json({ error: "catalog_unavailable" }, { status: 503 });
    }
    liveConcerts = [];
  }

  const unique = new Map(mergeConcertSources(liveConcerts, await extra).map((concert) => [concert.id, concert]));
  const concerts = filterUpcoming([...unique.values()]).sort(
    (a, b) => a.date.localeCompare(b.date),
  );

  return NextResponse.json({ artist: concerts[0]?.artist ?? null, concerts });
}
