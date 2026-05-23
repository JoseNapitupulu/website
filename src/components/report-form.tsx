"use client";

import { FormEvent, useMemo, useState } from "react";

import { campusLocationOptions } from "@/lib/campus-locations";

import { PhotoUploader } from "./photo-uploader";

type ReportSubmitResponse = {
  ok: boolean;
  redirectTo?: string;
  message?: string;
};

export function ReportForm() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formStartedAt] = useState(() => Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const uploadHint = useMemo(() => {
    if (isSubmitting) {
      return `Mengupload data dan foto... ${uploadProgress}%`;
    }

    if (selectedFiles.length === 0) {
      return "Pilih foto terlebih dahulu jika ingin melampirkan bukti.";
    }

    return `${selectedFiles.length} foto siap diupload. Klik Kirim laporan untuk memulai upload.`;
  }, [isSubmitting, selectedFiles.length, uploadProgress]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setUploadProgress(0);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const xhr = new XMLHttpRequest();

    xhr.open("POST", "/api/reports");
    xhr.responseType = "json";
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    xhr.upload.onprogress = (progressEvent) => {
      if (!progressEvent.lengthComputable) return;
      const value = Math.round((progressEvent.loaded / progressEvent.total) * 100);
      setUploadProgress(value);
    };

    xhr.onload = () => {
      setIsSubmitting(false);

      const response = xhr.response as ReportSubmitResponse | null;

      if (xhr.status >= 200 && xhr.status < 300 && response?.ok && response.redirectTo) {
        setUploadProgress(100);
        window.location.href = response.redirectTo;
        return;
      }

      const message = response?.message ?? "Gagal mengirim laporan. Coba lagi.";
      setSubmitError(message);
    };

    xhr.onerror = () => {
      setIsSubmitting(false);
      setSubmitError("Jaringan bermasalah saat upload. Periksa koneksi internet lalu coba lagi.");
    };

    xhr.send(formData);
  };

  return (
    <form onSubmit={handleSubmit} method="post" encType="multipart/form-data" className="space-y-6">
      <input type="hidden" name="form_started_at" value={String(formStartedAt)} />
      <label className="hidden" aria-hidden="true">
        <span>Website</span>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Nama pelapor</span>
          <input
            name="reporter_name"
            required
            disabled={isSubmitting}
            placeholder="Nama lengkap"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-campus-500"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            name="reporter_email"
            type="email"
            disabled={isSubmitting}
            placeholder="nama@itdel.ac.id"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-campus-500"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">NIM / NPM</span>
          <input
            name="reporter_student_id"
            required
            disabled={isSubmitting}
            placeholder="Contoh: 1122334455"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-campus-500"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Judul kerusakan</span>
          <input
            name="title"
            required
            disabled={isSubmitting}
            placeholder="Contoh: Lampu koridor mati"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-campus-500"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Lokasi</span>
          <select
            name="location"
            required
            disabled={isSubmitting}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-campus-500"
            defaultValue=""
          >
            <option value="" disabled>
              Pilih lokasi kampus
            </option>
            {campusLocationOptions.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500">Pilih lokasi agar laporan lebih valid dan mudah ditindaklanjuti.</p>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Kategori</span>
          <select
            name="category"
            required
            disabled={isSubmitting}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-campus-500"
            defaultValue=""
          >
            <option value="" disabled>
              Pilih kategori
            </option>
            <option value="listrik">Listrik</option>
            <option value="fasilitas">Fasilitas umum</option>
            <option value="air">Air dan sanitasi</option>
            <option value="jaringan">Jaringan / internet</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Prioritas</span>
          <select
            name="priority"
            disabled={isSubmitting}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-campus-500"
            defaultValue="medium"
          >
            <option value="low">Rendah</option>
            <option value="medium">Sedang</option>
            <option value="high">Tinggi</option>
          </select>
        </label>
      </div>

      <label className="space-y-2">
        <span className="text-sm font-medium text-slate-700">Deskripsi kerusakan</span>
        <textarea
          name="description"
          required
          disabled={isSubmitting}
          rows={5}
          placeholder="Jelaskan kondisi, waktu ditemukan, dan dampaknya ke aktivitas kampus."
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-campus-500"
        />
      </label>

      <PhotoUploader onFilesChange={setSelectedFiles} disabled={isSubmitting} />

      <section className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>{uploadHint}</span>
          <span>{isSubmitting ? `${uploadProgress}%` : selectedFiles.length > 0 ? "Siap" : "-"}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-campus-600 transition-all duration-300"
            style={{ width: `${isSubmitting ? uploadProgress : selectedFiles.length > 0 ? 5 : 0}%` }}
          />
        </div>
      </section>

      {submitError ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{submitError}</p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-xl bg-campus-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-campus-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Mengupload..." : "Kirim laporan"}
      </button>
    </form>
  );
}