import type { Currency, Lang } from "@/lib/i18n";

export interface PriceQuotes {
  rates: Record<string, number>;
  date: string;
}

export interface Money {
  amount: number;
  currency: string;
}

export function displayMoney(amount: number | null | undefined, from: string | undefined, preferred: Currency, quotes: PriceQuotes | null): Money | null {
  if (amount == null || !Number.isFinite(amount) || amount < 0 || !from || !/^[A-Z]{3}$/.test(from)) return null;
  const fromRate = quotes?.rates[from];
  const toRate = quotes?.rates[preferred];
  if (from !== preferred && fromRate && toRate) {
    return { amount: amount / fromRate * toRate, currency: preferred };
  }
  return { amount, currency: from };
}

export function formatMoney(price: Money, lang: Lang): string {
  const currencyDisplay = ["RUB", "USD", "EUR"].includes(price.currency) ? "symbol" : "code";
  return new Intl.NumberFormat(lang, {
    style: "currency",
    currency: price.currency,
    currencyDisplay,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price.amount);
}

export function formatPriceRange(min: Money, max: Money | null, lang: Lang): string {
  const first = formatMoney(min, lang);
  if (!max || max.amount <= min.amount) return first;
  const last = formatMoney(max, lang);
  return first === last ? first : `${first} – ${last}`;
}
