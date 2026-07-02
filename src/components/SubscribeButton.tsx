"use client";

import { useState, useEffect } from "react";
import { track } from "@vercel/analytics";
import { useSettings } from "@/components/SettingsContext";
import { t } from "@/lib/i18n";

export default function SubscribeButton({
  artistSlug,
  artistName,
  passport,
  originCity,
}: {
  artistSlug: string;
  artistName: string;
  passport: string;
  originCity: string;
}) {
  const { lang } = useSettings();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [visaFreeOnly, setVisaFreeOnly] = useState(false);
  const [directOnly, setDirectOnly] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "check" | "already" | "error" | "invalid">("idle");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (open) { setStatus("idle"); }
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus("invalid");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, artistSlug, artistName, passport, originCity, visaFreeOnly, directOnly }),
      });
      const data = await res.json();
      if (res.ok && data.already) setStatus("already");
      else if (res.ok) { setStatus("check"); track("subscribe", { artist: artistName }); }
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-500/10 border border-orange-500/40 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 font-medium px-5 py-2.5 rounded-xl transition-colors text-sm"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {t("subscribe.button_short", lang)}
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="font-semibold">{t("subscribe.title", lang)}</h2>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-5 py-4">
              {status === "check" || status === "already" ? (
                <div className="text-center py-6 space-y-4">
                  <p className="text-sm">{t(status === "check" ? "subscribe.check_email" : "subscribe.already", lang)}</p>
                  <button onClick={() => setOpen(false)} className="text-sm text-orange-500 hover:text-orange-600 font-medium">
                    {t("feedback.close", lang)}
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-3">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {t("subscribe.subtitle", lang)} <b className="text-zinc-700 dark:text-zinc-200">{artistName}</b>
                  </p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (status === "invalid" || status === "error") setStatus("idle"); }}
                    placeholder={t("subscribe.placeholder", lang)}
                    autoFocus
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  {status === "invalid" && <p className="text-xs text-red-400">{t("subscribe.invalid_email", lang)}</p>}
                  {status === "error" && <p className="text-xs text-red-400">{t("subscribe.error", lang)}</p>}

                  {/* Персональные фильтры уведомлений */}
                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                      <div className="relative">
                        <input type="checkbox" checked={visaFreeOnly} onChange={(e) => setVisaFreeOnly(e.target.checked)} className="sr-only peer" />
                        <div className="w-8 h-5 bg-zinc-300 dark:bg-zinc-700 rounded-full peer-checked:bg-orange-500 transition-colors" />
                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-3 transition-transform" />
                      </div>
                      {t("subscribe.only_visa_free", lang)}
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                      <div className="relative">
                        <input type="checkbox" checked={directOnly} onChange={(e) => setDirectOnly(e.target.checked)} className="sr-only peer" />
                        <div className="w-8 h-5 bg-zinc-300 dark:bg-zinc-700 rounded-full peer-checked:bg-orange-500 transition-colors" />
                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-3 transition-transform" />
                      </div>
                      {t("subscribe.only_direct", lang)}
                    </label>
                    {(visaFreeOnly || directOnly) && (
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500">{t("subscribe.filters_hint", lang)}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
                  >
                    {status === "sending" ? t("subscribe.sending", lang) : t("subscribe.button", lang)}
                  </button>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 text-center">
                    {t("consent.agree", lang)}{" "}
                    <a href="/privacy" target="_blank" className="underline hover:text-orange-500">{t("consent.policy", lang)}</a>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
