import { NextResponse } from "next/server";

import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { updateReportStatus } from "@/lib/reports";
import type { ReportStatus } from "@/types/report";
import { getPublicOrigin } from "@/lib/public-origin";

export const runtime = "nodejs";

const validStatuses: ReportStatus[] = [
  "submitted",
  "in_review",
  "assigned",
  "in_progress",
  "resolved",
  "rejected"
];

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;

  if (error && typeof error === "object") {
    const maybeError = error as {
      message?: unknown;
      details?: unknown;
      hint?: unknown;
      code?: unknown;
    };

    const parts = [maybeError.message, maybeError.details, maybeError.hint, maybeError.code]
      .filter((part): part is string => typeof part === "string" && part.trim().length > 0)
      .map((part) => part.trim());

    if (parts.length > 0) {
      return parts.join(" | ");
    }
  }

  return String(error);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const reportId = formData.get("report_id");
  const status = formData.get("status");
  const note = formData.get("note");

  if (typeof reportId !== "string" || !reportId) {
    const origin = getPublicOrigin(request);
    return NextResponse.redirect(new URL("/admin?error=ID%20laporan%20tidak%20valid", origin || request.url), {
      status: 303
    });
  }

  if (typeof status !== "string" || !validStatuses.includes(status as ReportStatus)) {
    const origin2 = getPublicOrigin(request);
    return NextResponse.redirect(new URL("/admin?error=Status%20tidak%20valid", origin2 || request.url), {
      status: 303
    });
  }

  const auth = await getAuthenticatedAdmin();
  if (!auth) {
    const origin3 = getPublicOrigin(request);
    return NextResponse.redirect(new URL("/admin/login?error=Akses%20admin%20tidak%20valid", origin3 || request.url), {
      status: 303
    });
  }

  try {
    await updateReportStatus(
      reportId,
      status as ReportStatus,
      typeof note === "string" ? note.trim() || undefined : undefined
    );

    const origin4 = getPublicOrigin(request);
    return NextResponse.redirect(new URL("/admin?updated=1", origin4 || request.url), {
      status: 303
    });
  } catch (error) {
    const message = getErrorMessage(error);

    const origin5 = getPublicOrigin(request);
    return NextResponse.redirect(new URL(`/admin?error=${encodeURIComponent(message)}`, origin5 || request.url), {
      status: 303
    });
  }
}