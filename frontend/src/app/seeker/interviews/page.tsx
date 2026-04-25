"use client";

import InterviewsShell from "@/components/seeker/interviews-shell";
import { JobSeekerLayout } from "@/components/layout/job-seeker-layout";

export default function InterviewsPage() {
  return (
    <JobSeekerLayout>
      <InterviewsShell />
    </JobSeekerLayout>
  );
}
