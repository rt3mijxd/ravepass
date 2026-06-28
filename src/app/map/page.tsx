"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Feature, Geometry } from "geojson";
import type { Topology } from "topojson-specification";
import { mockConcerts } from "@/data/concerts";
import { getVisaStatus, isVisaFree, countryNames } from "@/data/visas";
import { findFlightRoute } from "@/data/flights";
import { numericToAlpha2, WORLD_ATLAS_URL } from "@/lib/geo";
import SearchableSelect from "@/components/SearchableSelect";
import { useSettings } from "@/components/SettingsContext";
import { t, pluralizeI18n } from "@/lib/i18n";
import { getPassportOptions } from "@/data/passports";
import { getCityOptions } from "@/data/cities";
import type { Concert, VisaStatus } from "@/types";

const MAP_W = 980;
const MAP_H = 500;

const visaColors: Record<VisaStatus, string> = {
  visa_free: "#10b981",      // emerald
  visa_on_arrival: "#84cc16", // lime
  evisa: "#f59e0b",          // amber
  visa_required: "#ef4444",  // red
};

interface CountryStats {
  count: number;
  artists: string[];
}

type CountryFeature = Feature<Geometry, { name?: string }>;

export default function MapPage() {
  const { lang } = useSettings();
  const [features, setFeatures] = useState<CountryFeature[]>([]);
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [passport, setPassport] = useState("RU");
  const [originCity, setOriginCity] = useState("MOW");
  const [visaFreeOnly, setVisaFreeOnly] = useState(false);
  const [directOnly, setDirectOnly] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<{ id: string; a2: string; name: string; x: number; y: number } | null>(null);
  const [tf, setTf] = useState({ k: 1, x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tfRef = useRef(tf);
  tfRef.current = tf;
  const dragRef = useRef<{ startX: number; startY: number; tx: number; ty: number } | null>(null);
  const movedRef = useRef(false);

  const passportOpts = getPassportOptions(lang);
  const cityOpts = getCityOptions(lang);

  // Загружаем географию и концерты параллельно
  useEffect(() => {
    Promise.all([
      fetch(WORLD_ATLAS_URL)
        .then((res) => res.json())
        .then((topo: Topology) => {
          const fc = feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry, { name?: string }>;
          setFeatures(fc.features.filter((f) => Number(f.id) !== 10));
        }),
      fetch("/api/concerts")
        .then((res) => res.json())
        .then((data: Concert[]) => {
          setConcerts(Array.isArray(data) && data.length > 0 ? data : mockConcerts);
        })
        .catch(() => setConcerts(mockConcerts)),
    ])
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const projection = useMemo(
    () => geoNaturalEarth1().fitExtent([[2, 2], [MAP_W - 2, MAP_H - 2]], { type: "Sphere" }),
    [],
  );
  const path = useMemo(() => geoPath(projection), [projection]);

  // Концерты с учётом фильтров «без визы» и «прямые рейсы»
  const visibleConcerts = useMemo(() => {
    return concerts.filter((c) => {
      if (visaFreeOnly && !isVisaFree(getVisaStatus(c.countryCode, passport))) return false;
      if (directOnly) {
        const f = findFlightRoute(originCity, c.city);
        if (!f || !f.direct) return false;
      }
      return true;
    });
  }, [concerts, visaFreeOnly, directOnly, passport, originCity]);

  // Статистика по странам: количество концертов + ближайшие артисты
  const activeStats = useMemo(() => {
    const map = new Map<string, CountryStats>();
    const sorted = [...visibleConcerts].sort((a, b) => a.date.localeCompare(b.date));
    for (const c of sorted) {
      if (!c.countryCode) continue;
      let stats = map.get(c.countryCode);
      if (!stats) {
        stats = { count: 0, artists: [] };
        map.set(c.countryCode, stats);
      }
      stats.count++;
      if (!stats.artists.includes(c.artist.name)) {
        stats.artists.push(c.artist.name);
      }
    }
    return map;
  }, [visibleConcerts]);

  // Концерты выбранной страны, сгруппированные по артистам, отсортированные по популярности
  const selectedGroups = useMemo(() => {
    if (!selected) return [];
    const inCountry = visibleConcerts
      .filter((c) => c.countryCode === selected)
      .sort((a, b) => a.date.localeCompare(b.date));
    const map = new Map<string, { name: string; slug: string; imageUrl: string; concerts: Concert[] }>();
    for (const c of inCountry) {
      let g = map.get(c.artist.slug);
      if (!g) { g = { name: c.artist.name, slug: c.artist.slug, imageUrl: c.artist.imageUrl, concerts: [] }; map.set(c.artist.slug, g); }
      g.concerts.push(c);
    }
    // Сортировка по числу концертов (популярность) убыванию
    return Array.from(map.values()).sort((a, b) => b.concerts.length - a.concerts.length);
  }, [visibleConcerts, selected]);

  // Зум колёсиком (non-passive, чтобы блокировать скролл страницы)
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * MAP_W;
      const py = ((e.clientY - rect.top) / rect.height) * MAP_H;
      const { k, x, y } = tfRef.current;
      const factor = e.deltaY < 0 ? 1.25 : 0.8;
      const nk = Math.min(12, Math.max(1, k * factor));
      const nx = px - ((px - x) * nk) / k;
      const ny = py - ((py - y) * nk) / k;
      setTf(nk === 1 ? { k: 1, x: 0, y: 0 } : { k: nk, x: nx, y: ny });
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const { x, y } = tfRef.current;
    dragRef.current = { startX: e.clientX, startY: e.clientY, tx: x, ty: y };
    movedRef.current = false;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const dx = ((e.clientX - drag.startX) / rect.width) * MAP_W;
    const dy = ((e.clientY - drag.startY) / rect.height) * MAP_H;
    if (Math.abs(e.clientX - drag.startX) + Math.abs(e.clientY - drag.startY) > 4) movedRef.current = true;
    setTf({ k: tfRef.current.k, x: drag.tx + dx, y: drag.ty + dy });
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  const handleHover = (e: React.MouseEvent, id: string, a2: string, fallbackName: string) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const name = (lang === "ru" && a2 && countryNames[a2]) ? countryNames[a2] : fallbackName;
    setHovered({
      id, a2, name,
      x: Math.min(e.clientX - rect.left + 12, rect.width - 230),
      y: Math.min(e.clientY - rect.top + 12, rect.height - 120),
    });
  };

  // Зум к стране + выбор её для списка концертов
  const selectCountry = (f: CountryFeature, a2: string) => {
    if (!a2 || !activeStats.get(a2)) return;
    const [[x0, y0], [x1, y1]] = path.bounds(f);
    const w = Math.max(x1 - x0, 1);
    const h = Math.max(y1 - y0, 1);
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    const k = Math.max(1, Math.min(8, 0.55 * Math.min(MAP_W / w, MAP_H / h)));
    setTf({ k, x: MAP_W / 2 - cx * k, y: MAP_H / 2 - cy * k });
    setSelected(a2);
    setHovered(null);
    requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  };

  const zoomBy = (factor: number) => {
    const { k, x, y } = tfRef.current;
    const nk = Math.min(12, Math.max(1, k * factor));
    if (nk === 1) { setTf({ k: 1, x: 0, y: 0 }); return; }
    const cx = MAP_W / 2;
    const cy = MAP_H / 2;
    setTf({ k: nk, x: cx - ((cx - x) * nk) / k, y: cy - ((cy - y) * nk) / k });
  };

  const resetView = () => { setTf({ k: 1, x: 0, y: 0 }); setSelected(null); };

  const hoveredStats = hovered?.a2 ? activeStats.get(hovered.a2) : null;
  const hoveredVisa = hovered?.a2 ? getVisaStatus(hovered.a2, passport) : null;
  const selectedName = selected ? (lang === "ru" ? (countryNames[selected] ?? selected) : selected) : "";

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
      {/* Назад */}
      <a href="/" className="inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 transition-colors">
        {t("nav.back_home", lang)}
      </a>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("map.title", lang)}</h1>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1 max-w-xl">{t("map.subtitle", lang)}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full sm:w-[34rem]">
          <SearchableSelect
            label={t("filter.passport", lang)}
            options={passportOpts}
            value={passport}
            onChange={setPassport}
            searchPlaceholder={lang === "ru" ? "Поиск паспорта..." : "Search passport..."}
          />
          <SearchableSelect
            label={t("filter.origin_city", lang)}
            options={cityOpts}
            value={originCity}
            onChange={setOriginCity}
            searchPlaceholder={lang === "ru" ? "Поиск города..." : "Search city..."}
          />
        </div>
      </div>

      {/* Легенда + фильтры */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        {(Object.keys(visaColors) as VisaStatus[]).map((status) => (
          <span key={status} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: visaColors[status] }} />
            {t(`visa.${status}` as Parameters<typeof t>[0], lang)}
          </span>
        ))}
        <div className="flex items-center gap-4 ml-auto">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div className="relative">
              <input type="checkbox" checked={visaFreeOnly} onChange={(e) => setVisaFreeOnly(e.target.checked)} className="sr-only peer" />
              <div className="w-8 h-5 bg-zinc-300 dark:bg-zinc-700 rounded-full peer-checked:bg-orange-500 transition-colors" />
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-3 transition-transform" />
            </div>
            {t("map.visa_free_only", lang)}
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div className="relative">
              <input type="checkbox" checked={directOnly} onChange={(e) => setDirectOnly(e.target.checked)} className="sr-only peer" />
              <div className="w-8 h-5 bg-zinc-300 dark:bg-zinc-700 rounded-full peer-checked:bg-orange-500 transition-colors" />
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-3 transition-transform" />
            </div>
            {t("filter.direct_flights", lang)}
          </label>
        </div>
      </div>

      {/* Карта */}
      <div
        ref={containerRef}
        className="relative bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden select-none"
      >
        {loading ? (
          <div className="skeleton w-full" style={{ aspectRatio: `${MAP_W}/${MAP_H}` }} />
        ) : (
          <svg
            ref={svgRef}
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            className="w-full h-auto cursor-grab active:cursor-grabbing touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={() => { handlePointerUp(); setHovered(null); }}
          >
            <g transform={`translate(${tf.x},${tf.y}) scale(${tf.k})`}>
              {features.map((f, i) => {
                const fid = `${f.id}-${i}`;
                const a2 = numericToAlpha2[Number(f.id)] ?? "";
                const stats = a2 ? activeStats.get(a2) : undefined;
                const isHome = !!a2 && a2 === passport;
                const isHovered = hovered?.id === fid;
                const isSelected = !!a2 && a2 === selected;
                const dimmed = visaFreeOnly && !!a2 && !isVisaFree(getVisaStatus(a2, passport));
                const name = f.properties?.name ?? a2 ?? "";
                const d = path(f) ?? "";
                const fill = isHome ? "#71717a" : a2 ? visaColors[getVisaStatus(a2, passport)] : "#52525b";
                const opacity = isHome ? 0.5 : dimmed ? 0.07 : isSelected ? 1 : isHovered ? 0.95 : stats ? 0.82 : a2 ? 0.18 : 0.1;
                return (
                  <path
                    key={fid}
                    d={d}
                    fill={fill}
                    fillOpacity={opacity}
                    strokeWidth={(isSelected ? 1.4 : 0.5) / tf.k}
                    className={`${isSelected ? "stroke-zinc-900 dark:stroke-white" : "stroke-white dark:stroke-zinc-950"} transition-[fill-opacity] duration-100 ${stats ? "cursor-pointer" : ""}`}
                    onMouseMove={(e) => handleHover(e, fid, a2, name)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => { if (movedRef.current) return; selectCountry(f, a2); }}
                  />
                );
              })}

              {/* Количество концертов */}
              {features.map((f, i) => {
                const a2 = numericToAlpha2[Number(f.id)];
                const stats = a2 ? activeStats.get(a2) : undefined;
                if (!stats) return null;
                const [cx, cy] = path.centroid(f);
                if (!isFinite(cx) || !isFinite(cy)) return null;
                const r = 9 / tf.k;
                return (
                  <g key={`badge-${f.id}-${i}`} pointerEvents="none">
                    <circle cx={cx} cy={cy} r={r} className="fill-zinc-900 dark:fill-zinc-100" fillOpacity={0.9} />
                    <text
                      x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
                      fontSize={stats.count > 99 ? 7 / tf.k : 9 / tf.k} fontWeight={600}
                      className="fill-white dark:fill-zinc-900"
                    >
                      {stats.count}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        )}

        {/* Подсказка про клик */}
        {!loading && !selected && (
          <div className="absolute top-3 left-3 text-xs text-zinc-500 dark:text-zinc-400 bg-white/80 dark:bg-zinc-800/80 backdrop-blur rounded-lg px-2.5 py-1 pointer-events-none">
            {t("map.click_hint", lang)}
          </div>
        )}

        {/* Тултип */}
        {hovered && (
          <div
            className="absolute z-10 w-56 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-lg p-3 pointer-events-none"
            style={{ left: hovered.x, top: hovered.y }}
          >
            <p className="font-semibold text-sm">{hovered.name}</p>
            {hoveredVisa && (
              <p className="text-xs mt-0.5" style={{ color: visaColors[hoveredVisa] }}>
                {t(`visa.${hoveredVisa}` as Parameters<typeof t>[0], lang)}
              </p>
            )}
            {hoveredStats ? (
              <>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
                  {hoveredStats.count}{" "}
                  {pluralizeI18n(hoveredStats.count, lang, "концерт", "концерта", "концертов", "concert", "concerts")}
                  {" · "}{t("map.soon", lang)}:
                </p>
                <p className="text-xs mt-0.5 leading-relaxed">
                  {hoveredStats.artists.slice(0, 6).join(", ")}
                  {hoveredStats.artists.length > 6 && ` +${hoveredStats.artists.length - 6}`}
                </p>
              </>
            ) : (
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1.5">{t("map.no_concerts", lang)}</p>
            )}
          </div>
        )}

        {/* Кнопки зума */}
        {!loading && (
          <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
            <button onClick={() => zoomBy(1.5)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors font-semibold">+</button>
            <button onClick={() => zoomBy(1 / 1.5)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors font-semibold">−</button>
            {(tf.k > 1 || selected) && (
              <button onClick={resetView} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-xs" title={t("map.reset", lang)}>⟲</button>
            )}
          </div>
        )}
      </div>

      {/* Список концертов выбранной страны */}
      {selected && (
        <div ref={panelRef} className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">
              {t("map.concerts_in", lang)} {selectedName}
              <span className="text-zinc-500 font-normal text-sm ml-2">
                ({selectedGroups.reduce((s, g) => s + g.concerts.length, 0)})
              </span>
            </h2>
            <button onClick={() => setSelected(null)} className="text-sm text-zinc-500 hover:text-orange-500 transition-colors">
              {t("map.close", lang)} ✕
            </button>
          </div>

          {selectedGroups.length === 0 ? (
            <p className="text-sm text-zinc-400 dark:text-zinc-500">{t("map.no_concerts", lang)}</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {selectedGroups.map((g) => {
                const preview = g.concerts.slice(0, 3);
                const remaining = g.concerts.length - preview.length;
                return (
                  <div key={g.slug} className="bg-white dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
                    <a href={`/artist/${g.slug}`} className="flex items-center gap-2.5 group">
                      {g.imageUrl ? (
                        <Image src={g.imageUrl} alt={g.name} width={40} height={40}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0" unoptimized />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-700 flex-shrink-0 flex items-center justify-center text-zinc-400 dark:text-zinc-500">♪</div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate group-hover:text-orange-500 transition-colors">{g.name}</p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          {g.concerts.length} {pluralizeI18n(g.concerts.length, lang, "концерт", "концерта", "концертов", "concert", "concerts")}
                        </p>
                      </div>
                    </a>
                    <div className="mt-2 space-y-1">
                      {preview.map((c) => (
                        <a key={c.id} href={`/concert/${c.id}`} className="flex justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                          <span className="truncate">{c.city}</span>
                          <span className="flex-shrink-0">
                            {new Date(c.date + "T12:00:00").toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", { day: "numeric", month: "short" })}
                          </span>
                        </a>
                      ))}
                    </div>
                    {remaining > 0 && (
                      <a href={`/artist/${g.slug}`} className="block mt-1.5 text-[11px] text-orange-500 dark:text-orange-400 hover:text-orange-600 transition-colors">
                        {t("nav.more", lang)} {remaining} {pluralizeI18n(remaining, lang, "концерт", "концерта", "концертов", "concert", "concerts")} →
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
