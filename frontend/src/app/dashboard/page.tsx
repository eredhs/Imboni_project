"use client";

import { RecruiterLayout } from "@/components/layout/recruiter-layout";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardPage() {
  return (
    <RecruiterLayout>
      <DashboardShell />
    </RecruiterLayout>
  );
}