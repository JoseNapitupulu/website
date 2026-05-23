import { NextResponse } from "next/server";

import { listReportsWithError } from "@/lib/reports";

export const runtime = "nodejs";

export async function GET() {
  const result = await listReportsWithError();

  return NextResponse.json(result);
}
