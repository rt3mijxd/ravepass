import { unstable_cache } from "next/cache";
import { fetchFeaturedConcerts } from "@/lib/ticketmaster";

// Главная, карта и задача по расписанию используют один кэш.
const readFeatured = unstable_cache(
  fetchFeaturedConcerts,
  ["featured-concerts-v3"],
  { revalidate: 3600 },
);

let inFlight: ReturnType<typeof readFeatured> | undefined;

export function getFeaturedCached() {
  inFlight ??= readFeatured().finally(() => { inFlight = undefined; });
  return inFlight;
}
