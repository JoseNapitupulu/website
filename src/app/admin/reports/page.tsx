import { redirect } from "next/navigation";

import Link from "next/link";

import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { StatusBadge } from "@/components/status-badge";
import { listReports } from "@/lib/reports";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const auth = await getAuthenticatedAdmin();

  if (!auth) {
    redirect("/admin/login?next=/admin/reports");
  }

  const reports = await listReports();

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-slate-950">Daftar laporan</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Judul</th>
              <th className="px-6 py-3 font-medium">Lokasi</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Tampil di tracking</th>
              <th className="px-6 py-3 font-medium">Kode tracking</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 font-medium text-slate-900">{report.title}</td>
                <td className="px-6 py-4 text-slate-600">{report.location}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={report.status} />
                </td>
                <td className="px-6 py-4 text-campus-700">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${report.show_in_tracking ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
                  >
                    {report.show_in_tracking ? "Ya" : "Tidak"}
                  </span>
                </td>
                <td className="px-6 py-4 text-campus-700">
                  <Link href={`/tracking?code=${report.tracking_code}`}>{report.tracking_code}</Link>
                </td>
              </tr>
            ))}
            {reports.length === 0 ? (
              <tr>
                <td className="px-6 py-8 text-slate-500" colSpan={5}>
                  Belum ada laporan yang tersimpan di database.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}