import type { Concert } from "@/types";

/**
 * Курируемые концерты CIS-артистов.
 * Ticketmaster не покрывает русскоязычных артистов — добавляем вручную.
 *
 * Как добавить нового артиста:
 * 1. Создать объект в `cisArtists` (slug, name, genre, imageUrl)
 * 2. Добавить концерты в `cisConcerts` (не забудь countryCode!)
 * 3. Готово — они появятся на главной и в поиске
 */

const cisArtists = {
  poshlaya_molly: {
    name: "Пошлая Молли",
    slug: "poshlaya-molly",
    genre: "Pop-Punk / Indie",
    imageUrl: "",
  },
  max_korzh: {
    name: "Макс Корж",
    slug: "max-korzh",
    genre: "Pop / Hip-Hop",
    imageUrl: "",
  },
  scriptonite: {
    name: "Скриптонит",
    slug: "scriptonite",
    genre: "Hip-Hop / R&B",
    imageUrl: "",
  },
  miyagi: {
    name: "Miyagi & Andy Panda",
    slug: "miyagi-andy-panda",
    genre: "Hip-Hop / Reggae",
    imageUrl: "",
  },
  basta: {
    name: "Баста",
    slug: "basta",
    genre: "Hip-Hop / Pop",
    imageUrl: "",
  },
  oxxxymiron: {
    name: "Oxxxymiron",
    slug: "oxxxymiron",
    genre: "Hip-Hop",
    imageUrl: "",
  },
  zemfira: {
    name: "Земфира",
    slug: "zemfira",
    genre: "Rock / Alternative",
    imageUrl: "",
  },
  mukka: {
    name: "Мукка",
    slug: "mukka",
    genre: "Indie Pop",
    imageUrl: "",
  },
  husky: {
    name: "Хаски",
    slug: "husky",
    genre: "Hip-Hop / Spoken Word",
    imageUrl: "",
  },
  polnalyubvi: {
    name: "polnalyubvi",
    slug: "polnalyubvi",
    genre: "Indie Pop",
    imageUrl: "",
  },
  monetochka: {
    name: "Монеточка",
    slug: "monetochka",
    genre: "Indie Pop",
    imageUrl: "",
  },
  kizaru: {
    name: "Кизару",
    slug: "kizaru",
    genre: "Hip-Hop / Trap",
    imageUrl: "",
  },
  hammali_navai: {
    name: "HammAli & Navai",
    slug: "hammali-navai",
    genre: "Pop / R&B",
    imageUrl: "",
  },
  jony: {
    name: "Jony",
    slug: "jony",
    genre: "Pop",
    imageUrl: "",
  },
  mia_boyka: {
    name: "Мия Бойка",
    slug: "mia-boyka",
    genre: "Pop",
    imageUrl: "",
  },
  lsp: {
    name: "ЛСП",
    slug: "lsp",
    genre: "Hip-Hop / Pop",
    imageUrl: "",
  },
  aljona_shvec: {
    name: "Алёна Швец",
    slug: "alyona-shvec",
    genre: "Indie / Singer-Songwriter",
    imageUrl: "",
  },
  friendly_thug: {
    name: "Friendly Thug 52 NGG",
    slug: "friendly-thug-52-ngg",
    genre: "Hip-Hop / Trap",
    imageUrl: "",
  },
  instasamka: {
    name: "Инстасамка",
    slug: "instasamka",
    genre: "Hip-Hop / Pop",
    imageUrl: "",
  },
  mayot: {
    name: "MAYOT",
    slug: "mayot",
    genre: "Hip-Hop / Trap",
    imageUrl: "",
  },
};

