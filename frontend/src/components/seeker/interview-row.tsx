import React from "react";
import { ChevronRight, Calendar, Clock, MapPin, Video, User } from "lucide-react";
import type { InterviewInvitation } from "@/lib/interview-invitation-types";

interface InterviewRowProps {
  invitation: InterviewInvitation;
  onViewDetails: () => void;
  onShowNotification?: () => void;
}

export default function InterviewRow({
  invitation,
  onViewDetails,
  onShowNotification,
}: InterviewRowProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-emerald-900/50 text-emerald-300 border border-emerald-700/50";
      case "pending":
        return "bg-yellow-900/50 text-yellow-300 border border-yellow-700/50";
      case "declined":
        return "bg-red-900/50 text-red-300 border border-red-700/50";
      default:
        return "bg-slate-700/50 text-slate-300";
    }
  };

  const daysUntil = Math.ceil(
    (new Date(invitation.scheduledDate).getTime() - new Date(2026, 3, 10).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div
      onClick={onViewDetails}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onViewDetails();
        }
      }}
      role="button"
      tabIndex={0}
      className="w-full bg-gradient-to-r from-slate-800/50 to-slate-800/30 border border-slate-700/50 hover:border-purple-600/50 rounded-lg p-5 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group text-left"
    >
      <div className="flex items-center justify-between">
        {/* Left: Company & Job Info */}
        <div className="flex items-center gap-4 flex-1">
          {/* Company Avatar */}
          <div className="w-14 h-14 bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border border-purple-500/30 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
            {invitation.companyAvatar}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-semibold text-white truncate">{invitation.jobTitle}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(invitation.status)}`}>
                {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
              </span>
            </div>

            <p className="text-slate-400 text-sm mb-2">{invitation.companyName}</p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <span>
                  {invitation.interviewType.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(invitation.scheduledDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{invitation.scheduledTime}</span>
              </div>
              <div className="flex items-center gap-1">
                {invitation.format === "virtual" ? (
                  <Video className="w-3 h-3" />
                ) : (
                  <MapPin className="w-3 h-3" />
                )}
                <span className="capitalize">{invitation.format}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interviewer & Actions */}
        <div className="flex items-center gap-6 flex-shrink-0 ml-4">
          {/* Interviewer Info */}
          <div className="hidden sm:flex items-center gap-2">
            <User className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-slate-400">{invitation.interviewer.name.split(" ")[0]}</span>
          </div>

          {/* Days Until */}
          <div className="text-center">
            <p className="text-xs text-slate-500">In</p>
            <p className="text-sm font-bold text-purple-400">{daysUntil}d</p>
          </div>

          {/* Demo Button (only if status is pending) */}
          {invitation.status === "pending" && onShowNotification && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShowNotification();
              }}
              className="bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors"
            >
              Show Alert
            </button>
          )}

          {/* Chevron */}
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
        </div>
      </div>
    </div>
  );
}
