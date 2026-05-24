import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface FeedbackEntry {
  timestamp: string;
  name: string;
  email: string;
  message: string;
  missingArtist?: string;
}

const FEEDBACK_FILE = path.join(process.cwd(), "feedback.json");

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

    const entry: FeedbackEntry = {
      timestamp: new Date().toISOString(),
      name: (name ?? "").trim(),
      email: (email ?? "").trim(),
      message: message.trim(),
      missingArtist: missingArtist?.trim() || undefined,
    };

    // Читаем существующие записи
    let entries: FeedbackEntry[] = [];
    try {
      const data = await fs.readFile(FEEDBACK_FILE, "utf-8");
      entries = JSON.parse(data);
    } catch {
      // Файл не существует — создадим
    }

    entries.push(entry);
    await fs.writeFile(FEEDBACK_FILE, JSON.stringify(entries, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
