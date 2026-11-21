"use client";

import { useSettings } from "@/components/SettingsContext";
import { artistPhotos } from "@/data/artist-photos";
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
      <details className="mx-auto max-w-xl px-4 text-xs text-zinc-600 dark:text-zinc-400">
        <summary className="rp-focus inline-block cursor-pointer rounded underline underline-offset-2">
          {lang === "ru" ? "Авторы фото" : "Photo credits"}
        </summary>
        <ul className="mt-2 space-y-1">
          {Object.values(artistPhotos).map(({ imageUrl, name, source, credit, license, licenseUrl }) => (
            <li key={imageUrl}>
              <a className="underline underline-offset-2" href={source}>{name} · {credit}</a>
              {" · "}
              <a className="underline underline-offset-2" href={licenseUrl}>{license}</a>
            </li>
          ))}
        </ul>
        <p className="mt-2">{lang === "ru" ? "Размер и кадрирование адаптированы для сайта." : "Images resized and cropped for display."}</p>
      </details>
      <p className="text-xs text-zinc-400 dark:text-zinc-600 max-w-xl mx-auto px-4">
        {t("footer.visa_disclaimer", lang)}
      </p>
      <p className="text-xs text-zinc-400 dark:text-zinc-600 max-w-xl mx-auto px-4">
        {t("footer.affiliate", lang)}
      </p>
    </footer>
  );
}
