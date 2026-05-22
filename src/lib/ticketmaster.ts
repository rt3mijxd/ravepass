import type { Concert } from "@/types";

const BASE_URL = "https://app.ticketmaster.com/discovery/v2";
const API_KEY = process.env.TICKETMASTER_API_KEY || "";

// Маппинг ISO кодов стран в русские названия
const countryRuNames: Record<string, string> = {
  TR: "Турция", RS: "Сербия", ME: "Черногория", BA: "Босния и Герцеговина",
  AE: "ОАЭ", TH: "Таиланд", GE: "Грузия", AM: "Армения",
  KZ: "Казахстан", KG: "Кыргызстан", UZ: "Узбекистан", AZ: "Азербайджан",
  BY: "Беларусь", AR: "Аргентина", BR: "Бразилия", CU: "Куба",
  MN: "Монголия", MD: "Молдова", QA: "Катар", BH: "Бахрейн",
  OM: "Оман", EG: "Египет", MA: "Марокко", TN: "Тунис",
  JO: "Иордания", LB: "Ливан", LK: "Шри-Ланка", MY: "Малайзия",
  ID: "Индонезия", KR: "Южная Корея", CN: "Китай", IL: "Израиль",
  MX: "Мексика", DE: "Германия", FR: "Франция", ES: "Испания",
  IT: "Италия", NL: "Нидерланды", PT: "Португалия", AT: "Австрия",
  CZ: "Чехия", PL: "Польша", SE: "Швеция", FI: "Финляндия",
  NO: "Норвегия", DK: "Дания", BE: "Бельгия", GR: "Греция",
  HU: "Венгрия", GB: "Великобритания", US: "США", CA: "Канада",
  AU: "Австралия", JP: "Япония", SG: "Сингапур",
};

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

interface TMEvent {
  id: string;
  name: string;
  url: string;
  dates: {
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
    attractions?: {
      name: string;
      classifications?: { genre?: { name: string } }[];
      images?: { url: string; width: number; ratio?: string }[];
    }[];
  };
}

