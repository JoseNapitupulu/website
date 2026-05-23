import { redirect } from "next/navigation";

import Link from "next/link";

import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { StatusBadge } from "@/components/status-badge";
import { listReports } from "@/lib/reports";
import type { ReportPriority, ReportStatus } from "@/types/report";

export const dynamic = "force-dynamic";

const statusOptions: Array<{ value: ReportStatus | "all"; label: string }> = [
  { value: "all", label: "Semua status" },
  { value: "submitted", label: "Masuk" },
  { value: "in_review", label: "Ditinjau" },
  { value: "assigned", label: "Diteruskan" },
  { value: "in_progress", label: "Dikerjakan" },
  { value: "resolved", label: "Selesai" },
  { value: "rejected", label: "Ditolak" }
];

const priorityOptions: Array<{ value: ReportPriority | "all"; label: string }> = [
  { value: "all", label: "Semua prioritas" },
  { value: "high", label: "Tinggi" },
  { value: "medium", label: "Sedang" },
  { value: "low", label: "Rendah" }
];

type AdminReportsPageProps = {
  searchParams: Promise<{ q?: string; status?: string; priority?: string }>;
};

export default async function AdminReportsPage({ searchParams }: AdminReportsPageProps) {
  const { q = "", status = "all", priority = "all" } = await searchParams;
  const auth = await getAuthenticatedAdmin();

  if (!auth) {
    redirect("/admin/login?next=/admin/reports");
  }

  const reports = await listReports();
  const searchQuery = q.trim().toLowerCase();

  const filteredReports = reports.filter((report) => {
    const matchesQuery =
      searchQuery.length === 0 ||
      [report.title, report.location, report.category, report.reporter_name, report.reporter_student_id, report.tracking_code]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery);

    const matchesStatus = status === "all" || report.status === status;
    const matchesPriority = priority === "all" || report.priority === priority;

    return matchesQuery && matchesStatus && matchesPriority;
  });

  const activeFiltersCount = Number(Boolean(searchQuery)) + Number(status !== "all") + Number(priority !== "all");

  return (
    <div className="space-y-4">
      <div className="card overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Daftar laporan</h2>
              <p className="mt-1 text-sm text-slate-500">
                Gunakan pencarian untuk nama, lokasi, kategori, kode tracking, atau NIM/NPM.
              </p>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              {filteredReports.length} hasil dari {reports.length} laporan
            </div>
          </div>
        </div>

        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
          <form className="grid gap-3 md:grid-cols-[1.5fr_0.9fr_0.9fr_auto]">
            <input
              name="q"
              defaultValue={q}
              placeholder="Cari judul, lokasi, kategori, kode, atau NIM/NPM"
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-500"
            />
            <select
              name="status"
              defaultValue={status}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              name="priority"
              defaultValue={priority}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-500"
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Terapkan
              </button>
              <Link
                href="/admin/reports"
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Reset
              </Link>
            </div>
          </form>
          {activeFiltersCount > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
              <span className="rounded-full bg-white px-3 py-1">Filter aktif: {activeFiltersCount}</span>
              {searchQuery ? <span className="rounded-full bg-white px-3 py-1">Cari: {q}</span> : null}
              {status !== "all" ? <span className="rounded-full bg-white px-3 py-1">Status: {status}</span> : null}
              {priority !== "all" ? <span className="rounded-full bg-white px-3 py-1">Prioritas: {priority}</span> : null}
            </div>
          ) : null}
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
              {filteredReports.map((report) => (
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
              {filteredReports.length === 0 ? (
                <tr>
                  <td className="px-6 py-8 text-slate-500" colSpan={5}>
                    Tidak ada laporan yang cocok dengan filter ini.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}