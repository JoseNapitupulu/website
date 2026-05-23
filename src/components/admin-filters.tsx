"use client";

import { useEffect, useState } from "react";

type Filters = {
  q?: string;
  status?: string;
  priority?: string;
};

type Props = {
  onChange: (filters: Filters) => void;
};

export default function AdminFilters({ onChange }: Props) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [priority, setPriority] = useState<string>("all");

  useEffect(() => {
    const payload: Filters = { q: query || undefined, status: status || undefined, priority: priority || undefined };
    onChange(payload);
  }, [query, status, priority, onChange]);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-6 py-4">
      <div className="flex w-full items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari judul, lokasi, kode, atau nama pelapor"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none"
        />
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setStatus("all");
            setPriority("all");
          }}
          className="ml-2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          Reset
        </button>
      </div>

      <div className="mt-3 flex gap-2 md:mt-0">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="all">Semua status</option>
          <option value="submitted">Masuk</option>
          <option value="in_review">Ditinjau</option>
          <option value="assigned">Diteruskan</option>
          <option value="in_progress">Dikerjakan</option>
          <option value="resolved">Selesai</option>
          <option value="rejected">Ditolak</option>
        </select>

        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="all">Semua prioritas</option>
          <option value="high">Tinggi</option>
          <option value="medium">Sedang</option>
          <option value="low">Rendah</option>
        </select>
      </div>
    </div>
  );
}
