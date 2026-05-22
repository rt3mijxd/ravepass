"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Lang, Currency } from "@/lib/i18n";

export type Theme = "dark" | "light";

interface SettingsContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  lang: "ru",
  setLang: () => {},
  currency: "RUB",
  setCurrency: () => {},
  theme: "dark",
  setTheme: () => {},
});

export function useSettings() {
  return useContext(SettingsContext);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");
  const [currency, setCurrencyState] = useState<Currency>("RUB");
  const [theme, setThemeState] = useState<Theme>("dark");

  // Загружаем из localStorage при монтировании
  useEffect(() => {
    const savedLang = localStorage.getItem("ravepass_lang") as Lang | null;
    const savedCurrency = localStorage.getItem("ravepass_currency") as Currency | null;
    const savedTheme = localStorage.getItem("ravepass_theme") as Theme | null;
    if (savedLang === "ru" || savedLang === "en") setLangState(savedLang);
    if (savedCurrency === "RUB" || savedCurrency === "USD" || savedCurrency === "EUR") setCurrencyState(savedCurrency);
    if (savedTheme === "dark" || savedTheme === "light") {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme("dark");
    }
  }, []);

  const applyTheme = (t: Theme) => {
    if (t === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("ravepass_lang", l);
  };

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("ravepass_currency", c);
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("ravepass_theme", t);
    applyTheme(t);
  };

  return (
    <SettingsContext.Provider value={{ lang, setLang, currency, setCurrency, theme, setTheme }}>
      {children}
    </SettingsContext.Provider>
  );
}
