"use client";

import { useState } from "react";
import {
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  Heart,
  Eye,
  Share2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  type: string;
  level: string;
  description: string;
  skills: string[];
  postedAt: string;
  deadline?: string;
  companySize?: string;
  workArrangement?: string;
  applicants?: number;
  applicationStatus?: string;
}

interface JobResultsProps {
  jobs: Job[];
  isLoading: boolean;
  bookmarkedJobs: Set<string>;
  selectedJobId?: string;
  onBookmark: (jobId: string) => void;
  onSelect: (jobId: string) => void;
  onApply: (jobId: string) => void;
}

export function JobResults({
  jobs,
  isLoading,
  bookmarkedJobs,
  selectedJobId,
  onBookmark,
  onSelect,
  onApply,
}: JobResultsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-48 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle size={48} className="text-slate-500 mb-4" />
        <h3 className="text-xl font-semibold text-slate-300 mb-2">
          No jobs found
        </h3>
        <p className="text-slate-500">
          Try adjusting your filters or search query
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-400">
          Showing <span className="font-bold text-emerald-400">{jobs.length}</span> jobs
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === "list"
                ? "bg-emerald-500 text-white"
                : "bg-slate-800/50 text-slate-400 hover:text-white"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === "grid"
                ? "bg-emerald-500 text-white"
                : "bg-slate-800/50 text-slate-400 hover:text-white"
            }`}
          >
            Grid
          </button>
        </div>
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-4"
        }
      >
        {jobs.map((job) => (
          <div
            key={job.id}
            className={`group rounded-lg border p-4 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 ${
              selectedJobId === job.id
                ? "border-emerald-500/60 bg-slate-900/80"
                : "border-slate-700/30 bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:border-emerald-500/30"
            }`}
          >
            {/* Header with company and bookmark */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                  {job.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{job.company}</p>
              </div>
              <button
                onClick={() => onBookmark(job.id)}
                className="ml-2 p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
              >
                <Heart
                  size={18}
                  className={
                    bookmarkedJobs.has(job.id)
                      ? "fill-red-500 text-red-500"
                      : "text-slate-400 group-hover:text-slate-300"
                  }
                />
              </button>
            </div>

            {/* Metadata grid */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin size={14} />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Briefcase size={14} />
                <span>{job.type}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Clock size={14} />
                <span>{job.level}</span>
              </div>
              {job.deadline && (
                <div className="flex items-center gap-2 text-slate-400">
                  <AlertCircle size={14} />
                  <span>{job.deadline}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-slate-400 line-clamp-2 mb-3">
              {job.description}
            </p>

            {/* Skills */}
            {job.skills.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1">
                {job.skills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-emerald-500/10 text-emerald-300 text-xs rounded border border-emerald-500/20"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 4 && (
                  <span className="px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded">
                    +{job.skills.length - 4} more
                  </span>
                )}
              </div>
            )}

            {/* Footer with apply button */}
            <div className="flex gap-2">
              <button
                onClick={() => onSelect(job.id)}
                className="flex-1 rounded-lg border border-slate-600/60 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-emerald-500/50 hover:text-white"
              >
                View Details
              </button>
              <button
                onClick={() => onApply(job.id)}
                disabled={job.applicationStatus === "applied"}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 group-hover:shadow-lg group-hover:shadow-emerald-500/30 disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-600 disabled:text-slate-300"
              >
                {job.applicationStatus === "applied" ? "Applied" : "Apply Now"}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
