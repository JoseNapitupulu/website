import { NextResponse } from "next/server";

import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { updateReportVisibility } from "@/lib/reports";
import { getPublicOrigin } from "@/lib/public-origin";

export const runtime = "nodejs";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const reportId = formData.get("report_id");
  const showValue = formData.get("show_in_tracking");

  if (typeof reportId !== "string" || !reportId) {
    const origin = getPublicOrigin(request);
    return NextResponse.redirect(new URL("/admin?error=ID%20laporan%20tidak%20valid", origin || request.url), {
      status: 303
    });
  }

  const auth = await getAuthenticatedAdmin();
  if (!auth) {
    const origin = getPublicOrigin(request);
    return NextResponse.redirect(new URL("/admin/login?error=Akses%20admin%20tidak%20valid", origin || request.url), {
      status: 303
    });
  }

  const showInTracking = showValue === "1" || showValue === "true";

  try {
    await updateReportVisibility(reportId, showInTracking);

    const origin = getPublicOrigin(request);
    return NextResponse.redirect(new URL(`/admin?visibility=${showInTracking ? "1" : "0"}`, origin || request.url), {
      status: 303
    });
  } catch (error) {
    const origin = getPublicOrigin(request);
    const message = getErrorMessage(error);
    return NextResponse.redirect(new URL(`/admin?error=${encodeURIComponent(message)}`, origin || request.url), {
      status: 303
    });
  }
}
