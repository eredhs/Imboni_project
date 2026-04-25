import React, { useState } from "react";
import {
  X,
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Video,
  User,
  Mail,
  FileCheck,
  AlertCircle,
  Zap,
} from "lucide-react";
import type { InterviewInvitation } from "@/lib/interview-invitation-types";

interface InterviewInvitationModalProps {
  invitation: InterviewInvitation;
  onClose: () => void;
  onAccept?: (invitationId: string) => void;
  onDecline?: (invitationId: string) => void;
}

export default function InterviewInvitationModal({
  invitation,
  onClose,
  onAccept,
  onDecline,
}: InterviewInvitationModalProps) {
  const [loading, setLoading] = useState(false);
  const [actionTaken, setActionTaken] = useState<"accept" | "decline" | null>(null);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleAccept = async () => {
    setLoading(true);
    setActionTaken("accept");
    await new Promise((resolve) => setTimeout(resolve, 600));
    onAccept?.(invitation.id);
  };

  const handleDecline = async () => {
    setLoading(true);
    setActionTaken("decline");
    await new Promise((resolve) => setTimeout(resolve, 600));
    onDecline?.(invitation.id);
  };

  const getInterviewTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      phone_screen: "📞 Phone Screening",
      technical: "💻 Technical Interview",
      hr: "💼 HR Round",
      manager_round: "👔 Manager Round",
      final_round: "🏆 Final Round",
      group_discussion: "👥 Group Discussion",
    };
    return labels[type] || type;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Success Banner */}
        {actionTaken === "accept" && (
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
            <div>
              <p className="text-white font-bold">Interview Accepted!</p>
              <p className="text-emerald-100 text-sm">
                Check your email for confirmation details. Good luck! 🎉
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border-b border-slate-700 p-6 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600/30 to-teal-600/30 border border-emerald-500/30 rounded-xl flex items-center justify-center text-3xl">
              {invitation.companyAvatar}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-bold text-white">Interview Invitation!</h2>
              </div>
              <p className="text-slate-400">
                {invitation.companyName} • {invitation.jobTitle}
              </p>
              <p className="text-emerald-300 text-sm mt-2 font-medium">
                {getInterviewTypeLabel(invitation.interviewType)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-slate-700/50 hover:bg-slate-600 rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Interview Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date & Time */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Interview Date</p>
                  <p className="text-white font-semibold">{formatDate(invitation.scheduledDate)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <p className="text-blue-300 font-medium">{invitation.scheduledTime}</p>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">Duration: {invitation.estimatedDuration} minutes</p>
                </div>
              </div>
            </div>

            {/* Location/Format */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                {invitation.format === "virtual" ? (
                  <Video className="w-5 h-5 text-blue-400 mt-0.5" />
                ) : (
                  <MapPin className="w-5 h-5 text-red-400 mt-0.5" />
                )}
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">
                    {invitation.format === "virtual" ? "Meeting Link" : "Location"}
                  </p>
                  {invitation.format === "virtual" ? (
                    <a
                      href={invitation.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-medium break-all"
                    >
                      Join Video Call
                    </a>
                  ) : (
                    <p className="text-white font-semibold">{invitation.location}</p>
                  )}
                  <p className="text-slate-400 text-xs mt-2 capitalize">
                    {invitation.format === "hybrid" ? "In-person or Virtual" : invitation.format}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interviewer Info */}
          <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-700/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-purple-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-purple-300 text-sm font-medium mb-2">Your Interviewer</p>
                <p className="text-white font-semibold">{invitation.interviewer.name}</p>
                <p className="text-purple-200/70">{invitation.interviewer.title}</p>
                <div className="flex gap-3 mt-2">
                  <a
                    href={`mailto:${invitation.interviewer.email}`}
                    className="inline-flex items-center gap-1 text-purple-300 hover:text-purple-200 text-sm font-medium"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                  {invitation.interviewer.linkedinProfile && (
                    <a
                      href={`https://${invitation.interviewer.linkedinProfile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-purple-300 hover:text-purple-200 text-sm font-medium"
                    >
                      <User className="w-4 h-4" />
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              About This Interview
            </h3>
            <p className="text-slate-300 leading-relaxed">{invitation.description}</p>
          </div>

          {/* What to Expect */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">What to Expect</h3>
            <div className="space-y-2">
              {invitation.whatToExpect.map((item, idx) => (
                <div key={idx} className="flex gap-3 text-slate-300">
                  <span className="text-purple-400 font-semibold flex-shrink-0">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preparation Tips */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">How to Prepare</h3>
            <div className="space-y-2">
              {invitation.preprationTips.map((tip, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-5 h-5 bg-gradient-to-br from-emerald-600/30 to-teal-600/30 border border-emerald-500/40 rounded flex items-center justify-center flex-shrink-0 text-xs text-emerald-300 font-bold">
                    {idx + 1}
                  </div>
                  <span className="text-slate-300 pt-0.5">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements Checklist */}
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FileCheck className="w-5 h-5 text-blue-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-blue-300 font-semibold mb-3">What You'll Need</p>
                <div className="space-y-2">
                  {invitation.requirementsChecklist.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-blue-200/90">
                      <div className="w-4 h-4 rounded border border-blue-500/50 flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />
                      </div>
                      <span className="text-sm">{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pro Tip */}
          <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-4">
            <p className="text-amber-200 text-sm">
              <span className="font-semibold">💡 Pro Tip:</span> Prepare 2-3 thoughtful questions about the role,
              team, and company culture. This shows genuine interest and helps you evaluate if it's the right fit.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-900/50 border-t border-slate-700 p-6 flex gap-3">
          {actionTaken === "accept" ? (
            <button
              onClick={onClose}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-all"
            >
              Continue
            </button>
          ) : (
            <>
              <button
                onClick={handleAccept}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                {loading ? "Accepting..." : "Accept Interview"}
              </button>

              <button
                onClick={handleDecline}
                disabled={loading}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && actionTaken === "decline" ? "Declining..." : "Decline"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
