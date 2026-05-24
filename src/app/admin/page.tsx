import { redirect } from "next/navigation";

import AdminReportsPanel from "@/components/admin-reports-panel";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { listReportUpdatesByReportIds, listReportsWithError } from "@/lib/reports";
import type { ReportPriority, ReportStatus } from "@/types/report";

export const dynamic = "force-dynamic";


function getStatusWeight(status: ReportStatus) {
  const order: Record<ReportStatus, number> = {
    submitted: 0,
    in_review: 1,
    assigned: 2,
    in_progress: 3,
    resolved: 4,
    rejected: 5
  };

  return order[status];
}

type AdminPageProps = {
  searchParams: Promise<{ updated?: string; error?: string; deleted?: string; visibility?: string; noteDeleted?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { updated, error: actionError, deleted, visibility, noteDeleted } = await searchParams;
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
    resolved: reports.filter((report) => report.status === "resolved").length,
    highPriority: reports.filter((report) => report.priority === "high").length,
    hidden: reports.filter((report) => !report.show_in_tracking).length
  };

  const orderedReports = [...reports].sort((left, right) => {
    const statusDifference = getStatusWeight(left.status) - getStatusWeight(right.status);

    if (statusDifference !== 0) {
      return statusDifference;
    }

    const priorityOrder: Record<ReportPriority, number> = { high: 0, medium: 1, low: 2 };
    const priorityDifference = priorityOrder[left.priority] - priorityOrder[right.priority];

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    return new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime();
  });

  const pageReports = orderedReports.slice(0, 20);
  const updates = await listReportUpdatesByReportIds(pageReports.map((report) => report.id));
  const updatesByReport = updates.reduce<Record<string, typeof updates>>((acc, update) => {
    if (!acc[update.report_id]) {
      acc[update.report_id] = [];
    }

    acc[update.report_id].push(update);
    return acc;
  }, {});

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

      {noteDeleted === "1" ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Catatan admin berhasil dihapus.
        </div>
      ) : null}

      {actionError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Gagal memperbarui status: {actionError}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total laporan", value: stats.total },
          { label: "Masih diproses", value: stats.open },
          { label: "Prioritas tinggi", value: stats.highPriority },
          { label: "Disembunyikan", value: stats.hidden }
        ].map((item) => (
          <div key={item.label} className="card p-5">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="font-semibold text-slate-950">Antrian laporan</h3>
          <p className="mt-1 text-sm text-slate-500">Prioritas tinggi dan status aktif muncul lebih dulu.</p>
        </div>
        <AdminReportsPanel initialReports={pageReports} initialUpdatesByReport={updatesByReport} />
      </div>
    </div>
  );
}