import { ReportForm } from "@/components/report-form";

type ReportPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function ReportPage({ searchParams }: ReportPageProps) {
  const { error } = await searchParams;

  return (
    <section className="page-shell space-y-8 py-12">
      <div className="max-w-3xl space-y-4">
        <span className="inline-flex rounded-full bg-campus-100 px-4 py-2 text-sm font-semibold text-campus-700">
          Halaman user
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Laporkan kerusakan fasilitas</h1>
        <p className="text-slate-600">
          Isi detail laporan, tambahkan foto, lalu kirim. Setelah laporan masuk, sistem akan
          mengarahkan ke halaman tracking status.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Laporan belum terkirim: {error}
        </div>
      ) : null}

      <div className="card p-6 md:p-8">
        <ReportForm />
      </div>
    </section>
  );
}