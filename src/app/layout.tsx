import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import "./globals.css";

export const metadata: Metadata = {
  title: "Lapor Kerusakan Kampus",
  description: "Sistem pelaporan kerusakan fasilitas kampus dengan tracking status dan dashboard admin."
};
// Add favicon/icon entries using the provided logo in /public
metadata.icons = [
  { rel: "icon", url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
  { rel: "icon", url: "/it-del-logo.png", sizes: "64x64", type: "image/png" },
  { rel: "apple-touch-icon", url: "/apple-touch-icon.png", sizes: "180x180" }
];

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