"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { mockConcerts } from "@/data/concerts";
import { getVisaStatus, isVisaFree, visaStatusLabels, countryNames } from "@/data/visas";
import { findFlightRoute, cityNames, passportNames } from "@/data/flights";
import type { PassportCode, CityCode } from "@/types";

const passports: PassportCode[] = ["RU", "AM", "GE", "KZ"];
const cities: CityCode[] = ["MOW", "LED", "ALA", "EVN", "TBS"];

const popularDestinations = [
  { city: "Стамбул", countryCode: "TR", emoji: "🇹🇷" },
  { city: "Дубай", countryCode: "AE", emoji: "🇦🇪" },
  { city: "Белград", countryCode: "RS", emoji: "🇷🇸" },
  { city: "Тбилиси", countryCode: "GE", emoji: "🇬🇪" },
  { city: "Ереван", countryCode: "AM", emoji: "🇦🇲" },
  { city: "Алматы", countryCode: "KZ", emoji: "🇰🇿" },
];

export default function HomePage() {
  const allConcerts = mockConcerts;
  const [passport, setPassport] = useState<PassportCode>("RU");
  const [originCity, setOriginCity] = useState<CityCode>("MOW");
  const [visaFreeOnly, setVisaFreeOnly] = useState(false);
  const [directOnly, setDirectOnly] = useState(false);
  const [countryFilter, setCountryFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const availableCountries = useMemo(() => {
    const codes = new Set(allConcerts.map((c) => c.countryCode).filter(Boolean));
    return Array.from(codes).sort((a, b) => (countryNames[a] ?? a).localeCompare(countryNames[b] ?? b, "ru"));
  }, [allConcerts]);

  const concerts = useMemo(() => {
    return allConcerts
      .map((concert) => {
        const visa = getVisaStatus(concert.countryCode, passport);
        const flight = findFlightRoute(originCity, concert.city);
        return { concert, visa, flight };
      })
      .filter(({ concert, visa, flight }) => {
        if (visaFreeOnly && visa && !isVisaFree(visa)) return false;
        if (directOnly && flight && !flight.direct) return false;
        if (directOnly && !flight) return false;
        if (countryFilter && concert.countryCode !== countryFilter) return false;
        if (cityFilter && concert.city !== cityFilter) return false;
        return true;
      })
      .sort((a, b) => {
        const aFree = a.visa ? isVisaFree(a.visa) : false;
        const bFree = b.visa ? isVisaFree(b.visa) : false;
        if (aFree !== bFree) return aFree ? -1 : 1;
        return a.concert.date.localeCompare(b.concert.date);
      });
  }, [allConcerts, passport, originCity, visaFreeOnly, directOnly, countryFilter, cityFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Фильтры */}
      <section className="bg-zinc-900 rounded-xl p-4 sm:p-6 border border-zinc-800 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Паспорт</label>
            <select
              value={passport}
              onChange={(e) => setPassport(e.target.value as PassportCode)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {passports.map((p) => (
                <option key={p} value={p}>{passportNames[p]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Город вылета</label>
            <select
              value={originCity}
              onChange={(e) => setOriginCity(e.target.value as CityCode)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {cities.map((c) => (
                <option key={c} value={c}>{cityNames[c]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Страна</label>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Все страны</option>
              {availableCountries.map((code) => (
                <option key={code} value={code}>{countryNames[code] ?? code}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col justify-end gap-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={visaFreeOnly} onChange={(e) => setVisaFreeOnly(e.target.checked)}
                className="accent-orange-500" />
              Без визы
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={directOnly} onChange={(e) => setDirectOnly(e.target.checked)}
                className="accent-orange-500" />
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

      {/* Список концертов */}
      <section>
        <h2 className="text-lg font-semibold mb-3">
          Концерты{" "}
          <span className="text-zinc-500 font-normal text-sm">
            ({concerts.length})
          </span>
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {concerts.map(({ concert, visa, flight }) => {
            const needsVisa = visa ? !isVisaFree(visa) : false;
            return (
              <a
                key={concert.id}
                href={`/concert/${concert.id}`}
                className={`block bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden hover:border-zinc-600 transition-all ${
                  needsVisa ? "opacity-60" : ""
                }`}
              >
                <div className="flex gap-4 p-4">
                  {concert.artist.imageUrl ? (
                    <Image
                      src={concert.artist.imageUrl}
                      alt={concert.artist.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
  
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-zinc-800 flex-shrink-0 flex items-center justify-center text-zinc-600 text-xl">
                      ♪
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{concert.artist.name}</h3>
                    <p className="text-sm text-zinc-400">
                      {new Date(concert.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    <p className="text-sm text-zinc-500 truncate">{concert.city}, {concert.venue}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 px-4 pb-4">
                  {visa && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isVisaFree(visa)
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {visaStatusLabels[visa]}
                    </span>
                  )}
                  {flight && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      flight.direct
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-zinc-700 text-zinc-400"
                    }`}>
                      {flight.direct ? "Прямой рейс" : "С пересадкой"}
                    </span>
                  )}
                  {flight && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-400">
                      ~{flight.priceRange[0].toLocaleString("ru")}–{flight.priceRange[1].toLocaleString("ru")} ₽
                    </span>
                  )}
                </div>
              </a>
            );
          })}
        </div>
        {concerts.length === 0 && (
          <p className="text-center text-zinc-500 py-12">Концертов по выбранным фильтрам не найдено</p>
        )}
      </section>
    </div>
  );
}
