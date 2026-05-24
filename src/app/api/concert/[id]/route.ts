import { NextRequest, NextResponse } from "next/server";
import { mockConcerts } from "@/data/concerts";
import { cisConcerts } from "@/data/cis-artists";

const API_KEY = process.env.TICKETMASTER_API_KEY || "";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // CIS-концерт
  if (id.startsWith("cis-")) {
    const concert = cisConcerts.find((c) => c.id === id);
    if (concert) return NextResponse.json(concert);
    return NextResponse.json(null, { status: 404 });
  }

  // Моковый концерт
  if (!id.startsWith("tm-")) {
    const concert = mockConcerts.find((c) => c.id === id);
    if (concert) return NextResponse.json(concert);
    return NextResponse.json(null, { status: 404 });
  }

  // Ticketmaster концерт — достаём реальный ID (убираем "tm-")
  const tmId = id.replace("tm-", "");
  if (!API_KEY) return NextResponse.json(null, { status: 404 });

  try {
    const res = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events/${tmId}.json?apikey=${API_KEY}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return NextResponse.json(null, { status: 404 });

    const event = await res.json();

    const venue = event._embedded?.venues?.[0];
    const attraction = event._embedded?.attractions?.[0];
    const countryCode = venue?.country?.countryCode ?? "";

    const countryRu: Record<string, string> = {
      TR: "Турция", RS: "Сербия", AE: "ОАЭ", GE: "Грузия", AM: "Армения",
      KZ: "Казахстан", TH: "Таиланд", IL: "Израиль", GB: "Великобритания",
      DE: "Германия", FR: "Франция", ES: "Испания", IT: "Италия",
      NL: "Нидерланды", US: "США", CA: "Канада", MA: "Марокко",
      EG: "Египет", KR: "Южная Корея", JP: "Япония", MY: "Малайзия",
      PT: "Португалия", AT: "Австрия", CZ: "Чехия", PL: "Польша",
      SE: "Швеция", BE: "Бельгия", GR: "Греция", AU: "Австралия",
      NO: "Норвегия", DK: "Дания", HU: "Венгрия", FI: "Финляндия",
      MX: "Мексика", BR: "Бразилия", AR: "Аргентина", SG: "Сингапур",
    };

    const artistName = attraction?.name ?? event.name;
    const images = attraction?.images ?? event.images ?? [];
    const img = images.find((i: { width: number }) => i.width >= 200 && i.width <= 800);
    const genre = attraction?.classifications?.[0]?.genre?.name;

    // Извлекаем время и цены
    const time = event.dates?.start?.localTime ?? undefined;
    const priceRange = event.priceRanges?.[0];

    const concert = {
      id,
      artist: {
        name: artistName,
        slug: artistName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        imageUrl: img?.url ?? images[0]?.url ?? "",
        genre: genre === "Undefined" ? "" : (genre ?? ""),
      },
      date: event.dates?.start?.localDate ?? "",
      time,
      priceMin: priceRange?.min ?? undefined,
      priceMax: priceRange?.max ?? undefined,
      currency: priceRange?.currency ?? undefined,
      venue: venue?.name ?? "",
      city: venue?.city?.name ?? "",
      country: countryRu[countryCode] ?? venue?.country?.name ?? "",
      countryCode,
      ticketUrl: event.url ?? "",
    };

    return NextResponse.json(concert);
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
