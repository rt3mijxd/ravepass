import { NextRequest, NextResponse } from "next/server";
import { searchEventsByArtist } from "@/lib/ticketmaster";

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name");

  if (!name) {
    return NextResponse.json({ error: "name parameter required" }, { status: 400 });
  }

  try {
    const concerts = await searchEventsByArtist(name);

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
