import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

function siteUrl(req: NextRequest): string {
  return process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const base = siteUrl(request);

  if (!token) {
    return NextResponse.redirect(`${base}/subscribed?status=error`);
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return NextResponse.redirect(`${base}/subscribed?status=error`);
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .update({ confirmed: true })
    .eq("confirm_token", token)
    .select("artist_name, artist_slug")
    .maybeSingle();

  if (error || !data) {
    return NextResponse.redirect(`${base}/subscribed?status=error`);
  }

  const name = encodeURIComponent(data.artist_name ?? data.artist_slug ?? "");
  return NextResponse.redirect(`${base}/subscribed?status=ok&artist=${name}`);
}
