import { NextResponse, type NextRequest } from "next/server";

import { createSupabaseRouteClient } from "@/lib/supabase/server";
import { getPublicOrigin } from "@/lib/public-origin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const origin = getPublicOrigin(request);
  const response = NextResponse.redirect(new URL("/admin/login?signedOut=1", origin || request.url), {
    status: 303
  });
  const supabase = createSupabaseRouteClient(request, response);

  if (supabase) {
    await supabase.auth.signOut();
  }

  return response;
}
