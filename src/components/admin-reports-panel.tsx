"use client";

import { useCallback, useEffect, useState } from "react";
import type { DamageReport, ReportUpdate } from "@/types/report";
import AdminFilters from "./admin-filters";
import AdminReportList from "./admin-report-list";

type Props = {
  initialReports?: DamageReport[];
  initialUpdatesByReport: Record<string, ReportUpdate[]>;
};

export default function AdminReportsPanel({ initialReports = [], initialUpdatesByReport }: Props) {
  const [reports, setReports] = useState<DamageReport[]>(initialReports);
  const [count, setCount] = useState(initialReports.length);
  const [updatesByReport, setUpdatesByReport] = useState<Record<string, ReportUpdate[]>>(initialUpdatesByReport);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ q?: string; status?: string; priority?: string }>({});
  const handleFilterChange = useCallback((nextFilters: { q?: string; status?: string; priority?: string }) => {
    setFilters(nextFilters);
    setPage(1);
  }, []);

  useEffect(() => {
    const abort = new AbortController();

    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.q) params.set("q", filters.q);
        if (filters.status) params.set("status", filters.status);
        if (filters.priority) params.set("priority", filters.priority);
        params.set("page", String(page));
        params.set("limit", String(limit));

        const res = await fetch(`/api/admin/reports?${params.toString()}`, { signal: abort.signal });
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Failed to load reports", errorText);
          setLoadError(errorText || "Gagal memuat antrian laporan.");
        } else {
          const data = await res.json();
          setReports(data.reports ?? []);
          setCount(data.count ?? 0);
          setUpdatesByReport(data.updatesByReport ?? {});
          setLoadError(null);
        }
      } catch (err) {
        if ((err as { name?: string }).name !== "AbortError") console.error(err);
        setLoadError("Gagal memuat antrian laporan.");
      } finally {
        setLoading(false);
      }
    }

    load();

    return () => abort.abort();
  }, [filters, page, limit]);

  return (
    <div>
      <AdminFilters onChange={handleFilterChange} />
      <div className="px-0">
        {loadError ? <div className="border-b border-rose-200 bg-rose-50 px-6 py-3 text-sm text-rose-700">{loadError}</div> : null}
        {loading ? <div className="p-6 text-sm text-slate-500">Memuat...</div> : null}
        <AdminReportList reports={reports} updatesByReport={updatesByReport} />

        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
          <div className="text-sm text-slate-500">
            {count === 0 ? "Tidak ada laporan untuk filter ini." : `Menampilkan ${(page - 1) * limit + 1} - ${Math.min(page * limit, count)} dari ${count} laporan`}
          </div>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-lg border px-3 py-2 text-sm">
              Sebelumnya
            </button>
            <button disabled={page * limit >= count} onClick={() => setPage((p) => p + 1)} className="rounded-lg border px-3 py-2 text-sm">
              Berikutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
