import Image from "next/image";
import { StatusBadge } from "@/components/status-badge";
import { getReportByTrackingCode, listReportUpdates, listVisibleReports } from "@/lib/reports";

export const dynamic = "force-dynamic";

type TrackingPageProps = {
  searchParams: Promise<{ code?: string; submitted?: string; uploaded?: string; failed?: string; uploadError?: string }>;
};

export default async function TrackingPage({ searchParams }: TrackingPageProps) {
  const { code, submitted, uploaded, failed, uploadError } = await searchParams;
  const reports = await listVisibleReports();
  const updates = await listReportUpdates();
  const hiddenReport = code ? await getReportByTrackingCode(code.trim()) : null;
  const highlightedCode = code?.trim() || null;
  const updatesByReport = updates.reduce<Record<string, typeof updates>>((acc, update) => {
    if (!acc[update.report_id]) {
      acc[update.report_id] = [];
    }
    acc[update.report_id].push(update);
    return acc;
  }, {});

  const uploadedCount = Number(uploaded ?? "0");
  const failedCount = Number(failed ?? "0");

  return (
    <section className="page-shell space-y-8 py-12">
      {submitted === "1" ? (
        <div className="space-y-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Laporan berhasil terkirim.
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            Status upload foto: {uploadedCount} berhasil, {failedCount} gagal.
          </div>
          {uploadError ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Detail gagal upload: {uploadError}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="max-w-3xl space-y-4">
        <span className="inline-flex rounded-full bg-campus-100 px-4 py-2 text-sm font-semibold text-campus-700">
          Daftar laporan
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Laporan kerusakan kampus</h1>
        <p className="text-slate-600">
          Semua mahasiswa dapat melihat laporan yang memang ditampilkan admin beserta status penanganannya.
        </p>
      </div>

      {highlightedCode && !reports.some((report) => report.tracking_code === highlightedCode) && hiddenReport ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Laporan dengan kode ini sedang disembunyikan dari tracking oleh admin.
        </div>
      ) : null}

      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="card p-6 text-sm text-slate-500">Belum ada laporan masuk.</div>
        ) : (
          reports.map((report) => {
            const isHighlighted = highlightedCode === report.tracking_code;
            const reportUpdates = updatesByReport[report.id] ?? [];
            const latestUpdate = reportUpdates[0];

            return (
              <article
                key={report.id}
                className={`card space-y-4 p-6 ${isHighlighted ? "ring-2 ring-campus-400" : ""}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{report.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{report.location}</p>
                  </div>
                  <StatusBadge status={report.status} />
                </div>

                <p className="text-slate-600">{report.description}</p>

                <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-3">
                  <p>
                    <span className="font-medium text-slate-900">Kode:</span> {report.tracking_code}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Kategori:</span> {report.category}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Pelapor:</span> {report.reporter_name}
                  </p>
                </div>

                {report.photo_urls.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {report.photo_urls.map((photo, index) => (
                      <a
                        key={photo}
                        href={photo}
                        target="_blank"
                        rel="noreferrer"
                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                      >
                        <div className="relative h-40 w-full">
                          <Image
                            src={photo}
                            alt={`Foto laporan ${index + 1}`}
                            fill
                            className="object-cover transition duration-300 group-hover:scale-[1.02]"
                            unoptimized
                          />
                        </div>
                        <div className="px-3 py-2 text-xs text-slate-600">Klik untuk lihat ukuran penuh</div>
                      </a>
                    ))}
                  </div>
                ) : null}

                {reportUpdates.length > 0 ? (
                  <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-slate-900">Catatan admin</h3>
                    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <StatusBadge status={latestUpdate.status} />
                        <span className="text-xs text-slate-500">
                          {new Date(latestUpdate.created_at).toLocaleString("id-ID")}
                        </span>
                      </div>
                      <p className="mt-2 text-slate-700">{latestUpdate.note || "Status diperbarui admin."}</p>
                    </div>

                    {reportUpdates.length > 1 ? (
                      <details className="group rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                        <summary className="cursor-pointer list-none font-medium text-campus-700">
                          Lihat catatan admin lainnya ({reportUpdates.length - 1})
                        </summary>
                        <div className="mt-3 space-y-2">
                          {reportUpdates.slice(1).map((update) => (
                            <div key={update.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <StatusBadge status={update.status} />
                                <span className="text-xs text-slate-500">
                                  {new Date(update.created_at).toLocaleString("id-ID")}
                                </span>
                              </div>
                              <p className="mt-2 text-slate-700">{update.note || "Status diperbarui admin."}</p>
                            </div>
                          ))}
                        </div>
                      </details>
                    ) : null}
                  </div>
                ) : null}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}