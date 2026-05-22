import type { PassportCode, VisaStatus } from "@/types";

export const VISA_LAST_UPDATED = "2026-05-10";

export const visaData: Record<string, Record<PassportCode, VisaStatus>> = {
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
};

export const visaStatusLabels: Record<VisaStatus, string> = {
  visa_free: "Без визы",
  visa_on_arrival: "Виза по прилёту",
  evisa: "Электронная виза",
  visa_required: "Нужна виза",
};

export function getVisaStatus(countryCode: string, passport: PassportCode): VisaStatus | null {
  return visaData[countryCode]?.[passport] ?? null;
}

export function isVisaFree(status: VisaStatus): boolean {
  return status === "visa_free" || status === "visa_on_arrival" || status === "evisa";
}
