import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { rateLimit, clientIp, readJsonObject, RequestBodyError } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    // Rate-limit: не более 5 отзывов с IP в минуту (антиспам)
    if (!rateLimit(`fb:${clientIp(request)}`, 5, 60_000)) {
      return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
    }

    const { name, email, message, missingArtist } = await readJsonObject(request);
    if (typeof message !== "string" || !message.trim() || message.length > 5000
      || (name != null && typeof name !== "string")
      || (email != null && typeof email !== "string")
      || (missingArtist != null && typeof missingArtist !== "string")) {
      return NextResponse.json({ error: "invalid_feedback" }, { status: 400 });
    }

    const supabase = getServiceClient();
    if (!supabase) {
      console.error("Feedback: Supabase не настроен (нет env-переменных)");
      return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
    }

    const { error } = await supabase.from("feedback").insert({
      name: (name ?? "").trim().slice(0, 200) || null,
      email: (email ?? "").trim().slice(0, 254) || null,
      message: message.trim().slice(0, 5000),
      missing_artist: missingArtist?.trim().slice(0, 200) || null,
    });

    if (error) {
      console.error("Feedback insert error code:", error.code);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof RequestBodyError) return NextResponse.json({ error: "invalid_body" }, { status: error.status });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
