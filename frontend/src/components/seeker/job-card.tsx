"use client";

import { Bookmark, MapPin, Briefcase, Calendar, Clock, Building2 } from "lucide-react";
import type { Job, ApplicationStatus } from "@/lib/job-board-types";
import { useState } from "react";
import { useApplyToJobMutation } from "@/store/api/applications-api";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  onBookmark?: (jobId: string) => void;
  isBookmarked?: boolean;
}

export function JobCard({
  job,
  onApply,
  onBookmark,
  isBookmarked = false,
}: JobCardProps) {
  const [applyToJob, { isLoading }] = useApplyToJobMutation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isApplying, setIsApplying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getStatusBadgeColor = (status: ApplicationStatus) => {
    switch (status) {
      case "applied":
        return "bg-green-100 text-green-700";
      case "interview":
        return "bg-blue-100 text-blue-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "accepted":
        return "bg-green-100 text-green-700";
      default:
        return "";
    }
  };

  const getStatusText = (status: ApplicationStatus) => {
    switch (status) {
      case "applied":
        return "Already Applied";
      case "interview":
        return "Interview Scheduled";
      case "rejected":
        return "Application Closed";
      case "accepted":
        return "Offer Extended";
      default:
        return "";
    }
  };

  const getDeadlineColor = () => {
    if (!job.closesInDays) return "text-[#6B7280]";
    if (job.closesInDays <= 2) return "text-red-600";
    if (job.closesInDays <= 5) return "text-orange-600";
    return "text-[#6B7280]";
  };

  const getDeadlineIcon = () => {
    if (!job.closesInDays) return <Calendar size={16} className="text-[#6B7280]" />;
    if (job.closesInDays <= 2) return <Clock size={16} className="text-red-600" />;
    return <Calendar size={16} className="text-[#6B7280]" />;
  };

  return (
    <div
      className="bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#5856D6] to-transparent opacity-0 group-hover:opacity-[0.02] transition-opacity pointer-events-none" />

      {/* Bookmark Button */}
      <button
        onClick={() => onBookmark?.(job.id)}
        className="absolute top-4 right-4 p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors z-10"
        aria-label="Bookmark job"
      >
        <Bookmark
          className={`w-5 h-5 ${
            isBookmarked ? "fill-[#5856D6] text-[#5856D6]" : "text-[#D1D5DB]"
          }`}
        />
      </button>

      <div className="relative z-10">
        {/* Company Avatar and Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5856D6] to-[#7C3AED] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {job.company.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 pt-1">
            <h3 className="text-lg font-bold text-[#111827] leading-tight mb-1">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <Building2 size={14} className="text-[#9CA3AF]" />
              <span>{job.company.name}</span>
            </div>
          </div>
        </div>

        {/* Location and Employment Type */}
        <div className="flex gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <MapPin className="w-4 h-4 text-[#9CA3AF]" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <Briefcase className="w-4 h-4 text-[#9CA3AF]" />
            <span className="capitalize">
              {job.employmentType.replace("-", " ")}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[#6B7280] mb-4 line-clamp-2">
          {job.description}
        </p>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="text-xs bg-[#F3F4F6] text-[#6B7280] px-3 py-1 rounded-full font-medium"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="text-xs bg-[#F3F4F6] text-[#6B7280] px-3 py-1 rounded-full font-medium">
              +{job.skills.length - 3}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-[#E5E7EB] mb-4" />

        {/* Footer - Deadline and Action */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {getDeadlineIcon()}
            <span className={`text-xs font-medium ${getDeadlineColor()}`}>
              {job.closesInDays && job.closesInDays <= 7
                ? `Closes in ${job.closesInDays} ${job.closesInDays === 1 ? "day" : "days"}`
                : `Posted ${job.postedDaysAgo} ${job.postedDaysAgo === 1 ? "day" : "days"} ago`}
            </span>
          </div>

          {/* Status or Action Button */}
          {job.applicationStatus === "not_applied" ? (
            <button
              onClick={() => onApply?.(job.id)}
              className="px-4 py-2 bg-[#5856D6] text-white text-sm font-semibold rounded-lg hover:bg-[#4C4CB0] active:scale-95 transition-all whitespace-nowrap"
            >
              Apply Now
            </button>
          ) : (
            <div
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap ${getStatusBadgeColor(
                job.applicationStatus
              )}`}
            >
              {getStatusText(job.applicationStatus)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
