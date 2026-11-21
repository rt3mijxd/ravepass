import { artistPhotos } from "@/data/artist-photos";
import { canonicalArtistSlug } from "@/data/topArtists";
import type { ArtistSummary, Concert } from "@/types";

/**
 * Курируемые концерты СНГ/русскоязычных артистов.
 * Ticketmaster слабо покрывает этот рынок — добавляем вручную.
 *
 * ВАЖНО: только РЕАЛЬНЫЕ, проверенные даты предстоящих концертов.
 * Прошедшие концерты автоматически скрываются фильтром (src/lib/dates.ts),
 * но всё равно лучше держать список актуальным.
 *
 * Как добавить концерт:
 * 1. Найди реальную дату на офиц. сайте артиста / songkick / kassir / ticketon
 * 2. Создай артиста в `cisArtists` (slug, name, genre) — если его ещё нет
 * 3. Добавь концерт в `cisConcerts` с countryCode и английским названием города
 *    (английское название нужно, чтобы работали перелёты и ссылки на Aviasales)
 *
 * Последняя проверка новых дат: 2026-11-21
 */

const cisArtists = {
  morgenshtern: { name: "MORGENSHTERN", slug: "morgenshtern", genre: "Hip-Hop", imageUrl: artistPhotos["morgenshtern"].imageUrl },
  noize: { name: "Noize MC", slug: "noize-mc", genre: "Hip-Hop", imageUrl: artistPhotos["noize-mc"].imageUrl },
  bi2: { name: "Би-2", slug: "bi-2", genre: "Rock", imageUrl: artistPhotos["bi-2"].imageUrl },
  little_big: {
    name: "Little Big",
    slug: "little-big",
    genre: "Rave / Electronic",
    imageUrl: artistPhotos["little-big"].imageUrl,
  },
  kasta: {
    name: "Каста",
    slug: "kasta",
    genre: "Hip-Hop",
    imageUrl: "",
  },
  aigel: {
    name: "AIGEL",
    slug: "aigel",
    genre: "Electronic / Trip-Hop",
    imageUrl: "",
  },
  poshlaya_molly: {
    name: "Пошлая Молли",
    slug: "poshlaya-molly",
    genre: "Pop-Punk / Indie",
    imageUrl: artistPhotos["poshlaya-molly"].imageUrl,
  },
};

type TourStop = Pick<Concert, "date" | "city" | "countryCode" | "venue">
  & Pick<Concert, "dateEnd" | "time" | "soldOut" | "ticketUrl">;

function tour(artist: ArtistSummary, stops: TourStop[]): Concert[] {
  return stops.map((stop) => ({
    ...stop,
    id: `cis-${artist.slug}-${stop.date}-${stop.countryCode.toLowerCase()}`,
    artist,
    country: "",
  }));
}

const littleBigSource = "https://eventcartel.com/tours/little-big-north-american-tour-2027-buy-tickets-2201";
const bi2Source = "https://tix.b2band.com/";
const mollySource = "https://poshlayamolly.com/live";

const littleBigStops: [string, string, string, string][] = [
  ["2027-02-21", "Chicago", "US", "Joe’s Live"],
  ["2027-02-23", "Washington", "US", "Karma Lounge"],
  ["2027-02-25", "Philadelphia", "US", "Underground Arts"],
  ["2027-02-26", "New York", "US", "Melrose Ballroom"],
  ["2027-02-28", "Orlando", "US", "The Plaza Live"],
  ["2027-03-01", "St. Petersburg, FL", "US", "Jannus Live"],
  ["2027-03-03", "Montreal", "CA", "Rialto Theatre"],
  ["2027-03-04", "Toronto", "CA", "The Concert Hall"],
  ["2027-03-06", "Boston", "US", "Royale"],
  ["2027-03-07", "Austin", "US", "Mohawk Austin"],
  ["2027-03-09", "Calgary", "CA", "The Palace Theatre"],
  ["2027-03-10", "Edmonton", "CA", ""],
  ["2027-03-11", "Vancouver", "CA", "The Vogue Theatre"],
  ["2027-03-13", "San Francisco", "US", "UC Theatre"],
  ["2027-03-14", "Seattle", "US", "The Showbox"],
  ["2027-03-15", "San Diego", "US", "Music Box"],
  ["2027-03-18", "Los Angeles", "US", "Avalon Hollywood"],
];

