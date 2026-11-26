export type Lang = "ru" | "en";
export type Currency = "RUB" | "USD" | "EUR";

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
  "home.title": { ru: "Концерты за рубежом", en: "Concerts abroad" },
  "home.subtitle": { ru: "Найди, где выступает любимый артист. Выбери поездку по визе и прямым рейсам.", en: "Find your favorite artists on tour. Filter by visa requirements and direct flights." },
  "home.filters": { ru: "Фильтры", en: "Filters" },
  "search.try_ticketmaster": { ru: "Поискать в Ticketmaster", en: "Search Ticketmaster" },
  "search.placeholder": { ru: "Найти артиста...", en: "Search artist..." },
  "lucky.button": { ru: "Мне повезёт", en: "I'm feeling lucky" },

  // Фильтры
  "filter.passport": { ru: "Паспорт", en: "Passport" },
  "filter.origin_city": { ru: "Город вылета", en: "Departure city" },
  "filter.country": { ru: "Страна", en: "Country" },
  "filter.all_countries": { ru: "Все страны", en: "All countries" },
  "filter.visa_free": { ru: "Без обычной визы", en: "No standard visa" },
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
  "visa.eta": { ru: "Нужно разрешение ETA", en: "ETA required" },
  "visa.entry_restricted": { ru: "Въезд ограничен", en: "Entry restricted" },
  "visa.unknown": { ru: "Уточните правила", en: "Check entry rules" },
  "visa.evisa": { ru: "Электронная виза", en: "E-visa" },
  "visa.visa_required": { ru: "Нужна виза", en: "Visa required" },
  "visa.has_visa_free": { ru: "Есть без обычной визы", en: "No standard visa options" },
  "visa.needs_visa": { ru: "Нужна виза", en: "Visa needed" },

  // Перелёты
  "flight.direct": { ru: "Прямой", en: "Direct" },
  "flight.connection": { ru: "Пересадка", en: "Connection" },
  "flight.direct_full": { ru: "Прямой рейс", en: "Direct flight" },
  "flight.connection_full": { ru: "С пересадкой", en: "With connection" },
  "flight.no_data": { ru: "Нет данных о перелётах из", en: "No flight data from" },

  // Детали концерта
  "concert.not_found": { ru: "Концерт не найден", en: "Concert not found" },
  "concert.your_trip": { ru: "Ваша поездка", en: "Your trip" },
  "concert.visa": { ru: "Въезд в страну", en: "Entry requirements" },
  "concert.flight": { ru: "Перелёт", en: "Flight" },
  "concert.flight_from": { ru: "Перелёт от", en: "Flight from" },
  "concert.budget": { ru: "Примерный бюджет", en: "Estimated budget" },
  "concert.ticket": { ru: "Билет на концерт", en: "Concert ticket" },
  "concert.rates": { ru: "Справочные курсы Frankfurter", en: "Frankfurter reference rates" },
  "concert.price_tbd": { ru: "Цена уточняется", en: "Price TBD" },
  "concert.total_from": { ru: "Итого от", en: "Total from" },
  "concert.sold_out": { ru: "Билеты распроданы ↗", en: "Sold out ↗" },
  "concert.buy_tickets": { ru: "Купить билеты", en: "Buy tickets" },
  "concert.find_flights": { ru: "Найти авиабилеты", en: "Find flights" },
  "concert.verify_entry": { ru: "Проверить правила въезда", en: "Check entry requirements" },
  "concert.visa_verified": { ru: "Проверено по официальному источнику", en: "Checked against an official source" },
  "concert.visa_source": { ru: "Официальный источник", en: "Official source" },
  "concert.visa_updated": { ru: "Дата визового справочника", en: "Visa reference date" },
  "concert.all_concerts_by": { ru: "Все концерты", en: "All concerts by" },
  "concert.notify": { ru: "Хотите узнать о новых концертах", en: "Want to know about new concerts by" },
  "concert.notify_btn": { ru: "Уведомить о новых концертах", en: "Notify about new concerts" },

  // Страница артиста
  "artist.not_found": { ru: "Артист не найден", en: "Artist not found" },
  "artist.tour": { ru: "Тур", en: "Tour" },
  "artist.available_visa_free": { ru: "без обычной визы", en: "without a standard visa" },
  "artist.no_visa_free": { ru: "нет без обычной визы", en: "none without a standard visa" },
  "artist.from": { ru: "от", en: "from" },

  // Навигация
  "nav.back_all": { ru: "← Все концерты", en: "← All concerts" },
  "nav.back_home": { ru: "← На главную", en: "← Home" },
  "nav.more": { ru: "ещё", en: "more" },

  // Единицы
  "unit.h": { ru: "ч", en: "h" },
  "unit.ticket_plus": { ru: "+ билет", en: "+ ticket" },

  // Пустые состояния
  "empty.artist_not_in_catalog": { ru: "В афише RavePass такого артиста пока нет", en: "This artist isn’t in the RavePass listings yet" },
  "empty.artist_not_found": { ru: "Артист «{query}» не найден", en: "Artist \"{query}\" not found" },
  "empty.catalog_unavailable": {
    ru: "Не удалось загрузить афишу. Попробуйте обновить страницу позже.",
    en: "Couldn’t load the concert listings. Please try refreshing later.",
  },
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
  "nav.map_short": { ru: "Карта", en: "Map" },

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
  "map.unavailable": { ru: "Не удалось загрузить карту", en: "Could not load the map" },
  "map.hint": { ru: "Колёсико мыши — зум, перетаскивание — перемещение", en: "Scroll to zoom, drag to pan" },
  "map.reset": { ru: "Сбросить", en: "Reset" },
  "map.click_hint": { ru: "Нажмите на страну, чтобы увидеть её концерты", en: "Click a country to see its concerts" },
  "map.visa_free_only": { ru: "Без обычной визы", en: "No standard visa" },
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
  "subscribe.only_visa_free": { ru: "Без обычной визы", en: "No standard visa" },
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
