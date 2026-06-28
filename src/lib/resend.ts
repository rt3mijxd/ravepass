import { Resend } from "resend";

/**
 * Отправка писем через Resend.
 * Если ключ не настроен — функция вернёт false (вызывающий код это обработает).
 */
let cached: Resend | null = null;

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!cached) cached = new Resend(key);
  return cached;
}

// Адрес отправителя. Для прода нужен верифицированный домен в Resend,
// иначе письма дойдут только на адрес владельца аккаунта.
function fromAddress(): string {
  return process.env.RESEND_FROM || "RavePass <onboarding@resend.dev>";
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.error("Email: RESEND_API_KEY не настроен");
    return false;
  }
  try {
    const { error } = await resend.emails.send({ from: fromAddress(), to, subject, html });
    if (error) {
      console.error("Email send error:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Email send exception:", e);
    return false;
  }
}
