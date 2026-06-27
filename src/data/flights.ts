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
  "Пекин": "PEK", "Доха": "DOH", "Сеул": "SEL", "Лондон": "LON",
  "Париж": "PAR", "Берлин": "BER", "Амстердам": "AMS", "Барселона": "BCN",
  "Мадрид": "MAD", "Рим": "ROM", "Милан": "MIL", "Прага": "PRG",
  "Варшава": "WAW", "Вена": "VIE", "Будапешт": "BUD", "Стокгольм": "STO",
  "Копенгаген": "CPH", "Хельсинки": "HEL", "Осло": "OSL", "Брюссель": "BRU",
  "Лиссабон": "LIS", "Афины": "ATH", "Цюрих": "ZRH", "Мюнхен": "MUC",
  "Франкфурт": "FRA", "Дюссельдорф": "DUS", "Гамбург": "HAM",
  "Нью-Йорк": "NYC", "Лос-Анджелес": "LAX", "Чикаго": "CHI",
  "Торонто": "YTO", "Монреаль": "YMQ", "Ванкувер": "YVR",
  "Токио": "TYO", "Сингапур": "SIN", "Каир": "CAI",
  "Куала-Лумпур": "KUL", "Дели": "DEL", "Мумбаи": "BOM",

  // Английские названия (Ticketmaster возвращает на английском)
  "Istanbul": "IST", "İstanbul": "IST", "Dubai": "DXB", "Belgrade": "BEG",
  "Tbilisi": "TBS", "Yerevan": "EVN", "Almaty": "ALA", "Bangkok": "BKK",
  "Tel Aviv": "TLV", "Tel Aviv-Yafo": "TLV", "Beijing": "PEK", "Doha": "DOH",
  "Seoul": "SEL", "Abu Dhabi": "AUH",

  // Великобритания и Ирландия
  "London": "LON", "Manchester": "MAN", "Birmingham": "BHX",
  "Edinburgh": "EDI", "Glasgow": "GLA", "Leeds": "LBA",
  "Newcastle Upon Tyne": "NCL", "Liverpool": "LPL", "Bristol": "BRS",
  "Cardiff": "CWL", "Belfast": "BFS", "Dublin": "DUB", "Cork": "ORK",
  "Southampton": "SOU", "Sheffield": "SHF", "Nottingham": "EMA",
  "Derby": "EMA", "Hertford": "LON", "Ashford ": "LON", "Ashford": "LON",
  "Nuneaton": "BHX", "Isle Of Wight": "SOU",

  // Западная Европа
  "Paris": "PAR", "Lyon": "LYS", "Marseille": "MRS", "Nice": "NCE",
  "Bordeaux": "BOD", "Toulouse": "TLS",
  "Amsterdam": "AMS", "Rotterdam": "RTM", "The Hague": "AMS",
  "Brussels": "BRU", "Antwerp": "ANR",
  "Lisbon": "LIS", "Porto": "OPO",
  "Madrid": "MAD", "Barcelona": "BCN", "Seville": "SVQ", "Valencia": "VLC",
  "Bilbao": "BIO", "Málaga": "AGP", "Malaga": "AGP",
  "Rome": "ROM", "Roma": "ROM", "Milan": "MIL", "Milano": "MIL",
  "Florence": "FLR", "Naples": "NAP", "Turin": "TRN", "Bologna": "BLQ", "Venice": "VCE",
  "Zürich": "ZRH", "Zurich": "ZRH", "Geneva": "GVA", "Genève": "GVA", "Basel": "BSL",
  "Vienna": "VIE", "Wien": "VIE",

  // Германия
  "Berlin": "BER", "Munich": "MUC", "München": "MUC",
  "Frankfurt": "FRA", "Frankfurt am Main": "FRA",
  "Hamburg": "HAM", "Düsseldorf": "DUS", "Dusseldorf": "DUS",
  "Cologne": "CGN", "Köln": "CGN", "Stuttgart": "STR",
  "Hannover": "HAJ", "Leipzig": "LEJ", "Dresden": "DRS",
  "Dortmund": "DTM", "Essen": "DUS", "Nuremberg": "NUE", "Nürnberg": "NUE",

  // Скандинавия
  "Stockholm": "STO", "Gothenburg": "GOT", "Malmö": "MMA", "Malmo": "MMA",
  "Copenhagen": "CPH", "København": "CPH", "København Ø": "CPH",
  "Helsinki": "HEL", "Oslo": "OSL", "Bergen": "BGO",

  // Восточная Европа
  "Prague": "PRG", "Praha": "PRG",
  "Warsaw": "WAW", "Warszawa": "WAW", "Kraków": "KRK", "Krakow": "KRK",
  "Wrocław": "WRO", "Wroclaw": "WRO", "Gdańsk": "GDN", "Gdansk": "GDN",
  "Budapest": "BUD",
  "Bucharest": "BUH", "București": "BUH",
  "Sofia": "SOF", "Zagreb": "ZAG",
  "Bratislava": "BTS", "Ljubljana": "LJU",
  "Vilnius": "VNO", "Riga": "RIX", "Tallinn": "TLL",
  "Chișinău": "KIV", "Chisinau": "KIV", "Кишинёв": "KIV", "Кишинев": "KIV",

  // Северная Америка
  "New York": "NYC", "Los Angeles": "LAX", "Chicago": "CHI",
  "San Francisco": "SFO", "Las Vegas": "LAS", "Miami": "MIA",
  "Boston": "BOS", "Washington": "WAS", "Seattle": "SEA",
  "Philadelphia": "PHL", "Houston": "IAH", "Dallas": "DFW",
  "Atlanta": "ATL", "Denver": "DEN", "Phoenix": "PHX",
  "Detroit": "DTT", "Minneapolis": "MSP", "San Diego": "SAN",
  "Portland": "PDX", "Austin": "AUS", "Nashville": "BNA",
  "Rochester": "ROC", "Pawling": "NYC",
  "Toronto": "YTO", "Montreal": "YMQ", "Montréal": "YMQ",
  "Vancouver": "YVR", "Calgary": "YYC", "Ottawa": "YOW",
  "Mexico City": "MEX", "Monterrey": "MTY", "Guadalajara": "GDL",

  // Азия и Океания
  "Tokyo": "TYO", "Osaka": "OSA", "Singapore": "SIN",
  "Kuala Lumpur": "KUL", "Jakarta": "JKT", "Manila": "MNL",
  "Hong Kong": "HKG", "Taipei": "TPE", "Mumbai": "BOM",
  "Delhi": "DEL", "New Delhi": "DEL", "Bangalore": "BLR",
  "Sydney": "SYD", "Melbourne": "MEL", "Auckland": "AKL",

  // Ближний Восток и Африка
  "Cairo": "CAI", "Casablanca": "CMN", "Marrakech": "RAK",
  "Amman": "AMM", "Beirut": "BEY", "Riyadh": "RUH", "Jeddah": "JED",

  // Южная Америка
  "São Paulo": "SAO", "Sao Paulo": "SAO", "Rio de Janeiro": "RIO",
  "Buenos Aires": "BUE", "Santiago": "SCL", "Lima": "LIM",
  "Bogotá": "BOG", "Bogota": "BOG",

  // Турция — другие города
  "Ankara": "ANK", "Antalya": "AYT", "Izmir": "ADB", "İzmir": "ADB",
  "Bursa": "YEI", "Bodrum": "BJV",
  "Balıkesir": "BZI", "Denizli": "DNZ", "Diyarbakır": "DIY",
  "Kocaeli": "IST", "Muğla": "DLM", "Uşak": "USQ",
};

export function findFlightRoute(origin: string, destinationCity: string): FlightRoute | null {
  const airportCode = cityToAirport[destinationCity];
  if (!airportCode) return null;
  return flightRoutes.find((r) => r.origin === origin && r.destination === airportCode) ?? null;
}

export function getAviasalesUrl(origin: string, destinationCity: string, date: string): string {
  const dest = cityToAirport[destinationCity] ?? destinationCity;
  return `https://www.aviasales.ru/?marker=624344&origin=${origin}&destination=${dest}&depart_date=${date}`;
}
