"use client";

import { useSettings } from "@/components/SettingsContext";
import { t } from "@/lib/i18n";
import type { Lang, Currency } from "@/lib/i18n";

export default function Header() {
  const { lang, setLang, currency, setCurrency, theme, setTheme } = useSettings();

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="text-xl font-bold tracking-tight hover:opacity-90 transition-opacity">
            Rave<span className="text-orange-500">Pass</span>
          </a>
          <span className="text-xs text-zinc-400 dark:text-zinc-500 hidden sm:inline">{t("header.subtitle", lang)}</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Тема */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? (
              <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Язык */}
          <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            {(["ru", "en"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 sm:px-2.5 py-1 text-xs font-medium transition-colors ${
                  lang === l
                    ? "bg-orange-500 text-white"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                }`}
              >
                {l === "ru" ? "RU" : "EN"}
              </button>
            ))}
          </div>

          {/* Валюта */}
          <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            {(["RUB", "USD", "EUR"] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-2 sm:px-2.5 py-1 text-xs font-medium transition-colors ${
                  currency === c
                    ? "bg-orange-500 text-white"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
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
