import { NextRequest, NextResponse } from "next/server";
import { siteOrigin, uuidPattern } from "@/lib/security";
import { getServiceClient } from "@/lib/supabase";

function redirect(path: string) {
  const response = NextResponse.redirect(new URL(path, siteOrigin()));
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token || !uuidPattern.test(token)) {
    return redirect(`/subscribed?status=unsub_error`);
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return redirect(`/subscribed?status=unsub_error`);
  }

  const { error } = await supabase.from("subscriptions").delete().eq("confirm_token", token);
  if (error) return redirect("/subscribed?status=unsub_error");
  return redirect(`/subscribed?status=unsubscribed`);
}
