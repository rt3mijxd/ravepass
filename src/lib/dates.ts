import type { Lang } from "@/lib/i18n";

/**
 * Утилиты для работы с датами концертов.
 * Прошедшие концерты не должны показываться пользователю.
 */

// Сегодняшняя дата в формате "YYYY-MM-DD" (по локальному времени сервера)
function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Концерт считается актуальным, если его дата сегодня или в будущем
export function isUpcoming(date: string): boolean {
  if (!date) return false;
  return date >= todayStr();
}

// Оставляет только предстоящие концерты
export function filterUpcoming<T extends { date: string; dateEnd?: string }>(items: T[]): T[] {
  const today = todayStr();
  return items.filter((i) => i.date && (i.dateEnd ?? i.date) >= today);
}

export function formatConcertDate(
  concert: { date: string; dateEnd?: string },
  lang: Lang,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" },
): string {
  const formatter = new Intl.DateTimeFormat(lang, { ...options, timeZone: "UTC" });
  const start = new Date(`${concert.date}T12:00:00Z`);
  return concert.dateEnd
    ? formatter.formatRange(start, new Date(`${concert.dateEnd}T12:00:00Z`))
    : formatter.format(start);
}
