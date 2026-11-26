import { unstable_cache } from "next/cache";
import { cisConcerts } from "@/data/cis-artists";
import { canonicalArtistSlug } from "@/data/topArtists";
import { mergeConcertSources } from "@/lib/concert-catalog";
import { countryLabel } from "@/lib/country-label";
import { filterUpcoming } from "@/lib/dates";
import type { Concert } from "@/types";

const eventcartelTour = "https://eventcartel.com/tours/little-big-north-american-tour-2027-buy-tickets-2201";
const taiwanCalendar = "https://www.livenation.com.tw/en/event/allevents";
const philippinesCalendar = "https://www.livenation.ph/";

async function readPage(url: string): Promise<string> {
  const response = await fetch(url, {
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(7_000),
  });
  if (!response.ok) throw new Error(`Promoter page returned HTTP ${response.status}`);
  return response.text();
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;

function sourceUrl(value: string | undefined, base: string, path: RegExp): string | undefined {
  if (!value) return;
  try {
    const url = new URL(value, base);
    if (url.origin !== new URL(base).origin || url.username || url.password || !path.test(url.pathname)) return;
    return `${url.origin}${url.pathname}`;
  } catch {
    return;
  }
}

interface EventcartelTour {
  artists?: { title: string }[];
  events?: {
    id: number;
    url: string;
    start_date?: string;
    start_time?: string;
    location?: string;
    place?: string;
    venue?: { city?: string; title?: string };
  }[];
}

async function loadEventcartel(): Promise<Concert[]> {
  const html = await readPage(eventcartelTour);
  const payload = html.match(/<script\b[^>]*\bid="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)?.[1];
  if (!payload) throw new Error("Eventcartel tour data missing");

  const page = JSON.parse(payload) as {
    props?: { pageProps?: { dehydratedState?: { queries?: { state?: { data?: EventcartelTour } }[] } } };
  };
  const tour = page.props?.pageProps?.dehydratedState?.queries
    ?.map((query) => query.state?.data)
    .find((data) => Array.isArray(data?.events) && data?.artists?.length === 1);
  const name = tour?.artists?.[0]?.title;
  if (!name || !tour?.events || canonicalArtistSlug(name) !== "little-big") {
    throw new Error("Eventcartel tour structure changed");
  }

  return tour.events.flatMap((event): Concert[] => {
    const date = event.start_date;
    const countryCode = event.location?.match(/,\s*([A-Z]{2})$/)?.[1];
    const venue = event.venue?.title?.trim() || event.place?.trim();
    const city = event.venue?.city?.trim();
    const ticketUrl = sourceUrl(event.url, eventcartelTour, /^\/(?:en\/)?events\/concert\/[\w-]+\/?$/);
    if (!date || !datePattern.test(date) || !countryCode || !venue || !city || !ticketUrl
      || !Number.isSafeInteger(event.id) || event.id < 1) return [];

    // Сохраняем ссылки и идентификаторы уже опубликованных дат этого тура.
    const previous = cisConcerts.find((concert) =>
      concert.ticketUrl === eventcartelTour && concert.date === date && concert.countryCode === countryCode,
    );
    const time = event.start_time;
    return [{
      id: previous?.id ?? `promo-ec-${event.id}`,
      artist: previous?.artist ?? { name, slug: "little-big", imageUrl: "", genre: "" },
      city: previous?.city ?? city,
      countryCode,
      country: countryLabel(countryCode, "en"),
      venue,
      date,
      time: time && timePattern.test(time) ? time : undefined,
      ticketUrl,
    }];
  });
}

interface LiveNationEvent {
  id?: string;
  isDeleted?: boolean;
  eventDate?: string;
  eventDateTo?: string;
  showTime?: string;
  lineup?: { name?: string; type?: string; isPrimary?: boolean; image?: string }[];
  genres?: { name?: string }[];
  venue?: { name?: string; city?: string; country?: string };
}

const liveNationPath = /^\/(?:en\/)?event\/[\w-]+-edp(\d+)\/?$/;

// Страница Live Nation передаёт информацию о концерте в JSON при серверном рендеринге.
function readLiveNationEvent(html: string, id: string): LiveNationEvent | undefined {
  const payload = [...html.matchAll(/self\.__next_f\.push\((\[1,"(?:[^"\\]|\\.)*"\])\)<\/script>/g)]
    .map((match) => (JSON.parse(match[1]) as [number, string])[1]).join("");
  const marker = `"event":{"id":"${id}"`;
  const index = payload.indexOf(marker);
  if (index === -1) return;

  const start = index + '"event":'.length;
  // Ищем конец объекта, учитывая кавычки и фигурные скобки внутри строк.
  const objectTokens = /"(?:[^"\\]|\\.)*"|[{}]/g;
  objectTokens.lastIndex = start;
  let depth = 0;
  for (let token = objectTokens.exec(payload); token; token = objectTokens.exec(payload)) {
    if (token[0] === "{") depth += 1;
    if (token[0] === "}" && --depth === 0) {
      return JSON.parse(payload.slice(start, objectTokens.lastIndex)) as LiveNationEvent;
    }
  }
}

async function loadLiveNationEvent(url: string, countryCode: "TW" | "PH"): Promise<Concert | null> {
  const id = new URL(url).pathname.match(liveNationPath)?.[1];
  if (!id) return null;
  const event = readLiveNationEvent(await readPage(url), id);
  if (!event) throw new Error("Live Nation event structure changed");
  const expectedCountry = countryCode === "TW" ? "Taiwan" : "Philippines";
  const headliner = event.lineup?.find((entry) => entry.type === "headline" && entry.isPrimary)
    ?? event.lineup?.find((entry) => entry.type === "headline");
  const name = headliner?.name?.trim();
  const slug = name ? canonicalArtistSlug(name) : "";
  const date = event.eventDate?.slice(0, 10);
  const end = event.eventDateTo?.slice(0, 10);
  const city = event.venue?.city?.trim();
  const venue = event.venue?.name?.trim();
  if (event.isDeleted || event.venue?.country !== expectedCountry || !name || !slug || !city || !venue
    || !date || !datePattern.test(date)) return null;

  const photo = sourceUrl(headliner?.image, "https://dynamicmedia.livenationinternational.com", /^\/v\//);
  const time = event.showTime;
  return {
    id: `promo-ln-${countryCode.toLowerCase()}-${id}`,
    artist: { name, slug, imageUrl: photo ?? "", genre: event.genres?.[0]?.name ?? "" },
    date,
    dateEnd: end && datePattern.test(end) && end > date ? end : undefined,
    time: time && timePattern.test(time) ? time : undefined,
    venue,
    city,
    country: expectedCountry,
    countryCode,
    ticketUrl: url,
  };
}

const taiwanKnownEvents = [
  "/en/event/maroon-5-asia-2027-in-kaohsiung-kaohsiung-tickets-edp1689725",
  "/en/event/bruno-mars-the-romantic-tour-kaohsiung-tickets-edp1692984",
  "/en/event/blue-25th-anniversary-tour-kaohsiung-tickets-edp1701687",
];

async function loadLiveNation(calendar: string, countryCode: "TW" | "PH"): Promise<Concert[]> {
  let html = "";
  try {
    html = await readPage(calendar);
  } catch (error) {
    if (countryCode !== "TW") throw error;
  }

  const known = countryCode === "TW" ? taiwanKnownEvents : [];
  const links = [...html.matchAll(/\bhref="([^"]+)"/g)].map((match) => match[1]);
  const urls = new Set([...known, ...links].flatMap((link) => {
    const url = sourceUrl(link, calendar, liveNationPath);
    return url ? [url] : [];
  }));

  if (!urls.size) throw new Error("Live Nation calendar has no event links");
  const results = await Promise.allSettled([...urls].slice(0, 12).map((url) => loadLiveNationEvent(url, countryCode)));
  const concerts = results.flatMap((result) => result.status === "fulfilled" && result.value ? [result.value] : []);
  if (!concerts.length && results.some((result) => result.status === "rejected")) {
    throw new Error("Live Nation concert pages unavailable");
  }
  return concerts;
}

const getEventcartel = unstable_cache(loadEventcartel, ["eventcartel-tour-v1"], { revalidate: 21_600 });
const getLiveNationTaiwan = unstable_cache(
  () => loadLiveNation(taiwanCalendar, "TW"), ["livenation-tw-v1"], { revalidate: 21_600 },
);
const getLiveNationPhilippines = unstable_cache(
  () => loadLiveNation(philippinesCalendar, "PH"), ["livenation-ph-v1"], { revalidate: 21_600 },
);

export async function getPromoterConcerts(): Promise<Concert[]> {
  const feeds = await Promise.allSettled([getEventcartel(), getLiveNationTaiwan(), getLiveNationPhilippines()]);
  return filterUpcoming(feeds.flatMap((result) => result.status === "fulfilled" ? result.value : []));
}

export async function getSupplementalConcerts(): Promise<Concert[]> {
  const promoters = await getPromoterConcerts();
  const refreshed = new Set(promoters.map((concert) => concert.id));
  return filterUpcoming(mergeConcertSources(promoters, cisConcerts.filter((concert) => !refreshed.has(concert.id))));
}
