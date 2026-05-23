"use client";

import { useFormStatus } from "react-dom";

export function SubmitReportButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-xl bg-campus-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-campus-700 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Sedang mengirim..." : "Kirim laporan"}
    </button>
  );
}