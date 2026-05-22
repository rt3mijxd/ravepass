"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import { getVisaStatus, isVisaFree, VISA_LAST_UPDATED } from "@/data/visas";
import { findFlightRoute, getAviasalesUrl } from "@/data/flights";
import SearchableSelect from "@/components/SearchableSelect";
import { useSettings } from "@/components/SettingsContext";
import { t, pluralizeI18n, convertPrice, formatPrice } from "@/lib/i18n";
import { getPassportOptions } from "@/data/passports";
import { getCityOptions, getCityName } from "@/data/cities";
import type { Concert } from "@/types";

export default function ConcertPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { lang, currency } = useSettings();
  const [concert, setConcert] = useState<Concert | null>(null);
  const [loading, setLoading] = useState(true);
  const [passport, setPassport] = useState("RU");
  const [originCity, setOriginCity] = useState("MOW");

  const passportOpts = getPassportOptions(lang);
  const cityOpts = getCityOptions(lang);

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
        <h1 className="text-2xl font-bold mb-4">{t("concert.not_found", lang)}</h1>
        <a href="/" className="inline-block text-sm font-medium text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-xl px-5 py-2.5 hover:bg-orange-500/20 transition-colors">
          {t("nav.back_home", lang)}
        </a>
      </div>
    );
  }

  const visa = getVisaStatus(concert.countryCode, passport);
  const flight = findFlightRoute(originCity, concert.city);
  const dateFormatted = new Date(concert.date + "T12:00:00").toLocaleDateString(
    lang === "ru" ? "ru-RU" : "en-US",
    { weekday: "long", day: "numeric", month: "long", year: "numeric" },
  );

  // Конвертация цен
  const ticketMin = concert.priceMin != null ? convertPrice(concert.priceMin, concert.currency ?? "USD", currency) : null;
  const ticketMax = concert.priceMax != null ? convertPrice(concert.priceMax, concert.currency ?? "USD", currency) : null;
  const flightMin = flight ? convertPrice(flight.priceRange[0], "RUB", currency) : null;
  const flightMax = flight ? convertPrice(flight.priceRange[1], "RUB", currency) : null;

  const originCityName = getCityName(originCity, lang);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <a href="/" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-orange-400 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 transition-colors">
        {t("nav.back_all", lang)}
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
        <h2 className="font-semibold">{t("concert.your_trip", lang)}</h2>
        <div className="grid grid-cols-2 gap-3">
          <SearchableSelect label={t("filter.passport", lang)} options={passportOpts} value={passport}
            onChange={setPassport} searchPlaceholder={lang === "ru" ? "Поиск паспорта..." : "Search passport..."} />
          <SearchableSelect label={t("filter.origin_city", lang)} options={cityOpts} value={originCity}
            onChange={setOriginCity} searchPlaceholder={lang === "ru" ? "Поиск города..." : "Search city..."} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {visa && (
            <div className={`rounded-lg p-3 ${isVisaFree(visa) ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-red-500/10 border border-red-500/30"}`}>
              <p className="text-xs text-zinc-400">{t("concert.visa", lang)}</p>
              <p className={`font-medium text-sm ${isVisaFree(visa) ? "text-emerald-400" : "text-red-400"}`}>
                {t(`visa.${visa}` as Parameters<typeof t>[0], lang)}
              </p>
            </div>
          )}
          {flight ? (
            <>
              <div className="rounded-lg p-3 bg-zinc-800 border border-zinc-700">
                <p className="text-xs text-zinc-400">{t("concert.flight", lang)}</p>
                <p className="font-medium text-sm">
                  {flight.direct ? t("flight.direct_full", lang) : t("flight.connection_full", lang)}, ~{flight.flightTimeHours}{t("unit.h", lang)}
                </p>
              </div>
              <div className="rounded-lg p-3 bg-zinc-800 border border-zinc-700">
                <p className="text-xs text-zinc-400">{t("concert.flight_from", lang)}</p>
                <p className="font-medium text-sm">
                  {formatPrice(flightMin!, currency, lang)}–{formatPrice(flightMax!, currency, lang)}
                </p>
              </div>
            </>
          ) : (
            <div className="rounded-lg p-3 bg-zinc-800 border border-zinc-700 col-span-2">
              <p className="text-xs text-zinc-400">{t("concert.flight", lang)}</p>
              <p className="font-medium text-sm text-zinc-500">{t("flight.no_data", lang)} {originCityName}</p>
            </div>
          )}
        </div>
      </section>

      {/* Примерный бюджет */}
      <section className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 space-y-3">
        <h2 className="font-semibold">{t("concert.budget", lang)}</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-400">{t("concert.ticket", lang)}</span>
            {ticketMin != null && ticketMax != null ? (
              <span>{formatPrice(ticketMin, currency, lang)}–{formatPrice(ticketMax, currency, lang)}</span>
            ) : (
              <span className="text-zinc-500">{t("concert.price_tbd", lang)}</span>
            )}
          </div>
          {flightMin != null && flightMax != null && (
            <div className="flex justify-between">
              <span className="text-zinc-400">{t("concert.flight", lang)} ({originCityName} → {concert.city})</span>
              <span>{formatPrice(flightMin, currency, lang)}–{formatPrice(flightMax, currency, lang)}</span>
            </div>
          )}
          <hr className="border-zinc-800" />
          {(ticketMin != null || flightMin != null) && (
            <div className="flex justify-between font-medium">
              <span>{t("concert.total_from", lang)}</span>
              <span>
                {formatPrice((ticketMin ?? 0) + (flightMin ?? 0), currency, lang)}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Кнопки */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a href={concert.ticketUrl} target="_blank" rel="noopener noreferrer"
          className="flex-1 text-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-xl transition-colors">
          {t("concert.buy_tickets", lang)}
        </a>
        <a href={getAviasalesUrl(originCity, concert.city, concert.date)} target="_blank" rel="noopener noreferrer"
          className="flex-1 text-center bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 font-medium py-3 rounded-xl transition-colors">
          {t("concert.find_flights", lang)}
        </a>
      </div>

      <p className="text-xs text-zinc-600 text-center">
        {t("concert.visa_updated", lang)} {VISA_LAST_UPDATED}.
      </p>

      <div className="text-center">
        <a href={`/artist/${concert.artist.slug}`}
          className="inline-block text-sm font-medium text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-xl px-5 py-2.5 hover:bg-orange-500/20 transition-colors">
          {t("concert.all_concerts_by", lang)} {concert.artist.name} →
        </a>
      </div>
    </div>
  );
}
