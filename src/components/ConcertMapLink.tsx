import Link from "next/link";
import { t, type Lang } from "@/lib/i18n";

interface ConcertMapLinkProps {
  lang: Lang;
  inSearch?: boolean;
  onHome?: boolean;
  isCurrent?: boolean;
}

export default function ConcertMapLink({ lang, inSearch, onHome, isCurrent }: ConcertMapLinkProps) {
  return (
    <Link
      href="/map"
      aria-label={t("nav.map", lang)}
      aria-current={isCurrent ? "page" : undefined}
      className={`rp-focus shrink-0 items-center rounded-xl border text-sm font-semibold transition-colors
        ${inSearch
          ? "hidden min-h-12 gap-2.5 border-orange-700/20 bg-orange-500/8 px-3.5 text-orange-900 hover:border-orange-600/55 hover:bg-orange-500/15 lg:inline-flex dark:border-orange-400/25 dark:text-orange-200"
          : `inline-flex min-h-11 gap-1 border-zinc-200 bg-zinc-50 px-2 text-zinc-700 sm:gap-1.5 sm:px-2.5 hover:border-orange-600/45 hover:text-orange-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:text-orange-200 ${onHome ? "lg:hidden" : ""}`}
        aria-[current=page]:border-orange-600/50 aria-[current=page]:text-orange-800 dark:aria-[current=page]:text-orange-200`}
    >
      <svg aria-hidden="true" className="size-[18px] shrink-0 text-orange-700 dark:text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3.5 6.5 5.5-2.5 6 2.5 5.5-2.5v13.5L15 20l-6-2.5L3.5 20V6.5ZM9 4v13.5m6-11V20" />
      </svg>
      {inSearch ? (
        <>
          {t("nav.map", lang)}
          <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 10h11m-4-4 4 4-4 4" />
          </svg>
        </>
      ) : (
        <>
          <span className="whitespace-nowrap sm:hidden">{t("nav.map_short", lang)}</span>
          <span className="hidden whitespace-nowrap sm:inline">{t("nav.map", lang)}</span>
        </>
      )}
    </Link>
  );
}
