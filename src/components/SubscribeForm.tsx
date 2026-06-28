"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { useSettings } from "@/components/SettingsContext";
import { t } from "@/lib/i18n";

export default function SubscribeForm({ artistSlug, artistName }: { artistSlug: string; artistName: string }) {
  const { lang } = useSettings();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "check" | "already" | "error" | "invalid">("idle");

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
        body: JSON.stringify({ email, artistSlug, artistName }),
      });
      const data = await res.json();
      if (res.ok && data.already) {
        setStatus("already");
      } else if (res.ok) {
        setStatus("check");
        track("subscribe", { artist: artistName });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "check" || status === "already") {
    return (
      <section className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 text-center">
        <p className="text-sm">{t(status === "check" ? "subscribe.check_email" : "subscribe.already", lang)}</p>
      </section>
    );
  }

  return (
    <section className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 text-center space-y-3">
      <div>
        <p className="text-sm font-medium">{t("subscribe.title", lang)} {artistName}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{t("subscribe.subtitle", lang)}</p>
      </div>
      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (status === "invalid" || status === "error") setStatus("idle"); }}
          placeholder={t("subscribe.placeholder", lang)}
          className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded-xl transition-colors text-sm whitespace-nowrap"
        >
          {status === "sending" ? t("subscribe.sending", lang) : t("subscribe.button", lang)}
        </button>
      </form>
      {status === "invalid" && <p className="text-xs text-red-400">{t("subscribe.invalid_email", lang)}</p>}
      {status === "error" && <p className="text-xs text-red-400">{t("subscribe.error", lang)}</p>}
    </section>
  );
}
