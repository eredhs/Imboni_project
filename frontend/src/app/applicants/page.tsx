"use client";

import { ApplicantsShell } from "@/components/applicants/applicants-shell";
import { RecruiterLayout } from "@/components/layout/recruiter-layout";
import { useSearchParams } from "next/navigation";

export default function ApplicantsPage() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId") ?? "";
  
  return (
    <RecruiterLayout>
      <ApplicantsShell initialJobId={jobId} />
    </RecruiterLayout>
  );
}