const bi2Stops: [string, string, string, string][] = [
  ["2026-11-23", "Barcelona", "ES", "Razzmatazz"],
  ["2026-11-25", "Copenhagen", "DK", "Amager Bio"],
  ["2027-02-24", "Dresden", "DE", "Alten Schlachthof"],
  ["2027-02-26", "Offenbach", "DE", "Stadthalle Offenbach"],
  ["2027-02-28", "Munich", "DE", "Kleine Olympiahalle"],
];

const confirmedConcerts = [
  ...tour(cisArtists.morgenshtern, [
    { date: "2026-12-19", city: "Yerevan", countryCode: "AM", venue: "Karen Demirchyan Complex", soldOut: true, ticketUrl: "https://morgenshtern.love/" },
    { date: "2026-12-20", city: "Yerevan", countryCode: "AM", venue: "Karen Demirchyan Complex", ticketUrl: "https://morgenshtern.love/pages/yerevan" },
  ]),
  ...tour(cisArtists.noize, [
    { date: "2027-06-11", dateEnd: "2027-06-13", city: "Belgrade", countryCode: "RS", venue: "Outloud Festival · Kalemegdan", ticketUrl: "https://noizemc.com/event/belgrade-serbia-outloud-festival-2027/" },
    { date: "2027-08-20", dateEnd: "2027-08-22", city: "Yerevan", countryCode: "AM", venue: "Outloud Festival · Yerevan Park", ticketUrl: "https://outloud-fest.com/" },
  ]),
  ...tour(cisArtists.poshlaya_molly, [
    { date: "2026-11-22", city: "Tashkent", countryCode: "UZ", venue: "Yunusobod SM", ticketUrl: mollySource },
    { date: "2027-01-12", city: "Pattaya", countryCode: "TH", venue: "Lotus Arena", ticketUrl: mollySource },
    { date: "2027-01-14", city: "Phuket", countryCode: "TH", venue: "Lotus Arena", ticketUrl: mollySource },
    { date: "2027-01-16", city: "Nha Trang", countryCode: "VN", venue: "Lotus Arena", ticketUrl: mollySource },
    { date: "2027-01-18", city: "Bali", countryCode: "ID", venue: "The Stage", ticketUrl: mollySource },
  ]),
  ...tour(cisArtists.little_big, littleBigStops.map(([date, city, countryCode, venue]) => ({
    date, city, countryCode, venue, ticketUrl: littleBigSource,
  }))),
  ...tour(cisArtists.bi2, bi2Stops.map(([date, city, countryCode, venue]) => ({
    date, city, countryCode, venue, time: "20:00", ticketUrl: bi2Source,
  }))),
];

