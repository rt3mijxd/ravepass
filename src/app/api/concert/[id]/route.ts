import { NextRequest, NextResponse } from "next/server";
import { cisConcerts } from "@/data/cis-artists";
import { getTicketmasterConcert } from "@/lib/ticketmaster";
import { getPromoterConcerts } from "@/lib/promoter-concerts";
import { clientIp, rateLimit } from "@/lib/security";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (id.startsWith("cis-") || /^promo-(?:ec|ln-(?:tw|ph))-\d{1,16}$/.test(id)) {
    const curated = cisConcerts.find((entry) => entry.id === id);
    const updated = id.startsWith("promo-") || curated?.artist.slug === "little-big"
      ? (await getPromoterConcerts()).find((entry) => entry.id === id)
      : undefined;
    const concert = updated ?? curated;
    return NextResponse.json(concert ?? null, { status: concert ? 200 : 404 });
  }
  if (!/^tm-[A-Za-z0-9_-]{1,80}$/.test(id)) return NextResponse.json(null, { status: 404 });
  if (!rateLimit(`concert:${clientIp(request)}`, 40, 60_000)) {
    return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
  }

  try {
    const concert = await getTicketmasterConcert(id.slice(3));
    return NextResponse.json(concert, { status: concert ? 200 : 404 });
  } catch {
    return NextResponse.json({ error: "catalog_unavailable" }, { status: 503 });
  }
}
