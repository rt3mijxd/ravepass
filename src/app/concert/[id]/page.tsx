"use client";

import { formatConcertDate } from "@/lib/dates";
import { concertLocation } from "@/lib/country-label";
import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { getVisaStatus, getVisaDetails, getVerifiedVisaRule, VISA_LAST_UPDATED } from "@/data/visas";
import { findFlightRoute, getAviasalesUrl } from "@/data/flights";
import SearchableSelect from "@/components/SearchableSelect";
import { useSettings } from "@/components/SettingsContext";
import { t } from "@/lib/i18n";
import { displayMoney, formatMoney, formatPriceRange } from "@/lib/prices";
import { usePriceQuotes } from "@/lib/use-price-quotes";
import { getPassportOptions } from "@/data/passports";
import { getCityOptions, getCityName } from "@/data/cities";
import type { Concert, VisaStatus } from "@/types";

const visaStyles: Record<VisaStatus, { box: string; text: string }> = {
  visa_free: { box: "border-emerald-500/30 bg-emerald-500/10", text: "text-emerald-800 dark:text-emerald-300" },
  visa_on_arrival: { box: "border-lime-500/30 bg-lime-500/10", text: "text-lime-800 dark:text-lime-300" },
  evisa: { box: "border-amber-500/30 bg-amber-500/10", text: "text-amber-800 dark:text-amber-300" },
  eta: { box: "border-sky-500/30 bg-sky-500/10", text: "text-sky-800 dark:text-sky-300" },
  entry_restricted: { box: "border-red-500/30 bg-red-500/10", text: "text-red-800 dark:text-red-300" },
  unknown: { box: "border-zinc-500/30 bg-zinc-500/10", text: "text-zinc-700 dark:text-zinc-300" },
  visa_required: { box: "border-red-500/30 bg-red-500/10", text: "text-red-800 dark:text-red-300" },
};

