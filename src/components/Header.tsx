"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ConcertMapLink from "@/components/ConcertMapLink";
import { useSettings } from "@/components/SettingsContext";
import { t } from "@/lib/i18n";
import FeedbackModal from "@/components/FeedbackModal";

const languages = [["ru", "RU", "Русский"], ["en", "EN", "English"]] as const;
const currencies = [["RUB", "₽"], ["USD", "$"], ["EUR", "€"]] as const;
const iconButton = "rp-focus inline-grid size-11 shrink-0 place-items-center rounded-xl text-zinc-600 transition-colors hover:bg-zinc-200/75 hover:text-zinc-950 sm:size-9 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white";
const segment = "rp-focus rounded-lg px-2.5 text-xs font-semibold text-zinc-600 transition-colors hover:text-zinc-950 aria-pressed:bg-white aria-pressed:text-zinc-950 aria-pressed:shadow-sm dark:text-zinc-400 dark:hover:text-white dark:aria-pressed:bg-zinc-700 dark:aria-pressed:text-white";
const segmentGroup = "flex min-h-11 items-stretch gap-0.5 rounded-xl border border-zinc-200 bg-zinc-100 p-0.5 sm:min-h-9 dark:border-zinc-800 dark:bg-zinc-900";

const feedbackIcon = (
  <svg aria-hidden="true" className="size-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.5 11.5a7.5 7.5 0 0 1-7.5 7.5H9l-4.5 2 1.2-4.3A7.5 7.5 0 0 1 4 12v-.5A7.5 7.5 0 0 1 11.5 4H13a7.5 7.5 0 0 1 7.5 7.5Z" />
    <path d="M8.5 11.5h.01m3.5 0h.01m3.5 0h.01" strokeWidth="2.2" />
  </svg>
);

export default function Header() {
  const pathname = usePathname();
  const { lang, setLang, currency, setCurrency, theme, setTheme } = useSettings();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButton.current?.focus();
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const themeLabel = theme === "dark"
    ? (lang === "ru" ? "Светлая тема" : "Light theme")
    : (lang === "ru" ? "Тёмная тема" : "Dark theme");

  function openFeedback() {
    setFeedbackOpen(true);
    setMenuOpen(false);
  }

  const themeButton = (
    <button type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={iconButton} title={themeLabel} aria-label={themeLabel}>
      <svg aria-hidden="true" className="size-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
        {theme === "dark" ? (
          <path d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.36 6.36-1.42-1.42M7.05 7.05 5.64 5.64m12.72 0-1.42 1.42m-9.89 9.89-1.41 1.41M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
        ) : (
          <path d="M20.4 15.4A9 9 0 0 1 8.6 3.6 9 9 0 1 0 20.4 15.4Z" />
        )}
      </svg>
    </button>
  );

  const langToggle = (
    <div role="group" aria-label={t("settings.language", lang)} className={segmentGroup}>
      {languages.map(([value, label, name]) => (
        <button key={value} type="button" onClick={() => setLang(value)}
          aria-pressed={lang === value} aria-label={name} className={segment}>
          {label}
        </button>
      ))}
    </div>
  );

  const currencyToggle = (
    <div role="group" aria-label={t("settings.currency", lang)} className={segmentGroup}>
      {currencies.map(([value, label]) => (
        <button key={value} type="button" onClick={() => setCurrency(value)}
          aria-pressed={currency === value} aria-label={value} className={segment}>
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4">
          <div className="flex min-w-0 items-center gap-3 sm:gap-5">
            <Link href="/" className="rp-focus flex shrink-0 items-center gap-2 rounded-lg">
              <Image src="/logo.svg" alt="" width={29} height={29} className="size-[29px] rounded-lg" preload />
              <span className="text-xl font-bold tracking-[-0.045em]">Rave<span className="text-orange-700 dark:text-orange-400">Pass</span></span>
            </Link>
            <ConcertMapLink lang={lang} onHome={pathname === "/"} isCurrent={pathname === "/map"} />
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            {langToggle}
            {currencyToggle}
            <div className="ml-1 flex gap-0.5 border-l border-zinc-200 pl-2 dark:border-zinc-800">
              {themeButton}
              <button type="button" onClick={openFeedback} className={iconButton}
                title={t("feedback.button", lang)} aria-label={t("feedback.button", lang)}>
                {feedbackIcon}
              </button>
            </div>
          </div>

          <div className="relative shrink-0 sm:hidden">
            <button type="button" ref={menuButton} onClick={() => setMenuOpen((value) => !value)}
              className={`${iconButton} border border-zinc-200 aria-expanded:bg-zinc-100 dark:border-zinc-800 dark:aria-expanded:bg-zinc-800`}
              title={t("settings.menu", lang)} aria-label={t("settings.menu", lang)}
              aria-expanded={menuOpen} aria-controls="header-settings">
              <svg aria-hidden="true" className="size-[19px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round">
                <path d="M4 7h9m4 0h3M4 12h3m4 0h9M4 17h11m4 0h1M13 5v4m-6 1v4m8 1v4" />
              </svg>
            </button>

            {menuOpen && (
              <>
                <div aria-hidden="true" className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div id="header-settings" className="absolute right-0 top-full z-50 mt-2 w-60 space-y-2 rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{t("settings.language", lang)}</span>
                    {langToggle}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{t("settings.currency", lang)}</span>
                    {currencyToggle}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{t("settings.theme", lang)}</span>
                    {themeButton}
                  </div>
                  <button type="button" onClick={openFeedback}
                    className="rp-focus flex min-h-11 w-full items-center gap-2 rounded-xl border border-zinc-200 px-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800">
                    {feedbackIcon}
                    {t("feedback.button", lang)}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}
    </>
  );
}
