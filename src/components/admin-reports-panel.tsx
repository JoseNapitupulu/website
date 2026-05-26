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
  const [limit, setLimit] = useState(20);
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
        <AdminReportList reports={reports} updatesByReport={updatesByReport} loading={loading} />

        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
          <div className="text-sm text-slate-500">
            {count === 0 ? "Tidak ada laporan untuk filter ini." : `Menampilkan ${(page - 1) * limit + 1} - ${Math.min(page * limit, count)} dari ${count} laporan`}
          </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-500">Per halaman</label>
                <select
                  value={String(limit)}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rounded-lg border px-2 py-1 text-sm"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-lg border px-3 py-2 text-sm">
                  Sebelumnya
                </button>

                {/* numbered pages */}
                {(() => {
                  const totalPages = Math.max(1, Math.ceil(count / limit));
                  const windowSize = 7; // show up to 7 page buttons
                  let start = Math.max(1, page - Math.floor(windowSize / 2));
                  let end = start + windowSize - 1;
                  if (end > totalPages) {
                    end = totalPages;
                    start = Math.max(1, end - windowSize + 1);
                  }

                  const pages = [] as number[];
                  for (let i = start; i <= end; i++) pages.push(i);

                  return (
                    <div className="flex items-center gap-1">
                      {start > 1 ? (
                        <button
                          onClick={() => setPage(1)}
                          aria-label="Ke halaman 1"
                          className="inline-flex items-center justify-center rounded-md border px-2 py-1 text-sm transition hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          1
                        </button>
                      ) : null}
                      {start > 2 ? <span className="px-2 text-slate-400">…</span> : null}
                      {pages.map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          aria-current={p === page ? "page" : undefined}
                          aria-label={`Ke halaman ${p}`}
                          className={`inline-flex items-center justify-center rounded-md border px-3 py-1 text-sm transition ${
                            p === page ? "bg-slate-900 text-white border-slate-900" : "hover:bg-slate-50"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                      {end < totalPages - 1 ? <span className="px-2 text-slate-400">…</span> : null}
                      {end < totalPages ? (
                        <button
                          onClick={() => setPage(totalPages)}
                          aria-label={`Ke halaman ${totalPages}`}
                          className="inline-flex items-center justify-center rounded-md border px-2 py-1 text-sm transition hover:bg-slate-100"
                        >
                          {totalPages}
                        </button>
                      ) : null}
                    </div>
                  );
                })()}

                <button disabled={page * limit >= count} onClick={() => setPage((p) => p + 1)} className="rounded-lg border px-3 py-2 text-sm">
                  Berikutnya
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
