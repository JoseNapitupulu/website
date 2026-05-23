"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "Ringkasan" },
  { href: "/admin/reports", label: "Daftar laporan" }
];

export function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav className="mt-4 space-y-2 text-sm font-medium text-slate-700">
      {adminLinks.map((link) => {
        const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`block rounded-xl px-3 py-2 transition ${
              active
                ? "bg-campus-50 text-campus-700 ring-1 ring-campus-200"
                : "hover:bg-slate-100 hover:text-slate-950"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}