export const cisConcerts: Concert[] = [
  ...confirmedConcerts,
  // ===== Little Big — European Tour 2026 (электроника/рейв) =====
  // Источник: songkick.com/artists/4472958-little-big
  {
    id: "cis-lb-1", artist: cisArtists.little_big,
    date: "2026-10-07", time: "20:00:00", venue: "",
    city: "Chișinău", country: "Молдова", countryCode: "MD",
    ticketUrl: "https://www.songkick.com/artists/4472958-little-big",
  },
  {
    id: "cis-lb-2", artist: cisArtists.little_big,
    date: "2026-10-09", time: "20:00:00", venue: "",
    city: "Valencia", country: "Испания", countryCode: "ES",
    ticketUrl: "https://www.songkick.com/artists/4472958-little-big",
  },
  {
    id: "cis-lb-3", artist: cisArtists.little_big,
    date: "2026-10-11", time: "20:00:00", venue: "",
    city: "Oslo", country: "Норвегия", countryCode: "NO",
    ticketUrl: "https://www.songkick.com/artists/4472958-little-big",
  },
  {
    id: "cis-lb-4", artist: cisArtists.little_big,
    date: "2026-10-12", time: "20:00:00", venue: "",
    city: "Copenhagen", country: "Дания", countryCode: "DK",
    ticketUrl: "https://www.songkick.com/artists/4472958-little-big",
  },
  {
    id: "cis-lb-5", artist: cisArtists.little_big,
    date: "2026-10-14", time: "20:00:00", venue: "",
    city: "Helsinki", country: "Финляндия", countryCode: "FI",
    ticketUrl: "https://www.songkick.com/artists/4472958-little-big",
  },
  {
    id: "cis-lb-6", artist: cisArtists.little_big,
    date: "2026-10-16", time: "20:00:00", venue: "",
    city: "Tallinn", country: "Эстония", countryCode: "EE",
    ticketUrl: "https://www.songkick.com/artists/4472958-little-big",
  },
  {
    id: "cis-lb-7", artist: cisArtists.little_big,
    date: "2026-10-17", time: "20:00:00", venue: "",
    city: "Vilnius", country: "Литва", countryCode: "LT",
    ticketUrl: "https://www.songkick.com/artists/4472958-little-big",
  },
  {
    id: "cis-lb-8", artist: cisArtists.little_big,
    date: "2026-10-18", time: "20:00:00", venue: "",
    city: "Riga", country: "Латвия", countryCode: "LV",
    ticketUrl: "https://www.songkick.com/artists/4472958-little-big",
  },
  {
    id: "cis-lb-9", artist: cisArtists.little_big,
    date: "2026-10-20", time: "20:00:00", venue: "",
    city: "Warsaw", country: "Польша", countryCode: "PL",
    ticketUrl: "https://www.songkick.com/artists/4472958-little-big",
  },

  // ===== Каста — осенние концерты 2026 =====
  // Источник: kasta.world/tour
  {
    id: "cis-ka-1", artist: cisArtists.kasta,
    date: "2026-09-22", time: "20:00:00", venue: "Legend Club",
    city: "Milan", country: "Италия", countryCode: "IT",
    ticketUrl: "https://kasta.world/tour/",
  },
  {
    id: "cis-ka-2", artist: cisArtists.kasta,
    date: "2026-09-23", time: "20:00:00", venue: "Kanzlei",
    city: "Zurich", country: "Швейцария", countryCode: "CH",
    ticketUrl: "https://kasta.world/tour/",
  },
  {
    id: "cis-ka-3", artist: cisArtists.kasta,
    date: "2026-09-24", time: "20:00:00", venue: "Sponge Pub",
    city: "Antalya", country: "Турция", countryCode: "TR",
    ticketUrl: "https://kasta.world/tour/",
  },

  // ===== AIGEL — European Tour 2026 =====
  // Источник: eventim.de / kontramarka
  {
    id: "cis-ai-1", artist: cisArtists.aigel,
    date: "2026-09-30", time: "20:00:00", venue: "",
    city: "Amsterdam", country: "Нидерланды", countryCode: "NL",
    ticketUrl: "https://www.eventim.de/en/artist/aigel/",
  },

  // ===== Пошлая Молли — 10 YEARS =====
  // Источник: poshlayamolly.com/live
  {
    id: "cis-pm-1", artist: cisArtists.poshlaya_molly,
    date: "2026-09-29", time: "20:00:00", venue: "The Clapham Grand",
    city: "London", country: "Великобритания", countryCode: "GB",
    ticketUrl: "https://poshlayamolly.com/live",
  },
];

// Быстрый поиск CIS-концертов по slug артиста
export function getCisConcertsByArtistSlug(slug: string): Concert[] {
  return cisConcerts.filter((c) => canonicalArtistSlug(c.artist.slug) === canonicalArtistSlug(slug));
}

// Поиск CIS-концертов по имени (нечёткий поиск)
export function searchCisConcerts(query: string): Concert[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return cisConcerts.filter((c) => c.artist.name.toLowerCase().includes(q));
}

// Проверка: является ли артист CIS-артистом
export function isCisArtist(name: string): boolean {
  const q = name.toLowerCase().trim();
  return cisConcerts.some((c) => c.artist.name.toLowerCase().includes(q));
}

// Все уникальные CIS-артисты (для отображения)
export function getCisArtistList(): { name: string; slug: string; genre: string; imageUrl: string }[] {
  const seen = new Set<string>();
  const list: { name: string; slug: string; genre: string; imageUrl: string }[] = [];
  for (const c of cisConcerts) {
    if (!seen.has(c.artist.slug)) {
      seen.add(c.artist.slug);
      list.push({ name: c.artist.name, slug: c.artist.slug, genre: c.artist.genre, imageUrl: c.artist.imageUrl });
    }
  }
  return list;
}
