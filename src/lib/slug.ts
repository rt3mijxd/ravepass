/**
 * Единая нормализация имён артистов и слагов.
 * Убирает диакритику (í → i), чтобы "ROSALÍA" и "Rosalia" совпадали
 * и в URL-слагах, и в текстовом поиске.
 */

const DIACRITICS = /[̀-ͯ]/g;

// Снимает диакритические знаки и приводит к нижнему регистру
export function normalizeText(s: string): string {
  return s.normalize("NFD").replace(DIACRITICS, "").toLowerCase().trim();
}

// Слаг для URL: латиница/кириллица/цифры, остальное — дефисы
export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(DIACRITICS, "")
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
