import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { listReportUpdatesByReportIds, listReportsPage } from "@/lib/reports";

export async function GET(req: Request) {
  const auth = await getAuthenticatedAdmin();

  if (!auth) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const url = new URL(req.url);
  const q = url.searchParams.get("q");
  const status = url.searchParams.get("status");
  const priority = url.searchParams.get("priority");
  const showInTrackingParam = url.searchParams.get("show_in_tracking");
  const limitParam = url.searchParams.get("limit");
  const pageParam = url.searchParams.get("page");

  const limit = Math.min(100, Number.isFinite(Number(limitParam)) ? Number(limitParam) : 20);
  const page = Number.isFinite(Number(pageParam)) && Number(pageParam) > 0 ? Number(pageParam) : 1;
  const offset = (page - 1) * limit;

  const showInTracking = showInTrackingParam === null ? null : showInTrackingParam === "1" || showInTrackingParam === "true";

  const { reports, count } = await listReportsPage({ q, status, priority, showInTracking, limit, offset });
  const updates = await listReportUpdatesByReportIds(reports.map((report) => report.id));
  const updatesByReport = updates.reduce<Record<string, typeof updates>>((acc, update) => {
    if (!acc[update.report_id]) {
      acc[update.report_id] = [];
    }

    acc[update.report_id].push(update);
    return acc;
  }, {});

  return NextResponse.json({ reports, count, page, limit, updatesByReport });
}
