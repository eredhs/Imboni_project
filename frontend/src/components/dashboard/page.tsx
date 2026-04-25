"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Star } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ShortlistShell } from "@/components/shortlist/shortlist-shell";
import { useGetDashboardOverviewQuery } from "@/store/api/dashboard-api";
import { useGetJobsQuery } from "@/store/api/jobs-api";

export default function ShortlistPage() {
  const searchParams = useSearchParams();
  const requestedJobId = searchParams.get("jobId");
  const { data: dashboardData, isLoading } = useGetDashboardOverviewQuery();
  const { data: jobsData } = useGetJobsQuery();

  const completedScreenings = (dashboardData?.recentScreenings ?? []).filter(
    (item) => item.status === "completed",
  );
  const fallbackJobId = requestedJobId ?? completedScreenings[0]?.id ?? null;
  const completedJobs = (jobsData?.items ?? []).filter((job) => job.screeningStatus === "Completed");

  if (fallbackJobId) {
    return <ShortlistShell jobId={fallbackJobId} />;
  }

  return (
    <AppShell activeNav="shortlist">
      <div className="animate-fade-in-up">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
            <Star size={32} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">No Shortlist Selected</h2>
          <p className="mt-2 max-w-md text-gray-500">
            Run AI screening for a job first, or open an already completed screening result from the shortlist links below.
          </p>
          <Link
            href="/screening"
            className="mt-6 inline-flex rounded-lg bg-[#312E81] px-6 py-2.5 font-semibold text-white transition-colors hover:bg-[#4338CA]"
          >
            Go to AI Screening
          </Link>

          {!isLoading && completedJobs.length > 0 ? (
            <div className="mt-8 w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Available Completed Shortlists
              </h3>
              <div className="mt-4 space-y-3">
                {completedJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/shortlist?jobId=${job.id}`}
                    className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 transition-colors hover:border-[#312E81] hover:bg-[#EEF2FF]"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{job.title}</p>
                      <p className="text-sm text-gray-500">
                        {job.applicantCount} applicants screened
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[#312E81]">Open shortlist</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
