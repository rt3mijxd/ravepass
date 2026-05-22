"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import { getVisaStatus, isVisaFree, visaStatusLabels, VISA_LAST_UPDATED } from "@/data/visas";
import { findFlightRoute, getAviasalesUrl, cityNames } from "@/data/flights";
import CustomSelect from "@/components/CustomSelect";
import type { PassportCode, CityCode, Concert } from "@/types";

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

export default function ConcertPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [concert, setConcert] = useState<Concert | null>(null);
  const [loading, setLoading] = useState(true);
  const [passport, setPassport] = useState<PassportCode>("RU");
  const [originCity, setOriginCity] = useState<CityCode>("MOW");

  useEffect(() => {
    fetch(`/api/concert/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setConcert(data))
      .catch(() => setConcert(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-orange-500" />
      </div>
    );
  }

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
  const dateFormatted = new Date(concert.date + "T12:00:00").toLocaleDateString("ru-RU", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <a href="/" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-orange-400 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 transition-colors">
        ← Все концерты
      </a>

      {/* Шапка */}
      <div className="flex gap-5 items-start">
        {concert.artist.imageUrl ? (
          <Image src={concert.artist.imageUrl} alt={concert.artist.name}
            width={96} height={96} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" unoptimized />
        ) : (
          <div className="w-24 h-24 rounded-xl bg-zinc-800 flex-shrink-0 flex items-center justify-center text-zinc-600 text-3xl">♪</div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{concert.artist.name}</h1>
          <p className="text-zinc-400 mt-1">
            {dateFormatted}
            {concert.time ? `, ${concert.time.slice(0, 5)}` : ""}
          </p>
          <p className="text-zinc-500">{concert.city}, {concert.venue}</p>
          {concert.artist.genre && <p className="text-xs text-zinc-600 mt-1">{concert.artist.genre}</p>}
        </div>
      </div>

      {/* Настройки поездки */}
      <section className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 space-y-4">
        <h2 className="font-semibold">Ваша поездка</h2>
        <div className="grid grid-cols-2 gap-3">
          <CustomSelect label="Паспорт" options={passportOptions} value={passport}
            onChange={(v) => setPassport(v as PassportCode)} />
          <CustomSelect label="Город вылета" options={cityOptions} value={originCity}
            onChange={(v) => setOriginCity(v as CityCode)} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {visa && (
            <div className={`rounded-lg p-3 ${isVisaFree(visa) ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-red-500/10 border border-red-500/30"}`}>
              <p className="text-xs text-zinc-400">Виза</p>
              <p className={`font-medium text-sm ${isVisaFree(visa) ? "text-emerald-400" : "text-red-400"}`}>
                {visaStatusLabels[visa]}
              </p>
            </div>
          )}
          {flight ? (
            <>
              <div className="rounded-lg p-3 bg-zinc-800 border border-zinc-700">
                <p className="text-xs text-zinc-400">Перелёт</p>
                <p className="font-medium text-sm">
                  {flight.direct ? "Прямой" : "С пересадкой"}, ~{flight.flightTimeHours}ч
                </p>
              </div>
              <div className="rounded-lg p-3 bg-zinc-800 border border-zinc-700">
                <p className="text-xs text-zinc-400">Перелёт от</p>
                <p className="font-medium text-sm">
                  {flight.priceRange[0].toLocaleString("ru")}–{flight.priceRange[1].toLocaleString("ru")} ₽
                </p>
              </div>
            </>
          ) : (
            <div className="rounded-lg p-3 bg-zinc-800 border border-zinc-700 col-span-2">
              <p className="text-xs text-zinc-400">Перелёт</p>
              <p className="font-medium text-sm text-zinc-500">Нет данных о прямых рейсах из {cityNames[originCity]}</p>
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
            {concert.priceMin != null && concert.priceMax != null ? (
              <span>
                {concert.priceMin.toLocaleString("ru")}–{concert.priceMax.toLocaleString("ru")} {concert.currency ?? "USD"}
              </span>
            ) : (
              <span className="text-zinc-500">Цена уточняется</span>
            )}
          </div>
          {flight && (
            <div className="flex justify-between">
              <span className="text-zinc-400">Перелёт ({cityNames[originCity]} → {concert.city})</span>
              <span>{flight.priceRange[0].toLocaleString("ru")}–{flight.priceRange[1].toLocaleString("ru")} ₽</span>
            </div>
          )}
          <hr className="border-zinc-800" />
          {(concert.priceMin != null || flight) && (
            <div className="flex justify-between font-medium">
              <span>Итого от</span>
              <span>
                {concert.priceMin != null && flight
                  ? `${((flight.priceRange[0]) + concert.priceMin).toLocaleString("ru")} ${concert.currency ?? "USD"} + ₽`
                  : concert.priceMin != null
                    ? `${concert.priceMin.toLocaleString("ru")} ${concert.currency ?? "USD"}`
                    : `${flight!.priceRange[0].toLocaleString("ru")} ₽ + билет`
                }
              </span>
            </div>
          )}
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

      <p className="text-xs text-zinc-600 text-center">
        Визовая информация актуальна на {VISA_LAST_UPDATED}. Проверяйте официальные источники перед поездкой.
      </p>

      <div className="text-center">
        <a href={`/artist/${concert.artist.slug}`}
          className="inline-block text-sm font-medium text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-xl px-5 py-2.5 hover:bg-orange-500/20 transition-colors">
          Все концерты {concert.artist.name} →
        </a>
      </div>
    </div>
  );
}
