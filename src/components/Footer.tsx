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
      <p className="text-xs text-zinc-400 dark:text-zinc-600">
        {t("footer.visa_disclaimer", lang)}
      </p>
    </footer>
  );
}
