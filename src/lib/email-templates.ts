import type { Concert } from "@/types";

const BRAND = "#f97316";

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://ravepass.site";
}

function shell(inner: string): string {
  return `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#0a0a0a;padding:32px 16px;color:#e4e4e7">
    <div style="max-width:480px;margin:0 auto;background:#18181b;border:1px solid #27272a;border-radius:16px;overflow:hidden">
      <div style="padding:24px 24px 0">
        <div style="font-size:22px;font-weight:700">Rave<span style="color:${BRAND}">Pass</span></div>
      </div>
      <div style="padding:16px 24px 28px">${inner}</div>
    </div>
    <p style="max-width:480px;margin:16px auto 0;text-align:center;font-size:11px;color:#71717a">
      RavePass — концерты за рубежом
    </p>
  </div>`;
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:${BRAND};color:#fff;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:12px;font-size:15px">${label}</a>`;
}

// Письмо подтверждения подписки (double opt-in)
export function confirmEmail(artistName: string, confirmUrl: string): { subject: string; html: string } {
  return {
    subject: `Подтвердите подписку на ${artistName} — RavePass`,
    html: shell(`
      <h1 style="font-size:18px;margin:8px 0 12px">Подтвердите подписку</h1>
      <p style="font-size:14px;line-height:1.6;color:#a1a1aa;margin:0 0 20px">
        Вы подписываетесь на уведомления о новых концертах артиста
        <b style="color:#e4e4e7">${artistName}</b> за рубежом. Подтвердите, что это вы:
      </p>
      ${button(confirmUrl, "Подтвердить подписку")}
      <p style="font-size:12px;color:#71717a;margin:20px 0 0">
        Если вы не подписывались — просто проигнорируйте это письмо.
      </p>
    `),
  };
}

// Письмо о новых концертах артиста
export function newConcertsEmail(
  artistName: string,
  concerts: Concert[],
  unsubscribeUrl: string,
): { subject: string; html: string } {
  const rows = concerts
    .map((c) => {
      const date = new Date(c.date + "T12:00:00").toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
      return `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #27272a">
            <div style="font-size:14px;color:#e4e4e7">${c.city}${c.country ? ", " + c.country : ""}</div>
            <div style="font-size:12px;color:#a1a1aa">${date}${c.venue ? " · " + c.venue : ""}</div>
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #27272a;text-align:right">
            <a href="${siteUrl()}/concert/${c.id}" style="color:${BRAND};font-size:13px;text-decoration:none">Подробнее →</a>
          </td>
        </tr>`;
    })
    .join("");

  return {
    subject: `${artistName}: новые концерты за рубежом — RavePass`,
    html: shell(`
      <h1 style="font-size:18px;margin:8px 0 12px">Новые концерты: ${artistName}</h1>
      <p style="font-size:14px;line-height:1.6;color:#a1a1aa;margin:0 0 16px">
        Появились новые даты, на которые можно поехать:
      </p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">${rows}</table>
      ${button(`${siteUrl()}/artist/${concerts[0]?.artist.slug ?? ""}`, "Смотреть все концерты")}
      <p style="font-size:11px;color:#71717a;margin:24px 0 0">
        <a href="${unsubscribeUrl}" style="color:#71717a">Отписаться от уведомлений об этом артисте</a>
      </p>
    `),
  };
}
