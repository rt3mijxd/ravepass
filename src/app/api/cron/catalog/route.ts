import { getFeaturedCached } from "@/lib/featured-concerts";
import { getPromoterConcerts } from "@/lib/promoter-concerts";

export const maxDuration = 120;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!process.env.TICKETMASTER_API_KEY) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    const [concerts, promoters] = await Promise.all([getFeaturedCached(), getPromoterConcerts()]);
    return Response.json({ ok: true, ticketmasterEvents: concerts.length, promoterEvents: promoters.length });
  } catch {
    return Response.json({ error: "catalog_unavailable" }, { status: 502 });
  }
}
