import type { Metadata } from "next";

type AdminLoginPageProps = {
  searchParams: Promise<{ error?: string; next?: string; signedOut?: string }>;
};

export const metadata: Metadata = {
  title: "Admin Login | Lapor Kerusakan Kampus"
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const { error, next: nextPath, signedOut } = await searchParams;
  const redirectTo = typeof nextPath === "string" && nextPath.startsWith("/") ? nextPath : "/admin";

  return (
    <section className="page-shell flex min-h-[calc(100vh-5rem)] items-center py-12">
      <div className="mx-auto w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="space-y-2 text-center">
          <span className="inline-flex rounded-full bg-campus-100 px-4 py-2 text-sm font-semibold text-campus-700">
            Admin access
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Login Admin</h1>
          <p className="text-sm leading-6 text-slate-600">
            Gunakan akun Supabase yang sudah di-allowlist untuk membuka dashboard admin.
          </p>
        </div>

        {signedOut === "1" ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Anda sudah logout.
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <form action="/api/admin/login" method="post" className="space-y-4">
          <input type="hidden" name="next" value={redirectTo} />

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Email admin</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              placeholder="admin@kampus.ac.id"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-campus-500"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Password akun Supabase"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-campus-500"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-campus-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-campus-700"
          >
            Masuk ke admin
          </button>
        </form>

        <p className="text-xs leading-5 text-slate-500">
          Keamanan: sesi disimpan via cookie Supabase dan akses dashboard dibatasi lewat allowlist email admin.
        </p>
      </div>
    </section>
  );
}
