"use client";

import { useSettings } from "@/components/SettingsContext";
import { t } from "@/lib/i18n";
import type { Lang, Currency } from "@/lib/i18n";

export default function Header() {
  const { lang, setLang, currency, setCurrency } = useSettings();

  return (
    <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="text-xl font-bold tracking-tight hover:opacity-90 transition-opacity">
            Rave<span className="text-orange-500">Pass</span>
          </a>
          <span className="text-xs text-zinc-500 hidden sm:inline">{t("header.subtitle", lang)}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Переключатель языка */}
          <div className="flex bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden">
            {(["ru", "en"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                  lang === l
                    ? "bg-orange-500 text-white"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {l === "ru" ? "RU" : "EN"}
              </button>
            ))}
          </div>

          {/* Переключатель валюты */}
          <div className="flex bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden">
            {(["RUB", "USD", "EUR"] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                  currency === c
                    ? "bg-orange-500 text-white"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {c === "RUB" ? "₽" : c === "USD" ? "$" : "€"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
