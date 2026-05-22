import type { Lang } from "@/lib/i18n";

export interface CityOption {
  code: string;
  labelRu: string;
  labelEn: string;
  popular: boolean;
}

export const allCities: CityOption[] = [
  // Популярные — города вылета из СНГ
  { code: "MOW", labelRu: "Москва", labelEn: "Moscow", popular: true },
  { code: "LED", labelRu: "Санкт-Петербург", labelEn: "St. Petersburg", popular: true },
  { code: "ALA", labelRu: "Алматы", labelEn: "Almaty", popular: true },
  { code: "EVN", labelRu: "Ереван", labelEn: "Yerevan", popular: true },
  { code: "TBS", labelRu: "Тбилиси", labelEn: "Tbilisi", popular: true },
  { code: "KIV", labelRu: "Кишинёв", labelEn: "Chișinău", popular: true },
  { code: "GYD", labelRu: "Баку", labelEn: "Baku", popular: true },
  { code: "FRU", labelRu: "Бишкек", labelEn: "Bishkek", popular: true },
  { code: "TAS", labelRu: "Ташкент", labelEn: "Tashkent", popular: true },
  { code: "MSQ", labelRu: "Минск", labelEn: "Minsk", popular: true },
  { code: "NQZ", labelRu: "Астана", labelEn: "Astana", popular: true },
  { code: "KZN", labelRu: "Казань", labelEn: "Kazan", popular: true },
  { code: "SVX", labelRu: "Екатеринбург", labelEn: "Yekaterinburg", popular: true },
  { code: "OVB", labelRu: "Новосибирск", labelEn: "Novosibirsk", popular: true },
  { code: "ROV", labelRu: "Ростов-на-Дону", labelEn: "Rostov-on-Don", popular: true },
  { code: "AER", labelRu: "Сочи", labelEn: "Sochi", popular: true },

  // Международные хабы
  { code: "IST", labelRu: "Стамбул", labelEn: "Istanbul", popular: false },
  { code: "DXB", labelRu: "Дубай", labelEn: "Dubai", popular: false },
  { code: "DOH", labelRu: "Доха", labelEn: "Doha", popular: false },
  { code: "BKK", labelRu: "Бангкок", labelEn: "Bangkok", popular: false },
  { code: "TLV", labelRu: "Тель-Авив", labelEn: "Tel Aviv", popular: false },
  { code: "BEG", labelRu: "Белград", labelEn: "Belgrade", popular: false },
  { code: "LON", labelRu: "Лондон", labelEn: "London", popular: false },
  { code: "PAR", labelRu: "Париж", labelEn: "Paris", popular: false },
  { code: "BER", labelRu: "Берлин", labelEn: "Berlin", popular: false },
  { code: "NYC", labelRu: "Нью-Йорк", labelEn: "New York", popular: false },
  { code: "PEK", labelRu: "Пекин", labelEn: "Beijing", popular: false },
  { code: "SEL", labelRu: "Сеул", labelEn: "Seoul", popular: false },
  { code: "TYO", labelRu: "Токио", labelEn: "Tokyo", popular: false },
  { code: "SIN", labelRu: "Сингапур", labelEn: "Singapore", popular: false },
  { code: "AMS", labelRu: "Амстердам", labelEn: "Amsterdam", popular: false },
  { code: "BCN", labelRu: "Барселона", labelEn: "Barcelona", popular: false },
  { code: "MIL", labelRu: "Милан", labelEn: "Milan", popular: false },
  { code: "WAW", labelRu: "Варшава", labelEn: "Warsaw", popular: false },
  { code: "PRG", labelRu: "Прага", labelEn: "Prague", popular: false },
  { code: "VIE", labelRu: "Вена", labelEn: "Vienna", popular: false },
  { code: "CAI", labelRu: "Каир", labelEn: "Cairo", popular: false },
  { code: "CMB", labelRu: "Коломбо", labelEn: "Colombo", popular: false },
  { code: "KUL", labelRu: "Куала-Лумпур", labelEn: "Kuala Lumpur", popular: false },
  { code: "DEL", labelRu: "Дели", labelEn: "Delhi", popular: false },
  { code: "GRU", labelRu: "Сан-Паулу", labelEn: "São Paulo", popular: false },
  { code: "MEX", labelRu: "Мехико", labelEn: "Mexico City", popular: false },
  { code: "EZE", labelRu: "Буэнос-Айрес", labelEn: "Buenos Aires", popular: false },
];

export function getCityOptions(lang: Lang) {
  return allCities.map((c) => ({
    value: c.code,
    label: lang === "ru" ? c.labelRu : c.labelEn,
    group: c.popular ? "popular" : "all",
  }));
}

// Название города по коду для отображения
export function getCityName(code: string, lang: Lang): string {
  const city = allCities.find((c) => c.code === code);
  if (!city) return code;
  return lang === "ru" ? city.labelRu : city.labelEn;
}
