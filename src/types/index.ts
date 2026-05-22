export type PassportCode = "RU" | "AM" | "GE" | "KZ";

export type CityCode = "MOW" | "LED" | "ALA" | "EVN" | "TBS";

export type VisaStatus = "visa_free" | "visa_on_arrival" | "evisa" | "visa_required";

export interface Concert {
  id: string;
  artist: ArtistSummary;
  date: string;
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
  origin: CityCode;
  destination: string;
  direct: boolean;
  priceRange: [number, number];
  flightTimeHours: number;
}
