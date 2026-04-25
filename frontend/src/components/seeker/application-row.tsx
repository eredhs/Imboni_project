import React from "react";
import { ChevronRight, MapPin, DollarSign, Clock, Zap, CheckCircle2, Star, XCircle } from "lucide-react";
import type { Application, ApplicationOutcome } from "@/lib/application-tracker-types";

interface ApplicationRowProps {
  application: Application;
  onViewDetails: () => void;
}

export default function ApplicationRow({ application, onViewDetails }: ApplicationRowProps) {
  const getStatusColor = (outcome: ApplicationOutcome | undefined) => {
    if (!outcome) return "bg-slate-700/50 text-slate-300";

    switch (outcome) {
      case "accepted":
        return "bg-emerald-900/50 text-emerald-300 border border-emerald-700/50";
      case "rejected":
        return "bg-red-900/50 text-red-300 border border-red-700/50";
      case "under_review":
        return "bg-yellow-900/50 text-yellow-300 border border-yellow-700/50";
      case "shortlisted":
        return "bg-blue-900/50 text-blue-300 border border-blue-700/50";
      default:
        return "bg-slate-700/50 text-slate-300";
    }
  };

  const StatusLabel = ({ outcome }: { outcome?: ApplicationOutcome }) => {
    if (!outcome) return <span className="text-slate-400">Submitted</span>;
    switch (outcome) {
      case "accepted":
        return (
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 size={12} /> Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1.5 text-red-400">
            <XCircle size={12} /> Rejected
          </span>
        );
      case "under_review":
        return (
          <span className="flex items-center gap-1.5 text-amber-400">
            <Clock size={12} /> Under Review
          </span>
        );
      case "shortlisted":
        return (
          <span className="flex items-center gap-1.5 text-blue-400">
            <Star size={12} /> Shortlisted
          </span>
        );
      default:
        return <span className="text-slate-400">Submitted</span>;
    }
  };

  const daysAgo = Math.floor((new Date().getTime() - application.appliedDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <button
      onClick={onViewDetails}
      className="w-full bg-gradient-to-r from-slate-800/50 to-slate-800/30 border border-slate-700/50 hover:border-purple-600/50 rounded-lg p-5 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group text-left"
    >
      <div className="flex items-center justify-between">
        {/* Left: Company & Job Info */}
        <div className="flex items-center gap-4 flex-1">
          {/* Company Avatar */}
          <div className="w-14 h-14 bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border border-purple-500/30 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
            {application.companyAvatar}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-semibold text-white truncate">{application.jobTitle}</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(
                  application.currentStage.includes("Offer Accepted")
                    ? "accepted"
                    : application.currentStage.includes("Not Selected") || application.currentStage.includes("Unfortunately")
                      ? "rejected"
                      : application.currentStage.includes("Shortlisted")
                        ? "shortlisted"
                      : application.currentStage.includes("Under Review")
                        ? "under_review"
                        : undefined
                )}`}
              >
                <StatusLabel outcome={
                  application.currentStage.includes("Offer Accepted")
                    ? "accepted"
                    : application.currentStage.includes("Not Selected") || application.currentStage.includes("Unfortunately")
                      ? "rejected"
                      : application.currentStage.includes("Shortlisted")
                        ? "shortlisted"
                      : application.currentStage.includes("Under Review")
                        ? "under_review"
                        : undefined
                } />
              </span>
            </div>

            <p className="text-slate-400 text-sm mb-2">{application.companyName}</p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{application.location}</span>
              </div>
              {application.salary && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  <span>
                    {(application.salary.min / 1000000).toFixed(1)}M - {(application.salary.max / 1000000).toFixed(1)}M{" "}
                    RWF
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{daysAgo === 0 ? "Today" : `${daysAgo} day${daysAgo !== 1 ? "s" : ""} ago`}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Progress Info */}
        <div className="flex items-center gap-6 flex-shrink-0 ml-4">
          {/* Timeline Preview */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (application.daysInProcess / 14) * 100)}%`,
                }}
              />
            </div>
            <span className="text-xs text-slate-400 whitespace-nowrap">{application.daysInProcess}d</span>
          </div>

          {/* Success Rate */}
          {application.successRate > 0 && (
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-semibold text-yellow-400">{application.successRate}%</span>
            </div>
          )}

          {/* Next Action Badge */}
          {application.nextAction && (
            <div className="bg-blue-900/50 border border-blue-700/50 px-3 py-1 rounded-full">
              <span className="text-xs font-medium text-blue-300">Action needed</span>
            </div>
          )}

          {/* Chevron */}
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
        </div>
      </div>
    </button>
  );
}
