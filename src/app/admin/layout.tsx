import { AdminLiveMonitor } from "@/components/admin-live-monitor";
import { listReportsWithError } from "@/lib/reports";
import Link from "next/link";

const adminLinks = [
  { href: "/admin", label: "Ringkasan" },
  { href: "/admin/reports", label: "Daftar laporan" }
];

export default async function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { reports } = await listReportsWithError();
  const stats = {
    total: reports.length,
    open: reports.filter((report) => report.status !== "resolved" && report.status !== "rejected").length,
    highPriority: reports.filter((report) => report.priority === "high").length,
    hidden: reports.filter((report) => !report.show_in_tracking).length
  };

  return (
    <section className="page-shell py-8">
      <div className="mb-6 overflow-hidden rounded-3xl border border-slate-900/10 bg-gradient-to-br from-slate-950 via-slate-900 to-campus-700 text-white shadow-2xl">
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px] lg:p-8">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-campus-100">Admin Command Center</p>
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Kelola antrian laporan, status, dan catatan dengan cepat.
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-200">
              Dashboard ini dirancang untuk triase cepat: lihat laporan baru, dengar notifikasi masuk, ubah status, sembunyikan dari tracking, dan rapikan catatan dengan lebih efisien.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">Triage cepat</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">Notifikasi suara</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">Tracking publish control</span>
            </div>
          </div>

          <AdminLiveMonitor initialCount={stats.total} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="card h-fit p-5">
          <div className="space-y-2 border-b border-slate-200 pb-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-campus-600">Admin</p>
            <h2 className="text-xl font-semibold text-slate-950">Navigasi cepat</h2>
          </div>

          <nav className="mt-4 space-y-2 text-sm font-medium text-slate-700">
            {adminLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block rounded-xl px-3 py-2 transition hover:bg-slate-100">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-slate-500">Total</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">{stats.total}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-slate-500">Aktif</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">{stats.open}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-slate-500">Prioritas tinggi</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">{stats.highPriority}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-slate-500">Disembunyikan</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">{stats.hidden}</p>
            </div>
          </div>
        </aside>
        <div>{children}</div>
      </div>
    </section>
  );
}