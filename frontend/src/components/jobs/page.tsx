"use client";

import { RecruiterLayout } from "@/components/layout/recruiter-layout";
import JobPostingWizard from "@/components/recruiter/job-posting-wizard";

export default function NewJobPage() {
  return (
    <RecruiterLayout>
      <JobPostingWizard />
    </RecruiterLayout>
  );
}