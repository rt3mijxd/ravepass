export type Lang = "ru" | "en";
export type Currency = "RUB" | "USD" | "EUR";

// Примерные курсы для пересчёта (базовая валюта — USD)
// Перелёты у нас в рублях, билеты из TM — в разных валютах
export const exchangeRates: Record<string, Record<Currency, number>> = {
  USD: { RUB: 92, USD: 1, EUR: 0.92 },
  EUR: { RUB: 100, USD: 1.09, EUR: 1 },
  GBP: { RUB: 116, USD: 1.27, EUR: 1.16 },
  CAD: { RUB: 67, USD: 0.73, EUR: 0.67 },
  AUD: { RUB: 60, USD: 0.65, EUR: 0.60 },
  RUB: { RUB: 1, USD: 0.011, EUR: 0.010 },
  MXN: { RUB: 5.3, USD: 0.058, EUR: 0.053 },
  BRL: { RUB: 18, USD: 0.20, EUR: 0.18 },
  PLN: { RUB: 23, USD: 0.25, EUR: 0.23 },
  CZK: { RUB: 4, USD: 0.044, EUR: 0.040 },
  SEK: { RUB: 8.8, USD: 0.096, EUR: 0.088 },
  NOK: { RUB: 8.5, USD: 0.093, EUR: 0.085 },
  DKK: { RUB: 13.4, USD: 0.146, EUR: 0.134 },
  HUF: { RUB: 0.25, USD: 0.0027, EUR: 0.0025 },
  TRY: { RUB: 2.7, USD: 0.029, EUR: 0.027 },
  AED: { RUB: 25, USD: 0.27, EUR: 0.25 },
  THB: { RUB: 2.6, USD: 0.029, EUR: 0.026 },
  KRW: { RUB: 0.067, USD: 0.00073, EUR: 0.00067 },
  JPY: { RUB: 0.60, USD: 0.0065, EUR: 0.0060 },
  SGD: { RUB: 69, USD: 0.75, EUR: 0.69 },
  NZD: { RUB: 55, USD: 0.60, EUR: 0.55 },
  ZAR: { RUB: 5, USD: 0.054, EUR: 0.050 },
};

/**
 * Конвертирует сумму из одной валюты в целевую.
 * Если курс неизвестен — возвращает в исходной валюте.
 */
export function convertPrice(amount: number, fromCurrency: string, toCurrency: Currency): number {
  if (fromCurrency === toCurrency) return amount;
  const rates = exchangeRates[fromCurrency];
  if (!rates) return amount; // неизвестная валюта — не конвертируем
  return Math.round(amount * rates[toCurrency]);
}

/**
 * Форматирует цену с символом валюты
 */
export function formatPrice(amount: number, currency: Currency, lang: Lang): string {
  const formatted = amount.toLocaleString(lang === "ru" ? "ru-RU" : "en-US");
  switch (currency) {
    case "RUB": return `${formatted} ₽`;
    case "USD": return `$${formatted}`;
    case "EUR": return `€${formatted}`;
  }
}

export const currencySymbols: Record<Currency, string> = {
  RUB: "₽",
  USD: "$",
  EUR: "€",
};

// ==================== ПЕРЕВОДЫ ====================

