import type { CorePassportCode, VisaStatus } from "@/types";
import { visaMatrix } from "@/data/visa-matrix";

export const VISA_LAST_UPDATED = "2026-02-17";

// Расшифровка кода из визовой матрицы (F/A/E/R + срок) в наш VisaStatus
function decodeMatrixCode(code: string): { status: VisaStatus; days: number | null } {
  const letter = code[0];
  const days = code.length > 1 ? parseInt(code.slice(1), 10) : null;
  switch (letter) {
    case "F": return { status: "visa_free", days: Number.isNaN(days as number) ? null : days };
    case "A": return { status: "visa_on_arrival", days: null };
    case "E": return { status: "evisa", days: null };
    default: return { status: "visa_required", days: null };
  }
}

// Склонение слова «день» для русского срока пребывания
function daysRu(n: number): string {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return `${n} дней`;
  if (mod10 === 1) return `${n} день`;
  if (mod10 >= 2 && mod10 <= 4) return `${n} дня`;
  return `${n} дней`;
}

// Основная таблица для 4 детализированных паспортов (RU, AM, GE, KZ)
export const visaData: Record<string, Record<CorePassportCode, VisaStatus>> = {
  // Безвизовые для всех
  TR: { RU: "visa_free", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },
  RS: { RU: "visa_free", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },
  ME: { RU: "visa_free", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },
  BA: { RU: "visa_free", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },
  AE: { RU: "visa_free", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },
  TH: { RU: "visa_free", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },
  GE: { RU: "visa_free", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },
  AM: { RU: "visa_free", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },
  KZ: { RU: "visa_free", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },
  KG: { RU: "visa_free", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },
  UZ: { RU: "visa_free", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },
  AZ: { RU: "visa_free", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },
  BY: { RU: "visa_free", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },
  AR: { RU: "visa_free", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },
  BR: { RU: "visa_free", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },
  CU: { RU: "visa_free", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },
  MN: { RU: "visa_free", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },
  MD: { RU: "visa_free", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },

  // Частично безвизовые
  QA: { RU: "visa_free", AM: "visa_on_arrival", GE: "visa_free", KZ: "visa_free" },
  BH: { RU: "evisa", AM: "visa_on_arrival", GE: "evisa", KZ: "evisa" },
  OM: { RU: "evisa", AM: "evisa", GE: "evisa", KZ: "evisa" },
  EG: { RU: "visa_on_arrival", AM: "visa_on_arrival", GE: "visa_on_arrival", KZ: "visa_on_arrival" },
  MA: { RU: "visa_free", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },
  TN: { RU: "visa_free", AM: "visa_required", GE: "visa_free", KZ: "visa_free" },
  JO: { RU: "visa_on_arrival", AM: "visa_on_arrival", GE: "visa_on_arrival", KZ: "visa_on_arrival" },
  LB: { RU: "visa_on_arrival", AM: "visa_on_arrival", GE: "visa_on_arrival", KZ: "visa_free" },
  LK: { RU: "evisa", AM: "evisa", GE: "evisa", KZ: "evisa" },
  MY: { RU: "visa_free", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },
  ID: { RU: "visa_on_arrival", AM: "visa_on_arrival", GE: "visa_free", KZ: "visa_free" },
  KR: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_free" },
  CN: { RU: "visa_free", AM: "visa_required", GE: "visa_required", KZ: "visa_free" },
  IL: { RU: "visa_free", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },
  MX: { RU: "evisa", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },

  // Шенген / Европа — визы для RU
  DE: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },
  FR: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },
  ES: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },
  IT: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },
  NL: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },
  PT: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },
  AT: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },
  CZ: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },
  PL: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },
  SE: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },
  FI: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },
  NO: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },
  DK: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },
  BE: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },
  GR: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },
  HU: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },

  // Англосаксонские страны
  GB: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },
  US: { RU: "visa_required", AM: "visa_required", GE: "visa_required", KZ: "visa_required" },
  CA: { RU: "visa_required", AM: "visa_required", GE: "visa_required", KZ: "visa_required" },
  AU: { RU: "visa_required", AM: "visa_required", GE: "visa_required", KZ: "visa_required" },

  // Азия
  JP: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },
  SG: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },

  // Дополнительные страны (часто встречаются в Ticketmaster)
  IE: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },  // Ирландия
  NZ: { RU: "visa_required", AM: "visa_required", GE: "visa_required", KZ: "visa_required" },  // Новая Зеландия
  ZA: { RU: "visa_free", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },  // ЮАР
  CL: { RU: "visa_free", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },  // Чили
  CO: { RU: "visa_free", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },  // Колумбия
  PE: { RU: "visa_free", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },  // Перу
  HR: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },  // Хорватия
  RO: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },  // Румыния
  BG: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },  // Болгария
  SK: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },  // Словакия
  SI: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },  // Словения
  LT: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },  // Литва
  LV: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },  // Латвия
  EE: { RU: "visa_required", AM: "visa_required", GE: "visa_free", KZ: "visa_required" },  // Эстония
  PH: { RU: "visa_free", AM: "visa_free", GE: "visa_free", KZ: "visa_free" },  // Филиппины
  TW: { RU: "visa_required", AM: "visa_required", GE: "visa_required", KZ: "visa_required" },  // Тайвань
  IN: { RU: "evisa", AM: "evisa", GE: "evisa", KZ: "evisa" },  // Индия
};

