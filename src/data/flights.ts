import type { FlightRoute } from "@/types";

export const cityNames: Record<string, string> = {
  MOW: "Москва",
  LED: "Санкт-Петербург",
  ALA: "Алматы",
  EVN: "Ереван",
  TBS: "Тбилиси",
};

export const passportNames: Record<string, string> = {
  RU: "Российский",
  AM: "Армянский",
  GE: "Грузинский",
  KZ: "Казахстанский",
};

export const flightRoutes: FlightRoute[] = [
  // Москва
  { origin: "MOW", destination: "IST", direct: true, priceRange: [15000, 30000], flightTimeHours: 3.5 },
  { origin: "MOW", destination: "DXB", direct: true, priceRange: [20000, 45000], flightTimeHours: 5 },
  { origin: "MOW", destination: "BEG", direct: true, priceRange: [18000, 35000], flightTimeHours: 3 },
  { origin: "MOW", destination: "TBS", direct: true, priceRange: [12000, 25000], flightTimeHours: 2.5 },
  { origin: "MOW", destination: "EVN", direct: true, priceRange: [10000, 22000], flightTimeHours: 2.5 },
  { origin: "MOW", destination: "ALA", direct: true, priceRange: [15000, 32000], flightTimeHours: 4 },
  { origin: "MOW", destination: "BKK", direct: false, priceRange: [35000, 65000], flightTimeHours: 12 },
  { origin: "MOW", destination: "TLV", direct: true, priceRange: [18000, 40000], flightTimeHours: 4 },
  { origin: "MOW", destination: "PEK", direct: true, priceRange: [25000, 50000], flightTimeHours: 7.5 },
  { origin: "MOW", destination: "DOH", direct: true, priceRange: [22000, 45000], flightTimeHours: 5 },

  // Санкт-Петербург
  { origin: "LED", destination: "IST", direct: true, priceRange: [16000, 32000], flightTimeHours: 3.5 },
  { origin: "LED", destination: "DXB", direct: false, priceRange: [25000, 50000], flightTimeHours: 7 },
  { origin: "LED", destination: "TBS", direct: true, priceRange: [14000, 28000], flightTimeHours: 3 },
  { origin: "LED", destination: "EVN", direct: true, priceRange: [12000, 25000], flightTimeHours: 3 },
  { origin: "LED", destination: "BEG", direct: false, priceRange: [22000, 40000], flightTimeHours: 5 },

  // Алматы
  { origin: "ALA", destination: "IST", direct: true, priceRange: [20000, 40000], flightTimeHours: 6 },
  { origin: "ALA", destination: "DXB", direct: true, priceRange: [18000, 38000], flightTimeHours: 5 },
  { origin: "ALA", destination: "TBS", direct: true, priceRange: [15000, 30000], flightTimeHours: 3 },
  { origin: "ALA", destination: "BKK", direct: false, priceRange: [30000, 55000], flightTimeHours: 9 },
  { origin: "ALA", destination: "PEK", direct: true, priceRange: [18000, 35000], flightTimeHours: 4 },
  { origin: "ALA", destination: "SEL", direct: true, priceRange: [20000, 42000], flightTimeHours: 5.5 },

  // Ереван
  { origin: "EVN", destination: "IST", direct: true, priceRange: [12000, 25000], flightTimeHours: 2 },
  { origin: "EVN", destination: "DXB", direct: true, priceRange: [18000, 35000], flightTimeHours: 3.5 },
  { origin: "EVN", destination: "TBS", direct: true, priceRange: [5000, 12000], flightTimeHours: 0.5 },
  { origin: "EVN", destination: "TLV", direct: true, priceRange: [15000, 30000], flightTimeHours: 2.5 },
  { origin: "EVN", destination: "BEG", direct: false, priceRange: [20000, 38000], flightTimeHours: 4 },

  // Тбилиси
  { origin: "TBS", destination: "IST", direct: true, priceRange: [10000, 22000], flightTimeHours: 2 },
  { origin: "TBS", destination: "DXB", direct: true, priceRange: [16000, 32000], flightTimeHours: 3.5 },
  { origin: "TBS", destination: "TLV", direct: true, priceRange: [14000, 28000], flightTimeHours: 2.5 },
  { origin: "TBS", destination: "BEG", direct: false, priceRange: [18000, 35000], flightTimeHours: 4 },
  { origin: "TBS", destination: "BKK", direct: false, priceRange: [32000, 58000], flightTimeHours: 10 },
];

const cityToAirport: Record<string, string> = {
  // Русские названия
  "Стамбул": "IST", "Дубай": "DXB", "Белград": "BEG", "Тбилиси": "TBS",
  "Ереван": "EVN", "Алматы": "ALA", "Бангкок": "BKK", "Тель-Авив": "TLV",
  "Пекин": "PEK", "Доха": "DOH", "Сеул": "SEL",
  // Английские названия (Ticketmaster возвращает на английском)
  "Istanbul": "IST", "İstanbul": "IST", "Dubai": "DXB", "Belgrade": "BEG",
  "Tbilisi": "TBS", "Yerevan": "EVN", "Almaty": "ALA", "Bangkok": "BKK",
  "Tel Aviv": "TLV", "Tel Aviv-Yafo": "TLV", "Beijing": "PEK", "Doha": "DOH",
  "Seoul": "SEL", "Abu Dhabi": "DXB",
  // Турция — другие города через Стамбул
  "Ankara": "IST", "Antalya": "IST", "Izmir": "IST",
};

export function findFlightRoute(origin: string, destinationCity: string): FlightRoute | null {
  const airportCode = cityToAirport[destinationCity];
  if (!airportCode) return null;
  return flightRoutes.find((r) => r.origin === origin && r.destination === airportCode) ?? null;
}

export function getAviasalesUrl(origin: string, destinationCity: string, date: string): string {
  const dest = cityToAirport[destinationCity] ?? destinationCity;
  return `https://www.aviasales.ru/?marker=YOUR_ID&origin=${origin}&destination=${dest}&depart_date=${date}`;
}
