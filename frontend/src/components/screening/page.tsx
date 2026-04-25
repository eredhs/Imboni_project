"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { StepFiveResults } from "@/components/screening/step-five-results";
import { useGetJobsQuery } from "@/store/api/jobs-api";
import { useDispatch } from "react-redux";
import { selectJob, setStep } from "@/store/screening-slice";
import { Star, Loader2 } from "lucide-react";
import { RecruiterLayout } from "@/components/layout/recruiter-layout";

function ShortlistContent() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const { data: jobsData, isLoading } = useGetJobsQuery();
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState(jobId || "");

  useEffect(() => {
    if (jobsData?.items && selectedId) {
      const job = jobsData.items.find((j) => j.id === selectedId);
      if (job) {
        dispatch(selectJob(job));
        dispatch(setStep(5));
      }
    }
  }, [jobsData, selectedId, dispatch]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#312E81]" />
      </div>
    );
  }

  if (!selectedId && jobsData?.items) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up px-8 py-6">
        <Star size={48} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">View Shortlist</h2>
        <p className="text-gray-500 mb-6">Select a job to view its AI-ranked candidates</p>
        <select 
          className="w-full max-w-xs border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#312E81] focus:ring-2 focus:ring-[#312E81]/20 transition-all cursor-pointer"
          onChange={(e) => setSelectedId(e.target.value)}
          value={selectedId}
        >
          <option value="">Select a job...</option>
          {jobsData.items.map(job => (
            <option key={job.id} value={job.id}>{job.title}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <StepFiveResults />
    </div>
  );
}

export default function ShortlistPage() {
  return (
    <RecruiterLayout>
      <Suspense fallback={<div className="p-8">Loading analysis...</div>}>
        <ShortlistContent />
      </Suspense>
    </RecruiterLayout>
  );
}