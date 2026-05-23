import { NextResponse, type NextRequest } from "next/server";

import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { deleteReportById } from "@/lib/reports";
import { getPublicOrigin } from "@/lib/public-origin";

export const runtime = "nodejs";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export async function POST(request: NextRequest) {
  const wantsJson = request.headers.get("x-requested-with") === "XMLHttpRequest";
  const formData = await request.formData();
  const reportId = formData.get("report_id");

  if (typeof reportId !== "string" || !reportId) {
    const origin = getPublicOrigin(request);
    return wantsJson
      ? NextResponse.json({ ok: false, message: "ID laporan tidak valid." }, { status: 400 })
      : NextResponse.redirect(new URL("/admin?error=ID%20laporan%20tidak%20valid", origin || request.url), { status: 303 });
  }

  const origin = getPublicOrigin(request);
  const response = wantsJson
    ? NextResponse.json({ ok: true })
    : NextResponse.redirect(new URL("/admin?deleted=1", origin || request.url), { status: 303 });

  const auth = await getAuthenticatedAdmin();
  if (!auth) {
    const origin2 = getPublicOrigin(request);
    return wantsJson
      ? NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 })
      : NextResponse.redirect(new URL("/admin/login?error=Akses%20admin%20tidak%20valid", origin2 || request.url), {
          status: 303
        });
  }

  try {
    await deleteReportById(reportId);

    return wantsJson ? NextResponse.json({ ok: true }) : response;
  } catch (error) {
    const message = getErrorMessage(error);

    const origin3 = getPublicOrigin(request);
    return wantsJson
      ? NextResponse.json({ ok: false, message }, { status: 400 })
      : NextResponse.redirect(new URL(`/admin?error=${encodeURIComponent(message)}`, origin3 || request.url), {
          status: 303
        });
  }
}
