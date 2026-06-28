"use client";

import { useEffect, useMemo, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Feature, Geometry } from "geojson";
import type { Topology } from "topojson-specification";
import { numericToAlpha2, WORLD_ATLAS_URL } from "@/lib/geo";
import { countryNames } from "@/data/visas";
import { t, pluralizeI18n } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

const W = 460;
const H = 230;

type CountryFeature = Feature<Geometry, { name?: string }>;

/**
 * Мини-карта мира на странице артиста: подсвечивает страны,
 * где у артиста есть концерты, и показывает их количество.
 */
export default function ArtistMiniMap({ countryCodes, lang }: { countryCodes: string[]; lang: Lang }) {
  const [features, setFeatures] = useState<CountryFeature[]>([]);
  const active = useMemo(() => new Set(countryCodes.filter(Boolean)), [countryCodes]);

  useEffect(() => {
    let cancelled = false;
    fetch(WORLD_ATLAS_URL)
      .then((res) => res.json())
      .then((topo: Topology) => {
        if (cancelled) return;
        const fc = feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry, { name?: string }>;
        setFeatures(fc.features.filter((f) => Number(f.id) !== 10));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const path = useMemo(() => {
    const projection = geoNaturalEarth1().fitExtent([[2, 2], [W - 2, H - 2]], { type: "Sphere" });
    return geoPath(projection);
  }, []);

  if (active.size === 0) return null;

  // Названия стран для подписи под картой
  const names = countryCodes
    .filter(Boolean)
    .map((c) => (lang === "ru" ? (countryNames[c] ?? c) : c))
    .filter((v, i, arr) => arr.indexOf(v) === i);

  return (
    <section className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 className="font-semibold text-sm">{t("minimap.countries", lang)}</h2>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {active.size} {pluralizeI18n(active.size, lang, "страна", "страны", "стран", "country", "countries")}
        </span>
      </div>

      {features.length === 0 ? (
        <div className="skeleton w-full rounded-lg" style={{ aspectRatio: `${W}/${H}` }} />
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          {features.map((f, i) => {
            const a2 = numericToAlpha2[Number(f.id)];
            const isActive = !!a2 && active.has(a2);
            return (
              <path
                key={`${f.id}-${i}`}
                d={path(f) ?? ""}
                fill={isActive ? "#f97316" : "#a1a1aa"}
                fillOpacity={isActive ? 1 : 0.14}
                strokeWidth={0.4}
                className="stroke-white dark:stroke-zinc-950"
              />
            );
          })}
        </svg>
      )}

      {names.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {names.map((n) => (
            <span key={n} className="text-xs px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-600 dark:text-orange-400">
              {n}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
