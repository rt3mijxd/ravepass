"use client";

import { use, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { getVisaStatus, isVisaFree } from "@/data/visas";
import { findFlightRoute } from "@/data/flights";
import SearchableSelect from "@/components/SearchableSelect";
import ArtistMiniMap from "@/components/ArtistMiniMap";
import SubscribeButton from "@/components/SubscribeButton";
import { useSettings } from "@/components/SettingsContext";
import { t, pluralizeI18n, convertPrice, formatPrice } from "@/lib/i18n";
import { getPassportOptions } from "@/data/passports";
import { getCityOptions } from "@/data/cities";
import type { Concert } from "@/types";

function unslugify(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { lang, currency } = useSettings();
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [artistInfo, setArtistInfo] = useState<{ name: string; imageUrl: string; genre: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [passport, setPassport] = useState("RU");
  const [originCity, setOriginCity] = useState("MOW");
  const [visaFreeOnly, setVisaFreeOnly] = useState(false);
  const [directOnly, setDirectOnly] = useState(false);

  const passportOpts = getPassportOptions(lang);
  const cityOpts = getCityOptions(lang);

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

  // Концерты с учётом фильтров «без визы» и «прямые рейсы»
  const filteredConcerts = useMemo(() => {
    return concerts.filter((c) => {
      if (visaFreeOnly && !isVisaFree(getVisaStatus(c.countryCode, passport))) return false;
      if (directOnly) {
        const f = findFlightRoute(originCity, c.city);
        if (!f || !f.direct) return false;
      }
      return true;
    });
  }, [concerts, visaFreeOnly, directOnly, passport, originCity]);

  const stats = useMemo(() => {
    const total = filteredConcerts.length;
    const visaFree = filteredConcerts.filter((c) => isVisaFree(getVisaStatus(c.countryCode, passport))).length;
    const countries = new Set(filteredConcerts.map((c) => c.countryCode).filter(Boolean)).size;

    const dates = concerts.map((c) => c.date).filter(Boolean).sort();
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];

    return { total, visaFree, countries, firstDate, lastDate };
  }, [filteredConcerts, concerts, passport]);

  // Страны выступлений для мини-карты (с учётом фильтров)
  const countryCodes = useMemo(
    () => Array.from(new Set(filteredConcerts.map((c) => c.countryCode).filter(Boolean))),
    [filteredConcerts],
  );

  const displayName = artistInfo?.name || unslugify(slug);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Профиль */}
        <div className="flex gap-5 items-start">
          <div className="skeleton w-24 h-24 rounded-xl flex-shrink-0" />
          <div className="space-y-2 pt-2 flex-1">
            <div className="skeleton h-6 w-1/2 rounded" />
            <div className="skeleton h-4 w-1/4 rounded" />
          </div>
        </div>
        <div className="skeleton h-11 w-full sm:w-56 rounded-xl" />
        <div className="grid grid-cols-2 gap-3">
          <div className="skeleton h-11 rounded-xl" />
          <div className="skeleton h-11 rounded-xl" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-3">
            <div className="skeleton h-20 rounded-xl" />
            <div className="skeleton h-20 rounded-xl" />
          </div>
          <div className="skeleton rounded-xl" style={{ aspectRatio: "460/230" }} />
        </div>
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-20 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (concerts.length === 0 && !artistInfo) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">{t("artist.not_found", lang)}</h1>
        <a href="/" className="inline-block text-sm font-medium text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-xl px-5 py-2.5 hover:bg-orange-500/20 transition-colors">
          {t("nav.back_home", lang)}
        </a>
      </div>
    );
  }

  const formatTourDates = () => {
    if (!stats.firstDate || !stats.lastDate) return null;
    const locale = lang === "ru" ? "ru-RU" : "en-US";
    const fmt = (d: string) => new Date(d + "T12:00:00").toLocaleDateString(locale, { month: "short", year: "numeric" });
    if (stats.firstDate === stats.lastDate) return fmt(stats.firstDate);
    return `${fmt(stats.firstDate)} — ${fmt(stats.lastDate)}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <a href="/" className="inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 transition-colors">
        {t("nav.back_all", lang)}
      </a>

      {/* Профиль артиста */}
      <div className="flex gap-5 items-start">
        {(artistInfo?.imageUrl || concerts[0]?.artist.imageUrl) ? (
          <Image src={artistInfo?.imageUrl || concerts[0]?.artist.imageUrl}
            alt={displayName} width={96} height={96}
            className="w-24 h-24 rounded-xl object-cover flex-shrink-0" unoptimized />
        ) : (
          <div className="w-24 h-24 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex-shrink-0 flex items-center justify-center text-zinc-400 dark:text-zinc-600 text-3xl">♪</div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{displayName}</h1>
          {(artistInfo?.genre || concerts[0]?.artist.genre) && (
            <p className="text-zinc-500 text-sm">{artistInfo?.genre || concerts[0]?.artist.genre}</p>
          )}
          {formatTourDates() && (
            <p className="text-xs text-zinc-600 mt-1">{t("artist.tour", lang)}: {formatTourDates()}</p>
          )}
        </div>
      </div>

      {/* Подписка на уведомления (кнопка → модалка) */}
      <SubscribeButton artistSlug={slug} artistName={displayName} passport={passport} originCity={originCity} />

      {/* Настройки */}
      <div className="grid grid-cols-2 gap-3">
        <SearchableSelect label={t("filter.passport", lang)} options={passportOpts} value={passport}
          onChange={setPassport} searchPlaceholder={lang === "ru" ? "Поиск паспорта..." : "Search passport..."} />
        <SearchableSelect label={t("filter.origin_city", lang)} options={cityOpts} value={originCity}
          onChange={setOriginCity} searchPlaceholder={lang === "ru" ? "Поиск города..." : "Search city..."} />
      </div>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <div className="relative">
            <input type="checkbox" checked={visaFreeOnly} onChange={(e) => setVisaFreeOnly(e.target.checked)} className="sr-only peer" />
            <div className="w-8 h-5 bg-zinc-300 dark:bg-zinc-700 rounded-full peer-checked:bg-orange-500 transition-colors" />
            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-3 transition-transform" />
          </div>
          {t("filter.visa_free", lang)}
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <div className="relative">
            <input type="checkbox" checked={directOnly} onChange={(e) => setDirectOnly(e.target.checked)} className="sr-only peer" />
            <div className="w-8 h-5 bg-zinc-300 dark:bg-zinc-700 rounded-full peer-checked:bg-orange-500 transition-colors" />
            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-3 transition-transform" />
          </div>
          {t("filter.direct_flights", lang)}
        </label>
      </div>

      {/* Счётчики (слева) + мини-карта (справа) */}
      <div className="grid gap-3 sm:grid-cols-2 sm:items-stretch">
        <div className="grid grid-cols-2 sm:grid-cols-1 gap-3">
          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col justify-center text-center sm:flex-1">
            <p className="text-3xl font-bold">{stats.total}</p>
            <p className="text-xs text-zinc-500 mt-1">
              {pluralizeI18n(stats.total, lang, "концерт", "концерта", "концертов", "concert", "concerts")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setVisaFreeOnly((v) => !v)}
            title={t("filter.visa_free", lang)}
            className={`rounded-xl border p-4 flex flex-col justify-center text-center sm:flex-1 transition-colors cursor-pointer ${
              visaFreeOnly
                ? "bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/40"
                : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/40"
            }`}
          >
            <p className={`text-3xl font-bold ${stats.visaFree > 0 ? "text-emerald-400" : "text-red-400"}`}>
              {stats.visaFree}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              {stats.visaFree > 0
                ? `${pluralizeI18n(stats.visaFree, lang, "доступен", "доступно", "доступно", "available", "available")} ${t("artist.available_visa_free", lang)}`
                : t("artist.no_visa_free", lang)}
            </p>
            <p className="text-[10px] text-emerald-500/80 mt-1.5">
              {visaFreeOnly ? `✓ ${t("filter.visa_free", lang)}` : t("filter.visa_free", lang)}
            </p>
          </button>
        </div>

        {/* Мини-карта стран выступлений */}
        <ArtistMiniMap countryCodes={countryCodes} lang={lang} />
      </div>

      {/* Список концертов */}
      <section className="space-y-3">
        <h2 className="font-semibold text-lg">
          {t("section.all_concerts", lang)}
          <span className="text-zinc-500 font-normal text-sm ml-2">
            ({stats.total})
          </span>
        </h2>
        {filteredConcerts.length === 0 && (
          <p className="text-sm text-zinc-400 dark:text-zinc-500 py-4">{t("empty.no_concerts", lang)}</p>
        )}
        {filteredConcerts.map((concert) => {
          const visa = getVisaStatus(concert.countryCode, passport);
          const flight = findFlightRoute(originCity, concert.city);
          return (
            <a key={concert.id} href={`/concert/${concert.id}`}
              className="block bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{concert.city}{concert.country ? `, ${concert.country}` : ""}</p>
                  <p className="text-sm text-zinc-400">
                    {new Date(concert.date + "T12:00:00").toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", { day: "numeric", month: "long", year: "numeric" })}
                    {concert.time ? `, ${concert.time.slice(0, 5)}` : ""}
                  </p>
                  <p className="text-sm text-zinc-500">{concert.venue}</p>
                  {concert.priceMin != null && (
                    <p className="text-xs text-zinc-600 mt-0.5">
                      {t("artist.from", lang)} {formatPrice(convertPrice(concert.priceMin, concert.currency ?? "USD", currency), currency, lang)}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isVisaFree(visa) ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/15 text-red-400"
                    }`}>
                      {t(`visa.${visa}` as Parameters<typeof t>[0], lang)}
                    </span>
                  {flight ? (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      flight.direct ? "bg-blue-500/20 text-blue-400" : "bg-amber-500/15 text-amber-400"
                    }`}>
                      {flight.direct ? t("flight.direct_full", lang) : t("flight.connection_full", lang)}
                    </span>
                  ) : null}
                </div>
              </div>
            </a>
          );
        })}
      </section>
    </div>
  );
}