const translations = {
  // Шапка и футер
  "header.subtitle": { ru: "концерты за рубежом", en: "concerts abroad" },
  "footer.rights": { ru: "Все права защищены.", en: "All rights reserved." },
  "footer.visa_disclaimer": {
    ru: "Визовая информация носит справочный характер. Проверяйте данные в официальных источниках.",
    en: "Visa information is for reference only. Please verify with official sources.",
  },
  "footer.privacy": { ru: "Политика конфиденциальности", en: "Privacy policy" },
  "footer.contact": { ru: "Связаться", en: "Contact" },
  "footer.affiliate": {
    ru: "Ссылки на авиабилеты — партнёрские (Aviasales). Мы можем получать комиссию.",
    en: "Flight links are affiliate (Aviasales). We may earn a commission.",
  },

  // Согласие на обработку ПД
  "consent.agree": { ru: "Продолжая, вы соглашаетесь с обработкой персональных данных согласно", en: "By continuing, you agree to the processing of personal data per the" },
  "consent.policy": { ru: "политике конфиденциальности", en: "privacy policy" },

  // Поиск
  "search.placeholder": { ru: "Найти артиста...", en: "Search artist..." },
  "lucky.button": { ru: "Мне повезёт", en: "I'm feeling lucky" },

  // Фильтры
  "filter.passport": { ru: "Паспорт", en: "Passport" },
  "filter.origin_city": { ru: "Город вылета", en: "Departure city" },
  "filter.country": { ru: "Страна", en: "Country" },
  "filter.all_countries": { ru: "Все страны", en: "All countries" },
  "filter.visa_free": { ru: "Без визы", en: "Visa-free" },
  "filter.direct_flights": { ru: "Прямые рейсы", en: "Direct flights" },

  // Паспорта
  "passport.RU": { ru: "Российский", en: "Russian" },
  "passport.AM": { ru: "Армянский", en: "Armenian" },
  "passport.GE": { ru: "Грузинский", en: "Georgian" },
  "passport.KZ": { ru: "Казахстанский", en: "Kazakh" },

  // Города вылета
  "city.MOW": { ru: "Москва", en: "Moscow" },
  "city.LED": { ru: "Санкт-Петербург", en: "St. Petersburg" },
  "city.ALA": { ru: "Алматы", en: "Almaty" },
  "city.EVN": { ru: "Ереван", en: "Yerevan" },
  "city.TBS": { ru: "Тбилиси", en: "Tbilisi" },

  // Секции
  "section.popular": { ru: "Популярные направления", en: "Popular destinations" },
  "section.on_tour": { ru: "Топовые мировые артисты сейчас в туре", en: "Top world artists on tour now" },
  "discover.artists": { ru: "Мировые звёзды в турах", en: "World stars on tour" },
  "discover.destinations": { ru: "Популярные направления", en: "Popular destinations" },
  "section.concerts": { ru: "Концерты", en: "Concerts" },
  "section.all_concerts": { ru: "Все концерты", en: "All concerts" },

  // Визовые статусы
  "visa.visa_free": { ru: "Без визы", en: "Visa-free" },
  "visa.visa_on_arrival": { ru: "Виза по прилёту", en: "Visa on arrival" },
  "visa.evisa": { ru: "Электронная виза", en: "E-visa" },
  "visa.visa_required": { ru: "Нужна виза", en: "Visa required" },
  "visa.has_visa_free": { ru: "Есть без визы", en: "Visa-free available" },
  "visa.needs_visa": { ru: "Нужна виза", en: "Visa needed" },

  // Перелёты
  "flight.direct": { ru: "Прямой", en: "Direct" },
  "flight.connection": { ru: "Пересадка", en: "Connection" },
  "flight.direct_full": { ru: "Прямой рейс", en: "Direct flight" },
  "flight.connection_full": { ru: "С пересадкой", en: "With connection" },
  "flight.no_data": { ru: "Нет данных о прямых рейсах из", en: "No direct flights from" },

  // Детали концерта
  "concert.not_found": { ru: "Концерт не найден", en: "Concert not found" },
  "concert.your_trip": { ru: "Ваша поездка", en: "Your trip" },
  "concert.visa": { ru: "Виза", en: "Visa" },
  "concert.flight": { ru: "Перелёт", en: "Flight" },
  "concert.flight_from": { ru: "Перелёт от", en: "Flight from" },
  "concert.budget": { ru: "Примерный бюджет", en: "Estimated budget" },
  "concert.ticket": { ru: "Билет на концерт", en: "Concert ticket" },
  "concert.price_tbd": { ru: "Цена уточняется", en: "Price TBD" },
  "concert.total_from": { ru: "Итого от", en: "Total from" },
  "concert.buy_tickets": { ru: "Купить билеты", en: "Buy tickets" },
  "concert.find_flights": { ru: "Найти авиабилеты", en: "Find flights" },
  "concert.visa_updated": { ru: "Визовая информация актуальна на", en: "Visa info updated on" },
  "concert.all_concerts_by": { ru: "Все концерты", en: "All concerts by" },
  "concert.notify": { ru: "Хотите узнать о новых концертах", en: "Want to know about new concerts by" },
  "concert.notify_btn": { ru: "Уведомить о новых концертах", en: "Notify about new concerts" },

  // Страница артиста
  "artist.not_found": { ru: "Артист не найден", en: "Artist not found" },
  "artist.tour": { ru: "Тур", en: "Tour" },
  "artist.available_visa_free": { ru: "без визы", en: "visa-free" },
  "artist.no_visa_free": { ru: "нет без визы", en: "none visa-free" },
  "artist.from": { ru: "от", en: "from" },

  // Навигация
  "nav.back_all": { ru: "← Все концерты", en: "← All concerts" },
  "nav.back_home": { ru: "← На главную", en: "← Home" },
  "nav.more": { ru: "ещё", en: "more" },

  // Единицы
  "unit.h": { ru: "ч", en: "h" },
  "unit.ticket_plus": { ru: "+ билет", en: "+ ticket" },

  // Пустые состояния
  "empty.artist_not_found": { ru: "Артист «{query}» не найден", en: "Artist \"{query}\" not found" },
  "empty.no_concerts": { ru: "Концертов по выбранным фильтрам не найдено", en: "No concerts found for selected filters" },

  // Предложить артиста
  "suggest.title": { ru: "Не нашли любимого артиста?", en: "Can't find your favorite artist?" },
  "suggest.description": { ru: "Мы постоянно добавляем новых артистов. Напишите нам, кого вы хотите увидеть!", en: "We're constantly adding new artists. Tell us who you'd like to see!" },
  "suggest.button": { ru: "Предложить артиста", en: "Suggest an artist" },
  "suggest.email_subject": { ru: "Предложение артиста для RavePass", en: "Artist suggestion for RavePass" },
  "suggest.email_body": { ru: "Хочу видеть на RavePass концерты артиста: ", en: "I'd like to see concerts by: " },

  // CIS-артисты
  "section.cis_artists": { ru: "Русскоязычные артисты", en: "Russian-speaking artists" },

  // Карта мира
  "nav.map": { ru: "Карта концертов", en: "Concert map" },

  // Настройки в шапке (мобильное меню)
  "settings.menu": { ru: "Настройки", en: "Settings" },
  "settings.theme": { ru: "Тема", en: "Theme" },
  "settings.language": { ru: "Язык", en: "Language" },
  "settings.currency": { ru: "Валюта", en: "Currency" },
  "map.title": { ru: "Карта концертов", en: "Concert map" },
  "map.subtitle": {
    ru: "Цвет страны показывает, нужна ли виза для выбранного паспорта. Числа — количество концертов.",
    en: "Country color shows visa requirements for the selected passport. Numbers show concert counts.",
  },
  "map.soon": { ru: "Скоро выступят", en: "Performing soon" },
  "map.no_concerts": { ru: "Концертов пока нет", en: "No concerts yet" },
  "map.hint": { ru: "Колёсико мыши — зум, перетаскивание — перемещение", en: "Scroll to zoom, drag to pan" },
  "map.reset": { ru: "Сбросить", en: "Reset" },
  "map.click_hint": { ru: "Нажмите на страну, чтобы увидеть её концерты", en: "Click a country to see its concerts" },
  "map.visa_free_only": { ru: "Только без визы", en: "Visa-free only" },
  "map.concerts_in": { ru: "Концерты в стране", en: "Concerts in" },
  "map.close": { ru: "Закрыть", en: "Close" },

  // Мини-карта на странице артиста
  "minimap.countries": { ru: "Страны выступлений", en: "Performance countries" },

  // 404
  "notfound.title": { ru: "Страница не найдена", en: "Page not found" },
  "notfound.text": { ru: "Кажется, такой страницы не существует.", en: "Looks like this page doesn't exist." },

  // Подписка на уведомления
  "subscribe.title": { ru: "Уведомлять о новых концертах?", en: "Get notified about new concerts?" },
  "subscribe.subtitle": { ru: "Пришлём письмо, когда появятся новые даты за рубежом", en: "We'll email you when new dates abroad appear" },
  "subscribe.placeholder": { ru: "Ваш email", en: "Your email" },
  "subscribe.button": { ru: "Подписаться", en: "Subscribe" },
  "subscribe.button_short": { ru: "Уведомлять о концертах", en: "Get concert alerts" },
  "subscribe.only_visa_free": { ru: "Только страны без визы", en: "Only visa-free countries" },
  "subscribe.only_direct": { ru: "Только с прямым рейсом", en: "Only with direct flights" },
  "subscribe.filters_hint": { ru: "Фильтры по вашему паспорту и городу вылета", en: "Filtered by your passport and departure city" },
  "subscribe.sending": { ru: "Отправляем...", en: "Sending..." },
  "subscribe.check_email": { ru: "Почти готово! Проверьте почту и подтвердите подписку.", en: "Almost done! Check your email to confirm." },
  "subscribe.already": { ru: "Вы уже подписаны на этого артиста 👍", en: "You're already subscribed 👍" },
  "subscribe.invalid_email": { ru: "Введите корректный email", en: "Enter a valid email" },
  "subscribe.error": { ru: "Не удалось подписаться. Попробуйте позже.", en: "Couldn't subscribe. Try again later." },

  // Страница результата подписки
  "subscribed.ok_title": { ru: "Подписка подтверждена! 🎉", en: "Subscription confirmed! 🎉" },
  "subscribed.ok_text": { ru: "Будем присылать новые концерты артиста", en: "We'll send you new concerts by" },
  "subscribed.error_title": { ru: "Ссылка недействительна", en: "Invalid link" },
  "subscribed.error_text": { ru: "Возможно, подписка уже подтверждена или ссылка устарела.", en: "The link may be expired or already used." },
  "subscribed.unsub_title": { ru: "Вы отписались", en: "You're unsubscribed" },
  "subscribed.unsub_text": { ru: "Больше не будем присылать уведомления.", en: "We won't send you notifications anymore." },

  // Форма обратной связи
  "feedback.button": { ru: "Обратная связь", en: "Feedback" },
  "feedback.title": { ru: "Обратная связь", en: "Feedback" },
  "feedback.name": { ru: "Ваше имя", en: "Your name" },
  "feedback.name_placeholder": { ru: "Как вас зовут?", en: "What's your name?" },
  "feedback.email": { ru: "Email", en: "Email" },
  "feedback.email_placeholder": { ru: "email@example.com", en: "email@example.com" },
  "feedback.message": { ru: "Сообщение", en: "Message" },
  "feedback.message_placeholder": { ru: "Что можно улучшить? Что понравилось?", en: "What can we improve? What did you like?" },
  "feedback.artist": { ru: "Какого артиста не хватает?", en: "Which artist is missing?" },
  "feedback.artist_placeholder": { ru: "Например: Пошлая Молли, Скриптонит...", en: "e.g. Miyagi, Scriptonite..." },
  "feedback.artist_hint": { ru: "необязательно", en: "optional" },
  "feedback.send": { ru: "Отправить", en: "Send" },
  "feedback.sending": { ru: "Отправляем...", en: "Sending..." },
  "feedback.success": { ru: "Спасибо за обратную связь! 🙌", en: "Thanks for your feedback! 🙌" },
  "feedback.error": { ru: "Не удалось отправить. Попробуйте позже.", en: "Failed to send. Please try later." },
  "feedback.close": { ru: "Закрыть", en: "Close" },
  "feedback.required": { ru: "Обязательное поле", en: "Required field" },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Lang): string {
  return translations[key]?.[lang] ?? key;
}

// Склонение для русского, простая форма для английского
export function pluralizeI18n(
  n: number,
  lang: Lang,
  one: string,
  few: string,
  many: string,
  enSingular: string,
  enPlural: string,
): string {
  if (lang === "en") {
    return n === 1 ? enSingular : enPlural;
  }
  const abs = Math.abs(n);
  const mod10 = abs % 10;
  const mod100 = abs % 100;
  if (mod100 >= 11 && mod100 <= 19) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}
