"use client";

import { useSettings } from "@/components/SettingsContext";
import { t } from "@/lib/i18n";

export default function Footer() {
  const { lang } = useSettings();

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 text-center space-y-2">
      <p className="text-sm font-medium">
        Rave<span className="text-orange-500">Pass</span>
      </p>
      <p className="text-xs text-zinc-500">
        © {new Date().getFullYear()} RavePass. {t("footer.rights", lang)}
      </p>
      <p className="flex items-center justify-center gap-3">
        <a href="/privacy" className="text-xs text-zinc-500 hover:text-orange-500 dark:hover:text-orange-400 transition-colors underline underline-offset-2">
          {t("footer.privacy", lang)}
        </a>
        <a href="mailto:ravepass@hotmail.com" className="text-xs text-zinc-500 hover:text-orange-500 dark:hover:text-orange-400 transition-colors underline underline-offset-2">
          {t("footer.contact", lang)}
        </a>
      </p>
      <p className="text-xs text-zinc-400 dark:text-zinc-600 max-w-xl mx-auto px-4">
        {t("footer.visa_disclaimer", lang)}
      </p>
      <p className="text-xs text-zinc-400 dark:text-zinc-600 max-w-xl mx-auto px-4">
        {t("footer.affiliate", lang)}
      </p>
    </footer>
  );
}
