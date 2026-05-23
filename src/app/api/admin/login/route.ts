import { NextResponse, type NextRequest } from "next/server";

import { isAdminEmailAllowed, sanitizeNextPath } from "@/lib/admin-auth";
import { createSupabaseRouteClient } from "@/lib/supabase/server";
import { getPublicOrigin } from "@/lib/public-origin";

export const runtime = "nodejs";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");
  const nextValue = formData.get("next");
  const email = typeof emailValue === "string" ? emailValue.trim() : "";
  const password = typeof passwordValue === "string" ? passwordValue : "";
  const nextPath = sanitizeNextPath(
    typeof nextValue === "string" ? nextValue : null,
    "/admin"
  );

  const redirectToLogin = (message: string) => {
    const origin = getPublicOrigin(request);
    const url = new URL("/admin/login", origin || request.url);
    url.searchParams.set("error", message);
    url.searchParams.set("next", nextPath);
    return NextResponse.redirect(url, { status: 303 });
  };

  if (!email || !password) {
    return redirectToLogin("Email dan password wajib diisi.");
  }

  const origin = getPublicOrigin(request);
  const response = NextResponse.redirect(new URL(nextPath, origin || request.url), { status: 303 });
  const supabase = createSupabaseRouteClient(request, response);

  if (!supabase) {
    return redirectToLogin("Supabase belum dikonfigurasi.");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return redirectToLogin(getErrorMessage(error));
  }

  if (!isAdminEmailAllowed(data.user?.email)) {
    await supabase.auth.signOut();
    return redirectToLogin("Akun ini tidak diizinkan mengakses admin.");
  }

  return response;
}
