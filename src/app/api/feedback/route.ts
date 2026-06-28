import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
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
      name: (name ?? "").trim() || null,
      email: (email ?? "").trim() || null,
      message: message.trim(),
      missing_artist: missingArtist?.trim() || null,
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
