"use client";

import ApplicationTrackerShell from "@/components/seeker/application-tracker-shell";
import { JobSeekerLayout } from "@/components/layout/job-seeker-layout";

export default function ApplicationsPage() {
  return (
    <JobSeekerLayout>
      <ApplicationTrackerShell />
    </JobSeekerLayout>
  );
}