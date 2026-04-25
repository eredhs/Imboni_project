"use client";

import { ScreeningWizard } from "@/components/screening/screening-wizard";
import { RecruiterLayout } from "@/components/layout/recruiter-layout";
import { useSearchParams } from "next/navigation";

export default function ScreeningPage() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  
  return (
    <RecruiterLayout>
      <ScreeningWizard initialJobId={jobId ?? undefined} />
    </RecruiterLayout>
  );
}
