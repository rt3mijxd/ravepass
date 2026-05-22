import type { CorePassportCode, VisaStatus } from "@/types";

export const VISA_LAST_UPDATED = "2026-05-22";

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

export function getVisaStatus(countryCode: string, passport: string): VisaStatus | null {
  // 1. Проверяем основную таблицу (для RU, AM, GE, KZ)
  const corePassport = passport as CorePassportCode;
  if (visaData[countryCode]?.[corePassport]) {
    return visaData[countryCode][corePassport];
  }

  // 2. Свой паспорт = свою страну не нужна виза
  if (countryCode === passport) return "visa_free";

  // 3. Проверяем расширенную таблицу
  const extData = extendedVisaData[passport];
  if (extData) {
    if (extData[countryCode]) return extData[countryCode];
    if (extData._default) return extData._default as VisaStatus;
  }

  // 4. Если ничего не найдено — возвращаем null (неизвестно)
  return null;
}

export function isVisaFree(status: VisaStatus): boolean {
  return status === "visa_free" || status === "visa_on_arrival" || status === "evisa";
}
