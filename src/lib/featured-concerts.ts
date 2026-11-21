import { unstable_cache } from "next/cache";
import { fetchFeaturedConcerts } from "@/lib/ticketmaster";

// Главная, карта и задача по расписанию используют один кэш.
export const getFeaturedCached = unstable_cache(
  fetchFeaturedConcerts,
  ["featured-concerts-v3"],
  { revalidate: 3600 },
);
