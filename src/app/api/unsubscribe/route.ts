import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

function siteUrl(req: NextRequest): string {
  return process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const base = siteUrl(request);

  if (!token) {
    return NextResponse.redirect(`${base}/subscribed?status=unsub_error`);
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return NextResponse.redirect(`${base}/subscribed?status=unsub_error`);
  }

  await supabase.from("subscriptions").delete().eq("confirm_token", token);
  return NextResponse.redirect(`${base}/subscribed?status=unsubscribed`);
}