export const countryNames: Record<string, string> = {
  TR: "Турция", RS: "Сербия", ME: "Черногория", BA: "Босния и Герцеговина",
  AE: "ОАЭ", TH: "Таиланд", GE: "Грузия", AM: "Армения",
  KZ: "Казахстан", KG: "Кыргызстан", UZ: "Узбекистан", AZ: "Азербайджан",
  BY: "Беларусь", AR: "Аргентина", BR: "Бразилия", CU: "Куба",
  MN: "Монголия", MD: "Молдова", QA: "Катар", BH: "Бахрейн",
  OM: "Оман", EG: "Египет", MA: "Марокко", TN: "Тунис",
  JO: "Иордания", LB: "Ливан", LK: "Шри-Ланка", MY: "Малайзия",
  ID: "Индонезия", KR: "Южная Корея", CN: "Китай", IL: "Израиль",
  MX: "Мексика", DE: "Германия", FR: "Франция", ES: "Испания",
  IT: "Италия", NL: "Нидерланды", PT: "Португалия", AT: "Австрия",
  CZ: "Чехия", PL: "Польша", SE: "Швеция", FI: "Финляндия",
  NO: "Норвегия", DK: "Дания", BE: "Бельгия", GR: "Греция",
  HU: "Венгрия", GB: "Великобритания", US: "США", CA: "Канада",
  AU: "Австралия", JP: "Япония", SG: "Сингапур",
  IE: "Ирландия", NZ: "Новая Зеландия", ZA: "ЮАР", CL: "Чили",
  CO: "Колумбия", PE: "Перу", HR: "Хорватия", RO: "Румыния",
  BG: "Болгария", SK: "Словакия", SI: "Словения", LT: "Литва",
  LV: "Латвия", EE: "Эстония", PH: "Филиппины", TW: "Тайвань", IN: "Индия",
};

export const visaStatusLabels: Record<VisaStatus, string> = {
  visa_free: "Без визы",
  visa_on_arrival: "Виза по прилёту",
  evisa: "Электронная виза",
  visa_required: "Нужна виза",
};

// Подробная визовая информация: сроки безвизового пребывания
// Формат: countryCode -> passport -> "30 дней" / "90 дней в 180" и т.д.
export const visaDetails: Record<string, Record<string, string>> = {
  TR: { RU: "60 дней", AM: "90 дней", GE: "1 год", KZ: "30 дней", UA: "90 дней", BY: "30 дней" },
  RS: { RU: "30 дней", AM: "30 дней", GE: "30 дней", KZ: "30 дней", UA: "30 дней", BY: "30 дней" },
  ME: { RU: "30 дней", AM: "30 дней", GE: "90 дней", KZ: "30 дней" },
  AE: { RU: "90 дней", AM: "90 дней", GE: "90 дней", KZ: "30 дней" },
  TH: { RU: "60 дней", AM: "30 дней", GE: "30 дней", KZ: "30 дней" },
  GE: { RU: "1 год", AM: "1 год", KZ: "1 год", UA: "1 год", BY: "1 год" },
  AM: { RU: "180 дней", GE: "180 дней", KZ: "180 дней", UA: "180 дней" },
  KZ: { RU: "90 дней", AM: "90 дней", GE: "90 дней", KG: "90 дней" },
  IL: { RU: "90 дней", AM: "90 дней", GE: "90 дней", KZ: "90 дней", UA: "90 дней" },
  MA: { RU: "90 дней", AM: "90 дней" },
  AR: { RU: "90 дней" },
  BR: { RU: "90 дней" },
  MY: { RU: "30 дней" },
  ID: { RU: "30 дней" },
  EG: { RU: "30 дней" },
  CN: { RU: "15 дней", KZ: "14 дней" },
  QA: { RU: "90 дней" },
  // Шенген для безвизовых паспортов
  DE: { GE: "90/180 дней", UA: "90/180 дней", MD: "90/180 дней" },
  FR: { GE: "90/180 дней", UA: "90/180 дней", MD: "90/180 дней" },
  ES: { GE: "90/180 дней", UA: "90/180 дней", MD: "90/180 дней" },
  IT: { GE: "90/180 дней", UA: "90/180 дней", MD: "90/180 дней" },
  NL: { GE: "90/180 дней", UA: "90/180 дней", MD: "90/180 дней" },
  SE: { GE: "90/180 дней", UA: "90/180 дней" },
  PL: { GE: "90/180 дней", UA: "90/180 дней" },
  CZ: { GE: "90/180 дней", UA: "90/180 дней" },
  AT: { GE: "90/180 дней", UA: "90/180 дней" },
  GB: { GE: "1 год", UA: "6 месяцев" },
};

