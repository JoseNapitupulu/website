import type { ReportStatus } from "@/types/report";

const statusStyles: Record<ReportStatus, string> = {
  submitted: "bg-slate-100 text-slate-700",
  in_review: "bg-amber-100 text-amber-800",
  assigned: "bg-sky-100 text-sky-800",
  in_progress: "bg-indigo-100 text-indigo-800",
  resolved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800"
};

const statusLabels: Record<ReportStatus, string> = {
  submitted: "Masuk",
  in_review: "Ditinjau",
  assigned: "Diteruskan",
  in_progress: "Dikerjakan",
  resolved: "Selesai",
  rejected: "Ditolak"
};

export function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}