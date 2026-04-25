"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { StepFiveResults } from "@/components/screening/step-five-results";
import { useGetJobsQuery } from "@/store/api/jobs-api";
import { useDispatch } from "react-redux";
import { selectJob, setStep } from "@/store/screening-slice";
import { Star, Search } from "lucide-react";

export default function ShortlistPage() {
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

  if (!selectedId && jobsData?.items) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up">
        <Star size={48} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">View Shortlist</h2>
        <p className="text-gray-500 mb-6">Select a job to view its AI-ranked candidates</p>
        <select 
          className="w-full max-w-xs border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#312E81]"
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