export default function ConcertPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { lang, currency, passport, setPassport, originCity, setOriginCity } = useSettings();
  const quotes = usePriceQuotes();
  const [concert, setConcert] = useState<Concert | null>(null);
  const [loading, setLoading] = useState(true);
  const [catalogError, setCatalogError] = useState(false);

  const passportOpts = getPassportOptions(lang);
  const cityOpts = getCityOptions(lang);

  useEffect(() => {
    fetch(`/api/concert/${encodeURIComponent(id)}`)
      .then((res) => {
        if (res.status === 404) return null;
        if (!res.ok) throw new Error("Could not load concert");
        return res.json();
      })
      .then((data) => setConcert(data))
      .catch(() => setCatalogError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Шапка */}
        <div className="flex gap-5 items-start">
          <div className="skeleton w-24 h-24 rounded-xl flex-shrink-0" />
          <div className="space-y-2 pt-2 flex-1">
            <div className="skeleton h-6 w-1/2 rounded" />
            <div className="skeleton h-4 w-2/3 rounded" />
            <div className="skeleton h-4 w-1/3 rounded" />
          </div>
        </div>
        <div className="skeleton h-40 rounded-xl" />
        <div className="skeleton h-28 rounded-xl" />
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="skeleton h-12 flex-1 rounded-xl" />
          <div className="skeleton h-12 flex-1 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!concert) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">{t(catalogError ? "empty.catalog_unavailable" : "concert.not_found", lang)}</h1>
        <Link href="/" className="inline-block text-sm font-medium text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-xl px-5 py-2.5 hover:bg-orange-500/20 transition-colors">
          {t("nav.back_home", lang)}
        </Link>
      </div>
    );
  }

  const visa = getVisaStatus(concert.countryCode, passport);
  const verifiedVisa = getVerifiedVisaRule(concert.countryCode, passport);
  const visaDets = getVisaDetails(concert.countryCode, passport, lang);
  const flight = findFlightRoute(originCity, concert.city);
  const dateFormatted = formatConcertDate(concert, lang, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const ticketMin = displayMoney(concert.priceMin, concert.currency, currency, quotes);
  const ticketMax = displayMoney(concert.priceMax, concert.currency, currency, quotes);
  const flightMin = displayMoney(flight?.priceRange[0], "RUB", currency, quotes);
  const flightMax = displayMoney(flight?.priceRange[1], "RUB", currency, quotes);
  const total = ticketMin && flightMin && ticketMin.currency === flightMin.currency
    ? { amount: ticketMin.amount + flightMin.amount, currency: ticketMin.currency }
    : null;
  const converted = (ticketMin && ticketMin.currency !== concert.currency) || (flightMin && flightMin.currency !== "RUB");

  const originCityName = getCityName(originCity, lang);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 transition-colors">
        {t("nav.back_all", lang)}
      </Link>

      {/* Шапка */}
      <div className="flex gap-5 items-start">
        {concert.artist.imageUrl ? (
          <Image src={concert.artist.imageUrl} alt={concert.artist.name}
            width={96} height={96} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" loading="eager" unoptimized />
        ) : (
          <div className="w-24 h-24 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex-shrink-0 flex items-center justify-center text-zinc-400 dark:text-zinc-600 text-3xl">♪</div>
        )}
        <div className="min-w-0 wrap-anywhere">
          <h1 className="text-2xl font-bold tracking-tight">{concert.artist.name}</h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-300">
            {dateFormatted}
            {concert.time ? `, ${concert.time.slice(0, 5)}` : ""}
          </p>
          <p className="text-zinc-600 dark:text-zinc-400">{concertLocation(concert, lang)}{concert.venue ? ` · ${concert.venue}` : ""}</p>
          {concert.artist.genre && <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{concert.artist.genre}</p>}
        </div>
      </div>

      {/* Настройки поездки */}
      <section className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
        <h2 className="font-semibold">{t("concert.your_trip", lang)}</h2>
        <div className="grid grid-cols-2 gap-3">
          <SearchableSelect label={t("filter.passport", lang)} options={passportOpts} value={passport}
            onChange={setPassport} searchPlaceholder={lang === "ru" ? "Поиск паспорта..." : "Search passport..."} />
          <SearchableSelect label={t("filter.origin_city", lang)} options={cityOpts} value={originCity}
            onChange={setOriginCity} searchPlaceholder={lang === "ru" ? "Поиск города..." : "Search city..."} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className={`rounded-lg p-3 border ${visaStyles[visa].box}`}>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">{t("concert.visa", lang)}</p>
              <p className={`font-medium text-sm ${visaStyles[visa].text}`}>
                {t(`visa.${visa}` as Parameters<typeof t>[0], lang)}
              </p>
              {visaDets && (visa === "visa_free" || visa === "visa_on_arrival") && (
                <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-300">{visaDets}</p>
              )}
            </div>
          {flight ? (
            <>
              <div className="rounded-lg p-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <p className="text-xs text-zinc-600 dark:text-zinc-400">{t("concert.flight", lang)}</p>
                <p className="font-medium text-sm">
                  {flight.direct ? t("flight.direct_full", lang) : t("flight.connection_full", lang)}, ~{flight.flightTimeHours}{t("unit.h", lang)}
                </p>
              </div>
              <div className="rounded-lg p-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <p className="text-xs text-zinc-600 dark:text-zinc-400">{t("concert.flight_from", lang)}</p>
                <p className="font-medium text-sm">
                  {flightMin && formatPriceRange(flightMin, flightMax, lang)}
                </p>
              </div>
            </>
          ) : (
            <div className="rounded-lg p-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 col-span-2">
              <p className="text-xs text-zinc-600 dark:text-zinc-400">{t("concert.flight", lang)}</p>
              <p className="font-medium text-sm text-zinc-500">{t("flight.no_data", lang)} {originCityName}</p>
            </div>
          )}
        </div>
      </section>

      {/* Примерный бюджет */}
      <section className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-3">
        <h2 className="font-semibold">{t("concert.budget", lang)}</h2>
        <div className="space-y-2 text-sm">
          <div className="flex flex-wrap justify-between gap-x-3 gap-y-1">
            <span className="text-zinc-400">{t("concert.ticket", lang)}</span>
            {ticketMin ? (
              <span className="shrink-0 text-right">{formatPriceRange(ticketMin, ticketMax, lang)}</span>
            ) : (
              <span className="text-zinc-600 dark:text-zinc-400">{t("concert.price_tbd", lang)}</span>
            )}
          </div>
          {flightMin && (
            <div className="flex flex-wrap justify-between gap-x-3 gap-y-1">
              <span className="text-zinc-400">{t("concert.flight", lang)} ({originCityName} → {concert.city})</span>
              <span className="shrink-0 text-right">{formatPriceRange(flightMin, flightMax, lang)}</span>
            </div>
          )}
          {total && (
            <div className="flex justify-between gap-3 border-t border-zinc-200 pt-2 font-medium dark:border-zinc-800">
              <span>{t("concert.total_from", lang)}</span>
              <span>{formatMoney(total, lang)}</span>
            </div>
          )}
          {converted && quotes && (
            <a href="https://frankfurter.dev/" target="_blank" rel="noopener noreferrer"
              className="block text-xs text-zinc-600 underline underline-offset-2 dark:text-zinc-400">
              {t("concert.rates", lang)} · {formatConcertDate({ date: quotes.date }, lang, { day: "numeric", month: "short", year: "numeric" })}
            </a>
          )}
        </div>
      </section>

      {/* Кнопки */}
      <div className="flex flex-col sm:flex-row gap-3">
        {concert.ticketUrl && <a href={concert.ticketUrl} target="_blank" rel="noopener noreferrer"
          onClick={() => track("buy_tickets", { artist: concert.artist.name, city: concert.city, country: concert.countryCode })}
          className="flex-1 text-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-xl transition-colors">
          {t(concert.soldOut ? "concert.sold_out" : "concert.buy_tickets", lang)}
        </a>}
        <a href={getAviasalesUrl(originCity, concert.city, concert.date)} target="_blank" rel="noopener noreferrer"
          onClick={() => track("find_flights", { origin: originCity, city: concert.city, country: concert.countryCode })}
          className="flex-1 text-center bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 font-medium py-3 rounded-xl transition-colors">
          {t("concert.find_flights", lang)}
        </a>
      </div>

      <p className="text-xs text-zinc-600 dark:text-zinc-400 text-center">
        {t(verifiedVisa ? "concert.visa_verified" : "concert.visa_updated", lang)} {verifiedVisa?.verified ?? VISA_LAST_UPDATED}.{" "}
        {verifiedVisa && (
          <>
            <a href={verifiedVisa.source} target="_blank" rel="noopener noreferrer"
              className="text-orange-700 dark:text-orange-400 underline underline-offset-2">
              {t("concert.visa_source", lang)}
            </a>{" · "}
          </>
        )}
        <a href="https://www.iatatravelcentre.com/" target="_blank" rel="noopener noreferrer"
          className="text-orange-700 dark:text-orange-400 underline underline-offset-2">
          {t("concert.verify_entry", lang)}
        </a>
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
