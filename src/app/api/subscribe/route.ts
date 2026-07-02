import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { sendEmail, isEmailConfigured } from "@/lib/resend";
import { confirmEmail } from "@/lib/email-templates";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function siteUrl(req: NextRequest): string {
  return process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
}

export async function POST(request: NextRequest) {
  try {
    const { email, artistSlug, artistName, passport, originCity, visaFreeOnly, directOnly } = (await request.json()) as {
      email?: string;
      artistSlug?: string;
      artistName?: string;
      passport?: string;
      originCity?: string;
      visaFreeOnly?: boolean;
      directOnly?: boolean;
    };

    const cleanEmail = (email ?? "").trim().toLowerCase();
    if (!EMAIL_RE.test(cleanEmail)) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }
    if (!artistSlug) {
      return NextResponse.json({ error: "artist_required" }, { status: 400 });
    }

    const supabase = getServiceClient();
    if (!supabase) {
      return NextResponse.json({ error: "storage_not_configured" }, { status: 503 });
    }

    // Уже есть подписка?
    const { data: existing } = await supabase
      .from("subscriptions")
      .select("id, confirmed, confirm_token")
      .eq("email", cleanEmail)
      .eq("artist_slug", artistSlug)
      .maybeSingle();

    let token: string;

    if (existing) {
      if (existing.confirmed) {
        return NextResponse.json({ success: true, already: true });
      }
      token = existing.confirm_token; // переотправим письмо с тем же токеном
    } else {
      const { data: inserted, error } = await supabase
        .from("subscriptions")
        .insert({
          email: cleanEmail,
          artist_slug: artistSlug,
          artist_name: artistName ?? null,
          passport: passport ?? null,
          origin_city: originCity ?? null,
          visa_free_only: Boolean(visaFreeOnly),
          direct_only: Boolean(directOnly),
        })
        .select("confirm_token")
        .single();
      if (error || !inserted) {
        console.error("Subscribe insert error:", error?.message);
        return NextResponse.json({ error: "failed" }, { status: 500 });
      }
      token = inserted.confirm_token;
    }

    // Отправляем письмо подтверждения
    if (isEmailConfigured()) {
      const confirmUrl = `${siteUrl(request)}/api/confirm?token=${token}`;
      const { subject, html } = confirmEmail(artistName ?? artistSlug, confirmUrl);
      const sent = await sendEmail(cleanEmail, subject, html);
      if (!sent) {
        return NextResponse.json({ error: "email_failed" }, { status: 502 });
      }
    } else {
      // Почта не настроена — подписка сохранена, но подтверждение не ушло
      return NextResponse.json({ success: true, emailPending: true });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
