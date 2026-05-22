"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Lang, Currency } from "@/lib/i18n";

interface SettingsContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  lang: "ru",
  setLang: () => {},
  currency: "RUB",
  setCurrency: () => {},
});

export function useSettings() {
  return useContext(SettingsContext);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");
  const [currency, setCurrencyState] = useState<Currency>("RUB");

  // Загружаем из localStorage при монтировании
  useEffect(() => {
    const savedLang = localStorage.getItem("ravepass_lang") as Lang | null;
    const savedCurrency = localStorage.getItem("ravepass_currency") as Currency | null;
    if (savedLang === "ru" || savedLang === "en") setLangState(savedLang);
    if (savedCurrency === "RUB" || savedCurrency === "USD" || savedCurrency === "EUR") setCurrencyState(savedCurrency);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("ravepass_lang", l);
  };

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("ravepass_currency", c);
  };

  return (
    <SettingsContext.Provider value={{ lang, setLang, currency, setCurrency }}>
      {children}
    </SettingsContext.Provider>
  );
}
