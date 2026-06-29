"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { mockConcerts } from "@/data/concerts";
import { getVisaStatus, isVisaFree, countryNames } from "@/data/visas";
import { findFlightRoute } from "@/data/flights";
import SearchableSelect from "@/components/SearchableSelect";
import ArtistCardSkeleton from "@/components/ArtistCardSkeleton";
import { useSettings } from "@/components/SettingsContext";
import { t, pluralizeI18n } from "@/lib/i18n";
import { normalizeText } from "@/lib/slug";
import { topArtistRank } from "@/data/topArtists";
import { getPassportOptions } from "@/data/passports";
import { getCityOptions } from "@/data/cities";
import type { Concert, VisaStatus } from "@/types";
import type { FlightRoute } from "@/types";

const popularDestinations = [
  { city: "Стамбул", cityEn: "Istanbul", countryCode: "TR", emoji: "🇹🇷" },
  { city: "Дубай", cityEn: "Dubai", countryCode: "AE", emoji: "🇦🇪" },
  { city: "Белград", cityEn: "Belgrade", countryCode: "RS", emoji: "🇷🇸" },
  { city: "Тбилиси", cityEn: "Tbilisi", countryCode: "GE", emoji: "🇬🇪" },
  { city: "Ереван", cityEn: "Yerevan", countryCode: "AM", emoji: "🇦🇲" },
  { city: "Алматы", cityEn: "Almaty", countryCode: "KZ", emoji: "🇰🇿" },
  { city: "Бангкок", cityEn: "Bangkok", countryCode: "TH", emoji: "🇹🇭" },
];

