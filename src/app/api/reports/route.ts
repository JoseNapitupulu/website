import { NextResponse } from "next/server";

import { createReport, parseReportFormData } from "@/lib/reports";

export const runtime = "nodejs";

function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const e = err as Record<string, unknown>;
    if ("message" in e && typeof e.message === "string") return e.message;
  }
  return String(err);
}

function getPublicOrigin(request: Request): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return new URL(request.url).origin;
}

export async function POST(request: Request) {
  const wantsJson = request.headers.get("x-requested-with") === "XMLHttpRequest";

  try {
    const formData = await request.formData();
    const { report, uploadSummary } = await createReport(parseReportFormData(formData));

    const redirectUrl = new URL(`/tracking?code=${report.tracking_code}`, getPublicOrigin(request));
    redirectUrl.searchParams.set("submitted", "1");
    redirectUrl.searchParams.set("uploaded", String(uploadSummary.uploaded));
    redirectUrl.searchParams.set("failed", String(uploadSummary.failed));
    if (uploadSummary.errors.length > 0) {
      redirectUrl.searchParams.set("uploadError", uploadSummary.errors[0]);
    }

    if (wantsJson) {
      return NextResponse.json({ ok: true, redirectTo: `${redirectUrl.pathname}${redirectUrl.search}` });
    }

    return NextResponse.redirect(redirectUrl, {
      status: 303
    });
  } catch (error) {
    const message = extractErrorMessage(error);

    if (wantsJson) {
      return NextResponse.json({ ok: false, message }, { status: 400 });
    }

    return NextResponse.redirect(new URL(`/laporan?error=${encodeURIComponent(message)}`, request.url), {
      status: 303
    });
  }
}