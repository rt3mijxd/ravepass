import type { Concert } from "@/types";

const artists = {
  radiohead: {
    name: "Radiohead", slug: "radiohead", genre: "Alternative Rock",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/RadioheadO2211125_composite.jpg/500px-RadioheadO2211125_composite.jpg",
  },
  weeknd: {
    name: "The Weeknd", slug: "the-weeknd", genre: "R&B / Pop",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/The_Weeknd_Portrait_by_Brian_Ziff.jpg/500px-The_Weeknd_Portrait_by_Brian_Ziff.jpg",
  },
  arctic: {
    name: "Arctic Monkeys", slug: "arctic-monkeys", genre: "Indie Rock",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Arctic_Monkeys_-_Orange_Stage_-_Roskilde_Festival_2014.jpg/500px-Arctic_Monkeys_-_Orange_Stage_-_Roskilde_Festival_2014.jpg",
  },
  dualipa: {
    name: "Dua Lipa", slug: "dua-lipa", genre: "Pop",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Dua_Lipa-69798_%28cropped%29.jpg/500px-Dua_Lipa-69798_%28cropped%29.jpg",
  },
  imagine: {
    name: "Imagine Dragons", slug: "imagine-dragons", genre: "Pop Rock",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Imagine_Dragons_-_Uncasville_CT_-_November_2017_-_2.jpg/500px-Imagine_Dragons_-_Uncasville_CT_-_November_2017_-_2.jpg",
  },
  coldplay: {
    name: "Coldplay", slug: "coldplay", genre: "Alternative Rock",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/ColdplayWembley120925_%28cropped%29.jpg/500px-ColdplayWembley120925_%28cropped%29.jpg",
  },
  rammstein: {
    name: "Rammstein", slug: "rammstein", genre: "Industrial Metal",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Rammstein_at_Wacken_Open_Air_2013_06.jpg/500px-Rammstein_at_Wacken_Open_Air_2013_06.jpg",
  },
  tame: {
    name: "Tame Impala", slug: "tame-impala", genre: "Psychedelic Rock",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Tame_Impala_at_Flow_Festival_Helsinki_Aug_10_2019_-24.jpg/500px-Tame_Impala_at_Flow_Festival_Helsinki_Aug_10_2019_-24.jpg",
  },
  billie: {
    name: "Billie Eilish", slug: "billie-eilish", genre: "Pop",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/BillieEilishO2140725-39_-_54665577407_%28cropped%29.jpg/500px-BillieEilishO2140725-39_-_54665577407_%28cropped%29.jpg",
  },
  gorillaz: {
    name: "Gorillaz", slug: "gorillaz", genre: "Alternative / Electronic",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Damon_Albarn_live29.07.2013_in_Rome_4_%28cropped%29.JPG/500px-Damon_Albarn_live29.07.2013_in_Rome_4_%28cropped%29.JPG",
  },
  muse: {
    name: "Muse", slug: "muse", genre: "Alternative Rock",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/MuseHammsmith100522_%2847_of_76%29_%2852089636284%29.jpg/500px-MuseHammsmith100522_%2847_of_76%29_%2852089636284%29.jpg",
  },
  kendrick: {
    name: "Kendrick Lamar", slug: "kendrick-lamar", genre: "Hip-Hop",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/KendrickSZASPurs230725-144_%28cropped%29_desaturated.jpg/500px-KendrickSZASPurs230725-144_%28cropped%29_desaturated.jpg",
  },
};