// Расширенные визовые данные для других паспортов
// Формат: passportCode -> { countryCode -> VisaStatus }
const extendedVisaData: Record<string, Record<string, VisaStatus>> = {
  // Украина — безвиз с ЕС, много безвизовых
  UA: {
    TR: "visa_free", RS: "visa_free", ME: "visa_free", BA: "visa_free",
    AE: "visa_free", TH: "visa_free", GE: "visa_free", AM: "visa_free",
    KZ: "visa_free", KG: "visa_free", UZ: "visa_free", AZ: "visa_free",
    BY: "visa_free", MD: "visa_free", IL: "visa_free", MA: "visa_free",
    AR: "visa_free", BR: "visa_free", EG: "visa_on_arrival",
    // Шенген — безвиз
    DE: "visa_free", FR: "visa_free", ES: "visa_free", IT: "visa_free",
    NL: "visa_free", PT: "visa_free", AT: "visa_free", CZ: "visa_free",
    PL: "visa_free", SE: "visa_free", FI: "visa_free", NO: "visa_free",
    DK: "visa_free", BE: "visa_free", GR: "visa_free", HU: "visa_free",
    HR: "visa_free", RO: "visa_free", BG: "visa_free", SK: "visa_free",
    SI: "visa_free", LT: "visa_free", LV: "visa_free", EE: "visa_free",
    IE: "visa_free", GB: "visa_free",
    US: "visa_required", CA: "visa_required", AU: "visa_required",
    JP: "visa_free", KR: "visa_free", SG: "visa_free",
  },
  // Беларусь
  BY: {
    TR: "visa_free", RS: "visa_free", ME: "visa_free", BA: "visa_free",
    AE: "visa_free", TH: "visa_free", GE: "visa_free", AM: "visa_free",
    KZ: "visa_free", KG: "visa_free", UZ: "visa_free", AZ: "visa_free",
    MD: "visa_free", RU: "visa_free", IL: "visa_free", MA: "visa_free",
    EG: "visa_on_arrival", AR: "visa_free", BR: "visa_free",
    DE: "visa_required", FR: "visa_required", ES: "visa_required",
    IT: "visa_required", GB: "visa_required", US: "visa_required",
    JP: "visa_required", KR: "visa_required", CN: "visa_free",
  },
  // Узбекистан
  UZ: {
    TR: "visa_free", RS: "visa_free", AE: "visa_free", TH: "visa_free",
    GE: "visa_free", AM: "visa_free", KZ: "visa_free", KG: "visa_free",
    AZ: "visa_free", BY: "visa_free", RU: "visa_free", MD: "visa_free",
    MY: "visa_free", ID: "visa_free", KR: "visa_free",
    DE: "visa_required", FR: "visa_required", US: "visa_required",
    GB: "visa_required", IL: "visa_free",
  },
  // Кыргызстан
  KG: {
    TR: "visa_free", RS: "visa_free", AE: "visa_free", TH: "visa_free",
    GE: "visa_free", AM: "visa_free", KZ: "visa_free", UZ: "visa_free",
    AZ: "visa_free", BY: "visa_free", RU: "visa_free", MY: "visa_free",
    DE: "visa_required", FR: "visa_required", US: "visa_required",
    GB: "visa_required", KR: "visa_free",
  },
  // Азербайджан
  AZ: {
    TR: "visa_free", RS: "visa_free", GE: "visa_free", KZ: "visa_free",
    KG: "visa_free", UZ: "visa_free", BY: "visa_free", RU: "visa_free",
    AE: "visa_free", MY: "visa_free", KR: "visa_free",
    DE: "visa_required", FR: "visa_required", US: "visa_required",
    GB: "visa_required",
  },
  // Молдова — безвиз с ЕС
  MD: {
    TR: "visa_free", RS: "visa_free", ME: "visa_free", BA: "visa_free",
    GE: "visa_free", AM: "visa_free", KZ: "visa_free", BY: "visa_free",
    RU: "visa_free", AZ: "visa_free", AE: "visa_free",
    DE: "visa_free", FR: "visa_free", ES: "visa_free", IT: "visa_free",
    NL: "visa_free", PT: "visa_free", AT: "visa_free", CZ: "visa_free",
    PL: "visa_free", SE: "visa_free", GB: "visa_free",
    US: "visa_required", CA: "visa_required",
  },
  // Таджикистан
  TJ: {
    TR: "visa_free", KZ: "visa_free", KG: "visa_free", UZ: "visa_free",
    RU: "visa_free", BY: "visa_free", AZ: "visa_free",
    AE: "visa_on_arrival", TH: "visa_on_arrival",
    DE: "visa_required", FR: "visa_required", US: "visa_required",
  },
  // Туркменистан
  TM: {
    TR: "visa_free", KZ: "visa_free", KG: "visa_free", UZ: "visa_free",
    RU: "visa_free",
    AE: "visa_on_arrival", TH: "visa_on_arrival",
    DE: "visa_required", FR: "visa_required", US: "visa_required",
  },
  // Паспорта ЕС / развитых стран — безвиз почти везде
  US: { _default: "visa_free", RU: "visa_required", CN: "visa_required", IN: "visa_required" },
  GB: { _default: "visa_free", RU: "visa_required", CN: "visa_required" },
  DE: { _default: "visa_free", RU: "visa_required", CN: "visa_required" },
  FR: { _default: "visa_free", RU: "visa_required", CN: "visa_required" },
  IL: { _default: "visa_free", RU: "visa_free", MY: "visa_required" },
  TR: { _default: "visa_required", GE: "visa_free", AZ: "visa_free", KZ: "visa_free", RS: "visa_free", BA: "visa_free" },
  JP: { _default: "visa_free", RU: "visa_required", CN: "visa_required" },
  KR: { _default: "visa_free", RU: "visa_required" },
};