interface TMResponse {
  _embedded?: {
    events: TMEvent[];
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

function parseTMEvent(event: TMEvent): Concert | null {
  const venue = event._embedded?.venues?.[0];
  const attraction = event._embedded?.attractions?.[0];
  const countryCode = venue?.country?.countryCode ?? "";
  const city = venue?.city?.name ?? "";
  const date = event.dates.start.localDate ?? "";

  if (!city || !date) return null;

  const genre = attraction?.classifications?.[0]?.genre?.name ?? "";
  const artistName = attraction?.name ?? event.name;
  const artistImage = pickImage(attraction?.images) || pickImage(event.images);

  // Извлекаем время начала
  const time = event.dates.start.localTime ?? undefined;

  // Извлекаем цены билетов
  const priceRange = event.priceRanges?.[0];
  const priceMin = priceRange?.min ?? undefined;
  const priceMax = priceRange?.max ?? undefined;
  const currency = priceRange?.currency ?? undefined;

  return {
    id: `tm-${event.id}`,
    artist: {
      name: artistName,
      slug: slugify(artistName),
      imageUrl: artistImage,
      genre: genre === "Undefined" ? "" : genre,
    },
    date,
    time,
    priceMin,
    priceMax,
    currency,
    venue: venue?.name ?? "",
    city,
    country: countryRuNames[countryCode] ?? venue?.country?.name ?? "",
    countryCode,
    ticketUrl: event.url,
  };
}

/**
 * Поиск концертов по стране
 */
export async function searchEventsByCountry(
  countryCode: string,
  options: { page?: number; size?: number; keyword?: string; sort?: string } = {}
): Promise<{ concerts: Concert[]; totalPages: number }> {
  if (!API_KEY) return { concerts: [], totalPages: 0 };

  const { page = 0, size = 50, keyword, sort = "relevance,desc" } = options;
  const params = new URLSearchParams({
    apikey: API_KEY,
    countryCode,
    classificationName: "music",
    size: String(size),
    page: String(page),
    sort,
  });
  if (keyword) params.set("keyword", keyword);

  const url = `${BASE_URL}/events.json?${params}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return { concerts: [], totalPages: 0 };

  const data: TMResponse = await res.json();
  const events = data._embedded?.events ?? [];
  const concerts = events.map(parseTMEvent).filter((c): c is Concert => c !== null);

  return {
    concerts,
    totalPages: data.page?.totalPages ?? 0,
  };
}

/**
 * Поиск концертов по имени артиста
 */
export async function searchEventsByArtist(
  artistName: string,
  options: { size?: number } = {}
): Promise<Concert[]> {
  if (!API_KEY) return [];

  const { size = 200 } = options;
  const params = new URLSearchParams({
    apikey: API_KEY,
    keyword: artistName,
    classificationName: "music",
    size: String(size),
    sort: "date,asc",
  });

  const url = `${BASE_URL}/events.json?${params}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];

  const data: TMResponse = await res.json();
  const events = data._embedded?.events ?? [];
  return events.map(parseTMEvent).filter((c): c is Concert => c !== null);
}

// Топовые артисты — их концерты показываем первыми
const TOP_ARTISTS = [
  "Coldplay", "The Weeknd", "Ed Sheeran", "Dua Lipa", "Taylor Swift",
  "Billie Eilish", "Imagine Dragons", "Rammstein", "Arctic Monkeys", "Muse",
  "Metallica", "Kendrick Lamar", "Post Malone", "Twenty One Pilots", "Gorillaz",
  "Radiohead", "Tame Impala", "Red Hot Chili Peppers", "Depeche Mode", "Beyoncé",
  "The Killers", "Lana Del Rey", "Hozier", "Sam Smith", "Doja Cat",
];

// Набор для быстрой проверки (в нижнем регистре)
const topArtistSet = new Set(TOP_ARTISTS.map((a) => a.toLowerCase()));

/**
 * Загружаем концерты: сначала топовые артисты, потом популярное по странам
 */
export async function fetchFeaturedConcerts(): Promise<Concert[]> {
  // 1. Концерты топовых артистов (параллельно, по 10 за раз чтобы не превысить лимит)
  const artistBatches = [];
  for (let i = 0; i < TOP_ARTISTS.length; i += 10) {
    artistBatches.push(TOP_ARTISTS.slice(i, i + 10));
  }

  const allConcerts: Concert[] = [];
  const seenIds = new Set<string>();

  for (const batch of artistBatches) {
    const results = await Promise.allSettled(
      batch.map((name) => searchEventsByArtist(name, { size: 50 }))
    );
    for (const result of results) {
      if (result.status === "fulfilled") {
        for (const c of result.value) {
          if (!seenIds.has(c.id)) {
            seenIds.add(c.id);
            allConcerts.push(c);
          }
        }
      }
    }
  }

  // 2. Дополняем популярным из безвизовых стран (по relevance)
  const visaFreeCountries = ["TR", "AE", "RS", "GE", "AM", "KZ", "TH", "IL", "MA"];

  const countryResults = await Promise.allSettled(
    visaFreeCountries.map((code) =>
      searchEventsByCountry(code, { size: 50, sort: "relevance,desc" })
    )
  );

  for (const result of countryResults) {
    if (result.status === "fulfilled") {
      for (const c of result.value.concerts) {
        if (!seenIds.has(c.id)) {
          seenIds.add(c.id);
          allConcerts.push(c);
        }
      }
    }
  }

  // 3. Дедупликация: убираем концерты с одинаковым артистом, городом и датой
  const dedupMap = new Map<string, Concert>();
  for (const c of allConcerts) {
    const key = `${c.artist.slug}|${c.city}|${c.date}`;
    if (!dedupMap.has(key)) {
      dedupMap.set(key, c);
    }
  }
  const deduped = Array.from(dedupMap.values());

  // 4. Сортировка: топовые артисты первыми, потом по дате
  return deduped.sort((a, b) => {
    const aTop = topArtistSet.has(a.artist.name.toLowerCase()) ? 0 : 1;
    const bTop = topArtistSet.has(b.artist.name.toLowerCase()) ? 0 : 1;
    if (aTop !== bTop) return aTop - bTop;
    return a.date.localeCompare(b.date);
  });
}
