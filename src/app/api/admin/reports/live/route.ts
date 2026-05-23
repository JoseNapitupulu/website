import { NextResponse } from "next/server";

import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { listReportsWithError } from "@/lib/reports";

export const runtime = "nodejs";

export async function GET() {
  const auth = await getAuthenticatedAdmin();

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { reports, error } = await listReportsWithError();

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({
    count: reports.length,
    latestTrackingCode: reports[0]?.tracking_code ?? null,
    latestUpdatedAt: reports[0]?.updated_at ?? null
  });
}
