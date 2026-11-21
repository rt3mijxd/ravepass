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
    return redirect(`/subscribed?status=error`);
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return redirect(`/subscribed?status=error`);
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .update({ confirmed: true })
    .eq("confirm_token", token)
    .select("artist_name, artist_slug")
    .maybeSingle();

  if (error || !data) {
    return redirect(`/subscribed?status=error`);
  }

  const name = encodeURIComponent(data.artist_name ?? data.artist_slug ?? "");
  return redirect(`/subscribed?status=ok&artist=${name}`);
}
