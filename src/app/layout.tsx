import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import "./globals.css";

export const metadata: Metadata = {
  title: "Lapor Kerusakan Kampus",
  description: "Sistem pelaporan kerusakan fasilitas kampus dengan tracking status dan dashboard admin."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body suppressHydrationWarning>
        <header className="border-b border-slate-200 bg-white/85 backdrop-blur">
          <div className="page-shell flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/it-del-logo.jpg"
                alt="Logo IT Del"
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg border border-slate-200 bg-white p-1"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-del-purple">IT Del</p>
                <p className="text-sm font-semibold tracking-tight text-slate-900">LaporKerusakan</p>
              </div>
            </Link>
            <nav className="flex flex-wrap gap-3 text-sm font-medium text-slate-600">
              <Link href="/laporan">Laporkan</Link>
              <Link href="/tracking">Tracking</Link>
              <Link href="/developer">Developer</Link>
              <Link href="/admin">Admin</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}