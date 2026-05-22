import type { Concert } from "@/types";

const BASE_URL = "https://rest.bandsintown.com";
const APP_ID = process.env.BANDSINTOWN_APP_ID || "concert_abroad_app";

interface BITArtist {
  id: string;
  name: string;
  url: string;
  image_url: string;
  thumb_url: string;
  tracker_count: number;
  upcoming_event_count: number;
}

interface BITVenue {
  name: string;
  city: string;
  region: string;
  country: string;
  latitude: string;
  longitude: string;
}

interface BITEvent {
  id: string;
  artist_id: string;
  url: string;
  on_sale_datetime: string;
  datetime: string;
  title: string;
  description: string;
  venue: BITVenue;
  lineup: string[];
  offers: { type: string; url: string; status: string }[];
}

// Маппинг стран из Bandsintown (английские названия) в ISO коды
const countryToCode: Record<string, string> = {
  Turkey: "TR", Serbia: "RS", Montenegro: "ME", "Bosnia and Herzegovina": "BA",
  "United Arab Emirates": "AE", Thailand: "TH", Georgia: "GE", Armenia: "AM",
  Kazakhstan: "KZ", Kyrgyzstan: "KG", Uzbekistan: "UZ", Azerbaijan: "AZ",
  Belarus: "BY", Argentina: "AR", Brazil: "BR", Cuba: "CU",
  Mongolia: "MN", Moldova: "MD", Qatar: "QA", Bahrain: "BH",
  Oman: "OM", Egypt: "EG", Morocco: "MA", Tunisia: "TN",
  Jordan: "JO", Lebanon: "LB", "Sri Lanka": "LK", Malaysia: "MY",
  Indonesia: "ID", "South Korea": "KR", "Korea, Republic of": "KR",
  China: "CN", Israel: "IL", Mexico: "MX",
  Germany: "DE", France: "FR", Spain: "ES", Italy: "IT",
  Netherlands: "NL", Portugal: "PT", Austria: "AT", "Czech Republic": "CZ",
  Czechia: "CZ", Poland: "PL", Sweden: "SE", Finland: "FI",
  Norway: "NO", Denmark: "DK", Belgium: "BE", Greece: "GR",
  Hungary: "HU", "United Kingdom": "GB", "United States": "US",
  Canada: "CA", Australia: "AU", Japan: "JP", Singapore: "SG",
  Türkiye: "TR",
};

const countryCodeToRussianName: Record<string, string> = {
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

function getCountryCode(countryName: string): string {
  return countryToCode[countryName] ?? "";
}

export async function fetchArtistEvents(artistName: string): Promise<Concert[]> {
  const encoded = encodeURIComponent(artistName);
  const url = `${BASE_URL}/artists/${encoded}/events?app_id=${APP_ID}&date=upcoming`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];

  const events: BITEvent[] = await res.json();
  if (!Array.isArray(events)) return [];

  return events.map((event) => {
    const countryCode = getCountryCode(event.venue.country);
    const countryRu = countryCodeToRussianName[countryCode] ?? event.venue.country;
    const ticketUrl = event.offers?.[0]?.url || event.url;

    return {
      id: `bit-${event.id}`,
      artist: {
        name: event.lineup[0] || artistName,
        slug: slugify(event.lineup[0] || artistName),
        imageUrl: "",
        genre: "",
      },
      date: event.datetime.split("T")[0],
      venue: event.venue.name,
      city: event.venue.city,
      country: countryRu,
      countryCode,
      ticketUrl,
    };
  });
}

export async function fetchArtistInfo(artistName: string): Promise<BITArtist | null> {
  const encoded = encodeURIComponent(artistName);
  const url = `${BASE_URL}/artists/${encoded}?app_id=${APP_ID}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return null;

  const data = await res.json();
  if (!data?.name) return null;

  return data as BITArtist;
}

// Список популярных артистов для главной страницы
export const FEATURED_ARTISTS = [
  "Radiohead", "The Weeknd", "Arctic Monkeys", "Dua Lipa",
  "Imagine Dragons", "Coldplay", "Rammstein", "Tame Impala",
  "Billie Eilish", "Gorillaz", "Muse", "Depeche Mode",
  "Red Hot Chili Peppers", "Metallica", "Twenty One Pilots",
  "Ed Sheeran", "Post Malone", "Kendrick Lamar",
];

export async function fetchAllFeaturedEvents(): Promise<Concert[]> {
  const results = await Promise.allSettled(
    FEATURED_ARTISTS.map((name) => fetchArtistEvents(name))
  );

  const allConcerts: Concert[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      allConcerts.push(...result.value);
    }
  }

  // Заполняем imageUrl из fetchArtistInfo для уникальных артистов
  const uniqueArtists = [...new Set(allConcerts.map((c) => c.artist.name))];
  const artistInfoMap = new Map<string, BITArtist>();

  const infoResults = await Promise.allSettled(
    uniqueArtists.map(async (name) => {
      const info = await fetchArtistInfo(name);
      if (info) artistInfoMap.set(name, info);
    })
  );

  for (const concert of allConcerts) {
    const info = artistInfoMap.get(concert.artist.name);
    if (info) {
      concert.artist.imageUrl = info.thumb_url || info.image_url;
    }
  }

  return allConcerts.sort((a, b) => a.date.localeCompare(b.date));
}
