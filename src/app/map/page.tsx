"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Feature, Geometry } from "geojson";
import type { Topology } from "topojson-specification";
import { mockConcerts } from "@/data/concerts";
import { getVisaStatus, countryNames } from "@/data/visas";
import SearchableSelect from "@/components/SearchableSelect";
import { useSettings } from "@/components/SettingsContext";
import { t, pluralizeI18n } from "@/lib/i18n";
import { getPassportOptions } from "@/data/passports";
import type { Concert, VisaStatus } from "@/types";

const MAP_W = 980;
const MAP_H = 500;

// ISO 3166-1 numeric → alpha-2 (world-atlas использует числовые ID)
const numericToAlpha2: Record<number, string> = {
  4: "AF", 8: "AL", 12: "DZ", 20: "AD", 24: "AO", 31: "AZ", 32: "AR", 36: "AU",
  40: "AT", 44: "BS", 48: "BH", 50: "BD", 51: "AM", 56: "BE", 64: "BT", 68: "BO",
  70: "BA", 72: "BW", 76: "BR", 84: "BZ", 90: "SB", 96: "BN", 100: "BG", 104: "MM",
  108: "BI", 112: "BY", 116: "KH", 120: "CM", 124: "CA", 140: "CF", 144: "LK",
  148: "TD", 152: "CL", 156: "CN", 158: "TW", 170: "CO", 178: "CG", 180: "CD",
  188: "CR", 191: "HR", 192: "CU", 196: "CY", 203: "CZ", 208: "DK", 214: "DO",
  218: "EC", 222: "SV", 226: "GQ", 231: "ET", 232: "ER", 233: "EE", 242: "FJ",
  246: "FI", 250: "FR", 266: "GA", 268: "GE", 270: "GM", 276: "DE", 288: "GH",
  300: "GR", 304: "GL", 320: "GT", 324: "GN", 328: "GY", 332: "HT", 340: "HN",
  348: "HU", 352: "IS", 356: "IN", 360: "ID", 364: "IR", 368: "IQ", 372: "IE",
  376: "IL", 380: "IT", 384: "CI", 388: "JM", 392: "JP", 398: "KZ", 400: "JO",
  404: "KE", 408: "KP", 410: "KR", 414: "KW", 417: "KG", 418: "LA", 422: "LB",
  426: "LS", 428: "LV", 430: "LR", 434: "LY", 440: "LT", 442: "LU", 450: "MG",
  454: "MW", 458: "MY", 466: "ML", 478: "MR", 484: "MX", 496: "MN", 498: "MD",
  499: "ME", 504: "MA", 508: "MZ", 512: "OM", 516: "NA", 524: "NP", 528: "NL",
  540: "NC", 548: "VU", 554: "NZ", 558: "NI", 562: "NE", 566: "NG", 578: "NO",
  586: "PK", 591: "PA", 598: "PG", 600: "PY", 604: "PE", 608: "PH", 616: "PL",
  620: "PT", 624: "GW", 626: "TL", 630: "PR", 634: "QA", 642: "RO", 643: "RU",
  646: "RW", 682: "SA", 686: "SN", 688: "RS", 694: "SL", 702: "SG", 703: "SK",
  704: "VN", 705: "SI", 706: "SO", 710: "ZA", 716: "ZW", 724: "ES", 728: "SS",
  729: "SD", 740: "SR", 748: "SZ", 752: "SE", 756: "CH", 760: "SY", 762: "TJ",
  764: "TH", 768: "TG", 780: "TT", 784: "AE", 788: "TN", 792: "TR", 795: "TM",
  800: "UG", 804: "UA", 807: "MK", 818: "EG", 826: "GB", 834: "TZ", 840: "US",
  854: "BF", 858: "UY", 860: "UZ", 862: "VE", 887: "YE", 894: "ZM",
};

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
  const [hovered, setHovered] = useState<{ a2: string; name: string; x: number; y: number } | null>(null);
  const [tf, setTf] = useState({ k: 1, x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tfRef = useRef(tf);
  tfRef.current = tf;
  const dragRef = useRef<{ startX: number; startY: number; tx: number; ty: number; moved: boolean } | null>(null);

  const passportOpts = getPassportOptions(lang);

  // Загружаем географию и концерты параллельно
  useEffect(() => {
    Promise.all([
      fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
        .then((res) => res.json())
        .then((topo: Topology) => {
          const fc = feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry, { name?: string }>;
          // Антарктида не нужна
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

  // Статистика по странам: количество концертов + ближайшие артисты
  const countryStats = useMemo(() => {
    const map = new Map<string, CountryStats>();
    const sorted = [...concerts].sort((a, b) => a.date.localeCompare(b.date));
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
  }, [concerts]);

  // Зум колёсиком (non-passive, чтобы блокировать скролл страницы)
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      // Координаты курсора в системе viewBox
      const px = ((e.clientX - rect.left) / rect.width) * MAP_W;
      const py = ((e.clientY - rect.top) / rect.height) * MAP_H;
      const { k, x, y } = tfRef.current;
      const factor = e.deltaY < 0 ? 1.25 : 0.8;
      const nk = Math.min(12, Math.max(1, k * factor));
      // Зумим к точке под курсором
      const nx = px - ((px - x) * nk) / k;
      const ny = py - ((py - y) * nk) / k;
      setTf(nk === 1 ? { k: 1, x: 0, y: 0 } : { k: nk, x: nx, y: ny });
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const { x, y } = tfRef.current;
    dragRef.current = { startX: e.clientX, startY: e.clientY, tx: x, ty: y, moved: false };
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
    if (Math.abs(dx) + Math.abs(dy) > 2) drag.moved = true;
    setTf({ k: tfRef.current.k, x: drag.tx + dx, y: drag.ty + dy });
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  const handleHover = (e: React.MouseEvent, a2: string, fallbackName: string) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const name = lang === "ru" ? (countryNames[a2] ?? fallbackName) : fallbackName;
    setHovered({
      a2,
      name,
      x: Math.min(e.clientX - rect.left + 12, rect.width - 230),
      y: Math.min(e.clientY - rect.top + 12, rect.height - 120),
    });
  };

  const zoomBy = (factor: number) => {
    const { k, x, y } = tfRef.current;
    const nk = Math.min(12, Math.max(1, k * factor));
    if (nk === 1) {
      setTf({ k: 1, x: 0, y: 0 });
      return;
    }
    // Зумим к центру
    const cx = MAP_W / 2;
    const cy = MAP_H / 2;
    setTf({ k: nk, x: cx - ((cx - x) * nk) / k, y: cy - ((cy - y) * nk) / k });
  };

  const hoveredStats = hovered ? countryStats.get(hovered.a2) : null;
  const hoveredVisa = hovered ? getVisaStatus(hovered.a2, passport) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("map.title", lang)}</h1>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1 max-w-xl">{t("map.subtitle", lang)}</p>
        </div>
        <div className="w-full sm:w-64">
          <SearchableSelect
            label={t("filter.passport", lang)}
            options={passportOpts}
            value={passport}
            onChange={setPassport}
            searchPlaceholder={lang === "ru" ? "Поиск паспорта..." : "Search passport..."}
          />
        </div>
      </div>

      {/* Легенда */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
        {(Object.keys(visaColors) as VisaStatus[]).map((status) => (
          <span key={status} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: visaColors[status] }} />
            {t(`visa.${status}` as Parameters<typeof t>[0], lang)}
          </span>
        ))}
        <span className="text-zinc-400 dark:text-zinc-500 ml-auto hidden sm:inline">{t("map.hint", lang)}</span>
      </div>

      {/* Карта */}
      <div
        ref={containerRef}
        className="relative bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden select-none"
      >
        {loading ? (
          <div className="flex justify-center items-center" style={{ aspectRatio: `${MAP_W}/${MAP_H}` }}>
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 dark:border-zinc-600 border-t-orange-500" />
          </div>
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
                const a2 = numericToAlpha2[Number(f.id)];
                const stats = a2 ? countryStats.get(a2) : undefined;
                const visa = a2 ? getVisaStatus(a2, passport) : "visa_required";
                const isHome = a2 === passport;
                const isHovered = hovered?.a2 === a2;
                const d = path(f) ?? "";
                return (
                  <path
                    key={`${f.id}-${i}`}
                    d={d}
                    fill={isHome ? "#71717a" : visaColors[visa]}
                    fillOpacity={isHome ? 0.5 : isHovered ? 0.95 : stats ? 0.8 : 0.18}
                    strokeWidth={0.5 / tf.k}
                    className="stroke-white dark:stroke-zinc-950 transition-[fill-opacity] duration-100"
                    onMouseMove={a2 ? (e) => handleHover(e, a2, f.properties?.name ?? a2) : undefined}
                    onMouseLeave={() => setHovered(null)}
                  />
                );
              })}

              {/* Количество концертов */}
              {features.map((f, i) => {
                const a2 = numericToAlpha2[Number(f.id)];
                const stats = a2 ? countryStats.get(a2) : undefined;
                if (!stats) return null;
                const [cx, cy] = path.centroid(f);
                if (!isFinite(cx) || !isFinite(cy)) return null;
                const r = 9 / tf.k;
                return (
                  <g key={`badge-${f.id}-${i}`} pointerEvents="none">
                    <circle cx={cx} cy={cy} r={r} className="fill-zinc-900 dark:fill-zinc-100" fillOpacity={0.9} />
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={stats.count > 99 ? 7 / tf.k : 9 / tf.k}
                      fontWeight={600}
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
            <button
              onClick={() => zoomBy(1.5)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors font-semibold"
            >
              +
            </button>
            <button
              onClick={() => zoomBy(1 / 1.5)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors font-semibold"
            >
              −
            </button>
            {tf.k > 1 && (
              <button
                onClick={() => setTf({ k: 1, x: 0, y: 0 })}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-xs"
                title={t("map.reset", lang)}
              >
                ⟲
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
