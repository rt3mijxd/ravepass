import type { PriceQuotes } from "@/lib/prices";

export async function GET() {
  try {
    const response = await fetch("https://api.frankfurter.dev/v2/rates?base=USD", {
      next: { revalidate: 43_200 },
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) throw new Error("Rates unavailable");
    const rows: { base: string; quote: string; rate: number; date: string }[] = await response.json();
    const utcToday = new Date().toISOString().slice(0, 10);
    const cutoff = new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10);
    const rates: PriceQuotes["rates"] = { USD: 1 };
    let date = "";
    for (const row of rows) {
      if (row.base !== "USD" || !/^[A-Z]{3}$/.test(row.quote) || !Number.isFinite(row.rate) || row.rate <= 0
        || !/^\d{4}-\d{2}-\d{2}$/.test(row.date) || row.date < cutoff || row.date > utcToday) continue;
      rates[row.quote] = row.rate;
      if (row.date > date) date = row.date;
    }
    if (!date) throw new Error("Rates are stale");
    return Response.json({ rates, date } satisfies PriceQuotes, {
      headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" },
    });
  } catch {
    return Response.json({ error: "rates_unavailable" }, { status: 503 });
  }
}