interface EnrichedConcert {
  concert: Concert;
  visa: VisaStatus;
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
  const { lang } = useSettings();
  const [allConcerts, setAllConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [passport, setPassport] = useState("RU");
  const [originCity, setOriginCity] = useState("MOW");
  const [visaFreeOnly, setVisaFreeOnly] = useState(false);
  const [directOnly, setDirectOnly] = useState(false);
  const [countryFilter, setCountryFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [discoverTab, setDiscoverTab] = useState<"artists" | "destinations">("artists");

  const passportOpts = useMemo(() => getPassportOptions(lang), [lang]);
  const cityOpts = useMemo(() => getCityOptions(lang), [lang]);

  useEffect(() => {
    fetch("/api/concerts")
      .then((res) => res.json())
      .then((data: Concert[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllConcerts(data);
        } else {
          setAllConcerts(mockConcerts);
        }
      })
      .catch(() => { setAllConcerts(mockConcerts); })
      .finally(() => setLoading(false));
  }, []);

  const availableCountries = useMemo(() => {
    const codes = new Set(allConcerts.map((c) => c.countryCode).filter(Boolean));
    return Array.from(codes).sort((a, b) => (countryNames[a] ?? a).localeCompare(countryNames[b] ?? b, "ru"));
  }, [allConcerts]);

  const countryOptions = useMemo(() => [
    { value: "", label: t("filter.all_countries", lang), group: "popular" },
    ...availableCountries.map((code) => ({ value: code, label: countryNames[code] ?? code })),
  ], [availableCountries, lang]);

  const artistGroups = useMemo(() => {
    const query = normalizeText(searchQuery);
    const filtered = allConcerts
      .map((concert) => ({
        concert,
        visa: getVisaStatus(concert.countryCode, passport),
        flight: findFlightRoute(originCity, concert.city),
      }))
      .filter(({ concert, visa, flight }) => {
        if (query && !normalizeText(concert.artist.name).includes(query)) return false;
        if (visaFreeOnly && !isVisaFree(visa)) return false;
        if (directOnly && flight && !flight.direct) return false;
        if (directOnly && !flight) return false;
        if (countryFilter && concert.countryCode !== countryFilter) return false;
        if (cityFilter && concert.city !== cityFilter) return false;
        return true;
      });

    const groupMap = new Map<string, ArtistGroup>();
    for (const item of filtered) {
      const slug = item.concert.artist.slug;
      if (!groupMap.has(slug)) {
        groupMap.set(slug, {
          artistName: item.concert.artist.name, slug,
          imageUrl: item.concert.artist.imageUrl, genre: item.concert.artist.genre,
          concerts: [],
        });
      }
      groupMap.get(slug)!.concerts.push(item);
    }
    for (const group of groupMap.values()) {
      group.concerts.sort((a, b) => a.concert.date.localeCompare(b.concert.date));
    }
    return Array.from(groupMap.values()).sort((a, b) => b.concerts.length - a.concerts.length);
  }, [allConcerts, searchQuery, passport, originCity, visaFreeOnly, directOnly, countryFilter, cityFilter]);

  const totalConcerts = artistGroups.reduce((sum, g) => sum + g.concerts.length, 0);
  const visaLabel = (visa: VisaStatus) => t(`visa.${visa}` as Parameters<typeof t>[0], lang);

  // Топовые мировые артисты в туре — берём из курируемого списка популярности
  // (а не по числу концертов), отсекает трибьюты и случайные акты
  const topArtists = useMemo(() => {
    const map = new Map<string, { name: string; slug: string; imageUrl: string; count: number; rank: number }>();
    for (const c of allConcerts) {
      const s = c.artist.slug;
      const rank = topArtistRank.get(s);
      if (rank === undefined) continue; // не из списка мировых звёзд — пропускаем
      let g = map.get(s);
      if (!g) { g = { name: c.artist.name, slug: s, imageUrl: c.artist.imageUrl, count: 0, rank }; map.set(s, g); }
      g.count++;
    }
    return Array.from(map.values()).sort((a, b) => a.rank - b.rank).slice(0, 12);
  }, [allConcerts]);

  const feelingLucky = () => {
    // Случайный из топовых артистов (отсортированы по популярности)
    const pool = artistGroups.slice(0, 25);
    if (pool.length === 0) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    window.location.href = `/artist/${pick.slug}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Поиск + «Мне повезёт» */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("search.placeholder", lang)}
            className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300">
              ✕
            </button>
          )}
        </div>
        <button
          onClick={feelingLucky}
          disabled={loading || artistGroups.length === 0}
          title={t("lucky.button", lang)}
          className="flex-shrink-0 flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-medium hover:border-orange-500 hover:text-orange-500 dark:hover:text-orange-400 disabled:opacity-50 disabled:hover:border-zinc-300 dark:disabled:hover:border-zinc-800 transition-colors"
        >
          <span className="text-base">🎲</span>
          <span className="hidden sm:inline">{t("lucky.button", lang)}</span>
        </button>
      </div>

      {/* Фильтры */}
      <section className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 sm:p-6 border border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SearchableSelect label={t("filter.passport", lang)} options={passportOpts} value={passport}
            onChange={setPassport} searchPlaceholder={lang === "ru" ? "Поиск паспорта..." : "Search passport..."} />
          <SearchableSelect label={t("filter.origin_city", lang)} options={cityOpts} value={originCity}
            onChange={setOriginCity} searchPlaceholder={lang === "ru" ? "Поиск города..." : "Search city..."} />
          <SearchableSelect label={t("filter.country", lang)} options={countryOptions} value={countryFilter}
            onChange={setCountryFilter} searchPlaceholder={lang === "ru" ? "Поиск страны..." : "Search country..."} />
          <div className="flex flex-col justify-end gap-2">
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
        </div>
      </section>

      {/* Открыть для себя: мировые звёзды / направления (один блок, переключатель) */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          {([
            ["artists", `🔥 ${t("discover.artists", lang)}`],
            ["destinations", `📍 ${t("discover.destinations", lang)}`],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setDiscoverTab(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                discoverTab === key
                  ? "bg-orange-500/15 text-orange-600 dark:text-orange-400"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {discoverTab === "artists" ? (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {loading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-[72px] flex flex-col items-center gap-1.5">
                    <div className="skeleton w-16 h-16 rounded-full" />
                    <div className="skeleton h-3 w-14 rounded" />
                    <div className="skeleton h-2.5 w-10 rounded" />
                  </div>
                ))
              : topArtists.map((a) => (
                  <a key={a.slug} href={`/artist/${a.slug}`}
                    className="flex-shrink-0 w-[72px] text-center group">
                    {a.imageUrl ? (
                      <Image src={a.imageUrl} alt={a.name} width={64} height={64}
                        className="w-16 h-16 rounded-full object-cover mx-auto ring-2 ring-transparent group-hover:ring-orange-500 transition-all" unoptimized />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-800 mx-auto flex items-center justify-center text-zinc-400 dark:text-zinc-600 text-xl ring-2 ring-transparent group-hover:ring-orange-500 transition-all">♪</div>
                    )}
                    <p className="text-xs mt-1.5 truncate group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">{a.name}</p>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                      {a.count} {pluralizeI18n(a.count, lang, "концерт", "концерта", "концертов", "show", "shows")}
                    </p>
                  </a>
                ))}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {popularDestinations.map((dest) => (
              <button key={dest.city}
                onClick={() => { setCityFilter(cityFilter === dest.city ? "" : dest.city); setCountryFilter(""); }}
                className={`flex-shrink-0 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                  cityFilter === dest.city
                    ? "bg-orange-500/20 border-orange-500 text-orange-600 dark:text-orange-400"
                    : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"
                }`}
              >
                <span className="text-lg mr-2">{dest.emoji}</span>
                {lang === "en" ? dest.cityEn : dest.city}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Список артистов */}
      <section>
        <h2 className="text-lg font-semibold mb-3">
          {t("section.concerts", lang)}{" "}
          <span className="text-zinc-400 dark:text-zinc-500 font-normal text-sm">
            ({loading ? "..." : `${totalConcerts} ${pluralizeI18n(totalConcerts, lang, "событие", "события", "событий", "event", "events")}, ${artistGroups.length} ${pluralizeI18n(artistGroups.length, lang, "артист", "артиста", "артистов", "artist", "artists")}`})
          </span>
        </h2>

        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ArtistCardSkeleton key={i} />
            ))}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {artistGroups.map((group) => {
            const visaFreeConcerts = group.concerts.filter(({ visa }) => isVisaFree(visa));
            const visaRequiredConcerts = group.concerts.filter(({ visa }) => !isVisaFree(visa));
            const sorted = [...visaFreeConcerts, ...visaRequiredConcerts];
            const preview = sorted.slice(0, 3);
            const remaining = group.concerts.length - preview.length;
            const hasVisaFree = visaFreeConcerts.length > 0;

            return (
              <div key={group.slug}
                className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-zinc-400 dark:hover:border-zinc-600 transition-all">
                <a href={`/artist/${group.slug}`} className="flex gap-4 p-4 pb-2 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
                  {group.imageUrl ? (
                    <Image src={group.imageUrl} alt={group.artistName} width={56} height={56}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0" unoptimized />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex-shrink-0 flex items-center justify-center text-zinc-400 dark:text-zinc-600 text-xl">♪</div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{group.artistName}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        {group.concerts.length} {pluralizeI18n(group.concerts.length, lang, "концерт", "концерта", "концертов", "concert", "concerts")}
                      </span>
                      {hasVisaFree ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                          {t("visa.has_visa_free", lang)}
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-500 dark:text-red-400">
                          {t("visa.needs_visa", lang)}
                        </span>
                      )}
                    </div>
                  </div>
                </a>

                <div className="px-4 pb-3 space-y-1.5">
                  {preview.map(({ concert, visa, flight }) => (
                    <a key={concert.id} href={`/concert/${concert.id}`}
                      className="flex items-center justify-between gap-2 py-1.5 px-2 -mx-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors group">
                      <div className="min-w-0">
                        <p className="text-sm truncate group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                          {concert.city}{concert.country ? `, ${concert.country}` : ""}
                        </p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500">
                          {new Date(concert.date + "T12:00:00").toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", { day: "numeric", month: "short" })}
                          {concert.time ? `, ${concert.time.slice(0, 5)}` : ""}
                          {" · "}{concert.venue}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            isVisaFree(visa)
                              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                              : "bg-red-500/15 text-red-500 dark:text-red-400"
                          }`}>
                            {visaLabel(visa)}
                          </span>
                        {flight ? (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            flight.direct ? "bg-blue-500/20 text-blue-600 dark:text-blue-400" : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          }`}>
                            {flight.direct ? t("flight.direct", lang) : t("flight.connection", lang)}
                          </span>
                        ) : null}
                      </div>
                    </a>
                  ))}
                </div>

                {remaining > 0 && (
                  <a href={`/artist/${group.slug}`}
                    className="block text-center text-xs text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 py-2.5 border-t border-zinc-200 dark:border-zinc-800 transition-colors">
                    {t("nav.more", lang)} {remaining} {pluralizeI18n(remaining, lang, "концерт", "концерта", "концертов", "concert", "concerts")} →
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {!loading && artistGroups.length === 0 && (
          <p className="text-center text-zinc-400 dark:text-zinc-500 py-12">
            {searchQuery
              ? (lang === "ru" ? `Артист «${searchQuery}» не найден` : `Artist "${searchQuery}" not found`)
              : t("empty.no_concerts", lang)}
          </p>
        )}
      </section>

      {/* Предложить артиста */}
      <section className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 text-center space-y-3">
        <h2 className="font-semibold text-lg">{t("suggest.title", lang)}</h2>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 max-w-lg mx-auto">{t("suggest.description", lang)}</p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          {lang === "ru"
            ? "Нажмите 💬 в правом верхнем углу"
            : "Click 💬 in the top right corner"}
        </p>
      </section>
    </div>
  );
}