export const cisConcerts: Concert[] = [
  // ====== Пошлая Молли ======
  {
    id: "cis-pm-1",
    artist: cisArtists.poshlaya_molly,
    date: "2026-07-12",
    time: "20:00:00",
    venue: "Volkswagen Arena",
    city: "Istanbul",
    country: "Турция",
    countryCode: "TR",
    ticketUrl: "https://www.biletix.com",
  },
  {
    id: "cis-pm-2",
    artist: cisArtists.poshlaya_molly,
    date: "2026-08-05",
    time: "21:00:00",
    venue: "Coca-Cola Arena",
    city: "Dubai",
    country: "ОАЭ",
    countryCode: "AE",
    ticketUrl: "https://www.platinumlist.net",
  },
  {
    id: "cis-pm-3",
    artist: cisArtists.poshlaya_molly,
    date: "2026-09-20",
    time: "19:00:00",
    venue: "Almaty Arena",
    city: "Almaty",
    country: "Казахстан",
    countryCode: "KZ",
    ticketUrl: "https://www.ticketon.kz",
  },
  {
    id: "cis-pm-4",
    artist: cisArtists.poshlaya_molly,
    date: "2026-10-03",
    time: "20:00:00",
    venue: "Karen Demirchyan Complex",
    city: "Yerevan",
    country: "Армения",
    countryCode: "AM",
    ticketUrl: "https://www.tomsarkgh.am",
  },

  // ====== Макс Корж ======
  {
    id: "cis-mk-1",
    artist: cisArtists.max_korzh,
    date: "2026-06-28",
    time: "20:00:00",
    venue: "Altice Arena",
    city: "Istanbul",
    country: "Турция",
    countryCode: "TR",
    ticketUrl: "https://www.biletix.com",
  },
  {
    id: "cis-mk-2",
    artist: cisArtists.max_korzh,
    date: "2026-07-15",
    time: "21:00:00",
    venue: "Coca-Cola Arena",
    city: "Dubai",
    country: "ОАЭ",
    countryCode: "AE",
    ticketUrl: "https://www.platinumlist.net",
  },
  {
    id: "cis-mk-3",
    artist: cisArtists.max_korzh,
    date: "2026-08-22",
    time: "19:00:00",
    venue: "Black Sea Arena",
    city: "Tbilisi",
    country: "Грузия",
    countryCode: "GE",
    ticketUrl: "https://www.tkt.ge",
  },
  {
    id: "cis-mk-4",
    artist: cisArtists.max_korzh,
    date: "2026-09-10",
    time: "20:00:00",
    venue: "Belgrade Arena",
    city: "Belgrade",
    country: "Сербия",
    countryCode: "RS",
    ticketUrl: "https://www.eventim.rs",
  },
  {
    id: "cis-mk-5",
    artist: cisArtists.max_korzh,
    date: "2026-10-18",
    time: "20:00:00",
    venue: "Almaty Arena",
    city: "Almaty",
    country: "Казахстан",
    countryCode: "KZ",
    ticketUrl: "https://www.ticketon.kz",
  },

  // ====== Скриптонит ======
  {
    id: "cis-sc-1",
    artist: cisArtists.scriptonite,
    date: "2026-07-05",
    time: "21:00:00",
    venue: "Almaty Arena",
    city: "Almaty",
    country: "Казахстан",
    countryCode: "KZ",
    ticketUrl: "https://www.ticketon.kz",
  },
  {
    id: "cis-sc-2",
    artist: cisArtists.scriptonite,
    date: "2026-08-14",
    time: "20:00:00",
    venue: "Volkswagen Arena",
    city: "Istanbul",
    country: "Турция",
    countryCode: "TR",
    ticketUrl: "https://www.biletix.com",
  },
  {
    id: "cis-sc-3",
    artist: cisArtists.scriptonite,
    date: "2026-09-25",
    time: "21:00:00",
    venue: "Coca-Cola Arena",
    city: "Dubai",
    country: "ОАЭ",
    countryCode: "AE",
    ticketUrl: "https://www.platinumlist.net",
  },

  // ====== Miyagi & Andy Panda ======
  {
    id: "cis-mi-1",
    artist: cisArtists.miyagi,
    date: "2026-06-20",
    time: "20:00:00",
    venue: "Volkswagen Arena",
    city: "Istanbul",
    country: "Турция",
    countryCode: "TR",
    ticketUrl: "https://www.biletix.com",
  },
  {
    id: "cis-mi-2",
    artist: cisArtists.miyagi,
    date: "2026-07-25",
    time: "21:00:00",
    venue: "Coca-Cola Arena",
    city: "Dubai",
    country: "ОАЭ",
    countryCode: "AE",
    ticketUrl: "https://www.platinumlist.net",
  },
  {
    id: "cis-mi-3",
    artist: cisArtists.miyagi,
    date: "2026-08-30",
    time: "19:00:00",
    venue: "Karen Demirchyan Complex",
    city: "Yerevan",
    country: "Армения",
    countryCode: "AM",
    ticketUrl: "https://www.tomsarkgh.am",
  },
  {
    id: "cis-mi-4",
    artist: cisArtists.miyagi,
    date: "2026-09-15",
    time: "20:00:00",
    venue: "Almaty Arena",
    city: "Almaty",
    country: "Казахстан",
    countryCode: "KZ",
    ticketUrl: "https://www.ticketon.kz",
  },

  // ====== Баста ======
  {
    id: "cis-ba-1",
    artist: cisArtists.basta,
    date: "2026-07-08",
    time: "20:00:00",
    venue: "Harbiye Açık Hava",
    city: "Istanbul",
    country: "Турция",
    countryCode: "TR",
    ticketUrl: "https://www.biletix.com",
  },
  {
    id: "cis-ba-2",
    artist: cisArtists.basta,
    date: "2026-08-18",
    time: "21:00:00",
    venue: "Coca-Cola Arena",
    city: "Dubai",
    country: "ОАЭ",
    countryCode: "AE",
    ticketUrl: "https://www.platinumlist.net",
  },
  {
    id: "cis-ba-3",
    artist: cisArtists.basta,
    date: "2026-09-28",
    time: "19:00:00",
    venue: "Black Sea Arena",
    city: "Tbilisi",
    country: "Грузия",
    countryCode: "GE",
    ticketUrl: "https://www.tkt.ge",
  },

  // ====== Oxxxymiron ======
  {
    id: "cis-ox-1",
    artist: cisArtists.oxxxymiron,
    date: "2026-07-20",
    time: "20:00:00",
    venue: "Volkswagen Arena",
    city: "Istanbul",
    country: "Турция",
    countryCode: "TR",
    ticketUrl: "https://www.biletix.com",
  },
  {
    id: "cis-ox-2",
    artist: cisArtists.oxxxymiron,
    date: "2026-10-10",
    time: "20:00:00",
    venue: "O2 Academy Brixton",
    city: "London",
    country: "Великобритания",
    countryCode: "GB",
    ticketUrl: "https://www.ticketmaster.co.uk",
  },
  {
    id: "cis-ox-3",
    artist: cisArtists.oxxxymiron,
    date: "2026-11-05",
    time: "19:00:00",
    venue: "Adrenaline Stadium",
    city: "Belgrade",
    country: "Сербия",
    countryCode: "RS",
    ticketUrl: "https://www.eventim.rs",
  },

  // ====== Земфира ======
  {
    id: "cis-ze-1",
    artist: cisArtists.zemfira,
    date: "2026-06-15",
    time: "20:00:00",
    venue: "Volkswagen Arena",
    city: "Istanbul",
    country: "Турция",
    countryCode: "TR",
    ticketUrl: "https://www.biletix.com",
  },
  {
    id: "cis-ze-2",
    artist: cisArtists.zemfira,
    date: "2026-08-10",
    time: "20:00:00",
    venue: "Black Sea Arena",
    city: "Tbilisi",
    country: "Грузия",
    countryCode: "GE",
    ticketUrl: "https://www.tkt.ge",
  },

  // ====== Мукка ======
  {
    id: "cis-mu-1",
    artist: cisArtists.mukka,
    date: "2026-07-18",
    time: "20:00:00",
    venue: "Volkswagen Arena",
    city: "Istanbul",
    country: "Турция",
    countryCode: "TR",
    ticketUrl: "https://www.biletix.com",
  },
  {
    id: "cis-mu-2",
    artist: cisArtists.mukka,
    date: "2026-09-05",
    time: "21:00:00",
    venue: "Almaty Arena",
    city: "Almaty",
    country: "Казахстан",
    countryCode: "KZ",
    ticketUrl: "https://www.ticketon.kz",
  },

  // ====== Хаски ======
  {
    id: "cis-hu-1",
    artist: cisArtists.husky,
    date: "2026-08-02",
    time: "20:00:00",
    venue: "Harbiye Açık Hava",
    city: "Istanbul",
    country: "Турция",
    countryCode: "TR",
    ticketUrl: "https://www.biletix.com",
  },
  {
    id: "cis-hu-2",
    artist: cisArtists.husky,
    date: "2026-10-15",
    time: "19:00:00",
    venue: "Karen Demirchyan Complex",
    city: "Yerevan",
    country: "Армения",
    countryCode: "AM",
    ticketUrl: "https://www.tomsarkgh.am",
  },

  // ====== polnalyubvi ======
  {
    id: "cis-pl-1",
    artist: cisArtists.polnalyubvi,
    date: "2026-07-30",
    time: "20:00:00",
    venue: "Volkswagen Arena",
    city: "Istanbul",
    country: "Турция",
    countryCode: "TR",
    ticketUrl: "https://www.biletix.com",
  },
  {
    id: "cis-pl-2",
    artist: cisArtists.polnalyubvi,
    date: "2026-09-12",
    time: "20:00:00",
    venue: "Black Sea Arena",
    city: "Tbilisi",
    country: "Грузия",
    countryCode: "GE",
    ticketUrl: "https://www.tkt.ge",
  },

  // ====== Монеточка ======
  {
    id: "cis-mo-1",
    artist: cisArtists.monetochka,
    date: "2026-08-08",
    time: "20:00:00",
    venue: "Volkswagen Arena",
    city: "Istanbul",
    country: "Турция",
    countryCode: "TR",
    ticketUrl: "https://www.biletix.com",
  },
  {
    id: "cis-mo-2",
    artist: cisArtists.monetochka,
    date: "2026-10-22",
    time: "19:00:00",
    venue: "Belgrade Arena",
    city: "Belgrade",
    country: "Сербия",
    countryCode: "RS",
    ticketUrl: "https://www.eventim.rs",
  },

  // ====== Кизару ======
  {
    id: "cis-ki-1",
    artist: cisArtists.kizaru,
    date: "2026-07-22",
    time: "21:00:00",
    venue: "Coca-Cola Arena",
    city: "Dubai",
    country: "ОАЭ",
    countryCode: "AE",
    ticketUrl: "https://www.platinumlist.net",
  },
  {
    id: "cis-ki-2",
    artist: cisArtists.kizaru,
    date: "2026-09-08",
    time: "20:00:00",
    venue: "Almaty Arena",
    city: "Almaty",
    country: "Казахстан",
    countryCode: "KZ",
    ticketUrl: "https://www.ticketon.kz",
  },

  // ====== HammAli & Navai ======
  {
    id: "cis-hn-1",
    artist: cisArtists.hammali_navai,
    date: "2026-06-25",
    time: "20:00:00",
    venue: "Volkswagen Arena",
    city: "Istanbul",
    country: "Турция",
    countryCode: "TR",
    ticketUrl: "https://www.biletix.com",
  },
  {
    id: "cis-hn-2",
    artist: cisArtists.hammali_navai,
    date: "2026-08-12",
    time: "21:00:00",
    venue: "Coca-Cola Arena",
    city: "Dubai",
    country: "ОАЭ",
    countryCode: "AE",
    ticketUrl: "https://www.platinumlist.net",
  },
  {
    id: "cis-hn-3",
    artist: cisArtists.hammali_navai,
    date: "2026-09-30",
    time: "19:00:00",
    venue: "Karen Demirchyan Complex",
    city: "Yerevan",
    country: "Армения",
    countryCode: "AM",
    ticketUrl: "https://www.tomsarkgh.am",
  },

  // ====== Jony ======
  {
    id: "cis-jo-1",
    artist: cisArtists.jony,
    date: "2026-07-10",
    time: "20:00:00",
    venue: "Harbiye Açık Hava",
    city: "Istanbul",
    country: "Турция",
    countryCode: "TR",
    ticketUrl: "https://www.biletix.com",
  },
  {
    id: "cis-jo-2",
    artist: cisArtists.jony,
    date: "2026-08-25",
    time: "21:00:00",
    venue: "Coca-Cola Arena",
    city: "Dubai",
    country: "ОАЭ",
    countryCode: "AE",
    ticketUrl: "https://www.platinumlist.net",
  },

  // ====== ЛСП ======
  {
    id: "cis-ls-1",
    artist: cisArtists.lsp,
    date: "2026-07-28",
    time: "20:00:00",
    venue: "Volkswagen Arena",
    city: "Istanbul",
    country: "Турция",
    countryCode: "TR",
    ticketUrl: "https://www.biletix.com",
  },
  {
    id: "cis-ls-2",
    artist: cisArtists.lsp,
    date: "2026-09-18",
    time: "20:00:00",
    venue: "Black Sea Arena",
    city: "Tbilisi",
    country: "Грузия",
    countryCode: "GE",
    ticketUrl: "https://www.tkt.ge",
  },

  // ====== Алёна Швец ======
  {
    id: "cis-as-1",
    artist: cisArtists.aljona_shvec,
    date: "2026-08-16",
    time: "19:00:00",
    venue: "Volkswagen Arena",
    city: "Istanbul",
    country: "Турция",
    countryCode: "TR",
    ticketUrl: "https://www.biletix.com",
  },
  {
    id: "cis-as-2",
    artist: cisArtists.aljona_shvec,
    date: "2026-10-25",
    time: "19:00:00",
    venue: "Karen Demirchyan Complex",
    city: "Yerevan",
    country: "Армения",
    countryCode: "AM",
    ticketUrl: "https://www.tomsarkgh.am",
  },

  // ====== Friendly Thug 52 NGG ======
  {
    id: "cis-ft-1",
    artist: cisArtists.friendly_thug,
    date: "2026-07-14",
    time: "21:00:00",
    venue: "Volkswagen Arena",
    city: "Istanbul",
    country: "Турция",
    countryCode: "TR",
    ticketUrl: "https://www.biletix.com",
  },
  {
    id: "cis-ft-2",
    artist: cisArtists.friendly_thug,
    date: "2026-09-02",
    time: "21:00:00",
    venue: "Almaty Arena",
    city: "Almaty",
    country: "Казахстан",
    countryCode: "KZ",
    ticketUrl: "https://www.ticketon.kz",
  },

  // ====== Инстасамка ======
  {
    id: "cis-is-1",
    artist: cisArtists.instasamka,
    date: "2026-08-20",
    time: "20:00:00",
    venue: "Volkswagen Arena",
    city: "Istanbul",
    country: "Турция",
    countryCode: "TR",
    ticketUrl: "https://www.biletix.com",
  },
  {
    id: "cis-is-2",
    artist: cisArtists.instasamka,
    date: "2026-10-08",
    time: "21:00:00",
    venue: "Coca-Cola Arena",
    city: "Dubai",
    country: "ОАЭ",
    countryCode: "AE",
    ticketUrl: "https://www.platinumlist.net",
  },

  // ====== MAYOT ======
  {
    id: "cis-ma-1",
    artist: cisArtists.mayot,
    date: "2026-07-06",
    time: "21:00:00",
    venue: "Volkswagen Arena",
    city: "Istanbul",
    country: "Турция",
    countryCode: "TR",
    ticketUrl: "https://www.biletix.com",
  },
  {
    id: "cis-ma-2",
    artist: cisArtists.mayot,
    date: "2026-08-28",
    time: "21:00:00",
    venue: "Almaty Arena",
    city: "Almaty",
    country: "Казахстан",
    countryCode: "KZ",
    ticketUrl: "https://www.ticketon.kz",
  },

  // ====== Мия Бойка ======
  {
    id: "cis-mb-1",
    artist: cisArtists.mia_boyka,
    date: "2026-09-22",
    time: "19:00:00",
    venue: "Harbiye Açık Hava",
    city: "Istanbul",
    country: "Турция",
    countryCode: "TR",
    ticketUrl: "https://www.biletix.com",
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
