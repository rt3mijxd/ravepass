"use client";

import { use, useState, useMemo } from "react";
import Image from "next/image";
import { mockConcerts } from "@/data/concerts";
import { getVisaStatus, isVisaFree, visaStatusLabels } from "@/data/visas";
import { findFlightRoute } from "@/data/flights";
import CustomSelect from "@/components/CustomSelect";
import type { PassportCode, CityCode } from "@/types";

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

export default function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const artistConcerts = mockConcerts.filter((c) => c.artist.slug === slug);
  const artist = artistConcerts[0]?.artist;

  const [passport, setPassport] = useState<PassportCode>("RU");
  const [originCity, setOriginCity] = useState<CityCode>("MOW");

  const stats = useMemo(() => {
    const total = artistConcerts.length;
    const visaFree = artistConcerts.filter((c) => {
      const visa = getVisaStatus(c.countryCode, passport);
      return visa && isVisaFree(visa);
    }).length;
    return { total, visaFree };
  }, [artistConcerts, passport]);

  if (!artist) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Артист не найден</h1>
        <a href="/" className="inline-block text-sm font-medium text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-xl px-5 py-2.5 hover:bg-orange-500/20 transition-colors">← На главную</a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <a href="/" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-orange-400 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 transition-colors">
        ← Все концерты
      </a>

      {/* Профиль артиста */}
      <div className="flex gap-5 items-start">
        {artist.imageUrl ? (
          <Image src={artist.imageUrl} alt={artist.name}
            width={96} height={96} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" unoptimized />
        ) : (
          <div className="w-24 h-24 rounded-xl bg-zinc-800 flex-shrink-0 flex items-center justify-center text-zinc-600 text-3xl">♪</div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{artist.name}</h1>
          <p className="text-zinc-500 text-sm">{artist.genre}</p>
        </div>
      </div>

      {/* Настройки */}
      <div className="grid grid-cols-2 gap-3">
        <CustomSelect label="Паспорт" options={passportOptions} value={passport}
          onChange={(v) => setPassport(v as PassportCode)} />
        <CustomSelect label="Город вылета" options={cityOptions} value={originCity}
          onChange={(v) => setOriginCity(v as CityCode)} />
      </div>

      {/* Счётчики */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 text-center">
          <p className="text-3xl font-bold">{stats.total}</p>
          <p className="text-xs text-zinc-500 mt-1">концертов в 2026</p>
        </div>
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 text-center">
          <p className="text-3xl font-bold text-emerald-400">{stats.visaFree}</p>
          <p className="text-xs text-zinc-500 mt-1">доступно без визы</p>
        </div>
      </div>

      {/* Список концертов */}
      <section className="space-y-3">
        <h2 className="font-semibold text-lg">Все концерты</h2>
        {artistConcerts.map((concert) => {
          const visa = getVisaStatus(concert.countryCode, passport);
          const flight = findFlightRoute(originCity, concert.city);
          const needsVisa = visa ? !isVisaFree(visa) : false;
          return (
            <a key={concert.id} href={`/concert/${concert.id}`}
              className={`block bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-zinc-600 transition-all ${needsVisa ? "opacity-60" : ""}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{concert.city}, {concert.country}</p>
                  <p className="text-sm text-zinc-400">
                    {new Date(concert.date + "T12:00:00").toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  <p className="text-sm text-zinc-500">{concert.venue}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  {visa && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isVisaFree(visa) ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                      {visaStatusLabels[visa]}
                    </span>
                  )}
                  {flight && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${flight.direct ? "bg-blue-500/20 text-blue-400" : "bg-zinc-700 text-zinc-400"}`}>
                      {flight.direct ? "Прямой рейс" : "С пересадкой"}
                    </span>
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </section>

      {/* Уведомления */}
      <section className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 text-center space-y-3">
        <p className="text-sm text-zinc-400">Хотите узнать о новых концертах {artist.name}?</p>
        <a href={`mailto:your@email.com?subject=Уведомления: ${artist.name}&body=Хочу получать уведомления о новых концертах ${artist.name}`}
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2.5 rounded-xl transition-colors text-sm">
          Уведомить о новых концертах
        </a>
      </section>
    </div>
  );
}
