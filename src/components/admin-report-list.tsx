"use client";

import { useMemo } from "react";
import { StatusBadge } from "@/components/status-badge";
import type { DamageReport, ReportUpdate } from "@/types/report";

type Props = {
  reports: DamageReport[];
  updatesByReport: Record<string, ReportUpdate[]>;
  loading?: boolean;
};

const priorityLabels: Record<string, string> = {
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi"
};

const priorityClasses: Record<string, string> = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  high: "border-rose-200 bg-rose-50 text-rose-700"
};

export default function AdminReportList({ reports, updatesByReport, loading }: Props) {
  const ordered = useMemo(() => {
    const getStatusWeight = (status: string) => {
      const order: Record<string, number> = {
        submitted: 0,
        in_review: 1,
        assigned: 2,
        in_progress: 3,
        resolved: 4,
        rejected: 5
      };

      return order[status] ?? 99;
    };

    return [...reports].sort((left, right) => {
      const statusDifference = getStatusWeight(left.status) - getStatusWeight(right.status);
      if (statusDifference !== 0) return statusDifference;
      const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
      const priorityDifference = priorityOrder[left.priority] - priorityOrder[right.priority];
      if (priorityDifference !== 0) return priorityDifference;
      return new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime();
    });
  }, [reports]);

  if (loading) {
    const skeletons = Array.from({ length: 6 }).map((_, idx) => (
      <div key={idx} className="flex animate-pulse flex-col gap-4 px-6 py-4 md:flex-row md:items-start md:justify-between">
        <div className="w-full">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="mt-3 h-5 w-1/2 rounded bg-slate-200" />
          <div className="mt-2 h-3 w-1/3 rounded bg-slate-200" />
          <div className="mt-3 flex gap-2">
            <div className="h-6 w-20 rounded bg-slate-200" />
            <div className="h-6 w-24 rounded bg-slate-200" />
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 md:w-auto md:items-end">
          <div className="h-8 w-28 rounded bg-slate-200" />
          <div className="mt-2 h-20 w-56 rounded bg-slate-200" />
        </div>
      </div>
    ));

    return <div className="divide-y divide-slate-200">{skeletons}</div>;
  }

  return (
    <div className="divide-y divide-slate-200">
      {ordered.slice(0, 100).map((report) => (
        <div key={report.id} className={`flex flex-col gap-4 px-6 py-4 md:flex-row md:items-start md:justify-between ${report.priority === "high" ? "ring-2 ring-rose-50" : ""}`}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{report.tracking_code}</p>
            <p className="mt-1 font-medium text-slate-950">{report.title}</p>
            <p className="text-sm text-slate-500">{report.location}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
              <span className="rounded-full bg-slate-100 px-3 py-1">{report.reporter_name}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">{report.reporter_student_id || "NIM belum diisi"}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">{priorityLabels[report.priority]}</span>
              <span className={`rounded-full border px-3 py-1 ${priorityClasses[report.priority]}`}>{report.show_in_tracking ? "Tampil tracking" : "Disembunyikan"}</span>
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 md:w-auto md:items-end">
            <StatusBadge status={report.status} />
            <form action="/api/admin/reports/status" method="post" className="grid gap-2 md:grid-cols-[180px_220px_auto]">
              <input type="hidden" name="report_id" value={report.id} />
              <select name="status" defaultValue={report.status} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-campus-500">
                <option value="submitted">Masuk</option>
                <option value="in_review">Ditinjau</option>
                <option value="assigned">Diteruskan</option>
                <option value="in_progress">Dikerjakan</option>
                <option value="resolved">Selesai</option>
                <option value="rejected">Ditolak</option>
              </select>
              <input name="note" placeholder="Catatan admin (opsional)" className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-campus-500" />
              <button type="submit" className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700">Simpan</button>
            </form>

            <form action="/api/admin/reports/visibility" method="post" className="md:self-end">
              <input type="hidden" name="report_id" value={report.id} />
              <input type="hidden" name="show_in_tracking" value={report.show_in_tracking ? "0" : "1"} />
              <button type="submit" className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${report.show_in_tracking ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100" : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}>
                {report.show_in_tracking ? "Sembunyikan dari tracking" : "Tampilkan di tracking"}
              </button>
            </form>

            {report.status === "resolved" ? (
              <form action="/api/admin/reports/delete" method="post" className="md:self-end">
                <input type="hidden" name="report_id" value={report.id} />
                <button type="submit" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100">Hapus laporan selesai</button>
              </form>
            ) : null}

            {updatesByReport[report.id]?.length ? (
              <div className="mt-2 w-full space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:w-[560px]">
                <h4 className="text-sm font-semibold text-slate-900">Catatan admin</h4>
                <div className="space-y-2">
                  {updatesByReport[report.id].map((update) => (
                    <div key={update.id} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <StatusBadge status={update.status} />
                        <span className="text-xs text-slate-500">{new Date(update.created_at).toLocaleString("id-ID")}</span>
                      </div>
                      <p className="mt-2 text-slate-700">{update.note || "Status diperbarui admin."}</p>
                      <form action="/api/admin/reports/notes/delete" method="post" className="mt-3">
                        <input type="hidden" name="update_id" value={update.id} />
                        <button type="submit" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 transition hover:bg-rose-100">Hapus catatan</button>
                      </form>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ))}

      {reports.length === 0 ? <div className="px-6 py-8 text-sm text-slate-500">Belum ada laporan sesuai filter.</div> : null}
    </div>
  );
}
