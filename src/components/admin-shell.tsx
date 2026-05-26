"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AdminLiveMonitor } from "@/components/admin-live-monitor";
import { AdminNavigation } from "@/components/admin-navigation";

type AdminShellProps = {
  children: React.ReactNode;
  totalReports: number;
  openReports: number;
  highPriorityReports: number;
  hiddenReports: number;
};

export function AdminShell({
  children,
  totalReports,
  openReports,
  highPriorityReports,
  hiddenReports
}: AdminShellProps) {
  const pathname = usePathname();
  const [summary, setSummary] = useState({
    totalReports,
    openReports,
    highPriorityReports,
    hiddenReports
  });

  useEffect(() => {
    if (pathname.startsWith("/admin/login")) {
      return;
    }

    const abortController = new AbortController();

    async function loadSummary() {
      try {
        const response = await fetch("/api/admin/reports/live", {
          cache: "no-store",
          signal: abortController.signal
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as {
          count?: number;
          open?: number;
          highPriority?: number;
          hidden?: number;
        };

        setSummary((current) => ({
          totalReports: typeof payload.count === "number" ? payload.count : current.totalReports,
          openReports: typeof payload.open === "number" ? payload.open : current.openReports,
          highPriorityReports: typeof payload.highPriority === "number" ? payload.highPriority : current.highPriorityReports,
          hiddenReports: typeof payload.hidden === "number" ? payload.hidden : current.hiddenReports
        }));
      } catch {
        // Keep the server-rendered fallback if the summary endpoint is temporarily unavailable.
      }
    }

    void loadSummary();

    return () => abortController.abort();
  }, [pathname]);

  if (pathname.startsWith("/admin/login")) {
    return <>{children}</>;
  }

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
              <Link href="/admin/reports" className="rounded-full border border-white/15 bg-white/10 px-3 py-1 transition hover:bg-white/20">
                Buka daftar laporan
              </Link>
            </div>
          </div>

          <AdminLiveMonitor initialCount={summary.totalReports} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="card h-fit p-5">
          <div className="space-y-2 border-b border-slate-200 pb-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-campus-600">Admin</p>
            <h2 className="text-xl font-semibold text-slate-950">Navigasi cepat</h2>
          </div>

          <AdminNavigation />

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-slate-500">Total</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">{summary.totalReports}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-slate-500">Aktif</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">{summary.openReports}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-slate-500">Prioritas tinggi</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">{summary.highPriorityReports}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-slate-500">Disembunyikan</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">{summary.hiddenReports}</p>
            </div>
          </div>
        </aside>
        <div>{children}</div>
      </div>
    </section>
  );
}