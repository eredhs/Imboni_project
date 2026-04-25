"use client";

import { useEffect, useMemo, useState } from "react";
import { Briefcase, CalendarDays, Clock3, Search, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingState, EmptyState, ErrorState, RetryButton } from "@/components/shared/query-states";
import { useGetJobsQuery } from "@/store/api/jobs-api";
import { selectJob, setStep } from "@/store/screening-slice";
import type { RootState } from "@/store";

export function StepOneJobSelection() {
  const dispatch = useDispatch();
  const selectedJobIdFromStore = useSelector(
    (state: RootState) => state.screening.selectedJobId,
  );
  const { data, isLoading, isError, refetch } = useGetJobsQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(
    selectedJobIdFromStore,
  );

  useEffect(() => {
    setSelectedJobId(selectedJobIdFromStore);
  }, [selectedJobIdFromStore]);

  const jobs = useMemo(() => {
    const allJobs = data?.items ?? [];
    const liveJobs = allJobs
      .filter((job) => job.applicantCount > 0 || job.id === selectedJobIdFromStore)
      .sort(
        (left, right) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      );

    if (!searchQuery.trim()) {
      return liveJobs;
    }

    const query = searchQuery.toLowerCase();
    return liveJobs.filter((job) =>
      [job.title, job.department, job.location]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [data?.items, searchQuery, selectedJobIdFromStore]);

  const selectedJob =
    jobs.find((job) => job.id === selectedJobId) ??
    data?.items?.find((job) => job.id === selectedJobId) ??
    null;

  const handleContinue = () => {
    if (!selectedJob) {
      return;
    }

    dispatch(selectJob(selectedJob));
    dispatch(setStep(2));
  };

  return (
    <div className="mx-auto max-w-5xl animate-fade-in-up">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          AI Screening Wizard
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Select a job with live applicants, review the pool, configure the scoring,
          and continue to screening.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Select Job to Screen</h2>
          <p className="mt-1 text-sm text-gray-500">
            Only jobs with real applicants are shown here so the next review step can
            display everyone who applied.
          </p>
        </div>

        <div className="mb-4">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs by title, department, or location..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-[#312E81] focus:outline-none focus:ring-2 focus:ring-[#312E81]/10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <LoadingState key={item} lines={2} />
            ))}
          </div>
        ) : null}

        {isError ? (
          <ErrorState
            title="Jobs could not be loaded"
            description="We could not fetch the recruiter job list for screening."
            action={<RetryButton onClick={() => void refetch()} />}
          />
        ) : null}

        {!isLoading && !isError && jobs.length === 0 ? (
          <EmptyState
            title="No jobs with applicants yet"
            description="Once job seekers apply to a recruiter job, it will appear here with its real applicant count."
          />
        ) : null}

        {!isLoading && !isError && jobs.length > 0 ? (
          <div className="space-y-3">
            {jobs.map((job) => {
              const isSelected = selectedJobId === job.id;
              return (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => setSelectedJobId(job.id)}
                  className={`w-full rounded-xl border p-5 text-left transition-all ${
                    isSelected
                      ? "border-[#312E81] bg-[#EEF2FF]"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                        <Briefcase size={18} className="text-gray-600" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg font-semibold text-gray-900">{job.title}</p>
                          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#312E81]">
                            {job.screeningStatus}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {job.department} · {job.location}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 size={13} />
                            Created {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays size={13} />
                            Deadline {new Date(job.applicationDeadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="inline-flex items-center gap-1.5 text-gray-700">
                          <Users size={15} />
                          <span className="text-lg font-bold">{job.applicantCount}</span>
                        </div>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Applicants
                        </p>
                      </div>

                      <span
                        className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-[#312E81] text-white"
                            : "border border-gray-200 text-gray-700"
                        }`}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="mt-6 rounded-lg bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-900">Live candidate sync</p>
          <p className="mt-1 text-xs leading-6 text-gray-500">
            The next step shows the real candidate pool created from job seeker
            applications and any uploaded resumes for the selected job.
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-400">
          {selectedJob
            ? `Ready to review ${selectedJob.applicantCount} applicants for ${selectedJob.title}.`
            : "Select a job with applicants to continue."}
        </p>
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selectedJob}
          className="rounded-lg bg-[#312E81] px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue to Candidate Review
        </button>
      </div>
    </div>
  );
}