export const mockConcerts: Concert[] = [
  // Турция — безвиз для всех
  {
    id: "1", artist: artists.radiohead,
    date: "2026-07-15", venue: "Volkswagen Arena", city: "Стамбул", country: "Турция", countryCode: "TR",
    ticketUrl: "https://www.biletix.com",
  },
  {
    id: "11", artist: artists.weeknd,
    date: "2026-07-05", venue: "KüsçükÇiftlik Park", city: "Стамбул", country: "Турция", countryCode: "TR",
    ticketUrl: "https://www.biletix.com",
  },
  {
    id: "18", artist: artists.muse,
    date: "2026-08-22", venue: "Harbiye Açık Hava", city: "Стамбул", country: "Турция", countryCode: "TR",
    ticketUrl: "https://www.biletix.com",
  },

  // ОАЭ — безвиз для всех
  {
    id: "2", artist: artists.weeknd,
    date: "2026-08-20", venue: "Coca-Cola Arena", city: "Дубай", country: "ОАЭ", countryCode: "AE",
    ticketUrl: "https://www.coca-cola-arena.com",
  },
  {
    id: "14", artist: artists.dualipa,
    date: "2026-11-14", venue: "Etihad Arena", city: "Абу-Даби", country: "ОАЭ", countryCode: "AE",
    ticketUrl: "https://www.etihadarena.ae",
  },

  // Сербия — безвиз для всех
  {
    id: "3", artist: artists.arctic,
    date: "2026-06-10", venue: "Belgrade Arena", city: "Белград", country: "Сербия", countryCode: "RS",
    ticketUrl: "https://www.eventim.rs",
  },

  // Грузия — безвиз для всех
  {
    id: "4", artist: artists.dualipa,
    date: "2026-09-05", venue: "Black Sea Arena", city: "Тбилиси", country: "Грузия", countryCode: "GE",
    ticketUrl: "https://www.tkt.ge",
  },

  // Армения — безвиз для всех
  {
    id: "5", artist: artists.imagine,
    date: "2026-07-28", venue: "Karen Demirchyan Complex", city: "Ереван", country: "Армения", countryCode: "AM",
    ticketUrl: "https://www.tomsarkgh.am",
  },

  // Казахстан — безвиз для всех
  {
    id: "12", artist: artists.gorillaz,
    date: "2026-08-15", venue: "Almaty Arena", city: "Алматы", country: "Казахстан", countryCode: "KZ",
    ticketUrl: "https://www.ticketon.kz",
  },

  // Великобритания — визы для RU/AM/KZ
  {
    id: "6", artist: artists.coldplay,
    date: "2026-10-12", venue: "Wembley Stadium", city: "Лондон", country: "Великобритания", countryCode: "GB",
    ticketUrl: "https://www.ticketmaster.co.uk",
  },
  {
    id: "17", artist: artists.kendrick,
    date: "2026-09-18", venue: "The O2 Arena", city: "Лондон", country: "Великобритания", countryCode: "GB",
    ticketUrl: "https://www.ticketmaster.co.uk",
  },

  // Германия — визы для RU/AM/KZ
  {
    id: "7", artist: artists.rammstein,
    date: "2026-08-01", venue: "Olympiastadion", city: "Берлин", country: "Германия", countryCode: "DE",
    ticketUrl: "https://www.eventim.de",
  },

  // Таиланд — безвиз для всех
  {
    id: "8", artist: artists.tame,
    date: "2026-11-18", venue: "Impact Arena", city: "Бангкок", country: "Таиланд", countryCode: "TH",
    ticketUrl: "https://www.thaiticketmajor.com",
  },

  // США — визы для всех
  {
    id: "9", artist: artists.billie,
    date: "2026-06-25", venue: "Madison Square Garden", city: "Нью-Йорк", country: "США", countryCode: "US",
    ticketUrl: "https://www.ticketmaster.com",
  },

  // Израиль — безвиз для всех
  {
    id: "10", artist: artists.radiohead,
    date: "2026-09-22", venue: "Bloomfield Stadium", city: "Тель-Авив", country: "Израиль", countryCode: "IL",
    ticketUrl: "https://www.eventim.co.il",
  },
  {
    id: "15", artist: artists.muse,
    date: "2026-10-03", venue: "Menora Mivtachim Arena", city: "Тель-Авив", country: "Израиль", countryCode: "IL",
    ticketUrl: "https://www.eventim.co.il",
  },

  // Испания — визы для RU/AM/KZ, безвиз для GE
  {
    id: "13", artist: artists.coldplay,
    date: "2026-07-20", venue: "Estadi Olímpic", city: "Барселона", country: "Испания", countryCode: "ES",
    ticketUrl: "https://www.ticketmaster.es",
  },

  // Марокко — безвиз для всех
  {
    id: "16", artist: artists.kendrick,
    date: "2026-06-30", venue: "OLM Souissi", city: "Рабат", country: "Марокко", countryCode: "MA",
    ticketUrl: "https://www.guichet.com",
  },
];
