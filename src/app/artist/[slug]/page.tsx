"use client";

import { use, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { getVisaStatus, isVisaFree, visaStatusLabels } from "@/data/visas";
import { findFlightRoute } from "@/data/flights";
import CustomSelect from "@/components/CustomSelect";
import { pluralize } from "@/lib/pluralize";
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

// slug → человеческое имя для API-запроса
function unslugify(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [artistInfo, setArtistInfo] = useState<{ name: string; imageUrl: string; genre: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [passport, setPassport] = useState<PassportCode>("RU");
  const [originCity, setOriginCity] = useState<CityCode>("MOW");

  useEffect(() => {
    const artistName = unslugify(slug);
    fetch(`/api/artist?name=${encodeURIComponent(artistName)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.concerts && Array.isArray(data.concerts)) {
          setConcerts(data.concerts);
        }
        if (data.artist) {
          setArtistInfo(data.artist);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const stats = useMemo(() => {
    const total = concerts.length;
    const visaFree = concerts.filter((c) => {
      const visa = getVisaStatus(c.countryCode, passport);
      return visa && isVisaFree(visa);
    }).length;

    // Диапазон дат тура
    const dates = concerts.map((c) => c.date).filter(Boolean).sort();
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];

    return { total, visaFree, firstDate, lastDate };
  }, [concerts, passport]);

  const displayName = artistInfo?.name || unslugify(slug);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-orange-500" />
      </div>
    );
  }

  if (concerts.length === 0 && !artistInfo) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Артист не найден</h1>
        <a href="/" className="inline-block text-sm font-medium text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-xl px-5 py-2.5 hover:bg-orange-500/20 transition-colors">← На главную</a>
      </div>
    );
  }

  const formatTourDates = () => {
    if (!stats.firstDate || !stats.lastDate) return null;
    const fmt = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("ru-RU", { month: "short", year: "numeric" });
    if (stats.firstDate === stats.lastDate) return fmt(stats.firstDate);
    return `${fmt(stats.firstDate)} — ${fmt(stats.lastDate)}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <a href="/" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-orange-400 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 transition-colors">
        ← Все концерты
      </a>

      {/* Профиль артиста */}
      <div className="flex gap-5 items-start">
        {(artistInfo?.imageUrl || concerts[0]?.artist.imageUrl) ? (
          <Image src={artistInfo?.imageUrl || concerts[0]?.artist.imageUrl}
            alt={displayName} width={96} height={96}
            className="w-24 h-24 rounded-xl object-cover flex-shrink-0" unoptimized />
        ) : (
          <div className="w-24 h-24 rounded-xl bg-zinc-800 flex-shrink-0 flex items-center justify-center text-zinc-600 text-3xl">♪</div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{displayName}</h1>
          {(artistInfo?.genre || concerts[0]?.artist.genre) && (
            <p className="text-zinc-500 text-sm">{artistInfo?.genre || concerts[0]?.artist.genre}</p>
          )}
          {formatTourDates() && (
            <p className="text-xs text-zinc-600 mt-1">Тур: {formatTourDates()}</p>
          )}
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
          <p className="text-xs text-zinc-500 mt-1">
            {pluralize(stats.total, "концерт", "концерта", "концертов")}
          </p>
        </div>
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 text-center">
          <p className={`text-3xl font-bold ${stats.visaFree > 0 ? "text-emerald-400" : "text-red-400"}`}>
            {stats.visaFree}
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            {stats.visaFree > 0
              ? `${pluralize(stats.visaFree, "доступен", "доступно", "доступно")} без визы`
              : "нет без визы"}
          </p>
        </div>
      </div>

      {/* Список концертов */}
      <section className="space-y-3">
        <h2 className="font-semibold text-lg">
          Все концерты
          <span className="text-zinc-500 font-normal text-sm ml-2">
            ({stats.total})
          </span>
        </h2>
        {concerts.map((concert) => {
          const visa = getVisaStatus(concert.countryCode, passport);
          const flight = findFlightRoute(originCity, concert.city);
          return (
            <a key={concert.id} href={`/concert/${concert.id}`}
              className="block bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-zinc-600 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{concert.city}{concert.country ? `, ${concert.country}` : ""}</p>
                  <p className="text-sm text-zinc-400">
                    {new Date(concert.date + "T12:00:00").toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  <p className="text-sm text-zinc-500">{concert.venue}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  {visa && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isVisaFree(visa) ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/15 text-red-400"
                    }`}>
                      {visaStatusLabels[visa]}
                    </span>
                  )}
                  {flight ? (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      flight.direct ? "bg-blue-500/20 text-blue-400" : "bg-amber-500/15 text-amber-400"
                    }`}>
                      {flight.direct ? "Прямой рейс" : "С пересадкой"}
                    </span>
                  ) : null}
                </div>
              </div>
            </a>
          );
        })}
      </section>

      {/* Уведомления */}
      <section className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 text-center space-y-3">
        <p className="text-sm text-zinc-400">Хотите узнать о новых концертах {displayName}?</p>
        <a href={`mailto:your@email.com?subject=Уведомления: ${displayName}&body=Хочу получать уведомления о новых концертах ${displayName}`}
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2.5 rounded-xl transition-colors text-sm">
          Уведомить о новых концертах
        </a>
      </section>
    </div>
  );
}
