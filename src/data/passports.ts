import type { Lang } from "@/lib/i18n";

export interface PassportOption {
  code: string;
  labelRu: string;
  labelEn: string;
  popular: boolean;
}

// Популярные паспорта (СНГ) + расширенный список
export const allPassports: PassportOption[] = [
  // Популярные — наверху списка
  { code: "RU", labelRu: "Российский", labelEn: "Russian", popular: true },
  { code: "AM", labelRu: "Армянский", labelEn: "Armenian", popular: true },
  { code: "GE", labelRu: "Грузинский", labelEn: "Georgian", popular: true },
  { code: "KZ", labelRu: "Казахстанский", labelEn: "Kazakh", popular: true },
  { code: "BY", labelRu: "Белорусский", labelEn: "Belarusian", popular: true },
  { code: "UZ", labelRu: "Узбекский", labelEn: "Uzbek", popular: true },
  { code: "KG", labelRu: "Кыргызский", labelEn: "Kyrgyz", popular: true },
  { code: "AZ", labelRu: "Азербайджанский", labelEn: "Azerbaijani", popular: true },
  { code: "UA", labelRu: "Украинский", labelEn: "Ukrainian", popular: true },
  { code: "MD", labelRu: "Молдавский", labelEn: "Moldovan", popular: true },
  { code: "TJ", labelRu: "Таджикский", labelEn: "Tajik", popular: true },
  { code: "TM", labelRu: "Туркменский", labelEn: "Turkmen", popular: true },

  // Остальные
  { code: "US", labelRu: "Американский", labelEn: "American", popular: false },
  { code: "GB", labelRu: "Британский", labelEn: "British", popular: false },
  { code: "DE", labelRu: "Немецкий", labelEn: "German", popular: false },
  { code: "FR", labelRu: "Французский", labelEn: "French", popular: false },
  { code: "IL", labelRu: "Израильский", labelEn: "Israeli", popular: false },
  { code: "TR", labelRu: "Турецкий", labelEn: "Turkish", popular: false },
  { code: "CA", labelRu: "Канадский", labelEn: "Canadian", popular: false },
  { code: "AU", labelRu: "Австралийский", labelEn: "Australian", popular: false },
  { code: "JP", labelRu: "Японский", labelEn: "Japanese", popular: false },
  { code: "KR", labelRu: "Южнокорейский", labelEn: "South Korean", popular: false },
  { code: "CN", labelRu: "Китайский", labelEn: "Chinese", popular: false },
  { code: "IN", labelRu: "Индийский", labelEn: "Indian", popular: false },
  { code: "BR", labelRu: "Бразильский", labelEn: "Brazilian", popular: false },
  { code: "MX", labelRu: "Мексиканский", labelEn: "Mexican", popular: false },
  { code: "AR", labelRu: "Аргентинский", labelEn: "Argentine", popular: false },
  { code: "PL", labelRu: "Польский", labelEn: "Polish", popular: false },
  { code: "CZ", labelRu: "Чешский", labelEn: "Czech", popular: false },
  { code: "IT", labelRu: "Итальянский", labelEn: "Italian", popular: false },
  { code: "ES", labelRu: "Испанский", labelEn: "Spanish", popular: false },
  { code: "NL", labelRu: "Нидерландский", labelEn: "Dutch", popular: false },
  { code: "SE", labelRu: "Шведский", labelEn: "Swedish", popular: false },
  { code: "NO", labelRu: "Норвежский", labelEn: "Norwegian", popular: false },
  { code: "FI", labelRu: "Финский", labelEn: "Finnish", popular: false },
  { code: "DK", labelRu: "Датский", labelEn: "Danish", popular: false },
  { code: "TH", labelRu: "Тайский", labelEn: "Thai", popular: false },
  { code: "SG", labelRu: "Сингапурский", labelEn: "Singaporean", popular: false },
  { code: "AE", labelRu: "Эмиратский", labelEn: "Emirati", popular: false },
];

export function getPassportOptions(lang: Lang) {
  return allPassports.map((p) => ({
    value: p.code,
    label: lang === "ru" ? p.labelRu : p.labelEn,
    group: p.popular ? "popular" : "all",
  }));
}
