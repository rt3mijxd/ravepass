"use client";

import { useSettings } from "@/components/SettingsContext";
import { t } from "@/lib/i18n";

export default function NotFound() {
  const { lang } = useSettings();
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
      <p className="text-6xl font-bold text-orange-500">404</p>
      <h1 className="text-2xl font-bold">{t("notfound.title", lang)}</h1>
      <p className="text-zinc-400 dark:text-zinc-500">{t("notfound.text", lang)}</p>
      <a
        href="/"
        className="inline-block text-sm font-medium text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-xl px-5 py-2.5 hover:bg-orange-500/20 transition-colors"
      >
        {t("nav.back_home", lang)}
      </a>
    </div>
  );
}
