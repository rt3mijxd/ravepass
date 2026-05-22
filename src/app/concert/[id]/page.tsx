"use client";

import { use, useState } from "react";
import Image from "next/image";
import { mockConcerts } from "@/data/concerts";
import { getVisaStatus, isVisaFree, visaStatusLabels, VISA_LAST_UPDATED } from "@/data/visas";
import { findFlightRoute, getAviasalesUrl, cityNames, passportNames } from "@/data/flights";
import type { PassportCode, CityCode } from "@/types";

const passports: PassportCode[] = ["RU", "AM", "GE", "KZ"];
const cities: CityCode[] = ["MOW", "LED", "ALA", "EVN", "TBS"];

export default function ConcertPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const concert = mockConcerts.find((c) => c.id === id);

  const [passport, setPassport] = useState<PassportCode>("RU");
  const [originCity, setOriginCity] = useState<CityCode>("MOW");

  if (!concert) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Концерт не найден</h1>
        <a href="/" className="inline-block text-sm font-medium text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-xl px-5 py-2.5 hover:bg-orange-500/20 transition-colors">← На главную</a>
      </div>
    );
  }

  const visa = getVisaStatus(concert.countryCode, passport);
  const flight = findFlightRoute(originCity, concert.city);
  const dateFormatted = new Date(concert.date).toLocaleDateString("ru-RU", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <a href="/" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-orange-400 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 transition-colors">
        ← Все концерты
      </a>

      {/* Шапка */}
      <div className="flex gap-5 items-start">
        <Image src={concert.artist.imageUrl} alt={concert.artist.name}
          width={96} height={96} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
        <div>
          <h1 className="text-2xl font-bold">{concert.artist.name}</h1>
          <p className="text-zinc-400 mt-1">{dateFormatted}</p>
          <p className="text-zinc-500">{concert.city}, {concert.venue}</p>
          <p className="text-xs text-zinc-600 mt-1">{concert.artist.genre}</p>
        </div>
      </div>

      {/* Настройки поездки */}
      <section className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 space-y-4">
        <h2 className="font-semibold">Ваша поездка</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Паспорт</label>
            <select value={passport} onChange={(e) => setPassport(e.target.value as PassportCode)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
              {passports.map((p) => <option key={p} value={p}>{passportNames[p]}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Город вылета</label>
            <select value={originCity} onChange={(e) => setOriginCity(e.target.value as CityCode)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
              {cities.map((c) => <option key={c} value={c}>{cityNames[c]}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {/* Виза */}
          {visa && (
            <div className={`rounded-lg p-3 ${isVisaFree(visa) ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-red-500/10 border border-red-500/30"}`}>
              <p className="text-xs text-zinc-400">Виза</p>
              <p className={`font-medium text-sm ${isVisaFree(visa) ? "text-emerald-400" : "text-red-400"}`}>
                {visaStatusLabels[visa]}
              </p>
            </div>
          )}
          {/* Перелёт */}
          {flight && (
            <div className="rounded-lg p-3 bg-zinc-800 border border-zinc-700">
              <p className="text-xs text-zinc-400">Перелёт</p>
              <p className="font-medium text-sm">
                {flight.direct ? "Прямой" : "С пересадкой"}, ~{flight.flightTimeHours}ч
              </p>
            </div>
          )}
          {/* Цена */}
          {flight && (
            <div className="rounded-lg p-3 bg-zinc-800 border border-zinc-700">
              <p className="text-xs text-zinc-400">Перелёт от</p>
              <p className="font-medium text-sm">
                {flight.priceRange[0].toLocaleString("ru")}–{flight.priceRange[1].toLocaleString("ru")} ₽
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Примерный бюджет */}
      <section className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 space-y-3">
        <h2 className="font-semibold">Примерный бюджет</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-400">Билет на концерт</span>
            <span>3 000–15 000 ₽</span>
          </div>
          {flight && (
            <div className="flex justify-between">
              <span className="text-zinc-400">Перелёт ({cityNames[originCity]} → {concert.city})</span>
              <span>{flight.priceRange[0].toLocaleString("ru")}–{flight.priceRange[1].toLocaleString("ru")} ₽</span>
            </div>
          )}
          <hr className="border-zinc-800" />
          <div className="flex justify-between font-medium">
            <span>Итого от</span>
            <span>{((flight?.priceRange[0] ?? 0) + 3000).toLocaleString("ru")} ₽</span>
          </div>
        </div>
      </section>

      {/* Кнопки */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a href={concert.ticketUrl} target="_blank" rel="noopener noreferrer"
          className="flex-1 text-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-xl transition-colors">
          Купить билеты
        </a>
        <a href={getAviasalesUrl(originCity, concert.city, concert.date)} target="_blank" rel="noopener noreferrer"
          className="flex-1 text-center bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 font-medium py-3 rounded-xl transition-colors">
          Найти авиабилеты
        </a>
      </div>

      {/* Дисклеймер */}
      <p className="text-xs text-zinc-600 text-center">
        Визовая информация актуальна на {VISA_LAST_UPDATED}. Проверяйте официальные источники перед поездкой.
      </p>

      {/* Ссылка на артиста */}
      <div className="text-center">
        <a href={`/artist/${concert.artist.slug}`}
          className="inline-block text-sm font-medium text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-xl px-5 py-2.5 hover:bg-orange-500/20 transition-colors">
          Все концерты {concert.artist.name} →
        </a>
      </div>
    </div>
  );
}
