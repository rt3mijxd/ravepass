"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Lang, Currency } from "@/lib/i18n";
import { allPassports } from "@/data/passports";
import { allCities } from "@/data/cities";

export type Theme = "dark" | "light";

interface SettingsContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  passport: string;
  setPassport: (passport: string) => void;
  originCity: string;
  setOriginCity: (originCity: string) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  lang: "ru",
  setLang: () => {},
  currency: "RUB",
  setCurrency: () => {},
  passport: "RU",
  setPassport: () => {},
  originCity: "MOW",
  setOriginCity: () => {},
  theme: "dark",
  setTheme: () => {},
});

export function useSettings() {
  return useContext(SettingsContext);
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");
  const [currency, setCurrencyState] = useState<Currency>("RUB");
  const [passport, setPassportState] = useState("RU");
  const [originCity, setOriginCityState] = useState("MOW");
  const [theme, setThemeState] = useState<Theme>("dark");

  // Загружаем из localStorage при монтировании
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      let savedLang: string | null = null;
      let savedCurrency: string | null = null;
      let savedTheme: string | null = null;
      let savedPassport: string | null = null;
      let savedOrigin: string | null = null;
      try {
        savedLang = localStorage.getItem("ravepass_lang");
        savedCurrency = localStorage.getItem("ravepass_currency");
        savedTheme = localStorage.getItem("ravepass_theme");
        savedPassport = localStorage.getItem("ravepass_passport");
        savedOrigin = localStorage.getItem("ravepass_origin");
      } catch {}

      const russianLocales = ["ru", "uk", "be", "kk", "uz", "ky", "az", "hy", "ka", "tg", "tk", "mo"];
      const prefersRussian = russianLocales.includes(navigator.language.toLowerCase().split("-")[0]);
      setLangState(savedLang === "ru" || savedLang === "en" ? savedLang : prefersRussian ? "ru" : "en");
      setCurrencyState(savedCurrency === "RUB" || savedCurrency === "USD" || savedCurrency === "EUR"
        ? savedCurrency
        : prefersRussian ? "RUB" : "USD");
      if (savedPassport && allPassports.some(({ code }) => code === savedPassport)) setPassportState(savedPassport);
      if (savedOrigin && allCities.some(({ code }) => code === savedOrigin)) setOriginCityState(savedOrigin);
      const theme = savedTheme === "light" ? "light" : "dark";
      setThemeState(theme);
      applyTheme(theme);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("ravepass_lang", l); } catch {}
  };

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try { localStorage.setItem("ravepass_currency", c); } catch {}
  };

  const setPassport = (code: string) => {
    setPassportState(code);
    try { localStorage.setItem("ravepass_passport", code); } catch {}
  };

  const setOriginCity = (code: string) => {
    setOriginCityState(code);
    try { localStorage.setItem("ravepass_origin", code); } catch {}
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    try { localStorage.setItem("ravepass_theme", t); } catch {}
    applyTheme(t);
  };

  return (
    <SettingsContext.Provider value={{ lang, setLang, currency, setCurrency, passport, setPassport, originCity, setOriginCity, theme, setTheme }}>
      {children}
    </SettingsContext.Provider>
  );
}
