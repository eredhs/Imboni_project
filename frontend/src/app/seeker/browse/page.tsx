"use client";

import { JobBoardShell } from "@/components/seeker/job-board-shell";
import { JobSeekerLayout } from "@/components/layout/job-seeker-layout";

export default function BrowseJobsPage() {
  return (
    <JobSeekerLayout>
      <JobBoardShell />
    </JobSeekerLayout>
  );
}
