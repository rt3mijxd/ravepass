"use client";

import { use } from "react";
import { useSettings } from "@/components/SettingsContext";
import { t } from "@/lib/i18n";

export default function SubscribedPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; artist?: string }>;
}) {
  const { status, artist } = use(searchParams);
  const { lang } = useSettings();

  const isOk = status === "ok";
  const isUnsub = status === "unsubscribed";

  const title = isOk
    ? t("subscribed.ok_title", lang)
    : isUnsub
      ? t("subscribed.unsub_title", lang)
      : t("subscribed.error_title", lang);

  const text = isOk
    ? `${t("subscribed.ok_text", lang)}${artist ? " " + decodeURIComponent(artist) : ""}`
    : isUnsub
      ? t("subscribed.unsub_text", lang)
      : t("subscribed.error_text", lang);

  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
      <p className="text-5xl">{isOk ? "🎉" : isUnsub ? "👋" : "⚠️"}</p>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-zinc-400 dark:text-zinc-500">{text}</p>
      <a
        href="/"
        className="inline-block text-sm font-medium text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-xl px-5 py-2.5 hover:bg-orange-500/20 transition-colors"
      >
        {t("nav.back_home", lang)}
      </a>
    </div>
  );
}
