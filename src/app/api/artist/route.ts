import { NextRequest, NextResponse } from "next/server";
import { searchEventsByArtist } from "@/lib/ticketmaster";

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name");

  if (!name) {
    return NextResponse.json({ error: "name parameter required" }, { status: 400 });
  }

  try {
    const rawConcerts = await searchEventsByArtist(name);

    // Дедупликация: убираем концерты с одинаковым городом и датой
    const dedupMap = new Map<string, typeof rawConcerts[0]>();
    for (const c of rawConcerts) {
      const key = `${c.city}|${c.date}`;
      if (!dedupMap.has(key)) {
        dedupMap.set(key, c);
      }
    }
    const concerts = Array.from(dedupMap.values());

    return NextResponse.json({
      artist: concerts.length > 0
        ? {
            name: concerts[0].artist.name,
            imageUrl: concerts[0].artist.imageUrl,
            genre: concerts[0].artist.genre,
          }
        : null,
      concerts,
    });
  } catch {
    return NextResponse.json({ artist: null, concerts: [] });
  }
}
