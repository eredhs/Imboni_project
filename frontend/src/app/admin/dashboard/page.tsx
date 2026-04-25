"use client";

import AdminDashboardShell from "@/components/admin/admin-dashboard-shell";
import { AdminLayout } from "@/components/layout/admin-layout";

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <AdminDashboardShell />
    </AdminLayout>
  );
}
