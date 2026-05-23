import { redirect } from "next/navigation";

import { StatusBadge } from "@/components/status-badge";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { listReportsWithError } from "@/lib/reports";
import type { ReportStatus } from "@/types/report";

export const dynamic = "force-dynamic";

const statusOptions: Array<{ value: ReportStatus; label: string }> = [
  { value: "submitted", label: "Masuk" },
  { value: "in_review", label: "Ditinjau" },
  { value: "assigned", label: "Diteruskan" },
  { value: "in_progress", label: "Dikerjakan" },
  { value: "resolved", label: "Selesai" },
  { value: "rejected", label: "Ditolak" }
];

type AdminPageProps = {
  searchParams: Promise<{ updated?: string; error?: string; deleted?: string; visibility?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { updated, error: actionError, deleted, visibility } = await searchParams;
  const auth = await getAuthenticatedAdmin();

  if (!auth) {
    redirect("/admin/login?next=/admin");
  }

  const { reports, error } = await listReportsWithError();

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <span className="inline-flex rounded-full bg-campus-100 px-4 py-2 text-sm font-semibold text-campus-700">
            Dashboard admin
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">Ringkasan laporan masuk</h2>
        </div>

        <div className="card p-6">
          <p className="text-sm text-slate-700">
            Supabase error: <strong>{error}</strong>
          </p>
          <p className="mt-3 text-sm text-slate-700">
            Periksa konfigurasi environment dan pastikan tabel <strong>damage_reports</strong> ada di database.
          </p>
        </div>
      </div>
    );
  }

  const stats = {
    total: reports.length,
    open: reports.filter((report) => report.status !== "resolved" && report.status !== "rejected").length,
    resolved: reports.filter((report) => report.status === "resolved").length
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-campus-100 px-4 py-2 text-sm font-semibold text-campus-700">
            Dashboard admin
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">Ringkasan laporan masuk</h2>
          <p className="mt-2 text-sm text-slate-500">Masuk sebagai {auth.user?.email ?? "admin"}</p>
        </div>

        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:text-rose-700"
          >
            Logout
          </button>
        </form>
      </div>

      {updated === "1" ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Status laporan berhasil diperbarui.
        </div>
      ) : null}

      {deleted === "1" ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Laporan selesai berhasil dihapus.
        </div>
      ) : null}

      {visibility === "1" ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Laporan berhasil ditampilkan di tracking.
        </div>
      ) : null}

      {visibility === "0" ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Laporan berhasil disembunyikan dari tracking.
        </div>
      ) : null}

      {actionError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Gagal memperbarui status: {actionError}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Total laporan", value: stats.total },
          { label: "Masih diproses", value: stats.open },
          { label: "Selesai", value: stats.resolved }
        ].map((item) => (
          <div key={item.label} className="card p-5">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="font-semibold text-slate-950">Laporan terbaru</h3>
        </div>
        <div className="divide-y divide-slate-200">
          {reports.slice(0, 10).map((report) => (
            <div key={report.id} className="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium text-slate-950">{report.title}</p>
                <p className="text-sm text-slate-500">{report.location}</p>
              </div>
              <div className="flex w-full flex-col gap-3 md:w-auto md:items-end">
                <StatusBadge status={report.status} />
                <form action="/api/admin/reports/status" method="post" className="grid gap-2 md:grid-cols-[180px_220px_auto]">
                  <input type="hidden" name="report_id" value={report.id} />
                  <select
                    name="status"
                    defaultValue={report.status}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-campus-500"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <input
                    name="note"
                    placeholder="Catatan admin (opsional)"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-campus-500"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                  >
                    Simpan
                  </button>
                </form>
                <form action="/api/admin/reports/visibility" method="post" className="md:self-end">
                  <input type="hidden" name="report_id" value={report.id} />
                  <input type="hidden" name="show_in_tracking" value={report.show_in_tracking ? "0" : "1"} />
                  <button
                    type="submit"
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${report.show_in_tracking
                      ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}
                  >
                    {report.show_in_tracking ? "Sembunyikan dari tracking" : "Tampilkan di tracking"}
                  </button>
                </form>
                {report.status === "resolved" ? (
                  <form action="/api/admin/reports/delete" method="post" className="md:self-end">
                    <input type="hidden" name="report_id" value={report.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                    >
                      Hapus laporan selesai
                    </button>
                  </form>
                ) : null}
              </div>
            </div>
          ))}
          {reports.length === 0 ? (
            <div className="px-6 py-8 text-sm text-slate-500">Belum ada laporan masuk.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}