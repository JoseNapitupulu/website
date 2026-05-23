import Link from "next/link";
import Image from "next/image";

const highlights = [
  "Laporan kerusakan dari mahasiswa dengan bukti foto",
  "Status penanganan real-time dari admin kampus",
  "Daftar laporan terbuka agar semua civitas bisa memantau",
  "Penyimpanan data dan gambar terintegrasi Supabase"
];

export default function HomePage() {
  return (
    <section className="page-shell space-y-10 py-12 lg:py-16">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
        <div className="grid gap-8 bg-gradient-to-br from-campus-50 via-white to-sky-50 p-6 md:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:p-10">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-campus-100 px-4 py-2 text-sm font-semibold text-campus-700">
              Project PRD Kelompok 4
            </span>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Platform Pelaporan Kerusakan Fasilitas Kampus IT Del
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Mahasiswa dapat melaporkan kerusakan dengan cepat, melihat progres penanganan,
              serta memantau laporan lain yang sudah masuk secara transparan.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/laporan"
                className="rounded-xl bg-campus-600 px-5 py-3 text-sm font-semibold text-white hover:bg-campus-700"
              >
                Buat laporan
              </Link>
              <Link
                href="/tracking"
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-campus-300 hover:text-campus-700"
              >
                Daftar laporan
              </Link>
              <Link
                href="/developer"
                className="rounded-xl border border-campus-200 bg-campus-50 px-5 py-3 text-sm font-semibold text-campus-800 hover:bg-campus-100"
              >
                Tim developer
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <Image
                src="/it-del-logo.jpg"
                alt="Logo Institut Teknologi Del"
                width={80}
                height={80}
                className="h-20 w-20 rounded-xl border border-slate-200 bg-white p-1"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-campus-700">Institut Teknologi Del</p>
                <p className="text-sm text-slate-600">Sistem pelaporan kerusakan fasilitas kampus</p>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Fitur utama</h2>
              <ul className="space-y-3 text-sm text-slate-600">
                {highlights.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-campus-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm text-slate-500">Akses user</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">Laporkan Kerusakan</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500">Akses publik</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">Pantau Daftar Laporan</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500">Akses admin</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">Update Status dan Catatan</p>
        </div>
      </div>
    </section>
  );
}