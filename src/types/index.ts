// Основные паспорта с детальными визовыми данными
export type CorePassportCode = "RU" | "AM" | "GE" | "KZ";

// Все поддерживаемые паспорта (расширенный список)
export type PassportCode = string;

export type CityCode = "MOW" | "LED" | "ALA" | "EVN" | "TBS";

export type VisaStatus = "visa_free" | "visa_on_arrival" | "evisa" | "visa_required";

export interface Concert {
  id: string;
  artist: ArtistSummary;
  date: string;
  time?: string;           // "19:00:00" — время начала из Ticketmaster
  priceMin?: number;        // минимальная цена билета
  priceMax?: number;        // максимальная цена билета
  currency?: string;        // валюта цены ("USD", "EUR", "GBP" и т.д.)
  venue: string;
  city: string;
  country: string;
  countryCode: string;
  ticketUrl: string;
}

export interface ArtistSummary {
  name: string;
  slug: string;
  imageUrl: string;
  genre: string;
}

export interface Artist extends ArtistSummary {
  country: string;
  concerts: Concert[];
}

export interface FlightRoute {
  origin: string;
  destination: string;
  direct: boolean;
  priceRange: [number, number];
  flightTimeHours: number;
}
