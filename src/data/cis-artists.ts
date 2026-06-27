import type { Concert } from "@/types";

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
 * Последняя проверка дат: 2026-06-28
 */

const cisArtists = {
  little_big: {
    name: "Little Big",
    slug: "little-big",
    genre: "Rave / Electronic",
    imageUrl: "",
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
    imageUrl: "",
  },
};

export const cisConcerts: Concert[] = [
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
  return cisConcerts.filter((c) => c.artist.slug === slug);
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
