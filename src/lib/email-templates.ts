import { formatConcertDate } from "@/lib/dates";
import { concertLocation } from "@/lib/country-label";
import { escapeHtml, siteOrigin } from "@/lib/security";
import type { Lang } from "@/lib/i18n";
import type { Concert } from "@/types";

const BRAND = "#f97316";

const emailCopy = {
  ru: {
    footer: "RavePass — концерты за рубежом",
    confirmSubject: (artist: string) => `Подтвердите подписку на ${artist} — RavePass`,
    confirmTitle: "Подтвердите подписку",
    confirmIntro: (artist: string) => `Вы запросили уведомления о новых концертах артиста <strong>${artist}</strong> за рубежом. Подтвердите подписку, чтобы получать их на эту почту.`,
    ignore: "Если вы не оформляли подписку, просто проигнорируйте это письмо.",
    newsSubject: (artist: string) => `${artist}: новые концерты за рубежом — RavePass`,
    newsTitle: (artist: string) => `Новые концерты: ${artist}`,
    newsIntro: "Появились новые даты концертов:",
    details: "Подробнее",
    allShows: "Смотреть все концерты",
    unsubscribe: "Отписаться от уведомлений об этом артисте",
  },
  en: {
    footer: "RavePass — concerts abroad",
    confirmSubject: (artist: string) => `Confirm your subscription to ${artist} — RavePass`,
    confirmTitle: "Confirm your subscription",
    confirmIntro: (artist: string) => `You asked for alerts about new <strong>${artist}</strong> concerts abroad. Confirm your subscription to receive them at this email address.`,
    ignore: "If you didn't request this subscription, you can ignore this email.",
    newsSubject: (artist: string) => `${artist}: new concerts abroad — RavePass`,
    newsTitle: (artist: string) => `New concerts: ${artist}`,
    newsIntro: "New concert dates have been announced:",
    details: "View concert",
    allShows: "View all concerts",
    unsubscribe: "Unsubscribe from this artist's alerts",
  },
};

function shell(inner: string, lang: Lang): string {
  return `
  <div lang="${lang}" style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#0a0a0a;padding:32px 16px;color:#e4e4e7">
    <div style="max-width:480px;margin:0 auto;background:#18181b;border:1px solid #27272a;border-radius:16px;overflow:hidden">
      <div style="padding:24px 24px 0">
        <div style="font-size:22px;font-weight:700">Rave<span style="color:${BRAND}">Pass</span></div>
      </div>
      <div style="padding:16px 24px 28px">${inner}</div>
    </div>
    <p style="max-width:480px;margin:16px auto 0;text-align:center;font-size:11px;color:#a1a1aa">
      ${emailCopy[lang].footer}
    </p>
  </div>`;
}

function button(href: string, label: string): string {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;background:${BRAND};color:#18181b;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:12px;font-size:15px">${label}</a>`;
}

export function confirmEmail(artistName: string, confirmUrl: string, lang: Lang): { subject: string; html: string } {
  const copy = emailCopy[lang];
  return {
    subject: copy.confirmSubject(artistName.replace(/[\r\n]+/g, " ")),
    html: shell(`
      <h1 style="font-size:18px;margin:8px 0 12px">${copy.confirmTitle}</h1>
      <p style="font-size:14px;line-height:1.6;color:#a1a1aa;margin:0 0 20px">
        ${copy.confirmIntro(escapeHtml(artistName))}
      </p>
      ${button(confirmUrl, copy.confirmTitle)}
      <p style="font-size:12px;color:#a1a1aa;margin:20px 0 0">${copy.ignore}</p>
    `, lang),
  };
}

export function newConcertsEmail(
  artistName: string,
  concerts: Concert[],
  unsubscribeUrl: string,
  lang: Lang,
): { subject: string; html: string } {
  const copy = emailCopy[lang];
  const base = siteOrigin();
  const rows = concerts
    .map((concert) => {
      const date = formatConcertDate(concert, lang, { day: "numeric", month: "long", year: "numeric" });
      const location = escapeHtml(concertLocation(concert, lang));
      const venue = concert.venue ? ` · ${escapeHtml(concert.venue)}` : "";
      const href = escapeHtml(`${base}/concert/${encodeURIComponent(concert.id)}`);
      return `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #27272a">
            <div style="font-size:14px;color:#e4e4e7">${location}</div>
            <div style="font-size:12px;color:#a1a1aa">${date}${venue}</div>
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #27272a;text-align:right">
            <a href="${href}" style="color:${BRAND};font-size:13px;text-decoration:none">${copy.details} →</a>
          </td>
        </tr>`;
    })
    .join("");
  const artistHref = `${base}/artist/${encodeURIComponent(concerts[0]?.artist.slug ?? "")}`;

  return {
    subject: copy.newsSubject(artistName.replace(/[\r\n]+/g, " ")),
    html: shell(`
      <h1 style="font-size:18px;margin:8px 0 12px">${copy.newsTitle(escapeHtml(artistName))}</h1>
      <p style="font-size:14px;line-height:1.6;color:#a1a1aa;margin:0 0 16px">${copy.newsIntro}</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">${rows}</table>
      ${button(artistHref, copy.allShows)}
      <p style="font-size:11px;color:#a1a1aa;margin:24px 0 0">
        <a href="${escapeHtml(unsubscribeUrl)}" style="color:#a1a1aa">${copy.unsubscribe}</a>
      </p>
    `, lang),
  };
}
