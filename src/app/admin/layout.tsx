import Link from "next/link";

const adminLinks = [
  { href: "/admin", label: "Ringkasan" },
  { href: "/admin/reports", label: "Daftar laporan" }
];

export default function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="page-shell py-8">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="card h-fit p-5">
          <div className="space-y-2 border-b border-slate-200 pb-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-campus-600">Admin</p>
            <h1 className="text-xl font-semibold text-slate-950">Dashboard laporan</h1>
          </div>
          <nav className="mt-4 space-y-2 text-sm font-medium text-slate-700">
            {adminLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block rounded-xl px-3 py-2 hover:bg-slate-100">
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </section>
  );
}