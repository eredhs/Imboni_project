"use client";

import JobPostingWizard from "@/components/recruiter/job-posting-wizard";
import { RecruiterLayout } from "@/components/layout/recruiter-layout";

export default function CreateJobPage() {
  return (
    <RecruiterLayout>
      <JobPostingWizard />
    </RecruiterLayout>
  );
}
