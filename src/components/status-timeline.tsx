import type { ReportStatus } from "@/types/report";

const stages: Array<{ key: ReportStatus; label: string; description: string }> = [
  { key: "submitted", label: "Masuk", description: "Laporan diterima sistem" },
  { key: "in_review", label: "Ditinjau", description: "Admin memeriksa detail laporan" },
  { key: "assigned", label: "Diteruskan", description: "Laporan diteruskan ke unit terkait" },
  { key: "in_progress", label: "Dikerjakan", description: "Perbaikan sedang berjalan" },
  { key: "resolved", label: "Selesai", description: "Kerusakan sudah ditangani" }
];

export function StatusTimeline({ status }: { status: ReportStatus }) {
  const activeIndex = stages.findIndex((stage) => stage.key === status);

  return (
    <ol className="space-y-4">
      {stages.map((stage, index) => {
        const complete = index <= activeIndex;

        return (
          <li key={stage.key} className="flex gap-4">
            <div
              className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold ${
                complete
                  ? "border-campus-600 bg-campus-600 text-white"
                  : "border-slate-200 bg-white text-slate-400"
              }`}
            >
              {index + 1}
            </div>
            <div className="pb-4">
              <p className="font-semibold text-slate-900">{stage.label}</p>
              <p className="text-sm text-slate-600">{stage.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}