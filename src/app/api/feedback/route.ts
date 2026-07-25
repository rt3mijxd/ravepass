import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { rateLimit, clientIp } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    // Rate-limit: не более 5 отзывов с IP в минуту (антиспам)
    if (!rateLimit(`fb:${clientIp(request)}`, 5, 60_000)) {
      return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
    }

    const body = await request.json();
    const { name, email, message, missingArtist } = body as {
      name?: string;
      email?: string;
      message?: string;
      missingArtist?: string;
    };

    // Валидация
    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
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
      console.error("Feedback insert error:", error.message);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
