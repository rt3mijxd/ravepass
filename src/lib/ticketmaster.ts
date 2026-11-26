import type { Concert } from "@/types";
import { slugify } from "@/lib/slug";
import { countryLabel } from "@/lib/country-label";
import { httpsUrl } from "@/lib/security";
import { canonicalArtistSlug, TOP_CIS_ARTISTS, TOP_WORLD_ARTISTS } from "@/data/topArtists";

const BASE_URL = "https://app.ticketmaster.com/discovery/v2";
const API_KEY = process.env.TICKETMASTER_API_KEY || "";

interface TMAttraction {
  id: string;
  name: string;
  classifications?: { genre?: { name: string } }[];
  images?: { url: string; width: number; ratio?: string }[];
}

interface TMEvent {
  id: string;
  name: string;
  url: string;
  dates: {
    status?: { code?: string };
    start: {
      localDate?: string;
      localTime?: string;
    };
  };
  images?: { url: string; width: number; height: number; ratio?: string }[];
  priceRanges?: { min: number; max: number; currency: string }[];
  _embedded?: {
    venues?: {
      name: string;
      city?: { name: string };
      country?: { countryCode: string; name: string };
    }[];
    attractions?: TMAttraction[];
  };
}

interface TMResponse {
  _embedded?: {
    events?: TMEvent[];
    attractions?: TMAttraction[];
  };
  page?: {
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

function pickImage(images?: { url: string; width: number; ratio?: string }[]): string {
  if (!images || images.length === 0) return "";
  // Предпочитаем 3:2 или 16:9, ширина 300-600px
  const preferred = images.find((img) => img.ratio === "3_2" && img.width >= 300 && img.width <= 600);
  if (preferred) return preferred.url;
  const fallback = images.find((img) => img.width >= 200 && img.width <= 800);
  return fallback?.url ?? images[0].url;
}

function parseTMEvent(event: TMEvent, artist?: TMAttraction): Concert | null {
  const venue = event._embedded?.venues?.[0];
  const attraction = artist ?? event._embedded?.attractions?.[0];
  const countryCode = (venue?.country?.countryCode ?? "").toUpperCase().replace(/^UK$/, "GB");
  const city = venue?.city?.name ?? "";
  const date = event.dates?.start?.localDate ?? "";

  if (!city || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^[A-Z]{2}$/.test(countryCode)
    || !/^[A-Za-z0-9_-]{1,80}$/.test(event.id)) return null;
  const status = event.dates?.status?.code?.toLowerCase();
  if (status === "canceled" || status === "postponed") return null;

  const genre = attraction?.classifications?.[0]?.genre?.name ?? "";
  const artistName = attraction?.name ?? event.name;
  const artistImage = httpsUrl(pickImage(attraction?.images)) || httpsUrl(pickImage(event.images));
  if (!artistName?.trim() || !canonicalArtistSlug(artistName)) return null;

  // Извлекаем время начала
  const time = event.dates?.start?.localTime ?? undefined;

  // Извлекаем цены билетов
  const priceRange = event.priceRanges?.find(({ min, currency }) =>
    Number.isFinite(min) && min >= 0 && /^[A-Z]{3}$/.test(currency),
  );
  const priceMin = priceRange?.min ?? undefined;
  const priceMax = priceRange?.max ?? undefined;
  const currency = priceRange?.currency ?? undefined;

  return {
    id: `tm-${event.id}`,
    artist: {
      name: artistName,
      slug: canonicalArtistSlug(artistName),
      imageUrl: artistImage,
      genre: genre === "Undefined" ? "" : genre,
    },
    date,
    time,
    priceMin,
    priceMax,
    currency,
    soldOut: status === "soldout" || undefined,
    venue: venue?.name ?? "",
    city,
    country: countryLabel(countryCode, "en", venue?.country?.name),
    countryCode,
    ticketUrl: httpsUrl(event.url),
  };
}

// Оставляем запас до лимита Ticketmaster (5 запросов/с). Ограничение локально для процесса.
let nextRequestAt = 0;

async function fetchTicketmaster(path: string, params: URLSearchParams, revalidate: number): Promise<Response> {
  const now = Date.now();
  const requestAt = Math.max(now, nextRequestAt);
  nextRequestAt = requestAt + 225;
  if (requestAt > now) {
    await new Promise<void>((resolve) => setTimeout(resolve, requestAt - now));
  }

  params.set("apikey", API_KEY);
  return fetch(`${BASE_URL}/${path}.json?${params}`, {
    next: { revalidate },
    signal: AbortSignal.timeout(8_000),
  });
}

async function requestTicketmaster(
  resource: "events" | "attractions",
  params: URLSearchParams,
  revalidate: number,
): Promise<TMResponse> {
  const response = await fetchTicketmaster(resource, params, revalidate);
  if (!response.ok) throw new Error(`Ticketmaster ${resource}: HTTP ${response.status}`);
  return response.json() as Promise<TMResponse>;
}

export async function getTicketmasterConcert(id: string): Promise<Concert | null> {
  if (!API_KEY) throw new Error("Ticketmaster is not configured");
  const response = await fetchTicketmaster(`events/${encodeURIComponent(id)}`, new URLSearchParams(), 3600);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Ticketmaster event: HTTP ${response.status}`);
  return parseTMEvent(await response.json() as TMEvent);
}

function upcomingSince(): string {
  // Запас в сутки сохраняет концерты, у которых сегодня ещё не закончилось по местному времени.
  return `${new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)}T00:00:00Z`;
}

export async function searchEventsByCountry(
  countryCode: string,
  options: { page?: number; size?: number; keyword?: string; sort?: string } = {},
): Promise<{ concerts: Concert[]; totalPages: number }> {
  if (!API_KEY) return { concerts: [], totalPages: 0 };

  const { page = 0, size = 50, keyword, sort = "relevance,desc" } = options;
  const params = new URLSearchParams({
    countryCode,
    classificationName: "music",
    size: String(size),
    page: String(page),
    sort,
    startDateTime: upcomingSince(),
  });
  if (keyword) params.set("keyword", keyword);

  const data = await requestTicketmaster("events", params, 3600);
  return {
    concerts: (data._embedded?.events ?? []).flatMap((event) => {
      const concert = parseTMEvent(event);
      return concert ? [concert] : [];
    }),
    totalPages: data.page?.totalPages ?? 0,
  };
}

const artistQueries = new Map(
  [...TOP_WORLD_ARTISTS, ...TOP_CIS_ARTISTS].map((name) => [slugify(name), name]),
);

export async function searchEventsByArtist(name: string): Promise<Concert[]> {
  const slug = canonicalArtistSlug(name);
  const artistName = artistQueries.get(slug) ?? name;
  if (!API_KEY || !slug) return [];

  const params = new URLSearchParams({ keyword: artistName, classificationName: "music", size: "25" });
  const attractions = await requestTicketmaster("attractions", params, 604_800);
  const artist = attractions._embedded?.attractions?.find((item) => canonicalArtistSlug(item.name) === slug);
  const concerts = new Map<string, Concert>();
  const pageSize = 200;
  const startsAfter = upcomingSince();

  for (let page = 0; page * pageSize < 1000; page++) {
    const query = new URLSearchParams({
      classificationName: "music",
      size: String(pageSize),
      page: String(page),
      sort: "date,asc",
      startDateTime: startsAfter,
    });
    if (artist) query.set("attractionId", artist.id);
    else query.set("keyword", artistName);

    const data = await requestTicketmaster("events", query, 3600);
    for (const event of data._embedded?.events ?? []) {
      const matchingArtist = artist ?? event._embedded?.attractions?.find((item) => canonicalArtistSlug(item.name) === slug);
      // При поиске по тексту проверяем исполнителя во всём лайнапе.
      if (!matchingArtist) continue;

      const concert = parseTMEvent(event, matchingArtist);
      if (concert) concerts.set(concert.id, concert);
    }
    if (page + 1 >= (data.page?.totalPages ?? 1)) break;
  }

  return [...concerts.values()];
}

const topArtistSlugs = new Set(TOP_WORLD_ARTISTS.map(slugify));

// Основные направления для концертных поездок, включая региональные рынки Азии и СНГ.
const featuredCountries = [
  "TR", "AE", "RS", "GE", "AM", "KZ", "TH", "IL", "MA",
  "UZ", "AZ", "CY", "PL", "DE", "SG", "PH", "TW",
];

async function discoverConcertsByCountry(countryCode: string): Promise<Concert[]> {
  const firstPage = await searchEventsByCountry(countryCode);
  if (firstPage.totalPages < 2) return firstPage.concerts;

  const secondPage = await searchEventsByCountry(countryCode, { page: 1 });
  return [...firstPage.concerts, ...secondPage.concerts];
}

export async function fetchFeaturedConcerts(): Promise<Concert[]> {
  const artists = [...TOP_WORLD_ARTISTS, ...TOP_CIS_ARTISTS];
  const queries = [
    ...artists.map((name) => () => searchEventsByArtist(name)),
    ...featuredCountries.map((code) => () => discoverConcertsByCountry(code)),
  ];

  const concerts = new Map<string, Concert>();
  for (let i = 0; i < queries.length; i += 5) {
    // Любая ошибка прерывает сборку каталога, чтобы частичный результат не заменил кэш.
    const results = await Promise.all(queries.slice(i, i + 5).map((query) => query()));
    for (const result of results) {
      for (const concert of result) {
        if (!concerts.has(concert.id)) concerts.set(concert.id, concert);
      }
    }
  }

  return [...concerts.values()].sort((a, b) => {
    const priority = Number(topArtistSlugs.has(b.artist.slug)) - Number(topArtistSlugs.has(a.artist.slug));
    return priority || a.date.localeCompare(b.date);
  });
}
