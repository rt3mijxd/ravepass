"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { countryLabel, concertLocation } from "@/lib/country-label";
import { formatConcertDate } from "@/lib/dates";
import { getVisaStatus, isVisaFree } from "@/data/visas";
import { findFlightRoute } from "@/data/flights";
import SearchableSelect from "@/components/SearchableSelect";
import ArtistCardSkeleton from "@/components/ArtistCardSkeleton";
import ConcertMapLink from "@/components/ConcertMapLink";
import { useSettings } from "@/components/SettingsContext";
import { t, pluralizeI18n } from "@/lib/i18n";
import { normalizeText } from "@/lib/slug";
import { canonicalArtistSlug, compareArtistPopularity, matchesArtist, topArtistRank } from "@/data/topArtists";
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
  const { lang, passport, setPassport, originCity, setOriginCity } = useSettings();
  const router = useRouter();
  const [allConcerts, setAllConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [catalogError, setCatalogError] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [visaFreeOnly, setVisaFreeOnly] = useState(false);
  const [directOnly, setDirectOnly] = useState(false);
  const [countryFilter, setCountryFilter] = useState("");
  const [discoverTab, setDiscoverTab] = useState<"artists" | "destinations">("artists");

  const passportOpts = useMemo(() => getPassportOptions(lang), [lang]);
  const cityOpts = useMemo(() => getCityOptions(lang), [lang]);

  useEffect(() => {
    fetch("/api/concerts")
      .then(async (res) => {
        if (!res.ok) throw new Error("Could not load concerts");
        setAllConcerts(await res.json() as Concert[]);
      })
      .catch(() => setCatalogError(true))
      .finally(() => setLoading(false));
  }, []);

  const availableCountries = useMemo(() => {
    const codes = new Set(allConcerts.map((c) => c.countryCode).filter(Boolean));
    return Array.from(codes).sort((a, b) => countryLabel(a, lang, a).localeCompare(countryLabel(b, lang, b), lang));
  }, [allConcerts, lang]);

  const countryOptions = useMemo(() => [
    { value: "", label: t("filter.all_countries", lang), group: "popular" },
    ...availableCountries.map((code) => ({ value: code, label: countryLabel(code, lang, code) })),
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
        if (query && !matchesArtist(concert.artist.name, concert.artist.slug, query)) return false;
        if (visaFreeOnly && !isVisaFree(visa)) return false;
        if (directOnly && flight && !flight.direct) return false;
        if (directOnly && !flight) return false;
        if (countryFilter && concert.countryCode !== countryFilter) return false;
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
      const group = groupMap.get(slug)!;
      group.imageUrl ||= item.concert.artist.imageUrl;
      group.concerts.push(item);
    }
    for (const group of groupMap.values()) {
      group.concerts.sort((a, b) => a.concert.date.localeCompare(b.concert.date));
    }
    return Array.from(groupMap.values()).sort((a, b) =>
      compareArtistPopularity(a.slug, b.slug)
      || a.concerts[0].concert.date.localeCompare(b.concerts[0].concert.date)
      || a.artistName.localeCompare(b.artistName, lang),
    );
  }, [allConcerts, searchQuery, passport, originCity, visaFreeOnly, directOnly, countryFilter, lang]);

  const query = normalizeText(searchQuery);
  const externalArtistSlug = !loading && artistGroups.length === 0 && query
    && !allConcerts.some(({ artist }) => matchesArtist(artist.name, artist.slug, query))
    ? canonicalArtistSlug(searchQuery)
    : "";

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
      g.imageUrl ||= c.artist.imageUrl;
      g.count++;
    }
    return Array.from(map.values()).sort((a, b) => a.rank - b.rank).slice(0, 12);
  }, [allConcerts]);

  const effectiveDiscoverTab = discoverTab === "artists" && !loading && topArtists.length === 0
    ? "destinations"
    : discoverTab;

  const filterSummary = [
    passportOpts.find((option) => option.value === passport)?.label,
    cityOpts.find((option) => option.value === originCity)?.label,
    countryFilter ? countryLabel(countryFilter, lang) : "",
    visaFreeOnly ? t("filter.visa_free", lang) : "",
    directOnly ? t("filter.direct_flights", lang) : "",
  ].filter(Boolean).join(" · ");

  const feelingLucky = () => {
    // Случайный из топовых артистов (отсортированы по популярности)
    const pool = artistGroups.slice(0, 25);
    if (pool.length === 0) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    router.push(`/artist/${pick.slug}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-5 space-y-6 sm:py-7">
      <section className="relative rounded-[20px] border border-zinc-200 bg-zinc-50 px-4 py-5 sm:px-8 sm:py-7 dark:border-zinc-800 dark:bg-zinc-900">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] artist-search-glow" />
        <div className="relative">
          <div className="flex items-start justify-between gap-5">
            <div>
              <h1 className="max-w-3xl text-balance text-[clamp(2rem,5vw,3.6rem)] leading-[1.04] font-bold tracking-[-0.045em]">
                {t("home.title", lang)}
              </h1>
              <p className="mt-2.5 text-sm text-zinc-600 dark:text-zinc-300 sm:text-base">
                {t("home.subtitle", lang)}
              </p>
            </div>
            <ConcertMapLink lang={lang} inSearch />
          </div>
          <div className="mt-5 flex gap-2">
            <div className="relative min-w-0 flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                aria-label={t("search.placeholder", lang)}
                value={searchQuery}
                maxLength={200}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search.placeholder", lang)}
                className="rp-field min-h-12 w-full pl-12 pr-4 placeholder-zinc-500 dark:placeholder-zinc-400"
              />
            </div>
            <button
              onClick={feelingLucky}
              disabled={loading || artistGroups.length === 0}
              title={t("lucky.button", lang)}
              aria-label={t("lucky.button", lang)}
              className="rp-focus inline-flex min-h-12 min-w-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-orange-800 disabled:opacity-50 dark:bg-orange-400 dark:text-zinc-950 dark:hover:bg-orange-300"
            >
              <svg aria-hidden="true" className="size-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
                <path d="M8 8h.01m4 4h.01m4 4h.01" strokeWidth="2.8" />
              </svg>
              <span className="hidden sm:inline">{t("lucky.button", lang)}</span>
            </button>
          </div>

          <button
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="concert-filters"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="rp-focus mt-2.5 flex min-h-11 w-full items-center justify-between gap-2 rounded-xl px-1 text-left text-sm font-semibold sm:hidden"
          >
            {t("home.filters", lang)}
            <span className="truncate text-xs font-normal text-zinc-600 dark:text-zinc-400">
              {filterSummary}
            </span>
            <svg aria-hidden="true" viewBox="0 0 20 20" className={`size-4 shrink-0 transition-transform ${filtersOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 5 5 5-5" /></svg>
          </button>
          <div id="concert-filters" className={`${filtersOpen ? "grid" : "hidden"} mt-3 grid-cols-2 gap-3 border-t border-zinc-200 pt-3 sm:grid lg:grid-cols-[repeat(3,minmax(0,1fr))_auto] dark:border-zinc-700/75`}>
            <SearchableSelect label={t("filter.passport", lang)} options={passportOpts} value={passport}
              onChange={setPassport} searchPlaceholder={lang === "ru" ? "Поиск паспорта..." : "Search passport..."} />
            <SearchableSelect label={t("filter.origin_city", lang)} options={cityOpts} value={originCity}
              onChange={setOriginCity} searchPlaceholder={lang === "ru" ? "Поиск города..." : "Search city..."} />
            <SearchableSelect label={t("filter.country", lang)} options={countryOptions} value={countryFilter}
              onChange={setCountryFilter} searchPlaceholder={lang === "ru" ? "Поиск страны..." : "Search country..."} />
            <div className="flex flex-col justify-end gap-1 lg:gap-0">
              <label className="rp-filter-toggle">
                <input type="checkbox" checked={visaFreeOnly} onChange={(e) => setVisaFreeOnly(e.target.checked)} />
                <span>{t("filter.visa_free", lang)}</span>
              </label>
              <label className="rp-filter-toggle">
                <input type="checkbox" checked={directOnly} onChange={(e) => setDirectOnly(e.target.checked)} />
                <span>{t("filter.direct_flights", lang)}</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Открыть для себя: мировые звёзды / направления (один блок, переключатель) */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          {([
            ["artists", t("discover.artists", lang)],
            ["destinations", t("discover.destinations", lang)],
          ] as const).filter(([key]) => key !== "artists" || loading || topArtists.length > 0).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={effectiveDiscoverTab === key}
              onClick={() => setDiscoverTab(key)}
              className={`rp-focus min-h-10 px-3 py-1.5 rounded-[10px] text-sm font-semibold transition-colors ${
                effectiveDiscoverTab === key
                  ? "bg-orange-500/12 text-orange-800 dark:text-orange-300"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {effectiveDiscoverTab === "artists" ? (
          <div className="flex gap-4 overflow-x-auto px-1 py-2 -mx-1 scrollbar-hide">
            {loading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-[72px] flex flex-col items-center gap-2">
                    <div className="skeleton w-16 h-16 rounded-full" />
                    <div className="skeleton h-3 w-14 rounded" />
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
                  </a>
                ))}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {popularDestinations.map((dest) => (
              <button key={dest.city}
                onClick={() => setCountryFilter(countryFilter === dest.countryCode ? "" : dest.countryCode)}
                aria-pressed={countryFilter === dest.countryCode}
                className={`rp-focus inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border px-3.5 text-sm font-medium transition-colors ${
                  countryFilter === dest.countryCode
                    ? "bg-orange-500/20 border-orange-500 text-orange-600 dark:text-orange-400"
                    : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"
                }`}
              >
                <span aria-hidden="true" className="text-base leading-none">{dest.emoji}</span>
                {lang === "en" ? dest.cityEn : dest.city}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Список артистов */}
      <section>
        <h2 className="mb-3 text-xl font-semibold tracking-tight">
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
              <article key={group.slug}
                className="flex min-w-0 flex-col rounded-2xl border border-zinc-200 bg-white transition-colors hover:border-orange-500/50 dark:border-zinc-800 dark:bg-zinc-900">
                <Link href={`/artist/${group.slug}`}
                  className="artist-cover group relative isolate flex min-h-36 items-end justify-between gap-2 overflow-hidden rounded-t-[15px] p-4 text-white focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-400">
                  {group.imageUrl && (
                    <div className="artist-cover-photo absolute inset-y-0 right-0 -z-20 w-4/5">
                      <Image src={group.imageUrl} alt="" fill sizes="(min-width: 1024px) 320px, (min-width: 640px) 40vw, 80vw"
                        className="object-cover object-[50%_30%] motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
                        unoptimized onError={(event) => { event.currentTarget.hidden = true; }} />
                    </div>
                  )}
                  <span aria-hidden="true" className="artist-cover-shade absolute inset-0 -z-10" />
                  <div className="min-w-0">
                    <h3 className="text-balance text-[1.35rem] leading-tight font-bold tracking-tight transition-colors group-hover:text-orange-200">{group.artistName}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-200">
                      {group.concerts.length} {pluralizeI18n(group.concerts.length, lang, "концерт", "концерта", "концертов", "show", "shows")}
                      {hasVisaFree ? ` · ${t("visa.has_visa_free", lang)}` : ""}
                    </p>
                  </div>
                  <span aria-hidden="true" className="absolute right-3 top-3 grid size-8 place-items-center rounded-[10px] border border-white/25 bg-black/45 text-white transition-colors group-hover:bg-black/75">
                    <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 15 15 5M6 5h9v9" /></svg>
                  </span>
                </Link>

                <div className="flex-1 divide-y divide-zinc-100 px-3 py-1 dark:divide-zinc-800">
                  {preview.map(({ concert, visa, flight }) => (
                    <Link key={concert.id} href={`/concert/${concert.id}`}
                      className="group flex min-h-16 items-center gap-3 rounded-lg px-2 py-2 hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-orange-500 dark:hover:bg-zinc-800/50">
                      <span className="w-[4.25rem] shrink-0 text-xs leading-snug font-semibold tabular-nums text-orange-800 dark:text-orange-300">
                        {formatConcertDate(concert, lang)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold group-hover:text-orange-700 dark:group-hover:text-orange-400">
                          {concertLocation(concert, lang)}
                        </p>
                        {(concert.venue || concert.time) && (
                          <p className="truncate text-xs text-zinc-600 dark:text-zinc-400">
                            {[concert.venue, concert.time?.slice(0, 5)].filter(Boolean).join(" · ")}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            visa === "visa_free" ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300"
                              : (visa === "evisa" || visa === "eta") ? "bg-amber-500/15 text-amber-900 dark:text-amber-300"
                              : visa === "visa_on_arrival" ? "bg-lime-500/15 text-lime-800 dark:text-lime-300"
                              : visa === "unknown" ? "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300"
                              : "bg-red-500/10 text-red-800 dark:text-red-300"
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
                    </Link>
                  ))}
                </div>

                {remaining > 0 && (
                  <a href={`/artist/${group.slug}`}
                    className="block text-center text-xs text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 py-2.5 border-t border-zinc-200 dark:border-zinc-800 transition-colors">
                    {t("nav.more", lang)} {remaining} {pluralizeI18n(remaining, lang, "концерт", "концерта", "концертов", "concert", "concerts")} →
                  </a>
                )}
              </article>
            );
          })}
        </div>

        {!loading && artistGroups.length === 0 && (
          <div className="space-y-3 py-12 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {catalogError
                ? t("empty.catalog_unavailable", lang)
                : externalArtistSlug
                  ? t("empty.artist_not_in_catalog", lang)
                  : t("empty.no_concerts", lang)}
            </p>
            {externalArtistSlug && (
              <Link href={`/artist/${encodeURIComponent(externalArtistSlug)}`} prefetch={false}
                className="rp-focus inline-flex min-h-11 items-center rounded-xl border border-orange-500/35 bg-orange-500/10 px-4 text-sm font-semibold text-orange-800 transition-colors hover:bg-orange-500/20 dark:text-orange-300">
                {t("search.try_ticketmaster", lang)}
              </Link>
            )}
          </div>
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
