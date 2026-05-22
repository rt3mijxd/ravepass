"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { mockConcerts } from "@/data/concerts";
import { getVisaStatus, isVisaFree, visaStatusLabels, countryNames } from "@/data/visas";
import { findFlightRoute, cityNames } from "@/data/flights";
import CustomSelect from "@/components/CustomSelect";
import { pluralize } from "@/lib/pluralize";
import type { PassportCode, CityCode, Concert, VisaStatus } from "@/types";
import type { FlightRoute } from "@/types";

const passportOptions = [
  { value: "RU", label: "Российский" },
  { value: "AM", label: "Армянский" },
  { value: "GE", label: "Грузинский" },
  { value: "KZ", label: "Казахстанский" },
];

const cityOptions = [
  { value: "MOW", label: "Москва" },
  { value: "LED", label: "Санкт-Петербург" },
  { value: "ALA", label: "Алматы" },
  { value: "EVN", label: "Ереван" },
  { value: "TBS", label: "Тбилиси" },
];

const popularDestinations = [
  { city: "Стамбул", countryCode: "TR", emoji: "🇹🇷" },
  { city: "Дубай", countryCode: "AE", emoji: "🇦🇪" },
  { city: "Белград", countryCode: "RS", emoji: "🇷🇸" },
  { city: "Тбилиси", countryCode: "GE", emoji: "🇬🇪" },
  { city: "Ереван", countryCode: "AM", emoji: "🇦🇲" },
  { city: "Алматы", countryCode: "KZ", emoji: "🇰🇿" },
];

interface EnrichedConcert {
  concert: Concert;
  visa: VisaStatus | null;
  flight: FlightRoute | null;
}

interface ArtistGroup {
  artistName: string;
  slug: string;
  imageUrl: string;
  genre: string;
  concerts: EnrichedConcert[];
}

