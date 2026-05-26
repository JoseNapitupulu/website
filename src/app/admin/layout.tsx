export const dynamic = "force-dynamic";

import { AdminShell } from "@/components/admin-shell";

export default async function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminShell totalReports={0} openReports={0} highPriorityReports={0} hiddenReports={0}>
      {children}
    </AdminShell>
  );
}