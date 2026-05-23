import { NextResponse, type NextRequest } from "next/server";

import { isAdminEmailAllowed } from "@/lib/admin-auth";
import { createSupabaseRouteClient } from "@/lib/supabase/server";
import { getPublicOrigin } from "@/lib/public-origin";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const isPublicAdminPath =
    pathname === "/admin/login" ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout";

  if (isPublicAdminPath) {
    return NextResponse.next();
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers
    }
  });

  const supabase = createSupabaseRouteClient(request, response);

  if (!supabase) {
    if (isAdminApi) {
      return NextResponse.json(
        { error: "Supabase belum dikonfigurasi. Set NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY." },
        { status: 500 }
      );
    }

    const origin = getPublicOrigin(request);
    const loginUrl = new URL("/admin/login", origin || request.url);
    loginUrl.searchParams.set("error", "Supabase belum dikonfigurasi.");
    return NextResponse.redirect(loginUrl);
  }

  const { data, error } = await supabase.auth.getUser();
  const user = data.user;
  const isAllowed = !error && isAdminEmailAllowed(user?.email);

  if (isAllowed) {
    return response;
  }

  if (isAdminApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const origin = getPublicOrigin(request);
  const loginUrl = new URL("/admin/login", origin || request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  loginUrl.searchParams.set("error", "Akses admin tidak valid atau sesi sudah habis.");
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
