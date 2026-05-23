"use client";

import { useMemo, useState } from "react";

type PhotoUploaderProps = {
  onFilesChange?: (files: File[]) => void;
  disabled?: boolean;
};

export function PhotoUploader({ onFilesChange, disabled = false }: PhotoUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const summaryText = useMemo(() => {
    if (files.length === 0) return "Belum ada foto dipilih.";
    if (files.length === 1) return `1 foto siap diupload: ${files[0].name}`;
    return `${files.length} foto siap diupload.`;
  }, [files]);

  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-slate-900">Upload foto kerusakan</h3>
        <p className="text-sm text-slate-600">
          Tambahkan 1 sampai 5 foto agar admin lebih cepat memverifikasi laporan.
        </p>
      </div>
      <p className="mt-2 text-xs text-slate-500">{summaryText}</p>
      <label className="mt-4 block cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-5 text-center text-sm text-slate-600 shadow-sm transition hover:border-campus-500 hover:bg-campus-50">
        <span className="font-medium text-slate-900">Pilih file foto</span>
        <input
          className="sr-only"
          type="file"
          name="photos"
          accept="image/*"
          multiple
          disabled={disabled}
          onChange={(event) => {
            const picked = Array.from(event.target.files ?? []);
            const limited = picked.slice(0, 5);
            setFiles(limited);
            onFilesChange?.(limited);
          }}
        />
      </label>
    </section>
  );
}