export function getVisaStatus(countryCode: string, passport: string): VisaStatus {
  // 1. Свой паспорт = своя страна — виза не нужна
  if (countryCode === passport) return "visa_free";

  // 2. Основной источник — визовая матрица (Passport Index, 199×199)
  const code = visaMatrix[passport]?.[countryCode];
  if (code) return decodeMatrixCode(code).status;

  // 3. Фолбэк: ручная таблица для RU/AM/GE/KZ
  const corePassport = passport as CorePassportCode;
  const coreResult = visaData[countryCode]?.[corePassport];
  if (coreResult) return coreResult;

  // 4. Фолбэк: расширенная ручная таблица
  const extData = extendedVisaData[passport];
  if (extData) {
    if (extData[countryCode]) return extData[countryCode];
    if (extData._default) return extData._default as VisaStatus;
  }

  // 5. Дефолт: если данных нет — предполагаем что виза нужна (безопаснее)
  return "visa_required";
}

/**
 * Получить детали визы (срок пребывания).
 * Сначала кураторские строки (красивые формулировки вроде «90/180 дней»),
 * затем срок из визовой матрицы.
 */
export function getVisaDetails(countryCode: string, passport: string): string | null {
  const curated = visaDetails[countryCode]?.[passport];
  if (curated) return curated;

  const code = visaMatrix[passport]?.[countryCode];
  if (code) {
    const { status, days } = decodeMatrixCode(code);
    if (status === "visa_free" && days != null) return daysRu(days);
  }
  return null;
}

export function isVisaFree(status: VisaStatus): boolean {
  return status === "visa_free" || status === "visa_on_arrival" || status === "evisa";
}
