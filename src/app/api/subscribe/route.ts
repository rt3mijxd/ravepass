import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { sendEmail, isEmailConfigured } from "@/lib/resend";
import { confirmEmail } from "@/lib/email-templates";
import { rateLimit, clientIp, readJsonObject, RequestBodyError, siteOrigin } from "@/lib/security";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    // Rate-limit: не более 5 подписок с IP в минуту (антифлуд/антибомбинг писем)
    if (!rateLimit(`sub:${clientIp(request)}`, 5, 60_000)) {
      return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
    }

    const { email, artistSlug, artistName, passport, originCity, visaFreeOnly, directOnly, emailLang } = await readJsonObject(request);
    if (typeof email !== "string" || email.length > 254 || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }
    if (typeof artistSlug !== "string" || !/^[a-z0-9а-яё]+(?:-[a-z0-9а-яё]+)*$/.test(artistSlug) || artistSlug.length > 128
      || (artistName != null && (typeof artistName !== "string" || artistName.length > 200))
      || (passport != null && (typeof passport !== "string" || !/^[A-Z]{2}$/.test(passport)))
      || (originCity != null && (typeof originCity !== "string" || !/^[A-Z]{3}$/.test(originCity)))
      || (visaFreeOnly != null && typeof visaFreeOnly !== "boolean")
      || (directOnly != null && typeof directOnly !== "boolean")
      || (emailLang != null && emailLang !== "ru" && emailLang !== "en")
      || (visaFreeOnly && !passport) || (directOnly && !originCity)) {
      return NextResponse.json({ error: "invalid_subscription" }, { status: 400 });
    }
    const cleanEmail = email.trim().toLowerCase();
    const safeArtistName = (artistName ?? "").replace(/[\r\n]+/g, " ").trim();
    if (!rateLimit(`subscribe-recipient:${cleanEmail}`, 3, 15 * 60_000)) {
      return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
    }

    const supabase = getServiceClient();
    if (!supabase || !isEmailConfigured()) {
      return NextResponse.json({ error: "storage_not_configured" }, { status: 503 });
    }

    // Уже есть подписка?
    const { data: existing, error: lookupError } = await supabase
      .from("subscriptions")
      .select("id, confirmed, confirm_token, email_lang")
      .eq("email", cleanEmail)
      .eq("artist_slug", artistSlug)
      .maybeSingle();
    if (lookupError) {
      console.error("Subscription lookup error code:", lookupError.code);
      return NextResponse.json({ error: "failed" }, { status: 500 });
    }

    const lang = emailLang ?? (existing?.email_lang === "en" ? "en" : "ru");
    let token: string;

    if (existing) {
      if (existing.confirmed) {
        return NextResponse.json({ success: true });
      }
      if (existing.email_lang !== lang) {
        const { data, error } = await supabase
          .from("subscriptions")
          .update({ email_lang: lang })
          .eq("id", existing.id)
          .eq("confirmed", false)
          .select("id")
          .maybeSingle();
        if (error) return NextResponse.json({ error: "failed" }, { status: 500 });
        if (!data) return NextResponse.json({ success: true });
      }
      token = existing.confirm_token;
    } else {
      const { data: inserted, error } = await supabase
        .from("subscriptions")
        .insert({
          email: cleanEmail,
          artist_slug: artistSlug,
          artist_name: safeArtistName || null,
          email_lang: lang,
          passport: passport ?? null,
          origin_city: originCity ?? null,
          visa_free_only: Boolean(visaFreeOnly),
          direct_only: Boolean(directOnly),
        })
        .select("confirm_token")
        .single();
      if (error || !inserted) {
        console.error("Subscribe insert error code:", error?.code);
        return NextResponse.json({ error: "failed" }, { status: 500 });
      }
      token = inserted.confirm_token;
    }

    const confirmUrl = `${siteOrigin()}/api/confirm?token=${token}`;
    const { subject, html } = confirmEmail(safeArtistName || artistSlug, confirmUrl, lang);
    if (!await sendEmail(cleanEmail, subject, html)) {
      return NextResponse.json({ error: "email_failed" }, { status: 502 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof RequestBodyError) return NextResponse.json({ error: "invalid_body" }, { status: error.status });
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
