import { NextResponse } from "next/server";
import { listVisibleReports } from "@/lib/reports";

export async function GET() {
  const base = (process.env.NEXT_PUBLIC_APP_URL || "https://laporitdel.ifs25026.fun").replace(/\/$/, "");

  const staticUrls = ["/", "/laporan", "/tracking", "/developer"];

  const urls = staticUrls.map((p) => ({ loc: `${base}${p}`, lastmod: new Date().toISOString() }));

  try {
    const reports = await listVisibleReports();
    for (const r of reports.slice(0, 500)) {
      const loc = base ? `${base}/tracking?code=${encodeURIComponent(r.tracking_code)}` : `/tracking?code=${encodeURIComponent(r.tracking_code)}`;
      urls.push({ loc, lastmod: r.updated_at ?? r.created_at ?? new Date().toISOString() });
    }
  } catch (err) {
    console.error("Error building sitemap:", err);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${new Date(u.lastmod).toISOString()}</lastmod>\n  </url>`)
    .join("\n")}\n</urlset>`;

  return new NextResponse(xml, { headers: { "Content-Type": "application/xml" } });
}
