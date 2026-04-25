"use client";

import { JobSeekerLayout } from "@/components/layout/job-seeker-layout";
import { JobSeekerDashboardShell } from "@/components/seeker/dashboard-shell";

export default function SeekerDashboardPage() {
  return (
    <JobSeekerLayout>
      <JobSeekerDashboardShell />
    </JobSeekerLayout>
  );
}