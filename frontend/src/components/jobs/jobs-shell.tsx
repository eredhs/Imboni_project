"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Filter, MapPin, Plus, Sparkles, Users, Clock } from "lucide-react";
import { useGetJobsQuery } from "@/store/api/jobs-api";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  RetryButton,
} from "@/components/shared/query-states";
import type { Job } from "@/lib/api-types";

type TabKey = "all" | "active" | "draft" | "closed";

interface JobCardProps {
  job: Job;
}

function JobCard({ job }: JobCardProps) {
  const statusConfig: Record<string, { badge: string; textColor: string }> = {
    active: { badge: "Active", textColor: "text-green-700" },
    draft: { badge: "Draft", textColor: "text-amber-700" },
    closed: { badge: "Closed", textColor: "text-gray-600" },
  };

  const config = statusConfig[job.status] || statusConfig.active;

  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-5 hover:shadow-md transition-all">
      {/* Status Badge */}
      <div className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium border mb-3"
        style={{
          borderColor: job.status === "active" ? "#065f46" : job.status === "draft" ? "#92400e" : "#334155",
          backgroundColor: job.status === "active" ? "rgba(16, 185, 129, 0.1)" : job.status === "draft" ? "rgba(245, 158, 11, 0.1)" : "rgba(71, 85, 105, 0.1)",
          color: job.status === "active" ? "#15803d" : job.status === "draft" ? "#92400e" : "#4b5563"
        }}
      >
        {config.badge}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-white mt-3">{job.title}</h3>

      {/* Department & Location */}
      <div className="flex items-center gap-2 mt-2">
        <span className="inline-block bg-indigo-500/10 text-indigo-400 text-xs px-2 py-0.5 rounded">
          {job.department}
        </span>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <MapPin size={14} />
          {job.location}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-800 my-3"></div>

      {/* Applicants Count */}
      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Total Applicants</p>
      <div className="flex items-center justify-between mb-3">
        <p className="text-2xl font-bold text-white">{job.applicantCount}</p>
        <Users size={20} className="text-slate-700" />
      </div>

      {/* Last Updated */}
      <p className="text-xs text-slate-500 mb-4">
        Created {new Date(job.createdAt).toLocaleDateString()}
      </p>

      {/* Action Buttons */}
      <div className="border-t border-slate-800 pt-3 flex gap-2">
        <Link
          href={`/applicants?jobId=${job.id}`}
          className="flex-1 px-4 py-2 bg-imboni-primary text-white text-sm font-semibold rounded-lg hover:bg-imboni-primary-md transition-all"
        >
          View Applicants
        </Link>
        <Link
          href={`/jobs/${job.id}/edit`}
          className="px-4 py-2 border border-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-800 transition-all"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}

export function JobsShell() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const { data, isLoading, isError, refetch } = useGetJobsQuery();

  const visibleJobs = useMemo(() => {
    const jobs = data?.items ?? [];
    if (activeTab === "all") {
      return jobs;
    }
    return jobs.filter((job) => job.status === activeTab);
  }, [activeTab, data?.items]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and optimize your active hiring requisitions.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
            <Filter size={16} />
            Filter
          </button>
          <Link
            href="/jobs/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-imboni-primary text-white rounded-lg hover:bg-imboni-primary-md text-sm font-semibold"
          >
            <Plus size={16} />
            Post New Job
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-slate-800">
        {(["all", "active", "draft", "closed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-semibold transition-all ${
              activeTab === tab
                ? "border-b-2 border-imboni-primary text-imboni-primary"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <LoadingState key={i} lines={5} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title="Jobs could not be loaded"
          description="We could not fetch your jobs. Try again."
          action={<RetryButton onClick={() => void refetch()} />}
        />
      ) : visibleJobs.length === 0 ? (
        <EmptyState 
          title="No jobs found" 
          description="Create a new job listing to begin finding Rwanda's top talent." 
          action={
            <Link href="/jobs/new" className="px-6 py-2.5 bg-[#312E81] text-white rounded-lg text-sm font-semibold hover:bg-[#4338CA] transition-all">
              + Create Your First Job
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-5">
            {visibleJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* AI Optimization Banner */}
          <div className="bg-imboni-primary rounded-xl p-6 flex items-center justify-between mt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <Sparkles size={24} className="text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">AI Optimization Available</p>
                <p className="text-white/70 text-sm mt-1">
                  Your job listings can be improved for better search visibility and candidate matching. Let IMBONI AI rewrite your descriptions to attract top talent.
                </p>
              </div>
            </div>
            <Link
              href="/jobs/optimize"
              className="px-6 py-2.5 border border-white text-white rounded-lg hover:bg-white/10 font-semibold text-sm whitespace-nowrap"
            >
              Optimize Listing →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
