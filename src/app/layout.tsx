import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import "./globals.css";

const siteUrl = new URL("https://laporitdel.ifs25026.fun");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "Lapor Kerusakan Kampus",
  title: {
    default: "Lapor Kerusakan Kampus",
    template: "%s | Lapor Kerusakan Kampus"
  },
  description: "Sistem pelaporan kerusakan fasilitas kampus dengan tracking status dan dashboard admin.",
  keywords: ["lapor kerusakan", "kampus", "laporan fasilitas", "pelaporan kampus", "maintenance"],
  alternates: {
    canonical: "/"
  },
  authors: [{ name: "IT Del", url: siteUrl.toString() }],
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  openGraph: {
    title: "Lapor Kerusakan Kampus",
    description: "Laporkan kerusakan fasilitas kampus, lacak status penanganan, dan pantau progress.",
    url: "/",
    siteName: "Lapor Kerusakan Kampus",
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "/it-del-logo.png",
        width: 800,
        height: 800,
        alt: "Logo Lapor Kerusakan Kampus"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Lapor Kerusakan Kampus",
    description: "Laporkan kerusakan fasilitas kampus dan lacak status penanganan.",
    images: ["/it-del-logo.png"]
  },
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  },
  manifest: "/site.webmanifest"
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