export default function HomePage() {
  const [allConcerts, setAllConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [passport, setPassport] = useState<PassportCode>("RU");
  const [originCity, setOriginCity] = useState<CityCode>("MOW");
  const [visaFreeOnly, setVisaFreeOnly] = useState(false);
  const [directOnly, setDirectOnly] = useState(false);
  const [countryFilter, setCountryFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    fetch("/api/concerts")
      .then((res) => res.json())
      .then((data: Concert[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllConcerts(data);
        } else {
          // Фолбэк: если API не вернул данных, показываем моковые
          setAllConcerts(mockConcerts);
        }
      })
      .catch(() => {
        setAllConcerts(mockConcerts);
      })
      .finally(() => setLoading(false));
  }, []);

  const availableCountries = useMemo(() => {
    const codes = new Set(allConcerts.map((c) => c.countryCode).filter(Boolean));
    return Array.from(codes).sort((a, b) => (countryNames[a] ?? a).localeCompare(countryNames[b] ?? b, "ru"));
  }, [allConcerts]);

  const countryOptions = useMemo(() => [
    { value: "", label: "Все страны" },
    ...availableCountries.map((code) => ({ value: code, label: countryNames[code] ?? code })),
  ], [availableCountries]);

  // Группируем концерты по артисту
  const artistGroups = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    // Фильтруем и обогащаем
    const filtered = allConcerts
      .map((concert) => ({
        concert,
        visa: getVisaStatus(concert.countryCode, passport),
        flight: findFlightRoute(originCity, concert.city),
      }))
      .filter(({ concert, visa, flight }) => {
        if (query && !concert.artist.name.toLowerCase().includes(query)) return false;
        if (visaFreeOnly && visa && !isVisaFree(visa)) return false;
        if (directOnly && flight && !flight.direct) return false;
        if (directOnly && !flight) return false;
        if (countryFilter && concert.countryCode !== countryFilter) return false;
        if (cityFilter && concert.city !== cityFilter) return false;
        return true;
      });

    // Группируем по slug артиста
    const groupMap = new Map<string, ArtistGroup>();

    for (const item of filtered) {
      const slug = item.concert.artist.slug;
      if (!groupMap.has(slug)) {
        groupMap.set(slug, {
          artistName: item.concert.artist.name,
          slug,
          imageUrl: item.concert.artist.imageUrl,
          genre: item.concert.artist.genre,
          concerts: [],
        });
      }
      groupMap.get(slug)!.concerts.push(item);
    }

    // Сортируем концерты внутри каждой группы по дате
    for (const group of groupMap.values()) {
      group.concerts.sort((a, b) => a.concert.date.localeCompare(b.concert.date));
    }

    // Сортируем группы: больше концертов = выше
    return Array.from(groupMap.values()).sort((a, b) => b.concerts.length - a.concerts.length);
  }, [allConcerts, searchQuery, passport, originCity, visaFreeOnly, directOnly, countryFilter, cityFilter]);

  const totalConcerts = artistGroups.reduce((sum, g) => sum + g.concerts.length, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Поиск */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Найти артиста..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
            ✕
          </button>
        )}
      </div>

      {/* Фильтры */}
      <section className="bg-zinc-900 rounded-xl p-4 sm:p-6 border border-zinc-800 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <CustomSelect label="Паспорт" options={passportOptions} value={passport}
            onChange={(v) => setPassport(v as PassportCode)} />
          <CustomSelect label="Город вылета" options={cityOptions} value={originCity}
            onChange={(v) => setOriginCity(v as CityCode)} />
          <CustomSelect label="Страна" options={countryOptions} value={countryFilter}
            onChange={setCountryFilter} />
          <div className="flex flex-col justify-end gap-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <div className="relative">
                <input type="checkbox" checked={visaFreeOnly} onChange={(e) => setVisaFreeOnly(e.target.checked)}
                  className="sr-only peer" />
                <div className="w-8 h-5 bg-zinc-700 rounded-full peer-checked:bg-orange-500 transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-3 transition-transform" />
              </div>
              Без визы
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <div className="relative">
                <input type="checkbox" checked={directOnly} onChange={(e) => setDirectOnly(e.target.checked)}
                  className="sr-only peer" />
                <div className="w-8 h-5 bg-zinc-700 rounded-full peer-checked:bg-orange-500 transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-3 transition-transform" />
              </div>
              Прямые рейсы
            </label>
          </div>
        </div>
      </section>

      {/* Популярные направления */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Популярные направления</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {popularDestinations.map((dest) => (
            <button
              key={dest.city}
              onClick={() => {
                setCityFilter(cityFilter === dest.city ? "" : dest.city);
                setCountryFilter("");
              }}
              className={`flex-shrink-0 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                cityFilter === dest.city
                  ? "bg-orange-500/20 border-orange-500 text-orange-400"
                  : "bg-zinc-900 border-zinc-800 hover:border-zinc-600"
              }`}
            >
              <span className="text-lg mr-2">{dest.emoji}</span>
              {dest.city}
            </button>
          ))}
        </div>
      </section>

      {/* Список артистов с концертами */}
      <section>
        <h2 className="text-lg font-semibold mb-3">
          Концерты{" "}
          <span className="text-zinc-500 font-normal text-sm">
            ({loading ? "..." : `${totalConcerts} ${pluralize(totalConcerts, "событие", "события", "событий")}, ${artistGroups.length} ${pluralize(artistGroups.length, "артист", "артиста", "артистов")}`})
          </span>
        </h2>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-orange-500" />
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {artistGroups.map((group) => {
            // Показываем до 3 ближайших концертов, приоритет — безвизовым
            const visaFreeConcerts = group.concerts.filter(({ visa }) => visa && isVisaFree(visa));
            const visaRequiredConcerts = group.concerts.filter(({ visa }) => !visa || !isVisaFree(visa));
            const sorted = [...visaFreeConcerts, ...visaRequiredConcerts];
            const preview = sorted.slice(0, 3);
            const remaining = group.concerts.length - preview.length;
            const hasVisaFree = visaFreeConcerts.length > 0;

            return (
              <div key={group.slug}
                className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden hover:border-zinc-600 transition-all">
                {/* Шапка артиста */}
                <div className="flex gap-4 p-4 pb-2">
                  {group.imageUrl ? (
                    <Image src={group.imageUrl} alt={group.artistName}
                      width={56} height={56}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0" unoptimized />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-zinc-800 flex-shrink-0 flex items-center justify-center text-zinc-600 text-xl">♪</div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{group.artistName}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-zinc-500">
                        {group.concerts.length} {pluralize(group.concerts.length, "концерт", "концерта", "концертов")}
                      </span>
                      {hasVisaFree ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                          Есть без визы
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400">
                          Нужна виза
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ближайшие концерты */}
                <div className="px-4 pb-3 space-y-1.5">
                  {preview.map(({ concert, visa, flight }) => (
                    <a key={concert.id} href={`/concert/${concert.id}`}
                      className="flex items-center justify-between gap-2 py-1.5 px-2 -mx-2 rounded-lg hover:bg-zinc-800/50 transition-colors group">
                      <div className="min-w-0">
                        <p className="text-sm truncate group-hover:text-orange-400 transition-colors">
                          {concert.city}{concert.country ? `, ${concert.country}` : ""}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {new Date(concert.date + "T12:00:00").toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
                          {concert.time ? `, ${concert.time.slice(0, 5)}` : ""}
                          {" · "}
                          {concert.venue}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        {visa && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            isVisaFree(visa)
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-red-500/15 text-red-400"
                          }`}>
                            {visaStatusLabels[visa]}
                          </span>
                        )}
                        {flight ? (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            flight.direct ? "bg-blue-500/20 text-blue-400" : "bg-amber-500/15 text-amber-400"
                          }`}>
                            {flight.direct ? "Прямой" : "Пересадка"}
                          </span>
                        ) : null}
                      </div>
                    </a>
                  ))}
                </div>

                {/* Ссылка на все концерты артиста */}
                {remaining > 0 && (
                  <a href={`/artist/${group.slug}`}
                    className="block text-center text-xs text-orange-400 hover:text-orange-300 py-2.5 border-t border-zinc-800 transition-colors">
                    ещё {remaining} {pluralize(remaining, "концерт", "концерта", "концертов")} →
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {!loading && artistGroups.length === 0 && (
          <p className="text-center text-zinc-500 py-12">
            {searchQuery ? `Артист «${searchQuery}» не найден` : "Концертов по выбранным фильтрам не найдено"}
          </p>
        )}
      </section>
    </div>
  );
}
