import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import "./globals.css";

export const metadata: Metadata = {
  title: "Lapor Kerusakan Kampus",
  description: "Sistem pelaporan kerusakan fasilitas kampus dengan tracking status dan dashboard admin.",
  alternates: {
    canonical: "/"
  },
  keywords: ["lapor kerusakan", "kampus", "laporan fasilitas", "pelaporan kampus", "maintenance"],
  authors: [{ name: "IT Del", url: "https://laponsitdel.ifs25026.fun/" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  },
  openGraph: {
    title: "Lapor Kerusakan Kampus - IT Del",
    description: "Laporkan kerusakan fasilitas kampus, lacak status penanganan, dan pantau progress.",
    siteName: "Lapor Kerusakan Kampus",
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "/it-del-logo.png",
        width: 800,
        height: 800
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Lapor Kerusakan Kampus",
    description: "Laporkan kerusakan fasilitas kampus dan lacak status penanganan.",
    images: ["/it-del-logo.png"]
  },
  metadataBase: process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL) : new URL("https://laponsitdel.ifs25026.fun/")
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body suppressHydrationWarning>
        {/* JSON-LD Organization structured data for SEO */}
        <script dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Lapor Kerusakan Kampus",
            url: process.env.NEXT_PUBLIC_APP_URL || "",
            logo: `${process.env.NEXT_PUBLIC_APP_URL || ""}/it-del-logo.png`
          })
        }} />
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