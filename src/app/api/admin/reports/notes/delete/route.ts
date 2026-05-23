import { NextResponse } from "next/server";

import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { deleteReportUpdateById } from "@/lib/reports";
import { getPublicOrigin } from "@/lib/public-origin";

export const runtime = "nodejs";

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
  const updateId = formData.get("update_id");

  if (typeof updateId !== "string" || !updateId) {
    const origin = getPublicOrigin(request);
    return NextResponse.redirect(new URL("/admin?error=ID%20catatan%20tidak%20valid", origin || request.url), {
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

  try {
    await deleteReportUpdateById(updateId);

    const origin = getPublicOrigin(request);
    return NextResponse.redirect(new URL("/admin?noteDeleted=1", origin || request.url), {
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
