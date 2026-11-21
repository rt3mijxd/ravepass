import type { Lang } from "@/lib/i18n";

const labels = {
  ru: new Intl.DisplayNames("ru", { type: "region", fallback: "none" }),
  en: new Intl.DisplayNames("en", { type: "region", fallback: "none" }),
};

export function countryLabel(code: string, lang: Lang, fallback = ""): string {
  const region = code.trim().toUpperCase().replace(/^UK$/, "GB");
  const isRegion = /^[A-Z]{2}$/.test(region);
  const localized = isRegion ? labels[lang].of(region) : undefined;
  if (localized) return localized;
  if (lang === "en" && /\p{Script=Cyrillic}/u.test(fallback)) return isRegion ? region : "";
  return fallback || (isRegion ? region : "");
}

export function concertLocation(
  concert: { city: string; countryCode: string; country: string },
  lang: Lang,
): string {
  return [concert.city, countryLabel(concert.countryCode, lang, concert.country)]
    .filter(Boolean)
    .join(", ");
}
